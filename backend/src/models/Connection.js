import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
  user1: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  socket1: String,
  socket2: String,

  startedAt: { type: Date, default: Date.now },
  endedAt: Date,
  duration: Number,

  status: {
    type: String,
    enum: ["active", "ended", "skipped"],
    default: "active",
  },
});

connectionSchema.index({ user1: 1, startedAt: -1 });
connectionSchema.index({ user2: 1, startedAt: -1 });

export default mongoose.model("Connection", connectionSchema);
