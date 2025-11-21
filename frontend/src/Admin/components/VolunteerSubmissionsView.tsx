"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Mail,
  Phone,
  CheckCircle,
  Clock,
  Users,
  AlertTriangle,
  ClipboardList,
  Search as SearchIcon,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

const formatWhatsappNumber = (num: string): string => {
  if (!num) return "";

  let clean = num.replace(/\D/g, ""); // remove all non-digits
  clean = clean.replace(/^0+/, "");   // remove leading zeros

  if (!clean.startsWith("91")) {
    clean = "91" + clean;            // ensure India code
  }

  return clean;
};

/* --------------------------------------------------------
   Submission Type (IMPORTANT)
--------------------------------------------------------- */
export interface Submission {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsAppNumber: string;
  gender: string;
  timeCommitment: string[];
  status: "pending" | "approved" | "rejected";
  dob?: string;
  createdAt: string;
}

/* --------------------------------------------------------
   THEME COLORS (LIGHT = blue/yellow accents only)
--------------------------------------------------------- */
const getThemeColors = () => {
  const isDark = document.documentElement.classList.contains("dark");

  if (!isDark) {
    return {
      COLOR_PRIMARY: "#0050A4",
      COLOR_SECONDARY: "#FFC72C",
      COLOR_SUCCESS: "#22C55E",
      COLOR_DANGER: "#EF4444",
      COLOR_TEXT: "#1E272E",
      COLOR_BG_SOFT: "var(--muted)",
      COLOR_BG_CARD: "var(--card)",
      COLOR_WHITE: "var(--background)",
      INV_BG_ALPHA: "rgba(0,80,164,0.03)",
      INV_BG_ALPHA_DEEP: "rgba(0,80,164,0.12)",
      INV_BORDER: "var(--border)",
      INV_CARD_SHADOW: "0 12px 28px rgba(2,6,23,0.06)",
    };
  }

  return {
    COLOR_PRIMARY: "var(--primary)",
    COLOR_SECONDARY: "var(--secondary)",
    COLOR_WHITE: "var(--background)",
    COLOR_BG_SOFT: "var(--muted)",
    COLOR_BG_CARD: "var(--card)",
    COLOR_SUCCESS: "var(--success)",
    COLOR_DANGER: "var(--destructive)",
    COLOR_TEXT: "var(--foreground)",
    INV_BG_ALPHA: "var(--muted)",
    INV_BG_ALPHA_DEEP: "var(--accent)",
    INV_BORDER: "var(--border)",
    INV_CARD_SHADOW: "0 4px 16px var(--shadow-color)",
  };
};

/* --------------------------------------------------------
   TIME OPTIONS
--------------------------------------------------------- */
export const timeCommitmentOptions = [
  { value: "Mornings", label: "Morning Shifts (8 AM - 12 PM)" },
  { value: "Afternoons", label: "Afternoon Shifts (12 PM - 5 PM)" },
  { value: "Evenings", label: "Evening Shift (5 PM - 9 PM)" },
  { value: "Weekdays", label: "Weekdays (Monday - Friday)" },
  { value: "Weekends", label: "Weekends Only" },
  { value: "OneTime", label: "One-Time Events Only" },
];

export const commitmentMap = timeCommitmentOptions.reduce(
  (acc, option) => ({ ...acc, [option.value]: option.label }),
  {} as Record<string, string>
);

/* --------------------------------------------------------
   SUCCESS POPUP (APPROVED / REJECTED)
--------------------------------------------------------- */
const ActionPopup = ({ type }: { type: "approved" | "rejected" }) => {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-40 animate-fadeIn pointer-events-auto">
      <div
        className="rounded-xl shadow-xl p-6 text-center animate-slideIn"
        style={{
          background: "var(--card)",
          color: "var(--foreground)",
          minWidth: 260,
        }}
      >
        <div
          className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-3 text-white text-3xl shadow-lg"
          style={{
            background: type === "approved" ? "#22C55E" : "#EF4444",
          }}
        >
          {type === "approved" ? "✓" : "✕"}
        </div>

        <h2 className="text-lg font-bold mb-1">
          {type === "approved" ? "Volunteer Approved" : "Volunteer Rejected"}
        </h2>

        <p className="opacity-80 mb-3 text-sm">
          {type === "approved"
            ? "The volunteer has been approved successfully."
            : "The volunteer has been rejected."}
        </p>

        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ background: "var(--muted)" }}
        >
          <div
            className="h-full animate-progress"
            style={{ background: type === "approved" ? "#22C55E" : "#EF4444" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes slideIn { 0% { transform: translateY(12px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        .animate-slideIn { animation: slideIn .26s ease-out forwards; }

        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        .animate-fadeIn { animation: fadeIn .16s ease-out forwards; }

        @keyframes progress { from { width: 0% } to { width: 100% } }
        .animate-progress { animation: progress 1.8s linear forwards; }
      `}</style>
    </div>
  );
};

/* --------------------------------------------------------
   DETAIL ROW COMPONENT
--------------------------------------------------------- */
const DetailRow = ({ label, value, icon, colors }: any) => (
  <div
    className="p-3 rounded-lg flex items-center justify-between break-words"
    style={{ background: "var(--muted)" }}
  >
    <div className="flex items-center gap-2 opacity-80 min-w-0">
      {icon}
      <span className="font-medium truncate" style={{ minWidth: 0 }}>
        {label}
      </span>
    </div>
    <span className="font-semibold text-sm truncate" style={{ color: colors.COLOR_PRIMARY }}>
      {value}
    </span>
  </div>
);

/* --------------------------------------------------------
   DETAILS PANEL (RIGHT SIDE)
--------------------------------------------------------- */
const VolunteerDetailsPanel: React.FC<{
  volunteer: Submission | null;
  handleContact: (name: string, phone: string) => void;
  handleUpdateStatus: (id: string, newStatus: any) => void;
  updatingId: string | null;
  getCommitmentLabels: (values: string[]) => string;
  colors: ReturnType<typeof getThemeColors>;
}> = ({ volunteer, handleContact, handleUpdateStatus, updatingId, getCommitmentLabels, colors }) => {
if (!volunteer)
  return (
    <aside
      className="rounded-xl p-5 flex items-center justify-center text-muted-foreground w-full lg:sticky lg:top-4"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        minHeight: 220,
      }}
    >
      Select a volunteer to view details
    </aside>
  );



  const isUpdating = updatingId === volunteer._id;

  return (
    <aside
      className="rounded-xl p-6 w-full"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        minHeight: 420,
        color: "var(--foreground)",
      }}
    >
      {/* Profile Icon */}
      <div className="flex flex-col items-center">
        <div
          className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold break-words"
          style={{
            background: "var(--accent)",
            color: colors.COLOR_PRIMARY,
          }}
        >
          {volunteer.fullName
            .split(" ")
            .map((n: string) => n.charAt(0))
            .join("")
            .slice(0, 3)
            .toUpperCase()}
        </div>

        <h2 className="text-lg sm:text-xl font-semibold mt-3 text-center" style={{ color: colors.COLOR_PRIMARY }}>
          {volunteer.fullName}
        </h2>

        {/* STATUS BADGE */}
        <div
          className="mt-2 px-3 py-1 rounded-full text-sm font-medium"
          style={{
            background:
              volunteer.status === "approved"
                ? colors.COLOR_SUCCESS
                : volunteer.status === "rejected"
                ? colors.COLOR_DANGER
                : colors.COLOR_SECONDARY,
            color: "white",
          }}
        >
          {volunteer.status.toUpperCase()}
        </div>
      </div>

      {/* DETAILS */}
      <div className="mt-5 space-y-3">
        <DetailRow label="Email" value={volunteer.email} icon={<Mail />} colors={colors} />
        <DetailRow label="Phone" value={volunteer.phone} icon={<Phone />} colors={colors} />
        <DetailRow label="WhatsApp" value={volunteer.whatsAppNumber} icon={<FaWhatsapp />} colors={colors} />
        <DetailRow label="Gender" value={volunteer.gender} icon={<Users />} colors={colors} />
        <DetailRow label="DOB" value={volunteer.dob || "N/A"} icon={<Clock />} colors={colors} />
        <DetailRow
          label="Applied On"
          value={new Date(volunteer.createdAt).toLocaleDateString()}
          icon={<Clock />}
          colors={colors}
        />

        <div className="rounded-lg p-3" style={{ background: "var(--muted)" }}>
          <div className="flex items-center text-sm font-semibold" style={{ color: colors.COLOR_PRIMARY }}>
            <ClipboardList className="w-4 h-4 mr-2" />
            Availability
          </div>
          <p className="text-sm mt-1 opacity-80 break-words">{getCommitmentLabels(volunteer.timeCommitment)}</p>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="mt-6 space-y-3">
        <button
          className="w-full py-2 rounded-full font-semibold flex items-center justify-center"
          style={{
            background: colors.COLOR_SECONDARY,
            color: colors.COLOR_PRIMARY,
          }}
          onClick={() => handleContact(volunteer.fullName, volunteer.whatsAppNumber)}
        >
          <FaWhatsapp className="mr-2" /> 
        </button>

        {volunteer.status !== "approved" && (
          <button
            className="w-full py-2 rounded-full text-white font-semibold"
            style={{ background: colors.COLOR_PRIMARY }}
            disabled={isUpdating}
            onClick={() => {
              handleUpdateStatus(volunteer._id, "approved");

              // send whatsapp message after approve (country code fix + encode)
              const num = formatWhatsappNumber(volunteer.whatsAppNumber);
              const msg = `Hello ${volunteer.fullName}, thank you for showing interest in becoming a volunteer. We will contact you when we need you.`;
              window.open(`https://api.whatsapp.com/send?phone=${num}&text=${encodeURIComponent(msg)}`, "_blank");
            }}
          >
            {isUpdating ? "Updating..." : "Approve"}
          </button>
        )}

        {volunteer.status !== "rejected" && (
          <button
            className="w-full py-2 rounded-full text-white font-semibold"
            style={{ background: colors.COLOR_DANGER }}
            disabled={isUpdating}
            onClick={() => {
              handleUpdateStatus(volunteer._id, "rejected");
            }}
          >
            {isUpdating ? "Updating..." : "Reject"}
          </button>
        )}
      </div>
    </aside>
  );
};

/* --------------------------------------------------------
   MAIN DASHBOARD
--------------------------------------------------------- */
const VolunteerSubmissionsDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Submission | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | "pending" | "approved" | "rejected">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const submissionsPerPage = 8;

  const [popup, setPopup] = useState<null | "approved" | "rejected">(null);

  const [colors, setColors] = useState(getThemeColors());

  // RIGHT PANEL REF (for auto-scroll on small screens)
const rightPanelRef = useRef<HTMLDivElement | null>(null);

const scrollToRightPanel = () => {
  // only auto-scroll for narrow screens (mobile / tablet)
  if (typeof window === "undefined") return;
  if (window.innerWidth < 1024) {
    // small timeout to allow layout to settle
    setTimeout(() => {
      rightPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }
};

  /* THEME LISTENER */
  useEffect(() => {
    const updateTheme = () => setColors(getThemeColors());
    updateTheme();

    const obs = new MutationObserver(updateTheme);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => obs.disconnect();
  }, []);

  /* FETCH DATA */
  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/volunteer`, { method: "GET", cache: "no-store" });
      const raw = await res.json();
      const data = Array.isArray(raw) ? raw : raw.data;
      const sorted = (data || []).sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setSubmissions(sorted);
      setSelectedVolunteer(sorted[0] || null);
    } catch (err) {
      console.error("fetchSubmissions error:", err);
      setSubmissions([]);
      setSelectedVolunteer(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  /* UPDATE STATUS */
  const handleUpdateStatus = async (id: string, newStatus: any) => {
    setUpdatingId(id);

    // optimistic update
    setSubmissions((prev) => prev.map((x) => (x._id === id ? { ...x, status: newStatus } : x)));

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/volunteer/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      // show popup
      setPopup(newStatus);
      setTimeout(() => setPopup(null), 1800);
    } catch (err) {
      console.error("update status failed:", err);
      // rollback on failure (best-effort)
      setSubmissions((prev) => prev.map((x) => (x._id === id ? { ...x, status: "pending" } : x)));
    } finally {
      setUpdatingId(null);
    }
  };

  /* WhatsApp Contact */
  const handleContact = (name: string, phone: string) => {
    const num = formatWhatsappNumber(phone);
    const msg = `Hello ${name}, thank you for contacting us!`;
    window.open(`https://api.whatsapp.com/send?phone=${num}&text=${encodeURIComponent(msg)}`, "_blank");
  };

  /* Commitment Labels */
  const getCommitmentLabels = (values: string[]) =>
    values && values.length ? values.map((v) => commitmentMap[v]).join(" | ") : "No specific availability";

  /* FILTER LOGIC */
  const filtered = useMemo(() => {
    let arr = submissions;
    if (statusFilter !== "all") arr = arr.filter((s) => s.status === statusFilter);
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      arr = arr.filter((s) => s.fullName.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
    }
    return arr;
  }, [submissions, statusFilter, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / submissionsPerPage));
  const pageData = filtered.slice((currentPage - 1) * submissionsPerPage, currentPage * submissionsPerPage);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg w-full" style={{ background: "var(--muted)" }}>
        Loading...
      </div>
    );

  return (
    // top-level wrapper prevents horizontal scroll
    <div className="min-h-screen p-4 sm:p-6 w-full overflow-x-hidden" style={{ background: "var(--muted)" }}>
      {popup && <ActionPopup type={popup} />}

      <div
        className="mx-auto rounded-3xl shadow-md overflow-hidden w-full"
        style={{ background: "var(--card)", maxWidth: 1200 }}
      >
        {/* HEADER */}
        <div className="p-4 sm:p-6 border-b" style={{ borderColor: "var(--border)" }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <h2 className="text-xl sm:text-2xl font-bold" style={{ color: colors.COLOR_PRIMARY }}>
              Volunteer Overview
            </h2>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
              {/* Search */}
              <div
                className="flex items-center px-3 py-2 rounded-full shadow-sm w-full sm:w-auto"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <SearchIcon className="w-4 h-4 text-muted-foreground mr-2" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search volunteers..."
                  className="outline-none bg-transparent text-sm w-full"
                  style={{ color: "var(--foreground)" }}
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {["all", "pending", "approved", "rejected"].map((state) => {
                  const active = statusFilter === state;
                  return (
                    <button
                      key={state}
                      onClick={() => {
                        setStatusFilter(state as any);
                        setCurrentPage(1);
                      }}
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        background: active ? colors.COLOR_PRIMARY : "transparent",
                        color: active ? "white" : "var(--foreground)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {state[0].toUpperCase() + state.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 sm:p-6">
          <div className="rounded-xl p-4 sm:p-5 flex items-center gap-4" style={{ background: colors.COLOR_PRIMARY, color: "white" }}>
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: colors.COLOR_SECONDARY }} />
            <div>
              <p className="text-sm"style={{ color: colors.COLOR_SECONDARY }} >Approved Volunteers</p>
              <p className="text-2xl sm:text-3xl font-bold" style={{ color: colors.COLOR_SECONDARY }} >{submissions.filter((s) => s.status === "approved").length}</p>
            </div>
          </div>

          <div className="rounded-xl p-4 sm:p-5 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <Users className="w-8 h-8 mb-1" style={{ color: colors.COLOR_PRIMARY }} />
            <p className="text-sm">Total Applications</p>
            <p className="text-2xl sm:text-3xl font-bold" style={{ color: colors.COLOR_PRIMARY }}>{submissions.length}</p>
          </div>

          <div className="rounded-xl p-4 sm:p-5" style={{ background: colors.COLOR_SECONDARY, color: colors.COLOR_PRIMARY }}>
            <AlertTriangle className="w-8 h-8 mb-1" />
            <p className="text-sm">Pending Review</p>
            <p className="text-2xl sm:text-3xl font-bold">{submissions.filter((s) => s.status === "pending").length}</p>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="p-4 sm:p-6" style={{ background: "var(--muted)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 max-w-[1150px] w-full mx-auto">
            {/* LEFT LIST */}
            <div className="rounded-xl p-4 sm:p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base sm:text-lg font-semibold" style={{ color: colors.COLOR_PRIMARY }}>Volunteers</h3>
                <span className="text-sm opacity-75">{filtered.length} results</span>
              </div>

              <div className="space-y-3">
                {pageData.map((sub, i) => {
                  const initials = (sub.fullName || "")
                    .split(" ")
                    .map((n: string) => (n ? n.charAt(0) : ""))
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                  return (
                    <motion.div
                      key={sub._id}
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => {
                        setSelectedVolunteer(sub);
                        scrollToRightPanel();
                      }}
                      className={`p-3 sm:p-4 rounded-lg border cursor-pointer w-full transition-all ${
                        selectedVolunteer?._id === sub._id ? "ring-2 ring-offset-1" : ""
                      }`}
                      style={{
                        background: "var(--card)",
                        borderColor: selectedVolunteer?._id === sub._id ? colors.COLOR_PRIMARY : "var(--border)",
                        boxShadow: selectedVolunteer?._id === sub._id ? "0 6px 18px rgba(2,6,23,0.06)" : undefined,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-base sm:text-lg flex-shrink-0"
                            style={{
                              background: "var(--accent)",
                              color: colors.COLOR_SECONDARY,
                            }}
                          >
                            {initials}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-sm sm:text-[15px] truncate" style={{ color: colors.COLOR_PRIMARY }}>
                              {sub.fullName}
                            </p>
                            <p className="text-xs opacity-75 truncate">{sub.email}</p>
                          </div>
                        </div>

                        <span className="text-xs opacity-75 whitespace-nowrap">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* PAGINATION */}
              <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center gap-2">
                <button
                  className="px-3 py-1 rounded border"
                  disabled={currentPage === 1}
                  style={{ borderColor: "var(--border)" }}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  const active = currentPage === p;
                  return (
                    <button
                      key={p}
                      className="px-3 py-1 rounded border text-sm"
                      onClick={() => setCurrentPage(p)}
                      style={{
                        borderColor: active ? colors.COLOR_PRIMARY : "var(--border)",
                        background: active ? colors.COLOR_PRIMARY : "transparent",
                        color: active ? "white" : "var(--foreground)",
                      }}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  className="px-3 py-1 rounded border"
                  disabled={currentPage === totalPages}
                  style={{ borderColor: "var(--border)" }}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
              </div>
            </div>

            {/* RIGHT PANEL (wrapped with ref for scroll) */}
            <div ref={rightPanelRef} className="w-full">
              <VolunteerDetailsPanel
                volunteer={selectedVolunteer}
                updatingId={updatingId}
                handleUpdateStatus={handleUpdateStatus}
                handleContact={handleContact}
                getCommitmentLabels={getCommitmentLabels}
                colors={colors}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerSubmissionsDashboard;
