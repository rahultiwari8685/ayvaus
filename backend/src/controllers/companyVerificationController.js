import Company from "../models/Company.js";
import User from "../models/User.js";

export const submitCompanyVerification = async (req, res) => {
  try {
    const userId = req.user.id;

    const company = await Company.findOne({
      user: userId,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    // Profile must be complete
    if (company.profileCompleted < 100) {
      return res.status(400).json({
        success: false,
        message:
          "Please complete your company profile before submitting verification",

        profileCompleted: company.profileCompleted,
      });
    }

    // Already verified
    if (company.verificationStatus === "verified") {
      return res.status(400).json({
        success: false,
        message: "Company is already verified",
      });
    }

    // Already under review
    if (company.verificationStatus === "under_review") {
      return res.status(400).json({
        success: false,
        message: "Company verification is already under review",
      });
    }

    const { documents = [] } = req.body;

    company.verificationDocuments = documents;

    company.verificationStatus = "under_review";

    company.verificationSubmittedAt = new Date();

    company.verificationNote = "";

    await company.save();

    await User.findByIdAndUpdate(userId, {
      corporateVerified: false,
    });

    return res.status(200).json({
      success: true,

      message: "Company verification submitted successfully",

      verificationStatus: company.verificationStatus,

      submittedAt: company.verificationSubmittedAt,
    });
  } catch (error) {
    console.error("Company verification submission error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getCompanyVerificationStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const company = await Company.findOne({
      user: userId,
    }).select(
      "verificationStatus verificationSubmittedAt verificationReviewedAt verificationNote",
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      verification: company,
    });
  } catch (error) {
    console.error("Company verification status error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
