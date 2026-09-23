"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.flirtaus.com";

const emptyEducation = {
  degree: "",
  institution: "",
  startYear: "",
  endYear: "",
};

const emptyEmployment = {
  company: "",
  jobTitle: "",
  startDate: "",
  description: "",
};

export default function EmployeeProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    profilePhoto: "",
    dateOfBirth: "",
    location: {
      city: "",
      state: "",
      country: "India",
    },

    headline: "",
    currentJobTitle: "",
    experienceYears: "",

    skills: [],

    education: [{ ...emptyEducation }],
    employmentHistory: [{ ...emptyEmployment }],

    resume: "",

    expectedSalary: {
      min: "",
      max: "",
    },

    preferredLocations: [],
    workMode: [],
    employmentType: [],
    noticePeriod: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("corporate_token")
      : null;

  useEffect(() => {
    if (!token) {
      router.push("/corporate/login");
      return;
    }

    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/api/corporate/register/employee/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load profile");
      }

      if (data.employee) {
        const employee = data.employee;

        setProfile({
          profilePhoto: employee.profilePhoto || "",
          dateOfBirth: employee.dateOfBirth
            ? employee.dateOfBirth.substring(0, 10)
            : "",

          location: {
            city: employee.location?.city || "",
            state: employee.location?.state || "",
            country: employee.location?.country || "India",
          },

          headline: employee.headline || "",
          currentJobTitle: employee.currentJobTitle || "",
          experienceYears: employee.experienceYears ?? "",

          skills: Array.isArray(employee.skills) ? employee.skills : [],

          education:
            Array.isArray(employee.education) && employee.education.length
              ? employee.education
              : [{ ...emptyEducation }],

          employmentHistory:
            Array.isArray(employee.employmentHistory) &&
            employee.employmentHistory.length
              ? employee.employmentHistory
              : [{ ...emptyEmployment }],

          resume: employee.resume || "",

          expectedSalary: {
            min: employee.expectedSalary?.min ?? "",
            max: employee.expectedSalary?.max ?? "",
          },

          preferredLocations: Array.isArray(employee.preferredLocations)
            ? employee.preferredLocations
            : [],

          workMode: Array.isArray(employee.workMode) ? employee.workMode : [],

          employmentType: Array.isArray(employee.employmentType)
            ? employee.employmentType
            : [],

          noticePeriod: employee.noticePeriod ?? "",
        });
      }
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

  const updateLocation = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  const updateSalary = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      expectedSalary: {
        ...prev.expectedSalary,
        [field]: value,
      },
    }));
  };

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    if (
      !profile.skills.some((item) => item.toLowerCase() === skill.toLowerCase())
    ) {
      updateField("skills", [...profile.skills, skill]);
    }

    setSkillInput("");
  };

  const removeSkill = (index) => {
    updateField(
      "skills",
      profile.skills.filter((_, i) => i !== index),
    );
  };

  const addPreferredLocation = () => {
    const location = locationInput.trim();

    if (!location) return;

    if (!profile.preferredLocations.includes(location)) {
      updateField("preferredLocations", [
        ...profile.preferredLocations,
        location,
      ]);
    }

    setLocationInput("");
  };

  const removePreferredLocation = (index) => {
    updateField(
      "preferredLocations",
      profile.preferredLocations.filter((_, i) => i !== index),
    );
  };

  const updateEducation = (index, field, value) => {
    const updated = [...profile.education];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    updateField("education", updated);
  };

  const addEducation = () => {
    updateField("education", [...profile.education, { ...emptyEducation }]);
  };

  const removeEducation = (index) => {
    if (profile.education.length === 1) return;

    updateField(
      "education",
      profile.education.filter((_, i) => i !== index),
    );
  };

  const updateEmployment = (index, field, value) => {
    const updated = [...profile.employmentHistory];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    updateField("employmentHistory", updated);
  };

  const addEmployment = () => {
    updateField("employmentHistory", [
      ...profile.employmentHistory,
      { ...emptyEmployment },
    ]);
  };

  const removeEmployment = (index) => {
    if (profile.employmentHistory.length === 1) return;

    updateField(
      "employmentHistory",
      profile.employmentHistory.filter((_, i) => i !== index),
    );
  };

  const toggleArrayValue = (field, value) => {
    const current = profile[field] || [];

    if (current.includes(value)) {
      updateField(
        field,
        current.filter((item) => item !== value),
      );
    } else {
      updateField(field, [...current, value]);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const payload = {
        ...profile,

        experienceYears:
          profile.experienceYears === ""
            ? null
            : Number(profile.experienceYears),

        expectedSalary: {
          min:
            profile.expectedSalary.min === ""
              ? null
              : Number(profile.expectedSalary.min),

          max:
            profile.expectedSalary.max === ""
              ? null
              : Number(profile.expectedSalary.max),
        },

        noticePeriod:
          profile.noticePeriod === "" ? null : Number(profile.noticePeriod),
      };

      const res = await fetch(
        `${API_URL}/api/corporate/register/employee/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setMessage(
        `Profile saved successfully. Completion: ${
          data.profileCompleted ?? 0
        }%`,
      );

      await fetchProfile();

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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}

      <header className="border-b border-slate-800 bg-slate-950/95 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">
              Flirta <span className="text-blue-500">Corporate</span>
            </h1>

            <p className="text-xs text-slate-400">Employee Profile</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/corporate/employee/dashboard")}
              className="px-4 py-2 rounded-lg border border-slate-700 text-sm hover:bg-slate-800"
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
            EMPLOYEE PROFILE
          </p>

          <h2 className="text-3xl font-bold">
            Build your professional profile
          </h2>

          <p className="text-slate-400 mt-2">
            Complete your profile to unlock corporate opportunities and
            verification.
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

        {/* PERSONAL */}

        <Section
          number="01"
          title="Personal Information"
          description="Basic information about you"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <Input
              label="Profile Photo URL"
              value={profile.profilePhoto}
              onChange={(e) => updateField("profilePhoto", e.target.value)}
              placeholder="https://..."
            />

            <Input
              label="Date of Birth"
              type="date"
              value={profile.dateOfBirth}
              onChange={(e) => updateField("dateOfBirth", e.target.value)}
            />

            <Input
              label="City"
              value={profile.location.city}
              onChange={(e) => updateLocation("city", e.target.value)}
              placeholder="Lucknow"
            />

            <Input
              label="State"
              value={profile.location.state}
              onChange={(e) => updateLocation("state", e.target.value)}
              placeholder="Uttar Pradesh"
            />

            <Input
              label="Country"
              value={profile.location.country}
              onChange={(e) => updateLocation("country", e.target.value)}
              placeholder="India"
            />
          </div>
        </Section>

        {/* PROFESSIONAL */}

        <Section
          number="02"
          title="Professional Information"
          description="Tell companies about your professional background"
        >
          <div className="space-y-5">
            <Input
              label="Professional Headline"
              value={profile.headline}
              onChange={(e) => updateField("headline", e.target.value)}
              placeholder="React Developer | Frontend Engineer"
            />

            <div className="grid md:grid-cols-2 gap-5">
              <Input
                label="Current Job Title"
                value={profile.currentJobTitle}
                onChange={(e) => updateField("currentJobTitle", e.target.value)}
                placeholder="Frontend Developer"
              />

              <Input
                label="Experience (Years)"
                type="number"
                min="0"
                value={profile.experienceYears}
                onChange={(e) => updateField("experienceYears", e.target.value)}
                placeholder="2"
              />
            </div>

            {/* SKILLS */}

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Skills
              </label>

              <div className="flex gap-2">
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="React, Node.js, MongoDB..."
                  className={inputClass}
                />

                <button
                  type="button"
                  onClick={addSkill}
                  className="px-5 rounded-lg bg-blue-600 hover:bg-blue-500"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm"
                  >
                    {skill}

                    <button
                      onClick={() => removeSkill(index)}
                      className="ml-2 text-blue-400 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* EDUCATION */}

        <Section
          number="03"
          title="Education"
          description="Add your educational qualifications"
        >
          <div className="space-y-5">
            {profile.education.map((education, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"
              >
                <div className="flex justify-between mb-4">
                  <h3 className="font-semibold">Education #{index + 1}</h3>

                  {profile.education.length > 1 && (
                    <button
                      onClick={() => removeEducation(index)}
                      className="text-red-400 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Degree"
                    value={education.degree}
                    onChange={(e) =>
                      updateEducation(index, "degree", e.target.value)
                    }
                    placeholder="B.Tech Computer Science"
                  />

                  <Input
                    label="Institution"
                    value={education.institution}
                    onChange={(e) =>
                      updateEducation(index, "institution", e.target.value)
                    }
                    placeholder="University / College"
                  />

                  <Input
                    label="Start Year"
                    value={education.startYear}
                    onChange={(e) =>
                      updateEducation(index, "startYear", e.target.value)
                    }
                    placeholder="2019"
                  />

                  <Input
                    label="End Year"
                    value={education.endYear}
                    onChange={(e) =>
                      updateEducation(index, "endYear", e.target.value)
                    }
                    placeholder="2023"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addEducation}
              className="border border-blue-500/40 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/10"
            >
              + Add Education
            </button>
          </div>
        </Section>

        {/* EXPERIENCE */}

        <Section
          number="04"
          title="Employment History"
          description="Add your previous professional experience"
        >
          <div className="space-y-5">
            {profile.employmentHistory.map((employment, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"
              >
                <div className="flex justify-between mb-4">
                  <h3 className="font-semibold">Experience #{index + 1}</h3>

                  {profile.employmentHistory.length > 1 && (
                    <button
                      onClick={() => removeEmployment(index)}
                      className="text-red-400 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Company"
                    value={employment.company}
                    onChange={(e) =>
                      updateEmployment(index, "company", e.target.value)
                    }
                    placeholder="Company name"
                  />

                  <Input
                    label="Job Title"
                    value={employment.jobTitle}
                    onChange={(e) =>
                      updateEmployment(index, "jobTitle", e.target.value)
                    }
                    placeholder="Software Developer"
                  />

                  <Input
                    label="Start Date"
                    type="date"
                    value={employment.startDate}
                    onChange={(e) =>
                      updateEmployment(index, "startDate", e.target.value)
                    }
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm text-slate-300 mb-2">
                    Description
                  </label>

                  <textarea
                    value={employment.description}
                    onChange={(e) =>
                      updateEmployment(index, "description", e.target.value)
                    }
                    rows={4}
                    className={textareaClass}
                    placeholder="Describe your responsibilities..."
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addEmployment}
              className="border border-blue-500/40 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/10"
            >
              + Add Experience
            </button>
          </div>
        </Section>

        {/* JOB PREFERENCES */}

        <Section
          number="05"
          title="Job Preferences"
          description="Tell companies what kind of opportunities you are looking for"
        >
          <div className="space-y-6">
            {/* Salary */}

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Expected Salary
              </label>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Minimum Salary"
                  type="number"
                  value={profile.expectedSalary.min}
                  onChange={(e) => updateSalary("min", e.target.value)}
                  placeholder="500000"
                />

                <Input
                  label="Maximum Salary"
                  type="number"
                  value={profile.expectedSalary.max}
                  onChange={(e) => updateSalary("max", e.target.value)}
                  placeholder="800000"
                />
              </div>
            </div>

            {/* Locations */}

            <div>
              <label className="block text-sm text-slate-300 mb-2">
                Preferred Locations
              </label>

              <div className="flex gap-2">
                <input
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPreferredLocation();
                    }
                  }}
                  placeholder="Delhi, Bangalore, Remote..."
                  className={inputClass}
                />

                <button
                  onClick={addPreferredLocation}
                  className="px-5 rounded-lg bg-blue-600 hover:bg-blue-500"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {profile.preferredLocations.map((location, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-sm"
                  >
                    {location}

                    <button
                      onClick={() => removePreferredLocation(index)}
                      className="ml-2 text-slate-400 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Work Mode */}

            <CheckboxGroup
              title="Work Mode"
              values={["remote", "hybrid", "onsite"]}
              selected={profile.workMode}
              onToggle={(value) => toggleArrayValue("workMode", value)}
            />

            {/* Employment Type */}

            <CheckboxGroup
              title="Employment Type"
              values={[
                "full_time",
                "part_time",
                "contract",
                "internship",
                "freelance",
              ]}
              selected={profile.employmentType}
              onToggle={(value) => toggleArrayValue("employmentType", value)}
            />

            {/* Notice Period */}

            <div className="max-w-md">
              <Input
                label="Notice Period (Days)"
                type="number"
                min="0"
                value={profile.noticePeriod}
                onChange={(e) => updateField("noticePeriod", e.target.value)}
                placeholder="30"
              />
            </div>
          </div>
        </Section>

        {/* RESUME */}

        <Section number="06" title="Resume" description="Add your resume">
          <Input
            label="Resume URL"
            value={profile.resume}
            onChange={(e) => updateField("resume", e.target.value)}
            placeholder="https://example.com/resume.pdf"
          />

          <p className="text-xs text-slate-500 mt-2">
            File upload will be connected after the profile module is completed.
          </p>
        </Section>

        {/* BOTTOM SAVE */}

        <div className="flex justify-end gap-3 pb-12">
          <button
            onClick={() => router.push("/corporate/employee/dashboard")}
            className="px-6 py-3 rounded-lg border border-slate-700 hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={saveProfile}
            disabled={saving}
            className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 font-semibold disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      </main>
    </div>
  );
}

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

      <input {...props} className={inputClass} />
    </div>
  );
}

function CheckboxGroup({ title, values, selected, onToggle }) {
  return (
    <div>
      <label className="block text-sm text-slate-300 mb-3">{title}</label>

      <div className="flex flex-wrap gap-3">
        {values.map((value) => {
          const active = selected.includes(value);

          return (
            <button
              type="button"
              key={value}
              onClick={() => onToggle(value)}
              className={`px-4 py-2 rounded-lg border text-sm capitalize transition ${
                active
                  ? "border-blue-500 bg-blue-500/10 text-blue-300"
                  : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600"
              }`}
            >
              {value.replaceAll("_", " ")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 placeholder:text-slate-600";

const textareaClass =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 placeholder:text-slate-600";
