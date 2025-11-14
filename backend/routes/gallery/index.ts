import express, { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import dbConnect from "../../config/mongodb"
import Gallery from "../../models/gallery"

const router = express.Router()

// ✅ Health check route to confirm router is mounted
router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Gallery router is mounted" })
})

// GET /api/gallery → Fetch all albums
router.get(
  "/",
  asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    await dbConnect()
    console.log("✅ GET /api/gallery route hit")
    try {
      const albums = await Gallery.find({}).sort({ createdAt: -1 })
      res.status(200).json(albums)
    } catch (error: any) {
      console.error("❌ Error fetching gallery:", error.message)
      res.status(500).json({ error: "Failed to fetch albums" })
    }
  })
)

// POST /api/gallery → Create a new album
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await dbConnect()
    const { name, imageUrl } = req.body

    if (!name || !imageUrl) {
      res.status(400).json({ error: "Missing name or imageUrl" })
      return
    }

    try {
      const newAlbum = await Gallery.create({ name, imageUrl })
      res.status(201).json(newAlbum)
    } catch (error: any) {
      console.error("❌ Error creating album:", error.message)
      res.status(500).json({ error: "Failed to create album" })
    }
  })
)

// PUT /api/gallery/:id → Update album image
router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await dbConnect()
    const { id } = req.params
    const { imageUrl } = req.body

    if (!imageUrl) {
      res.status(400).json({ error: "Missing imageUrl" })
      return
    }

    try {
      const updated = await Gallery.findByIdAndUpdate(id, { imageUrl }, { new: true })
      if (!updated) {
        res.status(404).json({ error: "Album not found" })
        return
      }
      res.status(200).json(updated)
    } catch (error: any) {
      console.error("❌ Error updating album:", error.message)
      res.status(500).json({ error: "Failed to update album" })
    }
  })
)

// DELETE /api/gallery/:id → Delete an album
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await dbConnect()
    const { id } = req.params

    try {
      const deleted = await Gallery.findByIdAndDelete(id)
      if (!deleted) {
        res.status(404).json({ error: "Album not found" })
        return
      }
      res.status(200).json({ message: "Album deleted successfully" })
    } catch (error: any) {
      console.error("❌ Error deleting album:", error.message)
      res.status(500).json({ error: "Failed to delete album" })
    }
  })
)

export default router
