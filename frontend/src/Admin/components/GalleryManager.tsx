"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Loader2, X, Pencil, Trash2 } from "lucide-react";

interface GalleryItem {
  _id?: string;
  id?: string;
  name: string;
  imageUrl: string;
  createdAt: Date;
}

const formatDate = (date: Date): string =>
  new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// Skeleton loader for the gallery page
interface GallerySkeletonProps {
  count?: number;
}

const GallerySkeleton: React.FC<GallerySkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-[#F5F5F5] min-h-screen font-sans animate-pulse">
      <div className="h-10 w-96 mb-2 pt-8 bg-gray-300 rounded"></div>
      <div className="h-6 w-full mb-8 border-b-2 border-gray-200 pb-4 bg-gray-200 rounded"></div>
      <div className="mb-12 p-6 bg-white rounded-xl shadow-2xl border-t-4 border-yellow-400">
        <div className="h-6 w-72 mb-4 bg-gray-300 rounded"></div>
        <div className="h-10 bg-gray-200 w-full mb-4 rounded-lg"></div>
        <div className="h-12 bg-gray-200 w-full mb-6 rounded-lg"></div>
        <div className="flex space-x-3">
          <div className="flex-1 h-12 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="bg-card text-card-foreground rounded-xl shadow-lg border border-border overflow-hidden animate-pulse"
          >
            <div className="w-full h-40 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-300 w-3/4 mb-1 rounded"></div>
              <div className="h-4 bg-gray-200 w-1/3 mb-3 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  blue: string;
  yellow: string;
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
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-card text-card-foreground rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4 border-b pb-3">
            <h3 className="text-xl font-bold" style={{ color: blue }}>
              {title}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-700 mb-6">{message}</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 font-semibold rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 font-bold rounded-lg text-white shadow-md"
              style={{ backgroundColor: blue }}
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const GalleryManager = () => {
  const yellow = "#FFD100";
  const blue = "#005691";

  const [albums, setAlbums] = useState<GalleryItem[]>([]);
  const [albumName, setAlbumName] = useState("");
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/gallery");
        if (!res.ok) throw new Error("Failed to fetch albums.");
        const data = await res.json();
        const parsed = data.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        }));
        setAlbums(
          parsed.sort(
            (a: GalleryItem, b: GalleryItem) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      } catch (err) {
        console.error("Error loading gallery data:", err);
        setError("Could not load gallery data from the server.");
        setAlbums([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlbums();
  }, []);

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

  const handleAddAlbum = async (e: React.FormEvent) => {
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
      setAlbums((prev) =>
        [albumWithDate, ...prev].sort(
          (a: GalleryItem, b: GalleryItem) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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

  const handleEditImage = async (id: string | null) => {
    if (!id || !selectedImageBase64 || !albumName.trim()) {
      setError("Please select a new image and a valid album name to update.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: selectedImageBase64, name: albumName.trim() }),
      });
      const updatedAlbum = await res.json();
            if (!res.ok) throw new Error(updatedAlbum.message || "Failed to update album.");
      setAlbums((prev) =>
        prev.map((item) =>
          item._id === id || item.id === id
            ? { ...item, imageUrl: updatedAlbum.imageUrl, name: updatedAlbum.name }
            : item
        )
      );
      handleCancelEdit();
    } catch (e) {
      setError((e as Error).message || "Failed to update album.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteAlbum = async () => {
    const id = albumToDelete?._id ?? albumToDelete?.id;
    if (!id) return;
    setShowDeleteConfirm(false);
    setAlbumToDelete(null);
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.message || "Failed to delete album.");
      }
      setAlbums((prev) => prev.filter((item) => item._id !== id && item.id !== id));
    } catch (e) {
      console.error("Failed to delete album:", e);
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
    const fileInput = document.getElementById("imageFile") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  // --- Render ---
  return (
    <div
      className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen font-sans transition-colors duration-500"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      {isLoading ? (
        <GallerySkeleton count={2} />
      ) : (
        <>
          <h1
            className="text-4xl md:text-5xl font-extrabold mb-2 pt-8 text-center"
            style={{ color: blue }}
          >
            Gallery Publisher
          </h1>
          <p
            className="text-lg mb-8 border-b-2 pb-4"
            style={{ color: "var(--muted-foreground)", borderColor: "var(--border)" }}
          >
            Instantly publish new image albums to the public gallery.
          </p>

          {/* Admin Post Form */}
          <div
            className="mb-12 p-6 rounded-xl shadow-2xl border-t-4"
            style={{
              backgroundColor: "var(--card)",
              color: "var(--card-foreground)",
              borderColor: yellow,
            }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: blue }}>
              {editingAlbumId ? "Edit Album Featured Image" : "Publish New Album"}
            </h2>
            <form
              onSubmit={
                editingAlbumId
                  ? (e) => {
                      e.preventDefault();
                      handleEditImage(editingAlbumId);
                    }
                  : handleAddAlbum
              }
            >
              {editingAlbumId && (
  <div className="mb-4">
    <label
      htmlFor="editAlbumName"
      className="block text-sm font-medium mb-1"
      style={{ color: "var(--muted-foreground)" }}
    >
      Edit Album Title
    </label>
    <input
      id="editAlbumName"
      type="text"
      value={albumName}
      onChange={(e) => setAlbumName(e.target.value)}
      placeholder="Update album title"
      required
      className="w-full p-3 border rounded-lg bg-muted text-foreground border-border focus:ring-[var(--accent)] focus:border-[var(--accent)] transition duration-150 shadow-sm"
      disabled={isSubmitting}
    />
  </div>
)}

              {!editingAlbumId && (
                <div className="mb-4">
                  <label
                    htmlFor="albumName"
                    className="block text-sm font-medium mb-1"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    Album/Image Title
                  </label>
                  <input
                    id="albumName"
                    type="text"
                    value={albumName}
                    onChange={(e) => setAlbumName(e.target.value)}
                    placeholder="Enter a descriptive title for the album"
                    required
                    className="w-full p-3 border rounded-lg bg-muted text-foreground border-border focus:ring-[var(--accent)] focus:border-[var(--accent)] transition duration-150 shadow-sm"
                    disabled={isSubmitting}
                  />
                </div>
              )}

              {/* File Input */}
              <div className="mb-6">
                <label
                  htmlFor="imageFile"
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {editingAlbumId ? "Upload New Image" : "Featured Image Upload (Max 5MB)"}
                </label>
                <input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required={!editingAlbumId || !selectedImageBase64}
                  className="w-full p-3 border border-border rounded-lg focus:ring-[var(--accent)] focus:border-[var(--accent)] transition duration-150 shadow-sm bg-muted"
                  disabled={isSubmitting}
                />
              </div>

              {selectedImageBase64 && (
                <div className="mb-6 p-4 bg-gray-100 rounded-lg flex items-center space-x-4">
                  <h4 className="text-sm font-semibold text-gray-700">Preview:</h4>
                  <img
                    src={selectedImageBase64}
                    alt="Selected Preview"
                    className="w-20 h-20 object-cover rounded-lg shadow-md border-2 border-white"
                  />
                </div>
              )}

              {error && (
                <p className="text-red-500 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  {error}
                </p>
              )}

              <div className="flex space-x-3">
                {editingAlbumId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 font-bold rounded-lg shadow-sm transition duration-200 disabled:opacity-50 hover:bg-gray-100"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedImageBase64}
                  className="flex-1 py-3 px-4 font-bold rounded-lg shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  style={{ backgroundColor: yellow, color: blue }}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : null}
                  {isSubmitting
                    ? editingAlbumId
                      ? "Updating Image..."
                      : "Publishing Album..."
                    : editingAlbumId
                    ? "Update Image"
                    : "Publish Album to Gallery"}
                </button>
              </div>
            </form>
          </div>

          {/* Gallery List */}
          <h2 className="text-3xl font-bold mb-6" style={{ color: blue }}>
            Published Gallery Albums ({albums.length})
          </h2>

          {error && albums.length === 0 && !isLoading && (
            <div className="text-center p-6 bg-red-100 text-red-700 rounded-lg border border-red-300">
              <p className="font-semibold">Error Loading Data:</p>
              <p>{error}</p>
            </div>
          )}

          {!error && albums.length === 0 && !isLoading && (
            <div className="text-center p-6 bg-gray-100 text-gray-700 rounded-lg border border-gray-300">
              <p className="font-semibold">No Albums Published Yet</p>
              <p>Use the form above to add your first gallery item.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((item) => (
              <div
                key={item._id || item.id}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transform hover:scale-[1.02] transition duration-300 ease-in-out"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-40 object-cover bg-gray-200"
                />
                <div className="p-4 flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold mb-1" style={{ color: blue }}>
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      Published: {formatDate(item.createdAt)}
                    </p>
                  </div>

                  <div className="flex gap-2">
  <button
    onClick={() => {
      handleCancelEdit();
      setEditingAlbumId(item._id ?? item.id ?? null);
      setAlbumName(item.name); // Pre-fill name
    }}
    className="text-blue-600 hover:text-blue-800 transition p-1 rounded-full hover:bg-blue-50"
    title="Edit Featured Image"
  >
    <Pencil className="w-5 h-5" />
  </button>
  <button
    onClick={() => handleDeleteInitiate(item)}
    className="text-red-500 hover:text-red-700 transition p-1 rounded-full hover:bg-red-50"
    title="Delete Album"
  >
    <Trash2 className="w-5 h-5" />
  </button>
</div>

                </div>
              </div>
            ))}
          </div>

          <ConfirmationModal
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={confirmDeleteAlbum}
            title={`Delete Album: ${albumToDelete?.name ?? ""}`}
            message={`Are you sure you want to permanently delete "${albumToDelete?.name}"?`}
            blue={blue}
            yellow={yellow}
          />
        </>
      )}
    </div>
  );
};

export default GalleryManager;
