"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Mail,
  Phone,
  CheckCircle,
  Clock,
  Users,
  AlertTriangle,
  ClipboardList,
  Search as SearchIcon,
  Loader2,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

/* -------------------------------------
   TIME COMMITMENT OPTIONS
-------------------------------------- */
const timeCommitmentOptions = [
  { value: "Mornings", label: "Morning Shifts (8 AM – 12 PM)" },
  { value: "Afternoons", label: "Afternoon Shifts (12 PM – 5 PM)" },
  { value: "Evenings", label: "Evening Shift (5 PM – 9 PM)" },
  { value: "Weekdays", label: "Weekdays (Mon–Fri)" },
  { value: "Weekends", label: "Weekends Only" },
  { value: "OneTime", label: "One-Time Events Only" },
];

const commitmentMap = timeCommitmentOptions.reduce(
  (acc, option) => ({ ...acc, [option.value]: option.label }),
  {}
);

/* -------------------------------------
   Submission Interface
-------------------------------------- */
interface Submission {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dob?: string;
  timeCommitment: string[];
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

/* -------------------------------------
   Moderation Buttons
-------------------------------------- */
const ModerationButtons = ({
  submissionId,
  currentStatus,
  onUpdateStatus,
  loading,
}: {
  submissionId: string;
  currentStatus: "pending" | "approved" | "rejected";
  onUpdateStatus: (id: string, s: "approved" | "rejected") => Promise<void>;
  loading: boolean;
}) => (
  <div className="flex items-center gap-2">
    <div
      className="px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-semibold"
      style={{
        background:
          currentStatus === "approved"
            ? "var(--success)"
            : currentStatus === "rejected"
            ? "var(--destructive)"
            : "var(--secondary)",
        color:
          currentStatus === "pending"
            ? "var(--secondary-foreground)"
            : "var(--card)",
      }}
    >
      {currentStatus === "approved" && <CheckCircle className="w-4 h-4" />}
      {currentStatus === "rejected" && <AlertTriangle className="w-4 h-4" />}
      {currentStatus === "pending" && <Clock className="w-4 h-4" />}
      {currentStatus.toUpperCase()}
    </div>

    {currentStatus !== "approved" && (
      <button
        disabled={loading}
        onClick={() => onUpdateStatus(submissionId, "approved")}
        className="px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold flex items-center"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Approve"}
      </button>
    )}

    {currentStatus !== "rejected" && (
      <button
        disabled={loading}
        onClick={() => onUpdateStatus(submissionId, "rejected")}
        className="px-3 py-1.5 rounded-full bg-destructive text-destructive-foreground text-sm font-semibold flex items-center"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reject"}
      </button>
    )}
  </div>
);

/* -------------------------------------
   Detail Row
-------------------------------------- */
const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div
    className="p-3 rounded-lg flex justify-between items-center"
    style={{ background: "var(--muted)" }}
  >
    <div className="flex items-center gap-2 text-muted-foreground">
      {icon}
      <span>{label}</span>
    </div>

    <span className="font-semibold text-primary">{value}</span>
  </div>
);

/* -------------------------------------
   RIGHT PANEL — FULL DETAIL VIEW
-------------------------------------- */
const VolunteerDetailsPanel = ({
  volunteer,
  updatingId,
  handleUpdateStatus,
  handleContact,
  getLabels,
}: {
  volunteer: Submission | null;
  updatingId: string | null;
  handleUpdateStatus: (id: string, st: "approved" | "rejected") => Promise<void>;
  handleContact: (name: string, phone: string) => void;
  getLabels: (arr: string[]) => string;
}) => {
  if (!volunteer)
    return (
      <aside
        className="rounded-xl p-6 flex items-center justify-center text-muted-foreground"
        style={{
          border: "1px solid var(--border)",
          background: "var(--card)",
          minHeight: 400,
        }}
      >
        Select a volunteer to view details
      </aside>
    );

  const initials = volunteer.fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const loader = updatingId === volunteer._id;

  return (
    <aside
      className="rounded-xl p-6"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        color: "var(--foreground)",
      }}
    >
      <div className="flex flex-col items-center">
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold mb-3"
          style={{ background: "var(--muted)", color: "var(--primary)" }}
        >
          {initials}
        </div>

        <h2 className="text-xl font-bold text-primary">{volunteer.fullName}</h2>

        <div
          className="mt-2 px-3 py-1 rounded-full text-sm font-semibold"
          style={{
            background:
              volunteer.status === "approved"
                ? "var(--success)"
                : volunteer.status === "rejected"
                ? "var(--destructive)"
                : "var(--secondary)",
            color:
              volunteer.status === "pending"
                ? "var(--secondary-foreground)"
                : "var(--card)",
          }}
        >
          {volunteer.status.toUpperCase()}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <DetailRow icon={<Mail />} label="Email" value={volunteer.email} />
        <DetailRow icon={<Phone />} label="Phone" value={volunteer.phone} />
        <DetailRow icon={<Users />} label="Gender" value={volunteer.gender} />
        <DetailRow
          icon={<Clock />}
          label="DOB"
          value={volunteer.dob ? new Date(volunteer.dob).toLocaleDateString() : "N/A"}
        />
        <DetailRow
          icon={<Clock />}
          label="Applied On"
          value={new Date(volunteer.createdAt).toLocaleDateString()}
        />

        <div
          className="p-3 rounded-lg"
          style={{ background: "var(--muted)" }}
        >
          <div className="flex items-center gap-2 text-primary font-semibold">
            <ClipboardList className="w-4 h-4" /> Availability
          </div>
          <p className="mt-1 text-muted-foreground">{getLabels(volunteer.timeCommitment)}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <button
          onClick={() => handleContact(volunteer.fullName, volunteer.phone)}
          className="w-full py-2 rounded-full font-semibold flex items-center justify-center"
          style={{
            background: "var(--secondary)",
            color: "var(--secondary-foreground)",
          }}
        >
          <FaWhatsapp className="mr-2" /> Contact via WhatsApp
        </button>

        {/* APPROVE */}
        {volunteer.status !== "approved" && (
          <button
            disabled={loader}
            onClick={() => handleUpdateStatus(volunteer._id, "approved")}
            className="w-full py-2 rounded-full bg-primary text-primary-foreground font-semibold"
          >
            {loader ? "Updating..." : "Approve"}
          </button>
        )}

        {/* REJECT */}
        {volunteer.status !== "rejected" && (
          <button
            disabled={loader}
            onClick={() => handleUpdateStatus(volunteer._id, "rejected")}
            className="w-full py-2 rounded-full bg-destructive text-destructive-foreground font-semibold"
          >
            {loader ? "Updating..." : "Reject"}
          </button>
        )}
      </div>
    </aside>
  );
};

/* -------------------------------------
   MAIN DASHBOARD COMPONENT
-------------------------------------- */
export default function VolunteerSubmissionsDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [selected, setSelected] = useState<Submission | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | "approved" | "pending" | "rejected">("all");

  const submissionsPerPage = 4;
  const [page, setPage] = useState(1);

  /* -------------------------------------
      LOAD SUBMISSIONS
  -------------------------------------- */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/volunteer", { cache: "no-store" });
        const raw = await res.json();
        const data = Array.isArray(raw) ? raw : raw.data;

        const sorted = data.sort(
          (a: Submission, b: Submission) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setSubmissions(sorted);
        setSelected(sorted[0] || null);
      } catch {
        setSubmissions([]);
      }
      setLoading(false);
    };

    load();
  }, []);

  /* -------------------------------------
      UPDATE STATUS
  -------------------------------------- */
  const handleUpdateStatus = useCallback(
    async (id: string, status: "approved" | "rejected") => {
      setUpdatingId(id);

      setSubmissions((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status } : s))
      );

      try {
        await fetch(`/api/volunteer/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
      } catch {
        // rollback
        setSubmissions((prev) =>
          prev.map((s) => (s._id === id ? { ...s, status: "pending" } : s))
        );
      }

      setUpdatingId(null);
    },
    []
  );

  /* -------------------------------------
      CONTACT ACTION
  -------------------------------------- */
  const handleContact = (name: string, phone: string) => {
    const num = phone.replace(/\D/g, "");
    const msg = encodeURIComponent("Hello! Thank you for applying.");
    window.open(`https://wa.me/${num}?text=${msg}`, "_blank");
  };

  /* -------------------------------------
      FILTERING
  -------------------------------------- */
  const filtered = useMemo(() => {
    let arr = submissions;

    if (statusFilter !== "all") arr = arr.filter((s) => s.status === statusFilter);

    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      );
    }

    return arr;
  }, [submissions, search, statusFilter]);

  /* -------------------------------------
      PAGINATION
  -------------------------------------- */
  const totalPages = Math.ceil(filtered.length / submissionsPerPage);
  const paginated = filtered.slice(
    (page - 1) * submissionsPerPage,
    page * submissionsPerPage
  );

  /* -------------------------------------
      AVAILABILITY LABELS
  -------------------------------------- */
  const getLabels = (arr: string[]) =>
    arr && arr.length ? arr.map((v) => commitmentMap[v]).join(" | ") : "N/A";

  /* -------------------------------------
      LOADING
  -------------------------------------- */
  if (loading)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        Loading...
      </div>
    );

  /* -------------------------------------
      MAIN UI
  -------------------------------------- */
  return (
    <div
      className="min-h-screen p-6 md:p-10"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div
        className="rounded-3xl mx-auto shadow border"
        style={{
          background: "var(--card)",
          borderColor: "var(--border)",
          maxWidth: 1200,
        }}
      >
        {/* HEADER */}
        <div
          className="p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Volunteer Dashboard
            </h1>
            <p className="text-muted-foreground">
              Overview of volunteer submissions
            </p>
          </div>

          <div
            className="flex items-center px-4 py-2 rounded-full shadow"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <SearchIcon className="w-4 h-4 mr-2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search volunteers…"
              className="bg-transparent outline-none text-sm"
              style={{ color: "var(--foreground)" }}
            />
          </div>
        </div>

        {/* FILTER BUTTONS */}
        <div className="p-4 flex gap-2 justify-center">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => {
            const active = f === statusFilter;

            return (
              <button
                key={f}
                onClick={() => {
                  setStatusFilter(f);
                  setPage(1);
                }}
                className="px-4 py-1.5 text-sm font-medium rounded-full border"
                style={{
                  background: active ? "var(--primary)" : "transparent",
                  color: active
                    ? "var(--primary-foreground)"
                    : "var(--foreground)",
                  borderColor: "var(--border)",
                }}
              >
                {f[0].toUpperCase() + f.slice(1)}
              </button>
            );
          })}
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          {/* Approved */}
          <div
            className="rounded-xl p-5 flex gap-4 shadow"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            <CheckCircle className="w-10 h-10" />
            <div>
              <p className="text-sm opacity-90">Approved Volunteers</p>
              <p className="text-3xl font-bold">
                {submissions.filter((s) => s.status === "approved").length}
              </p>
            </div>
          </div>

          {/* Total */}
          <div
            className="rounded-xl p-5 shadow border"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
            }}
          >
            <Users className="w-10 h-10 mb-1 text-primary" />
            <p className="text-sm text-muted-foreground">Total Applications</p>
            <p className="text-3xl font-bold text-primary">
              {submissions.length}
            </p>
          </div>

          {/* Pending */}
          <div
            className="rounded-xl p-5 shadow"
            style={{
              background: "var(--secondary)",
              color: "var(--secondary-foreground)",
            }}
          >
            <AlertTriangle className="w-10 h-10 mb-1" />
            <p className="text-sm">Pending Review</p>
            <p className="text-3xl font-bold">
              {submissions.filter((s) => s.status === "pending").length}
            </p>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="p-6 bg-background rounded-b-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 max-w-[1150px] mx-auto">
            {/* LEFT LIST */}
            <div
              className="rounded-xl p-5 border"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <h2 className="text-lg font-semibold text-primary mb-4">
                Volunteers
              </h2>

              <div className="space-y-4">
                {paginated.length === 0 && (
                  <div className="py-6 text-center text-muted-foreground">
                    No volunteers found.
                  </div>
                )}

                {paginated.map((sub, index) => {
                  const initials = sub.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();

                  return (
                    <motion.div
                      key={sub._id}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelected(sub)}
                      className="p-4 rounded-xl border cursor-pointer"
                      style={{
                        background:
                          selected?._id === sub._id
                            ? "var(--muted)"
                            : "var(--card)",
                        borderColor: "var(--border)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                            style={{
                              background: "var(--muted)",
                              color: "var(--primary)",
                            }}
                          >
                            {initials}
                          </div>

                          <div>
                            <p className="font-semibold text-primary">
                              {sub.fullName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {sub.email}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs text-muted-foreground">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="mt-6 flex justify-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1 border rounded"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  const active = p === page;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className="px-3 py-1 border rounded"
                      style={{
                        borderColor: active ? "var(--primary)" : "var(--border)",
                        background: active ? "var(--primary)" : "transparent",
                        color: active
                          ? "var(--primary-foreground)"
                          : "var(--foreground)",
                      }}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 border rounded"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  Next
                </button>
              </div>
            </div>

            {/* RIGHT DETAILS */}
            <VolunteerDetailsPanel
              volunteer={selected}
              updatingId={updatingId}
              handleUpdateStatus={handleUpdateStatus}
              handleContact={handleContact}
              getLabels={getLabels}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
