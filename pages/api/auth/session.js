import cookie from "cookie";
import { getSession } from "../../../db/sessions.js";
import { getUserById } from "../../../db/index.js";

export default function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.token;
  const session = getSession(token);
  if (!session) return res.status(200).json({ user: null });

  const user = getUserById(session.userId);
  if (!user) return res.status(200).json({ user: null });

  return res.status(200).json({
    user: {
      id: user.id,
      username: user.username,
      isAdmin: !!user.isAdmin,
      discordId: user.discordId || null,
    },
  });
}
