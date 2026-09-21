import express from "express";

import {
  getPendingEmployees,
  getPendingCompanies,
  verifyEmployee,
  rejectEmployee,
  verifyCompany,
  rejectCompany,
} from "../controllers/corporateAdminVerificationController.js";

import { auth } from "../middlewares/auth.js";
import { corporateRole } from "../middlewares/corporateRole.js";

const router = express.Router();

router.get(
  "/employees/pending",
  auth,
  corporateRole("admin"),
  getPendingEmployees,
);

router.get(
  "/companies/pending",
  auth,
  corporateRole("admin"),
  getPendingCompanies,
);

router.put(
  "/employees/:id/verify",
  auth,
  corporateRole("admin"),
  verifyEmployee,
);

router.put(
  "/employees/:id/reject",
  auth,
  corporateRole("admin"),
  rejectEmployee,
);

router.put(
  "/companies/:id/verify",
  auth,
  corporateRole("admin"),
  verifyCompany,
);

router.put(
  "/companies/:id/reject",
  auth,
  corporateRole("admin"),
  rejectCompany,
);

export default router;
