import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import {
  Activity,
  ArrowRight,
  CheckCircle2,
  FileText,
  HeartPulse,
  History,
  LogOut,
  Power,
  QrCode,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { auth, db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";

import type { HealthProfile } from "../types/HealthProfile";
import { calculateProfileCompletion } from "../utils/calculateProfileCompletion";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profileExists, setProfileExists] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  const [completionPercentage, setCompletionPercentage] =
    useState(0);

  const [missingFields, setMissingFields] =
    useState<string[]>([]);

  useEffect(() => {
    async function checkHealthProfile() {
      if (!user) {
        setCheckingProfile(false);
        return;
      }

      try {
        const profileSnapshot = await getDoc(
          doc(db, "healthProfiles", user.uid)
        );

        if (profileSnapshot.exists()) {
          setProfileExists(true);

          const profileData =
            profileSnapshot.data() as HealthProfile;

          const completion =
            calculateProfileCompletion(profileData);

          setCompletionPercentage(
            completion.percentage
          );

          setMissingFields(
            completion.missingFields
          );
        } else {
          setProfileExists(false);
          setCompletionPercentage(0);
          setMissingFields([]);
        }
      } catch (error) {
        console.error(
          "Unable to check health profile:",
          error
        );
      } finally {
        setCheckingProfile(false);
      }
    }

    checkHealthProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}

      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          {/* Logo */}

          <Link
            to="/dashboard"
            className="flex items-center gap-3"
          >

            <div className="rounded-xl bg-blue-600 p-2.5 text-white shadow-sm">
              <HeartPulse size={25} />
            </div>

            <div>

              <p className="text-xl font-bold leading-none text-blue-700">
                QRx
              </p>

              <p className="mt-1 text-xs font-medium text-slate-500">
                Smart Health Aid
              </p>

            </div>

          </Link>

          {/* Logout */}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:px-4"
          >

            <LogOut size={18} />

            <span className="hidden sm:inline">
              Logout
            </span>

          </button>

        </div>

      </nav>

      {/* Main Dashboard */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

        {/* Welcome Section */}

        <section>

          <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
            Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Welcome, {user?.displayName || "User"}!
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-500">
            Manage your emergency health information,
            privacy preferences, medical documents, and
            emergency QR profile from one place.
          </p>

        </section>

        {/* Main Profile Status */}

        <section className="relative mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white shadow-xl shadow-blue-900/10 sm:p-8">

          {/* Decorative background */}

          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/5" />

          <div className="absolute -bottom-24 right-24 h-52 w-52 rounded-full bg-white/5" />

          <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">

            <div>

              <div className="flex items-center gap-2">

                <Activity size={22} />

                <p className="font-semibold">
                  Emergency Profile Status
                </p>

              </div>

              {checkingProfile ? (

                <>

                  <h2 className="mt-4 text-2xl font-bold">
                    Checking your profile...
                  </h2>

                  <p className="mt-2 max-w-xl leading-6 text-blue-100">
                    Please wait while we check your
                    emergency health information.
                  </p>

                </>

              ) : profileExists ? (

                <>

                  <div className="mt-4 flex items-center gap-2">

                    <CheckCircle2
                      size={24}
                      className="text-green-300"
                    />

                    <h2 className="text-2xl font-bold">
                      Your emergency profile is ready
                    </h2>

                  </div>

                  <p className="mt-2 max-w-xl leading-6 text-blue-100">
                    Your health information has been saved.
                    You can manage your QR code, privacy,
                    and emergency access settings anytime.
                  </p>

                </>

              ) : (

                <>

                  <h2 className="mt-4 text-2xl font-bold">
                    Complete your health profile
                  </h2>

                  <p className="mt-2 max-w-xl leading-6 text-blue-100">
                    Add your critical medical information
                    before generating your emergency QR
                    profile.
                  </p>

                </>

              )}

            </div>

            <Link
              to="/health-profile"
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 font-bold text-blue-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-50"
            >

              {profileExists
                ? "Update Profile"
                : "Complete Profile"}

              <ArrowRight size={18} />

            </Link>

          </div>

        </section>

        {/* Profile Completion */}

        {profileExists && !checkingProfile && (

          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

              <div>

                <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                  Profile Completion
                </p>

                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  {completionPercentage === 100
                    ? "Your emergency profile is complete"
                    : "Complete your emergency information"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {completionPercentage === 100
                    ? "All important emergency information has been provided."
                    : `${missingFields.length} ${
                        missingFields.length === 1
                          ? "field is"
                          : "fields are"
                      } still missing from your profile.`}
                </p>

              </div>

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-50">

                <span className="text-2xl font-black text-blue-600">
                  {completionPercentage}%
                </span>

              </div>

            </div>

            {/* Progress Bar */}

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{
                  width: `${completionPercentage}%`,
                }}
              />

            </div>

            {/* Missing Fields */}

            {missingFields.length > 0 ? (

              <div className="mt-6 border-t border-slate-100 pt-5">

                <p className="text-sm font-semibold text-slate-700">
                  Missing information
                </p>

                <div className="mt-3 flex flex-wrap gap-2">

                  {missingFields.map((field) => (

                    <span
                      key={field}
                      className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700"
                    >
                      {field}
                    </span>

                  ))}

                </div>

                <Link
                  to="/health-profile"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-700"
                >
                  Complete Missing Information
                  <ArrowRight size={16} />
                </Link>

              </div>

            ) : (

              <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-5 text-sm font-semibold text-green-600">

                <CheckCircle2 size={19} />

                Your emergency health profile is fully complete.

              </div>

            )}

          </section>

        )}

        {/* Feature Section */}

        <section className="mt-10">

          <div>

            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Quick Access
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Manage your QRx profile
            </h2>

            <p className="mt-2 text-slate-500">
              Access all your emergency health tools and
              settings.
            </p>

          </div>

          {/* Feature Cards */}

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            <DashboardCard
              icon={<UserRound size={26} />}
              title="Health Profile"
              description="Add and manage your personal and critical medical information."
              action="Manage Profile"
              link="/health-profile"
            />

            <DashboardCard
              icon={<QrCode size={26} />}
              title="Emergency QR"
              description="Generate and download your personal emergency medical QR code."
              action="View QR Code"
              link="/emergency-qr"
            />

            <DashboardCard
              icon={<ShieldCheck size={26} />}
              title="Privacy Controls"
              description="Choose exactly which health information is visible through your QR."
              action="Manage Privacy"
              link="/privacy"
            />

            <DashboardCard
              icon={<History size={26} />}
              title="QR Access History"
              description="Review when your emergency health profile has been accessed."
              action="View Activity"
              link="/access-history"
            />

            <DashboardCard
              icon={<Power size={26} />}
              title="QR Status"
              description="Activate, deactivate, or manage the expiry of your emergency QR."
              action="Manage QR Status"
              link="/qr-status"
            />

            <DashboardCard
              icon={<FileText size={26} />}
              title="Medical Documents"
              description="Privately upload and manage your prescriptions and medical reports."
              action="Open Document Vault"
              link="/medical-documents"
            />

          </div>

        </section>

      </main>

      {/* Footer */}

      <footer className="mt-10 border-t border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-center text-sm text-slate-500 sm:px-6 lg:px-8">

          <div className="flex items-center justify-center gap-2 font-semibold text-slate-600">

            <HeartPulse size={17} />

            QRx Smart Health Aid

          </div>

          <p>
            Manage your emergency health information securely
            and responsibly.
          </p>

        </div>

      </footer>

    </div>
  );
}

/*
  Reusable Dashboard Feature Card
*/

function DashboardCard({
  icon,
  title,
  description,
  action,
  link,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  link: string;
}) {
  return (

    <Link
      to={link}
      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
    >

      <div className="inline-flex w-fit rounded-xl bg-blue-50 p-3 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">

        {icon}

      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 flex-1 leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-5 flex items-center gap-2 text-sm font-bold text-blue-600">

        {action}

        <ArrowRight
          size={17}
          className="transition-transform group-hover:translate-x-1"
        />

      </div>

    </Link>

  );
}

export default Dashboard;