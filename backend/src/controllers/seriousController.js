import User from "../models/User.js";

export const createProfile = async (req, res) => {
  try {
    const { name, age, gender, looking_for, intent, bio } = req.body;

    // 🔥 TEMP FIX (hardcode user)
    const userId = "PUT_REAL_USER_ID_FROM_DB";

    if (!name || !age || !gender || !intent) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        age: Number(age), // 🔥 FIX TYPE
        gender,
        looking_for,
        intent,
        bio,
        is_serious_profile: true,
      },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.log("❌ ERROR:", err); // 🔥 ADD THIS
    res.status(500).json({ message: "Server error" });
  }
};
