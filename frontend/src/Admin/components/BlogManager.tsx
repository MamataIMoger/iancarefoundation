// frontend/src/components/BlogManager.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

/* ---------- Types ---------- */
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

/* ---------- Constants ---------- */
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, ""); // no trailing slash

/* ---------- Helpers ---------- */
const formatDateShort = (ts?: string | number) => {
  if (!ts) return "—";
  try {
    return new Date(ts).toLocaleDateString();
  } catch {
    return "—";
  }
};

/* ---------- Skeletons ---------- */
const PostCardSkeleton = () => (
  <article className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-3 shadow-sm animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-20 h-14 bg-gray-200 rounded-lg" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-3/5" />
        <div className="h-3 bg-gray-200 rounded w-2/5" />
      </div>
    </div>
  </article>
);

const BlogSectionSkeleton = ({ postsPerPage }: { postsPerPage: number }) => (
  <div className="p-4 max-w-6xl mx-auto min-h-screen">
    <header className="mb-6">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-2 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
    </header>

    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-8 space-y-3">
        <div className="h-36 bg-gray-100 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Array.from({ length: postsPerPage }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>

      <aside className="col-span-12 lg:col-span-4 space-y-3">
        <div className="h-24 bg-gray-100 rounded-xl" />
        <div className="h-32 bg-gray-100 rounded-xl" />
      </aside>
    </div>
  </div>
);

/* ---------- Simple scroll animation hook ---------- */
const useScrollAnimation = (threshold = 0.15) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.unobserve(entry.target);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => {
      try {
        obs.disconnect();
      } catch {}
    };
  }, [threshold]);

  const base = "transition-all duration-600 ease-out transform";
  const classes = isVisible ? `${base} opacity-100 translate-y-0` : `${base} opacity-0 translate-y-6`;
  return { ref, classes };
};

/* ---------- Badge ---------- */
const Badge: React.FC<{ children: React.ReactNode; variant?: "green" | "yellow" | "red" | "blue" }> = ({ children, variant = "blue" }) => {
  const base = "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold";
  const map: Record<string, string> = {
    green: "bg-green-100 text-green-800",
    yellow: "bg-amber-100 text-amber-800",
    red: "bg-red-100 text-red-800",
    blue: "bg-blue-100 text-blue-800",
  };
  return <span className={`${base} ${map[variant] ?? map.blue}`}>{children}</span>;
};

/* ---------- RTE Toolbar (with color button) ---------- */
const RTEToolbar: React.FC<{ targetId: string; onOpenColor: () => void }> = ({ targetId, onOpenColor }) => {
  const exec = (cmd: string, value?: string) => {
    const el = document.getElementById(targetId) as HTMLElement | null;
    if (el) el.focus();
    try {
      // @ts-ignore - execCommand still available in browsers
      document.execCommand(cmd, false, value);
    } catch {}
  };

  return (
    <div className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-white/70 border flex-wrap">
      <div className="flex gap-2">
        <button type="button" onClick={() => exec("bold")} className="px-2 py-1 border rounded text-xs font-bold">
          B
        </button>
        <button type="button" onClick={() => exec("italic")} className="px-2 py-1 border rounded text-xs italic">
          I
        </button>
        <button type="button" onClick={() => exec("underline")} className="px-2 py-1 border rounded text-xs underline">
          U
        </button>
        <button type="button" onClick={() => exec("strikeThrough")} className="px-2 py-1 border rounded text-xs line-through">
          S
        </button>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button type="button" className="px-2 py-1 border rounded text-xs" onClick={() => exec("undo")}>
          Undo
        </button>
        <button type="button" className="px-2 py-1 border rounded text-xs" onClick={() => exec("redo")}>
          Redo
        </button>

        {/* Color button */}
        <button
          type="button"
          onClick={onOpenColor}
          aria-label="Text color"
          className="ml-2 flex items-center gap-2 px-2 py-1 rounded border text-xs"
        >
          <span className="text-xs">A</span>
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2 L3 20 L6 20 L8 15 L16 15 L18 20 L21 20 L12 2 Z" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

/* ---------- Color Picker Popover ---------- */
const ColorPickerPopover: React.FC<{
  color: string;
  onChange: (c: string) => void;
  onClose: () => void;
  anchorId: string; // id of editor to focus/apply to
}> = ({ color, onChange, onClose }) => {
  // small popover styled for mobile too
  return (
    <div className="p-3 bg-white dark:bg-slate-800 border rounded-lg shadow-lg w-full max-w-xs">
      <HexColorPicker color={color} onChange={onChange} />
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded" style={{ backgroundColor: color, border: "1px solid rgba(0,0,0,0.12)" }} />
          <div className="text-xs text-slate-600">{color.toUpperCase()}</div>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="px-3 py-1 rounded border text-sm">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Post Card Admin View ---------- */
const PostCardAdminView: React.FC<PostCardProps> = ({
  post,
  isAdmin,
  onReadMore,
  onEdit,
  onDelete,
  onPublish,
  onMakePrivate,
}) => {
  const { ref, classes } = useScrollAnimation(0.12);
  const isPublished = post.status === "published";

  const hasImage = !!post.imageUrl && post.imageUrl.trim().length > 0;

  return (
    <article
      ref={ref}
      className={`${classes} bg-white dark:bg-slate-800 rounded-xl border p-3 shadow-sm flex gap-3 items-start`}
    >
      <div className="w-28 h-16 rounded-md overflow-hidden flex-shrink-0 border bg-slate-50">
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.imageUrl as string} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-slate-500">No Image</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {isAdmin && (
              <Badge variant={isPublished ? "green" : "yellow"}>
                {isPublished ? "PUBLISHED" : "DRAFT"}
              </Badge>
            )}
            <h3 className="text-sm font-semibold text-sky-800 line-clamp-1 truncate">
              {post.title}
            </h3>
          </div>
          <div className="text-xs text-slate-400">{formatDateShort(post.createdAt)}</div>
        </div>

        <p
          className="text-slate-600 text-sm mt-1 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="flex items-center justify-between mt-3 gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onReadMore(post)}
              className="text-sky-700 text-sm px-2 py-1 rounded hover:bg-sky-50"
            >
              Read
            </button>
            <button
              type="button"
              onClick={() => onEdit(post)}
              className="text-slate-700 text-sm px-2 py-1 rounded hover:bg-slate-50"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(post)}
              className="text-red-600 text-sm px-2 py-1 rounded hover:bg-red-50"
            >
              Delete
            </button>
          </div>

          <div>
            {isPublished ? (
              <button
                type="button"
                onClick={() => onMakePrivate(post)}
                className="px-2 py-1 bg-amber-300 text-amber-900 text-sm rounded"
              >
                Make Private
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onPublish(post)}
                className="px-2 py-1 bg-green-600 text-white text-sm rounded"
              >
                Publish
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};


/* ---------- Post Card User View (with Read More button) ---------- */
const PostCardUserView: React.FC<{
  post: BlogPost;
  onReadMore: (post: BlogPost) => void;
}> = ({ post, onReadMore }) => {
  const { ref, classes } = useScrollAnimation(0.12);

  const hasImage = !!post.imageUrl && post.imageUrl.trim().length > 0;

  const createSnippet = (html: string) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    return text.length > 120 ? text.substring(0, 117) + "..." : text;
  };

  return (
    <article
      ref={ref}
      className={`${classes} rounded-xl overflow-hidden border bg-white dark:bg-slate-800 shadow-sm hover:shadow-md flex flex-col`}
    >
      {/* Image */}
      <div className="w-full h-44 bg-slate-100">
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.imageUrl as string}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-sm font-semibold text-sky-800 line-clamp-2 mb-1">
          {post.title}
        </h3>

        <p className="text-slate-600 mt-1 text-sm flex-grow">
          {createSnippet(post.content)}
        </p>

        {/* Read More button */}
        <button
          type="button"
          onClick={() => onReadMore(post)}
          className="mt-3 text-sm font-medium px-3 py-1.5 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition self-start"
        >
          Read More →
        </button>
      </div>
    </article>
  );
};

/* ---------- Pagination ---------- */
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 rounded border disabled:opacity-50 text-sm"
      >
        Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded text-sm ${
            currentPage === p ? "bg-sky-700 text-white" : "border hover:bg-slate-100"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 rounded border disabled:opacity-50 text-sm"
      >
        Next
      </button>
    </div>
  );
};

/* ---------- Modal Components ---------- */
const Modal: React.FC<{
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseX?: boolean;
}> = ({ onClose, title, children, showCloseX = false }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    onClick={onClose}
  >
    <div
      className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl shadow-2xl p-4 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
      onClick={(e) => e.stopPropagation()}
    >
      {title && <h2 className="text-lg font-bold text-sky-800 mb-3">{title}</h2>}
      {showCloseX && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-xl"
        >
          &times;
        </button>
      )}

      {children}

      {!showCloseX && (
        <div className="flex justify-end mt-3">
          <button type="button" className="px-4 py-1.5 rounded bg-sky-700 text-white" onClick={onClose}>
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
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    onClick={onCancel}
  >
    <div
      className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-4 max-w-md w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-md font-bold text-sky-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 mb-4">{message}</p>

      <div className="flex justify-end gap-2">
        <button type="button" className="px-3 py-1 rounded border" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="px-3 py-1 rounded bg-green-600 text-white" onClick={onConfirm}>
          Confirm
        </button>
      </div>
    </div>
  </div>
);

const SuccessModal: React.FC<{ message: string; onClose: () => void }> = ({
  message,
  onClose,
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    onClick={onClose}
  >
    <div
      className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-4 max-w-sm w-full"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="text-green-700 text-center font-semibold">{message}</p>
      <div className="flex justify-center mt-3">
        <button type="button" className="px-4 py-1.5 bg-sky-700 text-white rounded" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  </div>
);

/* ---------- Main BlogSection ---------- */
console.log("API BASE URL =", process.env.NEXT_PUBLIC_API_BASE_URL);
const BlogSection: React.FC = () => {
  // Reader view by default
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  type ActiveModal =
    | null
    | { type: "read"; post: BlogPost }
    | { type: "edit"; post: BlogPost }
    | { type: "delete"; post: BlogPost }
    | { type: "publishConfirm"; post: BlogPost }
    | {
        type: "saveConfirm";
        formData:
          | FormData
          | { title: string; content: string; status: string };
      }
    | { type: "private"; post: BlogPost }
    | { type: "success"; message: string }
    | {
        type: "saveEditConfirm";
        id: string;
        formData: FormData | { title: string; content: string };
      };

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editContentInitial, setEditContentInitial] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);

  const [title, setTitle] = useState("");
  const [contentInitial, setContentInitial] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<"published" | "draft">("published");

  const newEditorRef = useRef<HTMLDivElement | null>(null);
  const editEditorRef = useRef<HTMLDivElement | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = isAdmin ? 5 : 9;

  // color states for new/edit editors
  const [newTextColor, setNewTextColor] = useState<string>("#111827"); // default near-slate-900
  const [editTextColor, setEditTextColor] = useState<string>("#111827");
  const [showNewColorPicker, setShowNewColorPicker] = useState(false);
  const [showEditColorPicker, setShowEditColorPicker] = useState(false);

  // Compute proper admin/public base paths for actions
  const getPublicPath = (suffix = "") => `${API_BASE || ""}/blog${suffix}`;
  const getAdminPath = (suffix = "") => `${API_BASE || ""}/blog/crud${suffix}`;

  /* -------------------------------------------------------------
     FETCH POSTS — ALWAYS use public GET /blog for listing.
  ------------------------------------------------------------- */
  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);

      const url = getPublicPath("");
      const res = await fetch(url);
      const contentType = res.headers.get("content-type") ?? "";

      if (!res.ok) {
        let text = "";
        try {
          text = await res.text();
        } catch {}
        console.error("Fetch failed:", text || `status ${res.status}`);
        setPosts([]);
        return;
      }

      if (!contentType.includes("application/json")) {
        let text = "";
        try {
          text = await res.text();
        } catch {}
        console.error("Unexpected content type:", text || contentType);
        setPosts([]);
        return;
      }

      const data = await res.json();
      const raw = Array.isArray(data) ? data : data?.data ?? [];
      if (!Array.isArray(raw)) {
        console.error("Unexpected payload shape from /api/blog:", data);
        setPosts([]);
        return;
      }

      setPosts(raw);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, isAdmin]);

  /* ---------- Derived lists ---------- */
  const filteredPosts = Array.isArray(posts)
    ? posts.filter((p) =>
        isAdmin ? p.status === viewMode : p.status === "published"
      )
    : [];

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage));

  /* ---------- Helpers ---------- */
  const validateFileSize = (file: File | null) => {
    if (file && file.size > MAX_IMAGE_SIZE) {
      setError("Image file size exceeds 2 MB limit.");
      return false;
    }
    setError(null);
    return true;
  };

  /* -------------------------------------------------------------
     UPDATE POST — for admin use /blog/crud/:id
  ------------------------------------------------------------- */
  const updatePost = async (
    id: string,
    updatedFields: Partial<BlogPost> | FormData
  ) => {
    const url = getAdminPath(`/${id}`);

    let options: RequestInit;

    if (updatedFields instanceof FormData) {
      if (!validateFileSize(updatedFields.get("image") as File | null)) {
        throw new Error("Image file too big");
      }
      options = { method: "PUT", body: updatedFields };
    } else {
      options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      };
    }

    const res = await fetch(url, options);

    if (!res.ok) {
      const text = await res.text();
      throw new Error("Failed to update: " + text);
    }

    return await res.json();
  };

  /* -------------------------------------------------------------
     DELETE POST — admin endpoint
  ------------------------------------------------------------- */
  const deletePost = async (id: string) => {
    const url = getAdminPath(`/${id}`);
    const res = await fetch(url, { method: "DELETE" });

    if (!res.ok) {
      const text = await res.text();
      throw new Error("Failed to delete: " + text);
    }

    return await res.json();
  };

  /* -------------------------------------------------------------
     SAVE NEW POST — admin create (/blog/crud)
  ------------------------------------------------------------- */
  const handleSaveRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const htmlContent = newEditorRef.current?.innerHTML?.trim() ?? "";

    if (!title.trim() || !htmlContent) {
      setError("Title and content cannot be empty.");
      return;
    }

    if (!imageFile) {
      setError("Please upload an image.");
      return;
    }

    if (!validateFileSize(imageFile)) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", htmlContent);
    formData.append("status", status);
    formData.append("image", imageFile);

    setActiveModal({ type: "saveConfirm", formData });
  };

  const confirmSave = async () => {
    if (!activeModal || activeModal.type !== "saveConfirm") return;

    setActiveModal(null);
    setIsSubmitting(true);
    setError(null);

    try {
      const url = getAdminPath("");

      const res =
        activeModal.formData instanceof FormData
          ? await fetch(url, { method: "POST", body: activeModal.formData })
          : await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(activeModal.formData),
            });

      if (!res.ok) {
        const text = await res.text();
        throw new Error("Failed to create post: " + text);
      }

      await fetchPosts(); // re-fetch public list

      // reset form
      setTitle("");
      setContentInitial("");
      if (newEditorRef.current) newEditorRef.current.innerHTML = "";
      setImageFile(null);
      setStatus("draft");

      setActiveModal({ type: "success", message: "Post saved successfully!" });
    } catch (e) {
      console.error(e);
      setError("Failed to publish post.");
    }

    setIsSubmitting(false);
  };

  /* ---------- Edit Post Flow ---------- */
  const openEdit = (post: BlogPost) => {
    setEditTitle(post.title);
    setEditContentInitial(post.content);
    // also set current content into editor element
    setTimeout(() => {
      if (editEditorRef.current) editEditorRef.current.innerHTML = post.content || "";
    }, 0);
    setEditImageFile(null);
    setActiveModal({ type: "edit", post });
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
      setActiveModal({
        type: "saveEditConfirm",
        id,
        formData: { title: editTitle, content: htmlContent },
      });
    }
  };

  const confirmEditSave = async () => {
    if (!activeModal || activeModal.type !== "saveEditConfirm") return;

    const { id, formData } = activeModal;

    setActiveModal(null);
    setIsSubmitting(true);

    try {
      await updatePost(id, formData instanceof FormData ? formData : formData);
      await fetchPosts();

      setActiveModal({
        type: "success",
        message: "Post updated successfully!",
      });
    } catch (e) {
      console.error(e);
      setError("Failed to update post.");
    }

    setIsSubmitting(false);
  };

  const confirmDelete = async (id: string) => {
    try {
      await deletePost(id);
      await fetchPosts();

      setActiveModal({ type: "success", message: "Post deleted successfully!" });
    } catch (e) {
      console.error(e);
      setError("Failed to delete post.");
    }
  };

  /* ---------- Color apply helpers ---------- */
  const applyColorToEditor = (editorId: string, color: string) => {
    const el = document.getElementById(editorId) as HTMLElement | null;
    if (!el) return;
    el.focus();
    try {
      // Use execCommand to apply color to current selection
      // @ts-ignore
      document.execCommand("foreColor", false, color);
    } catch (err) {
      console.error("Failed to apply color:", err);
    }
  };

  /* ---------- Loading ---------- */
  if (isLoading) {
    return <BlogSectionSkeleton postsPerPage={postsPerPage} />;
  }

  /* ---------- Render UI ---------- */
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white py-6 rounded-2xl shadow-lg mb-6">
          <div className="px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-7xl mx-auto">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Insights & Inspirations
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdmin(false);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                    !isAdmin ? "bg-white text-sky-700" : "bg-white/20 text-white"
                  }`}
                >
                  Reader View
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsAdmin(true);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                    isAdmin ? "bg-white text-sky-700" : "bg-white/20 text-white"
                  }`}
                >
                  Admin View
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <main className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <section className="col-span-12 lg:col-span-8 space-y-4">
            {/* Controls */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="text-slate-400">Showing</div>
                <div className="font-semibold">
                  {isAdmin ? (viewMode === "published" ? "Published" : "Drafts") : "Published"}
                </div>
                <div className="text-slate-400">• {filteredPosts.length} items</div>
              </div>

              <div className="flex items-center gap-2">
                {isAdmin && (
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode("published");
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        viewMode === "published" ? "bg-amber-300 text-amber-900" : "bg-white/60"
                      }`}
                    >
                      Published ({posts.filter((p) => p.status === "published").length})
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setViewMode("draft");
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        viewMode === "draft" ? "bg-amber-300 text-amber-900" : "bg-white/60"
                      }`}
                    >
                      Drafts ({posts.filter((p) => p.status === "draft").length})
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Admin: Create New Post */}
            {isAdmin && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 border">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-sky-800">Publish New Article</h2>
                    <p className="text-sm text-slate-500 mt-1">Write and publish a short article for the site.</p>

                    <form onSubmit={handleSaveRequest} className="mt-3 space-y-2">
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter title"
                        required
                        className="w-full p-2 border rounded-lg text-sm"
                      />

                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">Upload Image</span>

                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                          className="p-1 border rounded text-sm"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          setImageFile(file);
                          setError(null);
                          if (file && file.size > MAX_IMAGE_SIZE) setError("Image file exceeds 2 MB");
                        }}
                        className="w-full text-sm"
                      />

                      {/* Color picker + toolbar for new post */}
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <RTEToolbar
                              targetId="newPostEditor"
                              onOpenColor={() => {
                                setShowNewColorPicker((s) => !s);
                              }}
                            />
                          </div>

                          {/* Small color swatch for new editor */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowNewColorPicker((s) => !s)}
                              className="w-8 h-8 rounded-full border"
                              aria-label="Open text color picker"
                              style={{ backgroundColor: newTextColor }}
                            />
                            {showNewColorPicker && (
                              <div className="absolute right-0 mt-2 z-50">
                                <ColorPickerPopover
                                  color={newTextColor}
                                  onChange={(c) => {
                                    setNewTextColor(c);
                                    applyColorToEditor("newPostEditor", c);
                                  }}
                                  onClose={() => setShowNewColorPicker(false)}
                                  anchorId="newPostEditor"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div
                        id="newPostEditor"
                        ref={newEditorRef}
                        contentEditable
                        role="textbox"
                        aria-multiline
                        className="w-full p-2 border rounded-lg min-h-[120px] bg-white dark:bg-slate-900 text-sm"
                      />

                      {error && <p className="text-red-500 text-sm">{error}</p>}

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-4 py-1.5 rounded-full bg-sky-700 text-white text-sm font-semibold"
                        >
                          {isSubmitting ? "Publishing..." : "Save New Post"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Posts List */}
            <div className="space-y-3">
              {currentPosts.length === 0 ? (
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <p className="text-slate-500 text-center">No {isAdmin ? viewMode : "published"} articles found.</p>
                </div>
              ) : isAdmin ? (
                <div className="space-y-3">
                  {currentPosts.map((post) => (
                    <PostCardAdminView
                      key={post._id}
                      post={post}
                      isAdmin={isAdmin}
                      onReadMore={(p) => setActiveModal({ type: "read", post: p })}
                      onEdit={(p) => openEdit(p)}
                      onDelete={(p) => setActiveModal({ type: "delete", post: p })}
                      onPublish={(p) => setActiveModal({ type: "publishConfirm", post: p })}
                      onMakePrivate={(p) => setActiveModal({ type: "private", post: p })}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentPosts.map((post) => (
                    <PostCardUserView key={post._id} post={post} onReadMore={(p) => setActiveModal({ type: "read", post: p })} />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-4">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => setCurrentPage(p)} />
            </div>
          </section>

          {/* Right Sidebar */}
          <aside className="col-span-12 lg:col-span-4 space-y-3">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-sky-800">Overview</h3>
                  <p className="text-xs text-slate-500">Quick stats</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{posts.length}</div>
                  <div className="text-xs text-slate-400">Total posts</div>
                </div>
              </div>

              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="text-slate-600">Published</div>
                  <div className="font-semibold">{posts.filter((p) => p.status === "published").length}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-slate-600">Drafts</div>
                  <div className="font-semibold">{posts.filter((p) => p.status === "draft").length}</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border">
              <h4 className="font-semibold text-sky-800 text-sm">Recent Posts</h4>

              <ul className="mt-2 space-y-2 text-sm">
                {posts.slice(0, 4).map((p) => {
                  const hasImage = !!p.imageUrl && p.imageUrl.trim().length > 0;

                  return (
                    <li key={p._id} className="flex items-center gap-2 py-1">
                      <div className="w-12 h-8 rounded-md overflow-hidden bg-sky-50 border flex-shrink-0">
                        {hasImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.imageUrl as string} alt={p.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">No</div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold line-clamp-1">{p.title}</div>
                        <div className="text-xs text-slate-400">{formatDateShort(p.createdAt ?? Date.now())}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </main>
      </div>

      {/* ---------- Modals ---------- */}

      {/* Read Modal */}
      {activeModal?.type === "read" && (
        <Modal onClose={() => setActiveModal(null)} title={activeModal.post.title}>
          {activeModal.post.imageUrl && activeModal.post.imageUrl.trim().length > 0 && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={activeModal.post.imageUrl} alt={activeModal.post.title} className="w-full max-h-80 object-cover rounded mb-4" />
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
            setShowEditColorPicker(false);
          }}
          title={`Edit: ${activeModal.post.title}`}
          showCloseX
        >
          <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full p-2 border rounded-lg mb-3 text-lg" />

          <label className="block mb-2 font-semibold">Edit Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setEditImageFile(file);
              setError(null);

              if (file && file.size > MAX_IMAGE_SIZE) setError("Image file size exceeds 2 MB");
            }}
            className="w-full mb-3 text-sm"
          />

          {editImageFile && <img src={URL.createObjectURL(editImageFile)} alt="Preview" className="mb-3 max-w-xs rounded" />}

          {/* Color picker + toolbar for edit modal */}
          <div className="mb-2 flex items-center gap-3">
            <div className="flex-1">
              <RTEToolbar
                targetId="editPostEditor"
                onOpenColor={() => {
                  setShowEditColorPicker((s) => !s);
                }}
              />
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEditColorPicker((s) => !s)}
                className="w-8 h-8 rounded-full border"
                aria-label="Open text color picker"
                style={{ backgroundColor: editTextColor }}
              />
              {showEditColorPicker && (
                <div className="absolute right-0 mt-2 z-50">
                  <ColorPickerPopover
                    color={editTextColor}
                    onChange={(c) => {
                      setEditTextColor(c);
                      applyColorToEditor("editPostEditor", c);
                    }}
                    onClose={() => setShowEditColorPicker(false)}
                    anchorId="editPostEditor"
                  />
                </div>
              )}
            </div>
          </div>

          <div
            id="editPostEditor"
            ref={editEditorRef}
            contentEditable
            role="textbox"
            aria-multiline
            className="w-full p-2 mb-3 border rounded-lg min-h-[140px] bg-white text-sm"
            onFocus={() => {
              if (editEditorRef.current && editEditorRef.current.innerHTML.trim() === "") {
                editEditorRef.current.innerHTML = editContentInitial || "";
              }
            }}
          />

          {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-1.5 bg-gray-100 rounded"
              onClick={() => {
                setActiveModal(null);
                setEditImageFile(null);
                setError(null);
                setShowEditColorPicker(false);
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              className="px-4 py-1.5 bg-sky-700 text-white rounded"
              onClick={() => {
                if (activeModal?.type === "edit") {
                  requestEditSave(activeModal.post._id);
                }
              }}
            >
              Save (will ask confirm)
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {activeModal?.type === "delete" && (
        <ConfirmModal
          title="Confirm Delete"
          message={`Are you sure you want to permanently delete "${activeModal.post.title}"?`}
          onCancel={() => setActiveModal(null)}
          onConfirm={async () => {
            await confirmDelete(activeModal.post._id);
            setActiveModal(null);
          }}
        />
      )}

      {/* Publish Confirm */}
      {activeModal?.type === "publishConfirm" && (
        <ConfirmModal
          title="Confirm Publish"
          message={`Do you want to make "${activeModal.post.title}" public?`}
          onCancel={() => setActiveModal(null)}
          onConfirm={async () => {
            try {
              await updatePost(activeModal.post._id, { status: "published" });
              await fetchPosts();

              setActiveModal({
                type: "success",
                message: "Post published successfully!",
              });
            } catch (e) {
              console.error(e);
              setError("Failed to publish post.");
            }
          }}
        />
      )}

      {/* Save New Post Confirm */}
      {activeModal?.type === "saveConfirm" && (
        <ConfirmModal title="Confirm Save" message="Are you sure you want to save this post?" onCancel={() => setActiveModal(null)} onConfirm={confirmSave} />
      )}

      {/* Save Edit Confirm */}
      {activeModal?.type === "saveEditConfirm" && (
        <ConfirmModal title="Confirm Edit Save" message="Are you sure you want to save these edits?" onCancel={() => setActiveModal(null)} onConfirm={confirmEditSave} />
      )}

      {/* Make Private */}
      {activeModal?.type === "private" && (
        <ConfirmModal
          title="Confirm Make Private"
          message={`Do you want to make "${activeModal.post.title}" private (draft)?`}
          onCancel={() => setActiveModal(null)}
          onConfirm={async () => {
            try {
              await updatePost(activeModal.post._id, { status: "draft" });
              await fetchPosts();

              setActiveModal({
                type: "success",
                message: "Post marked as private!",
              });
            } catch (e) {
              console.error(e);
              setError("Failed to mark private.");
            }
          }}
        />
      )}

      {/* Success */}
      {activeModal?.type === "success" && <SuccessModal message={activeModal.message} onClose={() => setActiveModal(null)} />}
    </div>
  );
};

/* ---------- App Wrapper (if needed) ---------- */
const App: React.FC = () => (
  <div className="min-h-screen">
    <BlogSection />
  </div>
);

export default App;
