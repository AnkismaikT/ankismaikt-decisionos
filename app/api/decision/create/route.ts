import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Basic validation (prevents silent DB failure)
    if (
      !body.domain ||
      !body.description ||
      !body.stakes ||
      !body.horizon ||
      !body.riskLevel
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const decision = await prisma.decision.create({
      data: {
        domain: body.domain,
        description: body.description,
        stakes: body.stakes,
        horizon: body.horizon,
        riskLevel: body.riskLevel,
        analysisRun: false,
        includedInReport: false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        decision,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("CREATE DECISION FAILED:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Database error while creating decision",
      },
      { status: 500 }
    );
  }
}

