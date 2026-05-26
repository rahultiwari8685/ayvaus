import express from "express";
import { loginUser } from "../controllers/authController.js";
import { registerUser } from "../controllers/registerUser.js";
import { giveDailyReward } from "../controllers/giveDailyReward.js";
import getWallet from "../controllers/getWallet.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/daily-reward", authMiddleware, giveDailyReward);
router.get("/wallet", authMiddleware, getWallet);

export default router;
