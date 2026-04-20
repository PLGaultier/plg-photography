import { NextRequest, NextResponse } from "next/server";
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

  const { url, filename, caption } = await req.json();
  if (!url || !filename) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  await connectDB();
  const photo = await Photo.create({ url, filename, caption: caption ?? "" });

  return NextResponse.json(photo, { status: 201 });
}
