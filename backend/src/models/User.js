import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,

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

    lastLoginDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
