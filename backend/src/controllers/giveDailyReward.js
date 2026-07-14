import User from "../models/User.js";

export const giveDailyReward = async (req, res) => {
  try {
    console.log("REQ USER:", req.user);

    const userId = req.user.id || req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("BEFORE:", {
      coins: user.coins,
      xp: user.xp,
      fragments: user.fragments,
      streakDays: user.streakDays,
    });

    const today = new Date().toDateString();

    const lastLogin = user.lastLoginDate
      ? new Date(user.lastLoginDate).toDateString()
      : null;

    if (today === lastLogin) {
      return res.json({
        success: true,
        message: "Already claimed",
      });
    }

    user.coins = (user.coins || 0) + 20;
    user.xp = (user.xp || 0) + 10;
    user.fragments = (user.fragments || 0) + 1;
    user.streakDays = (user.streakDays || 0) + 1;
    user.lastLoginDate = new Date();

    await user.save();

    console.log("AFTER:", {
      coins: user.coins,
      xp: user.xp,
      fragments: user.fragments,
      streakDays: user.streakDays,
    });

    return res.json({
      success: true,
      wallet: user,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
