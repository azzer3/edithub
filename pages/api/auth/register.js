import { createUser, getUserByEmail } from "../../../db/index.js";
import { hashPassword } from "../../../db/auth.js"; // fonction pour hasher le mot de passe
import { createSession } from "../../../db/sessions.js";
import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { username, email, password } = req.body;

  try {
    const existingUser = getUserByEmail(email);
    if (existingUser) return res.status(400).json({ error: "Email déjà utilisé" });

    const passwordHash = await hashPassword(password);
    createUser(username, email, passwordHash);

    const user = getUserByEmail(email);
    const token = createSession(user.id);

    res.setHeader("Set-Cookie", cookie.serialize("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    }));

    return res.status(200).json({
      message: "Inscription réussie",
      user: { id: user.id, username: user.username, isAdmin: user.isAdmin === 1 }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
