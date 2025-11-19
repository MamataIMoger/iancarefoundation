// backend/routes/blog/index.ts
import express from "express";
import dbConnect from "../../config/mongodb";
import Blog from "../../models/blog";

const router = express.Router();

/* ---------------------------------------------------------
   PUBLIC GET ALL POSTS
--------------------------------------------------------- */
router.get("/", async (_req, res) => {
  await dbConnect();

  try {
    const posts = await Blog.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: posts });
  } catch (err) {
    console.error("Error fetching posts:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch posts" });
  }
});

/* ---------------------------------------------------------
   PUBLIC GET ONE POST (only if ID is valid)
--------------------------------------------------------- */
router.get("/:id", async (req, res) => {
  await dbConnect();

  const { id } = req.params;

  // Validate ObjectId BEFORE using mongoose
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({ success: false, message: "Invalid blog ID" });
  }

  try {
    const post = await Blog.findById(id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    return res.status(200).json({ success: true, data: post });
  } catch (err) {
    console.error("Error fetching post:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch post" });
  }
});

export default router;
