"use client";

import { useState } from "react";
import DecisionHistory from "@/components/DecisionHistory";

export default function StrategyPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function runAnalysis() {
    setLoading(true);

    const res = await fetch("/api/decision/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        decision: "Expand into Middle East market",
        stakes: "₹120 Crore capital commitment",
        horizon: "long",
        domain: "strategy",
      }),
    });

    const data = await res.json();
    setResult(data.analysis);
    setLoading(false);
  }

  return (
    <div>
      {/* PAGE HEADER */}
      <div style={{ marginBottom: 30 }}>
        <h2>Strategy & Expansion</h2>
        <p style={{ color: "#555" }}>
          Executive intelligence for high-impact strategic decisions
        </p>
      </div>

      {/* KPI CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 20,
          marginBottom: 30,
        }}
      >
        {[
          { label: "Risk Level", value: "High", color: "#ff4d4f" },
          { label: "Capital Exposure", value: "₹120Cr", color: "#faad14" },
          { label: "Bias Signals", value: "3 Detected", color: "#722ed1" },
          { label: "Regret Potential", value: "Severe", color: "#cf1322" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            style={{
              background: kpi.color,
              color: "#fff",
              padding: 20,
              borderRadius: 14,
            }}
          >
            <p style={{ fontSize: 12, opacity: 0.9 }}>
              {kpi.label}
            </p>
            <h3 style={{ marginTop: 8 }}>
              {kpi.value}
            </h3>
          </div>
        ))}
      </div>

      {/* ACTION PANEL */}
      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        }}
      >
        <h3>Decision Intelligence Engine</h3>
        <p style={{ color: "#666" }}>
          Analyze strategic risk, bias, and regret before execution.
        </p>

        <button
          onClick={runAnalysis}
          disabled={loading}
          style={{
            marginTop: 20,
            padding: "12px 20px",
            background: "#0b1020",
            color: "#fff",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Analyzing..." : "Run Decision Analysis"}
        </button>

        {result && (
          <div style={{ marginTop: 30 }}>
            <h4>Board Recommendation</h4>
            <p>{result.boardRecommendation}</p>
          </div>
        )}
      </div>

      {/* DECISION HISTORY */}
      <DecisionHistory />
    </div>
  );
}

