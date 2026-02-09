import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    // 1️⃣ Parse body
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    console.log("LOGIN_ATTEMPT:", email);

    // 2️⃣ Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("LOGIN_FAIL: user not found");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 3️⃣ Verify password
    const isValid = await bcrypt.compare(password, user.password);

    console.log("PASSWORD_VALID:", isValid);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 4️⃣ Create JWT
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5️⃣ Response + cookie
    const response = NextResponse.json({
      success: true,
      token, // useful for frontend / debugging
      user: {
        id: user.id,
        email: user.email,
      },
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    console.log("LOGIN_SUCCESS:", email);

    return response;
  } catch (err) {
    console.error("LOGIN_ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

