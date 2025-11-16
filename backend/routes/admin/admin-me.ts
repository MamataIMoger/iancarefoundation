// backend/routes/admin/admin-me.ts
import { Request, Response } from "express";
import { getCurrentAdmin } from "../../lib/auth";

export default async function handler(req: Request, res: Response) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Cache-Control", "no-store");

  const admin = await getCurrentAdmin(req);
  if (!admin) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return res.status(200).json({
    success: true,
    email: admin.email,
    role: admin.role,
  });
}
