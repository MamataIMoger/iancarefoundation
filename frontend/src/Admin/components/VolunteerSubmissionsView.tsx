"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Mail,
  Phone,
  CheckCircle,
  Clock,
  LayoutDashboard,
  Loader2,
  Filter,
  Users,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

/* ---------- Color Palette ---------- */
const COLOR_PRIMARY = "#0050A4";
const COLOR_SECONDARY = "#FFC72C";
const COLOR_TEXT = "#1E272E";
const COLOR_BG_MAIN = "#F8FAFC";
const COLOR_BG_CARD = "#FFFFFF";
const COLOR_SUCCESS = "#22C55E";
const COLOR_DANGER = "#EF4444";

/* ---------- Time Commitment Options ---------- */
const timeCommitmentOptions = [
  { value: "Mornings", label: "Morning Shifts (8 AM - 12 PM)" },
  { value: "Afternoons", label: "Afternoon Shifts (12 PM - 5 PM)" },
  { value: "Evenings", label: "Evening Shift (5 PM - 9 PM)" },
  { value: "Weekdays", label: "Weekdays (Monday - Friday)" },
  { value: "Weekends", label: "Weekends Only" },
  { value: "OneTime", label: "One-Time Events Only" },
];

const commitmentMap = timeCommitmentOptions.reduce(
  (acc, option) => ({ ...acc, [option.value]: option.label }),
  {} as Record<string, string>
);

/* ---------- Submission Type ---------- */
interface Submission {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  timeCommitment: string[];
  status: "pending" | "approved" | "rejected";
  dob?: string;
  createdAt: string;
}

/* =========================
   MODERATION BUTTONS
========================= */
const ModerationButtons = ({
  submissionId,
  currentStatus,
  onUpdateStatus,
  isUpdating,
}: {
  submissionId: string;
  currentStatus: "pending" | "approved" | "rejected";
  onUpdateStatus: (id: string, newStatus: "approved" | "rejected") => Promise<void>;
  isUpdating: boolean;
}) => {
  const baseBtnClass =
    "px-3 py-1.5 rounded-full transition duration-300 shadow text-sm font-bold hover:scale-[1.04] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";

  const handleStatusChange = (newStatus: "approved" | "rejected") =>
    onUpdateStatus(submissionId, newStatus);

  const status = (() => {
    switch (currentStatus) {
      case "approved":
        return {
          bg: COLOR_SUCCESS,
          text: "text-white",
          label: "Approved",
          icon: <CheckCircle className="mr-1 w-4 h-4" />,
        };
      case "rejected":
        return {
          bg: COLOR_DANGER,
          text: "text-white",
          label: "Rejected",
          icon: <AlertTriangle className="mr-1 w-4 h-4" />,
        };
      default:
        return {
          bg: COLOR_SECONDARY,
          text: COLOR_PRIMARY,
          label: "Pending",
          icon: <Clock className="mr-1 w-4 h-4" />,
        };
    }
  })();

  return (
    <div className="flex items-center space-x-3 text-sm font-medium">
      <span
        className="flex items-center px-4 py-2 rounded-full font-bold tracking-wide shadow-inner"
        style={{ backgroundColor: status.bg, color: status.text }}
      >
        {status.icon}
        {status.label}
      </span>

      {currentStatus !== "approved" && (
        <button
          className={`${baseBtnClass} bg-green-500 text-white hover:bg-green-600`}
          onClick={() => handleStatusChange("approved")}
          disabled={isUpdating}
        >
          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : "Approve"}
        </button>
      )}
      {currentStatus !== "rejected" && (
        <button
          className={`${baseBtnClass} bg-red-500 text-white hover:bg-red-600`}
          onClick={() => handleStatusChange("rejected")}
          disabled={isUpdating}
        >
          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : "Reject"}
        </button>
      )}
    </div>
  );
};

/* =========================
   SUBMISSION CARD COMPONENT
========================= */
const SubmissionCard = React.memo(
  ({
    sub,
    handleUpdateStatus,
    getCommitmentLabels,
    handleContact,
    index,
    isUpdating,
  }: {
    sub: Submission;
    handleUpdateStatus: (id: string, newStatus: "approved" | "rejected") => Promise<void>;
    getCommitmentLabels: (values: string[]) => string;
    handleContact: (name: string, phone: string) => void;
    index: number;
    isUpdating: boolean;
  }) => {
    return (
      <motion.div
        key={sub._id}
        initial={{ y: 32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 20, delay: index * 0.08 }}
        whileHover={{ scale: 1.02, boxShadow: "0 10px 26px rgba(0,0,0,0.12)" }}
        className={`p-6 rounded-xl shadow-md bg-card text-card-foreground border border-border transition-all duration-300 ease-in-out ${
          isUpdating ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {/* TOP SECTION */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-b pb-3 mb-3 gap-4">
          <div className="space-y-1">
            <p className="text-lg font-semibold text-foreground">{sub.fullName}</p>

            {/* Changed text color to text-foreground for DOB visibility */}
            <p className="text-sm text-foreground">
              DOB: {sub.dob ? new Date(sub.dob).toLocaleDateString() : "N/A"}
            </p>

            <p className="flex items-center text-sm text-muted-foreground">
              <Mail className="w-4 h-4 mr-2" />
              {sub.email}
            </p>

            <p className="flex items-center text-sm text-muted-foreground">
              <Phone className="w-4 h-4 mr-2" />
              {sub.phone}
            </p>

            <p className="flex items-center text-sm text-muted-foreground">
              <Users className="w-4 h-4 mr-2" />
              Gender: {sub.gender}
            </p>
          </div>

          <span className="text-sm text-muted-foreground flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {new Date(sub.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* AVAILABILITY */}
        <div className="mt-2 p-4 rounded-lg bg-muted">
          <p className="text-base font-semibold mb-1 flex items-center text-muted-foreground">
            <ClipboardList className="w-5 h-5 mr-2 text-blue-600" />
            Preferred Availability:
          </p>

          <p className="text-sm text-muted-foreground">
            {getCommitmentLabels(sub.timeCommitment)}
          </p>
        </div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 border-t">
          <ModerationButtons
            submissionId={sub._id}
            currentStatus={sub.status}
            onUpdateStatus={handleUpdateStatus}
            isUpdating={isUpdating}
          />

          <button
            onClick={() => handleContact(sub.fullName, sub.phone)}
            className="mt-4 sm:mt-0 px-5 py-2 rounded-full shadow bg-green-600 text-white text-lg font-semibold flex items-center justify-center hover:bg-green-700 transition-all duration-300"
          >
            <FaWhatsapp className="mr-1" />
          </button>
        </div>
      </motion.div>
    );
  }
);

SubmissionCard.displayName = "SubmissionCard";

/* =========================
   MAIN DASHBOARD COMPONENT
========================= */

const VolunteerSubmissionsDashboard: React.FC = () => {
  const userId = "mongo-admin-id-789"; // keep as-is; replace with real admin id if needed

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const submissionsPerPage = 4; // 2x2 grid on medium screens

  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/volunteer", {
        method: "GET",
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Failed to fetch");

      const raw = await response.json();
      const data = Array.isArray(raw) ? raw : raw.data;
      setSubmissions(
        (data || []).sort(
          (a: Submission, b: Submission) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      setSubmissions([]);
    } finally {
      setIsLoading(false);
      // gentle fade-in
      setTimeout(() => setIsLoaded(true), 300);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // update status (approve/reject)
  const handleUpdateStatus = useCallback(
    async (submissionId: string, newStatus: "approved" | "rejected") => {
      setUpdatingId(submissionId);

      // optimistic update
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub._id === submissionId ? { ...sub, status: newStatus } : sub
        )
      );

      try {
        const response = await fetch(`/api/volunteer/${submissionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        if (!response.ok) throw new Error("Update failed");

        // Optionally open WhatsApp on approval
        if (newStatus === "approved") {
          const approvedVolunteer = submissions.find((s) => s._id === submissionId);
          if (approvedVolunteer?.phone) {
            const phoneNumber = approvedVolunteer.phone.replace(/\D/g, "");
            const message = "Thank you for volunteering! We will call you when we need you.";
            const encodedMsg = encodeURIComponent(message);
            window.open(`https://wa.me/${phoneNumber}?text=${encodedMsg}`, "_blank");
          }
        }
      } catch (error) {
        console.error("Update error:", error);
        // rollback on error
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub._id === submissionId ? { ...sub, status: "pending" } : sub
          )
        );
      } finally {
        setUpdatingId(null);
      }
    },
    [submissions]
  );

  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");

  const filteredSubmissions = useMemo(() => {
    let filtered = submissions;

    if (statusFilter !== "all")
      filtered = filtered.filter((sub) => sub.status === statusFilter);

    if (timeFilter !== "all")
      filtered = filtered.filter((sub) => sub.timeCommitment.includes(timeFilter));

    if (searchTerm.trim() !== "") {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (sub) =>
          sub.fullName.toLowerCase().includes(lower) ||
          sub.email.toLowerCase().includes(lower)
      );
    }

    return filtered;
  }, [submissions, statusFilter, timeFilter, searchTerm]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredSubmissions.length / submissionsPerPage));
  const startIndex = (currentPage - 1) * submissionsPerPage;
  const paginatedSubmissions = filteredSubmissions.slice(
    startIndex,
    startIndex + submissionsPerPage
  );

  const totalCount = submissions.length;
  const pendingCount = submissions.filter((sub) => sub.status === "pending").length;

  const handleContact = (name: string, phone: string) => {
    const phoneNumber = phone.replace(/\D/g, "");
    const encodedMsg = encodeURIComponent("Hello, thank you for applying!");
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMsg}`, "_blank");
  };

  const getCommitmentLabels = (values: string[]) =>
    values && values.length > 0
      ? values.map((val) => commitmentMap[val] || val).join(" | ")
      : "No specific times selected.";

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-center mt-6 space-x-3">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded border ${
                isActive ? "bg-blue-600 text-white border-blue-600" : "border-gray-300"
              }`}
            >
              {page}
            </button>
          );
        })}
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="max-w-7xl w-full p-8 md:p-12 transition-opacity duration-700 opacity-100">
          {/* Simple skeleton placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl shadow bg-white animate-pulse"
                style={{ minHeight: 220 }}
              />
            ))}
          </div>
        </div>
      );
    }

    if (submissions.length === 0 && statusFilter === "all" && timeFilter === "all") {
      return (
        <div
          className="min-h-screen flex flex-col justify-center items-center p-8"
          style={{ backgroundColor: COLOR_BG_MAIN }}
        >
          <LayoutDashboard
            className="w-20 h-20 mb-6 animate-bounce"
            style={{ color: COLOR_PRIMARY }}
          />
          <p className="text-4xl font-extrabold mb-4" style={{ color: COLOR_TEXT }}>
            No Volunteer Submissions Yet
          </p>
          <p className="text-xl mt-3 text-muted-foreground">
            Data will appear here once the first application is submitted.
          </p>
          <div
            className="mt-8 p-4 rounded-lg text-md text-muted-foreground shadow-md"
            style={{ backgroundColor: COLOR_BG_CARD }}
          >
            <p>
              Admin ID: <span className="font-mono font-bold">{userId}</span>
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`max-w-7xl w-full rounded-2xl p-2 md:p-8 transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Header */}
        <header
          className="text-center mb-8 md:mb-12 pb-6 border-b"
          style={{ borderColor: COLOR_PRIMARY }}
        >
          <h1
            className="text-3xl md:text-5xl font-black flex flex-col md:flex-row items-center justify-center"
            style={{ color: COLOR_TEXT }}
          >
            <LayoutDashboard
              className="w-8 h-8 md:w-10 md:h-10 mr-0 md:mr-4 mb-2 md:mb-0"
              style={{ color: COLOR_PRIMARY }}
            />
            Volunteer Dashboard
          </h1>
          <p className="text-base md:text-lg mt-1 md:mb-4" style={{ color: "#6b7280" }}>
            Review and moderate volunteer applications.
          </p>
        </header>

        {/* KPI cards */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 20, delay: i * 0.06 }}
              className="p-6 rounded-xl shadow-md text-center"
              style={
                i === 1
                  ? { background: COLOR_PRIMARY, color: "#fff" }
                  : i === 2
                  ? { background: "#fff", color: COLOR_TEXT, border: "1px solid #eee" }
                  : { background: COLOR_SECONDARY, color: COLOR_PRIMARY }
              }
            >
              {i === 1 && <CheckCircle className="w-8 h-8 mx-auto mb-2" />}
              {i === 2 && <Users className="w-8 h-8 mx-auto mb-2" style={{ color: COLOR_SECONDARY }} />}
              {i === 3 && <AlertTriangle className="w-8 h-8 mx-auto mb-2" />}
              <p className="text-sm font-semibold">
                {i === 1 && "Approved Volunteers"}
                {i === 2 && "Total Applications"}
                {i === 3 && "Pending Review"}
              </p>
              <p className="text-3xl md:text-4xl font-bold">
                {i === 1 && submissions.filter((s) => s.status === "approved").length}
                {i === 2 && totalCount}
                {i === 3 && submissions.filter((s) => s.status === "pending").length}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Filters / Search */}
        <div className="mb-8 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center">
            <Filter className="w-6 h-6 mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold" style={{ color: COLOR_TEXT }}>
              Filters
            </h2>
          </div>

          <div className="flex flex-col w-full md:w-auto flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="p-2 rounded-full border border-border bg-muted text-foreground focus:ring-2 focus:ring-blue-400"
            >
              <option value="all">All ({totalCount})</option>
              <option value="pending">Pending ({pendingCount})</option>
              <option value="approved">Approved ({submissions.filter((s) => s.status === "approved").length})</option>
              <option value="rejected">Rejected ({submissions.filter((s) => s.status === "rejected").length})</option>
            </select>
          </div>

          <div className="flex flex-col w-full md:w-auto flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-1">Availability</label>
            <select
              value={timeFilter}
              onChange={(e) => {
                setTimeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="p-2 rounded-full border border-border bg-muted text-foreground focus:ring-2 focus:ring-blue-400"
            >
              <option value="all">All</option>
              {timeCommitmentOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col w-full md:w-auto flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-1" htmlFor="volunteerSearch">
              Search
            </label>
            <input
              id="volunteerSearch"
              type="search"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="p-2 rounded-full border border-border bg-muted text-foreground focus:ring-2 focus:ring-blue-400"
              aria-label="Search volunteer submissions by name or email"
              autoComplete="off"
            />
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {paginatedSubmissions.map((sub, index) => (
            <SubmissionCard
              key={sub._id}
              sub={sub}
              handleUpdateStatus={handleUpdateStatus}
              getCommitmentLabels={getCommitmentLabels}
              handleContact={handleContact}
              index={index}
              isUpdating={updatingId === sub._id}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6">{renderPagination()}</div>
      </div>
    );
  };

  return (
    <div className="font-sans">
      <div
        className="min-h-screen flex justify-center py-4 md:py-12 px-2 md:px-6 lg:px-8"
        style={{ backgroundColor: COLOR_BG_MAIN, color: COLOR_TEXT }}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default VolunteerSubmissionsDashboard;
