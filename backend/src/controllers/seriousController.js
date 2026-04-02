import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, age, gender, looking_for, intent, bio } =
      req.body;

    // check user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user + profile together
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      age: Number(age),
      gender,
      looking_for,
      intent,
      bio,
      is_serious_profile: true, // ✅ important
    });

    // create token
    const token = jwt.sign({ id: user._id }, "YOUR_SECRET", {
      expiresIn: "7d",
    });

    res.json({
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
