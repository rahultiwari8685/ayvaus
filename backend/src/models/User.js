import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,

    // 🔥 Serious Mode Fields
    age: Number,
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    looking_for: {
      type: String,
      enum: ["male", "female", "any"],
    },
    intent: {
      type: String,
      enum: ["marriage", "relationship", "live_in", "friendship"],
    },
    bio: String,

    is_serious_profile: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
