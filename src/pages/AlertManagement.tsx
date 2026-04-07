import { useState } from "react";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Bell, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Alert {
  id: string;
  title: string;
  district: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "active" | "pending" | "inactive";
  created: string;
  target: string;
}

const initialAlerts: Alert[] = [
  { id: "1", title: "Malaria surge in Rubavu", district: "Rubavu", severity: "critical", status: "active", created: "2024-01-15", target: "All users" },
  { id: "2", title: "Cholera risk - Rusizi border", district: "Rusizi", severity: "high", status: "active", created: "2024-01-14", target: "Healthcare workers" },
  { id: "3", title: "Fever cluster - Musanze", district: "Musanze", severity: "medium", status: "active", created: "2024-01-13", target: "Users in district" },
  { id: "4", title: "Respiratory infections rise", district: "Kigali", severity: "high", status: "active", created: "2024-01-12", target: "All users" },
  { id: "5", title: "Water contamination alert", district: "Karongi", severity: "critical", status: "pending", created: "2024-01-11", target: "Users in district" },
  { id: "6", title: "Dengue awareness campaign", district: "Huye", severity: "low", status: "inactive", created: "2024-01-05", target: "All users" },
];

const columns: Column<Alert>[] = [
  { key: "title", label: "Alert", render: v => <span className="font-medium">{v as string}</span> },
  { key: "district", label: "District" },
  { key: "severity", label: "Severity", render: v => <StatusBadge status={v as any} /> },
  { key: "status", label: "Status", render: v => <StatusBadge status={v as any} /> },
  { key: "created", label: "Created" },
  { key: "target", label: "Target" },
];

export default function AlertManagement() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", district: "", severity: "medium", target: "all", schedule: "now" });
  const { toast } = useToast();

  const handleCreate = () => {
    if (!form.title || !form.district) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    const newA: Alert = {
      id: String(alerts.length + 1),
      title: form.title,
      district: form.district,
      severity: form.severity as Alert["severity"],
      status: form.schedule === "now" ? "active" : "pending",
      created: new Date().toISOString().split("T")[0],
      target: form.target === "all" ? "All users" : form.target === "district" ? "Users in district" : "Healthcare workers",
    };
    setAlerts([newA, ...alerts]);
    setForm({ title: "", description: "", district: "", severity: "medium", target: "all", schedule: "now" });
    setDialogOpen(false);
    toast({ title: "Alert created successfully" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Alert Management</h1>
          <p className="text-sm text-muted-foreground">Create and manage health alerts</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground h-8">
              <Plus className="h-3.5 w-3.5 mr-1.5" />Create Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Create New Alert</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Title *</Label>
                <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Alert title" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Description</Label>
                <Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Detailed description..." rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">District *</Label>
                  <Input value={form.district} onChange={e => setForm({...form, district: e.target.value})} placeholder="e.g. Kigali" className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Severity</Label>
                  <Select value={form.severity} onValueChange={v => setForm({...form, severity: v})}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Target Audience</Label>
                  <Select value={form.target} onValueChange={v => setForm({...form, target: v})}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All users</SelectItem>
                      <SelectItem value="district">Users in district</SelectItem>
                      <SelectItem value="hcw">Healthcare workers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Schedule</Label>
                  <Select value={form.schedule} onValueChange={v => setForm({...form, schedule: v})}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="now">Send now</SelectItem>
                      <SelectItem value="later">Schedule later</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleCreate} className="w-full h-9 bg-primary hover:bg-primary/90 text-primary-foreground">Create Alert</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Active Alerts", val: alerts.filter(a => a.status === "active").length, icon: Bell, cls: "text-chart-red" },
          { label: "Critical", val: alerts.filter(a => a.severity === "critical").length, icon: AlertTriangle, cls: "text-chart-red" },
          { label: "Pending", val: alerts.filter(a => a.status === "pending").length, icon: Bell, cls: "text-chart-yellow" },
          { label: "Resolved", val: alerts.filter(a => a.status === "inactive").length, icon: CheckCircle, cls: "text-chart-green" },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-lg border border-border/50 p-3 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <s.icon className={`h-3.5 w-3.5 ${s.cls}`} />
            </div>
            <p className={`text-xl font-bold ${s.cls} tabular-nums mt-1`}>{s.val}</p>
          </div>
        ))}
      </div>

      <DataTable<Alert> data={alerts} columns={columns} title="All Alerts" searchKeys={["title", "district"]} />
    </div>
  );
}
