import { Request, Response } from "express";
import mongoose from "mongoose";
import ConsultRequest from "../../models/ConsultRequest";

const MONGO_URI = process.env.MONGODB_URI || "";

let cached: any = (global as any).mongoose;
if (!cached) cached = (global as any).mongoose = { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default async function handler(req: Request, res: Response) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const booking = await ConsultRequest.create(req.body);
      return res.status(201).json({ success: true, booking });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === "GET") {
    try {
      const bookings = await ConsultRequest.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: bookings });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === "PATCH") {
    try {
      const { id, status, adminName } = req.body;

      const booking = await ConsultRequest.findById(id);
      if (!booking) {
        return res.status(404).json({ success: false, message: "Not found" });
      }

      if (status === "Contacted") {
        booking.status = "Contacted";
        booking.contactedHistory.push({
          contactedBy: adminName || "Admin",
          contactedAt: new Date(),
        });
      } else {
        booking.status = status;
      }

      await booking.save();
      return res.status(200).json({ success: true, booking });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, message: "Method not allowed" });
}
