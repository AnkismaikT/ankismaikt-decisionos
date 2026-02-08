import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

type JWTPayload = {
  userId: string;
  email?: string;
};

export async function POST(req: Request) {
  try {
    /* 1️⃣ Read auth cookie (Next.js 16 requires await) */
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    /* 2️⃣ Verify JWT */
    let payload: JWTPayload;
    try {
      payload = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as JWTPayload;
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (!payload?.userId) {
      return NextResponse.json(
        { error: "Invalid authentication payload" },
        { status: 401 }
      );
    }

    /* 3️⃣ Parse request body safely */
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { domain = "strategy", decision, stakes, horizon } = body;

    if (!decision || !stakes || !horizon) {
      return NextResponse.json(
        { error: "decision, stakes, and horizon are required" },
        { status: 400 }
      );
    }

    /* 4️⃣ Persist decision (base intelligence layer) */
    const savedDecision = await prisma.decision.create({
      data: {
        userId: payload.userId,
        domain,
        decision,
        stakes,
        horizon,

        // Base metrics (AI will enhance later)
        riskScore: 50,
        downsideProbability: 30,
        regretIndex: 20,
        confidenceScore: 60,

        boardRecommendation:
          "Decision recorded. AI analysis pending.",
      },
    });

    /* 5️⃣ Respond */
    return NextResponse.json(
      {
        success: true,
        decision: savedDecision,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ DECISION_ANALYZE_ERROR:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

