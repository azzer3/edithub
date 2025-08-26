import { getSubCategoriesByCategory } from "../../db/index.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Méthode non autorisée" });

  const { categoryId } = req.query;
  if (!categoryId) return res.status(400).json({ error: "categoryId manquant" });

  try {
    const subCategories = await getSubCategoriesByCategory(parseInt(categoryId));
    res.status(200).json(subCategories);
  } catch (err) {
    console.error("Erreur fetch subCategories :", err);
    res.status(500).json({ error: "Impossible de récupérer les sous-catégories" });
  }
}
