import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  deleteField,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

import {
  AlertCircle,
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock3,
  HeartPulse,
  Info,
  Loader2,
  Power,
  QrCode,
  ShieldCheck,
  ShieldOff,
  Trash2,
} from "lucide-react";

import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { syncEmergencyProfile } from "../utils/syncEmergencyProfile";

function QRStatus() {
  const { user } = useAuth();

  const [profileId, setProfileId] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [expiryDate, setExpiryDate] = useState("");
  const [savedExpiryDate, setSavedExpiryDate] =
    useState("");

  const [savingExpiry, setSavingExpiry] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  /*
    Check whether the saved expiry date
    has already passed.
  */

  const isExpired =
    Boolean(savedExpiryDate) &&
    new Date(savedExpiryDate).getTime() <=
      Date.now();

  /*
    Load QR status and expiry information.
  */

  useEffect(() => {
    async function loadQRStatus() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        /*
          Get or synchronize the user's
          emergency profile.
        */

        const emergencyProfileId =
          await syncEmergencyProfile(
            user.uid
          );

        if (!emergencyProfileId) {
          setError(
            "Please complete your health profile first."
          );

          return;
        }

        setProfileId(
          emergencyProfileId
        );

        /*
          Load QR status and expiry.
        */

        const emergencySnapshot =
          await getDoc(
            doc(
              db,
              "emergencyProfiles",
              emergencyProfileId
            )
          );

        if (emergencySnapshot.exists()) {
          const emergencyData =
            emergencySnapshot.data();

          setIsActive(
            emergencyData.isActive !== false
          );

          if (emergencyData.expiresAt) {
            const expiresAt =
              emergencyData.expiresAt as Timestamp;

            /*
              Convert Firestore Timestamp into
              datetime-local format using local time.
            */

            const expiry =
              expiresAt.toDate();

            const offset =
              expiry.getTimezoneOffset() *
              60 *
              1000;

            const formattedDate =
              new Date(
                expiry.getTime() - offset
              )
                .toISOString()
                .slice(0, 16);

            setExpiryDate(
              formattedDate
            );

            setSavedExpiryDate(
              formattedDate
            );
          }
        }

      } catch (error) {
        console.error(error);

        setError(
          "Unable to load your QR status."
        );

      } finally {
        setLoading(false);
      }
    }

    loadQRStatus();
  }, [user]);

  /*
    Activate or deactivate QR.
  */

  const toggleQRStatus = async () => {
    if (!profileId) return;

    try {
      setUpdating(true);

      setMessage("");
      setError("");

      const newStatus =
        !isActive;

      await updateDoc(
        doc(
          db,
          "emergencyProfiles",
          profileId
        ),
        {
          isActive: newStatus,
        }
      );

      setIsActive(
        newStatus
      );

      setMessage(
        newStatus
          ? "Your emergency QR is now active."
          : "Your emergency QR has been deactivated."
      );

    } catch (error) {
      console.error(error);

      setError(
        "Unable to update your QR status."
      );

    } finally {
      setUpdating(false);
    }
  };

  /*
    Save automatic expiry date.
  */

  const saveExpiryDate = async () => {
    if (!profileId) {
      setError(
        "Emergency profile not found."
      );
      return;
    }

    if (!expiryDate) {
      setError(
        "Please select an expiry date and time."
      );
      return;
    }

    try {
      setSavingExpiry(true);

      setError("");
      setMessage("");

      const selectedDate =
        new Date(expiryDate);

      /*
        Check for invalid date.
      */

      if (
        Number.isNaN(
          selectedDate.getTime()
        )
      ) {
        setError(
          "Please select a valid expiry date and time."
        );
        return;
      }

      /*
        Expiry must be in the future.
      */

      if (
        selectedDate.getTime() <=
        Date.now()
      ) {
        setError(
          "Please select a future date and time."
        );
        return;
      }

      /*
        Save expiry date to Firestore.
      */

      await updateDoc(
        doc(
          db,
          "emergencyProfiles",
          profileId
        ),
        {
          expiresAt:
            Timestamp.fromDate(
              selectedDate
            ),
        }
      );

      setSavedExpiryDate(
        expiryDate
      );

      setMessage(
        "Emergency QR expiry date saved successfully."
      );

    } catch (error) {
      console.error(
        "Expiry save error:",
        error
      );

      setError(
        "Unable to save the QR expiry date."
      );

    } finally {
      setSavingExpiry(false);
    }
  };

  /*
    Remove automatic expiry.
  */

  const removeExpiryDate = async () => {
    if (!profileId) return;

    try {
      setSavingExpiry(true);

      setError("");
      setMessage("");

      await updateDoc(
        doc(
          db,
          "emergencyProfiles",
          profileId
        ),
        {
          expiresAt:
            deleteField(),
        }
      );

      setExpiryDate("");
      setSavedExpiryDate("");

      setMessage(
        "QR expiry removed. Your QR will not expire automatically."
      );

    } catch (error) {
      console.error(error);

      setError(
        "Unable to remove the QR expiry date."
      );

    } finally {
      setSavingExpiry(false);
    }
  };

  /*
    Clear old messages when user
    changes the expiry date.
  */

  const handleExpiryChange = (
    value: string
  ) => {
    setExpiryDate(value);

    setMessage("");
    setError("");
  };

  /*
    Loading Screen
  */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <Loader2
            size={40}
            className="mx-auto animate-spin text-blue-600"
          />

          <p className="mt-4 font-medium text-slate-500">
            Loading your QR status...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}

      <nav className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">

          <Link
            to="/dashboard"
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
          >
            <ArrowLeft size={19} />
            Dashboard
          </Link>

          <Link
            to="/dashboard"
            className="flex items-center gap-2"
          >

            <div className="rounded-xl bg-blue-600 p-2 text-white">
              <HeartPulse size={22} />
            </div>

            <div className="hidden sm:block">

              <p className="font-bold leading-none text-blue-700">
                QRx
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Smart Health Aid
              </p>

            </div>

          </Link>

        </div>

      </nav>

      {/* Main */}

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">

        {/* Header */}

        <div className="text-center">

          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${
              !isActive
                ? "bg-red-100 text-red-700"
                : isExpired
                ? "bg-amber-100 text-amber-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            <QrCode size={34} />
          </div>

          <p className="mt-5 text-sm font-bold uppercase tracking-wider text-blue-600">
            QR Controls
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Emergency QR Status
          </h1>

          <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-500">
            Control access to your emergency profile and
            optionally choose when your QR should
            automatically expire.
          </p>

        </div>

        {/* Success Message */}

        {message && (

          <div
            role="status"
            className="mt-8 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700"
          >

            <CheckCircle2
              size={21}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm font-medium leading-6">
              {message}
            </p>

          </div>

        )}

        {/* Error Message */}

        {error && (

          <div
            role="alert"
            className="mt-8 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
          >

            <AlertCircle
              size={21}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm font-medium leading-6">
              {error}
            </p>

          </div>

        )}

        {profileId && (

          <div className="mt-8 space-y-6">

            {/* Current Status */}

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

              <div
                className={`h-1.5 ${
                  !isActive
                    ? "bg-red-500"
                    : isExpired
                    ? "bg-amber-500"
                    : "bg-green-500"
                }`}
              />

              <div className="p-6 sm:p-8">

                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${
                      !isActive
                        ? "bg-red-100 text-red-600"
                        : isExpired
                        ? "bg-amber-100 text-amber-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >

                    {!isActive ? (
                      <ShieldOff size={32} />
                    ) : isExpired ? (
                      <Clock3 size={32} />
                    ) : (
                      <ShieldCheck size={32} />
                    )}

                  </div>

                  <div className="flex-1">

                    <div
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                        !isActive
                          ? "bg-red-50 text-red-700"
                          : isExpired
                          ? "bg-amber-50 text-amber-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >

                      <span
                        className={`h-2 w-2 rounded-full ${
                          !isActive
                            ? "bg-red-500"
                            : isExpired
                            ? "bg-amber-500"
                            : "bg-green-500"
                        }`}
                      />

                      {!isActive
                        ? "Deactivated"
                        : isExpired
                        ? "Expired"
                        : "Active"}

                    </div>

                    <h2 className="mt-3 text-2xl font-bold text-slate-900">

                      {!isActive
                        ? "QR Profile Deactivated"
                        : isExpired
                        ? "QR Profile Expired"
                        : "QR Profile Active"}

                    </h2>

                    <p className="mt-2 max-w-xl leading-6 text-slate-500">

                      {!isActive
                        ? "Your emergency profile is currently unavailable to anyone scanning your QR code."
                        : isExpired
                        ? "The expiry date for this emergency QR has passed, so your emergency profile is no longer accessible through the QR link."
                        : "Anyone with your emergency QR link can currently view the information you have chosen to share."}

                    </p>

                  </div>

                </div>

                {/* Active / Deactivate Button */}

                <button
                  type="button"
                  onClick={toggleQRStatus}
                  disabled={updating}
                  className={`mt-7 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    isActive
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >

                  {updating ? (
                    <>
                      <Loader2
                        size={20}
                        className="animate-spin"
                      />

                      Updating...
                    </>
                  ) : (
                    <>
                      <Power size={20} />

                      {isActive
                        ? "Deactivate Emergency QR"
                        : "Activate Emergency QR"}
                    </>
                  )}

                </button>

              </div>

            </section>

            {/* Automatic Expiry */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <CalendarClock size={25} />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Automatic QR Expiry
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Optionally set a date and time after
                    which your emergency profile should no
                    longer be accessible through this QR
                    code.
                  </p>

                </div>

              </div>

              {/* Saved Expiry Status */}

              {savedExpiryDate && (

                <div
                  className={`mt-6 flex items-start gap-3 rounded-xl border p-4 ${
                    isExpired
                      ? "border-amber-200 bg-amber-50"
                      : "border-blue-100 bg-blue-50"
                  }`}
                >

                  <Clock3
                    size={20}
                    className={`mt-0.5 shrink-0 ${
                      isExpired
                        ? "text-amber-600"
                        : "text-blue-600"
                    }`}
                  />

                  <div>

                    <p
                      className={`text-sm font-bold ${
                        isExpired
                          ? "text-amber-900"
                          : "text-blue-900"
                      }`}
                    >
                      {isExpired
                        ? "This QR has expired"
                        : "Automatic expiry scheduled"}
                    </p>

                    <p
                      className={`mt-1 text-sm ${
                        isExpired
                          ? "text-amber-700"
                          : "text-blue-700"
                      }`}
                    >
                      {new Date(
                        savedExpiryDate
                      ).toLocaleString()}
                    </p>

                  </div>

                </div>

              )}

              {/* Date Input */}

              <div className="mt-6">

                <label
                  htmlFor="qr-expiry"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Expiry date and time
                </label>

                <input
                  id="qr-expiry"
                  type="datetime-local"
                  value={expiryDate}
                  onChange={(event) =>
                    handleExpiryChange(
                      event.target.value
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* Save Expiry */}

              <button
                type="button"
                onClick={saveExpiryDate}
                disabled={savingExpiry}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {savingExpiry ? (
                  <>
                    <Loader2
                      size={19}
                      className="animate-spin"
                    />

                    Saving...
                  </>
                ) : (
                  <>
                    <CalendarClock size={19} />

                    Save Expiry Date
                  </>
                )}

              </button>

              {/* Remove Expiry */}

              {savedExpiryDate && (

                <button
                  type="button"
                  onClick={removeExpiryDate}
                  disabled={savingExpiry}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3.5 font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <Trash2 size={18} />

                  Remove Automatic Expiry

                </button>

              )}

              {/* Information */}

              <div className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 p-4">

                <Info
                  size={20}
                  className="mt-0.5 shrink-0 text-slate-400"
                />

                <p className="text-sm leading-6 text-slate-500">
                  Setting an expiry does not delete your QR
                  code or medical information. You can
                  remove or change the expiry date later.
                </p>

              </div>

            </section>

          </div>

        )}

      </main>

    </div>
  );
}

export default QRStatus;