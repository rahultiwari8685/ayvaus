import Employee from "../models/Employee.js";
import User from "../models/User.js";

export const getEmployeeProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const employee = await Employee.findOne({
      user: userId,
    }).populate("user", "name email");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error("Get employee profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const updateEmployeeProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      profilePhoto,
      dateOfBirth,
      location,
      headline,
      currentJobTitle,
      experienceYears,
      skills,
      education,
      employmentHistory,
      resume,
      expectedSalary,
      preferredLocations,
      workMode,
      employmentType,
      noticePeriod,
    } = req.body;

    const employee = await Employee.findOne({
      user: userId,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    // Only update fields that were provided
    if (profilePhoto !== undefined) employee.profilePhoto = profilePhoto;

    if (dateOfBirth !== undefined) employee.datefOBirth = dateOfBirth;

    if (location !== undefined) employee.location = location;

    if (headline !== undefined) employee.headline = headline;

    if (currentJobTitle !== undefined)
      employee.currentJobTitle = currentJobTitle;

    if (experienceYears !== undefined)
      employee.experienceYears = experienceYears;

    if (skills !== undefined) employee.skills = skills;

    if (education !== undefined) employee.education = education;

    if (employmentHistory !== undefined)
      employee.employmentHistory = employmentHistory;

    if (resume !== undefined) employee.resume = resume;

    if (expectedSalary !== undefined) employee.expectedSalary = expectedSalary;

    if (preferredLocations !== undefined)
      employee.preferredLocations = preferredLocations;

    if (workMode !== undefined) employee.workMode = workMode;

    if (employmentType !== undefined) employee.employmentType = employmentType;

    if (noticePeriod !== undefined) employee.noticePeriod = noticePeriod;

    // Calculate profile completion
    let completed = 0;
    let total = 10;

    if (employee.profilePhoto) completed++;

    if (employee.headline) completed++;

    if (employee.currentJobTitle) completed++;

    if (employee.experienceYears > 0) completed++;

    if (employee.skills && employee.skills.length > 0) completed++;

    if (employee.education && employee.education.length > 0) completed++;

    if (employee.employmentHistory && employee.employmentHistory.length > 0)
      completed++;

    if (employee.resume) completed++;

    if (employee.preferredLocations && employee.preferredLocations.length > 0)
      completed++;

    if (employee.workMode && employee.workMode.length > 0) completed++;

    employee.profileCompleted = Math.round((completed / total) * 100);

    await employee.save();

    // Update User
    await User.findByIdAndUpdate(userId, {
      corporateProfileCompleted: employee.profileCompleted === 100,
    });

    return res.status(200).json({
      success: true,
      message: "Employee profile updated successfully",

      profileCompleted: employee.profileCompleted,

      employee,
    });
  } catch (error) {
    console.error("Update employee profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
