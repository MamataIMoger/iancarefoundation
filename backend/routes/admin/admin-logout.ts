// backend/routes/admin/logout.ts
import { Request, Response } from "express";
import { clearAdminCookie } from "../../lib/auth";

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  clearAdminCookie(res); // ✅ clears the cookie
  return res.status(200).json({ ok: true });
}
