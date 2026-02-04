-- CreateTable
CREATE TABLE "Decision" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "domain" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "stakes" TEXT NOT NULL,
    "horizon" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "detectedBiases" TEXT NOT NULL,
    "downsideScenarios" TEXT NOT NULL,
    "regretAnalysis" TEXT NOT NULL,
    "boardRecommendation" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
