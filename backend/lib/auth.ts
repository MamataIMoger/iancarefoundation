import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import connectDB from "../config/mongodb";
import { Admin } from "../models/Admin";

const COOKIE_NAME = "adminToken";

export function signAdminToken(adminId: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  return jwt.sign({ id: adminId }, secret, { expiresIn: "7d" });
}

export function setAdminCookie(res: Response, token: string) {
  const cookie = serialize("adminToken", token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  res.setHeader("Set-Cookie", cookie);
}



export function clearAdminCookie(res: Response) {
  const cookie = serialize(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  res.setHeader("Set-Cookie", cookie);
}


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
