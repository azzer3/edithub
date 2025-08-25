import { getUserByEmail } from "../../../db/index.js";
import { verifyPassword } from "../../../db/auth.js"; // fonction pour vérifier le hash
import { createSession } from "../../../db/sessions.js";
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { email, password } = req.body;

  try {
    const user = getUserByEmail(email);
    if (!user) return res.status(401).json({ error: "Email ou mot de passe incorrect" });

    const valid = await verifyPassword(password, user.password);
    if (!valid) return res.status(401).json({ error: "Email ou mot de passe incorrect" });

    const token = createSession(user.id);

    res.setHeader("Set-Cookie", cookie.serialize("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 jours
    }));

    return res.status(200).json({
      message: "Connecté avec succès",
      user: { id: user.id, username: user.username, isAdmin: user.isAdmin === 1 }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
