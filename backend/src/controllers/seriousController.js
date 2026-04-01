import User from "../models/User.js";

export const createProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { name, age, gender, looking_for, intent, bio } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        name,
        age: Number(age),
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
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
