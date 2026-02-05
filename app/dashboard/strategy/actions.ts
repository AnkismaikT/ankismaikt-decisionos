"use server";

import { prisma } from "@/lib/db/prisma";
import { ensureUser } from "@/lib/auth/ensureUser";

/**
 * CREATE
 */
export async function saveDecision(formData: FormData) {
  const userId = await ensureUser();

  await prisma.decision.create({
    data: {
      userId,
      domain: String(formData.get("domain")),
      decision: String(formData.get("decision")),
      stakes: String(formData.get("stakes") || ""),
      horizon: String(formData.get("horizon") || ""),
      riskLevel: String(formData.get("riskLevel") || ""),
      detectedBiases: "",
      downsideScenarios: "",
      regretAnalysis: "",
      boardRecommendation: "",
    },
  });
}

/**
 * UPDATE
 */
export async function updateDecision(
  id: string,
  formData: FormData
) {
  await prisma.decision.update({
    where: { id },
    data: {
      domain: String(formData.get("domain")),
      decision: String(formData.get("decision")),
      stakes: String(formData.get("stakes") || ""),
      horizon: String(formData.get("horizon") || ""),
      riskLevel: String(formData.get("riskLevel") || ""),
    },
  });
}

/**
 * DELETE (for next step)
 */
export async function deleteDecision(id: string) {
  await prisma.decision.delete({
    where: { id },
  });
}

