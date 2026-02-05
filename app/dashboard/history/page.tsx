import { prisma } from "@/lib/db/prisma";
import { getCurrentUserId } from "@/lib/auth/fakeUser";

export default async function HistoryPage() {
  const userId = getCurrentUserId();

  const decisions = await prisma.decision.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600 }}>Decision History</h2>

      {decisions.length === 0 && (
        <p style={{ marginTop: 12 }}>No decisions recorded yet.</p>
      )}

      {decisions.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 16,
          }}
        >
          <thead>
            <tr style={{ textAlign: "left" }}>
              <th>Date</th>
              <th>Domain</th>
              <th>Decision</th>
              <th>Risk</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {decisions.map((d) => {
              const riskColor =
                d.riskLevel === "High" || d.riskLevel === "Severe"
                  ? "#DC2626" // red
                  : d.riskLevel === "Medium"
                  ? "#F59E0B" // amber
                  : "#16A34A"; // green

              return (
                <tr key={d.id}>
                  <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td>{d.domain}</td>
                  <td>{d.decision}</td>
                  <td>{d.riskLevel}</td>

                  <td style={{ display: "flex", gap: 8 }}>
                    {/* RISK */}
                    <a
                      href={`/dashboard/history/${d.id}`}
                      style={{
                        padding: "6px 12px",
                        background: riskColor,
                        color: "white",
                        borderRadius: 6,
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Risk
                    </a>

                    {/* POTENTIAL */}
                    <a
                      href={`/dashboard/history/${d.id}`}
                      style={{
                        padding: "6px 12px",
                        background: "#F59E0B",
                        color: "#000",
                        borderRadius: 6,
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Potential
                    </a>

                    {/* REMINDER */}
                    <a
                      href={`/dashboard/history/${d.id}`}
                      style={{
                        padding: "6px 12px",
                        background: "#2563EB",
                        color: "white",
                        borderRadius: 6,
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Reminder
                    </a>

                    {/* EDIT BUTTON */}
                    <a
                      href={`/dashboard/history/${d.id}`}
                      style={{
                        padding: "6px 14px",
                        background: "#111827",
                        color: "white",
                        borderRadius: 6,
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

