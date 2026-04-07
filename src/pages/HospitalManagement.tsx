import { useState } from "react";
import { DataTable, Column } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Hospital {
  id: string;
  name: string;
  district: string;
  address: string;
  capacity: number;
  status: "active" | "pending" | "inactive";
  dataQuality: number;
  lastSync: string;
  contact: string;
}

const initialHospitals: Hospital[] = [
  { id: "1", name: "CHUK", district: "Kigali", address: "KN 4 Ave", capacity: 500, status: "active", dataQuality: 94, lastSync: "2 min ago", contact: "+250 788 123 456" },
  { id: "2", name: "King Faisal Hospital", district: "Kigali", address: "KG 544 St", capacity: 350, status: "active", dataQuality: 91, lastSync: "5 min ago", contact: "+250 788 234 567" },
  { id: "3", name: "Butaro District Hospital", district: "Burera", address: "Butaro Sector", capacity: 150, status: "active", dataQuality: 87, lastSync: "15 min ago", contact: "+250 788 345 678" },
  { id: "4", name: "Kibagabaga Hospital", district: "Kigali", address: "KG 17 Ave", capacity: 200, status: "pending", dataQuality: 72, lastSync: "2 hrs ago", contact: "+250 788 456 789" },
  { id: "5", name: "Ruhengeri Hospital", district: "Musanze", address: "Musanze Town", capacity: 180, status: "active", dataQuality: 85, lastSync: "8 min ago", contact: "+250 788 567 890" },
  { id: "6", name: "Nyanza Hospital", district: "Nyanza", address: "Nyanza Sector", capacity: 120, status: "inactive", dataQuality: 45, lastSync: "3 days ago", contact: "+250 788 678 901" },
  { id: "7", name: "Gisenyi Hospital", district: "Rubavu", address: "Rubavu Town", capacity: 160, status: "active", dataQuality: 88, lastSync: "12 min ago", contact: "+250 788 789 012" },
  { id: "8", name: "Muhima Hospital", district: "Kigali", address: "KN 87 St", capacity: 250, status: "active", dataQuality: 92, lastSync: "1 min ago", contact: "+250 788 890 123" },
];

const columns: Column<Hospital>[] = [
  { key: "name", label: "Hospital Name", render: (v) => <span className="font-medium">{v as string}</span> },
  { key: "district", label: "District" },
  { key: "capacity", label: "Capacity", render: v => <span className="tabular-nums">{v as number}</span> },
  { key: "status", label: "Status", render: v => <StatusBadge status={v as any} /> },
  { key: "dataQuality", label: "Data Quality", render: v => {
    const val = v as number;
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 bg-muted rounded-full h-1.5 overflow-hidden">
          <div className={`h-full rounded-full ${val >= 80 ? "bg-chart-green" : val >= 60 ? "bg-chart-yellow" : "bg-chart-red"}`} style={{ width: `${val}%` }} />
        </div>
        <span className="text-xs tabular-nums">{val}%</span>
      </div>
    );
  }},
  { key: "lastSync", label: "Last Sync" },
];

export default function HospitalManagement() {
  const [hospitals, setHospitals] = useState(initialHospitals);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", district: "", address: "", capacity: "", contact: "" });
  const { toast } = useToast();

  const handleAdd = () => {
    if (!form.name || !form.district) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    const newH: Hospital = {
      id: String(hospitals.length + 1),
      name: form.name,
      district: form.district,
      address: form.address,
      capacity: parseInt(form.capacity) || 0,
      status: "pending",
      dataQuality: 0,
      lastSync: "Never",
      contact: form.contact,
    };
    setHospitals([newH, ...hospitals]);
    setForm({ name: "", district: "", address: "", capacity: "", contact: "" });
    setDialogOpen(false);
    toast({ title: "Hospital added successfully" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Hospital Management</h1>
          <p className="text-sm text-muted-foreground">Manage connected hospitals and data integration</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground h-8">
              <Plus className="h-3.5 w-3.5 mr-1.5" />Add Hospital
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Add New Hospital</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Hospital Name *</Label>
                <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Kigali General Hospital" className="h-9" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">District *</Label>
                  <Input value={form.district} onChange={e => setForm({...form, district: e.target.value})} placeholder="e.g. Kigali" className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Capacity</Label>
                  <Input type="number" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} placeholder="e.g. 200" className="h-9" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Address</Label>
                <Input value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Full address" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Contact</Label>
                <Input value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} placeholder="+250 ..." className="h-9" />
              </div>
              <Button onClick={handleAdd} className="w-full h-9 bg-primary hover:bg-primary/90 text-primary-foreground">Add Hospital</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Hospitals", val: hospitals.length, cls: "text-foreground" },
          { label: "Active", val: hospitals.filter(h => h.status === "active").length, cls: "text-chart-green" },
          { label: "Pending", val: hospitals.filter(h => h.status === "pending").length, cls: "text-chart-yellow" },
          { label: "Avg Quality", val: `${Math.round(hospitals.reduce((a, h) => a + h.dataQuality, 0) / hospitals.length)}%`, cls: "text-accent" },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-lg border border-border/50 p-3 animate-fade-in-up">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className={`text-xl font-bold ${s.cls} tabular-nums`}>{s.val}</p>
          </div>
        ))}
      </div>

      <DataTable<Hospital>
        data={hospitals}
        columns={columns}
        title="Connected Hospitals"
        searchKeys={["name", "district"]}
        importable
        onImport={(data) => {
          toast({ title: `Imported ${data.length} records` });
        }}
        actions={(row) => (
          <Button variant="ghost" size="sm" className="h-7 text-xs"><Eye className="h-3 w-3 mr-1" />View</Button>
        )}
      />
    </div>
  );
}
