"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  ClipboardList,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

/* --------------------------------------------------------
   TYPES
--------------------------------------------------------- */
type StatusType = "Pending" | "Accepted" | "Contacted" | "Rejected";

interface IContactHistory {
  contactedBy: string;
  contactedAt: Date;
}

export interface IConsultRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service?: string;
  service_other?: string;
  date?: string;
  mode?: string;
  message?: string;
  status: StatusType;
  contactedHistory: IContactHistory[];
}

/* --------------------------------------------------------
   COLORS (same as volunteer)
--------------------------------------------------------- */
const COLOR_PRIMARY = "#0050A4";
const COLOR_SECONDARY = "#FFC72C";
const COLOR_SUCCESS = "#22C55E";
const COLOR_DANGER = "#EF4444";

/* --------------------------------------------------------
   STATUS BADGE
--------------------------------------------------------- */
const StatusBadge = ({ status }: { status: StatusType }) => {
  const map: any = {
    Pending: { bg: COLOR_SECONDARY, icon: <Clock size={14} /> },
    Accepted: { bg: COLOR_PRIMARY, icon: <CheckCircle size={14} /> },
    Contacted: { bg: COLOR_SUCCESS, icon: <CheckCircle size={14} /> },
    Rejected: { bg: COLOR_DANGER, icon: <AlertTriangle size={14} /> },
  };

  return (
    <span
      className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ background: map[status].bg, color: "white" }}
    >
      {map[status].icon} {status}
    </span>
  );
};

/* --------------------------------------------------------
   DETAILS PANEL
--------------------------------------------------------- */
const ConsultDetailsPanel = ({ data, onUpdateStatus, onContact, loading }: any) => {
  if (!data)
    return (
      <aside
        className="rounded-xl p-5 flex items-center justify-center text-muted-foreground"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          minHeight: 450,
        }}
      >
        Select a request to view details
      </aside>
    );

  const initials = data.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();

  return (
    <aside
      className="rounded-xl p-6"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        minHeight: 450,
        color: "var(--foreground)",
      }}
    >
      {/* Profile Icon */}
      <div className="flex flex-col items-center">
        <div
          className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold"
          style={{ background: "var(--accent)", color: COLOR_SECONDARY }}
        >
          {initials}
        </div>

        <h2 className="text-xl font-semibold mt-3" style={{ color: COLOR_PRIMARY }}>
          {data.name}
        </h2>

        <div className="mt-2">
          <StatusBadge status={data.status} />
        </div>
      </div>

      {/* Details */}
      <div className="mt-6 space-y-3">
        <DetailRow label="Email" value={data.email} icon={<Mail />} />
        <DetailRow label="Phone" value={data.phone} icon={<Phone />} />

        <DetailRow
          label="Service"
          value={data.service_other || data.service || "N/A"}
          icon={<ClipboardList />}
        />

        <DetailRow
          label="Preferred Date"
          value={data.date ? new Date(data.date).toLocaleDateString() : "N/A"}
          icon={<Clock />}
        />

        <DetailRow label="Mode" value={data.mode || "N/A"} icon={<ClipboardList />} />

        <div className="p-3 rounded-lg" style={{ background: "var(--muted)" }}>
          <div className="text-sm font-semibold mb-1" style={{ color: COLOR_PRIMARY }}>
            Message
          </div>
          <p className="text-sm opacity-75">{data.message || "No message"}</p>
        </div>

        {/* Contact History */}
        {data.contactedHistory?.length > 0 && (
          <div className="p-3 rounded-lg" style={{ background: "var(--muted)" }}>
            <div className="text-sm font-semibold mb-1" style={{ color: COLOR_PRIMARY }}>
              Contact History
            </div>
            <ul className="text-xs opacity-75 space-y-1">
              {data.contactedHistory.map((h: any, i: number) => (
                <li key={i}>
                  • Contacted by <b>{h.contactedBy}</b> on{" "}
                  {new Date(h.contactedAt).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-6 space-y-3">
        <button
          className="w-full py-2 rounded-full flex items-center justify-center font-semibold"
          style={{ background: COLOR_SECONDARY, color: COLOR_PRIMARY }}
          onClick={() => onContact(data)}
        >
          <FaWhatsapp className="mr-2" /> Contact via WhatsApp
        </button>

        {data.status !== "Accepted" && (
          <button
            className="w-full py-2 rounded-full text-white font-semibold"
            style={{ background: COLOR_PRIMARY }}
            disabled={loading}
            onClick={() => onUpdateStatus(data._id, "Accepted")}
          >
            {loading ? "Updating..." : "Accept"}
          </button>
        )}

        {data.status !== "Rejected" && (
          <button
            className="w-full py-2 rounded-full text-white font-semibold"
            style={{ background: COLOR_DANGER }}
            disabled={loading}
            onClick={() => onUpdateStatus(data._id, "Rejected")}
          >
            {loading ? "Updating..." : "Reject"}
          </button>
        )}
      </div>
    </aside>
  );
};

/* --------------------------------------------------------
   DETAIL ROW
--------------------------------------------------------- */
const DetailRow = ({ label, value, icon }: any) => (
  <div
    className="p-3 rounded-lg flex items-center justify-between text-sm"
    style={{ background: "var(--muted)" }}
  >
    <div className="flex items-center gap-2 opacity-75">
      {icon}
      {label}
    </div>
    <span className="font-semibold">{value}</span>
  </div>
);

/* --------------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------------- */
export default function AdminConsultRequests() {
  const [requests, setRequests] = useState<IConsultRequest[]>([]);
  const [filteredList, setFiltered] = useState<IConsultRequest[]>([]);
  const [selected, setSelected] = useState<IConsultRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [searchTerm, setSearch] = useState("");

  /* ⭐ PAGINATION STATES */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  /* -----------------------------------------
     Load Data
  ----------------------------------------- */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/request/consult-requests`);
        const data = await res.json();
        if (data.success) {
          setRequests(data.data);
          setFiltered(data.data);
          setSelected(data.data[0]);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* -----------------------------------------
     Search Filter
  ----------------------------------------- */
  useEffect(() => {
    let arr = requests;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      arr = arr.filter((x) => x.name.toLowerCase().includes(q));
    }

    setFiltered(arr);
    setCurrentPage(1); // reset pagination on search
  }, [searchTerm, requests]);

  /* -----------------------------------------
     Pagination Logic
  ----------------------------------------- */
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentRequests = filteredList.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  const scrollToTop = () => {
    window.scrollTo({ top: 250, behavior: "smooth" });
  };

  /* -----------------------------------------
     Status Update
  ----------------------------------------- */
  const handleUpdateStatus = async (id: string, status: StatusType) => {
    setActionLoading(true);

    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/consult-request/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, adminName: "Admin" }),
    });

    setRequests((prev) =>
      prev.map((x) => (x._id === id ? { ...x, status } : x))
    );

    setActionLoading(false);
  };

  /* -----------------------------------------
     Contact via WhatsApp
  ----------------------------------------- */
  const handleContact = (req: IConsultRequest) => {
    const cleaned = req.phone.replace(/\D/g, "");
    const final = cleaned.length === 10 ? `91${cleaned}` : cleaned;

    const msg = `Hello ${req.name}, we are contacting you regarding your consultation request.`;

    window.open(
      `https://api.whatsapp.com/send?phone=${final}&text=${encodeURIComponent(msg)}`,
      "_blank"
    );

    handleUpdateStatus(req._id, "Contacted");
  };

  /* -----------------------------------------
     Summary Counts
  ----------------------------------------- */
  const counts = {
    Pending: requests.filter((x) => x.status === "Pending").length,
    Accepted: requests.filter((x) => x.status === "Accepted").length,
    Contacted: requests.filter((x) => x.status === "Contacted").length,
    Rejected: requests.filter((x) => x.status === "Rejected").length,
  };

  /* -----------------------------------------
     Loading screen
  ----------------------------------------- */
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        Loading...
      </div>
    );

  /* -----------------------------------------
     RENDER
  ----------------------------------------- */
  return (
    <div className="min-h-screen p-6" style={{ background: "var(--muted)" }}>
      {/* HEADER */}
      <div className="p-6 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h2 className="text-2xl font-bold" style={{ color: COLOR_PRIMARY }}>
            Consultation Requests
          </h2>

          <div
            className="mt-4 md:mt-0 flex items-center px-4 py-2 rounded-full shadow-sm"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <Search className="w-4 h-4 opacity-70 mr-2" />
            <input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none bg-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
        <SummaryCard title="Pending" count={counts.Pending} bg={COLOR_SECONDARY} color={COLOR_PRIMARY} icon={<Clock size={30} />} />
        <SummaryCard title="Accepted" count={counts.Accepted} bg={COLOR_PRIMARY} color="white" icon={<CheckCircle size={30} />} />
        <SummaryCard title="Contacted" count={counts.Contacted} bg={COLOR_SUCCESS} color="white" icon={<CheckCircle size={30} />} />
        <SummaryCard title="Rejected" count={counts.Rejected} bg={COLOR_DANGER} color="white" icon={<AlertTriangle size={30} />} />
      </div>

      {/* MAIN GRID */}
      <div className="p-6" style={{ background: "var(--muted)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 max-w-[1200px] mx-auto">
          {/* LEFT: REQUEST LIST */}
          <div className="rounded-xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: COLOR_PRIMARY }}>
              Requests
            </h3>

            <div className="space-y-4">
              {currentRequests.map((req, i) => {
                const initials = req.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase();

                return (
                  <motion.div
                    key={req._id}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => setSelected(req)}
                    className="p-4 rounded-xl border cursor-pointer"
                    style={{ background: "var(--card)", borderColor: "var(--border)" }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                          style={{ background: "#f39c12", color: COLOR_PRIMARY }}
                        >
                          {initials}
                        </div>

                        <div>
                          <p className="font-semibold text-[15px]" style={{ color: COLOR_PRIMARY }}>
                            {req.name}
                          </p>
                          <p className="text-xs opacity-70">{req.email}</p>
                        </div>
                      </div>

                      <StatusBadge status={req.status} />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* ⭐ PAGINATION UI */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((p) => p - 1);
                    scrollToTop();
                  }}
                  className="px-4 py-2 rounded-full border bg-white disabled:opacity-40"
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentPage(i + 1);
                      scrollToTop();
                    }}
                    className={`px-4 py-2 rounded-full border ${
                      currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((p) => p + 1);
                    scrollToTop();
                  }}
                  className="px-4 py-2 rounded-full border bg-white disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* RIGHT PANEL */}
          <ConsultDetailsPanel
            data={selected}
            onUpdateStatus={handleUpdateStatus}
            onContact={handleContact}
            loading={actionLoading}
          />
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------
   SUMMARY CARD
--------------------------------------------------------- */
const SummaryCard = ({ title, count, bg, color, icon }: any) => (
  <div className="rounded-xl p-5 flex items-center gap-4" style={{ background: bg, color }}>
    {icon}
    <div>
      <p className="text-sm">{title}</p>
      <p className="text-3xl font-bold">{count}</p>
    </div>
  </div>
);
