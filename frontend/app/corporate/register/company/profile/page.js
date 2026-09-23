"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.flirtaus.com";

const initialProfile = {
  companyName: "",
  logo: "",
  website: "",
  industry: "",
  companySize: "",
  description: "",
  phone: "",
  officialEmail: "",
  address: "",
  registrationType: "",
  registrationNumber: "",
  gstin: "",
  cin: "",
  authorizedPerson: "",
};

export default function CompanyProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState(initialProfile);
  const [profileCompleted, setProfileCompleted] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/api/corporate/company/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load company profile");
      }

      const company = data.company || data;

      setProfile({
        companyName: company.companyName || "",
        logo: company.logo || "",
        website: company.website || "",
        industry: company.industry || "",
        companySize: company.companySize || "",
        description: company.description || "",
        phone: company.phone || "",
        officialEmail: company.officialEmail || "",
        address: company.address || "",
        registrationType: company.registrationType || "",
        registrationNumber: company.registrationNumber || "",
        gstin: company.gstin || "",
        cin: company.cin || "",
        authorizedPerson: company.authorizedPerson || "",
      });

      setProfileCompleted(
        company.profileCompleted ?? data.profileCompleted ?? 0,
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const res = await fetch(`${API_URL}/api/corporate/company/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update company profile");
      }

      const completed =
        data.profileCompleted ?? data.company?.profileCompleted ?? 0;

      setProfileCompleted(completed);

      setMessage(
        `Company profile saved successfully. Completion: ${completed}%`,
      );

      await loadProfile();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading company profile...</p>
        </div>
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

            <p className="text-xs text-slate-400">Company Profile</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/corporate/company/dashboard")}
              className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-sm"
            >
              Dashboard
            </button>

            <button
              onClick={saveProfile}
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-sm font-semibold"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* TITLE */}

        <div className="mb-8">
          <p className="text-blue-400 text-sm font-semibold mb-2">
            COMPANY PROFILE
          </p>

          <h2 className="text-3xl font-bold">Build your company profile</h2>

          <p className="text-slate-400 mt-2">
            Give professionals the information they need to understand your
            company.
          </p>
        </div>

        {/* ALERTS */}

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

        {/* COMPLETION */}

        <section className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 mb-7">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-slate-400">Profile Completion</p>

              <p className="font-semibold mt-1">
                {profileCompleted >= 100
                  ? "Profile complete"
                  : "Complete your company profile"}
              </p>
            </div>

            <span className="text-2xl font-bold text-blue-400">
              {profileCompleted}%
            </span>
          </div>

          <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${Math.min(profileCompleted, 100)}%`,
              }}
            />
          </div>

          {profileCompleted < 100 && (
            <p className="text-xs text-slate-500 mt-3">
              Complete all required company information before submitting
              verification.
            </p>
          )}
        </section>

        {/* BASIC INFORMATION */}

        <Section
          number="01"
          title="Company Information"
          description="Basic information about your company"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <Input
              label="Company Name"
              value={profile.companyName}
              onChange={(e) => updateField("companyName", e.target.value)}
              placeholder="ABC Technologies Pvt. Ltd."
            />

            <Input
              label="Company Logo URL"
              value={profile.logo}
              onChange={(e) => updateField("logo", e.target.value)}
              placeholder="https://..."
            />

            <Input
              label="Website"
              value={profile.website}
              onChange={(e) => updateField("website", e.target.value)}
              placeholder="https://company.com"
            />

            <Select
              label="Industry"
              value={profile.industry}
              onChange={(e) => updateField("industry", e.target.value)}
              options={[
                "Technology",
                "Software",
                "Finance",
                "Healthcare",
                "Education",
                "E-Commerce",
                "Manufacturing",
                "Real Estate",
                "Consulting",
                "Media",
                "Marketing",
                "Other",
              ]}
            />

            <Select
              label="Company Size"
              value={profile.companySize}
              onChange={(e) => updateField("companySize", e.target.value)}
              options={[
                "1-10",
                "11-50",
                "51-200",
                "201-500",
                "501-1000",
                "1001-5000",
                "5000+",
              ]}
            />

            <Input
              label="Official Email"
              type="email"
              value={profile.officialEmail}
              onChange={(e) => updateField("officialEmail", e.target.value)}
              placeholder="hr@company.com"
            />

            <Input
              label="Company Phone"
              value={profile.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="+91 9876543210"
            />
          </div>

          <div className="mt-5">
            <Textarea
              label="Company Description"
              value={profile.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Tell professionals about your company, products, services and culture..."
            />
          </div>
        </Section>

        {/* ADDRESS */}

        <Section
          number="02"
          title="Business Address"
          description="Where your company operates"
        >
          <Textarea
            label="Registered / Office Address"
            value={profile.address}
            onChange={(e) => updateField("address", e.target.value)}
            placeholder="Full company address..."
          />
        </Section>

        {/* REGISTRATION */}

        <Section
          number="03"
          title="Business Registration"
          description="Legal information used during company verification"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <Select
              label="Registration Type"
              value={profile.registrationType}
              onChange={(e) => updateField("registrationType", e.target.value)}
              options={[
                "Private Limited",
                "Public Limited",
                "LLP",
                "Partnership",
                "Proprietorship",
                "Startup",
                "NGO",
                "Other",
              ]}
            />

            <Input
              label="Registration Number"
              value={profile.registrationNumber}
              onChange={(e) =>
                updateField("registrationNumber", e.target.value)
              }
              placeholder="Company registration number"
            />

            <Input
              label="GSTIN"
              value={profile.gstin}
              onChange={(e) =>
                updateField("gstin", e.target.value.toUpperCase())
              }
              placeholder="22AAAAA0000A1Z5"
            />

            <Input
              label="CIN"
              value={profile.cin}
              onChange={(e) => updateField("cin", e.target.value.toUpperCase())}
              placeholder="U12345AB2020PTC000000"
            />

            <Input
              label="Authorized Person"
              value={profile.authorizedPerson}
              onChange={(e) => updateField("authorizedPerson", e.target.value)}
              placeholder="Director / HR Head / Authorized Representative"
            />
          </div>
        </Section>

        {/* SAVE */}

        <div className="flex flex-col sm:flex-row justify-end gap-3 pb-12">
          <button
            onClick={() => router.push("/corporate/company/dashboard")}
            className="px-6 py-3 rounded-lg border border-slate-700 hover:bg-slate-800"
          >
            Back to Dashboard
          </button>

          <button
            onClick={saveProfile}
            disabled={saving}
            className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 font-semibold"
          >
            {saving ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      </main>
    </div>
  );
}

/* =========================
   COMPONENTS
========================= */

function Section({ number, title, description, children }) {
  return (
    <section className="mb-7 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 md:p-8">
      <div className="flex gap-4 mb-7">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
          {number}
        </div>

        <div>
          <h2 className="text-xl font-semibold">{title}</h2>

          <p className="text-sm text-slate-400 mt-1">{description}</p>
        </div>
      </div>

      {children}
    </section>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm text-slate-300 mb-2">{label}</label>

      <input
        {...props}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 placeholder:text-slate-600"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm text-slate-300 mb-2">{label}</label>

      <textarea
        {...props}
        rows={5}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 placeholder:text-slate-600 resize-y"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm text-slate-300 mb-2">{label}</label>

      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
