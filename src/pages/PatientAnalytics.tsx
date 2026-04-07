import { KPICard } from "@/components/dashboard/KPICard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { Users, UserCheck, Activity, Heart } from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const ageData = [
  { range: "0-14", count: 18432 },
  { range: "15-24", count: 22187 },
  { range: "25-34", count: 19876 },
  { range: "35-44", count: 12543 },
  { range: "45-54", count: 8234 },
  { range: "55-64", count: 4123 },
  { range: "65+", count: 2037 },
];

const genderData = [
  { name: "Female", value: 54.3, color: "hsl(199, 80%, 55%)" },
  { name: "Male", value: 45.7, color: "hsl(155, 45%, 18%)" },
];

interface SymptomRow {
  symptom: string;
  count: number;
  trend: "up" | "down" | "stable";
  change: string;
}

const symptomData: SymptomRow[] = [
  { symptom: "Fever", count: 4521, trend: "up", change: "+12.3%" },
  { symptom: "Cough", count: 3876, trend: "up", change: "+8.7%" },
  { symptom: "Headache", count: 3201, trend: "stable", change: "+0.4%" },
  { symptom: "Fatigue", count: 2987, trend: "down", change: "-3.2%" },
  { symptom: "Diarrhea", count: 2143, trend: "up", change: "+15.1%" },
  { symptom: "Nausea", count: 1876, trend: "stable", change: "+1.0%" },
  { symptom: "Body aches", count: 1654, trend: "down", change: "-5.4%" },
  { symptom: "Chest pain", count: 987, trend: "up", change: "+22.3%" },
  { symptom: "Difficulty breathing", count: 743, trend: "up", change: "+18.9%" },
  { symptom: "Skin rash", count: 432, trend: "down", change: "-7.1%" },
];

const symptomColumns: Column<SymptomRow>[] = [
  { key: "symptom", label: "Symptom", render: v => <span className="font-medium">{v as string}</span> },
  { key: "count", label: "Count", render: v => <span className="tabular-nums font-medium">{(v as number).toLocaleString()}</span> },
  { key: "trend", label: "Trend", render: v => {
    const t = v as string;
    return <span className={`text-xs font-medium ${t === "up" ? "text-chart-red" : t === "down" ? "text-chart-green" : "text-chart-yellow"}`}>
      {t === "up" ? "↑ Rising" : t === "down" ? "↓ Declining" : "→ Stable"}
    </span>;
  }},
  { key: "change", label: "% Change", render: v => {
    const val = v as string;
    const isUp = val.startsWith("+") && parseFloat(val) > 1;
    return <span className={`text-xs tabular-nums ${isUp ? "text-chart-red" : "text-chart-green"}`}>{val}</span>;
  }},
];

export default function PatientAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Patient Analytics</h1>
        <p className="text-sm text-muted-foreground">User demographics and health metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Users" value="87,432" change="2.4%" changeType="up" icon={Users} colorClass="bg-kpi-users" delay={0} />
        <KPICard title="Appt. Fulfillment" value="78.3%" change="4.1%" changeType="up" icon={UserCheck} colorClass="bg-kpi-sessions" delay={80} />
        <KPICard title="Active This Week" value="23,891" change="11.2%" changeType="up" icon={Activity} colorClass="bg-kpi-appointments" delay={160} />
        <KPICard title="Med. Adherence" value="71.6%" change="1.8%" changeType="up" icon={Heart} colorClass="bg-kpi-alerts" delay={240} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Age Distribution" subtitle="Registered app users" delay={300}>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 12%, 88%)" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: "hsl(155, 10%, 45%)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(155, 10%, 45%)" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(150, 12%, 88%)" }} />
                <Bar dataKey="count" fill="hsl(199, 80%, 55%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Gender Breakdown" delay={400}>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genderData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" stroke="none">
                  {genderData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(val: number) => `${val}%`} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <DataTable<SymptomRow> data={symptomData} columns={symptomColumns} title="Symptom Frequency" searchKeys={["symptom"]} />
    </div>
  );
}
