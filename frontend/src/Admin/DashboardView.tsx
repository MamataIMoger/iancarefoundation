'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Users,
  HeartPulse,
  MessageSquare,
  TrendingUp,
  Mail,
} from 'lucide-react';
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
} from 'recharts';

// ----------------------
// I. Dummy Stats
// ----------------------
const DUMMY_STATS = {
  totalBlogs: 145,
  activeVolunteers: 452,
  recoveredClients: 128,
  contactQueries: 76,
};

// ----------------------
// II. Reusable Stat Card
// ----------------------
const StatCard = ({ title, value, icon }: any) => (
  <motion.div
    className="p-6 rounded-2xl theme-surface theme-border theme-fade shadow-md border-l-4"
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex justify-between items-center">
      <div>
        <div className="text-3xl font-extrabold" style={{ color: 'var(--foreground)' }}>
          {value}
        </div>
        <p className="mt-2 text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
          {title}
        </p>
      </div>
      <div
        className="p-3 rounded-full shadow-sm"
        style={{ background: 'var(--accent)', color: 'var(--card)' }}
      >
        {icon}
      </div>
    </div>
  </motion.div>
);


// ----------------------
// III. Dashboard View
// ----------------------
const DashboardView: React.FC = () => {

  const volunteerData = useMemo(
    () => [
      { month: 'Jan', count: 25 },
      { month: 'Feb', count: 32 },
      { month: 'Mar', count: 40 },
      { month: 'Apr', count: 55 },
      { month: 'May', count: 61 },
      { month: 'Jun', count: 68 },
      { month: 'Jul', count: 74 },
      { month: 'Aug', count: 81 },
      { month: 'Sep', count: 92 },
      { month: 'Oct', count: 100 },
      { month: 'Nov', count: 115 },
      { month: 'Dec', count: 130 },
    ],
    []
  );

  const recoveryStackData = useMemo(
    () => [
      { month: 'Jan', newClients: 10, ongoing: 8, recovered: 5 },
      { month: 'Feb', newClients: 12, ongoing: 10, recovered: 7 },
      { month: 'Mar', newClients: 14, ongoing: 12, recovered: 9 },
      { month: 'Apr', newClients: 16, ongoing: 13, recovered: 12 },
      { month: 'May', newClients: 15, ongoing: 14, recovered: 16 },
      { month: 'Jun', newClients: 18, ongoing: 15, recovered: 20 },
      { month: 'Jul', newClients: 17, ongoing: 16, recovered: 22 },
      { month: 'Aug', newClients: 18, ongoing: 17, recovered: 25 },
      { month: 'Sep', newClients: 16, ongoing: 18, recovered: 30 },
      { month: 'Oct', newClients: 15, ongoing: 17, recovered: 34 },
      { month: 'Nov', newClients: 14, ongoing: 16, recovered: 38 },
      { month: 'Dec', newClients: 13, ongoing: 15, recovered: 42 },
    ],
    []
  );

  const blogData = useMemo(
    () => [
      { month: 'Jan', engagement: 58 },
      { month: 'Feb', engagement: 62 },
      { month: 'Mar', engagement: 70 },
      { month: 'Apr', engagement: 75 },
      { month: 'May', engagement: 68 },
      { month: 'Jun', engagement: 82 },
      { month: 'Jul', engagement: 88 },
      { month: 'Aug', engagement: 91 },
      { month: 'Sep', engagement: 95 },
      { month: 'Oct', engagement: 98 },
      { month: 'Nov', engagement: 104 },
      { month: 'Dec', engagement: 110 },
    ],
    []
  );

  const contactTrendData = useMemo(
    () => [
      { month: 'Jan', messages: 10 },
      { month: 'Feb', messages: 18 },
      { month: 'Mar', messages: 25 },
      { month: 'Apr', messages: 20 },
      { month: 'May', messages: 30 },
      { month: 'Jun', messages: 42 },
      { month: 'Jul', messages: 39 },
      { month: 'Aug', messages: 45 },
      { month: 'Sep', messages: 48 },
      { month: 'Oct', messages: 60 },
      { month: 'Nov', messages: 55 },
      { month: 'Dec', messages: 70 },
    ],
    []
  );

  // 💫 Optional: adjust banner gradient slightly per theme
const bannerGradient = 'linear-gradient(to right, var(--accent), var(--success))';

  return (
    <motion.div
      className="space-y-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* HEADER */}
      <div
        className="rounded-3xl shadow-2xl relative overflow-hidden text-white py-24 px-10"
        style={{
          background: bannerGradient,
        }}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] rounded-3xl"></div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-md">
            IanCare Dashboard 🌿
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl leading-relaxed font-medium">
            Empowering lives through wellness, compassion, and impactful care.
          </p>

        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Blogs Published" value={145} icon={<FileText />} />
        <StatCard title="Active Volunteers" value={452} icon={<Users />} />
        <StatCard title="Clients Recovered" value={128} icon={<HeartPulse />} />
        <StatCard title="Contact Queries" value={76} icon={<MessageSquare />} />
      </div>

      {/* CLIENT RECOVERY */}
      <ChartBlock title="Client Recovery Progress (Jan–Dec)" icon={<HeartPulse />}>
        <BarChart data={recoveryStackData}>
          <CartesianGrid stroke="color-mix(in srgb, var(--text) 10%, transparent)" />
          <XAxis dataKey="month" stroke="var(--muted-foreground)"/>
          <YAxis stroke="var(--muted-foreground)"/>
          <Tooltip contentStyle={{ backgroundColor: 'color-mix(in srgb, var(--card) 85%, white)', color: 'var(--card-foreground)', border: '1px solid var(--border)' }} 
            labelStyle={{ color: 'var(--muted-foreground)' }}
            itemStyle={{ color: 'var(--foreground)' }}
          />
          <Legend wrapperStyle={{
            color: 'var(--muted-foreground)',
            fontSize: '0.875rem',
            fontWeight: 500,
            }}
          />
          <Bar dataKey="newClients" stackId="a" fill="var(--chart-1)" />
          <Bar dataKey="ongoing" stackId="a" fill="var(--chart-2)" />
          <Bar dataKey="recovered" stackId="a" fill="var(--chart-3)" />
        </BarChart>
      </ChartBlock>

      {/* VOLUNTEER GROWTH */}
<ChartBlock title="Volunteer Growth (Jan–Dec)" icon={<TrendingUp />}>
  <BarChart data={volunteerData}>
    <CartesianGrid stroke="color-mix(in srgb, var(--foreground) 10%, transparent)" />
    <XAxis
      dataKey="month"
      stroke="var(--muted-foreground)"
      tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
      axisLine={{ stroke: 'color-mix(in srgb, var(--foreground) 15%, transparent)' }}
      tickLine={{ stroke: 'color-mix(in srgb, var(--foreground) 15%, transparent)' }}
    />
    <YAxis
      stroke="var(--muted-foreground)"
      tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
      axisLine={{ stroke: 'color-mix(in srgb, var(--foreground) 15%, transparent)' }}
      tickLine={{ stroke: 'color-mix(in srgb, var(--foreground) 15%, transparent)' }}
    />
    <Tooltip
      contentStyle={{
        backgroundColor: 'color-mix(in srgb, var(--card) 85%, white)',
        color: 'var(--card-foreground)',
        border: '1px solid var(--border)',
      }}
      labelStyle={{ color: 'var(--muted-foreground)' }}
      itemStyle={{ color: 'var(--foreground)' }}
    />
    <Bar dataKey="count" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
  </BarChart>
</ChartBlock>

{/* BLOG ENGAGEMENT */}
<ChartBlock title="Blog Engagement Trend (Jan–Dec)" icon={<FileText />}>
  <LineChart data={blogData}>
    <CartesianGrid stroke="color-mix(in srgb, var(--foreground) 10%, transparent)" />
    <XAxis
      dataKey="month"
      stroke="var(--muted-foreground)"
      tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
      axisLine={{ stroke: 'color-mix(in srgb, var(--foreground) 15%, transparent)' }}
      tickLine={{ stroke: 'color-mix(in srgb, var(--foreground) 15%, transparent)' }}
    />
    <YAxis
      stroke="var(--muted-foreground)"
      tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
      axisLine={{ stroke: 'color-mix(in srgb, var(--foreground) 15%, transparent)' }}
      tickLine={{ stroke: 'color-mix(in srgb, var(--foreground) 15%, transparent)' }}
    />
    <Tooltip
      contentStyle={{
        backgroundColor: 'color-mix(in srgb, var(--card) 85%, white)',
        color: 'var(--card-foreground)',
        border: '1px solid var(--border)',
      }}
      labelStyle={{ color: 'var(--muted-foreground)' }}
      itemStyle={{ color: 'var(--foreground)' }}
    />
    <Line type="monotone" dataKey="engagement" stroke="var(--chart-2)" strokeWidth={3} />
  </LineChart>
</ChartBlock>

{/* CLIENT GROWTH */}
<ChartBlock title="Client Growth Trend (Jan–Oct)" icon={<Mail />}>
  <LineChart data={contactTrendData}>
    <CartesianGrid stroke="color-mix(in srgb, var(--foreground) 10%, transparent)" />
    <XAxis
      dataKey="month"
      stroke="var(--muted-foreground)"
      tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
      axisLine={{ stroke: 'color-mix(in srgb, var(--foreground) 15%, transparent)' }}
      tickLine={{ stroke: 'color-mix(in srgb, var(--foreground) 15%, transparent)' }}
    />
    <YAxis
      stroke="var(--muted-foreground)"
      tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
      axisLine={{ stroke: 'color-mix(in srgb, var(--foreground) 15%, transparent)' }}
      tickLine={{ stroke: 'color-mix(in srgb, var(--foreground) 15%, transparent)' }}
    />
    <Tooltip
      contentStyle={{
        backgroundColor: 'color-mix(in srgb, var(--card) 85%, white)',
        color: 'var(--card-foreground)',
        border: '1px solid var(--border)',
      }}
      labelStyle={{ color: 'var(--muted-foreground)' }}
      itemStyle={{ color: 'var(--foreground)' }}
    />
    <Line type="monotone" dataKey="messages" stroke="var(--chart-3)" strokeWidth={3} />
  </LineChart>
</ChartBlock>

    </motion.div>
  );
};

// ✅ Reusable chart wrapper
const ChartBlock = ({ title, icon, children }: any) => (
  <div
    className="p-6 rounded-2xl shadow-md relative"
    style={{
      backgroundColor: 'color-mix(in srgb, var(--card) 90%, white)',
      border: '1px solid var(--border)',
    }}
  >
    <div className="flex items-center gap-2 pb-3">
      <div style={{ color: 'var(--accent)' }}>{icon}</div>
      <h3 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>{title}</h3>
    </div>
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);


export default DashboardView;
