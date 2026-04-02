import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = "YOUR_SECRET";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ✅ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // ✅ Generate token
    const token = jwt.sign({ id: user._id }, SECRET, {
      expiresIn: "7d",
    });

    // ✅ Remove password from response
    const userData = user.toObject();
    delete userData.password;

    // ✅ Check profile completion
    const isProfileComplete = user.is_serious_profile;

    res.json({
      success: true,
      token,
      user: userData,
      profileComplete: isProfileComplete, // 👈 IMPORTANT
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
