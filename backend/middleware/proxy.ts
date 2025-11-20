// backend/middleware/proxy.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "adminToken";

export function proxy(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME];
  const url = req.path;

  // Allow these admin routes WITHOUT login
  if (
    url === "/api/admin/admin-login" ||
    url === "/api/admin/admin-request-reset" ||
    url === "/api/admin/admin-reset-password"
  ) {
    return next();
  }

  // Protect ONLY admin APIs
  if (url.startsWith("/api/admin")) {
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET as string);
      return next();
    } catch {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  // Allow everything else
  return next();
}
