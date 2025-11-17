import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface AdminDocument extends Document {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  role: "admin" | "superadmin";
  active: boolean;
  mustChangePassword: boolean; // ✅ added
  sessionVersion: number;      // ✅ optional, since you had it in DB
  resetToken?: string | null;
  resetTokenExpiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<AdminDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "superadmin"], default: "admin" },
    active: { type: Boolean, default: true },
    mustChangePassword: { type: Boolean, default: true }, // ✅ declare in schema
    sessionVersion: { type: Number, default: 1 },         // ✅ declare in schema
    resetToken: { type: String, default: null },
    resetTokenExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Admin: Model<AdminDocument> =
  mongoose.models.Admin || mongoose.model<AdminDocument>("Admin", AdminSchema);
