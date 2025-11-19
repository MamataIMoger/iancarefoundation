//routes/story/index.ts
import express from "express";
import asyncHandler from "express-async-handler";
import dbConnect from "../../config/mongodb";
import Story from "../../models/story";

import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";

const router = express.Router();

// Connect DB once
dbConnect();

/* ----------------------------------------------------
   GET /api/stories  → Fetch stories
   Admin: all stories
   Public: approved only
---------------------------------------------------- */
// backend/routes/story/index.ts

router.get(
  "/",
  asyncHandler(async (req: ExpressRequest, res: ExpressResponse) => {
    const isAdmin = req.query.admin === "true";

    // ✅ FIX: Use 'approved: true' for public view. Admin gets all stories {}.
    const filter = isAdmin ? {} : { approved: true }; 

    const stories = await Story.find(filter).sort({ createdAt: -1 });
    res.status(200).json(stories);
  })
);

/* ----------------------------------------------------
   POST /api/stories → Create a new story (pending by default)
---------------------------------------------------- */
router.post(
  "/",
  asyncHandler(async (req: ExpressRequest, res: ExpressResponse) => {
    const { title, content, author, category } = req.body;

    if (!title || !content) {
      res.status(400).json({ message: "Title and content are required" });
      return;
    }

    const story = await Story.create({
      title,
      content,
      author,
      category,
      status: "pending", // default status
    });

    res.status(201).json(story);
  })
);

/* ----------------------------------------------------
   Alternative POST /api/story → Submit new story (approved=false)
   (kept for compatibility if you want a simpler endpoint)
---------------------------------------------------- */
router.post(
  "/story",
  asyncHandler(async (req: ExpressRequest, res: ExpressResponse) => {
    const { title, content, author, category } = req.body;
    const story = await Story.create({
        title,
        content,
        author,
        category,
        approved: false,
        rejected: false,
      });
    res.status(201).json(Story);
  })
);

/* ----------------------------------------------------
   PUT /api/stories/:id → Update or approve/reject
---------------------------------------------------- */
router.put(
  "/:id",
  asyncHandler(async (req: ExpressRequest<{ id: string }>, res: ExpressResponse) => {
    const { id } = req.params;
    const updateData = req.body; // e.g., { status: "approved" }

    const story = await Story.findByIdAndUpdate(id, updateData, { new: true });

    if (!story) {
      res.status(404).json({ message: "Story not found" });
      return;
    }

    res.status(200).json(story);
  })
);

/* ----------------------------------------------------
   DELETE /api/stories?id=123 → delete by query param
---------------------------------------------------- */
router.delete(
  "/",
  asyncHandler(async (req: ExpressRequest, res: ExpressResponse) => {
    const id = req.query.id as string;

    if (!id) {
      res.status(400).json({ message: "Missing story id" });
      return;
    }

    const deleted = await Story.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ message: "Story not found" });
      return;
    }

    res.json({ success: true });
  })
);

/* ----------------------------------------------------
   DELETE /api/stories/:id → delete by route param
---------------------------------------------------- */
router.delete(
  "/:id",
  asyncHandler(async (req: ExpressRequest<{ id: string }>, res: ExpressResponse) => {
    const { id } = req.params;
    await Story.findByIdAndDelete(id);
    res.status(200).json({ message: "Story deleted" });
  })
);

export default router;
