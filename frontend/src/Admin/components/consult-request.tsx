"use client";

import React, { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

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

const COLOR_PRIMARY = "#0050A4";
const COLOR_SECONDARY = "#FFC72C";
const COLOR_SUCCESS = "#22C55E";
const COLOR_DANGER = "#EF4444";
const blue = "#005691";

const StatusBadge = ({ status }: { status: StatusType }) => {
  const map = {
    Pending: {
      bg: COLOR_SECONDARY,
      icon: <Clock className="w-4 h-4 mr-1" />,
      label: "Pending",
    },
    Accepted: {
      bg: COLOR_PRIMARY,
      icon: <CheckCircle className="w-4 h-4 mr-1" />,
      label: "Accepted",
    },
    Contacted: {
      bg: COLOR_SUCCESS,
      icon: <CheckCircle className="w-4 h-4 mr-1" />,
      label: "Contacted",
    },
    Rejected: {
      bg: COLOR_DANGER,
      icon: <AlertTriangle className="w-4 h-4 mr-1" />,
      label: "Rejected",
    },
  };
  const s = map[status];
  return (
    <span
      className="flex items-center px-3 py-1 rounded-full font-semibold text-xs shadow-sm"
      style={{ backgroundColor: s.bg, color: "#fff" }}
    >
      {s.icon} {s.label}
    </span>
  );
};

const RequestCard = ({
  request,
  onUpdateStatus,
  actionLoading,
  onContact,
  adminName,
}: {
  request: IConsultRequest;
  onUpdateStatus: (
    id: string,
    status: "Accepted" | "Contacted" | "Rejected",
    adminName: string
  ) => void;
  actionLoading: boolean;
  onContact: (
    name: string,
    phone: string,
    id: string,
    adminName: string
  ) => void;
  adminName: string;
}) => {
  const [expanded, setExpanded] = useState(false);
  const initials = request.name?.charAt(0).toUpperCase() || "?";
  const history: IContactHistory[] = request.contactedHistory || [];

  return (
    <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-lg hover:border-blue-400 hover:scale-[1.01] transition-all duration-300 ease-in-out flex flex-col w-full max-w-sm mx-auto dark:bg-gray-800 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-lg font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            {initials}
          </div>
          <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100">
            {request.name}
          </h3>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {/* Details */}
      <div className="space-y-1 text-sm text-gray-700 mb-3 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span>{request.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span>{request.phone}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold text-gray-800 dark:text-gray-300">
            Service:
          </span>
          <span>{request.service_other || request.service}</span>
        </div>
        {request.date && (
          <div className="flex gap-2">
            <span className="font-semibold text-gray-800 dark:text-gray-300">
              Date:
            </span>
            <span>{new Date(request.date).toLocaleDateString()}</span>
          </div>
        )}
        <div className="flex gap-2">
          <span className="font-semibold text-gray-800 dark:text-gray-300">
            Mode:
          </span>
          <span>{request.mode}</span>
        </div>
      </div>

      {/* Message */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3 dark:bg-gray-700 dark:border-gray-600">
        <p
          className={`text-sm text-gray-700 dark:text-gray-300 ${
            expanded ? "" : "line-clamp-2"
          }`}
        >
          {request.message || "No message provided"}
        </p>
      </div>
      {request.message && (
        <button
          className="text-blue-600 dark:text-blue-400 text-xs font-medium mb-2"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Show Less" : "Read More"}
        </button>
      )}

      {/* History */}
      {history.length > 0 && (
        <details className="text-xs text-gray-600 dark:text-gray-400 mb-3">
          <summary className="cursor-pointer font-semibold">
            Contact History ({history.length})
          </summary>
          <ul className="mt-1 space-y-1">
            {history.map((c, i) => (
              <li key={i}>
                • Contacted by{" "}
                <span className="font-medium">{c.contactedBy}</span> on{" "}
                {new Date(c.contactedAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </details>
      )}

      {/* Actions */}
      <div className="flex justify-between gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        {request.status !== "Accepted" && request.status !== "Contacted" && (
          <button
            className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs shadow hover:bg-blue-700 transition-all"
            onClick={() => onUpdateStatus(request._id, "Accepted", adminName)}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <Loader2 className="w-4 h-4 mx-auto animate-spin" />
            ) : (
              "Accept"
            )}
          </button>
        )}
        {request.status !== "Rejected" && (
          <button
            className="flex-1 py-2 bg-red-500 text-white rounded-lg text-xs shadow hover:bg-red-600 transition-all"
            onClick={() => onUpdateStatus(request._id, "Rejected", adminName)}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <Loader2 className="w-4 h-4 mx-auto animate-spin" />
            ) : (
              "Reject"
            )}
          </button>
        )}
        <button
          className="w-9 h-9 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-all"
          onClick={() =>
            onContact(request.name, request.phone, request._id, adminName)
          }
        >
          <FaWhatsapp size={14} />
        </button>
      </div>
    </div>
  );
};

export default function AdminConsultRequests() {
  const [requests, setRequests] = useState<IConsultRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingMap, setActionLoadingMap] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<StatusType>("Pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const adminEmail = "Admin";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/consult-requests");
        const data = await res.json();
        if (data.success) setRequests(data.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

    const handleUpdateStatus = async (
    id: string,
    status: "Accepted" | "Contacted" | "Rejected",
    adminName: string
  ) => {
    setActionLoadingMap((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await fetch("/api/admin/consult-request/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, adminName }),
      });

      const data = await res.json();

      if (data.success) {
        setRequests((prev) =>
          prev.map((r) => {
            if (r._id !== id) return r;
            r.status = status;
            if (status === "Contacted") {
              r.contactedHistory = r.contactedHistory || [];
              r.contactedHistory.push({
                contactedBy: adminName,
                contactedAt: new Date(),
              });
            }
            return r;
          })
        );
      }
    } finally {
      setActionLoadingMap((prev) => ({ ...prev, [id]: false }));
    }
  };
  const handleContact = (
    name: string,
    phone: string,
    id: string,
    adminName: string
  ) => {
    const encodedMsg = encodeURIComponent(
      `Hello ${name}, we are contacting you regarding your consultation request.`
    );

    // Remove all non-digits
    let cleaned = phone.replace(/\D/g, "");

    // Remove leading 0 (if exists)
    if (cleaned.startsWith("0")) {
      cleaned = cleaned.substring(1);
    }

    // Add country code +91
    const finalNumber = `91${cleaned}`;

    window.open(`https://wa.me/${finalNumber}?text=${encodedMsg}`, "_blank");

    handleUpdateStatus(id, "Contacted", adminName);
  };

  // Compute counts per status for display
  const counts = requests.reduce<Record<StatusType, number>>(
    (acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    },
    { Pending: 0, Accepted: 0, Contacted: 0, Rejected: 0 }
  );

  const filteredRequests = requests.filter((r) => {
    const matchSearch = r.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTab = r.status === activeTab;
    const matchDate = filterDate
      ? new Date(r.date!).toLocaleDateString() ===
        new Date(filterDate).toLocaleDateString()
      : true;

    return matchSearch && matchTab && matchDate;
  });

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Page Title */}
      <h1
        className="text-4xl md:text-5xl font-extrabold mb-2 pt-8 text-center"
        style={{ color: blue }}
      >
        Consult Requests
      </h1>
      <p
        className="text-lg mb-8 border-b-2 pb-4 text-center"
        style={{ color: "var(--muted-foreground)", borderColor: "var(--border)" }}
      >
        Review and moderate user-submitted consultation requests.
      </p>

      {/* Total Counter */}
      <div className="text-center mb-6">
        <span className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold shadow">
          Total Consults: {requests.length}
        </span>
      </div>

      {/* Filters (moved above tabs) */}
      <div className="flex flex-wrap gap-3 items-center mb-5 justify-center">
        <input
          type="text"
          placeholder="Search name..."
          className="px-3 py-2 border rounded-lg text-sm shadow-sm dark:bg-gray-700 dark:text-gray-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <input
          type="date"
          className="px-3 py-2 border rounded-lg text-sm shadow-sm dark:bg-gray-700 dark:text-gray-200"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      {/* Status Tabs */}
      <div className="flex gap-4 mb-5 justify-center text-sm">
        {(["Pending", "Accepted", "Contacted", "Rejected"] as StatusType[]).map(
          (status) => (
            <div
              key={status}
              className={`px-6 py-2 font-semibold rounded-full cursor-pointer shadow transition ${
                activeTab === status
                  ? "bg-amber-400 text-blue-900"
                  : "bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
              }`}
              onClick={() => setActiveTab(status)}
            >
              {status} ({counts[status] || 0})
            </div>
          )
        )}
      </div>

      {/* Requests Grid */}
      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
      ) : filteredRequests.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No requests found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRequests.map((req) => (
            <RequestCard
              key={req._id}
              request={req}
              onUpdateStatus={handleUpdateStatus}
              actionLoading={!!actionLoadingMap[req._id]}
              onContact={handleContact}
              adminName={adminEmail}
            />
          ))}
        </div>
      )}
    </div>
  );
}
