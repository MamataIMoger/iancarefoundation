// backend/routes/admin/change-password.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import connectDB from "../../config/mongodb";
import { getCurrentAdmin } from "../../lib/auth";
import { Admin } from "../../models/Admin";

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectDB();

    const admin = await getCurrentAdmin(req);
    if (!admin) {
      return res.status(401).json({ error: "Unauthorized. Please log in again." });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Both passwords are required." });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect." });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    admin.passwordHash = newHash;
    await admin.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Error changing password:", err);
    return res.status(500).json({ error: "Server error while changing password." });
  }
}
