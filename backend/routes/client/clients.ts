import express from "express";
import dbConnect from "../../config/mongodb";
import ClientModel from "../../models/client";

const router = express.Router();

// POST /api/clients → Create new client
router.post("/", async (req, res) => {
  await dbConnect(); // ✅ moved inside route
  try {
    const client = await ClientModel.create(req.body);
    res.status(201).json({ success: true, data: client }); // ✅ standardized response
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message }); // ✅ standardized error
  }
});

// GET /api/clients → Fetch all clients
router.get("/", async (_req, res) => {
  await dbConnect(); // ✅ moved inside route
  try {
    const clients = await ClientModel.find({})
    res.status(200).json({ success: true, data: clients }) // ✅ standardized response
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message }) // ✅ standardized error
  }
})

export default router;
