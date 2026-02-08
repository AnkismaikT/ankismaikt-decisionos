"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Decision = {
  id: string;
  decision: string;
  domain: string;
  stakes: string;
  horizon: string;
  riskScore: number;
};

function getRiskLevel(score: number): "Low" | "Medium" | "High" | "Severe" {
  if (score >= 80) return "Severe";
  if (score >= 60) return "High";
  if (score >= 35) return "Medium";
  return "Low";
}

export default function EditDecisionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/decision/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setDecision(data);
        setLoading(false);
      });
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    await fetch(`/api/decision/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        decision: String(formData.get("decision")),
        domain: String(formData.get("domain")),
        stakes: String(formData.get("stakes")),
        horizon: String(formData.get("horizon")),
        riskScore: Number(formData.get("riskScore")),
      }),
    });

    router.push("/dashboard/history");
  }

  if (loading || !decision) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-2">Edit Decision</h1>
      <p className="text-sm text-gray-600 mb-6">
        Current Risk Level:{" "}
        <strong>{getRiskLevel(decision.riskScore)}</strong>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="decision"
          defaultValue={decision.decision}
          className="w-full border p-2"
          placeholder="Decision"
        />

        <input
          name="domain"
          defaultValue={decision.domain}
          className="w-full border p-2"
          placeholder="Domain"
        />

        <input
          name="stakes"
          defaultValue={decision.stakes}
          className="w-full border p-2"
          placeholder="Stakes"
        />

        <input
          name="horizon"
          defaultValue={decision.horizon}
          className="w-full border p-2"
          placeholder="Horizon"
        />

        <input
          name="riskScore"
          type="number"
          min={0}
          max={100}
          defaultValue={decision.riskScore}
          className="w-full border p-2"
          placeholder="Risk Score (0–100)"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-black text-white"
        >
          Save Decision
        </button>
      </form>
    </div>
  );
}

