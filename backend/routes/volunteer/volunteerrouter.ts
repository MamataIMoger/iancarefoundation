//routes/volunteerrouter.ts
import express, { Request, Response, NextFunction } from "express"
import asyncHandler from "express-async-handler"
import mongoose from "mongoose"
import dbConnect from "../../config/mongodb"
import Volunteer from "../../models/volunteer"

const router = express.Router()

// Utility: Validate MongoDB ObjectId
async function validateId(req: Request, res: Response): Promise<string | null> {
  const rawId = req.params.id
  if (!rawId || typeof rawId !== "string") {
    res.status(400).json({ message: "Missing or invalid volunteer ID" })
    return null
  }
  if (!mongoose.Types.ObjectId.isValid(rawId)) {
    res.status(400).json({ message: "Invalid volunteer ID format" })
    return null
  }
  return rawId
}

// POST /api/volunteer/submit
router.post(
  "/submit",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await dbConnect();
    const { name, email, phone, message, dob } = req.body;  // accept dob here

    if (!name || !email || !phone) {
      res.status(400).json({ success: false, message: "Missing required fields" });
      return;
    }

    const newVolunteer = new Volunteer({ name, email, phone, message, dob }); // save dob
    await newVolunteer.save();

    console.log("📩 Volunteer submitted:", newVolunteer._id);
    res.status(201).json({ success: true, data: newVolunteer });
  })
);


// GET /api/volunteer/submit
router.get(
  "/submit",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await dbConnect()
    const volunteers = await Volunteer.find().sort({ createdAt: -1 })
    res.status(200).json({ success: true, data: volunteers })
  })
)

// PUT /api/volunteer/:id
router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await dbConnect()
    const id = await validateId(req, res)
    if (!id) return

    try {
      const updated = await Volunteer.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) {
        res.status(404).json({ message: "Volunteer not found" })
        return
      }
      console.log("✅ Volunteer updated:", id)
      res.status(200).json({ success: true, data: updated })
    } catch (error: any) {
      console.error("❌ Error updating volunteer:", error.message)
      res.status(500).json({ message: "Failed to update volunteer" })
    }
  })
)

// DELETE /api/volunteer/:id
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await dbConnect()
    const id = await validateId(req, res)
    if (!id) return

    try {
      const deleted = await Volunteer.findByIdAndDelete(id)
      if (!deleted) {
        res.status(404).json({ message: "Volunteer not found" })
        return
      }
      console.log("🗑️ Volunteer deleted:", id)
      res.status(200).json({ success: true, message: "Volunteer deleted" })
    } catch (error: any) {
      console.error("❌ Error deleting volunteer:", error.message)
      res.status(500).json({ message: "Failed to delete volunteer" })
    }
  })
)

export default router
