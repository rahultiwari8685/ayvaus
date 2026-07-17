import User from "../models/User.js";

const getReferral = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "referralCode totalReferrals",
    );

    res.json({
      success: true,
      referralCode: user.referralCode,
      totalReferrals: user.totalReferrals,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default getReferral;
