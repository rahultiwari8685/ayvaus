import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    logo: {
      type: String,
      default: null,
    },

    website: {
      type: String,
      default: "",
    },

    industry: {
      type: String,
      default: "",
    },

    companySize: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    officialEmail: {
      type: String,
      default: "",
    },

    address: {
      addressLine: String,
      city: String,
      state: String,
      country: {
        type: String,
        default: "India",
      },
      postalCode: String,
    },

    registrationType: {
      type: String,
      default: "",
    },

    registrationNumber: {
      type: String,
      default: "",
    },

    gstin: {
      type: String,
      default: "",
    },

    cin: {
      type: String,
      default: "",
    },

    authorizedPerson: {
      name: String,
      designation: String,
    },

    profileCompleted: {
      type: Number,
      default: 0,
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "under_review", "verified", "rejected", "suspended"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Company ||
  mongoose.model("Company", CompanySchema);
