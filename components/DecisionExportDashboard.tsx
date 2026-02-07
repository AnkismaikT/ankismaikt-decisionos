"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

/* =====================================================
   Recharts (client-only)
===================================================== */
const PieChart = dynamic(() => import("recharts").then(m => m.PieChart), { ssr: false });
const Pie = dynamic(() => import("recharts").then(m => m.Pie), { ssr: false });
const Cell = dynamic(() => import("recharts").then(m => m.Cell), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(m => m.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(
  () => import("recharts").then(m => m.ResponsiveContainer),
  { ssr: false }
);

/* =====================================================
   Types
===================================================== */
type Decision = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  risk: {
    high: number;
    medium: number;
    low: number;
  };
};

type DecisionIntelligence = {
  decisionScore: number;
  downsideProbability: number;
  regretIndex: number;
  confidenceAdjustedScore: number;
};

/* =====================================================
   Forced Colors (Board-safe)
===================================================== */
const COLORS = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
};

/* =====================================================
   Component
===================================================== */
export default function DecisionExportDashboard() {
  const [mounted, setMounted] = useState(false);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [intel, setIntel] = useState<DecisionIntelligence | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  /* ---------- Mount ---------- */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ---------- Load Decision (mock for UI-only prod) ---------- */
  useEffect(() => {
    if (!mounted) return;

    setDecision({
      id: "DEC-001",
      title: "Equity Allocation – ABC Ltd",
      description:
        "Allocate capital into ABC Ltd based on quarterly breakout and volume expansion.",
      createdAt: new Date().toISOString(),
      risk: {
        high: 35,
        medium: 45,
        low: 20,
      },
    });
  }, [mounted]);

  /* =====================================================
     DECISION INTELLIGENCE (MOCK – BACKEND REMOVED)
  ===================================================== */
  useEffect(() => {
    if (!mounted) return;

    setIntel({
      decisionScore: 71,
      downsideProbability: 42,
      regretIndex: 18,
      confidenceAdjustedScore: 64,
    });
  }, [mounted]);

  /* ---------- Signature Canvas ---------- */
  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#111827";

    let drawing = false;

    const start = (e: MouseEvent) => {
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    };

    const draw = (e: MouseEvent) => {
      if (!drawing) return;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    };

    const stop = () => (drawing = false);

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", draw);
    window.addEventListener("mouseup", stop);

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", draw);
      window.removeEventListener("mouseup", stop);
    };
  }, [mounted]);

  /* ---------- Guards ---------- */
  if (!mounted) return <div style={{ padding: 40 }}>Loading…</div>;
  if (!decision || !intel)
    return <div style={{ padding: 40 }}>Loading decision intelligence…</div>;

  /* ---------- Chart Data ---------- */
  const chartData = [
    { name: "High Risk", value: decision.risk.high, fill: COLORS.high },
    { name: "Medium Risk", value: decision.risk.medium, fill: COLORS.medium },
    { name: "Low Risk", value: decision.risk.low, fill: COLORS.low },
  ];

  const renderLabel = ({ percent }: { percent?: number }) =>
    percent ? `${(percent * 100).toFixed(0)}%` : "";

  /* =====================================================
     PDF EXPORT — AUDIT SAFE
  ===================================================== */
  const exportPdf = async () => {
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF();

    pdf.setProperties({
      title: "Decision Intelligence Record",
      subject: "Board Decision Justification",
      author: "AnkismaikT DecisionOS",
      creator: "AnkismaikT",
    });

    pdf.setFontSize(16);
    pdf.text("Decision Intelligence Record", 10, 20);

    pdf.setFontSize(11);
    pdf.text(`Decision ID: ${decision.id}`, 10, 35);
    pdf.text(`Title: ${decision.title}`, 10, 43);

    pdf.text(`Decision Score: ${intel.decisionScore}/100`, 10, 60);
    pdf.text(`Downside Probability: ${intel.downsideProbability}%`, 10, 68);
    pdf.text(`Regret Index: ${intel.regretIndex}%`, 10, 76);
    pdf.text(`Confidence Adjusted Score: ${intel.confidenceAdjustedScore}`, 10, 84);

    if (signature) {
      pdf.text("Authorized Signature:", 10, 100);
      pdf.addImage(signature, "PNG", 10, 105, 60, 25);
    }

    pdf.setFontSize(9);
    pdf.text(
      "Disclaimer: This document records structured decision reasoning at the time of approval. "
        + "It is not a prediction or guarantee of outcome.",
      10,
      280
    );

    pdf.save(`${decision.id}-decision-report.pdf`);
  };

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>
        AnkismaikT DecisionOS — Board Decision Report
      </h1>

      <p style={{ marginTop: 6, color: "#4b5563" }}>
        Structured, risk-adjusted decision intelligence for leadership review.
      </p>

      <button
        onClick={exportPdf}
        style={{
          marginTop: 16,
          padding: "8px 16px",
          background: "#4f46e5",
          color: "#fff",
          borderRadius: 6,
          border: "none",
          cursor: "pointer",
        }}
      >
        Export Board PDF
      </button>

      <section
        style={{
          marginTop: 24,
          padding: 16,
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          background: "#ffffff",
        }}
      >
        <h3 style={{ fontWeight: 600 }}>Decision Intelligence Summary</h3>

        <ul style={{ marginTop: 8, fontSize: 14 }}>
          <li>• Decision Score: <strong>{intel.decisionScore}/100</strong></li>
          <li>• Downside Probability: <strong>{intel.downsideProbability}%</strong></li>
          <li>• Regret Index: <strong>{intel.regretIndex}%</strong></li>
          <li>• Confidence-Adjusted Score: <strong>{intel.confidenceAdjustedScore}</strong></li>
        </ul>

        <p style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>
          Scores reflect reasoning quality and risk calibration, not outcome prediction.
        </p>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24 }}>
        <div
          style={{
            height: 360,
            padding: 16,
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
          }}
        >
          <h3>Risk Distribution</h3>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                innerRadius={55}
                outerRadius={125}
                label={renderLabel}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} stroke="#fff" strokeWidth={2} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) =>
                  typeof value === "number" ? `${value}%` : ""
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3>CEO / Board Authorization</h3>
          <canvas
            ref={canvasRef}
            width={360}
            height={150}
            style={{
              marginTop: 8,
              border: "2px dashed #9ca3af",
              background: "#fff",
              borderRadius: 6,
            }}
          />
          <button
            onClick={() =>
              canvasRef.current &&
              setSignature(canvasRef.current.toDataURL("image/png"))
            }
            style={{
              marginTop: 10,
              padding: "6px 12px",
              background: "#059669",
              color: "#fff",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
            }}
          >
            Save Signature
          </button>
        </div>
      </div>
    </div>
  );
}

