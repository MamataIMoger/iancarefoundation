//models/gallery.ts
import { Schema, model, models, Model } from "mongoose"

export interface IGallery {
  name: string;
  imageUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);



const Gallery: Model<IGallery> = models.Gallery || model<IGallery>("Gallery", GallerySchema)

export default Gallery
