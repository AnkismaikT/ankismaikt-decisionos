"use client";

import { useMemo, useState } from "react";

export default function DashboardPage() {
  // ---------------------------------------------------------------------------
  // DECISION INPUT STATE
  // ---------------------------------------------------------------------------
  const [decision, setDecision] = useState({
    title: "",
    description: "",
    domain: "Strategy",
    stakes: "Medium",
    horizon: "Mid-term",
    urgency: "medium",
    reversibility: "medium",
    capitalAtRisk: 0,
  });

  const [analysisTriggered, setAnalysisTriggered] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  // ---------------------------------------------------------------------------
  // LIVE ANALYSIS ENGINE
  // ---------------------------------------------------------------------------
  const analysis = useMemo(() => {
    if (!analysisTriggered) return null;

    let mode: "ADVISORY" | "CHALLENGER" | "BOARD_PROXY" = "ADVISORY";
    let riskLevel = "MEDIUM";
    let biasSignals = 0;
    let regret = "MODERATE";
    let messages: string[] = [];

    if (decision.capitalAtRisk >= 10000000) {
      mode = "BOARD_PROXY";
      riskLevel = "SEVERE";
      regret = "SEVERE";
    } else if (
      decision.urgency === "high" &&
      decision.reversibility === "low"
    ) {
      mode = "CHALLENGER";
      riskLevel = "HIGH";
    }

    if (decision.urgency === "high") biasSignals++;
    if (decision.reversibility === "low") biasSignals++;

    if (mode === "ADVISORY") {
      messages.push(
        "Structure this decision into phases rather than committing fully.",
        "Define measurable success criteria before execution.",
        "Identify a clear invalidation signal."
      );
    }

    if (mode === "CHALLENGER") {
      messages.push(
        "Urgency may be distorting judgment.",
        "Downside protection is weaker than perceived.",
        "Delay could improve clarity."
      );
    }

    if (mode === "BOARD_PROXY") {
      messages.push(
        "Capital exposure is significant with low reversibility.",
        "Decision would not pass board-level scrutiny.",
        "Recommendation: reduce exposure or defer."
      );
    }

    return { mode, riskLevel, biasSignals, regret, messages };
  }, [analysisTriggered, decision]);

  // ---------------------------------------------------------------------------
  // ACTIONS
  // ---------------------------------------------------------------------------
  function runAnalysis() {
    setAnalysisTriggered(true);
  }

  function saveDecision() {
    const existing = JSON.parse(
      localStorage.getItem("decisionos_decisions") || "[]"
    );
    existing.push({ ...decision, createdAt: new Date().toISOString() });
    localStorage.setItem(
      "decisionos_decisions",
      JSON.stringify(existing)
    );
    setSavedMessage("Decision saved successfully.");
    setTimeout(() => setSavedMessage(""), 3000);
  }

  function exportBoardReport() {
    alert("Board Report export will generate a formal PDF.");
  }

  // ---------------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------------
  return (
    <div>
      {/* TOP BAR */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span className="badge">● Live Analysis Active</span>
        <button onClick={exportBoardReport} className="primary">
          Export Board Report
        </button>
      </div>

      {/* SIGNAL CARDS */}
      {analysis && (
        <div className="grid-4">
          <Card title="Risk Level" value={analysis.riskLevel} color="#ff4d4f" />
          <Card
            title="Capital Exposure"
            value={`₹${decision.capitalAtRisk}`}
            color="#faad14"
          />
          <Card
            title="Bias Signals"
            value={`${analysis.biasSignals} Detected`}
            color="#722ed1"
          />
          <Card
            title="Regret Potential"
            value={analysis.regret}
            color="#cf1322"
          />
        </div>
      )}

      {/* ANALYSIS ENGINE */}
      <section className="box">
        <h3>Decision Intelligence Engine</h3>
        <p>Analyze strategic risk, bias, and regret before execution.</p>
        <button onClick={runAnalysis}>Run Decision Analysis</button>
      </section>

      {/* RECORD DECISION */}
      <section className="box narrow">
        <h4>Record This Decision</h4>

        <input
          placeholder="Decision Title"
          value={decision.title}
          onChange={(e) =>
            setDecision({ ...decision, title: e.target.value })
          }
        />

        <textarea
          placeholder="Describe the decision clearly"
          value={decision.description}
          onChange={(e) =>
            setDecision({ ...decision, description: e.target.value })
          }
        />

        <select
          value={decision.domain}
          onChange={(e) =>
            setDecision({ ...decision, domain: e.target.value })
          }
        >
          <option>Strategy</option>
          <option>Capital</option>
          <option>Hiring</option>
          <option>Operations</option>
        </select>

        <select
          value={decision.stakes}
          onChange={(e) =>
            setDecision({ ...decision, stakes: e.target.value })
          }
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <select
          value={decision.horizon}
          onChange={(e) =>
            setDecision({ ...decision, horizon: e.target.value })
          }
        >
          <option>Short-term</option>
          <option>Mid-term</option>
          <option>Long-term</option>
        </select>

        <select
          value={decision.urgency}
          onChange={(e) =>
            setDecision({ ...decision, urgency: e.target.value })
          }
        >
          <option value="low">Low Urgency</option>
          <option value="medium">Medium Urgency</option>
          <option value="high">High Urgency</option>
        </select>

        <select
          value={decision.reversibility}
          onChange={(e) =>
            setDecision({ ...decision, reversibility: e.target.value })
          }
        >
          <option value="high">High Reversibility</option>
          <option value="medium">Medium Reversibility</option>
          <option value="low">Low Reversibility</option>
        </select>

        <input
          type="number"
          placeholder="Capital at Risk"
          value={decision.capitalAtRisk}
          onChange={(e) =>
            setDecision({
              ...decision,
              capitalAtRisk: Number(e.target.value),
            })
          }
        />

        <button onClick={saveDecision} className="primary">
          Save Decision
        </button>

        {savedMessage && <p className="success">{savedMessage}</p>}
      </section>

      {/* LIVE ANALYSIS */}
      {analysis && (
        <section className="box">
          <h3>Live Decision Analysis</h3>
          <p>
            Mode: <strong>{analysis.mode}</strong>
          </p>
          <ul>
            {analysis.messages.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// COMPONENTS
// ---------------------------------------------------------------------------
function Card({ title, value, color }: any) {
  return (
    <div style={{ background: color, color: "#fff", padding: 16, borderRadius: 10 }}>
      <div style={{ fontSize: 12 }}>{title}</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

