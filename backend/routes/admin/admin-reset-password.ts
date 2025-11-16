// backend/routes/admin/admin-reset-password.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Admin } from "../../models/Admin";
import dbConnect from "../../config/mongodb";

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbConnect();

    const { email, token, newPassword } = req.body;
    console.log("📩 Received body:", req.body);

    if (!email || !token || !newPassword) {
      return res.status(400).json({ error: "Missing email, token, or new password" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedToken = token.trim();

    const admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    if (admin.resetToken?.trim() !== trimmedToken) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    if (!admin.resetTokenExpiresAt || admin.resetTokenExpiresAt < new Date()) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    admin.passwordHash = hashed;
    admin.resetToken = null;
    admin.resetTokenExpiresAt = null;
    await admin.save();

    console.log("✅ Password reset successful for:", normalizedEmail);
    // ✅ return success flag
    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("❌ Server error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
}
