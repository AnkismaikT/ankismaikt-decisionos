"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

/* =====================================================
   Recharts (client-only, forced color safe)
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

/* =====================================================
   FORCED COLORS (NO GRAY POSSIBLE)
===================================================== */
const COLORS = {
  high: "#ef4444",   // RED
  medium: "#f59e0b", // AMBER
  low: "#22c55e",    // GREEN
};

/* =====================================================
   Component
===================================================== */
export default function DecisionExportDashboard() {
  const [mounted, setMounted] = useState(false);
  const [decision, setDecision] = useState<Decision | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  /* ---------- Mount ---------- */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* ---------- Demo Data ---------- */
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

  /* ---------- Signature Canvas ---------- */
  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

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

    const stop = () => {
      drawing = false;
    };

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
  if (!mounted) {
    return <div style={{ padding: 40 }}>Loading Decision Dashboard…</div>;
  }

  if (!decision) {
    return <div style={{ padding: 40 }}>No decision loaded</div>;
  }

  /* =====================================================
     CHART DATA WITH INLINE COLORS (KEY FIX)
  ===================================================== */
  const chartData = [
    { name: "High Risk", value: decision.risk.high, fill: COLORS.high },
    { name: "Medium Risk", value: decision.risk.medium, fill: COLORS.medium },
    { name: "Low Risk", value: decision.risk.low, fill: COLORS.low },
  ];

  const renderLabel = ({ percent }: { percent?: number }) =>
    percent ? `${(percent * 100).toFixed(0)}%` : "";

  /* ---------- PDF ---------- */
  const exportPdf = async () => {
    const { jsPDF } = await import("jspdf");

    const pdf = new jsPDF();
    pdf.setFontSize(14);
    pdf.text("Decision Record", 10, 20);
    pdf.text(`ID: ${decision.id}`, 10, 35);
    pdf.text(`Title: ${decision.title}`, 10, 45);

    if (signature) {
      pdf.text("Authorized Signature:", 10, 65);
      pdf.addImage(signature, "PNG", 10, 70, 60, 25);
    }

    pdf.save(`${decision.id}.pdf`);
  };

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
        AnkismaikT DecisionOS – Decisions
      </h1>

      <button
        onClick={exportPdf}
        style={{
          padding: "8px 16px",
          background: "#4f46e5",
          color: "#fff",
          borderRadius: 6,
          border: "none",
          marginBottom: 24,
          cursor: "pointer",
        }}
      >
        Export Decision PDF
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* ================= Chart ================= */}
        <div
          style={{
            height: 360,
            padding: 16,
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
          }}
        >
          <h3 style={{ marginBottom: 10 }}>
            Risk Distribution (%) – High / Medium / Low
          </h3>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={125}
                label={renderLabel}
                labelLine={false}
                isAnimationActive={true}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>

              <Tooltip formatter={(v: number) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ================= Signature ================= */}
        <div>
          <h3 style={{ marginBottom: 8 }}>CEO / Board Signature</h3>
          <canvas
            ref={canvasRef}
            width={360}
            height={150}
            style={{
              border: "2px dashed #9ca3af",
              background: "#ffffff",
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

