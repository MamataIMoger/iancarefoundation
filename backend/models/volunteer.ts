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
  dob?: Date  // Add this line for Date of Birth
}

const VolunteerSchema: Schema<VolunteerDocument> = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    whatsAppNumber: { type: String, required: true},
    gender: { type: String },
    address: { type: String },
    timeCommitment: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    dob: { type: Date },  // <-- Add DOB here
  },
  { timestamps: true }
)

const Volunteer: Model<VolunteerDocument> =
  mongoose.models.Volunteer || mongoose.model<VolunteerDocument>('Volunteer', VolunteerSchema)

export default Volunteer
