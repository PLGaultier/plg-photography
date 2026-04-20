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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
        {photos.map((photo) => (
          <div
            key={photo._id}
            className="cursor-pointer overflow-hidden group relative aspect-[4/5]"
            onClick={() => setSelected(photo)}
          >
            <Image
              src={photo.url}
              alt={photo.caption ?? ""}
              fill
              className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={photos.indexOf(photo) === 0}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
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
