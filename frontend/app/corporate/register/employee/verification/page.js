"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.flirtaus.com";

export default function EmployeeVerificationPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [status, setStatus] = useState("pending");
  const [submittedAt, setSubmittedAt] = useState(null);
  const [reviewedAt, setReviewedAt] = useState(null);
  const [note, setNote] = useState("");
  const [documents, setDocuments] = useState([]);

  const [documentInput, setDocumentInput] = useState("");
  const [profileCompleted, setProfileCompleted] = useState(0);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("corporate_token")
      : null;

  useEffect(() => {
    if (!token) {
      router.push("/corporate/login");
      return;
    }

    loadVerification();
  }, []);

  const loadVerification = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${API_URL}/api/corporate/employee/verification/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to load verification");
      }

      const verification = data.verification || data.employee || data;

      setStatus(
        verification.verificationStatus || verification.status || "pending",
      );

      setSubmittedAt(verification.verificationSubmittedAt || null);

      setReviewedAt(verification.verificationReviewedAt || null);

      setNote(verification.verificationNote || verification.note || "");

      setDocuments(
        Array.isArray(verification.verificationDocuments)
          ? verification.verificationDocuments
          : [],
      );

      if (data.profileCompleted !== undefined) {
        setProfileCompleted(data.profileCompleted);
      } else if (verification.profileCompleted !== undefined) {
        setProfileCompleted(verification.profileCompleted);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addDocument = () => {
    const value = documentInput.trim();

    if (!value) return;

    if (!documents.includes(value)) {
      setDocuments([...documents, value]);
    }

    setDocumentInput("");
  };

  const removeDocument = (index) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const submitVerification = async () => {
    try {
      setSubmitting(true);
      setMessage("");
      setError("");

      if (profileCompleted < 100) {
        setError(
          "Please complete your employee profile before submitting verification.",
        );
        return;
      }

      const res = await fetch(
        `${API_URL}/api/corporate/employee/verification/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            documents,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit verification");
      }

      setMessage(data.message || "Verification submitted successfully.");

      await loadVerification();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case "verified":
        return {
          label: "Verified",
          text: "Your employee profile has been verified.",
          className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
        };

      case "under_review":
        return {
          label: "Under Review",
          text: "Your verification request has been submitted and is currently being reviewed.",
          className: "border-blue-500/30 bg-blue-500/10 text-blue-300",
        };

      case "rejected":
        return {
          label: "Rejected",
          text: "Your verification request was rejected. Please review the admin note and resubmit.",
          className: "border-red-500/30 bg-red-500/10 text-red-300",
        };

      default:
        return {
          label: "Not Submitted",
          text: "Complete your profile and submit your documents for verification.",
          className: "border-amber-500/30 bg-amber-500/10 text-amber-300",
        };
    }
  };

  const statusConfig = getStatusConfig();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading verification...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">
              Flirta <span className="text-blue-500">Corporate</span>
            </h1>

            <p className="text-xs text-slate-400">Employee Verification</p>
          </div>

          <button
            onClick={() => router.push("/corporate/employee/dashboard")}
            className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-sm"
          >
            Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* TITLE */}

        <div className="mb-8">
          <p className="text-blue-400 text-sm font-semibold mb-2">
            EMPLOYEE VERIFICATION
          </p>

          <h2 className="text-3xl font-bold">
            Verify your professional profile
          </h2>

          <p className="text-slate-400 mt-2">
            Verification helps companies identify authentic professional
            profiles.
          </p>
        </div>

        {/* ALERT */}

        {message && (
          <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-emerald-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
            {error}
          </div>
        )}

        {/* STATUS */}

        <div
          className={`rounded-2xl border p-6 mb-6 ${statusConfig.className}`}
        >
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="text-xs uppercase tracking-wider opacity-70 mb-2">
                Verification Status
              </p>

              <h3 className="text-2xl font-bold">{statusConfig.label}</h3>

              <p className="mt-2 opacity-80">{statusConfig.text}</p>
            </div>

            <StatusIcon status={status} />
          </div>
        </div>

        {/* PROFILE COMPLETION */}

        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold">Profile Completion</h3>

              <p className="text-sm text-slate-400">
                Your profile must be 100% complete.
              </p>
            </div>

            <span className="text-xl font-bold text-blue-400">
              {profileCompleted}%
            </span>
          </div>

          <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{
                width: `${Math.min(profileCompleted, 100)}%`,
              }}
            />
          </div>

          {profileCompleted < 100 && (
            <button
              onClick={() => router.push("/corporate/employee/profile")}
              className="mt-4 text-sm text-blue-400 hover:text-blue-300"
            >
              Complete your profile →
            </button>
          )}
        </section>

        {/* DOCUMENTS */}

        {status !== "verified" && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 mb-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold">Verification Documents</h3>

              <p className="text-sm text-slate-400 mt-1">
                Add links to documents that can help verify your professional
                identity.
              </p>
            </div>

            <div className="flex gap-3">
              <input
                value={documentInput}
                onChange={(e) => setDocumentInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addDocument();
                  }
                }}
                placeholder="Document URL"
                className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />

              <button
                onClick={addDocument}
                className="px-5 rounded-lg bg-blue-600 hover:bg-blue-500 font-medium"
              >
                Add
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {documents.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-700 p-6 text-center text-sm text-slate-500">
                  No documents added yet.
                </div>
              )}

              {documents.map((document, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 rounded-lg border border-slate-800 bg-slate-950 p-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                      📄
                    </div>

                    <a
                      href={document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 truncate"
                    >
                      {document}
                    </a>
                  </div>

                  <button
                    onClick={() => removeDocument(index)}
                    className="text-red-400 hover:text-red-300 text-sm shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* REVIEW INFORMATION */}

        {(status === "under_review" ||
          status === "verified" ||
          status === "rejected") && (
          <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 mb-6">
            <h3 className="text-xl font-semibold mb-5">Verification Details</h3>

            <div className="grid md:grid-cols-2 gap-5">
              <Info label="Submitted" value={formatDate(submittedAt)} />

              <Info label="Reviewed" value={formatDate(reviewedAt)} />
            </div>

            {note && (
              <div className="mt-5">
                <p className="text-sm text-slate-400 mb-2">Admin Note</p>

                <div className="rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm text-slate-300">
                  {note}
                </div>
              </div>
            )}
          </section>
        )}

        {/* HOW IT WORKS */}

        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 mb-8">
          <h3 className="text-xl font-semibold mb-6">How Verification Works</h3>

          <div className="grid md:grid-cols-3 gap-5">
            <Step
              number="1"
              title="Complete Profile"
              text="Complete all required professional information."
            />

            <Step
              number="2"
              title="Submit Documents"
              text="Provide supporting documents for review."
            />

            <Step
              number="3"
              title="Get Verified"
              text="Our admin team reviews your profile."
            />
          </div>
        </section>

        {/* ACTION */}

        {status !== "verified" && (
          <div className="flex justify-end gap-3 pb-12">
            <button
              onClick={() => router.push("/corporate/employee/profile")}
              className="px-6 py-3 rounded-lg border border-slate-700 hover:bg-slate-800"
            >
              Edit Profile
            </button>

            {status !== "under_review" && (
              <button
                onClick={submitVerification}
                disabled={submitting || profileCompleted < 100}
                className="px-7 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed font-semibold"
              >
                {submitting
                  ? "Submitting..."
                  : status === "rejected"
                    ? "Resubmit Verification"
                    : "Submit for Verification"}
              </button>
            )}
          </div>
        )}

        {status === "verified" && (
          <div className="pb-12 flex justify-end">
            <button
              onClick={() => router.push("/corporate/employee/dashboard")}
              className="px-7 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold"
            >
              Continue to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

/* =========================
   COMPONENTS
========================= */

function Info({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
      <p className="text-xs text-slate-500 mb-1">{label}</p>

      <p className="text-sm text-slate-200">{value}</p>
    </div>
  );
}

function Step({ number, title, text }) {
  return (
    <div className="flex gap-4">
      <div className="w-9 h-9 shrink-0 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-semibold">
        {number}
      </div>

      <div>
        <h4 className="font-medium">{title}</h4>

        <p className="text-sm text-slate-400 mt-1">{text}</p>
      </div>
    </div>
  );
}

function StatusIcon({ status }) {
  if (status === "verified") {
    return <div className="text-3xl">✓</div>;
  }

  if (status === "rejected") {
    return <div className="text-3xl">!</div>;
  }

  if (status === "under_review") {
    return <div className="text-3xl">◷</div>;
  }

  return <div className="text-3xl">○</div>;
}

function formatDate(date) {
  if (!date) return "Not available";

  try {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Not available";
  }
}
