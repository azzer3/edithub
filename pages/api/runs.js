import { addRun, getRunsByCategory } from "../../db/index.js";
import { getSession } from "../../db/sessions.js";
import cookie from "cookie";

export default function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const session = getSession(cookies.token);

  if (!session) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  // ----- GET : récupérer les runs -----
  if (req.method === "GET") {
    const { categoryId, subCategoryId, showModded } = req.query;
    try {
      let runs = getRunsByCategory(
        parseInt(categoryId),
        subCategoryId ? parseInt(subCategoryId) : null
      );

      // Filtrer les runs modifiées si toggle désactivé
      if (showModded === "false") {
        runs = runs.filter(run => run.game === "fortnite");
      }

      return res.status(200).json(runs);
    } catch (err) {
      console.error("Erreur fetch runs :", err);
      return res.status(500).json({ error: "Impossible de récupérer les runs" });
    }
  }

  // ----- POST : ajouter un run -----
  if (req.method === "POST") {
    const { quantity, subCategoryId, game, videoUrl } = req.body;

    if (!quantity || !subCategoryId || !game) {
      return res.status(400).json({ error: "Quantité, sous-catégorie et version du jeu requises" });
    }

    try {
      addRun(
        parseInt(quantity),
        videoUrl || null,
        session.userId,
        parseInt(subCategoryId),
        game
      );
      return res.status(200).json({ message: "Run ajoutée et en attente de validation !" });
    } catch (err) {
      console.error("Erreur lors de l'ajout du run :", err);
      return res.status(500).json({ error: "Erreur lors de l'ajout du run" });
    }
  }

  // ----- Méthode non autorisée -----
  return res.status(405).json({ error: "Méthode non autorisée" });
}
