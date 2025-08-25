import { getSession } from "../../../db/sessions.js";
import { getUserById } from "../../../db/index.js";
import cookie from "cookie";

export default function handler(req, res) {
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const session = getSession(cookies.token);

    if (!session) {
      // Toujours renvoyer du JSON même si pas connecté
      return res.status(200).json({ user: null });
    }

    const user = getUserById(session.userId);

    if (!user) {
      return res.status(200).json({ user: null });
    }

    // Renvoyer un boolean pour isAdmin
    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin === 1
      }
    });

  } catch (err) {
    console.error("Erreur API session:", err);
    // Toujours renvoyer JSON pour éviter JSON.parse error
    return res.status(500).json({ user: null });
  }
}
