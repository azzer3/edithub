import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/leaderboard.css";

export default function CategoryPage() {
  const router = useRouter();
  const { id } = router.query;

  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCat, setSelectedSubCat] = useState(null);
  const [runs, setRuns] = useState([]);
  const [showModded, setShowModded] = useState(true);
  const [error, setError] = useState("");
  const [categoryName, setCategoryName] = useState(""); // <-- nom de la catégorie

  // Récupération du nom de la catégorie
  useEffect(() => {
    if (!id) return;

    fetch("/api/categories", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        const cat = data.find(c => c.id === parseInt(id));
        if (cat) setCategoryName(cat.name);
      })
      .catch(err => console.error("Erreur fetch categories :", err));
  }, [id]);

  // Récupération des sous-catégories
  useEffect(() => {
    if (!id) return;

    fetch(`/api/subCategories?categoryId=${id}`)
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          console.error("Sous-catégories inattendues :", data);
          setSubCategories([]);
          return;
        }
        setSubCategories(data);
        if (data.length > 0) setSelectedSubCat(data[0].id);
      })
      .catch(err => console.error("Erreur fetch subCategories :", err));
  }, [id]);

  // Récupération des runs
  useEffect(() => {
    if (!id) return;

    let url = `/api/runs?categoryId=${id}`;
    if (selectedSubCat) url += `&subCategoryId=${selectedSubCat}`;
    url += `&showModded=${showModded}`;

    fetch(url, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          console.error("Runs inattendues :", data);
          setRuns([]);
          setError(data.error || "Impossible de récupérer les runs");
          return;
        }
        setRuns(data);
        setError("");
      })
      .catch(err => {
        console.error("Erreur fetch runs :", err);
        setRuns([]);
        setError("Erreur lors de la récupération des runs");
      });
  }, [id, selectedSubCat, showModded]);

  return (
    <div>
      <head>
        <title>Leaderboard {categoryName || id}</title>
        <link rel="icon" href="/images/logo.png"></link>
      </head>
      <Header />
      <h1>Leaderboard {categoryName || id}</h1> {/* Affiche le nom réel */}

      {subCategories.length > 0 && (
        <select value={selectedSubCat || ""} onChange={e => setSelectedSubCat(e.target.value)}>
          {subCategories.map(sc => (
            <option key={sc.id} value={sc.id}>{sc.name}</option>
          ))}
        </select>
      )}

      <div style={{ marginTop: "1rem" }}>
        <label>
          <input
            type="checkbox"
            checked={showModded}
            onChange={() => setShowModded(prev => !prev)}
          /> Rift
        </label>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {runs.length === 0 && !error ? (
        <p>Aucun run disponible pour cette catégorie/sous-catégorie.</p>
      ) : (
        <table border="1" cellPadding="6" style={{ marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>Joueur</th>
              <th>Quantité</th>
              <th>Version</th>
              <th>Vidéo</th>
            </tr>
          </thead>
          <tbody>
            {runs.map(run => (
              <tr key={run.id}>
                <td>{run.username}</td>
                <td>{run.quantity}</td>
                <td>{run.game}</td>
                <td>{run.videoUrl ? <a href={run.videoUrl} target="_blank" rel="noreferrer">Voir</a> : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Footer />
    </div>
  );
}
