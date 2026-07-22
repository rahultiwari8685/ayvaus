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

import { auth } from "../middlewares/auth.js";
import { adminProtect } from "../middlewares/admin.js";

const router = express.Router();

/* USER */

router.post("/", auth, createRedeemRequest);

router.get("/history", auth, redeemHistory);

router.get("/:id", auth, getRedeemById);

/* ADMIN */

router.get("/admin/all", auth, adminProtect, getAllRedeemRequests);

router.put("/admin/approve/:id", auth, adminProtect, approveRedeem);

router.put("/admin/reject/:id", auth, adminProtect, rejectRedeem);

router.put("/admin/paid/:id", auth, adminProtect, markPaid);

export default router;
