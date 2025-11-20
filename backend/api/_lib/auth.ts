import jwt from "jsonwebtoken";
import { connectDB } from "./db";
import { Admin } from "../../models/Admin";

// Vercel-style helper
function setCookie(headers: Headers, name: string, value: string, maxAge: number) {
  const isProd = process.env.NODE_ENV === "production";

  headers.append(
    "Set-Cookie",
    `${name}=${value}; Path=/; HttpOnly; ${
      isProd ? "Secure; SameSite=None" : "SameSite=Lax"
    }; Max-Age=${maxAge}`
  );
}

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
   SET COOKIE
--------------------------------------------------------- */
export function setAdminCookie(headers: Headers, token: string) {
  setCookie(headers, COOKIE_NAME, token, 7 * 24 * 60 * 60);
}

/* --------------------------------------------------------
   CLEAR COOKIE
--------------------------------------------------------- */
export function clearAdminCookie(headers: Headers) {
  setCookie(headers, COOKIE_NAME, "", 0);
}

/* --------------------------------------------------------
   DECODE CURRENT ADMIN TOKEN
--------------------------------------------------------- */
export async function getCurrentAdminFromRequest(req: Request) {
  const secret = process.env.JWT_SECRET;

  const cookieHeader = req.headers.get("cookie") || "";
  const token = cookieHeader
    .split(";")
    .find((c) => c.trim().startsWith(`${COOKIE_NAME}=`))
    ?.split("=")[1];

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
