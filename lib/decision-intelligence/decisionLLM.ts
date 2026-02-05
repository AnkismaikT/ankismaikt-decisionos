import OpenAI from "openai";

let openai: OpenAI | null = null;

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  return openai;
}

export type DecisionInput = {
  decision: string;
  stakes: string;
  horizon: "short" | "mid" | "long";
  domain: "strategy" | "capital" | "hiring" | "operations";
};

export type DecisionOutput = {
  riskLevel: "Low" | "Medium" | "High" | "Severe";
  detectedBiases: string[];
  downsideScenarios: string[];
  regretAnalysis: string;
  boardRecommendation: string;
};

export async function runDecisionIntelligence(
  input: DecisionInput
): Promise<DecisionOutput> {
  const client = getOpenAI();

  // 🟢 SAFE FALLBACK (NO API KEY)
  if (!client) {
    return {
      riskLevel: "Medium",
      detectedBiases: [
        "Insufficient external validation",
        "Potential optimism bias",
      ],
      downsideScenarios: [
        "Execution may exceed planned timelines",
        "Market conditions may shift unexpectedly",
      ],
      regretAnalysis:
        "If unsuccessful, the primary regret would stem from opportunity cost and delayed strategic positioning.",
      boardRecommendation:
        "Proceed with caution. Implement phased execution with defined review checkpoints.",
    };
  }

  // 🔵 REAL AI PATH (ONLY WHEN KEY EXISTS)
  const response = await client.responses.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    input: [
      {
        role: "system",
        content:
          "You are an enterprise decision intelligence system. Output ONLY valid JSON.",
      },
      {
        role: "user",
        content: `
Analyze the decision BEFORE execution.

Decision: ${input.decision}
Stakes: ${input.stakes}
Time Horizon: ${input.horizon}
Domain: ${input.domain}

Return JSON with:
- riskLevel
- detectedBiases
- downsideScenarios
- regretAnalysis
- boardRecommendation
        `,
      },
    ],
  });

  const json = response.output_parsed;

  if (!json) {
    throw new Error("No JSON returned from OpenAI");
  }

  return json as DecisionOutput;
}

