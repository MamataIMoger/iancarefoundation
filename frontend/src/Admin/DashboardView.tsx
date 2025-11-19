"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useRecoveryProgress } from "@/hooks/useRecoveryProgress";

import {
  FileText,
  Users,
  HeartPulse,
  MessageSquare,
  TrendingUp,
  Mail,
} from "lucide-react";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// -----------------------------------------------------
// HELPERS
// -----------------------------------------------------
function mapMonthNumberToName(monthNum: number) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return months[monthNum - 1] || "Unknown";
}

function normalizeMonths(data: any[]) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const normalized = months.map((m) => ({ month: m, count: 0 }));

  data.forEach((item) => {
    const index = months.indexOf(item.month);
    if (index !== -1) {
      normalized[index].count = item.count;
    }
  });

  return normalized;
}

// -----------------------------------------------------
// CLIENT TYPE
// -----------------------------------------------------
interface Client {
  id: string;
  name: string;
  contact: string;
  joinDate: string;
  status: "Recovered" | "Under Recovery" | "New";
  program: "Drug Addict" | "Alcohol Addict" | "General";
  notes?: string;
  address?: string;
}

// ===================================================================================
// COMPONENT — FULLY RESPONSIVE
// ===================================================================================
const DashboardView: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch Dashboard Data
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard`);
        const data = await res.json();

        const transformed = {
          volunteerData: data.charts?.volunteerData?.map((item: any) => ({
            month: mapMonthNumberToName(item._id.month),
            count: item.count,
          })) || [],

          blogData: data.charts?.blogData?.map((item: any) => ({
            month: mapMonthNumberToName(item._id.month),
            engagement: item.engagement || item.count || 0,
          })) || [],

          recoveryStackData: data.charts?.recoveryStackData || null,
          clientGrowthData: data.charts?.clientGrowthData || null,
        };

        setStats(data.stats);
        setChartData(transformed);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Fetch Clients
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/clients`)
      .then((res) => res.json())
      .then((res) => setClients(res.data || []));
  }, []);

  // BLOG CHART FIXED 12 MONTHS
  const fullBlogData = useMemo(() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const map = new Map();
    chartData?.blogData?.forEach((d: any) => map.set(d.month, d.engagement));

    return months.map((m) => ({
      month: m,
      engagement: map.get(m) || 0
    }));
  }, [chartData?.blogData]);

  // CLIENT GROWTH
  const clientGrowthTrend = useMemo(() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const counts = new Array(12).fill(0);

    clients.forEach((c) => {
      const d = new Date(c.joinDate);
      const monthIndex = d.getMonth();
      counts[monthIndex] += 1;
    });

    return months.map((m, i) => ({
      month: m,
      messages: counts[i],
    }));
  }, [clients]);

  const recoveryProgressData = useRecoveryProgress(clients);

  if (loading) {
    return (
      <div className="p-10 text-center text-lg font-medium">
        Loading Dashboard...
      </div>
    );
  }

  const volunteerData = normalizeMonths(chartData?.volunteerData || []);
  const recoveryStackData = recoveryProgressData;
  const blogDataFinal = fullBlogData;
  const clientGrowthData = clientGrowthTrend;

  // ===================================================================================
  // UI — FULLY RESPONSIVE
  // ===================================================================================
  return (
    <motion.div
      className="space-y-10 px-4 sm:px-6 lg:px-8 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* HEADER */}
      <div
        className="rounded-3xl shadow-2xl relative overflow-hidden text-white py-16 sm:py-20 md:py-24 px-6 sm:px-10 text-center"
        style={{
          background: "linear-gradient(to right, var(--accent), var(--success))",
        }}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] rounded-3xl"></div>
        <div className="relative z-10 flex flex-col items-center space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-md">
            IanCare Dashboard 🌿
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-xl leading-relaxed font-medium">
            Empowering lives through wellness, compassion, and impactful care.
          </p>
        </div>
      </div>

      {/* STAT CARDS — FULLY RESPONSIVE */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Blogs Published" value={stats?.totalBlogs} icon={<FileText />} />
        <StatCard title="Active Volunteers" value={stats?.activeVolunteers} icon={<Users />} />
        <StatCard title="Clients Recovered" value={stats?.recoveredClients} icon={<HeartPulse />} />
        <StatCard title="Contact Queries" value={stats?.contactQueries} icon={<MessageSquare />} />
      </div>

      {/* RECOVERY CHART */}
      <ChartBlock title="Client Recovery Progress" icon={<HeartPulse />}>
        <BarChart data={recoveryStackData}>
          <CartesianGrid stroke="color-mix(in srgb, var(--text) 10%, transparent)" />
          <XAxis dataKey="month" stroke="var(--muted-foreground)" />
          <YAxis stroke="var(--muted-foreground)" />
          <Tooltip />
          <Legend />
          <Bar dataKey="newClients" stackId="a" fill="var(--chart-1)" />
          <Bar dataKey="ongoing" stackId="a" fill="var(--chart-2)" />
          <Bar dataKey="recovered" stackId="a" fill="var(--chart-3)" />
        </BarChart>
      </ChartBlock>

      {/* VOLUNTEER */}
      <ChartBlock title="Volunteer Growth" icon={<TrendingUp />}>
        <BarChart data={volunteerData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" stroke="var(--muted-foreground)" />
          <YAxis stroke="var(--muted-foreground)" allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="var(--chart-1)" barSize={40} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ChartBlock>

      {/* BLOG TREND */}
      <ChartBlock title="Blog Engagement Trend" icon={<FileText />}>
        <LineChart data={blogDataFinal}>
          <CartesianGrid stroke="color-mix(in srgb, var(--foreground) 10%, transparent)" />
          <XAxis dataKey="month" stroke="var(--muted-foreground)" />
          <YAxis stroke="var(--muted-foreground)" />
          <Tooltip />
          <Line dataKey="engagement" stroke="var(--chart-2)" strokeWidth={3} dot />
        </LineChart>
      </ChartBlock>

      {/* CLIENT GROWTH */}
      <ChartBlock title="Client Growth Trend" icon={<Mail />}>
        <LineChart data={clientGrowthData}>
          <CartesianGrid stroke="color-mix(in srgb, var(--foreground) 10%, transparent)" />
          <XAxis dataKey="month" stroke="var(--muted-foreground)" />
          <YAxis stroke="var(--muted-foreground)" />
          <Tooltip />
          <Line dataKey="messages" stroke="var(--chart-3)" strokeWidth={3} dot />
        </LineChart>
      </ChartBlock>
    </motion.div>
  );
};

// ===================================================================================
// REUSABLE COMPONENTS (responsive improvements included)
// ===================================================================================
const StatCard = ({ title, value, icon }: any) => (
  <motion.div
    className="p-4 sm:p-6 rounded-2xl theme-surface theme-border shadow-md"
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex justify-between items-center">
      <div>
        <div className="text-2xl sm:text-3xl font-extrabold">{value}</div>
        <p className="mt-2 text-xs sm:text-sm font-medium">{title}</p>
      </div>
      <div className="p-3 rounded-full">{icon}</div>
    </div>
  </motion.div>
);

const ChartBlock = ({ title, icon, children }: any) => (
  <div
    className="p-4 sm:p-6 rounded-2xl shadow-md relative"
    style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
  >
    <div className="flex items-center gap-2 pb-3">
      <div style={{ color: "var(--accent)" }}>{icon}</div>
      <h3 className="text-base sm:text-lg font-semibold">{title}</h3>
    </div>

    <div className="h-[250px] sm:h-[300px] md:h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);

export default DashboardView;
