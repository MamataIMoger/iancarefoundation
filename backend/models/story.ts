import { Schema, model, models, Model } from "mongoose"

export interface IStory {
  title: string
  content: string
  author: string
  category?: "General" | "Recovery" | "Inspiration"
  approved?: boolean
  createdAt?: Date
  updatedAt?: Date
}

const StorySchema = new Schema<IStory>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    category: {
      type: String,
      enum: ["General", "Recovery", "Inspiration"],
      default: "General",
    },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const Story: Model<IStory> = models.Story || model<IStory>("Story", StorySchema)

export default Story
