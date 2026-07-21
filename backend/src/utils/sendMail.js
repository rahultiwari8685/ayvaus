import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpMail = async (email, otp) => {
  await transporter.sendMail({
    from: `"Flirtaus" <${process.env.EMAIL_USER}>`,

    to: email,

    subject: "Reset Your Flirtaus Password",

    html: `
      <div style="font-family:Arial;padding:30px">

        <h2>Reset Password</h2>

        <p>Your OTP is:</p>

        <h1 style="letter-spacing:6px;color:#ff3366">
            ${otp}
        </h1>

        <p>This OTP is valid for 10 minutes.</p>

        <br/>

        <small>
        If you didn't request this, please ignore this email.
        </small>

      </div>
    `,
  });
};
