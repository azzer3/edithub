import { getCategories } from "../../db/index.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Méthode non autorisée" });

  try {
    const categories = await getCategories();
    res.status(200).json(categories);
  } catch (err) {
    console.error("Erreur fetch categories :", err);
    res.status(500).json({ error: "Impossible de récupérer les catégories" });
  }
}
