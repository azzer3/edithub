import cookie from "cookie";
import { getSession, clearDiscordState } from "../../../../db/sessions.js";
import { linkDiscordAccount } from "../../../../db/index.js";

export default async function handler(req, res) {
  try {
    const { code, state } = req.query;
    if (!code || !state) return res.status(400).send("Missing code or state");

    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.token;
    const session = getSession(token);
    if (!session) return res.status(401).send("Unauthorized");
    if (!session.discord_state || session.discord_state !== state) {
      return res.status(400).send("Invalid state");
    }

    // Échange code -> token Discord
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Discord token error:", tokenData);
      return res.status(500).send("Token exchange failed");
    }

    // Récup user Discord
    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const discordUser = await userRes.json();
    if (!userRes.ok || !discordUser?.id) {
      console.error("Discord user error:", discordUser);
      return res.status(500).send("Discord user fetch failed");
    }

    // Lier en BDD
    linkDiscordAccount(session.userId, discordUser.id);
    clearDiscordState(token);

    // Redirige vers profil (ou home)
    return res.redirect("/");
  } catch (e) {
    console.error("Discord callback error:", e);
    return res.status(500).send("OAuth callback failed");
  }
}
