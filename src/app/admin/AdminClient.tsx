"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";

interface Photo {
  _id: string;
  url: string;
  caption?: string;
}

export default function AdminClient({ photos: initial }: { photos: Photo[] }) {
  const [photos, setPhotos] = useState(initial);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/photos/upload",
      });

      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: blob.url, filename: file.name, caption }),
      });

      if (res.ok) {
        setCaption("");
        setPreview(null);
        if (fileRef.current) fileRef.current.value = "";
        const updated = await fetch("/api/photos").then((r) => r.json());
        setPhotos(updated);
        router.refresh();
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this photo?")) return;
    await fetch(`/api/photos/${id}`, { method: "DELETE" });
    setPhotos(photos.filter((p) => p._id !== id));
  };

  return (
    <main className="pt-24 px-8 pb-16 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-xs tracking-[0.3em] uppercase text-neutral-500">Admin — Photos</h1>
        <a href="/" className="text-xs tracking-widest uppercase text-neutral-500 hover:text-white transition-colors">
          View site →
        </a>
      </div>

      <form onSubmit={handleUpload} className="mb-16 space-y-4 border border-neutral-800 p-6">
        <p className="text-xs tracking-widest uppercase text-neutral-500 mb-4">Upload photo</p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          required
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setPreview(URL.createObjectURL(f));
          }}
          className="text-xs text-neutral-400 file:mr-4 file:text-xs file:tracking-widest file:uppercase file:bg-transparent file:border file:border-neutral-700 file:text-white file:px-4 file:py-2 file:cursor-pointer hover:file:border-white transition-colors"
        />
        {preview && (
          <Image src={preview} alt="preview" width={200} height={150} className="object-cover opacity-70" />
        )}
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Caption (optional)"
          className="w-full bg-transparent border-b border-neutral-700 py-2 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-400 transition-colors"
        />
        <button
          type="submit"
          disabled={uploading}
          className="text-xs tracking-widest uppercase text-white border border-neutral-700 px-8 py-3 hover:border-white transition-colors disabled:opacity-40"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>

      <div className="columns-2 sm:columns-3 lg:columns-4 gap-2 space-y-2">
        {photos.map((photo) => (
          <div key={photo._id} className="break-inside-avoid relative group">
            <Image
              src={photo.url}
              alt={photo.caption ?? ""}
              width={400}
              height={300}
              className="w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => handleDelete(photo._id)}
                className="text-xs tracking-widest uppercase text-white border border-white/40 px-4 py-2 hover:border-white transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {photos.length === 0 && (
        <p className="text-xs tracking-widest uppercase text-neutral-700 text-center py-16">
          No photos yet
        </p>
      )}
    </main>
  );
}
