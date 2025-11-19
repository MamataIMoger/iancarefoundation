// backend/routes/blog/crud.ts
import express, { Request, Response } from "express";
import formidable, { Fields, Files } from "formidable";
import dbConnect from "../../config/mongodb";
import Blog from "../../models/blog";

// Cloudinary
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

/* ---------------------------------------------------------
   CLOUDINARY CONFIG (fixed TypeScript errors)
--------------------------------------------------------- */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */
function getFieldValue(field: string | string[] | undefined): string | undefined {
  return Array.isArray(field) ? field[0] : field ?? undefined;
}

function parseForm(req: Request): Promise<{ fields: Fields; files: Files }> {
  const form = formidable({
    multiples: false,
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

/* ---------------------------------------------------------
   GET ALL POSTS
--------------------------------------------------------- */
router.get("/", async (_req: Request, res: Response) => {
  await dbConnect();
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: blogs });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch posts" });
  }
});

/* ---------------------------------------------------------
   CREATE POST
--------------------------------------------------------- */
router.post("/", async (req: Request, res: Response) => {
  await dbConnect();

  try {
    const contentType = req.headers["content-type"] || "";
    let payload: any = {};

    // ---------- MULTIPART (form-data) ----------
    if (contentType.includes("multipart/form-data")) {
      const { fields, files } = await parseForm(req);

      const title = getFieldValue(fields.title);
      const content = getFieldValue(fields.content);
      const status = getFieldValue(fields.status);

      if (!title || !content) {
        return res.status(400).json({ success: false, message: "Missing fields" });
      }

      payload = {
        title,
        content,
        status: status === "published" ? "published" : "draft",
      };

      // Image upload
      const fileData = files.image;
      const file = Array.isArray(fileData) ? fileData?.[0] : fileData;

      if (file?.filepath) {
        const uploaded = await cloudinary.uploader.upload(file.filepath, {
          folder: "blog_uploads",
        });
        payload.imageUrl = uploaded.secure_url;
      }
    }

    // ---------- JSON BODY ----------
    else {
      const { title, content, status, imageUrl } = req.body;
      if (!title || !content) {
        return res.status(400).json({ success: false, message: "Missing fields" });
      }

      payload = {
        title,
        content,
        status: status ?? "draft",
        imageUrl,
      };
    }

    const created = await Blog.create(payload);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create post" });
  }
});

/* ---------------------------------------------------------
   UPDATE POST
--------------------------------------------------------- */
router.put("/:id", async (req: Request, res: Response) => {
  await dbConnect();

  const blogId = req.params.id;
  if (!blogId) return res.status(400).json({ success: false, message: "ID missing" });

  try {
    const contentType = req.headers["content-type"] || "";
    const updateData: Record<string, any> = {};

    // ---------- MULTIPART ----------
    if (contentType.includes("multipart/form-data")) {
      const { fields, files } = await parseForm(req);

      const title = getFieldValue(fields.title);
      const content = getFieldValue(fields.content);
      const status = getFieldValue(fields.status);

      if (title) updateData.title = title;
      if (content) updateData.content = content;
      if (status) updateData.status = status;

      const fileData = files.image;
      const file = Array.isArray(fileData) ? fileData?.[0] : fileData;

      if (file?.filepath) {
        const uploaded = await cloudinary.uploader.upload(file.filepath, {
          folder: "blog_uploads",
        });
        updateData.imageUrl = uploaded.secure_url;
      }
    }

    // ---------- JSON ----------
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
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update" });
  }
});

/* ---------------------------------------------------------
   DELETE POST
--------------------------------------------------------- */
router.delete("/:id", async (req: Request, res: Response) => {
  await dbConnect();

  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, message: "Deleted" });
  } catch {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
});

export default router;
