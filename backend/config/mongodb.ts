// backend/config/mongodb.ts
import mongoose, { Mongoose } from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI ?? "";

if (!MONGODB_URI) {
  throw new Error("❌ Missing MONGODB_URI in environment variables")
}

// Extend global type for caching (TypeScript safe)
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: { conn: Mongoose | null; promise: Promise<Mongoose> | null } | undefined
}

const globalCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
}

global.mongooseCache = globalCache

async function dbConnect(): Promise<Mongoose> {
  if (globalCache.conn) return globalCache.conn

  if (!globalCache.promise) {
    const opts = { bufferCommands: false }
    console.log("🔌 Connecting to MongoDB...")
    globalCache.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m)
  }

  globalCache.conn = await globalCache.promise
  return globalCache.conn
}

export default dbConnect
