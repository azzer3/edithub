import { getSubCategoriesByCategory } from "../../db";

export default function handler(req, res) {
    const { categoryId } = req.query;
    if(!categoryId) return res.status(400).json({ error: "categoryId required" });

    const subCategories = getSubCategoriesByCategory(parseInt(categoryId));
    res.status(200).json(subCategories);
}