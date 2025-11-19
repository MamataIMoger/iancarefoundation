import express from "express";
import dbConnect from "../../config/mongodb";
import ClientModel from "../../models/client";

const router = express.Router();

// Allowed programs (updated)
const VALID_PROGRAMS = ["Drug Addict", "Alcohol Addict", "General"];

// POST /api/clients → Create new client
router.post("/", async (req, res) => {
  await dbConnect();
  try {
    // 🔥 Program validation updated
    if (!VALID_PROGRAMS.includes(req.body.program)) {
      return res.status(400).json({
        success: false,
        error: "Invalid program value",
        allowed: VALID_PROGRAMS,
      });
    }

    const client = await ClientModel.create(req.body);
    res.status(201).json({ success: true, data: client });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/clients → Fetch all clients
router.get("/", async (_req, res) => {
  await dbConnect();
  try {
    const clients = await ClientModel.find({});
    res.status(200).json({ success: true, data: clients });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/clients/:id → Update client by ID
router.put("/:id", async (req, res) => {
  await dbConnect();
  try {
    const { id } = req.params;

    // 🔥 Program validation updated
    if (req.body.program && !VALID_PROGRAMS.includes(req.body.program)) {
      return res.status(400).json({
        success: false,
        error: "Invalid program value",
        allowed: VALID_PROGRAMS,
      });
    }

    const updated = await ClientModel.findOneAndUpdate({ id }, req.body, {
      new: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, error: "Client not found" });
    }

    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/clients/:id
router.delete("/:id", async (req, res) => {
  await dbConnect();
  try {
    const { id } = req.params;

    const deleted = await ClientModel.findOneAndDelete({ id });

    if (!deleted) {
      return res.status(404).json({ success: false, error: "Client not found" });
    }

    res.status(200).json({ success: true, message: "Client deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});


export default router;
