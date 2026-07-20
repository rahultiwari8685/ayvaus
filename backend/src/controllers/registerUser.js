import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Reward from "../models/Reward.js";

// Generate unique 6-character referral code
const generateReferralCode = async () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code;
  let exists = true;

  while (exists) {
    code = "";

    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    exists = await User.exists({
      referralCode: code,
    });
  }

  return code;
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, age, gender, looking_for, intent, bio } =
      req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let referredBy = null;

    if (req.body.referralCode) {
      const referrer = await User.findOne({
        referralCode: req.body.referralCode,
      });

      if (referrer) {
        referredBy = referrer._id;
      }
    }

    const referralCode = await generateReferralCode();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      age: Number(age),
      gender,
      looking_for,
      intent,
      bio,
      is_serious_profile: true,
      referralCode,
      // Referral
      referredBy,
    });

    console.log("Generated referral:", referralCode);
    console.log("Saved user referral:", user.referralCode);

    user.coins += 500;
    user.xp += 20;
    user.fragments += 2;
    user.level = Math.floor(user.xp / 500) + 1;

    await user.save();

    await Reward.create({
      user: user._id,
      type: "bonus",
      title: "Welcome Bonus",
      description: "Reward for completing registration",
      xp: 20,
      coins: 500,
      fragments: 2,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token,
      user,
      reward: {
        title: "Welcome Bonus",
        xp: 20,
        coins: 500,
        fragments: 2,
      },
    });
  } catch (err) {
    console.log("========== REGISTER ERROR ==========");
    console.log(err);
    console.log(err.message);
    console.log(err.stack);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
