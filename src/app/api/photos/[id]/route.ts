import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { connectDB } from "@/lib/mongodb";
import { Photo } from "@/models/Photo";
import { auth } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const photo = await Photo.findById(params.id);
  if (!photo) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await del(photo.url);
  await photo.deleteOne();

  return NextResponse.json({ success: true });
}
