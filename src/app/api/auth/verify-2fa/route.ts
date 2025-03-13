import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    // Validate input
    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 },
      );
    }

    // In a real app, you would validate the 2FA code against a proper 2FA system
    // This is a simplified example that accepts any 6-digit code for demo purposes
    if (code.length !== 6 || !/^\d+$/.test(code)) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 401 },
      );
    }

    // Get user data to return
    const query =
      "SELECT id, full_name, email, company_name, role FROM users WHERE email = ? LIMIT 1";
    const users = (await executeQuery(query, [email])) as any[];

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create a session token (in a real app, this would be a JWT)
    const sessionToken = Math.random().toString(36).substring(2, 15);

    return NextResponse.json({
      user: users[0],
      token: sessionToken,
      message: "Two-factor authentication successful",
    });
  } catch (error) {
    console.error("2FA verification error:", error);
    return NextResponse.json(
      { error: "An error occurred during verification" },
      { status: 500 },
    );
  }
}
