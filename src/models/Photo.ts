import mongoose, { Schema, model, models } from "mongoose";

export interface IPhoto {
  _id: string;
  url: string;
  filename: string;
  caption?: string;
  order: number;
  createdAt: Date;
}

const PhotoSchema = new Schema<IPhoto>(
  {
    url: { type: String, required: true },
    filename: { type: String, required: true },
    caption: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Photo = models.Photo || model<IPhoto>("Photo", PhotoSchema);
