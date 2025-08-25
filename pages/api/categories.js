const { getCategories } = require("../../db");

export default function handler(req, res) {
    const categories = getCategories();
    res.status(200).json(categories);
}