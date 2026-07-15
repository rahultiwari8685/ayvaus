import mongoose from "mongoose";

const RewardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["daily_login", "session", "reconnect", "streak", "bonus"],
      required: true,
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

    title: String,

    description: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Reward || mongoose.model("Reward", RewardSchema);
