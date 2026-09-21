import Employee from "../models/Employee.js";
import Company from "../models/Company.js";
import User from "../models/User.js";

export const getPendingEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({
      verificationStatus: "under_review",
    })
      .populate("user", "name email phone corporateVerified")
      .sort({
        verificationSubmittedAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error("Get pending employees error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
export const getPendingCompanies = async (req, res) => {
  try {
    const companies = await Company.find({
      verificationStatus: "under_review",
    })
      .populate("user", "name email phone corporateVerified")
      .sort({
        verificationSubmittedAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    console.error("Get pending companies error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const verifyEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const adminId = req.user.id;

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    if (employee.verificationStatus !== "under_review") {
      return res.status(400).json({
        success: false,
        message: "Employee is not currently under review",
      });
    }

    employee.verificationStatus = "verified";

    employee.verificationReviewedAt = new Date();

    employee.verificationReviewedBy = adminId;

    employee.verificationNote = req.body?.note || "Verified by admin";

    await employee.save();

    await User.findByIdAndUpdate(employee.user, {
      corporateVerified: true,
    });

    return res.status(200).json({
      success: true,
      message: "Employee verified successfully",
      verificationStatus: employee.verificationStatus,
    });
  } catch (error) {
    console.error("Verify employee error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const rejectEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const adminId = req.user.id;

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const note = req.body?.note || "Verification rejected";

    employee.verificationStatus = "rejected";

    employee.verificationReviewedAt = new Date();

    employee.verificationReviewedBy = adminId;

    employee.verificationNote = note;

    await employee.save();

    await User.findByIdAndUpdate(employee.user, {
      corporateVerified: false,
    });

    return res.status(200).json({
      success: true,
      message: "Employee verification rejected",
      verificationStatus: employee.verificationStatus,
      note,
    });
  } catch (error) {
    console.error("Reject employee error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const verifyCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const adminId = req.user.id;

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (company.verificationStatus !== "under_review") {
      return res.status(400).json({
        success: false,
        message: "Company is not currently under review",
      });
    }

    company.verificationStatus = "verified";

    company.verificationReviewedAt = new Date();

    company.verificationReviewedBy = adminId;

    company.verificationNote = req.body?.note || "Verified by admin";

    await company.save();

    await User.findByIdAndUpdate(company.user, {
      corporateVerified: true,
    });

    return res.status(200).json({
      success: true,
      message: "Company verified successfully",
      verificationStatus: company.verificationStatus,
    });
  } catch (error) {
    console.error("Verify company error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const rejectCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const adminId = req.user.id;

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const note = req.body?.note || "Verification rejected";

    company.verificationStatus = "rejected";

    company.verificationReviewedAt = new Date();

    company.verificationReviewedBy = adminId;

    company.verificationNote = note;

    await company.save();

    await User.findByIdAndUpdate(company.user, {
      corporateVerified: false,
    });

    return res.status(200).json({
      success: true,
      message: "Company verification rejected",
      verificationStatus: company.verificationStatus,
      note,
    });
  } catch (error) {
    console.error("Reject company error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
