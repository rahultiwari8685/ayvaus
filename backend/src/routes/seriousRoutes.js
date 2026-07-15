import express from "express";
import { loginUser } from "../controllers/authController.js";
import { registerUser } from "../controllers/registerUser.js";
import { giveDailyReward } from "../controllers/giveDailyReward.js";
import getWallet from "../controllers/getWallet.js";
import { auth } from "../middlewares/auth.js";
import getRewardHistory from "../controllers/getRewardHistory.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
// router.post("/daily-reward", loginUser, giveDailyReward);

router.post("/daily-reward", auth, giveDailyReward);
router.get("/wallet", auth, getWallet);
// router.get("/wallet", loginUser, getWallet);
router.get("/reward-history", auth, getRewardHistory);

export default router;
