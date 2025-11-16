"use client";
import React, { useState, useEffect } from "react";

/* ---------- Types ---------- */
interface Album {
  _id?: string;
  name: string;
  imageUrl: string;
  createdAt?: string;
}

/* ---------- Hero Section ---------- */
function HeroGallery() {
  return (
    <header
      className="relative text-white overflow-hidden"
      style={{
        backgroundImage: "url('/bg3.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "90vh",
      }}
    >
      {/* 🔹 Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(rgba(15,134,191,0.65), rgba(4,78,146,0.70))",
          backdropFilter: "blur(3px)",
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8 py-28 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg tracking-tight">
            Foundation Gallery
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/90 leading-relaxed">
            Explore albums capturing moments of joy, compassion, and transformation.
          </p>
          <div className="mt-8">
            <a
              href="#gallery"
              className="inline-block px-6 py-3 bg-blue-800 text-white rounded-lg font-semibold hover:bg-amber-700 transition"
            >
              View Albums
            </a>
          </div>
        </div>
      </div>

      {/* Decorative SVG wave */}
      <svg
        viewBox="0 0 1440 200"
        className="w-full h-40 absolute bottom-0 left-0"
        preserveAspectRatio="none"
      >
        <path
          d="M0,64 C240,120 480,120 720,80 C960,40 1200,0 1440,48 L1440,200 L0,200 Z"
          fill="#fff8ec"
        />
      </svg>
    </header>
  );
}


/* ---------- Album Card ---------- */
const AlbumCard: React.FC<{ album: Album }> = ({ album }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <article className="bg-white rounded-xl overflow-hidden border border-gray-300 shadow-lg flex flex-col h-full">
        <img src={album.imageUrl} alt={album.name} className="h-48 w-full object-cover" />
        <div className="p-6 flex flex-col justify-between flex-grow">
          <div>
  <div className="flex justify-between items-start mb-4">
    <span className="text-sm text-gray-500">
      {album.createdAt ? new Date(album.createdAt).toLocaleDateString() : ""}
    </span>
  </div>
  <h3 className="text-xl font-bold text-gray-900 mb-3">{album.name}</h3>
</div>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowModal(true)}
              className="text-amber-700 hover:text-amber-900 font-semibold transition"
            >
              View Album →
            </button>
          </div>
        </div>
      </article>

      {/* Modal for full album */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-6 max-w-lg md:max-w-3xl w-full max-h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-900">{album.name}</h2>
            <img src={album.imageUrl} alt={album.name} className="mb-4 rounded-lg" />
            <h3>{album.name}</h3>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* ---------- Main Gallery Page ---------- */
export default function GalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gallery`)

        if (!res.ok) throw new Error("Failed to fetch albums");
        const data: Album[] = await res.json();
        setAlbums(data);
      } catch (err) {
        console.error("❌ Error fetching albums:", err);
      }
    };
    fetchAlbums();
  }, []);

  const totalPages = Math.ceil(albums.length / postsPerPage);
  const currentAlbums = albums.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const goToPage = (num: number) => {
    if (num < 1 || num > totalPages) return;
    setCurrentPage(num);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="font-['Inter',_sans-serif'] bg-white">
      <HeroGallery />

      <main id="gallery" className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Published Albums</h2>

          {albums.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No albums available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentAlbums.map((album, index) => (
                <AlbumCard key={album._id || index} album={album} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center space-x-3 mt-8">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
