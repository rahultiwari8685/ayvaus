import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Employee from "../models/Employee.js";
import Company from "../models/Company.js";

import { generateReferralCode } from "../helpers/generateReferralCode.js";

const generateCorporateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      accountType: user.accountType,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

export const registerEmployee = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      phone,
      password: hashedPassword,

      accountType: "employee",

      corporateProfileCompleted: false,

      corporateVerified: false,

      referralCode: generateReferralCode(),
    });

    await Employee.create({
      user: user._id,
    });

    const token = generateCorporateToken(user);

    return res.status(201).json({
      success: true,
      message: "Employee registered successfully",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        accountType: user.accountType,
        corporateProfileCompleted: user.corporateProfileCompleted,
        corporateVerified: user.corporateVerified,
      },
    });
  } catch (error) {
    console.error("Employee registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const registerCompany = async (req, res) => {
  try {
    const { name, email, phone, password, companyName } = req.body;

    if (!name || !email || !password || !companyName) {
      return res.status(400).json({
        success: false,
        message: "Name, company name, email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      phone,
      password: hashedPassword,

      accountType: "company",

      corporateProfileCompleted: false,

      corporateVerified: false,

      referralCode: generateReferralCode(),
    });

    await Company.create({
      user: user._id,
      companyName,
      phone,
      officialEmail: normalizedEmail,
    });

    const token = generateCorporateToken(user);

    return res.status(201).json({
      success: true,
      message: "Company registered successfully",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        accountType: user.accountType,
        corporateProfileCompleted: user.corporateProfileCompleted,
        corporateVerified: user.corporateVerified,
      },
    });
  } catch (error) {
    console.error("Company registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const corporateLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,

      accountType: {
        $in: ["employee", "company"],
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateCorporateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        accountType: user.accountType,

        corporateProfileCompleted: user.corporateProfileCompleted,

        corporateVerified: user.corporateVerified,
      },
    });
  } catch (error) {
    console.error("Corporate login error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
