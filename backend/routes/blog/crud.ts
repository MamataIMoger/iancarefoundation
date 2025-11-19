// backend/routes/blog/crud.ts
import express, { Request, Response } from "express";
import formidable, { Fields, Files } from "formidable";
import dbConnect from "../../config/mongodb";
import Blog from "../../models/blog";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

/* ---------------------------------------------------------
   CLOUDINARY CONFIG + LOG
--------------------------------------------------------- */
console.log("---- CLOUDINARY ENV CHECK ----");
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Missing");
console.log("--------------------------------");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

/* ---------------------------------------------------------
   HELPERS
--------------------------------------------------------- */
function getFieldValue(field: string | string[] | undefined): string | undefined {
  return Array.isArray(field) ? field[0] : field;
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

/* ---------------------------------------------------------
   GET ALL POSTS (ADMIN LIST)
--------------------------------------------------------- */
router.get("/", async (_req: Request, res: Response) => {
  await dbConnect();
  try {
    const posts = await Blog.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: posts });
  } catch (err) {
    console.error("Admin fetch error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch posts" });
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

    // Multipart (with image)
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

      const file = Array.isArray(files.image) ? files.image[0] : files.image;

      if (file?.filepath) {
        const upload = await cloudinary.uploader.upload(file.filepath, {
          folder: "blog_uploads",
        });
        payload.imageUrl = upload.secure_url;
      }
    } else {
      // JSON body
      const { title, content, status, imageUrl } = req.body;

      if (!title || !content) {
        return res.status(400).json({ success: false, message: "Missing fields" });
      }

      payload = { title, content, status: status ?? "draft", imageUrl };
    }

    const created = await Blog.create(payload);
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error("Create Post Error:", err);
    return res.status(500).json({ success: false, message: "Failed to create post" });
  }
});

/* ---------------------------------------------------------
   UPDATE POST
--------------------------------------------------------- */
router.put("/:id", async (req: Request, res: Response) => {
  await dbConnect();

  try {
    const blogId = req.params.id;
    const contentType = req.headers["content-type"] || "";
    const updateData: any = {};

    // Multipart form
    if (contentType.includes("multipart/form-data")) {
      const { fields, files } = await parseForm(req);

      const title = getFieldValue(fields.title);
      const content = getFieldValue(fields.content);
      const status = getFieldValue(fields.status);

      if (title) updateData.title = title;
      if (content) updateData.content = content;
      if (status) updateData.status = status;

      const file = Array.isArray(files.image) ? files.image[0] : files.image;

      if (file?.filepath) {
        const upload = await cloudinary.uploader.upload(file.filepath, {
          folder: "blog_uploads",
        });
        updateData.imageUrl = upload.secure_url;
      }
    } else {
      // JSON body
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

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error("Update Post Error:", err);
    return res.status(500).json({ success: false, message: "Failed to update" });
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

    return res.status(200).json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("Delete Post Error:", err);
    return res.status(500).json({ success: false, message: "Failed to delete" });
  }
});

export default router;
