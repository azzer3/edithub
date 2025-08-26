import cookie from "cookie";
import { getSession } from "../../../db/sessions.js";
import { getUserById, getPendingRuns, updateRunStatus } from "../../../db/index.js";

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const session = getSession(cookies.token);
  if (!session) return res.status(401).json({ error: "Non autorisé" });

  const user = await getUserById(session.userId);
  if (!user?.isAdmin) return res.status(403).json({ error: "Accès refusé : admin uniquement" });

  if (req.method === "GET") {
    try {
      const pendingRuns = await getPendingRuns();
      return res.status(200).json(pendingRuns);
    } catch (err) {
      console.error("Erreur fetch pending runs :", err);
      return res.status(500).json({ error: "Impossible de récupérer les runs en attente" });
    }
  }

  if (req.method === "POST") {
    const { runId, status } = req.body;
    if (!runId || !status) return res.status(400).json({ error: "runId ou status manquant" });

    try {
      await updateRunStatus(runId, status);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Erreur update run status :", err);
      return res.status(500).json({ error: "Impossible de mettre à jour le run" });
    }
  }

  res.status(405).json({ error: "Méthode non autorisée" });
}
