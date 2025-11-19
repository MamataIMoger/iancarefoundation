// backend/routes/blog/crud.ts
import express, { Request, Response } from "express";
import formidable, { Fields, Files } from "formidable";
import fs from "fs/promises";
import path from "path";
import dbConnect from "../../config/mongodb";
import Blog from "../../models/blog";

const router = express.Router();

/* ---------- Utils ---------- */
function getFieldValue(field: string | string[] | undefined): string | undefined {
  return Array.isArray(field) ? field[0] : field ?? undefined;
}

function parseForm(req: Request): Promise<{ fields: Fields; files: Files }> {
  const form = formidable({ multiples: false, keepExtensions: true });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

// Base URL for images (works local + production)
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

/* ---------- GET all posts ---------- */
router.get("/", async (_req: Request, res: Response) => {
  await dbConnect();
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch posts" });
  }
});

/* ---------- CREATE POST ---------- */
router.post("/", async (req: Request, res: Response) => {
  await dbConnect();
  try {
    const contentType = req.headers["content-type"] ?? "";
    let payload: any = {};

    // Handle multipart form-data
    if (contentType.includes("multipart/form-data")) {
      const { fields, files } = await parseForm(req);
      const title = getFieldValue(fields.title);
      const content = getFieldValue(fields.content);
      const status = getFieldValue(fields.status);

      if (!title || !content) {
        return res.status(400).json({ success: false, message: "Title and content are required" });
      }

      payload = {
        title,
        content,
        status: status === "published" ? "published" : "draft",
      };

      // Handle image
      const fileData = files.image;
      if (fileData) {
        const file = Array.isArray(fileData) ? fileData[0] : fileData;

        if (file?.filepath) {
          const uploadsDir = path.join(process.cwd(), "public", "uploads");
          await fs.mkdir(uploadsDir, { recursive: true });

          const filename =
            file.originalFilename ||
            file.newFilename ||
            `upload-${Date.now()}`;

          const newFilePath = path.join(uploadsDir, filename);
          await fs.rename(file.filepath, newFilePath);

          payload.imageUrl = `${BASE_URL}/uploads/${filename}`;
        }
      }
    }

    // Handle JSON body
    else {
      const { title, content, status, imageUrl } = req.body;
      if (!title || !content) {
        return res.status(400).json({ success: false, message: "Title and content are required" });
      }

      payload = {
        title,
        content,
        status: status || "draft",
        imageUrl,
      };
    }

    const created = await Blog.create(payload);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create post" });
  }
});

/* ---------- UPDATE POST ---------- */
router.put("/:id", async (req: Request, res: Response) => {
  await dbConnect();
  const blogId = req.params.id;

  if (!blogId) {
    return res.status(400).json({ success: false, message: "Blog ID required" });
  }

  try {
    const contentType = req.headers["content-type"] ?? "";
    const updateData: Record<string, any> = {};

    // Handle multipart form-data
    if (contentType.includes("multipart/form-data")) {
      const { fields, files } = await parseForm(req);

      const title = getFieldValue(fields.title);
      const content = getFieldValue(fields.content);
      const status = getFieldValue(fields.status);

      if (title) updateData.title = title;
      if (content) updateData.content = content;
      if (status) updateData.status = status;

      // Image update
      const fileData = files.image;
      if (fileData) {
        const file = Array.isArray(fileData) ? fileData[0] : fileData;

        if (file?.filepath) {
          const uploadsDir = path.join(process.cwd(), "public", "uploads");
          await fs.mkdir(uploadsDir, { recursive: true });

          const filename =
            file.originalFilename ||
            file.newFilename ||
            `upload-${Date.now()}`;

          const newFilePath = path.join(uploadsDir, filename);
          await fs.rename(file.filepath, newFilePath);

          updateData.imageUrl = `${BASE_URL}/uploads/${filename}`;
        }
      }
    }

    // Handle JSON body
    else {
      const { title, content, status, imageUrl } = req.body;

      if (title) updateData.title = title;
      if (content) updateData.content = content;
      if (status) updateData.status = status;
      if (imageUrl) updateData.imageUrl = imageUrl;
    }

    const updated = await Blog.findByIdAndUpdate(blogId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update post" });
  }
});

/* ---------- DELETE POST ---------- */
router.delete("/:id", async (req: Request, res: Response) => {
  await dbConnect();

  const blogId = req.params.id;
  if (!blogId) {
    return res.status(400).json({ success: false, message: "Blog ID required" });
  }

  try {
    const deleted = await Blog.findByIdAndDelete(blogId);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete post" });
  }
});

export default router;
