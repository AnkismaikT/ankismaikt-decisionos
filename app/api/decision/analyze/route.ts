import { NextResponse } from "next/server";
import {
  runDecisionIntelligence,
  DecisionInput,
} from "@/lib/decision-intelligence/decisionLLM";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const input: DecisionInput = {
      decision: body.decision,
      stakes: body.stakes,
      horizon: body.horizon,
      domain: body.domain,
    };

    // 1️⃣ Run LLM decision intelligence
    const analysis = await runDecisionIntelligence(input);

    // 2️⃣ Persist decision + analysis (AUDIT TRAIL)
    await prisma.decision.create({
      data: {
        domain: input.domain,
        decision: input.decision,
        stakes: input.stakes,
        horizon: input.horizon,
        riskLevel: analysis.riskLevel,
        detectedBiases: JSON.stringify(analysis.detectedBiases),
        downsideScenarios: JSON.stringify(analysis.downsideScenarios),
        regretAnalysis: analysis.regretAnalysis,
        boardRecommendation: analysis.boardRecommendation,
      },
    });

    // 3️⃣ Return response to UI
    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Decision analysis failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Decision analysis failed",
      },
      { status: 500 }
    );
  }
}

