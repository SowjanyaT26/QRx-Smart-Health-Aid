import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  HeartPulse,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { auth, db } from "../lib/firebase";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");

    const fullName = formData.fullName.trim();
    const email = formData.email.trim();

    if (!fullName) {
      setError("Please enter your full name.");
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          formData.password
        );

      await updateProfile(
        userCredential.user,
        {
          displayName: fullName,
        }
      );

      await setDoc(
        doc(
          db,
          "users",
          userCredential.user.uid
        ),
        {
          uid: userCredential.user.uid,
          fullName,
          email,
          createdAt: serverTimestamp(),
        }
      );

      navigate("/dashboard");

    } catch (err: unknown) {
      console.error(err);

      const firebaseError =
        err as { code?: string };

      if (
        firebaseError.code ===
        "auth/email-already-in-use"
      ) {
        setError(
          "An account already exists with this email address. Please sign in instead."
        );

      } else if (
        firebaseError.code ===
        "auth/invalid-email"
      ) {
        setError(
          "Please enter a valid email address."
        );

      } else if (
        firebaseError.code ===
        "auth/weak-password"
      ) {
        setError(
          "Please choose a stronger password."
        );

      } else if (
        firebaseError.code ===
        "auth/network-request-failed"
      ) {
        setError(
          "Unable to connect. Please check your internet connection and try again."
        );

      } else {
        setError(
          "Unable to create your account. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password ===
      formData.confirmPassword;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}

      <nav className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          <Link
            to="/"
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

          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
          >
            <ArrowLeft size={17} />

            <span className="hidden sm:inline">
              Back to Home
            </span>
          </Link>

        </div>

      </nav>

      {/* Main */}

      <main className="relative flex min-h-[calc(100vh-73px)] items-center justify-center overflow-hidden px-4 py-12 sm:px-6">

        {/* Decorative Background */}

        <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl" />

        <div className="relative grid w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-2">

          {/* Information Panel */}

          <section className="hidden bg-gradient-to-br from-blue-600 to-blue-800 p-10 text-white lg:flex lg:flex-col lg:justify-between">

            <div>

              <div className="inline-flex rounded-2xl bg-white/10 p-4">
                <HeartPulse size={34} />
              </div>

              <h2 className="mt-7 text-3xl font-bold leading-tight">
                Create your emergency health profile.
              </h2>

              <p className="mt-4 leading-7 text-blue-100">
                Set up your QRx account to manage
                important medical information and keep
                your emergency profile ready when needed.
              </p>

            </div>

            <div className="mt-12 space-y-4">

              <RegisterBenefit
                icon={<ShieldCheck size={20} />}
                text="Choose which emergency information you want to share"
              />

              <RegisterBenefit
                icon={<LockKeyhole size={20} />}
                text="Keep your private health information protected"
              />

              <RegisterBenefit
                icon={<HeartPulse size={20} />}
                text="Manage your emergency QR profile anytime"
              />

            </div>

          </section>

          {/* Registration Form */}

          <section className="p-6 sm:p-10 lg:p-12">

            <div className="mx-auto max-w-md">

              {/* Mobile Icon */}

              <div className="mb-6 flex justify-center lg:hidden">

                <div className="rounded-2xl bg-blue-50 p-4 text-blue-600">
                  <UserRound size={30} />
                </div>

              </div>

              <div className="text-center lg:text-left">

                <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                  Get started
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  Create your QRx account
                </h1>

                <p className="mt-3 leading-6 text-slate-500">
                  Create your account and start building
                  your emergency health profile.
                </p>

              </div>

              {/* Error */}

              {error && (

                <div
                  role="alert"
                  className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >

                  <AlertCircle
                    size={20}
                    className="mt-0.5 shrink-0"
                  />

                  <p>{error}</p>

                </div>

              )}

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-5"
              >

                {/* Full Name */}

                <div>

                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Full Name
                  </label>

                  <div className="relative">

                    <UserRound
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                  </div>

                </div>

                {/* Email */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                  </div>

                </div>

                {/* Password */}

                <div>

                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <div className="relative">

                    <LockKeyhole
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="password"
                      name="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >

                      {showPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}

                    </button>

                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    Use at least 6 characters.
                  </p>

                </div>

                {/* Confirm Password */}

                <div>

                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">

                    <LockKeyhole
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="new-password"
                      required
                      value={
                        formData.confirmPassword
                      }
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirmed password"
                          : "Show confirmed password"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >

                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}

                    </button>

                  </div>

                  {passwordsMatch && (

                    <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-green-600">

                      <CheckCircle2 size={15} />

                      Passwords match

                    </div>

                  )}

                </div>

                {/* Create Account */}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-blue-600/15 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (
                    <>
                      <Loader2
                        size={20}
                        className="animate-spin"
                      />

                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}

                </button>

              </form>

              {/* Login */}

              <div className="mt-7 border-t border-slate-100 pt-6 text-center">

                <p className="text-sm text-slate-500">

                  Already have a QRx account?{" "}

                  <Link
                    to="/login"
                    className="font-bold text-blue-600 transition hover:text-blue-700"
                  >
                    Sign in
                  </Link>

                </p>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

function RegisterBenefit({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
        {icon}
      </div>

      <p className="text-sm font-medium text-blue-50">
        {text}
      </p>

    </div>
  );
}

export default Register;