import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import connectDB from "../config/mongodb";
import { Admin } from "../models/Admin";

const COOKIE_NAME = "adminToken";

/* --------------------------------------------------------
   UNIVERSAL DOMAIN HANDLER
--------------------------------------------------------- */
function getCookieDomain(): string | null {
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) return null; // Localhost

  if (process.env.COOKIE_DOMAIN) return process.env.COOKIE_DOMAIN; // Custom domain

  return ".vercel.app"; // Default fallback for Vercel
}

/* --------------------------------------------------------
   SAFE COOKIE OPTIONS (no TS errors)
--------------------------------------------------------- */
function buildCookieOptions(isProd: boolean, maxAge: number) {
  const domain = getCookieDomain();

  // Base cookie properties
  const options: {
    httpOnly: true;
    secure: boolean;
    sameSite: "none" | "lax";
    path: string;
    maxAge: number;
    domain?: string; // optional — avoids TS error
  } = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge,
  };

  // Add domain ONLY if it exists
  if (domain) {
    options.domain = domain;
  }

  return options;
}

/* --------------------------------------------------------
   SIGN TOKEN
--------------------------------------------------------- */
export function signAdminToken(adminId: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");

  return jwt.sign({ id: adminId }, secret, { expiresIn: "7d" });
}

/* --------------------------------------------------------
   SET COOKIE — UNIVERSAL + TYPE-SAFE
--------------------------------------------------------- */
export function setAdminCookie(res: Response, token: string) {
  const isProd = process.env.NODE_ENV === "production";

  const cookieOptions = buildCookieOptions(isProd, 7 * 24 * 60 * 60);

  const cookie = serialize(COOKIE_NAME, token, cookieOptions);

  res.setHeader("Set-Cookie", cookie);
}

/* --------------------------------------------------------
   CLEAR COOKIE — UNIVERSAL + TYPE-SAFE
--------------------------------------------------------- */
export function clearAdminCookie(res: Response) {
  const isProd = process.env.NODE_ENV === "production";

  const cookieOptions = buildCookieOptions(isProd, 0);

  const cookie = serialize(COOKIE_NAME, "", cookieOptions);

  res.setHeader("Set-Cookie", cookie);
}

/* --------------------------------------------------------
   GET CURRENT ADMIN
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
