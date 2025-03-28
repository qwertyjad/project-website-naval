import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password, companyName, agreeToTerms, resend } = await request.json();
    console.log("Register request:", { fullName, email, companyName, resend });

    if (resend) {
      if (!email) {
        return NextResponse.json({ error: "Email is required for resend" }, { status: 400 });
      }

      const generatedOTP = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

      // Delete existing OTPs
      await executeQuery("DELETE FROM otps WHERE email = ?", [email]);
      console.log("Cleared existing OTPs for:", email);

      // Insert new OTP
      const insertOtpQuery = `
        INSERT INTO otps (email, otp, expires_at)
        VALUES (?, ?, NOW() + INTERVAL 15 MINUTE)
      `;
      const otpResult = (await executeQuery(insertOtpQuery, [email, generatedOTP])) as any;
      
      const serverTime = (await executeQuery("SELECT NOW() as now")) as any[];
      console.log("Resend OTP stored:", { otp: generatedOTP, expiresAt: "NOW() + 15 MINUTE", serverTime: serverTime[0].now, result: otpResult });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your New Registration OTP",
        text: `Your new OTP is: ${generatedOTP}. It expires in 15 minutes.`,
      };
      await transporter.sendMail(mailOptions);
      console.log("Resend OTP email sent to:", email);

      return NextResponse.json({ message: "New OTP sent to your email" });
    }

    if (!fullName || !email || !password || !companyName || !agreeToTerms) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const checkQuery = "SELECT * FROM users WHERE email = ? LIMIT 1";
    const existingUsers = (await executeQuery(checkQuery, [email])) as any[];
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    const insertQuery = `
      INSERT INTO users (full_name, email, password, company_name, role, created_at, verified)
      VALUES (?, ?, ?, ?, ?, NOW(), 0)
    `;
    const result = (await executeQuery(insertQuery, [
      fullName,
      email,
      password, // TODO: Hash this
      companyName,
      "Admin",
    ])) as any;

    const generatedOTP = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });

    // Delete existing OTPs
    await executeQuery("DELETE FROM otps WHERE email = ?", [email]);
    console.log("Cleared existing OTPs for:", email);

    const insertOtpQuery = `
      INSERT INTO otps (email, otp, expires_at)
      VALUES (?, ?, NOW() + INTERVAL 15 MINUTE)
    `;
    const otpResult = (await executeQuery(insertOtpQuery, [email, generatedOTP])) as any;
    
    const serverTime = (await executeQuery("SELECT NOW() as now")) as any[];
    console.log("OTP stored:", { otp: generatedOTP, expiresAt: "NOW() + 15 MINUTE", serverTime: serverTime[0].now, result: otpResult });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Registration OTP",
      text: `Your OTP is: ${generatedOTP}. It expires in 15 minutes.`,
    };
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent to:", email);

    return NextResponse.json({
      message: "Registration successful, OTP sent to your email",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}