import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { runDecisionIntelligence } from "@/lib/decision-intelligence/decisionLLM";

export async function POST() {
  let analysis;

  // ✅ SAFETY: Never allow analysis failure to create empty PDF
  try {
    analysis = await runDecisionIntelligence({
      decision: "Expand into Middle East market",
      stakes: "₹120 Crore capital commitment",
      horizon: "long",
      domain: "strategy",
    });
  } catch (error) {
    analysis = {
      riskLevel: "Unknown",
      detectedBiases: ["Decision analysis unavailable"],
      downsideScenarios: ["Unable to generate downside scenarios"],
      regretAnalysis:
        "Decision intelligence could not be generated due to a system error.",
      boardRecommendation:
        "Do not proceed until a complete decision analysis is available.",
    };
  }

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const margin = 50;
  let y = 800;

  function drawLine(text: string, size = 12) {
    if (y < margin) return;
    page.drawText(text, {
      x: margin,
      y,
      size,
      font,
      color: rgb(0, 0, 0),
      maxWidth: 495,
      lineHeight: size + 4,
    });
    y -= size + 10;
  }

  // HEADER
  drawLine("AnkismaikT DecisionOS", 20);
  drawLine("Board Decision Report", 14);
  y -= 20;

  // SUMMARY
  drawLine("Decision Summary", 14);
  drawLine("Expand into Middle East market");
  y -= 10;

  // RISK
  drawLine(`Risk Level: ${analysis.riskLevel}`);
  y -= 10;

  // BIASES
  drawLine("Detected Biases:");
  analysis.detectedBiases.forEach((b: string) =>
    drawLine(`• ${b}`)
  );
  y -= 10;

  // DOWNSIDE
  drawLine("Downside Scenarios:");
  analysis.downsideScenarios.forEach((d: string) =>
    drawLine(`• ${d}`)
  );
  y -= 10;

  // REGRET
  drawLine("Regret Analysis:");
  drawLine(analysis.regretAnalysis);
  y -= 20;

  // BOARD REC
  drawLine("Board Recommendation", 14);
  drawLine(analysis.boardRecommendation);

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        'attachment; filename="DecisionOS-Board-Report.pdf"',
    },
  });
}

