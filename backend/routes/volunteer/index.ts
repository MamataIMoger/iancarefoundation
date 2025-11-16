// backend/routes/volunteer/index.ts
import express, { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import dbConnect from "../../config/mongodb";
import Volunteer from "../../models/volunteer";

const router = express.Router();

// Utility: Validate MongoDB ObjectId
async function validateId(req: Request, res: Response): Promise<string | null> {
  const rawId = req.params.id;
  if (!rawId || typeof rawId !== "string") {
    res.status(400).json({ success: false, message: "Missing or invalid volunteer ID" });
    return null;
  }
  if (!mongoose.Types.ObjectId.isValid(rawId)) {
    res.status(400).json({ success: false, message: "Invalid volunteer ID format" });
    return null;
  }
  return rawId;
}

// POST /api/volunteer
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await dbConnect();
const { fullName, email, phone, gender, address, timeCommitment, dob } = req.body;

    if (!fullName || !email || !phone) {
      res.status(400).json({ success: false, message: "Missing required fields" });
      return;
    }

    const emailExists = await Volunteer.findOne({ email });
    if (emailExists) {
      res.status(409).json({ success: false, message: "Email already registered" });
      return;
    }

    const phoneExists = await Volunteer.findOne({ phone });
    if (phoneExists) {
      res.status(409).json({ success: false, message: "Phone already registered" });
      return;
    }
      const newVolunteer = new Volunteer({
        fullName,
        email,
        phone,
        gender,
        address,
        timeCommitment,
        dob,  // include dob from request body
        status: "pending",
      });
      await newVolunteer.save();
    console.log("📩 Volunteer submitted:", newVolunteer._id);
    res.status(201).json({ success: true, data: newVolunteer });
  })
);

// GET /api/volunteer
router.get(
  "/",
  asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    await dbConnect();
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: volunteers });
  })
);

// PUT /api/volunteer/:id
router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    await dbConnect();
    const id = await validateId(req, res);
    if (!id) return;

    try {
      const updated = await Volunteer.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) {
        res.status(404).json({ success: false, message: "Volunteer not found" });
        return;
      }
      console.log("✅ Volunteer updated:", id);
      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      console.error("❌ Error updating volunteer:", error.message);
      res.status(500).json({ success: false, message: "Failed to update volunteer" });
    }
  })
);

// DELETE /api/volunteer/:id
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    await dbConnect();
    const id = await validateId(req, res);
    if (!id) return;

    try {
      const deleted = await Volunteer.findByIdAndDelete(id);
      if (!deleted) {
        res.status(404).json({ success: false, message: "Volunteer not found" });
        return;
      }
      console.log("🗑️ Volunteer deleted:", id);
      res.status(200).json({ success: true, message: "Volunteer deleted" });
    } catch (error: any) {
      console.error("❌ Error deleting volunteer:", error.message);
      res.status(500).json({ success: false, message: "Failed to delete volunteer" });
    }
  })
);

export default router;
