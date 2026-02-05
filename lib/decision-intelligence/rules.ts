export function analyzeDecisionRules({
  riskLevel,
  horizon,
  stakes,
}: {
  riskLevel: string;
  horizon: string;
  stakes: string;
}) {
  const warnings: string[] = [];

  if (riskLevel === "High" && horizon === "Short") {
    warnings.push("High risk with short horizon");
  }

  if (stakes === "High" && riskLevel === "Severe") {
    warnings.push("Severe downside with high stakes");
  }

  return warnings;
}

