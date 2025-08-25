import { useEffect, useState } from "react";

export default function AdminPage() {
  const [pendingRuns, setPendingRuns] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/runs", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
          setPendingRuns([]);
        } else {
          setPendingRuns(Array.isArray(data) ? data : []);
          setError("");
        }
      })
      .catch(err => {
        console.error(err);
        setError("Erreur lors de la récupération des runs.");
      });
  }, []);

  const handleAction = (id, status) => {
    fetch("/api/admin/runs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ runId: id, status }),
      credentials: "include",
    }).then(() => {
      setPendingRuns(prev => prev.filter(r => r.id !== id));
    });
  };

  // Grouper les runs par catégorie
  const runsByCategory = pendingRuns.reduce((acc, run) => {
    const category = run.category || "Sans catégorie";
    if (!acc[category]) acc[category] = [];
    acc[category].push(run);
    return acc;
  }, {});

  return (
    <div>
      <h1>Validation des runs</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {pendingRuns.length === 0 && !error && <p>Aucun run en attente</p>}

      {Object.entries(runsByCategory).map(([categoryName, runs]) => (
        <div key={categoryName} style={{ marginBottom: "2rem" }}>
          <h2>{categoryName}</h2>
          <ul>
            {runs.map(run => (
              <li key={run.id}>
                <b>{run.username}</b> - {run.subCategory} - {run.quantity}{" "}
                {run.videoUrl && (
                  <a href={run.videoUrl} target="_blank" rel="noreferrer">
                    [Vidéo]
                  </a>
                )}{" "}
                <button onClick={() => handleAction(run.id, "approved")}>Valider</button>
                <button onClick={() => handleAction(run.id, "rejected")}>Refuser</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
