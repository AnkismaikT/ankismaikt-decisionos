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

  const biases: string[] = [];
  const downsides: string[] = [];

  if (input.horizon === "short") {
    biases.push("Short-term urgency bias");
  }

  if (input.stakes.toLowerCase().includes("crore")) {
    biases.push("Scale underestimation risk");
    downsides.push("Irreversible capital exposure");
  }

  if (input.domain === "hiring") {
    biases.push("Emotional hiring risk");
    downsides.push("Leadership misfit damage");
  }

  let riskLevel: DecisionOutput["riskLevel"] = "Medium";

  if (biases.length >= 2) riskLevel = "High";
  if (biases.length >= 3) riskLevel = "Severe";

  return {
    riskLevel,
    detectedBiases: biases,
    downsideScenarios: downsides,
    regretAnalysis:
      "Failure would be costly, difficult to reverse, and reputationally damaging.",
    boardRecommendation:
      riskLevel === "Severe"
        ? "Do not proceed without independent validation and staged execution."
        : "Proceed only with safeguards and explicit exit conditions.",
  };
}

