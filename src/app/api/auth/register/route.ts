import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password, companyName, agreeToTerms } =
      await request.json();

    // Validate input
    if (!fullName || !email || !password || !companyName || !agreeToTerms) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const checkQuery = "SELECT * FROM users WHERE email = ? LIMIT 1";
    const existingUsers = (await executeQuery(checkQuery, [email])) as any[];

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 },
      );
    }

    // In a real app, you would hash the password before storing
    // Insert new user
    const insertQuery = `
      INSERT INTO users (full_name, email, password, company_name, role, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    const result = (await executeQuery(insertQuery, [
      fullName,
      email,
      password, // In a real app, this would be hashed
      companyName,
      "Admin",
    ])) as any;

    if (result.affectedRows > 0) {
      return NextResponse.json({
        message: "Registration successful",
        userId: result.insertId,
      });
    } else {
      throw new Error("Failed to insert user");
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 },
    );
  }
}
