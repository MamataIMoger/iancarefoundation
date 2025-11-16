// backend/routes/admin/logout.ts
import { Router, Request, Response } from "express";
import { clearAdminCookie } from "../lib/auth";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  clearAdminCookie(res);
  return res.status(200).json({ success: true, message: "Logged out" });
});

export default router;
