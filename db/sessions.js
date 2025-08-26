// db/sessions.js
import { db } from "./index.js";

// Crée une session et retourne le token
export function createSession(userId, ttlMs = 1000 * 60 * 60 * 24 * 7) { // 7 jours
  const token =
    Math.random().toString(36).slice(2) + Date.now().toString(36);
  const expires = Date.now() + ttlMs;

  db.prepare(
    `INSERT INTO sessions (token, userId, expires, discord_state)
     VALUES (?, ?, ?, NULL)`
  ).run(token, userId, expires);

  return { token, expires };
}

// Retourne la session si valide, sinon null (et supprime si expirée)
export function getSession(token) {
  if (!token) return null;
  const row = db.prepare(
    "SELECT token, userId, expires, discord_state FROM sessions WHERE token = ?"
  ).get(token);
  if (!row) return null;

  if (row.expires && row.expires < Date.now()) {
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
    return null;
  }
  return row;
}

// Met à jour la session (userId/expires/discord_state selon besoins)
export function saveSession(token, { userId, expires, discord_state }) {
  // conserve les valeurs existantes si non fournies
  const existing = getSession(token);
  if (!existing) return null;

  const newUserId = userId ?? existing.userId;
  const newExpires = expires ?? existing.expires;
  const newState = discord_state ?? existing.discord_state;

  db.prepare(
    `UPDATE sessions SET userId = ?, expires = ?, discord_state = ? WHERE token = ?`
  ).run(newUserId, newExpires, newState, token);

  return getSession(token);
}

export function destroySession(token) {
  db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}

// OAuth: set/clear state
export function setDiscordState(token, state) {
  db.prepare(
    "UPDATE sessions SET discord_state = ? WHERE token = ?"
  ).run(state, token);
}

export function clearDiscordState(token) {
  db.prepare(
    "UPDATE sessions SET discord_state = NULL WHERE token = ?"
  ).run(token);
}
