import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "./db";
import { Admin } from "../../models/Admin";

const COOKIE_NAME = "adminToken";

/* --------------------------------------------------------
   SIGN TOKEN
--------------------------------------------------------- */
export function signAdminToken(adminId: string) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  return jwt.sign({ id: adminId }, secret, { expiresIn: "7d" });
}

/* --------------------------------------------------------
   SET COOKIE (async)
--------------------------------------------------------- */
export async function setAdminCookie(token: string) {
  const isProd = process.env.NODE_ENV === "production";

  const cookieStore = await cookies(); // FIX

  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

/* --------------------------------------------------------
   CLEAR COOKIE (async)
--------------------------------------------------------- */
export async function clearAdminCookie() {
  const isProd = process.env.NODE_ENV === "production";

  const cookieStore = await cookies(); // FIX

  cookieStore.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    maxAge: 0,
  });
}

/* --------------------------------------------------------
   GET CURRENT ADMIN (async)
--------------------------------------------------------- */
export async function getCurrentAdmin() {
  const secret = process.env.JWT_SECRET;

  const cookieStore = await cookies(); // FIX
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  let payload: any;
  try {
    payload = jwt.verify(token, secret!);
  } catch {
    return null;
  }

  await connectDB();
  const admin = await Admin.findById(payload.id);

  if (!admin || !admin.active) return null;

  return admin;
}
