import Company from "../models/Company.js";
import User from "../models/User.js";

export const getCompanyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const company = await Company.findOne({
      user: userId,
    }).populate("user", "name email phone");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    console.error("Get company profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const updateCompanyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      companyName,
      logo,
      website,
      industry,
      companySize,
      description,
      phone,
      officialEmail,
      address,
      registrationType,
      registrationNumber,
      gstin,
      cin,
      authorizedPerson,
    } = req.body;

    const company = await Company.findOne({
      user: userId,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    // Update only provided fields

    if (companyName !== undefined) company.companyName = companyName;

    if (logo !== undefined) company.logo = logo;

    if (website !== undefined) company.website = website;

    if (industry !== undefined) company.industry = industry;

    if (companySize !== undefined) company.companySize = companySize;

    if (description !== undefined) company.description = description;

    if (phone !== undefined) company.phone = phone;

    if (officialEmail !== undefined) company.officialEmail = officialEmail;

    if (address !== undefined) company.address = address;

    if (registrationType !== undefined)
      company.registrationType = registrationType;

    if (registrationNumber !== undefined)
      company.registrationNumber = registrationNumber;

    if (gstin !== undefined) company.gstin = gstin;

    if (cin !== undefined) company.cin = cin;

    if (authorizedPerson !== undefined)
      company.authorizedPerson = authorizedPerson;

    let completed = 0;
    const total = 10;

    if (company.companyName) completed++;

    if (company.logo) completed++;

    if (company.website) completed++;

    if (company.industry) completed++;

    if (company.companySize) completed++;

    if (company.description) completed++;

    if (company.address && company.address.city && company.address.state) {
      completed++;
    }

    if (company.registrationType) completed++;

    if (company.authorizedPerson?.name) completed++;

    if (company.authorizedPerson?.designation) {
      completed++;
    }

    company.profileCompleted = Math.round((completed / total) * 100);

    await company.save();

    // Update User
    await User.findByIdAndUpdate(userId, {
      corporateProfileCompleted: company.profileCompleted === 100,
    });

    return res.status(200).json({
      success: true,

      message: "Company profile updated successfully",

      profileCompleted: company.profileCompleted,

      company,
    });
  } catch (error) {
    console.error("Update company profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
