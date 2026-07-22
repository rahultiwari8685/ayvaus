import dotenv from "dotenv";
dotenv.config();

console.log("cwd:", process.cwd());
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Missing");

import nodemailer from "nodemailer";

export const sendOtpMail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Flirtaus" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your Flirtaus Password",
    html: `<h2>Your OTP is ${otp}</h2>`,
  });
};
