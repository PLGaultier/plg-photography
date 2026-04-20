import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { connectDB } from "@/lib/mongodb";
import { Photo } from "@/models/Photo";
import { auth } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const photos = await Photo.find()
    .select("url filename caption order createdAt")
    .sort({ order: 1, createdAt: -1 })
    .lean();
  return NextResponse.json(photos);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const caption = formData.get("caption") as string | null;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const blob = await put(file.name, file, { access: "public" });

  await connectDB();
  const photo = await Photo.create({
    url: blob.url,
    filename: file.name,
    caption: caption ?? "",
  });

  return NextResponse.json(photo, { status: 201 });
}
