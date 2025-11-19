import { Router } from "express";
import Blog from "../../models/blog";
import Volunteer from "../../models/volunteer";
import Client from "../../models/client";
import Contact from "../../models/contact";
import connectDB from "../../config/mongodb";

const router = Router();

router.get("/", async (req, res) => {
  try {
    await connectDB();

    const totalBlogs = await Blog.countDocuments();
    const activeVolunteers = await Volunteer.countDocuments({ status: "approved" });
    const recoveredClients = await Client.countDocuments({ status: "Recovered" });
    const contactQueries = await Contact.countDocuments();

    // Monthly Volunteers
    const monthlyVolunteers = await Volunteer.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: { month: { $month: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { "_id.month": 1 } }
    ]);

    // Monthly Blog Counts (Aggregated)
    const blogEngagement = await Blog.aggregate([
      { $match: { status: "published" } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    // ⭐ RAW BLOGS (For Correct Month Calculation on Frontend)
    const rawBlogs = await Blog.find({ status: "published" }).select("createdAt");

    // API Response
    res.json({
      stats: {
        totalBlogs,
        activeVolunteers,
        recoveredClients,
        contactQueries,
      },
      charts: {
        volunteerData: monthlyVolunteers,
        blogData: blogEngagement,
        rawBlogs: rawBlogs   // ⭐ send raw timestamps to frontend
      }
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
});

export default router;
