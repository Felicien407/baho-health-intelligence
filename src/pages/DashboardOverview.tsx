import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Activity, CalendarCheck, AlertTriangle, Users, TrendingUp } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart
} from "recharts";

const sessionsData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  sessions: Math.floor(180 + Math.random() * 120 + Math.sin(i / 3) * 40),
}));

const symptomsData = [
  { symptom: "Fever", count: 1834 },
  { symptom: "Cough", count: 1562 },
  { symptom: "Headache", count: 1201 },
  { symptom: "Fatigue", count: 987 },
  { symptom: "Diarrhea", count: 743 },
];

const triageData = [
  { name: "Green (Low)", value: 62, color: "hsl(155, 55%, 42%)" },
  { name: "Yellow (Medium)", value: 28, color: "hsl(45, 93%, 58%)" },
  { name: "Red (High)", value: 10, color: "hsl(0, 72%, 55%)" },
];

interface DistrictRow {
  district: string;
  sessions: number;
  alerts: number;
  status: "active" | "warning" | "critical";
  trend: string;
}

const districtData: DistrictRow[] = [
  { district: "Kigali", sessions: 4521, alerts: 2, status: "active", trend: "+12%" },
  { district: "Musanze", sessions: 2134, alerts: 5, status: "warning", trend: "+28%" },
  { district: "Huye", sessions: 1876, alerts: 1, status: "active", trend: "+5%" },
  { district: "Rubavu", sessions: 1543, alerts: 8, status: "critical", trend: "+45%" },
  { district: "Rusizi", sessions: 1321, alerts: 3, status: "warning", trend: "+15%" },
  { district: "Nyagatare", sessions: 1198, alerts: 0, status: "active", trend: "-2%" },
  { district: "Muhanga", sessions: 987, alerts: 1, status: "active", trend: "+8%" },
  { district: "Karongi", sessions: 876, alerts: 4, status: "warning", trend: "+22%" },
];

const districtColumns: Column<DistrictRow>[] = [
  { key: "district", label: "District" },
  { key: "sessions", label: "Sessions", render: v => <span className="font-medium tabular-nums">{(v as number).toLocaleString()}</span> },
  { key: "alerts", label: "Alerts", render: v => <span className="tabular-nums">{v as number}</span> },
  { key: "status", label: "Status", render: v => <StatusBadge status={v as any} /> },
  { key: "trend", label: "Trend", render: v => {
    const val = v as string;
    const up = val.startsWith("+");
    return <span className={`text-xs font-medium ${up ? "text-chart-green" : "text-chart-red"}`}>{up ? "↑" : "↓"} {val}</span>;
  }},
];

export default function DashboardOverview() {
  const [dateRange, setDateRange] = useState("30");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Disease Overview</h1>
          <p className="text-sm text-muted-foreground">National health system activity snapshot</p>
        </div>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-40 h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 3 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="AI Sessions Today" value="2,847" change="18.2%" changeType="up" icon={Activity} colorClass="bg-kpi-sessions" delay={0} />
        <KPICard title="Active Appointments" value="394" change="7.1%" changeType="up" icon={CalendarCheck} colorClass="bg-kpi-appointments" delay={80} />
        <KPICard title="Disease Alerts" value="14" change="3 new" changeType="up" icon={AlertTriangle} colorClass="bg-kpi-alerts" delay={160} />
        <KPICard title="Registered Users" value="87,432" change="2.4%" changeType="up" icon={Users} colorClass="bg-kpi-users" delay={240} />
      </div>

      {/* Main chart */}
      <ChartCard title="AI Sessions Over Time" subtitle="Daily session count" delay={300}
        action={<div className="flex items-center gap-1.5 text-xs text-chart-green font-medium"><TrendingUp className="h-3 w-3" />+14% this month</div>}
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sessionsData}>
              <defs>
                <linearGradient id="sessionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(199, 80%, 55%)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(199, 80%, 55%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 12%, 88%)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(155, 10%, 45%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(155, 10%, 45%)" }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(150, 12%, 88%)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
              <Area type="monotone" dataKey="sessions" stroke="hsl(199, 80%, 55%)" strokeWidth={2} fill="url(#sessionGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* 2-col charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Top 5 Symptoms" subtitle="This week" delay={400}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={symptomsData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 12%, 88%)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(155, 10%, 45%)" }} tickLine={false} axisLine={false} />
                <YAxis dataKey="symptom" type="category" tick={{ fontSize: 11, fill: "hsl(155, 10%, 45%)" }} tickLine={false} axisLine={false} width={70} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(150, 12%, 88%)" }} />
                <Bar dataKey="count" fill="hsl(155, 45%, 18%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Triage Distribution" subtitle="Outcome breakdown" delay={500}>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={triageData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" stroke="none">
                  {triageData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(150, 12%, 88%)" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* District table */}
      <DataTable<DistrictRow> data={districtData} columns={districtColumns} title="Most Active Districts" pageSize={6} />
    </div>
  );
}
