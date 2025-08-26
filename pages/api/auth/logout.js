import cookie from "cookie";
import { destroySession, getSession } from "../../../db/sessions.js";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.token;
  const session = getSession(token);
  if (session) destroySession(token);

  res.setHeader(
    "Set-Cookie",
    cookie.serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    })
  );

  return res.status(200).json({ ok: true });
}
