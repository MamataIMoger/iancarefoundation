// backend/config/mongodb.ts
import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ?? "";

if (!MONGODB_URI) {
  throw new Error("❌ Missing MONGODB_URI in environment variables");
}

/* --------------------------------------------
   Fix: Declare global type for mongooseCache
   This prevents TS error on globalThis or global
--------------------------------------------- */
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache:
    | { conn: Mongoose | null; promise: Promise<Mongoose> | null }
    | undefined;
}

// Ensure global cache exists (serverless-safe)
const globalCache =
  globalThis.mongooseCache ??
  (globalThis.mongooseCache = {
    conn: null,
    promise: null,
  });

/* --------------------------------------------
    dbConnect function (safe for Vercel)
--------------------------------------------- */
async function dbConnect(): Promise<Mongoose> {
  if (globalCache.conn) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    console.log("🔌 Connecting to MongoDB...");

    const opts = { bufferCommands: false };

    globalCache.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        console.log("✅ MongoDB Connected Successfully");
        return m;
      })
      .catch((err) => {
        console.error("❌ MongoDB Connection Error:", err);
        throw err;
      });
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}

export default dbConnect;
