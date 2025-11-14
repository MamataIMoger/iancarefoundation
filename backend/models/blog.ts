import { Schema, model, models, Model } from "mongoose"

// Define the shape of the blog data
export interface IBlog {
  title: string
  content: string
  imageUrl?: string
  category?: "General" | "Wellness" | "Recovery" | "Inspiration"
  status: "draft" | "published"
  createdAt?: Date
  updatedAt?: Date
}

// Define the schema
const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    category: {
      type: String,
      enum: ["General", "Wellness", "Recovery", "Inspiration"],
      default: "General",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true }
)

// Create the model with proper typing
const Blog: Model<IBlog> = models.Blog || model<IBlog>("Blog", BlogSchema)

export default Blog
