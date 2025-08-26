import cookie from "cookie";
import { getSession } from "../../db/sessions.js";
import { getUserById, addRun } from "../../db/index.js";

export default function handler(req, res) {
  if (req.method === "POST") {
    const cookies = cookie.parse(req.headers.cookie || "");
    const session = getSession(cookies.token);
    if (!session) return res.status(401).json({ error: "Non autorisé" });

    const user = getUserById(session.userId);
    if (!user?.discordId) {
      return res.status(403).json({
        error:
          "Vous devez lier votre compte Discord pour soumettre un run.",
      });
    }

    const { quantity, videoUrl, subCategoryId, game } = req.body;
    if (!quantity || !subCategoryId) {
      return res.status(400).json({ error: "Champs requis manquants" });
    }

    addRun(parseInt(quantity), videoUrl || null, user.id, parseInt(subCategoryId), game || "standard");
    return res.status(200).json({ message: "Run ajouté et en attente de validation !" });
  }

  // ... GET existant inchangé ...
  return res.status(405).end();
}
