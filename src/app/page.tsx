import { connectDB } from "@/lib/mongodb";
import { Photo } from "@/models/Photo";
import PhotoGrid from "@/components/PhotoGrid";
import ContactForm from "@/components/ContactForm";

export const revalidate = 60;

async function getPhotos() {
  await connectDB();
  const photos = await Photo.find().sort({ order: 1, createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(photos));
}

export default async function Home() {
  const photos = await getPhotos();

  return (
    <main>
      <section className="pt-24 px-4 sm:px-6 lg:px-8 pb-16">
        {photos.length === 0 ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-xs tracking-widest uppercase text-neutral-600">No photos yet</p>
          </div>
        ) : (
          <PhotoGrid photos={photos} />
        )}
      </section>

      <section id="contact" className="px-8 py-24 border-t border-neutral-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-12">Contact</h2>
          <ContactForm />
        </div>
      </section>

      <footer className="px-8 py-8 border-t border-neutral-900">
        <p className="text-xs text-neutral-700 tracking-widest uppercase">
          © {new Date().getFullYear()} PLG Photography
        </p>
      </footer>
    </main>
  );
}
