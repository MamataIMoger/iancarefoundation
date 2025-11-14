// backend/routes/story/index.ts
import express from "express"
import asyncHandler from "express-async-handler"
import dbConnect from "../../config/mongodb"
import Story from "../../models/story"

const router = express.Router()

// Ensure DB is connected
dbConnect()

// GET /api/story → Fetch stories (admin or public)
router.get("/", asyncHandler(async (req, res) => {
  const isAdmin = req.query.admin === "true"
  const filter = isAdmin ? {} : { approved: true }
  const stories = await Story.find(filter).sort({ createdAt: -1 })
  res.status(200).json(stories)
}))

// POST /api/story → Submit a new story
router.post("/", asyncHandler(async (req, res) => {
  const { title, content, author, category } = req.body
  const newStory = await Story.create({ title, content, author, category })
  res.status(201).json(newStory)
}))

// PUT /api/story/:id → Approve or update a story
router.put("/:id", asyncHandler(async (req, res) => {
  const { id } = req.params
  const { approved } = req.body
  const updated = await Story.findByIdAndUpdate(id, { approved }, { new: true })
  res.status(200).json(updated)
}))

export default router
