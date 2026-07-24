import express from "express";

import {
  createRedeemRequest,
  redeemHistory,
  adminRedeemList,
  approveRedeem,
  rejectRedeem,
  markPaid,
} from "../controllers/redeemController.js";

import { auth } from "../middlewares/auth.js";

const router = express.Router();

// User
router.post("/", auth, createRedeemRequest);
router.get("/history", auth, redeemHistory);

// Admin
router.get("/admin/list", auth, adminRedeemList);
router.post("/admin/approve/:id", auth, approveRedeem);
router.post("/admin/reject/:id", auth, rejectRedeem);
router.post("/admin/paid/:id", auth, markPaid);

export default router;
