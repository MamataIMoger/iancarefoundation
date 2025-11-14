// backend/routes/contact/submit.ts
import express from "express"
import asyncHandler from "express-async-handler"
import dbConnect from "../../config/mongodb"
import Contact from "../../models/contact"
import emailService from "../../services/emailService"

const router = express.Router()

// Ensure DB is connected
dbConnect()

// POST /api/contact → Submit a new contact message
router.post("/", asyncHandler(async (req, res) => {
  const formData = req.body

  // ✅ Validation
  if (!formData?.name || !formData?.email || !formData?.phone || !formData?.message) {
    res.status(400).json({
      success: false,
      message: "Missing required fields.",
    })
  }

  // ✅ Save to MongoDB
  const contact = new Contact(formData)
  await contact.save()

  // ✅ Send email (optional)
  if (emailService?.sendContactEmail) {
    await emailService.sendContactEmail(formData)
  }

  // ✅ Respond to client
  res.status(200).json({
    success: true,
    message: "Message sent successfully!",
  })
}))

export default router
