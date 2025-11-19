"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Loader2, Search as SearchIcon } from "lucide-react";
import { motion } from "framer-motion";

interface Story {
  _id: string;
  title: string;
  content: string;
  author: string;
  category?: "General" | "Recovery" | string;
  approved?: boolean;
  rejected?: boolean;
  status?: "approved" | "pending" | "rejected" | string;
  createdAt?: string;
  updatedAt?: string;
}

/* ---------- Theme helper (client-only) ---------- */
const getThemeColors = (isDark?: boolean) => {
  const dark =
    typeof isDark === "boolean"
      ? isDark
      : typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  if (!dark) {
    return {
      COLOR_PRIMARY: "#0050A4",
      COLOR_SECONDARY: "#FFC72C",
      COLOR_TEXT: "#1E272E",
      CARD_BG: "var(--card)",
      MUTED_BG: "var(--muted)",
      BORDER: "var(--border)",
    };
  }
  return {
    COLOR_PRIMARY: "var(--primary)",
    COLOR_SECONDARY: "var(--secondary)",
    COLOR_TEXT: "var(--foreground)",
    CARD_BG: "var(--card)",
    MUTED_BG: "var(--muted)",
    BORDER: "var(--border)",
  };
};

/* ---------- Small UI components ---------- */
const ConfirmModal: React.FC<{
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}> = ({ title, message, onCancel, onConfirm, loading }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4"
    onClick={onCancel}
    aria-modal="true"
    role="dialog"
  >
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-5"
      onClick={(e) => e.stopPropagation()}
    >
      <h4 className="text-lg font-semibold mb-2" style={{ color: "var(--foreground)" }}>
        {title}
      </h4>
      <p className="mb-4 text-sm text-muted-foreground">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-700"
          onClick={onCancel}
          disabled={!!loading}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 rounded bg-green-600 text-white flex items-center gap-2"
          onClick={onConfirm}
          disabled={!!loading}
        >
          {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Confirm"}
        </button>
      </div>
    </div>
  </div>
);

const SuccessPopup: React.FC<{ message: string }> = ({ message }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 text-center pointer-events-auto min-w-[200px]">
      <div className="text-3xl mb-2 text-green-500">✓</div>
      <div className="font-semibold mb-1 text-gray-900 dark:text-gray-100">{message}</div>
    </div>
  </div>
);

/* ---------- Main component ---------- */
export default function AdminStoriesManager() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"approved" | "pending" | "rejected" | "all">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const storiesPerPage = 6;

  const [selected, setSelected] = useState<Story | null>(null);
  const [activeModal, setActiveModal] = useState<null | { type: "approve" | "reject" | "delete" | "success"; payload?: any }>(null);
  const [actionLoadingMap, setActionLoadingMap] = useState<Record<string, boolean>>({});
  const [themeColors, setThemeColors] = useState(getThemeColors());

  /* Theme listener (MutationObserver) */
  useEffect(() => {
    const update = () => setThemeColors(getThemeColors());
    update();
    if (typeof document !== "undefined") {
      const mo = new MutationObserver(update);
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      return () => mo.disconnect();
    }
    return;
  }, []);

  /* Fetch stories */
  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const url = base ? `${base}/stories?admin=true` : `/api/stories?admin=true`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const rawArray = Array.isArray(data) ? data : data.data ?? [];
      const normalized: Story[] = rawArray.map((s: any) => ({
        ...s,
        status: s.approved ? "approved" : s.rejected ? "rejected" : "pending",
      }));
      // sort by createdAt desc
      const sorted = normalized.sort((a, b) => (new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()));
      setStories(sorted);
      setSelected(sorted[0] ?? null);
    } catch (err) {
      console.error("fetchStories error:", err);
      setStories([]);
      setSelected(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  /* Filter + search */
  const filtered = useMemo(() => {
    let arr = stories.slice();
    if (viewMode !== "all") arr = arr.filter((s) => (s.status || "pending") === viewMode);
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      arr = arr.filter(
        (s) => (s.title || "").toLowerCase().includes(q) || (s.author || "").toLowerCase().includes(q)
      );
    }
    return arr;
  }, [stories, viewMode, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / storiesPerPage));
  const pageData = filtered.slice((currentPage - 1) * storiesPerPage, currentPage * storiesPerPage);

  /* Actions */
  const updateStoryStatus = async (id: string, status: "approved" | "rejected") => {
    setActionLoadingMap((p) => ({ ...p, [id]: true }));
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const url = base ? `${base}/stories/${id}` : `/api/stories/${id}`;
      const body = status === "approved" ? { approved: true, rejected: false } : { approved: false, rejected: true };
      const res = await fetch(url, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error("failed");
      setStories((prev) => prev.map((s) => (s._id === id ? { ...s, approved: status === "approved", rejected: status === "rejected", status } : s)));
      setSelected((cur) => (cur?._id === id ? { ...cur, approved: status === "approved", rejected: status === "rejected", status } : cur));
      setActiveModal({ type: "success", payload: `${status === "approved" ? "Approved" : "Rejected"} successfully` });
      setTimeout(() => setActiveModal(null), 1600);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingMap((p) => ({ ...p, [id]: false }));
    }
  };

  const deleteStory = async (id: string) => {
    setActionLoadingMap((p) => ({ ...p, [id]: true }));
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const url = base ? `${base}/stories/${id}` : `/api/stories/${id}`;
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("delete failed");
      setStories((prev) => prev.filter((s) => s._id !== id));
      setSelected((cur) => (cur?._id === id ? null : cur));
      setActiveModal({ type: "success", payload: "Deleted successfully" });
      setTimeout(() => setActiveModal(null), 1600);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingMap((p) => ({ ...p, [id]: false }));
    }
  };

  const openConfirm = (type: "approve" | "reject" | "delete", story: Story) => {
    setActiveModal({ type, payload: story });
  };

  /* Loading state */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--background)" }}>
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    );
  }

  /* Responsive UI */
  return (
    <div className="min-h-screen p-4 sm:p-6" style={{ background: "var(--muted)" }}>
      {activeModal?.type === "success" && <SuccessPopup message={activeModal.payload || "Done"} />}

      <div className="mx-auto rounded-2xl shadow-md overflow-hidden w-full" style={{ background: "var(--card)", maxWidth: 1200 }}>
        {/* Header */}
        <div className="p-4 sm:p-6 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
            <div className="w-full lg:w-auto">
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: themeColors.COLOR_PRIMARY }}>
                Stories Manager
              </h1>
              <p className="text-sm opacity-75 mt-1">Review, moderate and manage user-submitted stories.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center px-3 py-2 rounded-full border w-full sm:w-auto" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                <SearchIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                <input
                  placeholder="Search title or author..."
                  className="outline-none bg-transparent text-sm w-full"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ color: "var(--foreground)" }}
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                {(["all", "pending", "approved", "rejected"] as const).map((s) => {
                  const active = viewMode === s;
                  const label = s === "all" ? "All" : s[0].toUpperCase() + s.slice(1);
                  return (
                    <button
                      key={s}
                      onClick={() => {
                        setViewMode(s as any);
                        setCurrentPage(1);
                      }}
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        background: active ? themeColors.COLOR_PRIMARY : "transparent",
                        color: active ? "#fff" : "var(--foreground)",
                        border: `1px solid var(--border)`,
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6" style={{ background: "var(--muted)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 max-w-[1150px] mx-auto">
            {/* Left list */}
            <div className="rounded-xl p-4 sm:p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold" style={{ color: themeColors.COLOR_PRIMARY }}>
                  Stories
                </h3>
                <span className="text-sm opacity-75">{filtered.length} results</span>
              </div>

              <div className="space-y-4">
  {pageData.map((s, idx) => {
    const initials = (s.author || "U")
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const isLoading = actionLoadingMap[s._id];

return (
  <motion.div
    key={s._id}
    initial={{ y: 6, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: idx * 0.03 }}
    className="
      rounded-xl border p-4 w-full
      bg-white dark:bg-gray-800 
      hover:shadow-md transition-shadow cursor-pointer
      flex flex-col sm:flex-row sm:items-center gap-4
    "
    style={{ borderColor: "var(--border)" }}
    onClick={() => setSelected(s)}
  >
    {/* LEFT – Avatar */}
    <div className="flex-shrink-0 flex justify-center sm:justify-start">
      <div
        className="
          w-14 h-14 rounded-full flex items-center 
          justify-center text-xl font-bold shadow-sm
        "
        style={{ background: themeColors.COLOR_PRIMARY, color: "white" }}
      >
        {initials}
      </div>
    </div>

    {/* MIDDLE – Info Section */}
    <div className="flex flex-col flex-1 min-w-0">
      {/* Title & Date */}
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-semibold text-[16px] truncate text-blue-800 dark:text-blue-300">
          {s.title}
        </h3>

        <span className="text-xs opacity-70">
          {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "—"}
        </span>
      </div>

      {/* Author */}
      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
        {s.author}
      </p>

      {/* Status Pill */}
      <span
        className="
          mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold w-fit
        "
        style={{
          background:
            s.status === "approved"
              ? "#d1fae5"
              : s.status === "rejected"
              ? "#fee2e2"
              : "#fef9c3",
          color:
            s.status === "approved"
              ? "#065f46"
              : s.status === "rejected"
              ? "#991b1b"
              : "#854d0e",
        }}
      >
        {s.status?.toUpperCase() || "PENDING"}
      </span>
    </div>

    {/* RIGHT – Action Chips (Non-button UI) */}
    <div
      className="
        flex sm:flex-col gap-2 justify-between sm:justify-center
        w-full sm:w-[130px]
      "
      onClick={(e) => e.stopPropagation()}
    >
      {/* Approve Chip */}
      <div
        onClick={() => openConfirm("approve", s)}
        className="
          px-3 py-1.5 rounded-full text-xs font-semibold 
          bg-green-100 text-green-700
          hover:bg-green-200 transition
          text-center cursor-pointer select-none
        "
      >
        Approve
      </div>

      {/* Reject Chip */}
      <div
        onClick={() => openConfirm("reject", s)}
        className="
          px-3 py-1.5 rounded-full text-xs font-semibold 
          bg-red-100 text-red-700
          hover:bg-red-200 transition
          text-center cursor-pointer select-none
        "
      >
        Reject
      </div>
    </div>
  </motion.div>
);



  })}
</div>


              {/* Pagination */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <button
                  className="px-3 py-1 rounded border"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={{ borderColor: "var(--border)" }}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  const active = p === currentPage;
                  return (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className="px-3 py-1 rounded border text-sm"
                      style={{
                        borderColor: active ? themeColors.COLOR_PRIMARY : "var(--border)",
                        background: active ? themeColors.COLOR_PRIMARY : "transparent",
                        color: active ? "#fff" : "var(--foreground)",
                      }}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  className="px-3 py-1 rounded border"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  style={{ borderColor: "var(--border)" }}
                >
                  Next
                </button>
              </div>
            </div>

            {/* Detail panel */}
            <aside
              className="rounded-xl p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 min-h-[300px] overflow-y-auto"
              style={{ maxWidth: 420 }}
            >
              {!selected ? (
                <div className="flex items-center justify-center h-full text-muted-foreground font-semibold">
                  Select a story to view details
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center text-center mb-4">
                    <div
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-indigo-100 dark:bg-indigo-700 flex items-center justify-center text-indigo-600 dark:text-indigo-200 text-3xl sm:text-4xl font-bold mb-3 select-none"
                      aria-hidden
                    >
                      {(selected.author || "U")
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold mb-1">{selected.title}</h2>
                    <p className="text-sm text-muted-foreground mb-1">
                      By <span className="font-semibold">{selected.author}</span>
                    </p>
                    <time className="text-xs text-muted-foreground" dateTime={selected.createdAt || ""}>
                      {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "Date unavailable"}
                    </time>

                    <span
                      className={`mt-3 inline-block px-4 py-1 rounded-full text-sm font-semibold ${
                        selected.status === "approved"
                          ? "bg-green-600 text-white"
                          : selected.status === "rejected"
                          ? "bg-red-600 text-white"
                          : "bg-yellow-400 text-yellow-900"
                      }`}
                    >
                      {selected.status?.toUpperCase() || "PENDING"}
                    </span>
                  </div>

                  <article className="prose prose-indigo dark:prose-invert max-w-full">
                    <p className="whitespace-pre-wrap">{selected.content}</p>
                  </article>
                </>
              )}
            </aside>
          </div>
        </div>
      </div>

      {/* Confirm modals */}
      {activeModal && (activeModal.type === "approve" || activeModal.type === "reject" || activeModal.type === "delete") && activeModal.payload && (
        <ConfirmModal
          title={
            activeModal.type === "approve"
              ? "Confirm Approve"
              : activeModal.type === "reject"
              ? "Confirm Reject"
              : "Confirm Delete"
          }
          message={
            activeModal.type === "delete"
              ? `Are you sure you want to permanently delete "${activeModal.payload.title}"?`
              : `Do you want to ${activeModal.type === "approve" ? "approve" : "reject"} "${activeModal.payload.title}"?`
          }
          onCancel={() => setActiveModal(null)}
          loading={!!actionLoadingMap[activeModal.payload._id]}
          onConfirm={async () => {
            const id = activeModal.payload._id;
            if (activeModal.type === "delete") {
              await deleteStory(id);
            } else {
              await updateStoryStatus(id, activeModal.type === "approve" ? "approved" : "rejected");
            }
            setActiveModal(null);
          }}
        />
      )}
    </div>
  );
}
