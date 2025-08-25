import { getSession } from "../../../db/sessions.js";
import { db, getPendingRuns, updateRunStatus } from "../../../db/index.js";
import cookie from "cookie";

export default function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const session = getSession(cookies.token);

  if (!session) return res.status(401).json({ error: "Non autorisé" });

  // Vérifie que l'utilisateur est admin
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(session.userId);
  if (!user?.isAdmin) return res.status(403).json({ error: "Accès refusé : admin uniquement" });

  // GET : récupère les runs en attente
  if (req.method === "GET") {
    const runs = getPendingRuns(); // Doit renvoyer category et subCategory
    return res.status(200).json(runs);
  }

  // POST : met à jour le statut d’un run
  if (req.method === "POST") {
    const { runId, status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Statut invalide" });
    }

    updateRunStatus(runId, status);
    return res.status(200).json({ message: "Run mis à jour" });
  }

  res.status(405).end();
}
