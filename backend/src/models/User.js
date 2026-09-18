import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,

    // Start Corporate Mode

    accountType: {
      type: String,
      enum: ["user", "employee", "company", "admin"],
      default: "user",
    },

    corporateProfileCompleted: {
      type: Boolean,
      default: false,
    },

    corporateVerified: {
      type: Boolean,
      default: false,
    },

    // End Corporate Mode

    age: Number,
    gender: String,
    looking_for: String,
    intent: String,
    bio: String,

    is_serious_profile: {
      type: Boolean,
      default: true,
    },

    xp: {
      type: Number,
      default: 0,
    },

    coins: {
      type: Number,
      default: 0,
    },

    fragments: {
      type: Number,
      default: 0,
    },

    level: {
      type: Number,
      default: 1,
    },

    streakDays: {
      type: Number,
      default: 0,
    },

    referralCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      minlength: 6,
      maxlength: 6,
    },
    resetOtp: {
      type: String,
      default: null,
    },

    resetOtpExpire: {
      type: Date,
      default: null,
    },

    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    referralRewardGiven: {
      type: Boolean,
      default: false,
    },

    totalReferrals: {
      type: Number,
      default: 0,
    },

    lastLoginDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
