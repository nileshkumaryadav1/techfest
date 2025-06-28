import Image from "next/image";

const images = ["/images/gallery/1.jpg", "/images/gallery/2.jpg", "/images/gallery/3.jpg"];

const GallerySection = () => {
  return (
    <section className="bg-[#0D1117] text-white py-20 px-6 sm:px-16">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#00F0FF] mb-8">Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt={`Gallery ${i + 1}`}
              width={400}
              height={250}
              className="rounded-lg object-cover w-full h-64 shadow-lg"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
