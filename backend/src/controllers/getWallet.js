import User from "../models/User.js";

const getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "xp coins fragments level streakDays",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      wallet: {
        xp: user.xp,
        coins: user.coins,
        fragments: user.fragments,
        level: user.level,
        streakDays: user.streakDays,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default getWallet;
