import { db } from "./index.js";

// Crée une nouvelle session et renvoie le token
export function createSession(userId, durationMs = 24*3600*1000) { // 24h par défaut
    const token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    const expires = Date.now() + durationMs;

    db.prepare("INSERT INTO sessions (token, userId, expires) VALUES (?, ?, ?)").run(token, userId, expires);
    return token;
}

// Récupère la session si elle est valide
export function getSession(token) {
  const session = db.prepare("SELECT * FROM sessions WHERE token = ?").get(token);
  if (!session) return null;

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(session.userId);

  return {
    userId: user.id,
    username: user.username,
    isAdmin: user.isAdmin === 1 // Assure-toi que c’est un booléen
  };
}

// Supprime une session (logout)
export function deleteSession(token) {
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
}
