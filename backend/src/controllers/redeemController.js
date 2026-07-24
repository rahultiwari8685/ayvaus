import User from "../models/User.js";
import RedeemRequest from "../models/RedeemRequest.js";

export const createRedeemRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const { coins, upiId } = req.body;

    if (coins < 500) {
      return res.status(400).json({
        success: false,
        message: "Minimum redeem is 500 coins",
      });
    }

    if (user.coins < coins) {
      return res.status(400).json({
        success: false,
        message: "Insufficient coins",
      });
    }

    const pending = await RedeemRequest.findOne({
      user: user._id,
      status: "pending",
    });

    if (pending) {
      return res.status(400).json({
        success: false,
        message: "Pending request already exists",
      });
    }

    const amount = coins / 10;

    user.coins -= coins;

    await user.save();

    const request = await RedeemRequest.create({
      user: user._id,
      coins,
      amount,
      upiId,
    });

    res.json({
      success: true,
      request,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const redeemHistory = async (req, res) => {
  const data = await RedeemRequest.find({
    user: req.user.id,
  }).sort({
    createdAt: -1,
  });

  res.json(data);
};

export const approveRedeem = async (req, res) => {
  try {
    const request = await RedeemRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        status: false,
        message: "Request not found",
      });
    }

    request.status = "approved";

    await request.save();

    res.json({
      status: true,
      message: "Redeem request approved successfully.",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

export const markPaid = async (req, res) => {
  try {
    const request = await RedeemRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        status: false,
        message: "Request not found",
      });
    }

    request.status = "paid";
    request.transactionId = req.body.transactionId;

    await request.save();

    res.json({
      status: true,
      message: "Payment marked successfully.",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

export const rejectRedeem = async (req, res) => {
  try {
    const request = await RedeemRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        status: false,
        message: "Request not found",
      });
    }

    const user = await User.findById(request.user);

    user.coins += request.coins;

    await user.save();

    request.status = "rejected";

    await request.save();

    res.json({
      status: true,
      message: "Redeem request rejected successfully.",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

export const adminRedeemList = async (req, res) => {
  try {
    const data = await RedeemRequest.find()
      .populate("user", "name email phone profileImage")
      .sort({ createdAt: -1 });

    res.json({
      status: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};
