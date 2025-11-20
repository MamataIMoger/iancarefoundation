import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("❌ MONGODB_URI is missing.");

let cached: { conn: any; promise: any } = (global as any).mongooseCache || {
  conn: null,
  promise: null,
};

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((m) => {
        console.log("✅ MongoDB Connected (Vercel Route Handler)");
        return m;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
      });
  }

  cached.conn = await cached.promise;
  (global as any).mongooseCache = cached;

  return cached.conn;
}
