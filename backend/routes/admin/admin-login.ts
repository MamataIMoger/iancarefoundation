//routes/admin/admin-login.ts 
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import connectDB from "../../config/mongodb";
import { Admin } from "../../models/Admin";
import { signAdminToken, setAdminCookie } from "../../lib/auth";

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  await connectDB();

  const normalizedEmail = email.toLowerCase().trim();
  const admin = await Admin.findOne({ email: normalizedEmail, active: true });

  if (!admin) {
    console.error("Login failed: no admin found for", normalizedEmail);
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) {
    console.error("Login failed: password mismatch for", normalizedEmail);
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = signAdminToken(admin._id.toString());
  setAdminCookie(res, token);

  return res.status(200).json({
    success: true, // ✅ explicit success flag
    email: admin.email,
    role: admin.role,
  });
}
