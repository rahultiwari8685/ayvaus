import User from "../models/User.js";
import Reward from "../models/Reward.js";
import RedeemRequest from "../models/RedeemRequest.js";

export const getDashboard = async (req, res) => {
  try {
    // ===========================
    // COUNTS
    // ===========================

    const totalUsers = await User.countDocuments();

    const totalRewards = await Reward.countDocuments();

    const totalRedeems = await RedeemRequest.countDocuments();

    const pendingRedeems = await RedeemRequest.countDocuments({
      status: "pending",
    });

    const approvedRedeems = await RedeemRequest.countDocuments({
      status: "approved",
    });

    const rejectedRedeems = await RedeemRequest.countDocuments({
      status: "rejected",
    });

    const paidRedeems = await RedeemRequest.countDocuments({
      status: "paid",
    });

    // ===========================
    // TOTAL COINS
    // ===========================

    const coinResult = await User.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$coins",
          },
        },
      },
    ]);

    const totalCoins = coinResult.length > 0 ? coinResult[0].total : 0;

    // ===========================
    // TOTAL XP
    // ===========================

    const xpResult = await User.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$xp",
          },
        },
      },
    ]);

    const totalXP = xpResult.length > 0 ? xpResult[0].total : 0;

    // ===========================
    // TOTAL REDEEM AMOUNT
    // ===========================

    const redeemAmount = await RedeemRequest.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalRedeemAmount =
      redeemAmount.length > 0 ? redeemAmount[0].total : 0;

    // ===========================
    // RECENT USERS
    // ===========================

    const recentUsers = await User.find()
      .select("name email coins xp level createdAt")
      .sort({
        createdAt: -1,
      })
      .limit(5);

    // ===========================
    // RECENT REDEEMS
    // ===========================

    const recentRedeems = await RedeemRequest.find()
      .populate("user", "name email")
      .sort({
        createdAt: -1,
      })
      .limit(5);

    // ===========================
    // RECENT REWARDS
    // ===========================

    const recentRewards = await Reward.find()
      .populate("user", "name")
      .sort({
        createdAt: -1,
      })
      .limit(5);

    // ===========================
    // DAILY REGISTRATIONS
    // ===========================

    const dailyRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%d-%m",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // ===========================
    // DAILY REWARDS
    // ===========================

    const dailyRewards = await Reward.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%d-%m",
              date: "$createdAt",
            },
          },
          coins: {
            $sum: "$coins",
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // ===========================
    // TOP XP USERS
    // ===========================

    const topXPUsers = await User.find()
      .select("name xp level")
      .sort({ xp: -1 })
      .limit(10);

    // ===========================
    // TOP COIN USERS
    // ===========================

    const topCoinUsers = await User.find()
      .select("name coins level")
      .sort({ coins: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalRewards,
        totalRedeems,

        pendingRedeems,
        approvedRedeems,
        rejectedRedeems,
        paidRedeems,

        totalCoins,
        totalXP,
        totalRedeemAmount,

        recentUsers,
        recentRedeems,
        recentRewards,

        dailyRegistrations: dailyRegistrations.map((item) => ({
          date: item._id,
          count: item.count,
        })),

        dailyRewards: dailyRewards.map((item) => ({
          date: item._id,
          coins: item.coins,
        })),

        topXPUsers,
        topCoinUsers,

        activities: [],
        storage: "12.4 GB",
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
