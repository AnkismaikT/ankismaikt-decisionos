import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

  const response = await openai.responses.create({
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

  // ✅ This is GUARANTEED JSON
  const json = response.output_parsed;

  if (!json) {
    throw new Error("No JSON returned from OpenAI");
  }

  return json as DecisionOutput;
}

