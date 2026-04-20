import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Photo } from "@/models/Photo";
import AdminClient from "./AdminClient";

async function getPhotos() {
  await connectDB();
  const photos = await Photo.find().sort({ order: 1, createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(photos));
}

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const photos = await getPhotos();

  return <AdminClient photos={photos} />;
}
