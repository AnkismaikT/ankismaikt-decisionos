import { NextResponse } from "next/server";
import {
  runDecisionIntelligence,
  DecisionInput,
} from "@/lib/decision-intelligence/decisionLLM";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const input: DecisionInput = {
      decision: body.decision,
      stakes: body.stakes,
      horizon: body.horizon,
      domain: body.domain,
    };

    const analysis = await runDecisionIntelligence(input);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Decision analysis failed" },
      { status: 500 }
    );
  }
}

