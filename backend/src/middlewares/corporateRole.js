import User from "../models/User.js";

export const corporateRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(403).json({
          success: false,
          message: "User ID not found",
        });
      }

      const user = await User.findById(userId).select("_id accountType");

      if (!user) {
        return res.status(403).json({
          success: false,
          message: "User not found",
        });
      }

      const accountType = user.accountType;

      if (!accountType) {
        return res.status(403).json({
          success: false,
          message: "Corporate account type not found",
        });
      }

      if (!allowedRoles.includes(accountType)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      // Keep user information available to controller
      req.user.accountType = accountType;

      next();
    } catch (error) {
      console.error("Corporate role error:", error);

      return res.status(500).json({
        success: false,
        message: "Role verification failed",
      });
    }
  };
};

// export const corporateRole = (...allowedRoles) => {
//   return (req, res, next) => {
//     const accountType = req.user?.accountType;

//     if (!accountType) {
//       return res.status(403).json({
//         success: false,
//         message: "Corporate account type not found",
//       });
//     }

//     if (!allowedRoles.includes(accountType)) {
//       return res.status(403).json({
//         success: false,
//         message: "Access denied",
//       });
//     }

//     next();
//   };
// };
