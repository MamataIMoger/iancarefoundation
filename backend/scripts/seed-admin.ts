// backend/scripts/seed-admin.ts
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin"; // keep your existing model import

dotenv.config();

async function run() {
  try {
    // Ensure MongoDB URI is set
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    console.log("Connecting to:", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Collect admins from env, typed with literal union for role
    const admins: { email: string; password: string; role: "admin" | "superadmin" }[] = [
      { email: process.env.ADMIN_EMAIL_1 ?? "", password: process.env.ADMIN_PASSWORD_1 ?? "", role: "superadmin" },
      { email: process.env.ADMIN_EMAIL_2 ?? "", password: process.env.ADMIN_PASSWORD_2 ?? "", role: "admin" },
      { email: process.env.ADMIN_EMAIL_3 ?? "", password: process.env.ADMIN_PASSWORD_3 ?? "", role: "admin" },
    ];

    const results = { created: [] as string[], updated: [] as string[], skipped: [] as string[] };

    for (const { email, password, role } of admins) {
      // Skip if missing env values
      if (!email || !password) {
        console.warn(`⚠️ Skipping admin: missing email or password`);
        results.skipped.push(email || "unknown");
        continue;
      }

      const existing = await Admin.findOne({ email });

      if (existing) {
        // Update existing admin
        const hashed = await bcrypt.hash(password, 10);
        existing.passwordHash = hashed;
        existing.role = role;
        existing.active = true;
        existing.mustChangePassword = false; // ✅ allow login without reset
        await existing.save();
        console.log("🔄 Updated admin:", email);
        results.updated.push(email);
      } else {
        // Create new admin
        const hashed = await bcrypt.hash(password, 10);
        const admin = new Admin({
          email,
          passwordHash: hashed,
          role,
          active: true,
          mustChangePassword: false, // ✅ allow login without reset
        });
        await admin.save();
        console.log("✅ Seeded admin:", email);
        results.created.push(email);
      }
    }

    // Summary
    console.log("\n--- Summary ---");
    console.log("Created admins:", results.created.length ? results.created.join(", ") : "None");
    console.log("Updated admins:", results.updated.length ? results.updated.join(", ") : "None");
    console.log("Skipped admins:", results.skipped.length ? results.skipped.join(", ") : "None");

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

run();
