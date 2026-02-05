export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db/prisma";

type PageProps = {
  params: Promise<{ id?: string }>;
};

export default async function EditDecisionPage({ params }: PageProps) {
  // ✅ NEXT.JS 16 FIX — params is async
  const { id } = await params;

  if (!id) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Edit Decision</h2>
        <p style={{ color: "red" }}>Invalid or missing decision ID.</p>
      </div>
    );
  }

  const decision = await prisma.decision.findUnique({
    where: { id },
  });

  if (!decision) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Edit Decision</h2>
        <p style={{ color: "red" }}>
          Decision not found or database not connected.
        </p>
      </div>
    );
  }

  async function update(formData: FormData) {
    "use server";

    await prisma.decision.update({
      where: { id },
      data: {
        domain: String(formData.get("domain")),
        decision: String(formData.get("decision")),
        stakes: String(formData.get("stakes")),
        horizon: String(formData.get("horizon")),
        riskLevel: String(formData.get("riskLevel")),
      },
    });
  }

  return (
    <div style={{ padding: 24, maxWidth: 600 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600 }}>Edit Decision</h2>

      <form action={update} style={{ display: "grid", gap: 14 }}>
        <select name="domain" defaultValue={decision.domain}>
          <option value="Strategy">Strategy</option>
          <option value="Investment">Investment</option>
          <option value="Hiring">Hiring</option>
          <option value="Operations">Operations</option>
        </select>

        <textarea
          name="decision"
          rows={4}
          defaultValue={decision.decision}
        />

        <select name="stakes" defaultValue={decision.stakes}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <select name="horizon" defaultValue={decision.horizon}>
          <option value="Short">Short</option>
          <option value="Medium">Medium</option>
          <option value="Long">Long</option>
        </select>

        <select name="riskLevel" defaultValue={decision.riskLevel}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Severe">Severe</option>
        </select>

        <button
          type="submit"
          style={{
            padding: "10px",
            background: "#111827",
            color: "white",
            borderRadius: 8,
            fontWeight: 600,
          }}
        >
          Update Decision
        </button>
      </form>
    </div>
  );
}

