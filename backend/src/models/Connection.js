import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
  user1: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  socket1: String,
  socket2: String,

  startedAt: { type: Date, default: Date.now },
  endedAt: Date,

  duration: Number, // seconds

  mode: { type: String, default: "serious" },

  status: {
    type: String,
    enum: ["active", "ended", "skipped"],
    default: "active",
  },
});

export default mongoose.model("Connection", connectionSchema);
