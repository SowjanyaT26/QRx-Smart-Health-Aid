import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  HeartPulse,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { auth } from "../lib/firebase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      setError(
        "Unable to sign in. Please check your email and password and try again."
      );
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

        <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 lg:grid-cols-2">

          {/* Information Panel */}

          <section className="hidden bg-gradient-to-br from-blue-600 to-blue-800 p-10 text-white lg:flex lg:flex-col lg:justify-between">

            <div>

              <div className="inline-flex rounded-2xl bg-white/10 p-4">
                <HeartPulse size={34} />
              </div>

              <h2 className="mt-7 text-3xl font-bold leading-tight">
                Your emergency health profile,
                always within reach.
              </h2>

              <p className="mt-4 leading-7 text-blue-100">
                Sign in to manage your health information,
                emergency QR, privacy settings, access
                history, and medical documents.
              </p>

            </div>

            <div className="mt-12 space-y-4">

              <LoginBenefit
                icon={<ShieldCheck size={20} />}
                text="Control what emergency information you share"
              />

              <LoginBenefit
                icon={<LockKeyhole size={20} />}
                text="Keep private health documents securely separated"
              />

              <LoginBenefit
                icon={<HeartPulse size={20} />}
                text="Manage your emergency profile anytime"
              />

            </div>

          </section>

          {/* Login Form */}

          <section className="p-6 sm:p-10 lg:p-12">

            <div className="mx-auto max-w-md">

              {/* Mobile Icon */}

              <div className="mb-6 flex justify-center lg:hidden">

                <div className="rounded-2xl bg-blue-50 p-4 text-blue-600">
                  <LockKeyhole size={30} />
                </div>

              </div>

              <div className="text-center lg:text-left">

                <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                  Welcome back
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  Sign in to QRx
                </h1>

                <p className="mt-3 leading-6 text-slate-500">
                  Access and manage your emergency health
                  profile securely.
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
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                  </div>

                </div>

                {/* Password */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                    >
                      Forgot password?
                    </Link>

                  </div>

                  <div className="relative">

                    <LockKeyhole
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter your password"
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

                </div>

                {/* Sign In */}

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

                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}

                </button>

              </form>

              {/* Register */}

              <div className="mt-7 border-t border-slate-100 pt-6 text-center">

                <p className="text-sm text-slate-500">
                  Don't have a QRx account?{" "}

                  <Link
                    to="/register"
                    className="font-bold text-blue-600 transition hover:text-blue-700"
                  >
                    Create account
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

function LoginBenefit({
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

export default Login;