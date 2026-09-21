import express from "express";

import {
  getCompanyProfile,
  updateCompanyProfile,
} from "../controllers/companyController.js";

import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/profile", auth, getCompanyProfile);

router.put("/profile", auth, updateCompanyProfile);

export default router;
