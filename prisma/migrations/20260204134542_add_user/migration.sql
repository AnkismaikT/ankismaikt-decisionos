/*
  Warnings:

  - Added the required column `userId` to the `Decision` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Decision" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "stakes" TEXT NOT NULL,
    "horizon" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "detectedBiases" TEXT NOT NULL,
    "downsideScenarios" TEXT NOT NULL,
    "regretAnalysis" TEXT NOT NULL,
    "boardRecommendation" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Decision_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Decision" ("boardRecommendation", "createdAt", "decision", "detectedBiases", "domain", "downsideScenarios", "horizon", "id", "regretAnalysis", "riskLevel", "stakes") SELECT "boardRecommendation", "createdAt", "decision", "detectedBiases", "domain", "downsideScenarios", "horizon", "id", "regretAnalysis", "riskLevel", "stakes" FROM "Decision";
DROP TABLE "Decision";
ALTER TABLE "new_Decision" RENAME TO "Decision";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
