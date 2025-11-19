"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Loader2, X, Pencil, Trash2 } from "lucide-react";

/* ---------- Types ---------- */
interface GalleryItem {
  _id?: string;
  id?: string;
  name: string;
  imageUrl: string;
  createdAt: Date;
}

/* ---------- Utility ---------- */
const formatDate = (date: Date): string =>
  new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/* ---------- Skeleton Loader ---------- */
const GallerySkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen font-sans">
    <div className="mb-8">
      <div className="h-10 w-80 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl animate-pulse" />
      <div className="h-4 w-full mt-4 bg-gray-100 rounded animate-pulse" />
    </div>
    <div className="mb-8 p-6 rounded-2xl bg-[var(--card)] shadow-neu">
      <div className="h-6 w-64 bg-gray-100 rounded mb-4 animate-pulse" />
      <div className="h-12 bg-gray-100 rounded mb-4 animate-pulse" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden bg-[var(--card)] shadow-neu p-0">
          <div className="h-44 bg-gray-100 animate-pulse" />
          <div className="p-4">
            <div className="h-5 w-3/4 bg-gray-100 rounded mb-3 animate-pulse" />
            <div className="h-4 w-1/3 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ---------- Confirmation Modal ---------- */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  blue: string;
  yellow?: string;
}
const ConfirmationModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  blue,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl p-6 bg-[var(--card)] shadow-neu" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold" style={{ color: blue }}>{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white/50 hover:bg-white/60 text-gray-700"
          >
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg font-semibold text-white" style={{ backgroundColor: blue }}>
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------------------------------------
                    MAIN COMPONENT START
----------------------------------------------------------- */

const GalleryManager: React.FC = () => {
  const yellow = "#FFD100";
  const blue = "#005691";

  const [albums, setAlbums] = useState<GalleryItem[]>([]);
  const [albumName, setAlbumName] = useState<string>("");
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [albumToDelete, setAlbumToDelete] = useState<GalleryItem | null>(null);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);

  /* ---------- ⭐ PAGINATION STATES ADDED ---------- */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // you can change to 9 or 12

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = albums.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(albums.length / itemsPerPage);

  const scrollToTop = () => {
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  /* ----------------------------------------------------------
                          FETCH
  ----------------------------------------------------------- */
  useEffect(() => {
    const fetchAlbums = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gallery`);

        if (!res.ok) throw new Error("Failed to fetch albums.");
        const data = await res.json();
        const parsed: GalleryItem[] = data.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }));
        setAlbums(
          parsed.sort((a: GalleryItem, b: GalleryItem) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      } catch (err) {
        setError("Could not load gallery data from the server.");
        setAlbums([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  /* ----------------------------------------------------------
                      FILE HANDLING
  ----------------------------------------------------------- */
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Selected file must be an image.");
        setSelectedImageBase64(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must not exceed 5MB.");
        setSelectedImageBase64(null);
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImageBase64(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setSelectedImageBase64(null);
    }
  }, []);

  /* ----------------------------------------------------------
                        ADD ALBUM
  ----------------------------------------------------------- */
  const handleAddAlbum = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!albumName.trim() || !selectedImageBase64) {
      setError("Album Name and Featured Image are required.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: albumName.trim(), imageUrl: selectedImageBase64 }),
      });

      const newAlbum = await res.json();
      if (!res.ok) throw new Error(newAlbum.message || "Failed to publish album.");
      const albumWithDate: GalleryItem = {
        ...newAlbum,
        createdAt: new Date(newAlbum.createdAt),
      };

      setAlbums(prev =>
        [albumWithDate, ...prev].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );

      setAlbumName("");
      setSelectedImageBase64(null);
      const fileInput = document.getElementById("imageFile") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (e) {
      setError((e as Error).message || "Failed to publish album.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ----------------------------------------------------------
                        EDIT ALBUM
  ----------------------------------------------------------- */
  const handleEditImage = async (id: string | null) => {
    if (!id || !selectedImageBase64 || !albumName.trim()) {
      setError("Please select a new image and a valid album name to update.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
  try {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/gallery/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl: selectedImageBase64,
        name: albumName.trim(),
      }),
    }
  );

  const updatedAlbum = await res.json();
  if (!res.ok) {
    throw new Error(updatedAlbum.message || "Failed to update album.");
  }

  // success logic…
} catch (e) {
  setError((e as Error).message || "Failed to update album.");
}
    finally {
      setIsSubmitting(false);
    }
  };

  /* ----------------------------------------------------------
                      DELETE ALBUM
  ----------------------------------------------------------- */
  const confirmDeleteAlbum = async () => {
    const id = albumToDelete?._id ?? albumToDelete?.id;
    if (!id) return;
    setShowDeleteConfirm(false);
    setAlbumToDelete(null);

   try {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/gallery/${id}`,
    { method: "DELETE" }
  );

  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || "Failed to delete album.");
  }

  // success
} catch (error) {
  console.error("Failed to delete album:", error);
}
  };

  const handleDeleteInitiate = (item: GalleryItem) => {
    setAlbumToDelete(item);
    setShowDeleteConfirm(true);
  };

  const handleCancelEdit = () => {
    setEditingAlbumId(null);
    setSelectedImageBase64(null);
    setError(null);
    setAlbumName("");
    const fileInput = document.getElementById("imageFile") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  /* ----------------------------------------------------------
                        RENDER
  ----------------------------------------------------------- */

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen font-sans">

      {/* HEADER */}
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2" style={{ color: blue }}>
          Gallery Publisher
        </h1>
        <p className="text-gray-600">Publish beautiful albums and manage your content.</p>
      </header>

      {/* ------------------------------------------------------
                        Publish / Edit Section
      ------------------------------------------------------- */}
      <section className="mb-10 p-6 rounded-2xl bg-[var(--card)] shadow-neu border border-gray-100">
        
        <form
          onSubmit={
            editingAlbumId
              ? (e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  handleEditImage(editingAlbumId);
                }
              : handleAddAlbum
          }
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center"
        >
          <div className="md:col-span-2 space-y-4">
            <input
              id="albumName"
              type="text"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              placeholder="Album / image title"
              required
              className="w-full p-3 rounded-lg border bg-[var(--muted)]"
            />

            <input
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required={!editingAlbumId}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-white"
            />

            {selectedImageBase64 && (
              <div className="mt-2 p-3 bg-white rounded-lg border shadow-sm flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden">
                  <img src={selectedImageBase64} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Preview selected image</div>
                  <div className="text-xs text-gray-500 mt-1">Looks great — ready to publish.</div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-700">
                {error}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {editingAlbumId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-full py-3 rounded-lg border border-gray-200"
              >
                Cancel Edit
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !selectedImageBase64}
              className="w-full py-3 rounded-lg font-bold text-white"
              style={{ background: `linear-gradient(90deg, ${yellow}, ${blue})` }}
            >
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin inline-block mr-2" />}
              {isSubmitting ? (editingAlbumId ? "Updating..." : "Publishing...") : editingAlbumId ? "Update Image" : "Publish Album"}
            </button>
          </div>
        </form>
      </section>

      {/* ------------------------------------------------------
                        Published Items
      ------------------------------------------------------- */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: blue }}>
          Published Gallery Albums ({albums.length})
        </h2>
      </div>

      {/* No Data */}
      {!error && albums.length === 0 && (
        <div className="mb-6 p-4 rounded-lg bg-gray-50 border">
          loading...
        </div>
      )}

      {/* Album List with pagination items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((item) => (
          <article
            key={item._id ?? item.id}
            className="rounded-2xl overflow-hidden bg-[var(--card)] border shadow-neu"
          >
            <div className="relative h-56 bg-gray-100">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />

              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => {
                    handleCancelEdit();
                    setEditingAlbumId(item._id ?? item.id ?? null);
                    setAlbumName(item.name);
                  }}
                  className="p-2 rounded-md bg-white/80 hover:bg-white text-blue-600"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDeleteInitiate(item)}
                  className="p-2 rounded-md bg-white/80 hover:bg-white text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold" style={{ color: blue }}>{item.name}</h3>
                <p className="text-xs text-gray-500 mt-1">Published: {formatDate(item.createdAt)}</p>
              </div>

              <button
                onClick={() => {
                  setModalImageUrl(item.imageUrl);
                  setModalOpen(true);
                }}
                className="px-3 py-1 rounded-full soft-pill text-sm"
                style={{ color: blue }}
              >
                View
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* ------------------------------------------------------
                        PAGINATION UI
      ------------------------------------------------------- */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage((p) => p - 1);
              scrollToTop();
            }}
            className="px-4 py-2 rounded-full border bg-white disabled:opacity-40"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentPage(i + 1);
                scrollToTop();
              }}
              className={`px-4 py-2 rounded-full border ${
                currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage((p) => p + 1);
              scrollToTop();
            }}
            className="px-4 py-2 rounded-full border bg-white disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Image Modal */}
      {modalOpen && modalImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative max-w-xl w-full rounded-lg bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
              onClick={() => setModalOpen(false)}
            >
              ×
            </button>

            <img src={modalImageUrl} className="w-full object-contain rounded" style={{ maxHeight: "70vh" }} />
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteAlbum}
        title={`Delete Album: ${albumToDelete?.name ?? ""}`}
        message={`Are you sure you want to permanently delete "${albumToDelete?.name}"?`}
        blue={blue}
      />
    </div>
  );
};

export default GalleryManager;
