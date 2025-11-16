"use strict";

// Load environment variables from .env
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Admin } = require("../models/Admin"); // ✅ correct import

async function run() {
  try {
    // Check MongoDB URI
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    console.log("Connecting to:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Admins to seed/update
    const admins = [
      { email: process.env.ADMIN_EMAIL_1, password: process.env.ADMIN_PASSWORD_1, role: "superadmin" },
      { email: process.env.ADMIN_EMAIL_2, password: process.env.ADMIN_PASSWORD_2, role: "admin" },
      { email: process.env.ADMIN_EMAIL_3, password: process.env.ADMIN_PASSWORD_3, role: "admin" },
    ].filter(a => a.email && a.password);

    // Track actions
    const results = { created: [], updated: [], skipped: [] };

    for (const { email, password, role } of admins) {
      const existing = await Admin.findOne({ email });

      if (existing) {
        // Always re-hash to ensure consistency
        const hashed = await bcrypt.hash(password, 10);
        existing.passwordHash = hashed;
        existing.role = role;
        existing.active = true;
        await existing.save();
        console.log("🔄 Updated admin:", email);
        results.updated.push(email);
        continue;
      }

      // Admin does not exist → create
      const passwordHash = await bcrypt.hash(password, 10);
      const admin = new Admin({
        email,
        passwordHash,
        role,
        active: true,
      });
      await admin.save();
      console.log("✅ Seeded admin:", email);
      results.created.push(email);
    }

    // Summary
    console.log("\n--- Summary ---");
    console.log("Created admins:", results.created.length ? results.created.join(", ") : "None");
    console.log("Updated admins:", results.updated.length ? results.updated.join(", ") : "None");
    console.log("Skipped admins:", results.skipped.length ? results.skipped.join(", ") : "None");

    // Disconnect
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

// Run the script
run();
