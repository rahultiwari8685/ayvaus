import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Reward from "../models/Reward.js";
const SECRET = process.env.JWT_SECRET;

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
    });

    user.coins = 500;
    user.xp = 20;
    user.fragments = 2;
    user.level = 1;

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

    const token = jwt.sign({ id: user._id }, SECRET, {
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
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
