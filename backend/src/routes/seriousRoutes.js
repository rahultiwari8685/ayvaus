import express from "express";
import { createProfile } from "../controllers/seriousController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/profile", auth, createProfile);

export default router;
