import express from "express";

import {
  createRedeemRequest,
  redeemHistory,
  approveRedeem,
  rejectRedeem,
  markPaid,
  getAllRedeemRequests,
  getRedeemById,
} from "../controllers/redeemController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminMiddleware.js";

const router = express.Router();

/* ===========================
   USER ROUTES
=========================== */

// Create Redeem Request
router.post("/", protect, createRedeemRequest);

// Redeem History
router.get("/history", protect, redeemHistory);

// Single Redeem Details
router.get("/:id", protect, getRedeemById);

/* ===========================
   ADMIN ROUTES
=========================== */

// Get All Redeem Requests
router.get("/admin/all", protect, adminProtect, getAllRedeemRequests);

// Approve Request
router.put("/admin/approve/:id", protect, adminProtect, approveRedeem);

// Reject Request
router.put("/admin/reject/:id", protect, adminProtect, rejectRedeem);

// Mark as Paid
router.put("/admin/paid/:id", protect, adminProtect, markPaid);

export default router;
