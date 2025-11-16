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
  onEdit: (post: BlogPost) => void;
  onDelete: (post: BlogPost) => void;
  onPublish: (post: BlogPost) => void;
  onMakePrivate: (post: BlogPost) => void;
};

const PostCardAdminView: React.FC<PostCardProps> = ({
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
      <img
        src={imageToDisplay}
        alt={`Image for ${post.title}`}
        className="w-full h-48 object-cover bg-gray-100"
      />
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
          <p
            className="text-gray-700 mb-4 leading-relaxed line-clamp-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 flex-wrap gap-3">
          <button
            onClick={() => onReadMore(post)}
            className="text-amber-700 hover:text-amber-900 font-semibold transition"
          >
            Read More →
          </button>

          {isAdmin && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onEdit(post)}
                className="text-blue-600 font-semibold hover:text-blue-800 transition"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(post)}
                className="text-red-500 font-semibold hover:text-red-700 transition"
              >
                Delete
              </button>
              {isPublished ? (
                <button
                  onClick={() => onMakePrivate(post)}
                  className="text-yellow-700 font-semibold hover:text-yellow-900 transition"
                >
                  Make Private
                </button>
              ) : (
                <button
                  onClick={() => onPublish(post)}
                  className="text-green-600 font-semibold hover:text-green-800 transition"
                >
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

const PostCardUserView: React.FC<{ post: BlogPost; onReadMore: (post: BlogPost) => void }> = ({
  post,
  onReadMore,
}) => {
  const { ref, animationClasses } = useScrollAnimation(0.2, "fade-up");

  const imageToDisplay = post.imageUrl
    ? post.imageUrl
    : `https://placehold.co/400x400/FFD100/005691?text=${encodeURIComponent(
        post.title.substring(0, 15) || "Article"
      )}`;

  // Extract short snippet (simple text-extract fallback)
  const createSnippet = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    return text.length > 100 ? text.substring(0, 97) + "..." : text;
  };

  return (
    <article
      ref={ref}
      className={`border border-border rounded-lg shadow-md p-4 bg-card text-card-foreground cursor-pointer hover:shadow-lg transition ${animationClasses} flex flex-col`}
      onClick={() => onReadMore(post)}
      aria-label={`Read more about ${post.title}`}
    >
      <img
        src={imageToDisplay}
        alt={`Image for ${post.title}`}
        className="w-full h-32 object-cover rounded-md mb-3"
      />
      <h3 className="text-lg font-semibold text-[#005691] mb-2 line-clamp-2">{post.title}</h3>
      <p className="text-gray-700 text-sm line-clamp-3">{createSnippet(post.content)}</p>
    </article>
  );
};

// --- RTE Toolbar ---
// --- Enhanced RTEToolbar with Color Picker ---
const RTEToolbar: React.FC<{ targetId: string }> = ({ targetId }) => {
  const exec = (cmd: string, value?: string) => {
    const el = document.getElementById(targetId) as HTMLElement | null;
    if (el) el.focus();
    try {
      document.execCommand(cmd, false, value);
    } catch (e) {
      console.warn("Formatting command failed", cmd, e);
    }
  };

  // Handler for color picker
  const handleColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    exec("foreColor", e.target.value);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-2 items-center">
      <button type="button" onClick={() => exec("bold")} className="px-3 py-1 border rounded font-bold" title="Bold">
        B
      </button>
      <button type="button" onClick={() => exec("italic")} className="px-3 py-1 border rounded italic" title="Italic">
        I
      </button>
      <button type="button" onClick={() => exec("underline")} className="px-3 py-1 border rounded underline" title="Underline">
        U
      </button>

      {/* Color Picker */}
      <div className="flex items-center gap-2">
        <input
          type="color"
          onChange={handleColor}
          title="Pick Color"
          className="w-8 h-8 border rounded"
        />
        <span className="text-xs">Color</span>
      </div>

      <button type="button" onClick={() => exec("undo")} className="px-3 py-1 border rounded flex items-center gap-2" title="Undo">
        Undo
      </button>
      <button type="button" onClick={() => exec("redo")} className="px-3 py-1 border rounded flex items-center gap-2" title="Redo">
        Redo
      </button>
    </div>
  );
};

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB in bytes

const BlogSection: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<
    | null
    | { type: "read"; post: BlogPost }
    | { type: "edit"; post: BlogPost }
    | { type: "delete"; post: BlogPost }
    | { type: "publishConfirm"; post: BlogPost }
    | { type: "saveConfirm"; formData: FormData | { title: string; content: string; imageUrl: string; status: string } }
    | { type: "private"; post: BlogPost }
    | { type: "success"; message: string }
    | { type: "saveEditConfirm"; id: string; formData: FormData | { title: string; content: string; imageUrl?: string; status?: string } }
  >(null);

  const [editTitle, setEditTitle] = useState("");
  const [editContentInitial, setEditContentInitial] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  const [title, setTitle] = useState("");
  const [contentInitial, setContentInitial] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageInputType, setImageInputType] = useState<"url" | "file">("url");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<"published" | "draft">("published");

  // Refs for contentEditable editors (uncontrolled to avoid caret/undo issues)
  const newEditorRef = useRef<HTMLDivElement | null>(null);
  const editEditorRef = useRef<HTMLDivElement | null>(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  // Show 9 posts per page in user view for grid 3x3, else 5 in admin view
  const postsPerPage = isAdmin ? 5 : 9;

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blog`);
      const contentType = res.headers.get("content-type");

      if (!res.ok || !contentType?.includes("application/json")) {
        const raw = await res.text();
        console.error("❌ Unexpected response:", raw);
        throw new Error("Invalid response format");
      }

      const data = await res.json();

      if (data && data.success && Array.isArray(data.data)) {
        setPosts(data.data);
      } else {
        console.error("❌ Unexpected response structure:", data);
        setPosts([]);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Filter posts based on admin or user and viewMode
  const filteredPosts = Array.isArray(posts)
    ? posts.filter((p) => (isAdmin ? p.status === viewMode : p.status === "published"))
    : [];
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Validate image file size
  const validateFileSize = (file: File | null) => {
    if (file && file.size > MAX_IMAGE_SIZE) {
      setError("Image file size exceeds 2 MB limit.");
      return false;
    }
    setError(null);
    return true;
  };

  // Save Post with confirmation
  const handleSaveRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const htmlContent = newEditorRef.current?.innerHTML?.trim() ?? "";
    if (!title.trim() || !htmlContent) {
      setError("Title and content cannot be empty.");
      return;
    }

    if (imageInputType === "url") {
      setActiveModal({ type: "saveConfirm", formData: { title, content: htmlContent, imageUrl, status } });
    } else if (imageInputType === "file" && imageFile) {
      if (!validateFileSize(imageFile)) return;
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", htmlContent);
      formData.append("status", status);
      formData.append("image", imageFile);
      setActiveModal({ type: "saveConfirm", formData });
    } else {
      // No image file selected for file input
      setActiveModal({ type: "saveConfirm", formData: { title, content: htmlContent, imageUrl: "", status } });
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
      setContentInitial("");
      if (newEditorRef.current) newEditorRef.current.innerHTML = "";
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
      if (!validateFileSize(updatedFields.get("image") as File | null)) {
        throw new Error("Image file size exceeds 2 MB limit.");
      }
      options = { method: "PUT", body: updatedFields };
    } else {
      options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      };
    }
    const res = await fetch(`/api/blog/crud/${id}`, options);
    if (!res.ok) throw new Error("Failed to update");
    await fetchPosts();
  };

  const deletePost = async (id: string) => {
    await fetch(`/api/blog/crud/${id}`, { method: "DELETE" });
    fetchPosts();
  };

  const publishPost = async (post: BlogPost) => {
    setActiveModal({ type: "publishConfirm", post });
  };

  const makePostPrivate = async (post: BlogPost) => {
    setActiveModal({ type: "private", post });
  };

  const handlePublishRequest = (post: BlogPost) => {
    setActiveModal({ type: "publishConfirm", post });
  };

  const confirmPublish = async () => {
    if (activeModal?.type === "publishConfirm") {
      await updatePost(activeModal.post._id, { status: "published" });
      setActiveModal({ type: "success", message: "Post published successfully!" });
    }
  };

  // --- Edit flow (combined title + content) ---
  const openEdit = (post: BlogPost) => {
    setEditTitle(post.title);
    setEditContentInitial(post.content);
    setEditImageFile(null);
    setActiveModal({ type: "edit", post });
    // populate the edit editor after modal opens — handled in modal render using ref
  };

  const requestEditSave = (id: string) => {
    const htmlContent = editEditorRef.current?.innerHTML?.trim() ?? "";
    if (!editTitle.trim() || !htmlContent) {
      setError("Title and content cannot be empty.");
      return;
    }
    if (editImageFile) {
      if (!validateFileSize(editImageFile)) return;
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("content", htmlContent);
      formData.append("image", editImageFile);
      setActiveModal({ type: "saveEditConfirm", id, formData });
    } else {
      setActiveModal({ type: "saveEditConfirm", id, formData: { title: editTitle, content: htmlContent } });
    }
  };

  const confirmEditSave = async () => {
    if (!activeModal || activeModal.type !== "saveEditConfirm") return;
    const { id, formData } = activeModal;
    setActiveModal(null);
    setIsSubmitting(true);
    try {
      await updatePost(id, formData instanceof FormData ? formData : (formData as any));
      setActiveModal({ type: "success", message: "Post updated successfully!" });
    } catch (e) {
      console.error(e);
      setError("Failed to update post.");
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return <BlogSectionSkeleton postsPerPage={postsPerPage} />;
  }

  return (
    <div
      className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen font-sans transition-colors duration-500"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      <h1 className="text-5xl md:text-5xl font-extrabold text-[#005691] mb-2 pt-8 text-center">Insights & Inspirations</h1>
      <p
        className="text-lg mb-8 border-b-2 pb-4"
        style={{ color: "var(--muted-foreground)", borderColor: "var(--border)" }}
      >
        Articles on recovery, emotional wellness, and building a purposeful life.
      </p>
      {/* Admin/Reader Switch (Visible only after loading) */}
      <div
        className="flex justify-between items-center mb-6 p-3 rounded-xl shadow-inner border"
        style={{
          backgroundColor: "var(--card)",
          borderColor: "var(--border)",
          color: "var(--card-foreground)",
        }}
      >
        <span className={`font-bold ${isAdmin ? "text-[#005691]" : "text-gray-600"}`}>
          {isAdmin ? "Administrator (Write/Edit Access)" : "Reader (Read Only Access)"}
        </span>
        <button
          onClick={() => {
            setIsAdmin(!isAdmin);
            setCurrentPage(1); // Reset page on view switch
          }}
          className={`py-2 px-4 rounded-lg font-bold text-xs shadow-md transition-all duration-300 ${
            isAdmin ? "bg-[#FFD100] text-[#005691]" : "bg-[#005691] text-white"
          }`}
        >
          Switch to {isAdmin ? "Reader" : "Admin"} View
        </button>
      </div>

      {/* Publish New Article Form (Visible only if admin) */}
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
                    setError(null);
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
                    setError(null);
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
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setImageFile(file);
                    setError(null);
                    if (file && file.size > MAX_IMAGE_SIZE) {
                      setError("Image file size exceeds 2 MB limit.");
                    }
                  }}
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

            <RTEToolbar targetId="newPostEditor" />
            <div
              id="newPostEditor"
              ref={newEditorRef}
              contentEditable
              role="textbox"
              aria-multiline
              className="w-full p-3 mb-3 border rounded-lg min-h-[150px] bg-white"
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

      {/* View Mode Buttons (Visible only if admin) */}
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

      {/* Posts Listing */}
      <div
        className={
          !isAdmin
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12" // 3x3 grid for user view
            : "space-y-10 mt-12" // vertical list for admin
        }
      >
        {currentPosts.length === 0 ? (
          <p className="text-gray-500 text-center p-12 bg-white rounded-xl shadow-inner border">
            No {isAdmin ? viewMode : "published"} articles found.
          </p>
        ) : isAdmin ? (
          currentPosts.map((post) => (
            <PostCardAdminView
              key={post._id}
              post={post}
              isAdmin={isAdmin}
              onReadMore={(p) => setActiveModal({ type: "read", post: p })}
              onEdit={(p) => openEdit(p)}
              onDelete={(p) => setActiveModal({ type: "delete", post: p })}
              onPublish={handlePublishRequest}
              onMakePrivate={makePostPrivate}
            />
          ))
        ) : (
          currentPosts.map((post) => (
            <PostCardUserView key={post._id} post={post} onReadMore={(p) => setActiveModal({ type: "read", post: p })} />
          ))
        )}
      </div>

      {/* Read More Modal with full content + image */}
      {activeModal?.type === "read" && (
        <Modal onClose={() => setActiveModal(null)} title={activeModal.post.title}>
          {activeModal.post.imageUrl && (
            <img
              src={activeModal.post.imageUrl}
              alt={`Full image for ${activeModal.post.title}`}
              className="w-full max-h-96 object-cover mb-4 rounded"
            />
          )}
          <div dangerouslySetInnerHTML={{ __html: activeModal.post.content }} />
        </Modal>
      )}

      {/* Edit Modal */}
      {activeModal?.type === "edit" && (
        <Modal
          onClose={() => {
            setActiveModal(null);
            setEditImageFile(null);
            setError(null);
          }}
          title={`Edit: ${activeModal.post.title}`}
          showCloseX
        >
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 text-lg"
          />

          <label className="block mb-2 font-semibold">Edit Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setEditImageFile(file);
              setError(null);
              if (file && file.size > MAX_IMAGE_SIZE) {
                setError("Image file size exceeds 2 MB limit.");
              }
            }}
            className="w-full mb-4"
          />
          {editImageFile && <img src={URL.createObjectURL(editImageFile)} alt="Preview" className="mb-4 max-w-xs rounded" />}

          <RTEToolbar targetId="editPostEditor" />
          <div
            id="editPostEditor"
            ref={editEditorRef}
            contentEditable
            role="textbox"
            aria-multiline
            className="w-full p-3 mb-3 border rounded-lg min-h-[180px] bg-white"
            onFocus={() => {
              if (editEditorRef.current && editEditorRef.current.innerHTML.trim() === "") {
                editEditorRef.current.innerHTML = editContentInitial || "";
              }
            }}
          />

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="flex justify-end space-x-4">
            <button
              className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300"
              onClick={() => {
                setActiveModal(null);
                setEditImageFile(null);
                setError(null);
              }}
            >
              Cancel
            </button>
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => {
                if (activeModal.type === "edit") {
                  requestEditSave(activeModal.post._id);
                }
              }}
            >
              Save (will ask confirm)
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
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

      {/* Publish Confirmation Modal */}
      {activeModal?.type === "publishConfirm" && (
        <ConfirmModal
          title="Confirm Publish"
          message={`Do you want to make "${activeModal.post.title}" public?`}
          onCancel={() => setActiveModal(null)}
          onConfirm={async () => {
            await confirmPublish();
          }}
        />
      )}

      {/* Save New Post Confirmation Modal */}
      {activeModal?.type === "saveConfirm" && (
        <ConfirmModal title="Confirm Save" message="Are you sure you want to save this post?" onCancel={() => setActiveModal(null)} onConfirm={confirmSave} />
      )}

      {/* Save Edit Confirmation Modal */}
      {activeModal?.type === "saveEditConfirm" && (
        <ConfirmModal
          title="Confirm Edit Save"
          message="Are you sure you want to save these edits?"
          onCancel={() => setActiveModal(null)}
          onConfirm={async () => {
            await confirmEditSave();
          }}
        />
      )}

      {/* Make Private Confirmation Modal */}
      {activeModal?.type === "private" && (
        <ConfirmModal
          title="Confirm Make Private"
          message={`Do you want to make "${activeModal.post.title}" private (draft)?`}
          onCancel={() => setActiveModal(null)}
          onConfirm={async () => {
            if (activeModal.type === "private") {
              await updatePost(activeModal.post._id, { status: "draft" });
              setActiveModal(null);
              setActiveModal({ type: "success", message: "Post marked as private!" });
            }
          }}
        />
      )}

      {/* Success Modal */}
      {activeModal?.type === "success" && <SuccessModal message={activeModal.message} onClose={() => setActiveModal(null)} />}
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
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-6 overflow-auto" onClick={onClose}>
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
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-6" onClick={onCancel}>
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
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-6" onClick={onClose}>
    <div className="bg-card text-card-foreground rounded-xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
      <p className="text-green-700 text-center text-lg">{message}</p>
      <div className="flex justify-center mt-4">
        <button className="px-6 py-3 bg-[#005691] text-white rounded-lg hover:bg-[#003f5c] transition" onClick={onClose}>
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
