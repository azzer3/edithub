import cookie from "cookie";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  // Supprime le cookie de session côté client
  res.setHeader("Set-Cookie", cookie.serialize("token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0
  }));

  return res.status(200).json({ message: "Déconnecté avec succès" });
}
