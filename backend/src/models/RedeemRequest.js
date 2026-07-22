import mongoose from "mongoose";

const redeemRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    coins: {
      type: Number,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    upiId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "paid"],
      default: "pending",
    },

    transactionId: {
      type: String,
      default: "",
    },

    remark: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export default mongoose.model("RedeemRequest", redeemRequestSchema);
