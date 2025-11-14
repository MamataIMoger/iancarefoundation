// Admin/components/VolunteerSubmissionsView.tsx
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Mail,
  Phone,
  CheckCircle,
  Clock,
  LayoutDashboard,
  Loader2,
  ArrowRight,
  Filter,
  Users,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";

// --- Color Palette ---
const COLOR_PRIMARY = "#0050A4"; // Deep Blue
const COLOR_SECONDARY = "#FFC72C"; // Golden Yellow
const COLOR_TEXT = "#1E272E"; // Slate
const COLOR_BG_MAIN = "#F8FAFC"; // Light Gray
const COLOR_BG_CARD = "#FFFFFF"; // White
const COLOR_SUCCESS = "#22C55E"; // Green
const COLOR_DANGER = "#EF4444"; // Red

// Time Commitment options
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

// Submission interface
interface Submission {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  timeCommitment: string[];
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

// Skeleton Card Component
const SkeletonCard = () => (
  <div className="p-6 rounded-xl shadow-md bg-card animate-pulse">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-4">
      <div>
        <div className="h-6 text-muted-foreground rounded w-48 mb-2"></div>
        <div className="space-y-2 mt-3">
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
            <div className="h-4 text-card-foreground rounded w-64"></div>
          </div>
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
            <div className="h-4 text-card-foreground rounded w-40"></div>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-muted-foreground" />
            <div className="h-4 text-card-foreground rounded w-24"></div>
          </div>
        </div>
      </div>
      <div className="h-4 text-muted-foreground rounded w-32 mt-4 sm:mt-0"></div>
    </div>

    <div className="mt-4 p-4 rounded-lg text-card-foreground">
      <div className="h-4 text-muted-foreground rounded w-56 mb-2"></div>
      <div className="h-4 text-muted-foreground rounded w-full"></div>
    </div>

    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t">
      <div className="flex space-x-3">
        <div className="h-10 w-24 text-muted-foreground rounded-full"></div>
        <div className="h-10 w-24 text-muted-foreground rounded-full"></div>
      </div>
      <div className="h-10 w-40 text-muted-foreground rounded-full mt-3 sm:mt-0"></div>
    </div>
  </div>
);


// Moderation Buttons
const ModerationButtons = ({
  submissionId,
  currentStatus,
  onUpdateStatus,
  isUpdating, // Added prop for loading state
}: {
  submissionId: string;
  currentStatus: "pending" | "approved" | "rejected";
  onUpdateStatus: (id: string, newStatus: "approved" | "rejected") => Promise<void>;
  isUpdating: boolean; // Prop for loading state
}) => {
  const baseBtnClass =
    "px-3 py-1.5 rounded-full transition duration-300 shadow text-sm font-bold hover:scale-[1.03] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";

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
          disabled={isUpdating} // Disable while updating
        >
          {isUpdating ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            "Approve"
          )}
        </button>
      )}
      {currentStatus !== "rejected" && (
        <button
          className={`${baseBtnClass} bg-red-500 text-white hover:bg-red-600`}
          onClick={() => handleStatusChange("rejected")}
          disabled={isUpdating} // Disable while updating
        >
          {isUpdating ? (
            <Loader2 className="w-4 h-4 animate-spin mr-1" />
          ) : (
            "Reject"
          )}
        </button>
      )}
    </div>
  );
};

// Submission Card
const SubmissionCard = React.memo(
  ({
    sub,
    handleUpdateStatus,
    getCommitmentLabels,
    handleContact,
    index,
    isUpdating, // Added prop for loading state
  }: {
    sub: Submission;
    handleUpdateStatus: (id: string, newStatus: "approved" | "rejected") => Promise<void>;
    getCommitmentLabels: (values: string[]) => string;
    handleContact: (name: string, phone: string) => void;
    index: number;
    isUpdating: boolean; // Prop for loading state
  }) => {
    // Determine if this specific card is the one being updated
    const cardIsUpdating = isUpdating; // Since isUpdating is passed down from the parent
    
    return (
     <div
      key={sub._id}
      className={`p-6 rounded-xl shadow-md bg-card text-card-foreground border border-border transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${
        cardIsUpdating ? "opacity-70 pointer-events-none" : ""
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
     >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-4 gap-4">
  <div className="space-y-2">
    <p className="text-xl font-semibold text-foreground">{sub.fullName}</p>
    <div className="space-y-1">
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
  </div>
  <span className="text-sm text-muted-foreground flex items-center">
    <Clock className="w-4 h-4 mr-1" />
    {new Date(sub.createdAt).toLocaleDateString()}
  </span>
</div>


        <div className="mt-4 p-4 rounded-lg bg-muted">
          <p className="text-base font-semibold mb-1 flex items-center text-muted-foreground">
            <ClipboardList className="w-5 h-5 mr-2 text-blue-600" /> Preferred
            Availability:
          </p>
          <p className="text-sm text-muted-foreground">
            {getCommitmentLabels(sub.timeCommitment)}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t">
          <ModerationButtons
            submissionId={sub._id}
            currentStatus={sub.status}
            onUpdateStatus={handleUpdateStatus}
            isUpdating={cardIsUpdating} // Pass specific loading state
          />
          <button
            onClick={() => handleContact(sub.fullName, sub.phone)}
            className="mt-3 sm:mt-0 text-sm font-semibold px-5 py-2 rounded-full shadow bg-green-600 text-white hover:bg-green-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={cardIsUpdating} // Disable contact button while updating
          >
            Contact via WhatsApp
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    );
  }
);
SubmissionCard.displayName = "SubmissionCard";

// --- Dashboard ---
const VolunteerSubmissionsDashboard: React.FC = () => {
  const userId = "mongo-admin-id-789";

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null); 

  const fetchSubmissions = useCallback(async () => {
  setIsLoading(true);
  try {
    const response = await fetch("/api/volunteer", {
      method: "GET",
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch");

    const raw = await response.json();
    // ✅ Normalize response shape
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
    setTimeout(() => setIsLoaded(true), 500);
  }
}, []);


  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleUpdateStatus = useCallback(
  async (submissionId: string, newStatus: "approved" | "rejected") => {
    setUpdatingId(submissionId);

    // Optimistic update
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

      // Optional: auto‑open WhatsApp for approved volunteers
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
      // Rollback optimistic update
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub._id === submissionId
            ? { ...sub, status: "pending" }
            : sub
        )
      );
    } finally {
      setUpdatingId(null);
    }
  },
  [submissions]
);


  // --- Filters and derived data ---
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");

  const displayedSubmissions = useMemo(() => {
    let filtered = submissions;
    if (statusFilter !== "all")
      filtered = filtered.filter((sub) => sub.status === statusFilter);
    if (timeFilter !== "all")
      filtered = filtered.filter((sub) => sub.timeCommitment.includes(timeFilter));
    return filtered;
  }, [submissions, statusFilter, timeFilter]);

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

  // --- Skeleton Loading State (New Blog-style loading) ---
  const renderContent = () => {
    // If the data is still loading, show the skeleton structure
    if (isLoading) {
      return (
        <div 
          className="max-w-7xl w-full p-8 md:p-12 transition-opacity duration-700 opacity-100"
          style={{ backgroundColor: 'var(--card)' }}
        >
          {/* Header Skeleton */}
          <div className="text-center mb-12 pb-6 border-b">
            <div className="h-10 text-card-foreground rounded mx-auto w-80 mb-4"></div>
            <div className="h-5 text-card-foreground rounded mx-auto w-96"></div>
          </div>

          {/* KPI Cards Skeleton */}
          <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-6 rounded-xl shadow-md text-center text-card-foreground animate-pulse">
                <div className="h-8 w-8 mx-auto mb-2 text-muted-foreground rounded-full"></div>
                <div className="h-4 text-card-foreground rounded w-24 mx-auto mb-2"></div>
                <div className="h-8 text-card-foreground rounded w-16 mx-auto"></div>
              </div>
            ))}
          </div>
          
          {/* Filters Skeleton */}
          <div className="mb-10 p-6 rounded-xl shadow-md bg-card flex flex-col md:flex-row gap-6 items-center animate-pulse">
            <div className="h-6 w-20 text-card-foreground rounded"></div>
            <div className="h-10 w-full md:w-1/2 text-card-foreground rounded-full"></div>
            <div className="h-10 w-full md:w-1/2 text-card-foreground rounded-full"></div>
          </div>

          {/* Submission List Skeletons */}
          <div className="h-6 text-card-foreground rounded w-48 mb-6"></div>
          <div className="space-y-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      );
    }

    // --- Empty State ---
    if (submissions.length === 0 && statusFilter === "all" && timeFilter === "all") {
      return (
        <div
          className="min-h-screen flex flex-col justify-center items-center p-8"
          style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
        >
          <LayoutDashboard
            className="w-20 h-20 mb-6 animate-bounce"
            style={{ color: COLOR_PRIMARY }}
          />
          <p className="text-4xl font-extrabold mb-4" style={{ color: 'var(--card-foreground)' }}>
            No Volunteer Submissions Yet
          </p>
          <p className="text-xl mt-3 text-muted-foreground">
            Data will appear here once the first application is submitted.
          </p>
          <div
            className="mt-8 p-4 rounded-lg text-md text-muted-foreground shadow-md"
            style={{ backgroundColor: 'var(--card)' }}
          >
            <p>
              Admin ID: <span className="font-mono font-bold">{userId}</span>
            </p>
          </div>
        </div>
      );
    }

    // --- Main Dashboard ---
    return (
      <div
        className={`max-w-7xl w-full shadow-lg rounded-2xl p-8 md:p-12 transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundColor: 'var(--card)' }}
      >
        {/* Header */}
        <header
          className="text-center mb-12 pb-6 border-b"
          style={{ borderColor: COLOR_PRIMARY }}
        >
          <h1
            className="text-5xl font-black flex items-center justify-center"
            style={{ color: 'var(--foreground)' }}
          >
            <LayoutDashboard
              className="w-10 h-10 mr-4"
              style={{ color: COLOR_PRIMARY }}
            />{" "}
            Volunteer Dashboard
          </h1>
         <p className="text-lg mb-4" style={{ color: 'var(--muted-foreground)' }}>
            Review and moderate volunteer applications.
         </p>

        </header>

        {/* KPI Cards */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            className="p-6 rounded-xl shadow-md text-center"
            style={{ background: COLOR_PRIMARY, color: "#fff" }}
          >
            <CheckCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-semibold">Approved Volunteers</p>
            <p className="text-4xl font-bold">
              {submissions.filter((s) => s.status === "approved").length}
            </p>
          </div>
          <div
            className="p-6 rounded-xl shadow-md text-center bg-card"
            style={{ color: 'var(--card-foreground)' }}
          >
            <Users className="w-8 h-8 mx-auto mb-2" style={{ color: COLOR_SECONDARY }} />
            <p className="text-sm font-semibold">Total Applications</p>
            <p className="text-4xl font-bold">{totalCount}</p>
          </div>
          <div
            className="p-6 rounded-xl shadow-md text-center"
            style={{ background: COLOR_SECONDARY, color: COLOR_PRIMARY }}
          >
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-semibold">Pending Review</p>
            <p className="text-4xl font-bold">{pendingCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-10 p-6 rounded-xl shadow-md bg-card flex flex-col md:flex-row gap-6 items-center">
          <div className="flex items-center">
            <Filter className="w-6 h-6 mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold text-foreground">Filters</h2>
          </div>
          <div className="flex flex-col w-full md:w-auto flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="p-2 rounded-full border border-border bg-muted text-foreground focus:ring-2 focus:ring-blue-400"
             >
              <option value="all">All ({totalCount})</option>
              <option value="pending">Pending ({pendingCount})</option>
              <option value="approved">
                Approved ({submissions.filter((s) => s.status === "approved").length})
              </option>
              <option value="rejected">
                Rejected ({submissions.filter((s) => s.status === "rejected").length})
              </option>
            </select>
          </div>
          <div className="flex flex-col w-full md:w-auto flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-1">Availability</label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="p-2 rounded-full border border-border bg-muted text-foreground focus:ring-2 focus:ring-blue-400"            >
              <option value="all">All</option>
              {timeCommitmentOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submission List */}
        <h2 className="text-2xl font-bold mb-6 text-foreground">
          Showing{" "}
          <span className="text-blue-600">{displayedSubmissions.length}</span> of{" "}
          {totalCount} Applications
        </h2>
        <div className="space-y-6">
          {displayedSubmissions.length > 0 ? (
            displayedSubmissions.map((sub, index) => (
              <SubmissionCard
                key={sub._id}
                sub={sub}
                handleUpdateStatus={handleUpdateStatus}
                getCommitmentLabels={getCommitmentLabels}
                handleContact={handleContact}
                index={index}
                isUpdating={updatingId === sub._id}
              />
            ))
          ) : (
            <div className="text-center p-12 rounded-xl shadow-md bg-card">
              <CheckCircle className="w-10 h-10 mx-auto mb-4 text-blue-600" />
              <p className="text-lg font-bold text-foreground">
                No applications match the current filter settings.
              </p>
              <p className="text-muted-foreground">
                Try adjusting the Status or Availability filter above.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="font-sans">
      <div
        className="min-h-screen flex justify-center py-12 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default VolunteerSubmissionsDashboard;