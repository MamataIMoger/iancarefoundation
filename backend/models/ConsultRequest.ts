//models/ConsultRequest.ts
import mongoose, { Schema, Model } from "mongoose";

export interface IContactHistory {
  contactedBy: string;
  contactedAt: Date;
}

export interface IConsultRequest {
  name: string;
  email: string;
  phone: string; // will include country code prefix e.g. +91-9999999999
  service: string;
  service_other?: string;
  date?: string;
  mode: string;
  message?: string;
  consent: boolean;
  status: "Pending" | "Accepted" | "Contacted" | "Rejected";
  contactedHistory: IContactHistory[];
  createdAt: Date;
}

const ConsultRequestSchema = new Schema<IConsultRequest>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    service: { type: String, required: true },
    service_other: { type: String },
    date: { type: String },
    mode: { type: String, required: true },
    message: { type: String },
    consent: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Contacted", "Rejected"],
      default: "Pending",
    },
    contactedHistory: [
      {
        contactedBy: { type: String },
        contactedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const ConsultRequest: Model<IConsultRequest> =
  mongoose.models.ConsultRequest ||
  mongoose.model<IConsultRequest>("ConsultRequest", ConsultRequestSchema);

export default ConsultRequest;
