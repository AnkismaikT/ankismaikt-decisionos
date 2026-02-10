"use client";

import { useState } from "react";

export default function StrategyDashboard() {
  const [analysisRunning, setAnalysisRunning] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  return (
    <div style={{ padding: 24 }}>
      {/* PAGE HEADER */}
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>
          Strategy & Expansion
        </h2>
        <p style={{ fontSize: 13, color: "#666" }}>
          Executive intelligence for high-impact strategic decisions
        </p>
      </div>

      {/* TOP ACTION BAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <span
          style={{
            padding: "6px 12px",
            background: "#e8f7ef",
            color: "#0a7a3d",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          ● Live Analysis Active
        </span>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => window.open("/api/reports/export", "_blank")}
            style={secondaryBtn}
          >
            Export Board Report
          </button>

          <button style={primaryBtn}>New Decision</button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 22,
        }}
      >
        <Metric title="Risk Level" value="High" color="#ff4d4f" />
        <Metric title="Capital Exposure" value="₹120Cr" color="#faad14" />
        <Metric title="Bias Signals" value="3 Detected" color="#722ed1" />
        <Metric title="Regret Potential" value="Severe" color="#cf1322" />
      </div>

      {/* DECISION ENGINE */}
      <div style={card}>
        <h3 style={{ marginBottom: 6 }}>
          Decision Intelligence Engine
        </h3>
        <p style={{ fontSize: 13, color: "#555", marginBottom: 12 }}>
          Analyze strategic risk, bias, and regret before execution.
        </p>

        <button
          onClick={async () => {
            setAnalysisRunning(true);
            setAnalysisComplete(false);

            await new Promise((res) => setTimeout(res, 1200));

            setAnalysisRunning(false);
            setAnalysisComplete(true);
          }}
          style={primaryBtn}
        >
          {analysisRunning ? "Analyzing..." : "Run Decision Analysis"}
        </button>

        {analysisComplete && (
          <p
            style={{
              marginTop: 10,
              fontSize: 13,
              color: "#0a7a3d",
              fontWeight: 600,
            }}
          >
            ✔ Analysis complete. Review risk indicators above.
          </p>
        )}
      </div>

      {/* RECORD DECISION */}
      <div style={{ ...card, width: 380, marginTop: 24 }}>
        <h4 style={{ marginBottom: 12 }}>Record This Decision</h4>

        <select style={input}>
          <option>Select Domain</option>
          <option>Strategy</option>
          <option>Capital</option>
          <option>Hiring</option>
          <option>Operations</option>
        </select>

        <textarea
          placeholder="Describe the decision clearly"
          style={{ ...input, height: 80 }}
        />

        <select style={input}>
          <option>Select Stakes</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <select style={input}>
          <option>Select Horizon</option>
          <option>Short-term</option>
          <option>Mid-term</option>
          <option>Long-term</option>
        </select>

        <select style={input}>
          <option>Select Risk Level</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button style={{ ...primaryBtn, width: "100%" }}>
          Save Decision
        </button>
      </div>
    </div>
  );
}

/* ===================== */
/* COMPONENTS & STYLES */
/* ===================== */

function Metric({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: color,
        color: "#fff",
        padding: 16,
        borderRadius: 12,
        boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.9 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

const card = {
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
};

const primaryBtn = {
  padding: "8px 16px",
  background: "#0b1020",
  color: "#fff",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
};

const secondaryBtn = {
  padding: "8px 14px",
  background: "#ffffff",
  color: "#0b1020",
  borderRadius: 8,
  border: "1px solid #0b1020",
  cursor: "pointer",
  fontWeight: 600,
};

const input = {
  width: "100%",
  padding: 10,
  marginBottom: 10,
  borderRadius: 6,
  border: "1px solid #ccc",
};

