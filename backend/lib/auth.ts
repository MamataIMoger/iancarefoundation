// backend/lib/auth.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import connectDB from "../config/mongodb";
import { Admin } from "../models/Admin";

const COOKIE_NAME = "adminToken";

/* --------------------------------------------------------
   COOKIE DOMAIN (Auto — No forced domain)
--------------------------------------------------------- */
function getCookieDomain(): string | null {
  // Auto domain based on browser
  return null;
}

/* --------------------------------------------------------
   SAFE COOKIE OPTIONS (Production-ready)
--------------------------------------------------------- */
function buildCookieOptions(isProd: boolean, maxAge: number) {
  const domain = getCookieDomain();

  const options: {
    httpOnly: true;
    secure: boolean;
    sameSite: "none" | "lax";
    path: string;
    maxAge: number;
    domain?: string;
  } = {
    httpOnly: true,
    secure: isProd,                  // Required for HTTPS cookies
    sameSite: isProd ? "none" : "lax", // Allows cross-domain cookies
    path: "/",
    maxAge,
  };

  if (domain) {
    options.domain = domain;
  }

  return options;
}

/* --------------------------------------------------------
   SIGN JWT TOKEN
--------------------------------------------------------- */
export function signAdminToken(adminId: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");

  return jwt.sign({ id: adminId }, secret, { expiresIn: "7d" });
}

/* --------------------------------------------------------
   SET COOKIE SAFELY
--------------------------------------------------------- */
export function setAdminCookie(res: Response, token: string) {
  const isProd = process.env.NODE_ENV === "production";

  const cookieOptions = buildCookieOptions(isProd, 7 * 24 * 60 * 60);

  const cookie = serialize(COOKIE_NAME, token, cookieOptions);

  res.setHeader("Set-Cookie", cookie);
}

/* --------------------------------------------------------
   CLEAR COOKIE
--------------------------------------------------------- */
export function clearAdminCookie(res: Response) {
  const isProd = process.env.NODE_ENV === "production";

  const cookieOptions = buildCookieOptions(isProd, 0);

  const cookie = serialize(COOKIE_NAME, "", cookieOptions);

  res.setHeader("Set-Cookie", cookie);
}

/* --------------------------------------------------------
   GET CURRENT ADMIN FROM REQUEST COOKIE
--------------------------------------------------------- */
export async function getCurrentAdmin(req: Request) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");

  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;

  let payload: any;
  try {
    payload = jwt.verify(token, secret);
  } catch {
    return null;
  }

  await connectDB();
  const admin = await Admin.findById(payload.id);

  if (!admin || !admin.active) return null;

  return admin;
}
