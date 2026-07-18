import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  HeartPulse,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { auth } from "../lib/firebase";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      setLoading(true);

      await sendPasswordResetEmail(
        auth,
        email.trim()
      );

      setMessage(
        "If an account exists for this email address, a password reset link has been sent. Please check your inbox and spam folder."
      );

    } catch (err: unknown) {
      console.error(err);

      const firebaseError =
        err as { code?: string };

      if (
        firebaseError.code ===
        "auth/invalid-email"
      ) {
        setError(
          "Please enter a valid email address."
        );

      } else if (
        firebaseError.code ===
        "auth/network-request-failed"
      ) {
        setError(
          "Unable to connect. Please check your internet connection and try again."
        );

      } else if (
        firebaseError.code ===
        "auth/too-many-requests"
      ) {
        setError(
          "Too many reset attempts were made. Please wait a little while and try again."
        );

      } else {
        setError(
          "Unable to send the password reset email. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

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
            to="/login"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
          >

            <ArrowLeft size={17} />

            <span className="hidden sm:inline">
              Back to Login
            </span>

          </Link>

        </div>

      </nav>

      {/* Main */}

      <main className="relative flex min-h-[calc(100vh-73px)] items-center justify-center overflow-hidden px-4 py-12 sm:px-6">

        {/* Decorative Background */}

        <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl" />

        <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-2">

          {/* Information Panel */}

          <section className="hidden bg-gradient-to-br from-blue-600 to-blue-800 p-10 text-white lg:flex lg:flex-col lg:justify-between">

            <div>

              <div className="inline-flex rounded-2xl bg-white/10 p-4">
                <LockKeyhole size={34} />
              </div>

              <h2 className="mt-7 text-3xl font-bold leading-tight">
                Recover access to your QRx account.
              </h2>

              <p className="mt-4 leading-7 text-blue-100">
                Enter the email address associated with
                your account and we'll send password reset
                instructions to your inbox.
              </p>

            </div>

            <div className="mt-12 space-y-4">

              <ResetBenefit
                icon={<Mail size={20} />}
                text="Receive a secure password reset link by email"
              />

              <ResetBenefit
                icon={<ShieldCheck size={20} />}
                text="Your emergency health profile remains protected"
              />

              <ResetBenefit
                icon={<HeartPulse size={20} />}
                text="Return to managing your QRx profile after resetting"
              />

            </div>

          </section>

          {/* Reset Form */}

          <section className="p-6 sm:p-10 lg:p-12">

            <div className="mx-auto max-w-md">

              {/* Icon */}

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 lg:mx-0">
                <Mail size={30} />
              </div>

              {/* Heading */}

              <div className="mt-6 text-center lg:text-left">

                <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                  Account recovery
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  Forgot your password?
                </h1>

                <p className="mt-3 leading-6 text-slate-500">
                  Enter your account email and we'll send
                  you a link to create a new password.
                </p>

              </div>

              {/* Success Message */}

              {message && (

                <div
                  role="status"
                  className="mt-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
                >

                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0"
                  />

                  <p>{message}</p>

                </div>

              )}

              {/* Error Message */}

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
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);

                        if (error) {
                          setError("");
                        }

                        if (message) {
                          setMessage("");
                        }
                      }}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                  </div>

                </div>

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

                      Sending reset link...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}

                </button>

              </form>

              {/* Back to Login */}

              <div className="mt-7 border-t border-slate-100 pt-6">

                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 text-sm font-bold text-blue-600 transition hover:text-blue-700"
                >
                  <ArrowLeft size={17} />
                  Back to Sign In
                </Link>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

function ResetBenefit({
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

export default ForgotPassword;