import Reward from "../models/Reward.js";

const getRewardHistory = async (req, res) => {
  try {
    const rewards = await Reward.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      rewards,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export default getRewardHistory;
