import express from "express";

import {
  createRedeemRequest,
  redeemHistory,
} from "../controllers/redeemController.js";

import { auth } from "../middlewares/auth.js";

const router = express.Router();

// User Routes
router.post("/", auth, createRedeemRequest);

router.get("/history", auth, redeemHistory);

// router.get("/:id", auth, getRedeemById);

export default router;
