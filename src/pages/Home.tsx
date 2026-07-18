import { Link } from "react-router-dom";
import {
  ArrowRight,
  Clock3,
  FileText,
  HeartPulse,
  LockKeyhole,
  QrCode,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Navbar */}

      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
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

          <div className="flex items-center gap-2 sm:gap-3">

            <Link
              to="/login"
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:px-4"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:px-5"
            >
              Get Started
            </Link>

          </div>

        </div>
      </nav>

      {/* Hero */}

      <main className="relative overflow-hidden">

        {/* Decorative Background */}

        <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />

        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-28">

          {/* Hero Content */}

          <section>

            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <ShieldCheck size={17} />
              Emergency information when every second matters
            </div>

            <h1 className="mt-7 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Your health information,
              <span className="block text-blue-600">
                one scan away.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Create a secure emergency health profile and
              generate a personal QR code that helps provide
              access to critical medical information when it
              is needed most.
            </p>

            {/* CTA Buttons */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              <Link
                to="/register"
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Create Your Profile
                <ArrowRight size={19} />
              </Link>

              <a
                href="#features"
                className="flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                Explore Features
              </a>

            </div>

            {/* Trust Points */}

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-500">

              <div className="flex items-center gap-2">
                <LockKeyhole
                  size={17}
                  className="text-blue-600"
                />
                Privacy controls
              </div>

              <div className="flex items-center gap-2">
                <QrCode
                  size={17}
                  className="text-blue-600"
                />
                Instant QR access
              </div>

              <div className="flex items-center gap-2">
                <FileText
                  size={17}
                  className="text-blue-600"
                />
                Private document vault
              </div>

            </div>

          </section>

          {/* Emergency QR Preview */}

          <section className="flex justify-center lg:justify-end">

            <div className="relative w-full max-w-md">

              {/* Background decoration */}

              <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-blue-100 to-cyan-50 blur-xl" />

              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/10 sm:p-8">

                {/* Card Header */}

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm font-medium text-slate-500">
                      QRx Emergency Profile
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                      Medical Information
                    </h2>

                  </div>

                  <div className="rounded-xl bg-red-50 p-3 text-red-500">
                    <HeartPulse size={30} />
                  </div>

                </div>

                {/* QR Preview */}

                <div className="mt-7 flex justify-center rounded-2xl border border-slate-100 bg-slate-50 p-8">

                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <QrCode
                      size={150}
                      className="text-slate-900 sm:h-40 sm:w-40"
                    />
                  </div>

                </div>

                {/* Status */}

                <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">

                  <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

                  Emergency profile ready

                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-center text-sm text-slate-500">

                  <Clock3 size={17} />

                  Critical information available through
                  one secure QR link

                </div>

              </div>

            </div>

          </section>

        </div>

      </main>

      {/* How It Works */}

      <section className="border-y border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="text-center">

            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Simple to use
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Emergency information in three steps
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-slate-500">
              Set up your profile once and keep your
              emergency information ready whenever it may
              be needed.
            </p>

          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">

            <StepCard
              number="01"
              title="Create your profile"
              description="Add important health details such as your blood group, allergies, medications, and emergency contact."
            />

            <StepCard
              number="02"
              title="Choose what to share"
              description="Use privacy controls to decide exactly which information should be available through your emergency profile."
            />

            <StepCard
              number="03"
              title="Use your QR"
              description="Download your personal QR code and keep it available for quick access to your selected emergency information."
            />

          </div>

        </div>

      </section>

      {/* Features */}

      <section
        id="features"
        className="bg-slate-50"
      >

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">

          <div className="text-center">

            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Why QRx?
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Built around emergency readiness
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-500">
              Manage your emergency information with
              practical tools for accessibility, privacy,
              and personal control.
            </p>

          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            <FeatureCard
              icon={<QrCode size={27} />}
              title="Instant QR Access"
              description="Make your selected emergency medical information available through a personal QR profile."
            />

            <FeatureCard
              icon={<ShieldCheck size={27} />}
              title="Privacy Controls"
              description="Choose which medical details are included in the information available through your emergency QR."
            />

            <FeatureCard
              icon={<HeartPulse size={27} />}
              title="Emergency Ready"
              description="Keep important details such as allergies, blood group, medications, and emergency contacts organized."
            />

            <FeatureCard
              icon={<Clock3 size={27} />}
              title="Access History"
              description="Review when your emergency profile has been opened through its public QR link."
            />

            <FeatureCard
              icon={<FileText size={27} />}
              title="Medical Document Vault"
              description="Privately store and manage important prescriptions, reports, and other medical documents."
            />

            <FeatureCard
              icon={<Smartphone size={27} />}
              title="Easy QR Management"
              description="Download your QR, temporarily deactivate access, or configure an automatic expiry time."
            />

          </div>

        </div>

      </section>

      {/* Final CTA */}

      <section className="bg-blue-700">

        <div className="mx-auto max-w-4xl px-4 py-16 text-center text-white sm:px-6">

          <HeartPulse
            size={38}
            className="mx-auto text-blue-200"
          />

          <h2 className="mt-5 text-3xl font-bold">
            Keep critical information within reach
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-blue-100">
            Create your QRx emergency profile and manage
            the information you want available when it
            matters.
          </p>

          <Link
            to="/register"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-blue-700 transition hover:-translate-y-0.5 hover:bg-blue-50"
          >
            Get Started
            <ArrowRight size={19} />
          </Link>

        </div>

      </section>

      {/* Footer */}

      <footer className="border-t border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-7 text-center sm:px-6 md:flex-row md:text-left lg:px-8">

          <Link
            to="/"
            className="flex items-center gap-2"
          >
            <div className="rounded-lg bg-blue-600 p-1.5 text-white">
              <HeartPulse size={19} />
            </div>

            <span className="font-bold text-slate-800">
              QRx Smart Health Aid
            </span>
          </Link>

          <p className="text-sm text-slate-500">
            Emergency information made easier to access.
          </p>

        </div>

      </footer>

    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

      <div className="text-sm font-black text-blue-600">
        {number}
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 leading-7 text-slate-500">
        {description}
      </p>

    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">

      <div className="inline-flex rounded-xl bg-blue-50 p-3 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-500">
        {description}
      </p>

    </div>
  );
}

export default Home;