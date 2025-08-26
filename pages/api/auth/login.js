import cookie from "cookie";
import { getUserByEmail } from "../../../db/index.js";
import { createSession } from "../../../db/sessions.js";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { email, password } = req.body;
    const user = getUserByEmail(email);
    if (!user) return res.status(401).json({ error: "Identifiants invalides" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Identifiants invalides" });

    const { token, expires } = createSession(user.id);

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: Math.floor((expires - Date.now()) / 1000),
      })
    );

    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        isAdmin: !!user.isAdmin,
        discordId: user.discordId || null,
      },
    });
  } catch (e) {
    console.error("login error:", e);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
