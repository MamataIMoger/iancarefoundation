import { Schema, model, models, Model } from "mongoose"

export interface IContact {
  name: string
  email: string
  phone: string
  message: string
  createdAt?: Date
  updatedAt?: Date
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
)

const Contact: Model<IContact> = models.Contact || model<IContact>("Contact", ContactSchema)

export default Contact
