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

    // generate token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // save token + expiry in DB
    await Admin.updateOne(
      { email: email.trim().toLowerCase() },
      { resetToken, resetTokenExpiresAt: new Date(Date.now() + 3600000) } // 1 hour expiry
    );

    // configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // ✅ matches your .env
        pass: process.env.EMAIL_PASS, // ✅ matches your .env
      },
    });


    // send email
    await transporter.sendMail({
      from: "no-reply@iancare.org",
      to: email,
      subject: "IanCare Admin Password Reset",
      text: `Use this token to reset your password: ${resetToken}`,
    });

    // ✅ return token for frontend testing
    return res.status(200).json({ resetToken });
  } catch (err) {
    console.error("Error sending reset email:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
