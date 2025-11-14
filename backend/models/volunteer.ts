import mongoose, { Schema, Document, Model } from 'mongoose'

export interface VolunteerDocument extends Document {
  fullName: string
  email: string
  phone: string
  whatsAppNumber?: string
  gender?: string
  address?: string
  timeCommitment: string[]
  status: 'pending' | 'approved' | 'rejected'
}

const VolunteerSchema: Schema<VolunteerDocument> = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    whatsAppNumber: { type: String },
    gender: { type: String },
    address: { type: String },
    timeCommitment: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

const Volunteer: Model<VolunteerDocument> =
  mongoose.models.Volunteer || mongoose.model<VolunteerDocument>('Volunteer', VolunteerSchema)

export default Volunteer
