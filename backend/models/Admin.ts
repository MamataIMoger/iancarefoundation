import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface AdminDocument extends Document {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  role: "admin" | "superadmin";
  active: boolean;
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
    resetToken: { type: String, default: null },
    resetTokenExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Admin: Model<AdminDocument> =
  mongoose.models.Admin || mongoose.model<AdminDocument>("Admin", AdminSchema);
