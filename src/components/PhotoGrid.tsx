"use client";

import Image from "next/image";
import { useState } from "react";

interface Photo {
  _id: string;
  url: string;
  caption?: string;
}

export default function PhotoGrid({ photos }: { photos: Photo[] }) {
  const [selected, setSelected] = useState<Photo | null>(null);

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-1 space-y-1">
        {photos.map((photo) => (
          <div
            key={photo._id}
            className="break-inside-avoid cursor-pointer overflow-hidden group"
            onClick={() => setSelected(photo)}
          >
            <div className="relative">
              <Image
                src={photo.url}
                alt={photo.caption ?? ""}
                width={800}
                height={600}
                className="w-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-6 right-8 text-neutral-400 hover:text-white text-xs tracking-widest uppercase transition-colors"
            onClick={() => setSelected(null)}
          >
            Close
          </button>
          <div className="max-w-5xl max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selected.url}
              alt={selected.caption ?? ""}
              width={1600}
              height={1200}
              className="max-h-[85vh] w-auto object-contain"
            />
            {selected.caption && (
              <p className="mt-3 text-xs text-neutral-500 tracking-widest uppercase text-center">
                {selected.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
