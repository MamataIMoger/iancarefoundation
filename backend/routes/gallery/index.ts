import express, { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import dbConnect from "../../config/mongodb";
import Gallery from "../../models/gallery";
import cloudinary from "cloudinary";

const router = express.Router();

// 🔹 Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});


// Health check
router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Gallery router is mounted" });
});

// GET all albums
router.get(
  "/",
  asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    await dbConnect();
    try {
      const albums = await Gallery.find({}).sort({ createdAt: -1 });
      res.status(200).json(albums);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch albums" });
    }
  })
);

// POST → Create album (Cloudinary upload)
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await dbConnect();
    const { name, imageUrl } = req.body;

    if (!name || !imageUrl) {
      res.status(400).json({ error: "Missing name or imageUrl" });
      return;
    }

    try {
      // 🔥 Upload base64 to Cloudinary
      const uploadResponse = await cloudinary.v2.uploader.upload(imageUrl, {
        folder: "iancare-gallery",
      });

      const newAlbum = await Gallery.create({
        name,
        imageUrl: uploadResponse.secure_url, // ⭐ Public cloud URL (NO BASE64)
      });

      res.status(201).json(newAlbum);
    } catch (error: any) {
      console.error("❌ Error creating album:", error.message);
      res.status(500).json({ error: "Failed to create album" });
    }
  })
);

// PUT → Update album image & name
router.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await dbConnect();
    const { id } = req.params;
    const { imageUrl, name } = req.body;

    if (!name) {
      res.status(400).json({ error: "Missing name" });
      return;
    }

    try {
      let updatedData: any = { name };

      // If new image selected → upload to Cloudinary
      if (imageUrl && imageUrl.startsWith("data:image/")) {
        const uploadResponse = await cloudinary.v2.uploader.upload(imageUrl, {
          folder: "iancare-gallery",
        });
        updatedData.imageUrl = uploadResponse.secure_url;
      }

      const updated = await Gallery.findByIdAndUpdate(id, updatedData, {
        new: true,
      });

      if (!updated) {
        res.status(404).json({ error: "Album not found" });
        return;
      }

      res.status(200).json(updated);
    } catch (error: any) {
      console.error("❌ Error updating album:", error.message);
      res.status(500).json({ error: "Failed to update album" });
    }
  })
);

// DELETE album
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await dbConnect();
    const { id } = req.params;

    try {
      const deleted = await Gallery.findByIdAndDelete(id);
      if (!deleted) {
        res.status(404).json({ error: "Album not found" });
        return;
      }

      res.status(200).json({ message: "Album deleted successfully" });
    } catch (error: any) {
      console.error("❌ Error deleting album:", error.message);
      res.status(500).json({ error: "Failed to delete album" });
    }
  })
);

export default router;
