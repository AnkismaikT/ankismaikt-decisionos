import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // 1️⃣ Get cookies (ASYNC in Next 16)
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // 2️⃣ Verify JWT
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // 3️⃣ Read request body
    const { domain, decision, stakes, horizon } = await req.json();

    if (!decision || !stakes || !horizon) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // 4️⃣ Save decision
    const saved = await prisma.decision.create({
      data: {
        userId: payload.userId,
        domain,
        decision,
        stakes,
        horizon,
        riskScore: 50,
        downsideProbability: 30,
        regretIndex: 20,
        confidenceScore: 60,
        boardRecommendation:
          "Initial analysis recorded. AI engine will enhance this.",
      },
    });

    return NextResponse.json(saved);
  } catch (err) {
    console.error("DECISION_ANALYZE_ERROR", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

