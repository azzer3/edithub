import cookie from "cookie";
import { getSession } from "../../db/sessions.js";
import { getUserById, addRun, getRunsByCategory } from "../../db/index.js";

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const session = getSession(cookies.token);

  if (req.method === "GET") {
    const { categoryId, subCategoryId, showModded } = req.query;
    try {
      const runs = await getRunsByCategory(
        parseInt(categoryId),
        subCategoryId ? parseInt(subCategoryId) : null,
        showModded !== "false" // si showModded est "false", on exclut les modded
      );
      return res.status(200).json(runs);
    } catch (err) {
      console.error("Erreur fetch runs :", err);
      return res.status(500).json({ error: "Impossible de récupérer les runs" });
    }
  }

  if (req.method === "POST") {
    if (!session) return res.status(401).json({ error: "Non autorisé" });
    const user = await getUserById(session.userId);
    if (!user?.discordId) return res.status(403).json({ error: "Vous devez lier votre compte Discord" });

    const { quantity, videoUrl, subCategoryId, game } = req.body;
    if (!quantity || !subCategoryId) return res.status(400).json({ error: "Champs requis manquants" });

    try {
      await addRun(parseInt(quantity), videoUrl || null, user.id, parseInt(subCategoryId), game || "standard");
      return res.status(200).json({ message: "Run ajouté et en attente de validation !" });
    } catch (err) {
      console.error("Erreur ajout run :", err);
      return res.status(500).json({ error: "Erreur lors de l'ajout du run" });
    }
  }

  res.status(405).json({ error: "Méthode non autorisée" });
}
