import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();
    console.log("Received verification request:", { email, code, typeOfCode: typeof code });

    if (!email || !code) {
      console.log("Missing email or code");
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const otpToCheck = String(code).trim();
    console.log("OTP to check:", otpToCheck);

    const verifyOtpQuery = `
      SELECT * FROM otps WHERE email = ? AND otp = ? AND expires_at > NOW() LIMIT 1
    `;
    const otpRecords = (await executeQuery(verifyOtpQuery, [email, otpToCheck])) as any[];
    console.log("OTP records found:", otpRecords);

    if (otpRecords.length === 0) {
      const allOtps = (await executeQuery("SELECT * FROM otps WHERE email = ?", [email])) as any[];
      console.log("All OTPs for email:", allOtps);
      const serverTime = (await executeQuery("SELECT NOW() as now")) as any[];
      console.log("Server time:", serverTime[0].now);
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 401 }
      );
    }

    // Mark user as verified
    const updateUserQuery = "UPDATE users SET verified = 1 WHERE email = ?";
    await executeQuery(updateUserQuery, [email]);
    console.log("User marked as verified:", email);

    // Get user data
    const userQuery = "SELECT id, full_name, email, company_name, role, verified FROM users WHERE email = ? LIMIT 1";
    const users = (await executeQuery(userQuery, [email])) as any[];
    console.log("User found:", users);
    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Clean up OTP
    await executeQuery("DELETE FROM otps WHERE email = ?", [email]);
    console.log("OTP cleaned up for:", email);

    const sessionToken = Math.random().toString(36).substring(2, 15);

    console.log("Verification successful");
    return NextResponse.json({
      user: users[0],
      token: sessionToken,
      message: "OTP verification successful",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: "An error occurred during verification" },
      { status: 500 }
    );
  }
}