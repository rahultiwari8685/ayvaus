import express from "express";
import { loginUser } from "../controllers/authController.js";
import { registerUser } from "../controllers/registerUser.js";
import { giveDailyReward } from "../controllers/giveDailyReward.js";
import getWallet from "../controllers/getWallet.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/daily-reward", loginUser, giveDailyReward);
router.get("/wallet", loginUser, getWallet);

export default router;
