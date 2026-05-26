export const giveDailyReward = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const today = new Date().toDateString();

    const lastLogin = user.lastLoginDate
      ? new Date(user.lastLoginDate).toDateString()
      : null;

    // ✅ Already claimed today
    if (today === lastLogin) {
      return res.json({
        success: true,
        message: "Already claimed",
      });
    }

    // 🔥 DAILY REWARD
    user.coins += 20;
    user.xp += 10;
    user.fragments += 1;

    // 🔥 STREAK
    user.streakDays += 1;

    user.lastLoginDate = new Date();

    await user.save();

    res.json({
      success: true,
      coins: 20,
      xp: 10,
      fragments: 1,
      streak: user.streakDays,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
    });
  }
};
