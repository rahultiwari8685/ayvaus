import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    profilePhoto: {
      type: String,
      default: null,
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    location: {
      city: String,
      state: String,
      country: {
        type: String,
        default: "India",
      },
    },

    headline: {
      type: String,
      default: "",
    },

    currentJobTitle: {
      type: String,
      default: "",
    },

    experienceYears: {
      type: Number,
      default: 0,
    },

    skills: {
      type: [String],
      default: [],
    },

    education: {
      type: [
        {
          degree: String,
          institution: String,
          startYear: Number,
          endYear: Number,
        },
      ],
      default: [],
    },

    employmentHistory: {
      type: [
        {
          company: String,
          jobTitle: String,
          startDate: Date,
          endDate: Date,
          description: String,
        },
      ],
      default: [],
    },

    resume: {
      type: String,
      default: null,
    },

    expectedSalary: {
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 0,
      },
    },

    preferredLocations: {
      type: [String],
      default: [],
    },

    workMode: {
      type: [String],
      enum: ["remote", "hybrid", "onsite"],
      default: [],
    },

    employmentType: {
      type: [String],
      enum: ["full_time", "part_time", "contract", "internship"],
      default: [],
    },

    noticePeriod: {
      type: Number,
      default: 0,
    },

    profileCompleted: {
      type: Number,
      default: 0,
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "under_review", "verified", "rejected"],
      default: "pending",
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "under_review", "verified", "rejected"],
      default: "pending",
    },

    verificationSubmittedAt: {
      type: Date,
      default: null,
    },

    verificationReviewedAt: {
      type: Date,
      default: null,
    },

    verificationReviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    verificationNote: {
      type: String,
      default: "",
    },

    verificationDocuments: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Employee ||
  mongoose.model("Employee", EmployeeSchema);
