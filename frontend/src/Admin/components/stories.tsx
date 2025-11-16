"use client";

import React, { useState, useEffect } from "react";

/* ---------- Types ---------- */
interface Story {
  _id: string;
  title: string;
  content: string;
  author: string;
  category?: string;
  status: "approved" | "pending" | "rejected" | string;
  createdAt?: string;
}

type ModalState =
  | { type: "read"; story: Story }
  | { type: "delete"; story: Story }
  | { type: "approve"; story: Story }
  | { type: "reject"; story: Story }
  | { type: "success"; message: string }
  | null;

/* ---------- Main Component ---------- */
export default function AdminStoriesManager() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isAdmin, setIsAdmin] = useState(true);
  const [viewMode, setViewMode] = useState<"approved" | "pending" | "rejected" | "all">("pending");
  const [activeModal, setActiveModal] = useState<ModalState>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const storiesPerPage = 6;

  /* ---------- Load Stories ---------- */
  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stories?admin=true`)
      .then((res) => res.json())
      .then((data) => {
        const normalized = data.map((s: any) => ({
          ...s,
          status: s.approved
            ? "approved"
            : s.rejected
            ? "rejected"
            : "pending",
        }));
        setStories(normalized);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* ---------- Filtering ---------- */
  const filteredStories = stories.filter((s) => {
    const status = (s.status || "").toLowerCase();
    if (!isAdmin) return status === "approved";
    if (viewMode === "approved") return status === "approved";
    if (viewMode === "pending") return status === "pending";
    if (viewMode === "rejected") return status === "rejected";
    return true;
  });

  const totalPages = Math.ceil(filteredStories.length / storiesPerPage);
  const currentStories = filteredStories.slice(
    (currentPage - 1) * storiesPerPage,
    currentPage * storiesPerPage
  );

  /* ---------- Update Story ---------- */
  const updateStory = async (id: string, updatedFields: Partial<Story>) => {
    setLoading(true);

    const approved =
      updatedFields.status === "approved"
        ? true
        : updatedFields.status === "rejected"
        ? false
        : undefined;

    if (approved !== undefined) {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
    }

    // refresh stories
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stories?admin=true`);
    const data = await res.json();
    const normalized = data.map((s: any) => ({
      ...s,
      status: s.approved ? "approved" : s.rejected ? "rejected" : "pending",
    }));

    setStories(normalized);
    setLoading(false);
  };

  /* ---------- Delete Story ---------- */
  const deleteStory = async (id: string) => {
    setLoading(true);

    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stories/${id}`, {
      method: "DELETE",
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stories?admin=true`);
    const data = await res.json();
    const normalized = data.map((s: any) => ({
      ...s,
      status: s.approved ? "approved" : s.rejected ? "rejected" : "pending",
    }));

    setStories(normalized);
    setLoading(false);
  };

  return (
    <div
      className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen font-sans transition-colors duration-500"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      <h1 className="text-4xl md:text-5xl font-extrabold text-[#005691] mb-2 pt-8 text-center">
        Stories Manager
      </h1>
      <p
        className="text-lg mb-8 border-b-2 pb-4"
        style={{ color: "var(--muted-foreground)", borderColor: "var(--border)" }}
      >
        Review and moderate user-submitted stories of healing and growth.
      </p>

      {/* Admin Toggle */}
      <div className="flex justify-between items-center mb-6 bg-muted p-3 rounded-xl shadow-inner border border-border">
        <span className="font-bold text-accent">
          {isAdmin ? "Administrator (Moderation Access)" : "Reader (View Only)"}
        </span>
        <button
          onClick={() => setIsAdmin(!isAdmin)}
          className={`py-2 px-4 rounded-lg font-bold text-xs shadow-md transition ${
            isAdmin ? "bg-accent text-card" : "bg-primary text-card-foreground"
          }`}
        >
          Switch to {isAdmin ? "Reader" : "Admin"} View
        </button>
      </div>

      {/* Filters */}
      {isAdmin && (
        <div className="mb-8 flex space-x-4 justify-center">
          {["approved", "pending", "rejected"].map((key) => (
            <button
              key={key}
              onClick={() => setViewMode(key as any)}
              className={`py-2 px-6 rounded-full font-semibold ${
                viewMode === key
                  ? "bg-[#FFD100] text-[#005691]"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {key[0].toUpperCase() + key.slice(1)} (
              {stories.filter((s) => (s.status || "").toLowerCase() === key).length})
            </button>
          ))}

          <button
            onClick={() => setViewMode("all")}
            className={`py-2 px-6 rounded-full font-semibold ${
              viewMode === "all"
                ? "bg-[#FFD100] text-[#005691]"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All ({stories.length})
          </button>
        </div>
      )}

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {/* Story Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {currentStories.map((story) => (
          <article
            key={story._id}
            className="bg-card text-card-foreground rounded-xl border border-border shadow-xl transition duration-500"
          >
            <div className="p-6 flex flex-col justify-between flex-grow">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FFD100] text-[#005691] border border-[#005691] uppercase">
                    {story.category || "General"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {story.createdAt ? new Date(story.createdAt).toLocaleDateString() : "Just now"}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#005691] mb-3">{story.title}</h3>
                <p className="text-gray-700 mb-4 leading-relaxed line-clamp-4">{story.content}</p>
              </div>

              <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 flex-wrap gap-3">
                <button
                  onClick={() => setActiveModal({ type: "read", story })}
                  className="text-amber-700 hover:text-amber-900 font-semibold transition"
                >
                  Read More →
                </button>

                {isAdmin && (
                  <div className="flex gap-3 items-center">
                    {story.status === "approved" && (
                      <span className="text-green-700 font-semibold px-3 py-1 rounded-full border border-green-700 bg-green-50">
                        Approved
                      </span>
                    )}

                    {story.status === "pending" && (
                      <>
                        <span className="text-yellow-700 font-semibold px-3 py-1 rounded-full border border-yellow-700 bg-yellow-50">
                          Pending
                        </span>
                        <button
                          onClick={() => setActiveModal({ type: "approve", story })}
                          className="text-green-600 font-semibold hover:text-green-800 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setActiveModal({ type: "reject", story })}
                          className="text-red-600 font-semibold hover:text-red-800 transition"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {story.status === "rejected" && (
                      <span className="text-red-700 font-semibold px-3 py-1 rounded-full border border-red-700 bg-red-50">
                        Rejected
                      </span>
                    )}

                    <button
                      onClick={() => setActiveModal({ type: "delete", story })}
                      className="text-red-500 font-semibold hover:text-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Modals */}
      {activeModal?.type === "read" && (
        <Modal title={activeModal.story.title} onClose={() => setActiveModal(null)}>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {activeModal.story.content}
          </p>
        </Modal>
      )}

      {activeModal?.type === "approve" && (
        <ConfirmModal
          title="Confirm Approve"
          message={`Do you want to approve "${activeModal.story.title}"?`}
          onCancel={() => setActiveModal(null)}
          onConfirm={async () => {
            await updateStory(activeModal.story._id, { status: "approved" });
            setActiveModal({ type: "success", message: "Story approved successfully!" });
          }}
        />
      )}

      {activeModal?.type === "reject" && (
        <ConfirmModal
          title="Confirm Reject"
          message={`Do you want to reject "${activeModal.story.title}"?`}
          onCancel={() => setActiveModal(null)}
          onConfirm={async () => {
            await updateStory(activeModal.story._id, { status: "rejected" });
            setActiveModal({ type: "success", message: "Story rejected successfully!" });
          }}
        />
      )}

      {activeModal?.type === "delete" && (
        <ConfirmModal
          title="Confirm Delete"
          message={`Are you sure you want to permanently delete "${activeModal.story.title}"?`}
          onCancel={() => setActiveModal(null)}
          onConfirm={async () => {
            await deleteStory(activeModal.story._id);
            setActiveModal({ type: "success", message: "Story deleted successfully!" });
          }}
        />
      )}

      {activeModal?.type === "success" && (
        <SuccessModal message={activeModal.message} onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}

/* ---------- Pagination ---------- */
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

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
            currentPage === page
              ? "bg-[#005691] text-white"
              : "border-gray-300 hover:bg-gray-200"
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

/* ---------- Modals ---------- */
const Modal: React.FC<{
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showCloseX?: boolean;
}> = ({ onClose, title, children, showCloseX = false }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-6 overflow-auto"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 relative animate-modalIn"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-3xl font-bold text-[#005691] mb-6">{title}</h2>

      {showCloseX && (
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-2xl font-bold text-gray-500 hover:text-gray-800"
        >
          ×
        </button>
      )}

      {children}

      {!showCloseX && (
        <div className="flex justify-end mt-6">
          <button
            className="px-6 py-3 bg-[#005691] text-white rounded-lg hover:bg-[#003f5c] transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      )}
    </div>
  </div>
);

/* ---------- Confirm Modal ---------- */
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
    <div
      className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-modalIn"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-lg font-bold text-[#005691] mb-4">{title}</h3>
      <p className="text-gray-700 mb-6">{message}</p>

      <div className="flex justify-end space-x-3">
        <button
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          onClick={onConfirm}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

/* ---------- Success Modal ---------- */
const SuccessModal: React.FC<{ message: string; onClose: () => void }> = ({
  message,
  onClose,
}) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-6"
    onClick={onClose}
  >
    <div
      className="bg-gradient-to-b from-[#0f86bf] to-[#08a0d6] text-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center animate-modalIn"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="text-lg font-semibold mb-4">{message}</p>

      <button
        className="px-6 py-3 bg-[#FFD100] text-[#005691] rounded-lg hover:bg-amber-500 transition font-bold"
        onClick={onClose}
      >
        OK
      </button>
    </div>
  </div>
);

/* ---------- Animation ---------- */
<style jsx>{`
  @keyframes modalIn {
    0% {
      opacity: 0;
      transform: translateY(12px) scale(0.98);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  .animate-modalIn {
    animation: modalIn 0.25s ease-out forwards;
  }
`}</style>
