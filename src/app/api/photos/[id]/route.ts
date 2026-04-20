import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { connectDB } from "@/lib/mongodb";
import { Photo } from "@/models/Photo";
import { auth } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const photo = await Photo.findById(id);
  if (!photo) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await del(photo.url);
  await photo.deleteOne();

  return NextResponse.json({ success: true });
}
