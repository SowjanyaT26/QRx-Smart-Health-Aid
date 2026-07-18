import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import {
  ArrowLeft,
  Download,
  FileText,
  HeartPulse,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";

import { storage } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";

interface MedicalDocument {
  name: string;
  fullPath: string;
  url: string;
}

function MedicalDocuments() {
  const { user } = useAuth();

  const [documents, setDocuments] =
    useState<MedicalDocument[]>([]);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] =
    useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadDocuments = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const documentsRef = ref(
        storage,
        `medicalDocuments/${user.uid}`
      );

      const result = await listAll(documentsRef);

      const loadedDocuments =
        await Promise.all(
          result.items.map(async (item) => {
            const url =
              await getDownloadURL(item);

            return {
              name: item.name,
              fullPath: item.fullPath,
              url,
            };
          })
        );

      setDocuments(loadedDocuments);
    } catch (error) {
      console.error(
        "Unable to load documents:",
        error
      );

      setError(
        "Unable to load your medical documents."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [user]);

  const handleFileSelection = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setError("");
    setMessage("");

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      setSelectedFile(null);

      setError(
        "Only PDF, JPG, and PNG files are allowed."
      );

      return;
    }

    const maximumFileSize =
      5 * 1024 * 1024;

    if (file.size > maximumFileSize) {
      setSelectedFile(null);

      setError(
        "The maximum allowed file size is 5 MB."
      );

      return;
    }

    setSelectedFile(file);
  };

  const uploadDocument = async () => {
    if (!user || !selectedFile) return;

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const uniqueFileName =
        `${Date.now()}-${selectedFile.name}`;

      const documentRef = ref(
        storage,
        `medicalDocuments/${user.uid}/${uniqueFileName}`
      );

      await uploadBytes(
        documentRef,
        selectedFile
      );

      setSelectedFile(null);

      setMessage(
        "Medical document uploaded successfully."
      );

      await loadDocuments();
    } catch (error) {
      console.error(
        "Unable to upload document:",
        error
      );

      setError(
        "Unable to upload the medical document."
      );
    } finally {
      setUploading(false);
    }
  };

  const deleteDocument = async (
    document: MedicalDocument
  ) => {
    const shouldDelete =
      window.confirm(
        `Delete "${document.name}"?`
      );

    if (!shouldDelete) return;

    try {
      setError("");
      setMessage("");

      await deleteObject(
        ref(storage, document.fullPath)
      );

      setMessage(
        "Medical document deleted successfully."
      );

      await loadDocuments();
    } catch (error) {
      console.error(
        "Unable to delete document:",
        error
      );

      setError(
        "Unable to delete the medical document."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Navbar */}

      <nav className="border-b bg-white">

        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">

          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={20} />
            Dashboard
          </Link>

          <div className="flex items-center gap-2 font-bold text-blue-700">
            <HeartPulse />
            QRx
          </div>

        </div>

      </nav>

      <main className="mx-auto max-w-5xl px-6 py-10">

        {/* Heading */}

        <div>

          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Private Storage
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Medical Document Vault
          </h1>

          <p className="mt-2 max-w-2xl text-slate-500">
            Securely store your prescriptions, medical
            reports, and other important health documents.
          </p>

        </div>

        {/* Messages */}

        {message && (
          <div className="mt-6 rounded-xl bg-green-50 p-4 text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {/* Upload Card */}

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <Upload size={25} />
            </div>

            <div>

              <h2 className="text-xl font-bold">
                Upload Medical Document
              </h2>

              <p className="text-sm text-slate-500">
                PDF, JPG or PNG — maximum 5 MB
              </p>

            </div>

          </div>

          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelection}
            className="mt-6 block w-full rounded-xl border border-slate-300 p-3"
          />

          {selectedFile && (

            <div className="mt-4 rounded-xl bg-slate-50 p-4">

              <p className="font-semibold text-slate-700">
                Selected file
              </p>

              <p className="mt-1 break-all text-sm text-slate-500">
                {selectedFile.name}
              </p>

            </div>

          )}

          <button
            onClick={uploadDocument}
            disabled={
              !selectedFile ||
              uploading
            }
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {uploading ? (
              <>
                <Loader2
                  size={19}
                  className="animate-spin"
                />

                Uploading...
              </>
            ) : (
              <>
                <Upload size={19} />
                Upload Document
              </>
            )}

          </button>

        </section>

        {/* Documents */}

        <section className="mt-8">

          <h2 className="text-xl font-bold text-slate-900">
            Your Documents
          </h2>

          {loading ? (

            <div className="flex justify-center py-16">

              <Loader2
                size={36}
                className="animate-spin text-blue-600"
              />

            </div>

          ) : documents.length === 0 ? (

            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-10 text-center">

              <FileText
                size={45}
                className="mx-auto text-slate-400"
              />

              <h3 className="mt-4 text-lg font-bold">
                No documents uploaded
              </h3>

              <p className="mt-2 text-slate-500">
                Your uploaded medical documents will
                appear here.
              </p>

            </div>

          ) : (

            <div className="mt-5 space-y-3">

              {documents.map((document) => (

                <div
                  key={document.fullPath}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center"
                >

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="shrink-0 rounded-xl bg-blue-100 p-3 text-blue-600">
                      <FileText size={22} />
                    </div>

                    <p className="truncate font-semibold text-slate-800">
                      {document.name}
                    </p>

                  </div>

                  <div className="flex gap-2">

                    <a
                      href={document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                    >
                      <Download size={17} />
                      View
                    </a>

                    <button
                      onClick={() =>
                        deleteDocument(document)
                      }
                      className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                    >
                      <Trash2 size={17} />
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default MedicalDocuments;