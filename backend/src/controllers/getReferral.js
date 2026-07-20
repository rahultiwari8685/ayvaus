import User from "../models/User.js";

const getReferral = async (req, res) => {
  try {
    console.log("Decoded User:", req.user);

    const user = await User.findById(req.user.id);

    console.log("DB User:", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      referralCode: user.referralCode,
      totalReferrals: user.totalReferrals,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default getReferral;
