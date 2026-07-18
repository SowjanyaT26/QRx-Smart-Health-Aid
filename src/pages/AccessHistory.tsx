import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

import {
  ArrowLeft,
  Clock,
  Eye,
  HeartPulse,
  Loader2,
  QrCode,
} from "lucide-react";

import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";

interface AccessLog {
  id: string;
  accessedAt?: Timestamp;
}

function AccessHistory() {
  const { user } = useAuth();

  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAccessHistory() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const logsQuery = query(
          collection(db, "qrAccessLogs"),
          where("ownerId", "==", user.uid),
          
        );

        const snapshot = await getDocs(logsQuery);

        const accessLogs: AccessLog[] =
          snapshot.docs.map((document) => ({
            id: document.id,
            accessedAt: document.data()
              .accessedAt as Timestamp | undefined,
          }));

          accessLogs.sort((a, b) => {
          const timeA =
          a.accessedAt?.toMillis() ?? 0;

          const timeB =
          b.accessedAt?.toMillis() ?? 0;

          return timeB - timeA;
       });


        setLogs(accessLogs);
      } catch (error) {
        console.error(
          "Unable to load access history:",
          error
        );

        setError(
          "Unable to load QR access history."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAccessHistory();
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}

      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">

          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} />
            Dashboard
          </Link>

          <div className="flex items-center gap-2 font-bold text-blue-700">
            <HeartPulse size={22} />
            QRx
          </div>

        </div>
      </nav>

      {/* Main Content */}

      <main className="mx-auto max-w-5xl px-6 py-10">

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            QR Activity
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Emergency QR Access History
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            See when your emergency profile was accessed.
            Scanner identity and precise location are not
            collected.
          </p>
        </div>

        {/* Loading */}

        {loading ? (

          <div className="flex justify-center py-20">
            <Loader2
              size={36}
              className="animate-spin text-blue-600"
            />
          </div>

        ) : error ? (

          /* Error */

          <div className="mt-8 rounded-xl bg-red-50 p-5 text-red-600">
            {error}
          </div>

        ) : logs.length === 0 ? (

          /* No Access History */

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center">

            <QrCode
              size={42}
              className="mx-auto text-slate-400"
            />

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              No QR accesses yet
            </h2>

            <p className="mt-2 text-slate-500">
              Access activity will appear here when your
              emergency profile is opened.
            </p>

          </div>

        ) : (

          <>
            {/* Access Count */}

            <div className="mt-8 rounded-2xl bg-blue-600 p-6 text-white">

              <div className="flex items-center gap-4">

                <div className="rounded-xl bg-white/20 p-3">
                  <Eye size={28} />
                </div>

                <div>

                  <p className="text-sm text-blue-100">
                    Total profile accesses
                  </p>

                  <p className="text-3xl font-bold">
                    {logs.length}
                  </p>

                </div>

              </div>

            </div>

            {/* Access List */}

            <div className="mt-6 space-y-3">

              {logs.map((log) => (

                <div
                  key={log.id}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5"
                >

                  <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                    <Clock size={22} />
                  </div>

                  <div>

                    <p className="font-semibold text-slate-900">
                      Emergency profile accessed
                    </p>

                    <p className="mt-1 text-sm text-slate-500">

                      {log.accessedAt
                        ? log.accessedAt
                            .toDate()
                            .toLocaleString()
                        : "Just now"}

                    </p>

                  </div>

                </div>

              ))}

            </div>
          </>

        )}

      </main>

    </div>
  );
}

export default AccessHistory;