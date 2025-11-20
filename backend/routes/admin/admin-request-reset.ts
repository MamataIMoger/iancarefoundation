// backend/routes/admin/admin-request-reset.ts
import { Request, Response } from "express";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { Admin } from "../../models/Admin";
import dbConnect from "../../config/mongodb";

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbConnect();

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 🔍 Check if admin exists
    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    // 🔐 Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 🕒 Set expiry + save in DB
    admin.resetToken = resetToken;
    admin.resetTokenExpiresAt = new Date(Date.now() + 3600000); // 1 hour
    await admin.save();

    // 📧 Configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 📬 Send email
    await transporter.sendMail({
      from: "no-reply@iancare.org",
      to: normalizedEmail,
      subject: "IanCare Admin Password Reset",
      text: `Use this token to reset your password: ${resetToken}`,
    });

    return res.status(200).json({
      message: "Reset email sent. Token valid for 1 hour.",
      resetToken, // keep for testing, remove in production
    });

  } catch (err) {
    console.error("Error sending reset email:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
