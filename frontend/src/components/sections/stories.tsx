"use client";

import React, { useState, useEffect } from "react";

// Types
interface Story {
  _id?: string;
  title: string;
  content: string;
  author: string;
  category?: string;
  approved: boolean;
  createdAt?: string;
}

// Hero Section Component
function HeroStories() {
  return (
    <header
      className="relative text-white overflow-hidden"
      style={{
        backgroundImage: "url('/meditation1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "90vh",
      }}
    >
      <div className="relative z-10 container mx-auto px-6 lg:px-8 py-28 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg tracking-tight">
            Personal Growth Stories
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/90 leading-relaxed">
            Discover how real people rebuilt their lives through care,
            courage, and community. Each story reflects our belief that
            healing is possible — and no journey is too far when walked with
            compassion.
          </p>
          <div className="mt-8">
            <a
              href="#stories"
              className="inline-block px-6 py-3 bg-blue-800 text-white rounded-lg font-semibold hover:bg-amber-700 transition"
            >
              Read All Stories
            </a>
          </div>
        </div>
      </div>
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

// Story Card
const StoryCard: React.FC<{ story: Story }> = ({ story }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <article className="bg-white rounded-xl overflow-hidden border border-gray-300 shadow-lg flex flex-col h-full">
        <div className="p-6 flex flex-col justify-between flex-grow">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-semibold bg-amber-300 text-amber-900 px-3 py-1 rounded-full uppercase tracking-wider">
                {story.category || "General"}
              </span>
              <span className="text-sm text-gray-500">
                {story.createdAt
                  ? new Date(story.createdAt).toLocaleDateString()
                  : ""}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{story.title}</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {story.content.length > 120
                ? story.content.substring(0, 120) + "..."
                : story.content}
            </p>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowModal(true)}
              className="text-amber-700 hover:text-amber-900 font-semibold transition"
            >
              Read More →
            </button>
          </div>
        </div>
      </article>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-6 max-w-lg md:max-w-3xl w-full max-h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-900">{story.title}</h2>
            <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
              {story.content}
            </p>
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

// Main StoriesPage Component
export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [submittedStory, setSubmittedStory] = useState<Story | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [pendingStory, setPendingStory] = useState<Story | null>(null);

  const postsPerPage = 6;

  // Fetch stories
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch(`/api/stories`);
        if (!res.ok) throw new Error("Failed to fetch stories");
        const data: Story[] = await res.json();
        setStories(data.filter((s) => s.approved));
      } catch (err) {
        console.error("❌ Error fetching stories:", err);
      }
    };
    fetchStories();
  }, []);

  // Pagination helpers
  const totalPages = Math.ceil(stories.length / postsPerPage);
  const currentStories = stories.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const goToPage = (num: number) => {
    if (num < 1 || num > totalPages) return;
    setCurrentPage(num);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle form submit - show confirmation dialog
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const newStory: Story = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      author: formData.get("author") as string,
      category: formData.get("category") as string,
      approved: false,
    };
    setPendingStory(newStory);
    setShowSubmitConfirm(true);
  };

  // Submit story after confirmation
  const submitConfirmedStory = async () => {
    if (!pendingStory) return;
    try {
      await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingStory),
      });
      setSubmittedStory(pendingStory);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error submitting story:", error);
    }
    setShowSubmitConfirm(false);
    setPendingStory(null);
    setShowForm(false);
  };

  return (
    <div className="font-['Inter',_sans-serif'] bg-white">
      {/* Hero */}
      <HeroStories />

      {/* Stories Grid */}
      <main id="stories" className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Community Stories</h2>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
            >
              + Add Story
            </button>
          </div>

          {stories.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No stories available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentStories.map((story, index) => (
                <StoryCard key={story._id || index} story={story} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
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

      {/* Add Story Modal */}
      {showForm && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Submit Your Story</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Story Title"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <textarea
                name="content"
                placeholder="Your Story"
                required
                rows={6}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="text"
                name="author"
                placeholder="Your Name"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <select
                name="category"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="general">General</option>
                <option value="healed">Healed</option>
              </select>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && pendingStory && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
          onClick={() => setShowSubmitConfirm(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Confirm Submission</h2>
            <p className="mb-4">Are you sure you want to submit this story?</p>
            <article className="bg-gray-100 border border-gray-300 rounded p-4 mb-4">
              <h3 className="text-lg font-semibold mb-1">{pendingStory.title}</h3>
              <p className="text-gray-700">
                {pendingStory.content.length > 200 ? pendingStory.content.substring(0, 200) + "..." : pendingStory.content}
              </p>
            </article>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                onClick={() => setShowSubmitConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-amber-600 text-white hover:bg-amber-700"
                onClick={submitConfirmedStory}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post-submission Confirmation Popup */}
      {showConfirmation && submittedStory && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
          onClick={() => setShowConfirmation(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">Story Submitted!</h2>
            <p className="mb-4 font-semibold text-gray-800">Admin will confirm soon.</p>
            <article className="bg-gray-100 border border-gray-300 rounded p-4">
              <h3 className="text-xl font-semibold mb-2">{submittedStory.title}</h3>
              <p className="mb-2 text-gray-700">{submittedStory.content}</p>
              <p className="text-sm text-gray-500">
                By: {submittedStory.author} | Category: {submittedStory.category || "General"}
              </p>
            </article>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
                onClick={() => setShowConfirmation(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
