import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRecoveryProgress } from "@/hooks/useRecoveryProgress";
import {
  Plus,
  Users,
  CheckCircle2,
  Activity,
  Search,
  Filter,
  TrendingUp,
  Calendar as CalendarIcon,
  ChevronDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { DialogDescription } from "@radix-ui/react-dialog";



 interface BarDataItem {
             program: string;
              rate: number;
              }


function FilterBar({
  query,
  setQuery,
  statusFilter,
  setStatusFilter,
  programFilter,
  setProgramFilter,
  dateFrom,
  dateTo,
  setDateFrom,
  setDateTo,
  yearFilter,
  setYearFilter,
  availableYears,
}: {
  query: string;
  setQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  programFilter: string;
  setProgramFilter: (value: string) => void;
  dateFrom: string;
  dateTo: string;
  setDateFrom: (value: string) => void;
  setDateTo: (value: string) => void;
  yearFilter: string;
  setYearFilter: (value: string) => void;
  availableYears: string[];
}) {
  const [open, setOpen] = React.useState(true);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" /> Filters
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="filters-panel"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`} />
          </Button>
        </div>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id="filters-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 w-full">
                <div className="lg:col-span-2">
                  <Label htmlFor="search" className="sr-only">
                    Search
                  </Label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden />
                    <Input
                      id="search"
                      placeholder="Search by name, ID, or contact"
                      className="pl-9 bg-card text-text border border-border placeholder-subtle focus:ring-2 focus:ring-[var(--accent)] transition-colors duration-300"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger aria-label="Select recovery status">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black dark:bg-[#1F2937] dark:text-[#F3F4F6] border border-border">
                      <SelectItem value="all" className="hover:bg-muted">
                        All
                      </SelectItem>
                      <SelectItem value="New" className="hover:bg-muted">
                        New
                      </SelectItem>
                      <SelectItem value="Under Recovery" className="hover:bg-muted">
                        Under Recovery
                      </SelectItem>
                      <SelectItem value="Recovered" className="hover:bg-muted">
                        Recovered
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs">Program</Label>
                  <Select value={programFilter} onValueChange={setProgramFilter}>
                    <SelectTrigger aria-label="Select program">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-black dark:bg-[#1F2937] dark:text-[#F3F4F6] border border-border">
                      <SelectItem value="all" className="hover:bg-muted">
                        All
                      </SelectItem>
                      <SelectItem value="Drug Addict" className="hover:bg-muted">
                        Drug Addict
                      </SelectItem>
                      <SelectItem value="Alcohol Addict" className="hover:bg-muted">
                        Alcohol Addict
                      </SelectItem>
                      <SelectItem value="General" className="hover:bg-muted">
                        General
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="from" className="text-xs">
                    From
                  </Label>
                  <div className="relative">
                    <Input
                      id="from"
                      type="date"
                      className="pr-10 bg-muted text-foreground border border-border placeholder:text-muted-foreground appearance-none px-3 py-2 rounded-md"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                    <CalendarIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="to" className="text-xs">
                    To
                  </Label>
                  <div className="relative">
                    <Input
                      id="to"
                      type="date"
                      className="pr-10 bg-muted text-foreground border border-border placeholder:text-muted-foreground appearance-none px-3 py-2 rounded-md"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                    <CalendarIcon className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Year</Label>
                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger aria-label="Select year">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card text-black dark:bg-[#1F2937] dark:text-[#F3F4F6] border border-border">
                      {availableYears.map((y: string) => (
                        <SelectItem key={y} value={y} className="hover:bg-muted">
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}


// ---- KpiCard Subcomponent ----
function KpiCard({
  title,
  value,
  change,
  icon,
  theme,
  tooltip,
}: {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  theme: keyof typeof kpiThemes;
  tooltip: string;
}) {
  const isUp = change >= 0;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{title}</p>
                <div className="text-2xl font-semibold">{value}</div>
                <div
                  className={`inline-flex items-center gap-1 text-xs ${
                    isUp ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  <span aria-hidden>{isUp ? "▲" : "▼"}</span>
                  <span>{Math.abs(Math.round(change))}% vs prev 30 days</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${kpiThemes[theme]}`} aria-hidden>
                {icon}
              </div>
            </div>
          </CardContent>
        </Card>
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs text-sm">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}


// ---- Types ----
interface Client {
  id: string;
  name: string;
  contact: string;
  joinDate: string; // ISO date
  status: "Recovered" | "Under Recovery" | "New";
  program: "Drug Addict" | "Alcohol Addict" | "General";
  notes?: string;
  address?: string;
}



// Utility to format integers with commas (en-IN)
const nf = new Intl.NumberFormat("en-IN");

// Light/Dark friendly color tokens
const kpiThemes = {
  green: "bg-[#D8F3DC] text-[#1B4332] dark:bg-[#064E3B]/40 dark:text-[#A7F3D0]",
  blue: "bg-[#D0EBFF] text-[#1C4966] dark:bg-[#1E3A8A]/40 dark:text-[#93C5FD]",
  yellow: "bg-[#FFF3BF] text-[#7B5E00] dark:bg-[#78350F]/40 dark:text-[#FCD34D]",
};

function EditClientForm({
  client,
  onClose,
  onSave,
}: {
  client: Client;
  onClose: () => void;
  onSave: (updated: Client) => void;
}) {
  const [form, setForm] = useState<Client>(client);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Validate fields like in AddClientForm
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/clients/${client.id}`,{
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update client");
      const updated = await res.json();
      onSave(updated.data || form);
      onClose();
    } catch (err) {
      console.error("Edit failed", err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
  {/* Name */}
  <Label>Name</Label>
  <Input
    value={form.name}
    onChange={(e) => setForm({ ...form, name: e.target.value })}
    placeholder="Enter full name"
  />

  {/* Contact */}
  <Label>Contact</Label>
  <Input
    value={form.contact}
    onChange={(e) => setForm({ ...form, contact: e.target.value })}
    placeholder="+91-XXXXXXXXXX"
  />

  {/* Address */}
  <Label>Address</Label>
  <Input
    value={form.address}
    onChange={(e) => setForm({ ...form, address: e.target.value })}
    placeholder="Enter full address"
  />

  {/* Join Date */}
  <Label>Join Date</Label>
  <Input
    type="date"
    value={form.joinDate}
    onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
  />

  {/* Status */}
  <Label>Status</Label>
  <Select
    value={form.status}
    onValueChange={(value) => setForm({ ...form, status: value as Client["status"] })}
  >
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="New">New</SelectItem>
      <SelectItem value="Under Recovery">Under Recovery</SelectItem>
      <SelectItem value="Recovered">Recovered</SelectItem>
    </SelectContent>
  </Select>

  {/* Program */}
  <Label>Program</Label>
  <Select
    value={form.program}
    onValueChange={(value) => setForm({ ...form, program: value as Client["program"] })}
  >
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="Program A">Program A</SelectItem>
      <SelectItem value="Program B">Program B</SelectItem>
      <SelectItem value="Program C">Program C</SelectItem>
    </SelectContent>
  </Select>

  {/* Notes */}
  <Label>Client's Condition / Problem</Label>
  <Input
    value={form.notes}
    onChange={(e) => setForm({ ...form, notes: e.target.value })}
    placeholder="Describe condition or issue"
  />

  {/* Footer */}
  <DialogFooter>
    <Button type="button" onClick={onClose}>Cancel</Button>
    <Button type="submit">Save</Button>
  </DialogFooter>
</form>
  );
}


export default function ClientsDashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const { toast } = useToast?.() || { toast: (x: any) => console.log(x) };

  const [editOpen, setEditOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);


  // Fetch clients and unwrap 'data' from backend response
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/clients`)
      .then((res) => res.json())
      .then((response) => {
        if (response && Array.isArray(response.data)) {
          setClients(response.data);
        } else {
          setClients([]);
          console.error("API returned data in unexpected format", response);
        }
      })
      .catch((err) => {
        setClients([]);
        console.error("Failed to load clients", err);
      });
  }, []);

 


  // Filters and State
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [yearFilter, setYearFilter] = useState<string>(
    new Date().getFullYear().toString()
  );

  // Available years extraction
  const availableYears = useMemo<string[]>(() => {
    const years = new Set<string>();
    clients.forEach((c) => {
      const y = new Date(c.joinDate).getFullYear().toString();
      years.add(y);
    });
    return Array.from(years).sort();
  }, [clients]);

  // Filtered clients based on UI filters
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return clients.filter((c) => {
      const inQuery =
        !q ||
        c.id.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.contact.toLowerCase().includes(q);
      const inStatus = statusFilter === "all" || c.status === statusFilter;
      const inProgram = programFilter === "all" || c.program === programFilter;
      const d = new Date(c.joinDate);
      const afterFrom = !dateFrom || d >= new Date(dateFrom + "T00:00:00");
      const beforeTo = !dateTo || d <= new Date(dateTo + "T23:59:59");
      const inYear = yearFilter === "" || d.getFullYear().toString() === yearFilter;
      return inQuery && inStatus && inProgram && afterFrom && beforeTo && inYear;
    });
  }, [clients, query, statusFilter, programFilter, dateFrom, dateTo, yearFilter]);

  // KPI counts & percent changes helper
  const kpis = useMemo(() => {
    const total = filtered.length;
    const recovered = filtered.filter((c) => c.status === "Recovered").length;
    const under = filtered.filter((c) => c.status === "Under Recovery").length;

    const pct = (a: number, b: number) => (b === 0 ? 0 : ((a - b) / b) * 100);

    const last30Cut = new Date();
    last30Cut.setDate(last30Cut.getDate() - 30);

    const last30 = filtered.filter((c) => new Date(c.joinDate) >= last30Cut).length;
    const prev30 = filtered.filter((c) => {
      const d = new Date(c.joinDate);
      return d >= new Date(last30Cut.getTime() - 30 * 86400000) && d < last30Cut;
    }).length;

    const totalChange = pct(last30, prev30);

    const recLast30 = filtered.filter((c) => c.status === "Recovered" && new Date(c.joinDate) >= last30Cut).length;
    const recPrev30 = filtered.filter((c) => {
      const d = new Date(c.joinDate);
      return c.status === "Recovered" && d >= new Date(last30Cut.getTime() - 30 * 86400000) && d < last30Cut;
    }).length;
    const recChange = pct(recLast30, recPrev30);

    const underLast30 = filtered.filter((c) => c.status === "Under Recovery" && new Date(c.joinDate) >= last30Cut).length;
    const underPrev30 = filtered.filter((c) => {
      const d = new Date(c.joinDate);
      return c.status === "Under Recovery" && d >= new Date(last30Cut.getTime() - 30 * 86400000) && d < last30Cut;
    }).length;
    const underChange = pct(underLast30, underPrev30);

    return {
      total,
      recovered,
      under,
      totalChange,
      recChange,
      underChange,
    };
  }, [filtered]);

  // Line chart data by month for selected year
  const lineData = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach((c) => {
      const d = new Date(c.joinDate);
      if (d.getFullYear().toString() !== yearFilter) return;

      const monthKey = `${yearFilter}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      map.set(monthKey, (map.get(monthKey) || 0) + 1);
    });

    return Array.from({ length: 12 }, (_, i) => {
      const key = `${yearFilter}-${String(i + 1).padStart(2, "0")}`;
      return { period: key, joined: map.get(key) || 0 };
    });
  }, [filtered, yearFilter]);

  // Pie chart data (Recovery status distribution)
  const pieData = useMemo(() => {
    return [
      { name: "Recovered", value: filtered.filter((c) => c.status === "Recovered").length },
      { name: "Under Recovery", value: filtered.filter((c) => c.status === "Under Recovery").length },
      { name: "New", value: filtered.filter((c) => c.status === "New").length },
    ];
  }, [filtered]);

  // ----- Dynamic Stacked Bar Chart: Recovery Progress -----
const recoveryProgressData = useRecoveryProgress(filtered);


  // barData calculation: recovery rate per program
const programs = ["Drug Addict", "Alcohol Addict", "General"] as const;

  const barData = useMemo(() => {
  return programs.map((p) => {
    const clientsInProgram = filtered.filter((c) => c.program === p);
    const recoveredCount = clientsInProgram.filter(
      (c) => c.status === "Recovered"
    ).length;
    const rate =
      clientsInProgram.length > 0
        ? Math.round((recoveredCount / clientsInProgram.length) * 100)
        : 0;
    return { program: p, rate };
  });
}, [filtered]);

   const barColors = ["#1E3A8A", "#3B82F6", "#93C5FD"];

  // Add Client Dialog State
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    joinDate: new Date().toISOString().slice(0, 10),
    status: "New" as Client["status"],
    program: "Drug Addict" as Client["program"],
    notes: "",
    address: "",
  });

  // View Client Modal State
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  // Handle Add Client Form Submission
  async function handleAddClient(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return reportFormError("Name is required");
    if (!/^[0-9+\-() x]{8,}$/.test(form.contact)) return reportFormError("Contact number looks invalid");
    if (!form.joinDate) return reportFormError("Join date is required");

    const newClient: Client = {
      id: `CL-${Math.floor(1000 + Math.random() * 9000)}`,
      name: form.name.trim(),
      contact: form.contact.trim(),
      joinDate: form.joinDate,
      status: form.status,
      program: form.program,
      address: form.address?.trim() || "",
      notes: form.notes?.trim() || "",
    };

    let res: Response | null = null;
    try {
        res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });
if (!res.ok) {
      const backendError = await res.text();
      console.error("🔥 Backend Error:", backendError);
      throw new Error(backendError || "Failed to save client");
    }
      const saved = await res.json();
      setClients((prev) => [saved.data || newClient, ...prev]);
      setOpen(false);
      setForm({
        name: "",
        contact: "",
        joinDate: new Date().toISOString().slice(0, 10),
        status: "New",
        program: "Drug Addict",
        notes: "",
        address: "",
      });
      toast?.({
        title: "Client added",
        description: `${saved.data?.name || newClient.name} (${saved.data?.id || newClient.id}) has been saved.`,
      });
    } catch (err) {
    console.error("❌ Add Client Failed:", err);
    reportFormError("Could not save client");
  }
  }

  async function handleDelete(client: Client) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/clients/${client.id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Delete failed");

    setClients((prev) => prev.filter((c) => c.id !== client.id));

    toast?.({
      title: "Client Deleted",
      description: `${client.name} has been removed.`,
    });
  } catch (err) {
    console.error("❌ Delete failed", err);
    toast?.({
      title: "Error",
      description: "Could not delete client",
    });
  }
}

  function reportFormError(message: string) {
    toast?.({
      title: "Check the form",
      description: message,
    });
  }

  // Smart insights messages
  const insights = useMemo(() => {
    const recoveryRate = filtered.length
      ? Math.round((filtered.filter((c) => c.status === "Recovered").length / filtered.length) * 100)
      : 0;

    const messageA = `Recovery rate is ${recoveryRate}% for current filters.`;

    const last30Cut = new Date();
    last30Cut.setDate(last30Cut.getDate() - 30);
    const underLast30 = filtered.filter(
      (c) => c.status === "Under Recovery" && new Date(c.joinDate) >= last30Cut
    );
    const messageB = underLast30.length
      ? `Follow up with ${underLast30.length} clients under recovery from the last 30 days.`
      : `Great! No under-recovery clients joined in the last 30 days within current filters.`;

    const delta = Math.round(kpis.totalChange);
    const messageC = `${delta >= 0 ? "▲" : "▼"} Clients joined changed ${Math.abs(delta)}% vs previous 30 days.`;

    return [messageA, messageB, messageC];
  }, [filtered, kpis.totalChange]);

  // JSX for rendering starts here
  return (
    <TooltipProvider>
      <div className="min-h-screen w-full bg-background text-text transition-colors duration-300">
        <div className="mx-auto max-w-[1400px] p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-6 text-center md:text-left">
            <div className="w-full text-center mt-8 mb-6">
              <h1 className="text-5xl font-extrabold text-[#005691] dark:text-[#005691] mb-2">
                Clients Manager
              </h1>
              <p className="text-sm text-muted-foreground">
                Track joins, recoveries, and program performance
              </p>
            </div>

            {/* Quick Add Button */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#004AAD] hover:bg-[#003580] text-white font-bold tracking-wide shadow-md hover:shadow-lg transition-all duration-200 dark:bg-[#A5D8FF] dark:text-[#0A0A0A]">
                  <Plus className="w-4 h-4 text-white dark:text-[#0A0A0A]" />
                  <span className="text-white dark:text-[#0A0A0A] font-semibold">Add Client</span>
                </Button>
              </DialogTrigger>
              <AddClientForm form={form} setForm={setForm} onSubmit={handleAddClient} onClose={() => setOpen(false)}/>
            </Dialog>
          </div>

          {/* Filters */}
          <FilterBar
            query={query}
            setQuery={setQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            programFilter={programFilter}
            setProgramFilter={setProgramFilter}
            dateFrom={dateFrom}
            dateTo={dateTo}
            setDateFrom={setDateFrom}
            setDateTo={setDateTo}
            yearFilter={yearFilter}
            setYearFilter={setYearFilter}
            availableYears={availableYears}
          />

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <KpiCard
              title="Total Clients Joined"
              value={nf.format(kpis.total)}
              change={kpis.totalChange}
              icon={<Users className="w-5 h-5" />}
              theme="green"
              tooltip="Total number of clients matching current filters"
            />
            <KpiCard
              title="Clients Recovered"
              value={nf.format(kpis.recovered)}
              change={kpis.recChange}
              icon={<CheckCircle2 className="w-5 h-5" />}
              theme="blue"
              tooltip="Clients with status Recovered"
            />
            <KpiCard
              title="Clients Under Recovery"
              value={nf.format(kpis.under)}
              change={kpis.underChange}
              icon={<Activity className="w-5 h-5" />}
              theme="yellow"
              tooltip="Clients still under recovery"
            />
          </div>

          {/* Charts */}
          {/* 🔥 Recovery Progress Stacked Bar Chart — PLACE HERE */}
<Card className="col-span-1 lg:col-span-3 mt-6 bg-white dark:bg-[#111827] border border-gray-300 dark:border-gray-700 shadow-sm">
  <CardHeader>
    <CardTitle className="text-base font-semibold flex items-center gap-2">
      <Users className="w-4 h-4 text-[#005691]" />
      Client Recovery Progress
    </CardTitle>
  </CardHeader>

  <CardContent className="h-80">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={recoveryProgressData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis allowDecimals={false} />
        <ReTooltip />
        <Legend />

        <Bar dataKey="newClients" stackId="stack" fill="#FF6A00" name="New Clients" />
        <Bar dataKey="ongoing" stackId="stack" fill="#0CA678" name="Ongoing" />
        <Bar dataKey="recovered" stackId="stack" fill="#0B7285" name="Recovered" />
      </BarChart>
    </ResponsiveContainer>
  </CardContent>
</Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {/* Pie Chart */}
            <Card className="bg-[#FFFFFF] dark:bg-[#111827] border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Recovery Status Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <ReTooltip />
                    <Legend />
                    <Pie data={pieData} nameKey="name" dataKey="value" outerRadius={90}>
                      {pieData.map((_, idx) => {
                        const pieColors = ["#3B82F6", "#FCD34D", "#A5D8FF"];
                        return <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />;
                      })}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Line Chart */}
            <Card className="lg:col-span-2 bg-card border border-border shadow-sm transition-colors duration-300">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Clients Joined Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={lineData}
                    margin={{ top: 10, right: 20, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="period"
                      tickFormatter={(month) => {
                        const m = parseInt(month.split("-")[1], 10);
                        return [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                          "Sep",
                          "Oct",
                          "Nov",
                          "Dec",
                        ][m - 1];
                      }}
                    />
                    <YAxis allowDecimals={false} />
                    <ReTooltip />
                    <Line type="monotone" dataKey="joined" dot />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4
 mt-4">
            {/* Bar Chart */}           
            
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Recovery Rate by Program</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="program" />
                    <YAxis unit="%" domain={[0, 100]} />
                    <ReTooltip />
                <Bar dataKey="rate" name="Recovery Rate">
                  {barData.map((_entry: BarDataItem, idx: number) => {
                    const barColors = ["#1E3A8A", "#3B82F6", "#93C5FD"];
                    return <Cell key={`cell-${idx}`} fill={barColors[idx % barColors.length]} />;
                  })}
                </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Smart Insights */}
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Smart Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  {insights.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span
                        className="mt-0.5 inline-block h-2 w-2 rounded-full bg-primary"
                        aria-hidden
                      />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Client Table */}
          <Card className="mt-6">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold mx-auto text-[#005691] dark:text-[#A5D8FF]">
                Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PaginatedTable
                data={filtered}
                setSelectedClient={setSelectedClient}
                setViewOpen={setViewOpen}
                setEditingClient={setEditingClient}
                setEditOpen={setEditOpen}
                handleDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </div>

        {/* Floating Action Button */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="fixed bottom-5 right-5 h-12 w-12 rounded-full shadow-lg md:hidden"
              aria-label="Add Client"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </DialogTrigger>
          <AddClientForm form={form} setForm={setForm} onSubmit={handleAddClient} onClose={() => setOpen(false)}/>
        </Dialog>

        {/* View Client Modal */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="max-w-2xl bg-white dark:bg-[#1F2937] text-black dark:text-[#F3F4F6] border border-border shadow-lg rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[#005691] dark:text-[#A5D8FF]">
                Client Profile
              </DialogTitle>
            </DialogHeader>
              
            <DialogDescription asChild>
            {selectedClient && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-muted dark:bg-[#111827] rounded-md">
                {/* Image */}
                <div className="md:col-span-1 flex justify-center items-start">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      selectedClient.name
                    )}&background=005691&color=fff&rounded=true`}
                    alt="Client"
                    className="w-32 h-32 rounded-full object-cover border border-border shadow-md"
                  />
                </div>

                {/* Info */}
                <div className="md:col-span-2 space-y-3 text-sm">
                  <p>
                    <span className="font-semibold text-muted-foreground">ID:</span>{" "}
                    {selectedClient.id}
                  </p>
                  <p>
                    <span className="font-semibold text-muted-foreground">
                      Name:
                    </span>{" "}
                    {selectedClient.name}
                  </p>
                  <p>
                    <span className="font-semibold text-muted-foreground">
                      Contact:
                    </span>{" "}
                    {selectedClient.contact}
                  </p>
                  <p>
                    <span className="font-semibold text-muted-foreground">
                      Address:
                    </span>{" "}
                    {selectedClient.address || "—"}
                  </p>
                    <Label className="block mb-1 text-muted-foreground">
                      Condition Notes
                    </Label>
                    <textarea
                      value={selectedClient.notes || ""}
                      readOnly
                      rows={3}
                      className="w-full bg-background text-foreground border border-border rounded-md p-2 resize-none"
                    />
                </div>
              </div>
            )}
            </DialogDescription>
          </DialogContent>
        </Dialog>
          
          {/* Edit Client Modal */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Client</DialogTitle>
    </DialogHeader>
    <DialogDescription asChild>
    {editingClient && (
      <EditClientForm
        client={editingClient}
        onClose={() => setEditOpen(false)}
        onSave={(updatedClient) => {
          setClients((prev) =>
            prev.map((c) => (c.id === updatedClient.id ? updatedClient : c))
          );
        }}
      />
    )}
    </DialogDescription>
  </DialogContent>
</Dialog>
      </div>
    </TooltipProvider>
  );
}

// ---- AddClientForm Subcomponent ----
function AddClientForm({
  form,
  setForm,
  onSubmit,
  onClose,
}: {
  form: any;
  setForm: any;
  onSubmit: any;
  onClose: () => void;
}) {
  return (
    <DialogContent className="max-w-lg bg-card text-card-foreground border border-border dark:bg-[#1F2937] dark:text-[#F3F4F6] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <DialogDescription asChild>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label htmlFor="name" className="block mb-2">
                Name
              </Label>
              <Input
                id="name"
                className="bg-muted text-foreground border border-border placeholder-subtle mb-2"
                value={form.name}
                onChange={(e) => setForm((s: any) => ({ ...s, name: e.target.value }))}
                placeholder="Enter full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="contact" className="block mb-2">
                Contact
              </Label>
              <Input
                id="contact"
                className="bg-muted text-foreground border border-border placeholder-subtle mb-2"
                value={form.contact}
                onChange={(e) => setForm((s: any) => ({ ...s, contact: e.target.value }))}
                placeholder="+91-XXXXXXXXXX"
                required
              />
            </div>

            <div>
              <Label htmlFor="address" className="block mb-2">
                Address
              </Label>
              <Input
                id="address"
                value={form.address || ""}
                onChange={(e) => setForm((s: any) => ({ ...s, address: e.target.value }))}
                placeholder="Enter full address"
                className="bg-muted text-foreground border border-border placeholder-subtle mb-2"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="joinDate" className="block mb-2">
                  Join Date
                </Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={form.joinDate}
                  onChange={(e) => setForm((s: any) => ({ ...s, joinDate: e.target.value }))}
                  className="bg-muted text-foreground border border-border placeholder-subtle mb-2"
                  required
                />
              </div>

              <div>
                <Label className="block mb-2">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((s: any) => ({ ...s, status: v }))}
                >
                  <SelectTrigger className="bg-muted text-foreground border border-border mb-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Under Recovery">Under Recovery</SelectItem>
                    <SelectItem value="Recovered">Recovered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="block mb-2">Program</Label>
              <Select
                value={form.program}
                onValueChange={(v) => setForm((s: any) => ({ ...s, program: v }))}
              >
                <SelectTrigger className="bg-muted text-foreground border border-border mb-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Drug Addict">Drug Addict</SelectItem>
                  <SelectItem value="Alcohol Addict">Alcohol Addict</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes" className="block mb-2">
                Client's Condition / Problem
              </Label>
              <Input
                id="notes"
                value={form.notes || ""}
                onChange={(e) => setForm((s: any) => ({ ...s, notes: e.target.value }))}
                placeholder="Describe condition or issue"
                className="bg-muted text-foreground border border-border placeholder-subtle mb-2"
              />
            </div>
          </div>
          </DialogDescription>

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
    </DialogContent>
  );
}


function PaginatedTable({
  data,
  setSelectedClient,
  setViewOpen,
  setEditingClient,
  setEditOpen,
  handleDelete,
}: {
  data: Client[];
  setSelectedClient: (client: Client) => void;
  setViewOpen: (open: boolean) => void;
  setEditingClient: (client: Client) => void;
  setEditOpen: (open: boolean) => void;
  handleDelete: (client: Client) => void;
}) {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [pageSize, data.length, page, totalPages]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  return (
    <div className="w-full">

      {/* ============================
          DESKTOP TABLE (md and up)
      ============================ */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-border w-full">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[12%]">ID</TableHead>
              <TableHead className="w-[12%]">Name</TableHead>
              <TableHead className="w-[12%]">Contact</TableHead>
              <TableHead className="w-[12%]">Join Date</TableHead>
              <TableHead className="w-[12%]">Status</TableHead>
              <TableHead className="w-[12%]">Program</TableHead>
              <TableHead className="w-[12%]">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {pageData.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.id}</TableCell>
                <TableCell>{client.name}</TableCell>
                <TableCell>
                  <a href={`tel:${client.contact}`} className="underline">
                    {client.contact}
                  </a>
                </TableCell>
                <TableCell>{new Date(client.joinDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <StatusBadge status={client.status} />
                </TableCell>
                <TableCell>{client.program}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedClient(client);
                        setViewOpen(true);
                      }}
                    >
                      View
                    </Button>

                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setEditingClient(client);
                        setEditOpen(true);
                      }}
                    >
                      Edit
                    </Button>

                    <AlertDialog>
  <AlertDialogTrigger asChild>
    <Button size="sm" variant="destructive">
      Delete
    </Button>
  </AlertDialogTrigger>

  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete Client?</AlertDialogTitle>
      <AlertDialogDescription>
        Are you sure you want to delete <strong>{client.name}</strong>?  
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        className="bg-red-600 hover:bg-red-700"
        onClick={() => handleDelete(client)}
      >
        Yes, Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ============================
          MOBILE CARDS (only < md)
      ============================ */}
      <div className="md:hidden space-y-4">
        {pageData.map((client) => (
          <div
            key={client.id}
            className="p-4 bg-card border border-border rounded-xl shadow"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">{client.name}</h3>
              <StatusBadge status={client.status} />
            </div>

            <div className="mt-3 space-y-1 text-sm">
              <p><strong>ID:</strong> {client.id}</p>
              <p>
                <strong>Contact:</strong>{" "}
                <a href={`tel:${client.contact}`} className="underline">
                  {client.contact}
                </a>
              </p>
              <p><strong>Joined:</strong> {new Date(client.joinDate).toLocaleDateString()}</p>
              <p><strong>Program:</strong> {client.program}</p>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedClient(client);
                  setViewOpen(true);
                }}
              >
                View
              </Button>

              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setEditingClient(client);
                  setEditOpen(true);
                }}
              >
                Edit
              </Button>

              <AlertDialog>
  <AlertDialogTrigger asChild>
    <Button size="sm" variant="destructive">
      Delete
    </Button>
  </AlertDialogTrigger>

  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete Client?</AlertDialogTitle>
      <AlertDialogDescription>
        Are you sure you want to delete <strong>{client.name}</strong>?  
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        className="bg-red-600 hover:bg-red-700"
        onClick={() => handleDelete(client)}
      >
        Yes, Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

            </div>
          </div>
        ))}
      </div>

      {/* ============================
          Pagination Controls
      ============================ */}
      <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows:</span>
          <Select value={String(pageSize)} onValueChange={(v) => setPageSize(parseInt(v))}>
            <SelectTrigger className="h-8 w-[88px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}


function StatusBadge({ status }: { status: Client["status"] }) {
  const intent =
    status === "Recovered"
      ? "bg-[#D8F3DC] text-[#1B4332] dark:bg-[#2D6A4F]/50 dark:text-[#B7E4C7]"
      : status === "Under Recovery"
      ? "bg-[#FFF3BF] text-[#7B5E00] dark:bg-[#4B3900]/50 dark:text-[#FFD43B]"
      : "bg-[#D0EBFF] text-[#1C4966] dark:bg-[#1B3A57]/50 dark:text-[#A5D8FF]";
  return <Badge className={`${intent} border-0`}>{status}</Badge>;
}
