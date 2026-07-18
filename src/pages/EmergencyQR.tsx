import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

import { QRCodeSVG } from "qrcode.react";

import {
  AlertCircle,
  ArrowLeft,
  Download,
  ExternalLink,
  HeartPulse,
  Info,
  Loader2,
  QrCode,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import { syncEmergencyProfile } from "../utils/syncEmergencyProfile";

function EmergencyQR() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQRCode() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        /*
          Check whether the user has created
          a health profile.
        */

        const healthSnapshot = await getDoc(
          doc(
            db,
            "healthProfiles",
            user.uid
          )
        );

        if (!healthSnapshot.exists()) {
          setError(
            "Please complete your health profile before generating your emergency QR code."
          );

          return;
        }

        /*
          Create or update the public
          emergency profile.
        */

        const emergencyProfileId =
          await syncEmergencyProfile(
            user.uid
          );

        if (!emergencyProfileId) {
          setError(
            "Unable to create your emergency profile."
          );

          return;
        }

        /*
          Use the permanent emergency profile ID
          to generate the QR code.
        */

        setProfileId(
          emergencyProfileId
        );

      } catch (error) {
        console.error(error);

        setError(
          "Unable to generate your emergency QR code. Please try again."
        );

      } finally {
        setLoading(false);
      }
    }

    loadQRCode();
  }, [user]);

  /*
    URL stored inside the QR code.
  */

  const emergencyUrl = profileId
    ? `${window.location.origin}/emergency/${profileId}`
    : "";

  /*
    Download QR code as PNG.
  */

  const downloadQRCode = () => {
    const svg =
      document.getElementById(
        "emergency-qr"
      );

    if (!svg) return;

    const svgData =
      new XMLSerializer().serializeToString(
        svg
      );

    const canvas =
      document.createElement("canvas");

    const context =
      canvas.getContext("2d");

    const image = new Image();

    image.onload = () => {
      canvas.width = 1000;
      canvas.height = 1000;

      if (!context) return;

      context.fillStyle = "white";

      context.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      context.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const downloadLink =
        document.createElement("a");

      downloadLink.download =
        "qrx-emergency-qr.png";

      downloadLink.href =
        canvas.toDataURL(
          "image/png"
        );

      downloadLink.click();
    };

    image.src =
      "data:image/svg+xml;base64," +
      btoa(
        unescape(
          encodeURIComponent(
            svgData
          )
        )
      );
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
            Preparing your emergency QR...
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

        {/* Page Header */}

        <div className="text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <QrCode size={34} />
          </div>

          <p className="mt-5 text-sm font-bold uppercase tracking-wider text-blue-600">
            Emergency QR
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Your Emergency QR Code
          </h1>

          <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-500">
            Your QR code provides quick access to the
            emergency medical information you have chosen
            to share through your privacy settings.
          </p>

        </div>

        {/* Error */}

        {error ? (

          <div className="mx-auto mt-8 max-w-2xl">

            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">

              <AlertCircle
                size={22}
                className="mt-0.5 shrink-0"
              />

              <div>

                <p className="font-bold">
                  Unable to prepare your QR code
                </p>

                <p className="mt-1 text-sm leading-6">
                  {error}
                </p>

              </div>

            </div>

            <Link
              to="/health-profile"
              className="mt-5 flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white transition hover:bg-blue-700"
            >
              Go to Health Profile
            </Link>

          </div>

        ) : (

          <div className="mx-auto mt-10 grid max-w-4xl gap-6 lg:grid-cols-[1fr_0.8fr]">

            {/* QR Card */}

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">

              {/* Active Badge */}

              <div className="flex justify-center">

                <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">

                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  Emergency profile ready

                </div>

              </div>

              {/* QR */}

              <div className="mt-6 flex justify-center">

                <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

                  <QRCodeSVG
                    id="emergency-qr"
                    value={emergencyUrl}
                    size={230}
                    level="H"
                  />

                </div>

              </div>

              <div className="mt-6 text-center">

                <h2 className="text-xl font-bold text-slate-900">
                  Scan for emergency information
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Anyone with this QR code can open your
                  public emergency profile without signing
                  in.
                </p>

              </div>

              {/* Download */}

              <button
                type="button"
                onClick={downloadQRCode}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700"
              >

                <Download size={19} />

                Download QR Code

              </button>

              {/* Preview */}

              <a
                href={emergencyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 font-bold text-slate-700 transition hover:bg-slate-50 hover:text-blue-600"
              >

                <ExternalLink size={18} />

                Preview Emergency Profile

              </a>

            </section>

            {/* Information Column */}

            <div className="space-y-5">

              {/* How It Works */}

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Smartphone size={22} />
                  </div>

                  <div>

                    <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
                      How it works
                    </p>

                    <h2 className="font-bold text-slate-900">
                      One scan, quick access
                    </h2>

                  </div>

                </div>

                <div className="mt-6 space-y-5">

                  <QRStep
                    number="1"
                    text="An emergency responder scans your QR code."
                  />

                  <QRStep
                    number="2"
                    text="Your public emergency profile opens instantly."
                  />

                  <QRStep
                    number="3"
                    text="Only information allowed by your privacy settings is displayed."
                  />

                </div>

              </section>

              {/* Privacy */}

              <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5">

                <div className="flex items-start gap-3">

                  <ShieldCheck
                    size={22}
                    className="mt-0.5 shrink-0 text-blue-600"
                  />

                  <div>

                    <p className="font-bold text-blue-900">
                      You control what is shared
                    </p>

                    <p className="mt-1 text-sm leading-6 text-blue-800">
                      Changes made in Privacy Controls are
                      reflected in your emergency profile
                      while this QR code continues using the
                      same permanent link.
                    </p>

                    <Link
                      to="/privacy"
                      className="mt-3 inline-flex font-bold text-blue-700 hover:text-blue-800"
                    >
                      Manage Privacy Controls
                    </Link>

                  </div>

                </div>

              </section>

              {/* Usage Notice */}

              <section className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5">

                <Info
                  size={21}
                  className="mt-0.5 shrink-0 text-slate-400"
                />

                <p className="text-sm leading-6 text-slate-500">
                  You can save the downloaded QR code on
                  your phone or use it on an emergency card.
                  Test the QR after downloading it to make
                  sure it scans correctly.
                </p>

              </section>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

function QRStep({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
        {number}
      </div>

      <p className="pt-0.5 text-sm leading-6 text-slate-600">
        {text}
      </p>

    </div>
  );
}

export default EmergencyQR;