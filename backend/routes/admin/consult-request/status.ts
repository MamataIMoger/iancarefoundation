import { Request, Response } from "express";
import connectDB from "../../../config/mongodb";
import ConsultRequest from "../../../models/ConsultRequest";

export default async function handler(req: Request, res: Response) {
  await connectDB();

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { id, status } = req.body;
  if (!id || !status) {
    return res.status(400).json({ success: false, message: "Missing parameters" });
  }

  try {
    const updated = await ConsultRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
