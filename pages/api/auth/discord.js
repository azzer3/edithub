import crypto from "crypto";
import cookie from "cookie";
import { getSession, setDiscordState } from "../../../db/sessions.js";

export default function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.token;
  const session = getSession(token);
  if (!session) return res.status(401).json({ error: "Non autorisé" });

  const state = crypto.randomBytes(16).toString("hex");
  setDiscordState(token, state);

  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: process.env.DISCORD_REDIRECT_URI,
    response_type: "code",
    scope: "identify",
    state,
  });

  res.redirect(`https://discord.com/api/oauth2/authorize?${params.toString()}`);
}
