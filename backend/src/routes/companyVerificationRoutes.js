import express from "express";

import {
  submitCompanyVerification,
  getCompanyVerificationStatus,
} from "../controllers/companyVerificationController.js";

import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/submit", auth, submitCompanyVerification);

router.get("/status", auth, getCompanyVerificationStatus);

export default router;
