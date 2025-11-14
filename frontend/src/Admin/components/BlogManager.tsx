//frontend/src/Admin/components/BlogManager.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

// --- Skeleton Component for Blog Post Card ---
const PostCardSkeleton = () => (
<article className="bg-card text-card-foreground rounded-xl border border-border shadow-xl transition-colors duration-500">
    {/* Image Placeholder */}
    <div className="w-full h-48 bg-muted"></div>
    <div className="p-6 flex flex-col justify-between flex-grow">
      <div>
        {/* Admin Tag & Date Placeholder */}
        <div className="flex justify-between items-start mb-3">
          <div className="h-5 bg-gray-200 rounded-full w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        {/* Title Placeholder */}
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
        {/* Content Placeholder */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-11/12"></div>
          <div className="h-4 bg-gray-200 rounded w-10/12"></div>
          <div className="h-4 bg-gray-200 rounded w-9/12"></div>
        </div>
      </div>
      {/* Buttons Placeholder */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 flex-wrap gap-3">
        <div className="h-8 bg-gray-300 rounded w-24"></div>
        <div className="flex flex-wrap gap-3">
          <div className="h-8 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  </article>
);

// --- New Skeleton Component for the whole section ---
const BlogSectionSkeleton = ({ postsPerPage }: { postsPerPage: number }) => (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-white min-h-screen font-sans animate-pulse">
        {/* Header Skeleton */}
        <div className="h-10 bg-gray-300 w-96 mb-2 pt-8 rounded"></div>
        <div className="h-6 bg-gray-200 w-full mb-8 pb-4 rounded"></div>

        {/* Admin/Reader Switch Skeleton */}
        <div className="flex justify-between items-center mb-6 bg-gray-50 p-3 rounded-xl shadow-inner border border-gray-100">
            <div className="h-5 bg-gray-200 w-48 rounded"></div>
            <div className="h-10 bg-[#005691] w-32 rounded-lg"></div>
        </div>
        
        {/* Admin/Publish Panel Skeleton (Only if isAdmin is likely) */}
        <div className="bg-card text-card-foreground rounded-xl shadow-2xl p-6 border-t-4 border-[var(--accent)]">
            <div className="h-6 bg-gray-300 w-64 mb-4 rounded"></div>
            <div className="h-10 bg-gray-200 w-full mb-3 rounded-lg"></div>
            <div className="h-16 bg-gray-200 w-full mb-3 rounded-lg"></div>
            <div className="h-10 bg-gray-300 w-full rounded-lg"></div>
        </div>

        {/* View Mode Buttons Skeleton */}
        <div className="mb-8 flex space-x-4 justify-center">
            <div className="h-10 bg-gray-200 w-40 rounded-full"></div>
            <div className="h-10 bg-gray-200 w-40 rounded-full"></div>
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center space-x-2 mb-5">
            <div className="h-8 bg-gray-200 w-16 rounded"></div>
            <div className="h-8 bg-[#005691] w-8 rounded"></div>
            <div className="h-8 bg-gray-200 w-8 rounded"></div>
            <div className="h-8 bg-gray-200 w-16 rounded"></div>
        </div>

        {/* Post Card Skeletons */}
        <div className="space-y-10 mt-12">
            {Array.from({ length: postsPerPage }).map((_, index) => (
                <PostCardSkeleton key={index} />
            ))}
        </div>
    </div>
);
// -----------------------------------------------------

const useScrollAnimation = (threshold = 0.2, animationClass = "fade-up") => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  const getAnimationClasses = (visible: boolean, type: string) => {
    const baseTransition = "transition-all duration-700 ease-out transform";
    if (visible) return `${baseTransition} opacity-100 translate-x-0 translate-y-0`;
    switch (type) {
      case "slide-right":
        return `${baseTransition} opacity-0 translate-x-32`;
      case "slide-left":
        return `${baseTransition} opacity-0 -translate-x-32`;
      case "fade-up":
      default:
        return `${baseTransition} opacity-0 translate-y-12`;
    }
  };

  const animationClasses = getAnimationClasses(isVisible, animationClass);

  useEffect(() => {
    const currentElement = ref.current;
    if (!currentElement) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );
    observer.observe(currentElement);
    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, [threshold, animationClass]);

  return { ref, animationClasses };
};

export type BlogPost = {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  status: "draft" | "published";
  createdAt?: string;
};

type PostCardProps = {
  post: BlogPost;
  isAdmin: boolean;
  onReadMore: (post: BlogPost) => void;
  onEdit: (post: BlogPost, field: "title" | "content") => void;
  onDelete: (post: BlogPost) => void;
  onPublish: (post: BlogPost) => void;
  onMakePrivate: (post: BlogPost) => void;
};

const PostCard: React.FC<PostCardProps> = ({
  post,
  isAdmin,
  onReadMore,
  onEdit,
  onDelete,
  onPublish,
  onMakePrivate,
}) => {
  const { ref, animationClasses } = useScrollAnimation(0.2, "fade-up");
  const isPublished = post.status === "published";

  const formatDate = (timestamp?: string) => {
    if (!timestamp) return "Just now";
    return new Date(timestamp).toLocaleString();
  };

  const imageToDisplay = post.imageUrl
    ? post.imageUrl
    : `https://placehold.co/400x400/FFD100/005691?text=${encodeURIComponent(
        post.title.substring(0, 15) || "Article"
      )}`;

  return (
    <article
      ref={ref}
      className={`bg-card text-card-foreground rounded-xl overflow-hidden border border-border shadow-xl hover:shadow-2xl transition duration-500 ${animationClasses} flex flex-col`}
    >
      <img src={imageToDisplay} alt={`Image for ${post.title}`} className="w-full h-48 object-cover bg-gray-100" />
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex justify-between items-start mb-3">
            {isAdmin && (
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  isPublished
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-red-100 text-red-700 border border-red-300"
                }`}
              >
                {isPublished ? "PUBLISHED" : "DRAFT"}
              </span>
            )}
            <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
          </div>
          <h3 className="text-2xl font-bold text-[#005691] mb-3">{post.title}</h3>
          <p className="text-gray-700 mb-4 leading-relaxed line-clamp-4">{post.content}</p>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 flex-wrap gap-3">
          <button onClick={() => onReadMore(post)} className="text-amber-700 hover:text-amber-900 font-semibold transition">
            Read More →
          </button>

          {isAdmin && (
            <div className="flex flex-wrap gap-3">
              <button onClick={() => onEdit(post, "title")} className="text-blue-600 font-semibold hover:text-blue-800 transition">
                Edit Title
              </button>
              <button onClick={() => onEdit(post, "content")} className="text-blue-600 font-semibold hover:text-blue-800 transition">
                Edit Content
              </button>
              <button onClick={() => onDelete(post)} className="text-red-500 font-semibold hover:text-red-700 transition">
                Delete
              </button>
              {isPublished ? (
                <button onClick={() => onMakePrivate(post)} className="text-yellow-700 font-semibold hover:text-yellow-900 transition">
                  Make Private
                </button>
              ) : (
                <button onClick={() => onPublish(post)} className="text-green-600 font-semibold hover:text-green-800 transition">
                  Make Public
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

const BlogSection: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [activeModal, setActiveModal] = useState<
    | null
    | { type: "read"; post: BlogPost }
    | { type: "edit"; post: BlogPost; field: "title" | "content" }
    | { type: "delete"; post: BlogPost }
    | { type: "publishConfirm"; post: BlogPost }
    | { type: "saveConfirm"; formData: FormData | { title: string; content: string; imageUrl: string; status: string } }
    | { type: "private"; post: BlogPost }
    | { type: "success"; message: string }
  >(null);
  const [editValue, setEditValue] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageInputType, setImageInputType] = useState<"url" | "file">("url");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<"published" | "draft">("published");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const fetchPosts = useCallback(async () => {
  try {
const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blog`)
    const contentType = res.headers.get("content-type")

    if (!res.ok || !contentType?.includes("application/json")) {
      const raw = await res.text()
      console.error("❌ Unexpected response:", raw)
      throw new Error("Invalid response format")
    }

    const data = await res.json()

    if (data && data.success && Array.isArray(data.data)) {
      const filtered = data.data.filter((p: BlogPost) => p.status === "published")
      setPosts(data.data)
    } else {
      console.error("❌ Unexpected response structure:", data)
      setPosts([]) // ✅ fallback to empty array
    }
  } catch (err) {
    console.error("Error fetching posts:", err)
    setPosts([]) // ✅ fallback to empty array on error
  } finally {
    setIsLoading(false)
  }
}, [])


  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Pagination Calculations
  const filteredPosts = Array.isArray(posts)
  ? posts.filter((p) => (isAdmin ? p.status === viewMode : p.status === "published"))
  : [];
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Save Post with confirmation
  const handleSaveRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content cannot be empty.");
      return;
    }
    if (imageInputType === "url") {
      setActiveModal({ type: "saveConfirm", formData: { title, content, imageUrl, status } });
    } else if (imageInputType === "file" && imageFile) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("status", status);
      formData.append("image", imageFile);
      setActiveModal({ type: "saveConfirm", formData });
    }
  };

  // Confirm Save Post with success message
  const confirmSave = async () => {
    if (!activeModal || activeModal.type !== "saveConfirm") return;
    setActiveModal(null);
    setIsSubmitting(true);
    setError(null);
    try {
      let res;
      if (activeModal.formData instanceof FormData) {
        res = await fetch("/api/blog", { method: "POST", body: activeModal.formData });
      } else {
        res = await fetch("/api/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(activeModal.formData),
        });
      }
      if (!res.ok) throw new Error("Failed to create post");
      await fetchPosts();
      setTitle("");
      setContent("");
      setImageUrl("");
      setImageFile(null);
      setStatus("draft");
      setActiveModal({ type: "success", message: "Post saved successfully!" });
    } catch (e) {
      setError("Failed to publish post.");
      console.error(e);
    }
    setIsSubmitting(false);
  };

  // Update post with optional image edit support
  const updatePost = async (id: string, updatedFields: Partial<BlogPost> | FormData) => {
    let options: RequestInit;
    if (updatedFields instanceof FormData) {
      options = { method: "PUT", body: updatedFields };
    } else {
      options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      };
    }
    await fetch(`/api/blog/crud/${id}`, options);
    await fetchPosts();
  };

  const deletePost = async (id: string) => {
    await fetch(`/api/blog/crud/${id}`, { method: "DELETE" });
    fetchPosts();
  };

  const publishPost = async (post: BlogPost) => {
    await updatePost(post._id, { status: "published" });
  };

  const makePostPrivate = async (post: BlogPost) => {
    await updatePost(post._id, { status: "draft" });
  };

  const handlePublishRequest = (post: BlogPost) => {
    setActiveModal({ type: "publishConfirm", post });
  };

  const confirmPublish = async () => {
    if (activeModal?.type === "publishConfirm") {
      await publishPost(activeModal.post);
      setActiveModal(null);
    }
  };

  if (isLoading) {
    return <BlogSectionSkeleton postsPerPage={postsPerPage} />;
  }

  return (
  <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen font-sans transition-colors duration-500"
  style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      <h1 className="text-5xl md:text-5xl font-extrabold text-[#005691] mb-2 pt-8 text-center">Insights & Inspirations</h1>
      <p className="text-lg mb-8 border-b-2 pb-4"
        style={{ color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
          Articles on recovery, emotional wellness, and building a purposeful life.
      </p>
      {/* Admin/Reader Switch (Visible only after loading) */}
<div
  className="flex justify-between items-center mb-6 p-3 rounded-xl shadow-inner border"
  style={{
    backgroundColor: 'var(--card)',
    borderColor: 'var(--border)',
    color: 'var(--card-foreground)',
  }}
>        <span className={`font-bold ${isAdmin ? "text-[#005691]" : "text-gray-600"}`}>
          {isAdmin ? "Administrator (Write/Edit Access)" : "Reader (Read Only Access)"}
        </span>
        <button
          onClick={() => setIsAdmin(!isAdmin)}
          className={`py-2 px-4 rounded-lg font-bold text-xs shadow-md transition-all duration-300 ${
            isAdmin ? "bg-[#FFD100] text-[#005691]" : "bg-[#005691] text-white"
          }`}
        >
          Switch to {isAdmin ? "Reader" : "Admin"} View
        </button>
      </div>

      {/* Publish New Article Form (Visible only after loading) */}
      {isAdmin && (
        <div className="bg-card text-card-foreground rounded-xl shadow-2xl p-6 border-t-4 border-[var(--accent)]">
          <h2 className="text-2xl font-bold text-[#005691] mb-4">Publish New Article</h2>
          <form onSubmit={handleSaveRequest}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a compelling title"
              required
              className="w-full p-3 mb-3 border rounded-lg"
            />

            <div className="mb-4">
              <label className="flex items-center space-x-4 mb-2">
                <input
                  type="radio"
                  name="imageInputType"
                  value="url"
                  checked={imageInputType === "url"}
                  onChange={() => {
                    setImageInputType("url");
                    setImageFile(null);
                  }}
                />
                <span>Use Image URL</span>
                <input
                  type="radio"
                  name="imageInputType"
                  value="file"
                  checked={imageInputType === "file"}
                  onChange={() => {
                    setImageInputType("file");
                    setImageUrl("");
                  }}
                />
                <span>Upload Image File</span>
              </label>
              {imageInputType === "url" ? (
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste an image URL"
                  className="w-full p-3 border rounded-lg"
                />
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  className="w-full p-3 border rounded-lg"
                />
              )}
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
              className="w-full p-3 mb-3 border rounded-lg"
            >
              <option value="draft">Draft (Private)</option>
              <option value="published">Published (Public)</option>
            </select>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              placeholder="Write the full content..."
              required
              className="w-full p-3 mb-3 border rounded-lg resize-none"
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-[#005691] text-white rounded-lg transition hover:bg-[#003f5c]"
            >
              {isSubmitting ? "Publishing..." : "Save New Post"}
            </button>
          </form>
        </div>
      )}

      {/* View Mode Buttons (Visible only after loading) */}
      {isAdmin && (
        <div className="mb-8 flex space-x-4 justify-center">
          <button
            onClick={() => setViewMode("published")}
            className={`py-2 px-6 rounded-full font-semibold ${
              viewMode === "published" ? "bg-[#FFD100] text-[#005691]" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Published Posts ({posts.filter((p) => p.status === "published").length})
          </button>
          <button
            onClick={() => setViewMode("draft")}
            className={`py-2 px-6 rounded-full font-semibold ${
              viewMode === "draft" ? "bg-[#FFD100] text-[#005691]" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Drafts ({posts.filter((p) => p.status === "draft").length})
          </button>
        </div>
      )}

      {/* Pagination (Visible only after loading) */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <div className="space-y-10 mt-12">
        {currentPosts.length === 0 ? (
          <p className="text-gray-500 text-center p-12 bg-white rounded-xl shadow-inner border">
            No {isAdmin ? viewMode : "published"} articles found.
          </p>
        ) : (
          currentPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              isAdmin={isAdmin}
              onReadMore={(p) => setActiveModal({ type: "read", post: p })}
              onEdit={(p, field) => {
                setEditValue(field === "title" ? p.title : p.content);
                setEditImageFile(null);
                setActiveModal({ type: "edit", post: p, field });
              }}
              onDelete={(p) => setActiveModal({ type: "delete", post: p })}
              onPublish={handlePublishRequest}
              onMakePrivate={makePostPrivate}
            />
          ))
        )}
      </div>

      {activeModal?.type === "read" && (
        <Modal onClose={() => setActiveModal(null)} title={activeModal.post.title}>
          <p className="whitespace-pre-line">{activeModal.post.content}</p>
        </Modal>
      )}

      {activeModal?.type === "edit" && (
        <Modal onClose={() => { setActiveModal(null); setEditImageFile(null); }} title={`Edit ${activeModal.field === "title" ? "Title" : "Content"}`} showCloseX>
          {activeModal.field === "title" ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4 text-lg"
            />
          ) : (
            <textarea
              rows={8}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4 text-lg"
            />
          )}

          <label className="block mb-2 font-semibold">Edit Image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setEditImageFile(e.target.files?.[0] ?? null)} className="w-full mb-4" />
          {editImageFile && <img src={URL.createObjectURL(editImageFile)} alt="Preview" className="mb-4 max-w-xs" />}

          <div className="flex justify-end space-x-4">
            <button className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300" onClick={() => { setActiveModal(null); setEditImageFile(null); }}>
              Cancel
            </button>
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={async () => {
                if (activeModal.type === "edit") {
                  if (editImageFile) {
                    const formData = new FormData();
                    formData.append(activeModal.field, editValue);
                    formData.append("image", editImageFile);
                    await updatePost(activeModal.post._id, formData);
                  } else {
                    await updatePost(activeModal.post._id, { [activeModal.field]: editValue });
                  }
                  setActiveModal(null);
                  setEditImageFile(null);
                  setActiveModal({ type: "success", message: "Post updated successfully!" });
                }
              }}
            >
              Save
            </button>
          </div>
        </Modal>
      )}

      {activeModal?.type === "delete" && (
        <ConfirmModal
          title="Confirm Delete"
          message={`Are you sure you want to permanently delete "${activeModal.post.title}"?`}
          onCancel={() => setActiveModal(null)}
          onConfirm={async () => {
            if (activeModal.type === "delete") {
              await deletePost(activeModal.post._id);
              setActiveModal(null);
              setActiveModal({ type: "success", message: "Post deleted successfully!" });
            }
          }}
        />
      )}

      {activeModal?.type === "publishConfirm" && (
        <ConfirmModal
          title="Confirm Publish"
          message={`Do you want to make "${activeModal.post.title}" public?`}
          onCancel={() => setActiveModal(null)}
          onConfirm={(async () => {
            await confirmPublish();
            setActiveModal({ type: "success", message: "Post published successfully!" });
          })}
        />
      )}

      {activeModal?.type === "saveConfirm" && (
        <ConfirmModal
          title="Confirm Save"
          message="Are you sure you want to save this post?"
          onCancel={() => setActiveModal(null)}
          onConfirm={confirmSave}
        />
      )}

      {activeModal?.type === "private" && (
        <ConfirmModal
          title="Confirm Make Private"
          message={`Do you want to make "${activeModal.post.title}" private (draft)?`}
          onCancel={() => setActiveModal(null)}
          onConfirm={async () => {
            if (activeModal.type === "private") {
              await makePostPrivate(activeModal.post);
              setActiveModal(null);
              setActiveModal({ type: "success", message: "Post marked as private!" });
            }
          }}
        />
      )}

      {activeModal?.type === "success" && (
        <SuccessModal message={activeModal.message} onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
};

const Pagination: React.FC<{ currentPage: number; totalPages: number; onPageChange: (page: number) => void }> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center space-x-2 mb-5">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
      >
        Prev
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 border rounded ${
            currentPage === page ? "bg-[#005691] text-white" : "border-gray-300 hover:bg-gray-200"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

const Modal: React.FC<{ onClose: () => void; title: string; children: React.ReactNode; showCloseX?: boolean }> = ({
  onClose,
  title,
  children,
  showCloseX = false,
}) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-6 overflow-auto"
    onClick={onClose}
  >
    <div className="bg-card text-card-foreground rounded-xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
      <h2 className="text-3xl font-bold text-[#005691] mb-6">{title}</h2>
      {showCloseX && (
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-gray-800">
          &times;
        </button>
      )}
      {children}
      {!showCloseX && (
        <div className="flex justify-end mt-6">
          <button className="px-6 py-3 bg-[#005691] text-white rounded-lg hover:bg-[#003f5c] transition" onClick={onClose}>
            Close
          </button>
        </div>
      )}
    </div>
  </div>
);

const ConfirmModal: React.FC<{
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}> = ({ title, message, onCancel, onConfirm }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-6"
    onClick={onCancel}
  >
    <div className="bg-card text-card-foreground rounded-xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
      <h3 className="text-lg font-bold text-[#005691] mb-4">{title}</h3>
      <p className="text-gray-700 mb-6">{message}</p>
      <div className="flex justify-end space-x-3">
        <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition" onClick={onCancel}>
          Cancel
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition" onClick={onConfirm}>
          Confirm
        </button>
      </div>
    </div>
  </div>
);

const SuccessModal: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-6"
    onClick={onClose}
  >
    <div className="bg-card text-card-foreground rounded-xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
      <p className="text-green-700 text-center text-lg">{message}</p>
      <div className="flex justify-center mt-4">
        <button
          className="px-6 py-3 bg-[#005691] text-white rounded-lg hover:bg-[#003f5c] transition"
          onClick={onClose}
        >
          OK
        </button>
      </div>
    </div>
  </div>
);

const App: React.FC = () => (
  <div className="min-h-screen bg-[#F5F5F5]">
    <BlogSection />
  </div>
);

export default App;