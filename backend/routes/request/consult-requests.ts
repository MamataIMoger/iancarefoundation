//backend/routes/consult-request.ts
import { Request, Response } from "express";
import connectDB from "../../config/mongodb";
import ConsultRequest from "../../models/ConsultRequest";

export default async function handler(req: Request, res: Response) {
  await connectDB();

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const requests = await ConsultRequest.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: requests });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
