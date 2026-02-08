import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { prisma } from "@/lib/db/prisma";
import fs from "fs";
import path from "path";

/**
 * Derive qualitative risk level from numeric riskScore
 */
function getRiskLevel(score: number): "Low" | "Medium" | "High" | "Severe" {
  if (score >= 80) return "Severe";
  if (score >= 60) return "High";
  if (score >= 35) return "Medium";
  return "Low";
}

export async function GET() {
  const decisions = await prisma.decision.findMany({
    orderBy: { createdAt: "desc" },
  });

  const pdfDoc = await PDFDocument.create();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Load logo
  let logoImage: any = null;
  try {
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    const logoBytes = fs.readFileSync(logoPath);
    logoImage = await pdfDoc.embedPng(logoBytes);
  } catch {
    logoImage = null;
  }

  const pageWidth = 595;
  const pageHeight = 842;
  let pageNumber = 1;

  // ---------- HELPERS ----------
  const drawHeader = (page: any) => {
    if (logoImage) {
      page.drawImage(logoImage, {
        x: 40,
        y: pageHeight - 60,
        width: 40,
        height: 40,
      });
    }

    page.drawText("AnkismaikT DecisionOS", {
      x: 100,
      y: pageHeight - 40,
      size: 16,
      font: boldFont,
    });

    page.drawText("Board Decision Intelligence Report", {
      x: 100,
      y: pageHeight - 60,
      size: 10,
      font,
    });

    page.drawText("CONFIDENTIAL", {
      x: 120,
      y: 400,
      size: 60,
      font: boldFont,
      rotate: { type: "degrees", angle: 45 },
      color: rgb(0.85, 0.85, 0.85),
      opacity: 0.3,
    });
  };

  const drawFooter = (page: any) => {
    page.drawText(
      `Generated on ${new Date().toLocaleDateString()} | Page ${pageNumber}`,
      {
        x: 40,
        y: 30,
        size: 9,
        font,
        color: rgb(0.4, 0.4, 0.4),
      }
    );
  };

  // ---------- EXECUTIVE SUMMARY ----------
  const total = decisions.length;

  const riskLevels = decisions.map((d) =>
    getRiskLevel(d.riskScore)
  );

  const highRisk = riskLevels.filter(
    (r) => r === "High" || r === "Severe"
  ).length;

  const mediumRisk = riskLevels.filter(
    (r) => r === "Medium"
  ).length;

  const dominantDomain =
    decisions.reduce<Record<string, number>>((acc, d) => {
      acc[d.domain] = (acc[d.domain] || 0) + 1;
      return acc;
    }, {}) || {};

  const topDomain =
    Object.entries(dominantDomain).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "Mixed Domains";

  const boardTone =
    highRisk > total / 2
      ? "The organization is currently operating under elevated strategic risk."
      : "The organization maintains a balanced and controlled risk posture.";

  const recommendation =
    highRisk > total / 2
      ? "It is recommended that high-risk initiatives undergo phased execution with enhanced board oversight."
      : "Current initiatives are aligned with acceptable risk tolerance. Continued execution is recommended.";

  // ---------- PAGE 1 ----------
  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  drawHeader(page);

  let y = pageHeight - 120;

  page.drawText("Executive Summary", {
    x: 40,
    y,
    size: 18,
    font: boldFont,
  });

  y -= 30;

  const summaryText = `
This report consolidates ${total} strategic decisions recorded within AnkismaikT DecisionOS.

Primary decision activity is concentrated in the "${topDomain}" domain.
${boardTone}

Risk Overview:
• High / Severe Risk Decisions: ${highRisk}
• Medium Risk Decisions: ${mediumRisk}
• Total Decisions Assessed: ${total}

Board Recommendation:
${recommendation}
`;

  page.drawText(summaryText.trim(), {
    x: 40,
    y,
    size: 11,
    font,
    maxWidth: 500,
    lineHeight: 16,
  });

  drawFooter(page);

  // ---------- DETAIL PAGES ----------
  pageNumber++;
  page = pdfDoc.addPage([pageWidth, pageHeight]);
  drawHeader(page);
  y = pageHeight - 100;

  for (let i = 0; i < decisions.length; i++) {
    const d = decisions[i];
    const riskLevel = getRiskLevel(d.riskScore);

    if (y < 120) {
      drawFooter(page);
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      pageNumber++;
      drawHeader(page);
      y = pageHeight - 100;
    }

    page.drawText(
      `${i + 1}. ${d.domain} | Risk: ${riskLevel}`,
      {
        x: 40,
        y,
        size: 11,
        font: boldFont,
      }
    );
    y -= 14;

    page.drawText(d.decision, {
      x: 40,
      y,
      size: 10,
      font,
      maxWidth: 500,
      lineHeight: 14,
    });

    y -= 28;
  }

  drawFooter(page);

  const pdfBytes = await pdfDoc.save();
  const body = new Uint8Array(pdfBytes);

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        'attachment; filename="DecisionOS-Board-Report.pdf"',
      "Content-Length": body.length.toString(),
      "Cache-Control": "no-store",
    },
  });
}

