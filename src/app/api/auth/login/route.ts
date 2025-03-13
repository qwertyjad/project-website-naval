import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // In a real app, you would hash the password before comparing
    // This is a simplified example
    const query = "SELECT * FROM users WHERE email = ? LIMIT 1";
    const users = (await executeQuery(query, [email])) as any[];

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const user = users[0];

    // In a real app, you would use a proper password comparison
    // like bcrypt.compare(password, user.password)
    if (user.password !== password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Remove password from the response
    delete user.password;

    return NextResponse.json({
      user,
      message: "Login successful",
      requiresTwoFactor: user.two_factor_enabled === 1,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 },
    );
  }
}
