import express from "express";
import { loginUser } from "../controllers/authController.js";
import { registerUser } from "../controllers/registerUser.js";
import { giveDailyReward } from "../controllers/giveDailyReward.js";
import getWallet from "../controllers/getWallet.js";
import { auth } from "../middlewares/auth.js";
import getRewardHistory from "../controllers/getRewardHistory.js";
import getReferral from "../controllers/getReferral.js";
import { sendOtpMail } from "../utils/sendMail.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/seriousController.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
// router.post("/daily-reward", loginUser, giveDailyReward);

router.post("/daily-reward", auth, giveDailyReward);
router.get("/wallet", auth, getWallet);
// router.get("/wallet", loginUser, getWallet);
router.get("/reward-history", auth, getRewardHistory);
router.get("/referral", auth, getReferral);

router.get("/test-mail", async (req, res) => {
  try {
    await sendOtpMail("yourgmail@gmail.com", "123456");

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);

    res.json({
      success: false,
    });
  }
});

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

export default router;
