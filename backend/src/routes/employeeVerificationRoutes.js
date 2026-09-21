import express from "express";

import {
  submitEmployeeVerification,
  getEmployeeVerificationStatus,
} from "../controllers/employeeVerificationController.js";

import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/submit", auth, submitEmployeeVerification);

router.get("/status", auth, getEmployeeVerificationStatus);

export default router;
