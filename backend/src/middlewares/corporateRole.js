export const corporateRole = (...allowedRoles) => {
  return (req, res, next) => {
    const accountType = req.user?.accountType;

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

    next();
  };
};
