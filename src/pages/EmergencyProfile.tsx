import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import {
  AlertTriangle,
  HeartPulse,
  Loader2,
  Phone,
  Pill,
  ShieldAlert,
  ShieldOff,
  Stethoscope,

} from "lucide-react";

import { db } from "../lib/firebase";

interface EmergencyProfileData {
  ownerId: string;
  fullName: string;
  isActive : boolean;
  expiresAt?: Timestamp;
  bloodGroup?: string;
  allergies?: string;
  medicalConditions?: string;
  medications?: string;
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;
}

function EmergencyProfile() {
  const { profileId } = useParams();
  const accessLogged = useRef(false);

  const [profile, setProfile] =
    useState<EmergencyProfileData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEmergencyProfile() {
      if (!profileId) {
        setError("Invalid emergency profile link.");
        setLoading(false);
        return;
      }

      try {
        // Get the public emergency profile
        const profileRef = doc(
          db,
          "emergencyProfiles",
          profileId
        );

        const profileSnapshot =
          await getDoc(profileRef);

        if (!profileSnapshot.exists()) {
          setError("Emergency profile not found.");
          return;
        }

        const profileData =
          profileSnapshot.data() as EmergencyProfileData;

        // Display the emergency profile
        setProfile(profileData);

        /*
          Record anonymous QR access.

          We only store:
          - Emergency profile ID
          - Profile owner's ID
          - Time of access

          The emergency profile will still load
          even if logging fails.
        */

        const isExpired =
  profileData.expiresAt &&
  profileData.expiresAt.toDate() <= new Date();

if (
  profileData.isActive !== false &&
  !isExpired &&
  !accessLogged.current
) {
  accessLogged.current = true;

  try {
    await addDoc(
      collection(db, "qrAccessLogs"),
      {
        profileId,
        ownerId: profileData.ownerId,
        accessedAt: serverTimestamp(),
      }
    );
  } catch (logError) {
    // Allow another attempt if logging failed
    accessLogged.current = false;

    console.error(
      "Unable to record QR access:",
      logError
    );
  }
}
        

      } catch (error) {
        console.error(error);

        setError(
          "Unable to load the emergency profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadEmergencyProfile();
  }, [profileId]);

  /*
    Loading Screen
  */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <Loader2
            size={40}
            className="mx-auto animate-spin text-red-600"
          />

          <p className="mt-4 text-slate-500">
            Loading emergency information...
          </p>

        </div>

      </div>
    );
  }

  /*
    Error Screen
  */
 if (profile?.isActive === false) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">

      <div className="max-w-md text-center">

        <ShieldOff
          size={60}
          className="mx-auto text-slate-400"
        />

        <h1 className="mt-5 text-2xl font-bold text-slate-900">
          Emergency Profile Unavailable
        </h1>

        <p className="mt-3 leading-6 text-slate-500">
          This emergency QR profile has been temporarily
          deactivated by its owner.
        </p>

      </div>

    </div>
  );
}

  if (
  profile?.expiresAt &&
  profile.expiresAt.toDate() <= new Date()
) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <div className="max-w-md text-center">

        <AlertTriangle
          size={60}
          className="mx-auto text-amber-500"
        />

        <h1 className="mt-5 text-2xl font-bold text-slate-900">
          Emergency QR Expired
        </h1>

        <p className="mt-3 leading-6 text-slate-500">
          This emergency profile is no longer available
          because its access period has expired.
        </p>

      </div>
    </div>
  );
}

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">

        <div className="max-w-md text-center">

          <AlertTriangle
            size={50}
            className="mx-auto text-red-500"
          />

          <h1 className="mt-5 text-2xl font-bold">
            Profile unavailable
          </h1>

          <p className="mt-2 text-slate-500">
            {error}
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Emergency Header */}

      <header className="bg-red-600 text-white">

        <div className="mx-auto max-w-3xl px-5 py-6">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-white/20 p-3">
              <HeartPulse size={30} />
            </div>

            <div>

              <p className="text-sm font-semibold uppercase tracking-wider text-red-100">
                QRx Emergency Profile
              </p>

              <h1 className="text-2xl font-bold">
                Emergency Medical Information
              </h1>

            </div>

          </div>

        </div>

      </header>

      {/* Emergency Information */}

      <main className="mx-auto max-w-3xl space-y-5 px-5 py-8">

        {/* Patient Information */}

        <section className="rounded-2xl bg-white p-6 shadow-sm">

          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Patient
          </p>

          <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <h2 className="text-3xl font-bold text-slate-900">
              {profile.fullName}
            </h2>

            {/* Blood Group */}

            {profile.bloodGroup !== undefined && (

              <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-red-100 px-5 py-3 text-red-700">

                <span className="text-sm font-semibold">
                  Blood Group
                </span>

                <span className="text-2xl font-black">
                  {profile.bloodGroup || "N/A"}
                </span>

              </div>

            )}

          </div>

        </section>

        {/* Allergies */}

        {profile.allergies !== undefined && (

          <EmergencyCard
            icon={<ShieldAlert size={25} />}
            title="Allergies"
            value={profile.allergies}
            critical
          />

        )}

        {/* Medical Conditions */}

        {profile.medicalConditions !== undefined && (

          <EmergencyCard
            icon={<Stethoscope size={25} />}
            title="Medical Conditions"
            value={profile.medicalConditions}
          />

        )}

        {/* Medications */}

        {profile.medications !== undefined && (

          <EmergencyCard
            icon={<Pill size={25} />}
            title="Current Medications"
            value={profile.medications}
          />

        )}

        {/* Emergency Contact */}

        {profile.emergencyContactName !== undefined && (

          <section className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-green-100 p-3 text-green-700">

                <Phone size={25} />

              </div>

              <div>

                <p className="text-sm text-slate-500">
                  Emergency Contact
                </p>

                <h2 className="text-xl font-bold">
                  {profile.emergencyContactName ||
                    "Not provided"}
                </h2>

              </div>

            </div>

            {/* Contact Relationship */}

            {profile.emergencyContactRelation && (

              <p className="mt-4 text-slate-500">

                Relationship:{" "}

                <span className="font-medium text-slate-700">
                  {profile.emergencyContactRelation}
                </span>

              </p>

            )}

            {/* Call Emergency Contact */}

            {profile.emergencyContactPhone && (

              <a
                href={`tel:${profile.emergencyContactPhone}`}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-4 font-bold text-white hover:bg-green-700"
              >

                <Phone size={21} />

                Call{" "}
                {profile.emergencyContactName ||
                  "Emergency Contact"}

              </a>

            )}

          </section>

        )}

        {/* Footer */}

        <div className="py-5 text-center">

          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-500">

            <HeartPulse size={18} />

            Powered by QRx Smart Health Aid

          </div>

          <p className="mx-auto mt-2 max-w-lg text-xs leading-5 text-slate-400">

            This information is provided by the profile owner
            for emergency assistance. Verify critical medical
            information whenever possible.

          </p>

        </div>

      </main>

    </div>
  );
}

/*
  Reusable Emergency Information Card
*/

function EmergencyCard({
  icon,
  title,
  value,
  critical = false,
}: {
  icon: React.ReactNode;
  title: string;
  value?: string;
  critical?: boolean;
}) {
  return (

    <section
      className={`rounded-2xl border p-6 shadow-sm ${
        critical
          ? "border-red-200 bg-red-50"
          : "border-slate-200 bg-white"
      }`}
    >

      <div className="flex items-start gap-4">

        <div
          className={`rounded-xl p-3 ${
            critical
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >

          {icon}

        </div>

        <div>

          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-lg font-medium text-slate-900">
            {value || "Not provided"}
          </p>

        </div>

      </div>

    </section>

  );
}

export default EmergencyProfile;