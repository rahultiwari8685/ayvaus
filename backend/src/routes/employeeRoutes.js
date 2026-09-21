import express from "express";

import {
  getEmployeeProfile,
  updateEmployeeProfile,
} from "../controllers/employeeController.js";

import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/profile", auth, getEmployeeProfile);

router.put("/profile", auth, updateEmployeeProfile);

export default router;
