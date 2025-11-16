"use client";

import React, { useState, useEffect, useRef } from "react";

/* ---------- Types ---------- */
type AnimationType = "slide-right" | "slide-left" | "fade-up";

interface BlogPost {
  _id?: string;
  title: string;
  content: string;
  imageUrl?: string;
  category?: string;
  status: "draft" | "published";
  createdAt?: string;
  date?: string;
  categoryText?: string;
  categoryBg?: string;
  excerpt?: string;
}

/* ---------- Scroll Animation Hook ---------- */
const useScrollAnimation = (
  threshold: number = 0.2,
  animationClass: AnimationType = "fade-up"
): { ref: React.RefObject<HTMLDivElement | null>; animationClasses: string } => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  const getAnimationClasses = (visible: boolean, type: AnimationType): string => {
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

/* ---------- Hero Component ---------- */
function HeroAnimatedContent() {
  const { ref, animationClasses } = useScrollAnimation(0.12, "fade-up");
  return (
    <div
      ref={ref}
      className={`relative z-10 container mx-auto px-6 lg:px-8 py-28 text-center ${animationClasses}`}
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg tracking-tight">
          Insights & Inspiration
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-white/90">
          Stay informed with articles on addiction recovery, emotional wellness,
          lifestyle improvement, and real-life healing experiences.
        </p>
      </div>
    </div>
  );
}

/* ---------- BlogCard Component ---------- */
const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  const { ref, animationClasses } = useScrollAnimation(0.2, "fade-up");
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <article
        ref={ref}
        className={`bg-white rounded-xl overflow-hidden border border-gray-300 shadow-2xl ${animationClasses} flex flex-col h-full`}
      >
        <img
          src={post.imageUrl || "/placeholder.png"}
          alt={post.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://placehold.co/400x400/e5e7eb/4b5563?text=Image+Not+Found";
          }}
        />
        <div className="p-6 flex flex-col justify-between flex-grow">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-semibold bg-amber-300 text-amber-900 px-3 py-1 rounded-full uppercase tracking-wider">
                {post.category || "General"}
              </span>
              <span className="text-sm text-gray-500">
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
            {stripHtml(post.content).length > 120
              ? stripHtml(post.content).substring(0, 120) + "..."
              : stripHtml(post.content)}
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
            <h2 className="text-2xl font-bold mb-4 text-gray-900">{post.title}</h2>
            <img
              src={post.imageUrl || "/placeholder.png"}
              alt={post.title}
              className="w-full h-64 object-cover rounded mb-4"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://placehold.co/400x400/e5e7eb/4b5563?text=Image+Not+Found";
              }}
            />
           <div
            className="text-gray-700 leading-relaxed mb-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

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

const stripHtml = (html: string) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

/* ---------- Main Blog Component with Pagination ---------- */
export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

useEffect(() => {
  const fetchPosts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/blog`);
      if (!res.ok) throw new Error("Failed to fetch posts");

      const raw = await res.json();
      const posts = raw.data || [];

      // Only show published posts
      setPosts(posts.filter((p: BlogPost) => p.status === "published"));
    } catch (err) {
      console.error("❌ Error fetching posts:", err);
    }
  };

  fetchPosts();
}, []);

  // Pagination calculation
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentPosts = posts.slice(
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
      {/* HERO */}
      <header
        className="relative text-white overflow-hidden"
        style={{
          backgroundImage: "url('/bg5.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          minHeight: "90vh",
        }}
      >
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f86bf]/70 to-[#08a0d6]/65 backdrop-blur-[2px]" />

       {/* <div className="absolute inset-0 bg-linear-to-b from-[#0f86bf]/60 to-[#08a0d6]/70 backdrop-blur-[2px]" />*/}
        <HeroAnimatedContent />
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

      {/* POSTS */}
      <main className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No posts available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post, index) => (
                <BlogCard key={post._id || index} post={post} />
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
    </div>
  );
}
