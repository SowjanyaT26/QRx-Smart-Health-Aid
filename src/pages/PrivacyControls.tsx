import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  HeartPulse,
  Info,
  Loader2,
  Save,
  ShieldCheck,
} from "lucide-react";

import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { syncEmergencyProfile } from "../utils/syncEmergencyProfile";

interface PrivacySettings {
  showBloodGroup: boolean;
  showAllergies: boolean;
  showMedicalConditions: boolean;
  showMedications: boolean;
  showEmergencyContact: boolean;
}

const defaultSettings: PrivacySettings = {
  showBloodGroup: true,
  showAllergies: true,
  showMedicalConditions: true,
  showMedications: true,
  showEmergencyContact: true,
};

function PrivacyControls() {
  const { user } = useAuth();

  const [settings, setSettings] =
    useState<PrivacySettings>(defaultSettings);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSettings() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const settingsRef = doc(
          db,
          "privacySettings",
          user.uid
        );

        const snapshot =
          await getDoc(settingsRef);

        if (snapshot.exists()) {
          setSettings({
            ...defaultSettings,
            ...(snapshot.data() as PrivacySettings),
          });
        }
      } catch (error) {
        console.error(error);

        setError(
          "Unable to load your privacy settings. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, [user]);

  const toggleSetting = (
    key: keyof PrivacySettings
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));

    if (message) {
      setMessage("");
    }

    if (error) {
      setError("");
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    setMessage("");
    setError("");

    try {
      setSaving(true);

      await setDoc(
        doc(
          db,
          "privacySettings",
          user.uid
        ),
        {
          ...settings,
          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        }
      );

      await syncEmergencyProfile(user.uid);

      setMessage(
        "Privacy settings saved successfully. Your emergency QR profile has been updated."
      );
    } catch (error) {
      console.error(error);

      setError(
        "Unable to save your privacy settings. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const visibleCount =
    Object.values(settings).filter(Boolean).length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <Loader2
            size={40}
            className="mx-auto animate-spin text-blue-600"
          />

          <p className="mt-4 font-medium text-slate-500">
            Loading your privacy settings...
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

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">

        {/* Header */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <ShieldCheck size={29} />
            </div>

            <div className="flex-1">

              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                Privacy Controls
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Control your emergency information
              </h1>

              <p className="mt-2 max-w-2xl leading-6 text-slate-500">
                Choose exactly which medical details are
                included when someone accesses your
                emergency profile through your QR code.
              </p>

            </div>

          </div>

          {/* Current Visibility Summary */}

          <div className="mt-6 flex flex-col gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-3">

              <Eye
                size={21}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>

                <p className="font-semibold text-blue-900">
                  Emergency profile visibility
                </p>

                <p className="mt-1 text-sm text-blue-700">
                  {visibleCount} of 5 information categories
                  are currently selected for sharing.
                </p>

              </div>

            </div>

            <div className="w-fit rounded-full bg-blue-600 px-3 py-1.5 text-xs font-bold text-white">
              {visibleCount-1}/5 visible
            </div>

          </div>

        </div>

        {/* Success */}

        {message && (

          <div
            role="status"
            className="mt-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700"
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

        {/* Error */}

        {error && (

          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
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

        {/* Privacy Settings */}

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-5">

            <h2 className="text-lg font-bold text-slate-900">
              Emergency Profile Information
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              Turn each category on or off depending on
              whether you want it included in your public
              emergency profile.
            </p>

          </div>

          <PrivacyOption
            title="Blood Group"
            description="Allow emergency responders to see your blood group."
            enabled={settings.showBloodGroup}
            onToggle={() =>
              toggleSetting("showBloodGroup")
            }
          />

          <PrivacyOption
            title="Allergies"
            description="Share important allergy information that may affect emergency treatment."
            enabled={settings.showAllergies}
            onToggle={() =>
              toggleSetting("showAllergies")
            }
          />

          <PrivacyOption
            title="Medical Conditions"
            description="Share existing medical conditions that may be relevant during an emergency."
            enabled={
              settings.showMedicalConditions
            }
            onToggle={() =>
              toggleSetting(
                "showMedicalConditions"
              )
            }
          />

          <PrivacyOption
            title="Current Medications"
            description="Share information about medications you are currently taking."
            enabled={settings.showMedications}
            onToggle={() =>
              toggleSetting("showMedications")
            }
          />

          <PrivacyOption
            title="Emergency Contact"
            description="Allow someone viewing your emergency profile to see and call your emergency contact."
            enabled={
              settings.showEmergencyContact
            }
            onToggle={() =>
              toggleSetting(
                "showEmergencyContact"
              )
            }
          />

        </section>

        {/* Important Notice */}

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">

          <AlertTriangle
            size={21}
            className="mt-0.5 shrink-0 text-amber-600"
          />

          <div>

            <p className="font-semibold text-amber-900">
              Consider emergency usefulness
            </p>

            <p className="mt-1 text-sm leading-6 text-amber-800">
              Information you hide will not appear when
              someone scans your emergency QR code.
              Consider keeping important medical details
              available if they could help during an
              emergency.
            </p>

          </div>

        </div>

        {/* Save Area */}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6">

          <div className="flex items-start gap-3">

            <Info
              size={20}
              className="mt-0.5 shrink-0 text-slate-400"
            />

            <p className="text-sm leading-6 text-slate-500">
              Changes only take effect after you save.
              Saving will immediately update the information
              available through your emergency QR profile.
            </p>

          </div>

          <button
            type="button"
            onClick={saveSettings}
            disabled={saving}
            className="mt-5 flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:mt-0 sm:w-auto"
          >

            {saving ? (
              <>
                <Loader2
                  size={20}
                  className="animate-spin"
                />

                Saving...
              </>
            ) : (
              <>
                <Save size={20} />

                Save Changes
              </>
            )}

          </button>

        </div>

      </main>

    </div>
  );
}

function PrivacyOption({
  title,
  description,
  enabled,
  onToggle,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-slate-100 p-5 last:border-none sm:p-6">

      <div className="flex min-w-0 gap-4">

        <div
          className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            enabled
              ? "bg-blue-100 text-blue-600"
              : "bg-slate-100 text-slate-400"
          }`}
        >

          {enabled ? (
            <Eye size={21} />
          ) : (
            <EyeOff size={21} />
          )}

        </div>

        <div>

          <div className="flex flex-wrap items-center gap-2">

            <h3 className="font-bold text-slate-900">
              {title}
            </h3>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                enabled
                  ? "bg-green-50 text-green-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {enabled ? "Visible" : "Hidden"}
            </span>

          </div>

          <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-500">
            {description}
          </p>

        </div>

      </div>

      {/* Toggle */}

      <button
        type="button"
        onClick={onToggle}
        aria-pressed={enabled}
        aria-label={`${enabled ? "Hide" : "Show"} ${title}`}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
          enabled
            ? "bg-blue-600"
            : "bg-slate-300"
        }`}
      >

        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
            enabled
              ? "left-5"
              : "left-1"
          }`}
        />

      </button>

    </div>
  );
}

export default PrivacyControls;