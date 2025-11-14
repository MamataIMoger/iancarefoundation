// backend/routes/contactMessages.ts
import express from "express";
import dbConnect from "../../config/mongodb";
import Contact from "../../models/contact";

const router = express.Router();

// Ensure DB is connected
dbConnect();

// GET /api/contact-messages → Fetch all messages
router.get("/", async (_req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching messages.",
      error: error.message,
    });
  }
});

export default router;
