"use client";

import React, {
  JSX,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Loader2,
  Trash2,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

/**
 * Design reference image (local):
 * /mnt/data/9c5281a3-09e3-4dec-93ec-2f2a22906fc2.png
 */

/* ===========================
   Types
   =========================== */
export interface Story {
  _id: string;
  title: string; // shown as name/title in UI
  content: string;
  author: string;
  email?: string;
  approved?: boolean;
  rejected?: boolean;
  status?: "approved" | "pending" | "rejected" | string;
  createdAt?: string;
}

type ModalState =
  | { type: "approve" | "reject" | "delete"; payload: Story }
  | { type: "success"; payload: string }
  | null;

/* ===========================
   UI helpers
   =========================== */
const statusColors: Record<
  "approved" | "pending" | "rejected",
  { bg: string; text: string; border: string }
> = {
  approved: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-700 dark:text-green-200",
    border: "border-green-100 dark:border-green-700",
  },
  rejected: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-700 dark:text-red-200",
    border: "border-red-100 dark:border-red-700",
  },
  pending: {
    bg: "bg-yellow-50 dark:bg-yellow-900/20",
    text: "text-yellow-800 dark:text-yellow-200",
    border: "border-yellow-100 dark:border-yellow-700",
  },
};

/* ===========================
   Motion variants
   =========================== */
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.02, type: "spring", stiffness: 90 } }),
  exit: { opacity: 0, y: 6, transition: { duration: 0.15 } },
};

const slideInMobile: Variants = {
  hidden: { y: "100%" },
  visible: { y: 0, transition: { type: "spring", stiffness: 120 } },
  exit: { y: "100%", transition: { duration: 0.18 } },
};

/* ===========================
   Component
   =========================== */
export default function AdminStoriesManager(): JSX.Element {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [filter, setFilter] = useState<"approved" | "pending" | "rejected" | "all">("pending");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const [selected, setSelected] = useState<Story | null>(null);
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [modal, setModal] = useState<ModalState>(null);

  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Refs
  const listRef = useRef<HTMLDivElement | null>(null);

  // Prevent global scrollbar: set container to overflow-hidden
  // Left and right panels will handle their own scrolling.
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 1024);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // keep selected visible on desktop
  useEffect(() => {
    if (!isMobile && selected && listRef.current) {
      const el = listRef.current.querySelector(`[data-id="${selected._id}"]`) as HTMLElement | null;
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selected, isMobile]);

  /* -------------------------
     Fetch stories (backend logic unchanged)
  --------------------------*/
  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const url = base ? `${base}/stories?admin=true` : `/api/stories?admin=true`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed fetch");
      const data = await res.json();
      const raw: any[] = Array.isArray(data) ? data : data.data ?? [];
      const normalized: Story[] = raw.map((s: any) => ({
        ...s,
        email: s.email ?? s.authorEmail ?? undefined,
        status: s.approved ? "approved" : s.rejected ? "rejected" : "pending",
      }));
      normalized.sort((a: Story, b: Story) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
      setStories(normalized);

      try {
        if (typeof window !== "undefined") {
          const saved = localStorage.getItem("stories_selected");
          if (saved) {
            const found = normalized.find((st) => st._id === saved) || null;
            setSelected(found);
            if (found) setShowDetail(true);
          }
        }
      } catch {
        // ignore localStorage errors
      }
    } catch (err) {
      setStories([]);
      setSelected(null);
      setShowDetail(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  /* -------------------------
     Filtering
  --------------------------*/
  const filtered = useMemo(() => {
    let arr: Story[] = stories.slice();

    if (filter !== "all") arr = arr.filter((s: Story) => s.status === filter);

    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter((s: Story) =>
        (s.title || "").toLowerCase().includes(q) ||
        (s.author || "").toLowerCase().includes(q) ||
        (s.email || "").toLowerCase().includes(q)
      );
    }

    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      arr = arr.filter((s: Story) => {
        if (!s.createdAt) return false;
        const d = new Date(s.createdAt);
        if (start && d < start) return false;
        if (end) {
          const endDay = new Date(end);
          endDay.setHours(23, 59, 59, 999);
          if (d > endDay) return false;
        }
        return true;
      });
    }

    return arr;
  }, [stories, filter, search, startDate, endDate]);

  /* -------------------------
     Pagination
  --------------------------*/
  const storiesPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(filtered.length / storiesPerPage));
  const pageData: Story[] = filtered.slice((page - 1) * storiesPerPage, page * storiesPerPage);

  /* -------------------------
     Actions
  --------------------------*/
  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    setActionLoading((p) => ({ ...p, [id]: true }));
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const url = base ? `${base}/stories/${id}` : `/api/stories/${id}`;
      const body = status === "approved" ? { approved: true, rejected: false } : { approved: false, rejected: true };

      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed");

      setStories((prev) => prev.map((s: Story) => (s._id === id ? { ...s, approved: body.approved, rejected: body.rejected, status } : s)));
      if (selected?._id === id) setSelected((cur) => (cur ? { ...cur, approved: body.approved, rejected: body.rejected, status } : cur));

      setModal({ type: "success", payload: status === "approved" ? "Accepted" : "Rejected" });
      setTimeout(() => setModal(null), 1400);
    } catch {
      alert("Update failed");
    } finally {
      setActionLoading((p) => ({ ...p, [id]: false }));
    }
  };

  const deleteStory = async (id: string) => {
    setActionLoading((p) => ({ ...p, [id]: true }));
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const url = base ? `${base}/stories/${id}` : `/api/stories/${id}`;
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");

      setStories((prev) => prev.filter((s: Story) => s._id !== id));
      if (selected?._id === id) {
        setSelected(null);
        setShowDetail(false);
      }

      setModal({ type: "success", payload: "Deleted successfully" });
      setTimeout(() => setModal(null), 1400);
    } catch {
      alert("Delete failed");
    } finally {
      setActionLoading((p) => ({ ...p, [id]: false }));
    }
  };

  /* -------------------------
    Helpers
  --------------------------*/
  const openConfirm = (type: "approve" | "reject" | "delete", s: Story) => setModal({ type, payload: s });

  const closeDetailMobile = () => {
    setShowDetail(false);
    setSelected(null);
    document.body.style.overflow = "";
  };
  const openDetailMobile = () => {
    document.body.style.overflow = "hidden";
    setShowDetail(true);
  };

  const onSelectStory = (s: Story) => {
    setSelected(s);
    try {
      if (typeof window !== "undefined") localStorage.setItem("stories_selected", s._id);
    } catch {}
    if (isMobile) openDetailMobile();
    else setShowDetail(true);
  };

  /* -------------------------
     Render
  --------------------------*/
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 overflow-hidden">
      <div className="max-w-[1100px] mx-auto">

{/* FILTER / CONTROLS — COMPACT VERSION */}
{/* FILTER / CONTROLS — 2 ROW COMPACT LAYOUT */}
<section
  className="
    w-full 
    rounded-xl 
    shadow-md 
    mb-4 
    p-4 
    bg-gradient-to-r from-sky-700 to-indigo-600 
    text-white
  "
>
  <h2 className="text-lg font-semibold mb-3">Filter Stories</h2>

  {/* ROW 1 — Search + Status Buttons */}
  <div className="flex flex-wrap items-center gap-3 mb-3">

    {/* Search */}
    <input
      type="text"
      placeholder="Search..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setPage(1);
      }}
      className="
        w-48              /* SMALLER WIDTH */
        px-3 py-2 
        rounded-lg 
        bg-white 
        text-gray-800 
        text-sm
        border border-gray-200 
        focus:outline-none 
        focus:ring-2 
        focus:ring-amber-400
        shadow-sm
      "
    />

    {/* Filter Buttons */}
    <div className="flex items-center gap-2">
      {(["all", "pending", "approved", "rejected"] as const).map((f) => (
        <button
          key={f}
          onClick={() => {
            setFilter(f);
            setPage(1);
          }}
          className={`
            px-3 py-1 
            rounded-full 
            text-xs font-semibold 
            transition 
            shadow-sm
            ${filter === f
              ? "bg-amber-400 text-gray-900"
              : "bg-white/30 backdrop-blur text-white border border-white/40"}
          `}
        >
          {f[0].toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  </div>

  {/* ROW 2 — Date Filters + Clear Button */}
  <div
    className="
      flex flex-wrap items-center 
      gap-2 
      bg-white/20 
      p-2 
      rounded-lg 
      backdrop-blur 
      border border-white/40
    "
  >
    {/* Small Labels + Small Inputs */}
    <label className="text-xs text-white font-medium">From:</label>
    <input
      type="date"
      value={startDate ?? ""}
      onChange={(e) => {
        setStartDate(e.target.value || null);
        setPage(1);
      }}
      className="
        w-28            /* <<< SMALL WIDTH */
        px-2 py-1 
        rounded 
        text-xs 
        bg-white 
        text-gray-800 
        border border-gray-300
      "
    />

    <label className="text-xs text-white font-medium">To:</label>
    <input
      type="date"
      value={endDate ?? ""}
      onChange={(e) => {
        setEndDate(e.target.value || null);
        setPage(1);
      }}
      className="
        w-28             /* <<< SMALL WIDTH */
        px-2 py-1 
        rounded 
        text-xs 
        bg-white 
        text-gray-800 
        border border-gray-300
      "
    />

    {/* ALIGN RIGHT — CLEAR BUTTON */}
    <button
      onClick={() => {
        setStartDate(null);
        setEndDate(null);
        setPage(1);
      }}
      className="
        ml-auto                /* PUSH TO RIGHT */
        px-3 py-1 
        rounded-full 
        text-xs font-semibold
        bg-white 
        text-amber-600 
        hover:bg-amber-100 
        transition
      "
    >
      Clear
    </button>
  </div>
</section>




        {/* GRID: left list (scroll) + right detail (fixed height, internal scroll) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT: List (scrollable column only) */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden">
            <div ref={listRef} className="overflow-y-auto p-4 space-y-3" style={{ maxHeight: "78vh" }}>
              <AnimatePresence>
                {loading ? (
                  <div className="p-6 text-center">Loading...</div>
                ) : filtered.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">No stories found.</div>
                ) : (
                  pageData.map((story: Story, idx: number) => {
                    const initials = (story.author || "U").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
                    const isSelected = selected?._id === story._id;
                    const statusKey = (story.status ?? "pending") as keyof typeof statusColors;

                    return (
<motion.div
  key={story._id}
  custom={idx}
  initial="hidden"
  animate="visible"
  exit="exit"
  variants={cardVariants}
  layout
  data-id={story._id}
  onClick={() => onSelectStory(story)}
  className={`
    group
    p-4 
    rounded-2xl
    border
    cursor-pointer 
    transition-all 
    duration-200
    bg-[var(--card)] 
    dark:bg-gray-800
    shadow-sm

    hover:shadow-md hover:-translate-y-0.5

    ${isSelected ? "ring-2 ring-[#0050A4] shadow-lg bg-blue-50/40 dark:bg-blue-900/20" : ""}
  `}
>
  <div className="flex items-center justify-between">

    {/* LEFT — Avatar + Title */}
    <div className="flex items-center gap-4 min-w-0">

      {/* CAM-STYLE BLUE AVATAR */}
      <div
        className="
          w-14 h-14 
          rounded-full 
          bg-gradient-to-br 
          from-[#0050A4] 
          to-[#003D7A]
          flex items-center 
          justify-center 
          text-[#FFC72C]
          font-bold 
          text-lg
          shadow-sm
          group-hover:scale-105
          transition-transform
        "
      >
        {initials}
      </div>

      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold text-[#0050A4] truncate">
          {story.title || story.author}
        </h3>

        <p className="text-xs text-gray-500 truncate">
          {story.email ?? story.author}
        </p>
      </div>
    </div>

    {/* RIGHT — Date + Status */}
    <div className="flex flex-col items-end gap-1">
      <time className="text-xs text-gray-400">
        {story.createdAt ? new Date(story.createdAt).toLocaleDateString() : "—"}
      </time>

      <span
        className={`
          px-3 py-0.5 
          rounded-full 
          text-xs font-semibold 
          border
          ${statusColors[statusKey].bg}
          ${statusColors[statusKey].text}
          ${statusColors[statusKey].border}
        `}
      >
        {story.status?.toUpperCase()}
      </span>
    </div>
  </div>

  {/* ACTIONS */}
  <div className="mt-4 flex items-center justify-between">

    <div className="flex gap-2">

      {/* Accept - CAM BLUE */}
      <button
        onClick={(e) => { e.stopPropagation(); openConfirm("approve", story); }}
        disabled={!!actionLoading[story._id]}
        className="
          px-3 py-1.5 
          rounded-full 
          bg-[#0050A4] 
          text-white 
          text-sm 
          font-medium 
          shadow-sm
          hover:bg-[#003D7A]
          transition
        "
      >
        Accept
      </button>

      {/* Reject - CAM YELLOW */}
      <button
        onClick={(e) => { e.stopPropagation(); openConfirm("reject", story); }}
        disabled={!!actionLoading[story._id]}
        className="
          px-3 py-1.5 
          rounded-full 
          bg-[#FFC72C] 
          text-[#0050A4] 
          text-sm 
          font-semibold 
          shadow-sm
          hover:bg-[#ffda63]
          transition
        "
      >
        Reject
      </button>
    </div>

    {/* Delete Button */}
    <button
      onClick={(e) => { 
        e.stopPropagation(); 
        setModal({ type: "delete", payload: story }); 
      }}
      className="
        w-10 h-10 rounded-full 
        bg-gray-100 dark:bg-gray-700 
        flex items-center justify-center 
        text-red-600 
        hover:bg-red-100 hover:text-red-700
        transition
        shadow-sm
      "
    >
      <Trash2 size={16} />
    </button>
  </div>
</motion.div>


                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Pagination footer (non-scrolling) */}
            <div className="p-3 border-t bg-white dark:bg-gray-800 rounded-b-2xl">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {filtered.length === 0 ? 0 : (page - 1) * storiesPerPage + 1}–{Math.min(page * storiesPerPage, filtered.length)} of {filtered.length}
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded border disabled:opacity-50">
                    <ChevronLeft />
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded text-sm ${page === i + 1 ? "bg-sky-600 text-white shadow-md" : "border hover:bg-slate-50"}`}>
                      {i + 1}
                    </button>
                  ))}

                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded border disabled:opacity-50">
                    <ChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT: Detail (fixed height + internal scroll) */}
          <section
            className="hidden lg:block rounded-2xl p-6 bg-white dark:bg-gray-800 shadow"
            style={{ maxHeight: "78vh", overflow: "hidden" }}
          >
            <div className="h-full overflow-y-auto pr-2" style={{ maxHeight: "calc(78vh - 0px)" }}>
              {selected ? (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-yellow-100 flex items-center justify-center text-4xl font-bold">
                      {(selected.author || "U").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selected.title}</h2>
                      <div className="text-sm text-gray-500">{selected.email ?? selected.author}</div>
                      <time className="text-xs text-gray-400 block mt-1">{selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "Date unavailable"}</time>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${selected.status === "approved" ? "bg-green-600 text-white" : selected.status === "rejected" ? "bg-red-600 text-white" : "bg-yellow-400 text-yellow-900"}`}>
                        {selected.status?.toUpperCase() ?? "PENDING"}
                      </span>
                    </div>
                  </div>

                  <article className="prose dark:prose-invert whitespace-pre-wrap">
                    {selected.content}
                  </article>

                  <div className="flex gap-3 mt-6">
                    <button onClick={() => openConfirm("approve", selected)} disabled={!!actionLoading[selected._id]} className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white shadow-sm">
                      <CheckCircle2 className="w-5 h-5" /> Accept
                    </button>
                    <button onClick={() => openConfirm("reject", selected)} disabled={!!actionLoading[selected._id]} className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 text-white shadow-sm">
                      <XCircle className="w-5 h-5" /> Reject
                    </button>
                    <button onClick={() => setModal({ type: "delete", payload: selected })} disabled={!!actionLoading[selected._id]} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white shadow-sm">
                      <Trash2 className="w-5 h-5" /> Delete
                    </button>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">Select a story to view details</div>
              )}
            </div>
          </section>
        </div>

        {/* Mobile detail bottom sheet */}
        <AnimatePresence>
          {isMobile && showDetail && selected && (
            <>
              <motion.div className="fixed inset-0 z-40 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeDetailMobile} />
              <motion.section className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl z-50 p-6 max-h-[85vh] overflow-y-auto" variants={slideInMobile} initial="hidden" animate="visible" exit="exit">
                <button onClick={closeDetailMobile} className="w-full text-center text-2xl text-gray-500 mb-4">×</button>
                <h2 className="text-2xl font-bold">{selected.title}</h2>
                <div className="text-sm text-gray-500">{selected.email ?? selected.author}</div>
                <time className="text-xs text-gray-400">{selected.createdAt ? new Date(selected.createdAt).toLocaleString() : "Date unavailable"}</time>
                <article className="prose dark:prose-invert whitespace-pre-wrap my-4">{selected.content}</article>
                <div className="flex gap-2 justify-center">
                  <button onClick={() => openConfirm("approve", selected)} className="px-4 py-2 bg-blue-600 text-white rounded-full">Accept</button>
                  <button onClick={() => openConfirm("reject", selected)} className="px-4 py-2 bg-amber-500 text-white rounded-full">Reject</button>
                  <button onClick={() => setModal({ type: "delete", payload: selected })} className="px-4 py-2 bg-gray-900 text-white rounded-full">Delete</button>
                </div>
              </motion.section>
            </>
          )}
        </AnimatePresence>

        {/* Confirm modal */}
        {modal && modal.type !== "success" && modal.payload && (
          <ConfirmModal
            title={modal.type === "delete" ? "Confirm Delete" : modal.type === "approve" ? "Confirm Accept" : "Confirm Reject"}
            message={modal.type === "delete" ? `Are you sure you want to permanently delete “${modal.payload.title}”?` : `Do you want to ${modal.type === "approve" ? "accept" : "reject"} “${modal.payload.title}”?`}
            loading={!!actionLoading[modal.payload._id]}
            onCancel={() => setModal(null)}
            onConfirm={async () => {
              const id = modal.payload._id;
              if (modal.type === "delete") await deleteStory(id);
              else await updateStatus(id, modal.type === "approve" ? "approved" : "rejected");
              setModal(null);
            }}
          />
        )}

        {/* Success popup */}
        {modal?.type === "success" && modal.payload && <SuccessPopup message={modal.payload} />}
      </div>
    </div>
  );
}

/* ===========================
   ConfirmModal component
   =========================== */
const ConfirmModal: React.FC<{
  title: string;
  message: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}> = ({ title, message, loading, onCancel, onConfirm }) => {
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onCancel}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{title}</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} disabled={loading} className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition disabled:opacity-50">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2">
            {loading && <Loader2 className="h-5 w-5 animate-spin text-white" />}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

/* ===========================
   Success popup
   =========================== */
const SuccessPopup: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
      <div className="pointer-events-auto bg-green-600 text-white rounded-xl px-6 py-4 shadow-xl animate-fadeIn">
        <p className="text-lg font-semibold">✓ {message}</p>
      </div>
    </div>
  );
};

/* Optional global CSS additions (add to globals.css):
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn { animation: fadeIn .25s ease-out forwards; }
*/
