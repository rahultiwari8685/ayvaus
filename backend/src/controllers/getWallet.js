import User from "../models/User.js";

const getWallet = async (req, res) => {
  try {
    console.log("REQ USER:", req.user);

    const userId = req.user.id || req.user._id;

    const user = await User.findById(userId).select(
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
  }
  
 } catch (err) {
  console.error("========== WALLET ERROR ==========");
  console.error(err);
  console.error(err.message);
  console.error(err.stack);

  return res.status(500).json({
    success: false,
    message: err.message,
  });
}
};

export default getWallet;
