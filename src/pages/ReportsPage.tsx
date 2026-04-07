import { useState } from "react";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileBarChart, Download, Calendar, Send, Link2, FileText, FileSpreadsheet, File } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useToast } from "@/hooks/use-toast";

const reportTemplates = [
  { id: "weekly", name: "Weekly Disease Summary", desc: "Key metrics and trends from the past week" },
  { id: "monthly", name: "Monthly Outbreak Report", desc: "Comprehensive outbreak analysis with predictions" },
  { id: "district", name: "District Report", desc: "Per-district health metrics and facility data" },
];

const reportHistory = [
  { name: "Weekly Summary - Jan 15", date: "2024-01-15", type: "Weekly", format: "PDF" },
  { name: "Monthly Report - December", date: "2024-01-01", type: "Monthly", format: "PDF" },
  { name: "Kigali District Report", date: "2024-01-10", type: "District", format: "Excel" },
  { name: "Weekly Summary - Jan 8", date: "2024-01-08", type: "Weekly", format: "PDF" },
  { name: "Outbreak Analysis Q4", date: "2023-12-31", type: "Monthly", format: "PDF" },
];

export default function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [dateRange, setDateRange] = useState("7");
  const [district, setDistrict] = useState("all");
  const { toast } = useToast();

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(26, 60, 42);
    doc.text("Health Dashboard Report", 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Date Range: Last ${dateRange} days | District: ${district === "all" ? "All" : district}`, 14, 36);

    autoTable(doc, {
      startY: 44,
      head: [["Metric", "Value", "Change"]],
      body: [
        ["AI Sessions", "2,847", "+18.2%"],
        ["Active Appointments", "394", "+7.1%"],
        ["Disease Alerts", "14", "+3 new"],
        ["Registered Users", "87,432", "+2.4%"],
      ],
      headStyles: { fillColor: [26, 60, 42] },
      styles: { fontSize: 9 },
    });

    doc.save("health-report.pdf");
    toast({ title: "PDF report downloaded" });
  };

  const generateExcel = () => {
    const data = [
      { Metric: "AI Sessions", Value: 2847, Change: "+18.2%" },
      { Metric: "Active Appointments", Value: 394, Change: "+7.1%" },
      { Metric: "Disease Alerts", Value: 14, Change: "+3 new" },
      { Metric: "Registered Users", Value: 87432, Change: "+2.4%" },
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf]), "health-report.xlsx");
    toast({ title: "Excel report downloaded" });
  };

  const generateCSV = () => {
    const csv = "Metric,Value,Change\nAI Sessions,2847,+18.2%\nActive Appointments,394,+7.1%\nDisease Alerts,14,+3 new\nRegistered Users,87432,+2.4%";
    saveAs(new Blob([csv], { type: "text/csv" }), "health-report.csv");
    toast({ title: "CSV report downloaded" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Reports & Export</h1>
        <p className="text-sm text-muted-foreground">Generate, export, and schedule reports</p>
      </div>

      {/* Report templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportTemplates.map((t, i) => (
          <div
            key={t.id}
            onClick={() => setSelectedTemplate(t.id)}
            className={`bg-card rounded-lg border p-4 cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98] animate-fade-in-up ${
              selectedTemplate === t.id ? "border-accent ring-1 ring-accent" : "border-border/50"
            }`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <FileBarChart className={`h-5 w-5 mb-2 ${selectedTemplate === t.id ? "text-accent" : "text-muted-foreground"}`} />
            <h3 className="text-sm font-semibold text-foreground">{t.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
          </div>
        ))}
      </div>

      {/* Custom report builder */}
      <ChartCard title="Custom Report Builder" subtitle="Select parameters and export" delay={200}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 3 months</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">District</Label>
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                <SelectItem value="kigali">Kigali</SelectItem>
                <SelectItem value="musanze">Musanze</SelectItem>
                <SelectItem value="rubavu">Rubavu</SelectItem>
                <SelectItem value="huye">Huye</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Export Format</Label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-9 flex-1" onClick={generatePDF}>
                <File className="h-3.5 w-3.5 mr-1.5" />PDF
              </Button>
              <Button variant="outline" size="sm" className="h-9 flex-1" onClick={generateExcel}>
                <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5" />Excel
              </Button>
              <Button variant="outline" size="sm" className="h-9 flex-1" onClick={generateCSV}>
                <FileText className="h-3.5 w-3.5 mr-1.5" />CSV
              </Button>
            </div>
          </div>
        </div>
      </ChartCard>

      {/* Report history */}
      <ChartCard title="Recent Reports" delay={300}>
        <div className="divide-y divide-border/50">
          {reportHistory.map((r, i) => (
            <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileBarChart className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.date} • {r.type} • {r.format}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Button variant="ghost" size="sm" className="h-7 text-xs"><Download className="h-3 w-3 mr-1" />Download</Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs"><Link2 className="h-3 w-3 mr-1" />Share</Button>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}
