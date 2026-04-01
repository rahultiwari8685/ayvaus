import User from "../models/User.js";

export const createProfile = async (req, res) => {
  try {
    const { name, age, gender, looking_for, intent, bio } = req.body;

    const userId = req.user.id; // from auth

    if (!name || !age || !gender || !intent) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        age,
        gender,
        looking_for,
        intent,
        bio,
        is_serious_profile: true,
      },
      { new: true },
    );

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
