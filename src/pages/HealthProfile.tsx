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
  ArrowLeft,
  CheckCircle2,
  Heart,
  HeartPulse,
  Info,
  Loader2,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import type { HealthProfile as HealthProfileType } from "../types/HealthProfile";
import { syncEmergencyProfile } from "../utils/syncEmergencyProfile";

const initialProfile: HealthProfileType = {
  fullName: "",
  dateOfBirth: "",
  gender: "",
  bloodGroup: "",
  phone: "",
  address: "",
  allergies: "",
  medicalConditions: "",
  medications: "",
  emergencyContactName: "",
  emergencyContactRelation: "",
  emergencyContactPhone: "",
};

function HealthProfile() {
  const { user } = useAuth();

  const [profile, setProfile] =
    useState<HealthProfileType>(initialProfile);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const profileRef = doc(
          db,
          "healthProfiles",
          user.uid
        );

        const profileSnapshot =
          await getDoc(profileRef);

        if (profileSnapshot.exists()) {
          setProfile(
            profileSnapshot.data() as HealthProfileType
          );
        } else {
          setProfile((current) => ({
            ...current,
            fullName: user.displayName || "",
          }));
        }
      } catch (error) {
        console.error(error);

        setError(
          "Unable to load your health profile. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));

    if (message) {
      setMessage("");
    }

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!user) return;

    setMessage("");
    setError("");

    try {
      setSaving(true);

      await setDoc(
        doc(
          db,
          "healthProfiles",
          user.uid
        ),
        {
          ...profile,
          userId: user.uid,
          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        }
      );

      await syncEmergencyProfile(user.uid);

      setMessage(
        "Health profile saved successfully. Your emergency QR information has also been updated."
      );
    } catch (error) {
      console.error(error);

      setError(
        "Unable to save your health profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <Loader2
            size={40}
            className="mx-auto animate-spin text-blue-600"
          />

          <p className="mt-4 font-medium text-slate-500">
            Loading your health profile...
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

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <UserRound size={28} />
            </div>

            <div>

              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                Health Profile
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Your emergency health information
              </h1>

              <p className="mt-2 max-w-2xl leading-6 text-slate-500">
                Keep your medical information accurate and
                up to date so the details you choose to share
                are available during an emergency.
              </p>

            </div>

          </div>

          {/* Privacy Information */}

          <div className="mt-6 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">

            <ShieldCheck
              size={21}
              className="mt-0.5 shrink-0 text-blue-600"
            />

            <p className="text-sm leading-6 text-blue-800">
              Your complete health profile is private.
              Only the information enabled in your Privacy
              Controls is included in your public emergency
              QR profile.
            </p>

          </div>

        </div>

        {/* Success Message */}

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

        {/* Error Message */}

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

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >

          {/* Personal Information */}

          <ProfileSection
            icon={<UserRound size={24} />}
            title="Personal Information"
            description="Basic information used to identify you during an emergency."
          >

            <div className="grid gap-5 md:grid-cols-2">

              <Input
                label="Full Name"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

              <Input
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={profile.dateOfBirth}
                onChange={handleChange}
              />

              <Select
                label="Gender"
                name="gender"
                value={profile.gender}
                onChange={handleChange}
                options={[
                  "Male",
                  "Female",
                  "Other",
                  "Prefer not to say",
                ]}
              />

              <Select
                label="Blood Group"
                name="bloodGroup"
                value={profile.bloodGroup}
                onChange={handleChange}
                options={[
                  "A+",
                  "A-",
                  "B+",
                  "B-",
                  "AB+",
                  "AB-",
                  "O+",
                  "O-",
                ]}
              />

              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />

              <Input
                label="Address"
                name="address"
                value={profile.address}
                onChange={handleChange}
                placeholder="Enter your address"
              />

            </div>

          </ProfileSection>

          {/* Medical Information */}

          <ProfileSection
            icon={<Heart size={24} />}
            title="Medical Information"
            description="Add critical medical details that may help responders understand your health needs."
          >

            <div className="space-y-5">

              <TextArea
                label="Allergies"
                name="allergies"
                value={profile.allergies}
                onChange={handleChange}
                placeholder="Example: Penicillin, peanuts, shellfish"
                helperText="Include medicine, food, or other serious allergies."
              />

              <TextArea
                label="Medical Conditions"
                name="medicalConditions"
                value={profile.medicalConditions}
                onChange={handleChange}
                placeholder="Example: Asthma, diabetes"
                helperText="List ongoing medical conditions that may be important during an emergency."
              />

              <TextArea
                label="Current Medications"
                name="medications"
                value={profile.medications}
                onChange={handleChange}
                placeholder="Example: Metformin 500 mg"
                helperText="List important medications you are currently taking."
              />

            </div>

          </ProfileSection>

          {/* Emergency Contact */}

          <ProfileSection
            icon={<Phone size={24} />}
            title="Emergency Contact"
            description="Add someone who can be contacted if you need emergency assistance."
          >

            <div className="grid gap-5 md:grid-cols-2">

              <Input
                label="Contact Name"
                name="emergencyContactName"
                value={
                  profile.emergencyContactName
                }
                onChange={handleChange}
                placeholder="Enter contact name"
              />

              <Input
                label="Relationship"
                name="emergencyContactRelation"
                value={
                  profile.emergencyContactRelation
                }
                onChange={handleChange}
                placeholder="Example: Parent, sibling"
              />

              <div className="md:col-span-2">

                <Input
                  label="Emergency Contact Phone"
                  name="emergencyContactPhone"
                  type="tel"
                  value={
                    profile.emergencyContactPhone
                  }
                  onChange={handleChange}
                  placeholder="Enter emergency contact number"
                />

              </div>

            </div>

          </ProfileSection>

          {/* Save Section */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6">

            <div className="flex items-start gap-3">

              <Info
                size={20}
                className="mt-0.5 shrink-0 text-slate-400"
              />

              <p className="text-sm leading-6 text-slate-500">
                Saving your profile will also update the
                information currently available through your
                emergency QR according to your privacy settings.
              </p>

            </div>

            <button
              type="submit"
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
                  Save Profile
                </>
              )}

            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

/*
  Reusable Profile Section
*/

function ProfileSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (

    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-5">

        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            {icon}
          </div>

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              {title}
            </h2>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              {description}
            </p>

          </div>

        </div>

      </div>

      <div className="p-6">
        {children}
      </div>

    </section>

  );
}

/*
  Reusable Input
*/

function Input({
  label,
  required,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (

    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}

      </label>

      <input
        {...props}
        required={required}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />

    </div>

  );
}

/*
  Reusable Text Area
*/

function TextArea({
  label,
  helperText,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  helperText?: string;
}) {
  return (

    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <textarea
        {...props}
        rows={3}
        className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />

      {helperText && (

        <p className="mt-2 text-xs leading-5 text-slate-500">
          {helperText}
        </p>

      )}

    </div>

  );
}

/*
  Reusable Select
*/

function Select({
  label,
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: string[];
}) {
  return (

    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        {...props}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      >

        <option value="">
          Select {label}
        </option>

        {options.map((option) => (

          <option
            key={option}
            value={option}
          >
            {option}
          </option>

        ))}

      </select>

    </div>

  );
}

export default HealthProfile;