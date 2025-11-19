//backend/routes/consult-form.ts
import { Request, Response } from "express";
import connectDB from "../../config/mongodb";
import ConsultRequest from "../../models/ConsultRequest";

export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    await connectDB();
    const raw = req.body;

    // Validate essential fields here if needed

    const doc = await ConsultRequest.create({
      name: raw.name,
      email: raw.email,
      phone: raw.phone,
      service: raw.service,
      service_other: raw.service_other,
      date: raw.date,
      mode: raw.mode,
      message: raw.message,
      consent: raw.consent === "on" || raw.consent === true,
    });

    return res.status(200).json({ success: true, data: doc });
  } catch (err: any) {
    console.error("Consult form submission error:", err);
    return res.status(500).json({ success: false, message: "Failed to submit request" });
  }
}
