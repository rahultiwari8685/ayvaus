import Employee from "../models/Employee.js";
import User from "../models/User.js";

export const submitEmployeeVerification = async (req, res) => {
  try {
    const userId = req.user.id;

    const employee = await Employee.findOne({
      user: userId,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    if (employee.profileCompleted < 100) {
      return res.status(400).json({
        success: false,
        message: "Please complete your profile before submitting verification",
        profileCompleted: employee.profileCompleted,
      });
    }

    if (employee.verificationStatus === "verified") {
      return res.status(400).json({
        success: false,
        message: "Employee is already verified",
      });
    }

    if (employee.verificationStatus === "under_review") {
      return res.status(400).json({
        success: false,
        message: "Your verification is already under review",
      });
    }

    const { documents = [] } = req.body;

    employee.verificationDocuments = documents;

    employee.verificationStatus = "under_review";

    employee.verificationSubmittedAt = new Date();

    employee.verificationNote = "";

    await employee.save();

    await User.findByIdAndUpdate(userId, {
      corporateVerified: false,
    });

    return res.status(200).json({
      success: true,
      message: "Employee verification submitted successfully",

      verificationStatus: employee.verificationStatus,

      submittedAt: employee.verificationSubmittedAt,
    });
  } catch (error) {
    console.error("Employee verification submission error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getEmployeeVerificationStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    const employee = await Employee.findOne({
      user: userId,
    }).select(
      "verificationStatus verificationSubmittedAt verificationReviewedAt verificationNote",
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      verification: employee,
    });
  } catch (error) {
    console.error("Employee verification status error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
