'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Loader2, Mail, Phone, MessageSquare, Search } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

/* --------------------------------------------------------
   Type
--------------------------------------------------------- */
interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt?: string;
}

/* --------------------------------------------------------
   Theme Colors
--------------------------------------------------------- */
const getThemeColors = () => {
  const isDark = document.documentElement.classList.contains("dark");

  if (!isDark) {
    return {
      PRIMARY: "#0050A4",
      SECONDARY: "#FFC72C",
      CARD: "var(--card)",
      BG: "var(--muted)",
      BORDER: "var(--border)",
      TEXT: "#1E272E",
    };
  }

  return {
    PRIMARY: "var(--primary)",
    SECONDARY: "var(--secondary)",
    CARD: "var(--card)",
    BG: "var(--muted)",
    BORDER: "var(--border)",
    TEXT: "var(--foreground)",
  };
};

/* --------------------------------------------------------
   Framer Motion Variants
--------------------------------------------------------- */
const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.4, ease: [0.0, 0.0, 0.2, 1] },
  }),
};

/* --------------------------------------------------------
   Main Component
--------------------------------------------------------- */
const ContactMessagesView: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [colors, setColors] = useState(getThemeColors());
  const [searchTerm, setSearchTerm] = useState("");

  /* ---------------- Pagination ---------------- */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  /* Theme Auto Detect */
  useEffect(() => {
    const apply = () => setColors(getThemeColors());
    apply();

    const obs = new MutationObserver(apply);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => obs.disconnect();
  }, []);

  /* Fetch Messages */
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contact-messages`);
        const contentType = res.headers.get("content-type");

        if (!res.ok || !contentType?.includes("application/json")) {
          throw new Error("Invalid response");
        }

        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setMessages(data.data);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  /* Filtered Messages */
  const filteredMessages = useMemo(() => {
    if (!searchTerm) return messages;

    const term = searchTerm.toLowerCase();
    return messages.filter((m) =>
      m.name.toLowerCase().includes(term) ||
      m.email.toLowerCase().includes(term) ||
      m.phone.toLowerCase().includes(term) ||
      m.message.toLowerCase().includes(term)
    );
  }, [messages, searchTerm]);

  /* ---------------- Pagination Logic ---------------- */
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);

  const currentMessages = filteredMessages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const changePage = (page: number) => {
    setCurrentPage(page);

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-muted-foreground">
        <Loader2 className="animate-spin text-accent w-6 h-6" />
        <p className="ml-3">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 overflow-x-hidden" style={{ background: colors.BG }}>
      <motion.div
        initial="hidden"
        animate="visible"
        className="mx-auto rounded-3xl shadow-md overflow-hidden"
        style={{ background: colors.CARD, maxWidth: 1100, border: `1px solid ${colors.BORDER}` }}
      >

        {/* HEADER */}
        <div className="p-6 border-b" style={{ borderColor: colors.BORDER }}>
          <motion.h1
            variants={headerVariants}
            className="text-2xl sm:text-3xl font-extrabold tracking-wide text-center"
            style={{ color: colors.PRIMARY }}
          >
            Contact Messages
          </motion.h1>
        </div>

        {/* SEARCH BAR */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="p-6 pt-4 flex justify-center"
        >
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Search by name, email, phone, or message..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset pagination on search
              }}
              className="w-full pl-10 pr-4 py-2 border rounded-full text-sm dark:placeholder:text-slate-400"
              style={{
                borderColor: colors.BORDER,
                background: colors.BG,
                color: colors.TEXT,
              }}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.PRIMARY }} />
          </div>
        </motion.div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 pt-0">
          <motion.div custom={0} variants={cardVariants} className="rounded-xl p-5 border" style={{ borderColor: colors.BORDER }}>
            <Mail className="w-10 h-10 mb-1" style={{ color: colors.PRIMARY }} />
            <p>Total Messages</p>
            <p className="text-3xl font-bold">{messages.length}</p>
          </motion.div>

          <motion.div custom={1} variants={cardVariants} className="rounded-xl p-5 border" style={{ borderColor: colors.BORDER }}>
            <MessageSquare className="w-10 h-10 mb-1" style={{ color: colors.PRIMARY }} />
            <p>New Today</p>
            <p className="text-3xl font-bold">
              {messages.filter((m) => new Date(m.createdAt || "").toDateString() === new Date().toDateString()).length}
            </p>
          </motion.div>

          <motion.div custom={2} variants={cardVariants} className="rounded-xl p-5 border" style={{ borderColor: colors.BORDER }}>
            <Phone className="w-10 h-10 mb-1" style={{ color: colors.PRIMARY }} />
            <p>Phone Included</p>
            <p className="text-3xl font-bold">{messages.filter((m) => m.phone).length}</p>
          </motion.div>
        </div>

        {/* LIST */}
        <div className="p-6" style={{ background: colors.BG }}>
          <div className="space-y-5 max-w-[900px] mx-auto">

            {currentMessages.length === 0 ? (
              <p className="text-center text-muted-foreground">
                {searchTerm ? `No messages found for "${searchTerm}".` : "No messages found."}
              </p>
            ) : (
              currentMessages.map((msg, i) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 + 0.5 }}
                  className="p-5 rounded-xl border shadow-sm"
                  style={{ background: "var(--card)", borderColor: colors.BORDER }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold flex items-center gap-2" style={{ color: colors.PRIMARY }}>
                        <Mail className="w-4 h-4" /> {msg.name}
                      </p>
                      <p className="text-xs opacity-75">{msg.email}</p>
                    </div>
                    <span className="text-xs opacity-75">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center text-sm opacity-80 mt-1">
                    <Phone className="w-4 h-4 mr-2" /> {msg.phone || "N/A"}
                  </div>

                  <p className="text-sm flex gap-2 mt-3 opacity-90 leading-relaxed">
                    <MessageSquare className="w-4 h-4 mt-1" />
                    {msg.message}
                  </p>
                </motion.div>
              ))
            )}
          </div>

          {/* ---------------- Pagination UI ---------------- */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">

              {/* Prev */}
              <button
                disabled={currentPage === 1}
                onClick={() => changePage(currentPage - 1)}
                className="px-3 py-1 rounded border text-sm disabled:opacity-40"
                style={{ borderColor: colors.BORDER }}
              >
                Prev
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => changePage(page)}
                  className={`px-3 py-1 rounded border text-sm ${
                    currentPage === page ? "font-bold" : ""
                  }`}
                  style={{
                    borderColor: colors.BORDER,
                    background: currentPage === page ? colors.PRIMARY : "transparent",
                    color: currentPage === page ? "white" : colors.TEXT,
                  }}
                >
                  {page}
                </button>
              ))}

              {/* Next */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => changePage(currentPage + 1)}
                className="px-3 py-1 rounded border text-sm disabled:opacity-40"
                style={{ borderColor: colors.BORDER }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ContactMessagesView;
