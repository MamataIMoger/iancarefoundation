import { Schema, model, models, Model } from "mongoose"

export interface IClient {
  status: "Recovered" | "Under Recovery" | "New"
  id: string
  address: string
  name: string
  contact: string
  joinDate: string
  program: "Drug Addict" | "Alcohol Addict" | "General"
  notes: string
}

const ClientSchema = new Schema<IClient>(
  {
    status: { type: String, enum: ["Recovered", "Under Recovery", "New"], required: true },
    id: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    name: { type: String, required: true },
    contact: { type: String, required: true },
    joinDate: { type: String, required: true },

    // 🔥 Updated ONLY the enum values here
    program: {
      type: String,
      enum: ["Drug Addict", "Alcohol Addict", "General"],
      required: true,
    },

    notes: { type: String, required: false, default: "" },
  },
  { timestamps: true }
)

const ClientModel: Model<IClient> =
  models.Client || model<IClient>("Client", ClientSchema)

export default ClientModel
