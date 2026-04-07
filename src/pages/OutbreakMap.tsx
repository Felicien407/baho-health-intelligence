import { ChartCard } from "@/components/dashboard/ChartCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { AlertTriangle, TrendingUp, MapPin, Download } from "lucide-react";

const districts = [
  { name: "Kigali", risk: 82, pop: "1.7M", symptoms: ["Fever", "Cough"], trend: "rising" },
  { name: "Musanze", risk: 65, pop: "415K", symptoms: ["Diarrhea", "Fever"], trend: "rising" },
  { name: "Rubavu", risk: 78, pop: "403K", symptoms: ["Malaria", "Fever"], trend: "stable" },
  { name: "Huye", risk: 35, pop: "328K", symptoms: ["Headache", "Fatigue"], trend: "declining" },
  { name: "Rusizi", risk: 52, pop: "401K", symptoms: ["Cough", "Fever"], trend: "rising" },
  { name: "Nyagatare", risk: 22, pop: "466K", symptoms: ["Fatigue"], trend: "stable" },
  { name: "Muhanga", risk: 41, pop: "319K", symptoms: ["Fever", "Cough"], trend: "declining" },
  { name: "Karongi", risk: 58, pop: "331K", symptoms: ["Malaria", "Diarrhea"], trend: "rising" },
  { name: "Ngoma", risk: 30, pop: "337K", symptoms: ["Headache"], trend: "stable" },
  { name: "Gatsibo", risk: 45, pop: "433K", symptoms: ["Fever"], trend: "rising" },
  { name: "Kayonza", risk: 38, pop: "346K", symptoms: ["Cough"], trend: "declining" },
  { name: "Rwamagana", risk: 28, pop: "314K", symptoms: ["Fatigue", "Headache"], trend: "stable" },
];

const getRiskColor = (risk: number) => {
  if (risk >= 70) return "bg-chart-red/80";
  if (risk >= 50) return "bg-chart-yellow/80";
  if (risk >= 30) return "bg-chart-green/60";
  return "bg-chart-green/30";
};

const getRiskLabel = (risk: number) => {
  if (risk >= 70) return "High";
  if (risk >= 50) return "Medium";
  if (risk >= 30) return "Low";
  return "Minimal";
};

export default function OutbreakMap() {
  const [selectedDistrict, setSelectedDistrict] = useState<typeof districts[0] | null>(null);
  const [diseaseFilter, setDiseaseFilter] = useState("all");

  const filtered = diseaseFilter === "all" ? districts : districts.filter(d => d.symptoms.some(s => s.toLowerCase() === diseaseFilter));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Outbreak Prediction Map</h1>
          <p className="text-sm text-muted-foreground">Disease concentration and risk analysis across Rwanda</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={diseaseFilter} onValueChange={setDiseaseFilter}>
            <SelectTrigger className="w-36 h-8 text-sm"><SelectValue placeholder="Filter disease" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All diseases</SelectItem>
              <SelectItem value="fever">Fever</SelectItem>
              <SelectItem value="malaria">Malaria</SelectItem>
              <SelectItem value="cough">Cough</SelectItem>
              <SelectItem value="diarrhea">Diarrhea</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-8"><Download className="h-3.5 w-3.5 mr-1.5" />Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map grid */}
        <div className="lg:col-span-2">
          <ChartCard title="District Risk Map" subtitle="Click a district for details" delay={100}>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {filtered.map(d => (
                <button
                  key={d.name}
                  onClick={() => setSelectedDistrict(d)}
                  className={`relative p-3 rounded-lg ${getRiskColor(d.risk)} hover:ring-2 hover:ring-accent transition-all duration-200 active:scale-[0.97] ${selectedDistrict?.name === d.name ? "ring-2 ring-accent" : ""}`}
                >
                  <p className="text-xs font-semibold text-foreground truncate">{d.name}</p>
                  <p className="text-lg font-bold text-foreground tabular-nums">{d.risk}%</p>
                  <p className="text-[9px] uppercase tracking-wider text-foreground/60">{getRiskLabel(d.risk)}</p>
                </button>
              ))}
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/50">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Risk level:</span>
              {[
                { label: "Minimal", cls: "bg-chart-green/30" },
                { label: "Low", cls: "bg-chart-green/60" },
                { label: "Medium", cls: "bg-chart-yellow/80" },
                { label: "High", cls: "bg-chart-red/80" },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={`h-2.5 w-2.5 rounded-sm ${l.cls}`} />
                  <span className="text-[10px] text-muted-foreground">{l.label}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Detail panel */}
        <div>
          {selectedDistrict ? (
            <ChartCard title={selectedDistrict.name} subtitle="District Details" delay={0}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Population</p>
                    <p className="text-lg font-bold text-foreground">{selectedDistrict.pop}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Risk Score</p>
                    <p className="text-lg font-bold text-foreground">{selectedDistrict.risk}%</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-foreground mb-2">Top Symptoms</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDistrict.symptoms.map(s => (
                      <span key={s} className="px-2 py-0.5 bg-accent/15 text-accent text-[10px] font-medium rounded-full">{s}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-foreground mb-2">Trend</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className={`h-4 w-4 ${selectedDistrict.trend === "rising" ? "text-chart-red" : selectedDistrict.trend === "declining" ? "text-chart-green" : "text-chart-yellow"}`} />
                    <span className="text-sm capitalize text-foreground">{selectedDistrict.trend}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-foreground mb-2">Predicted Risk (Next 2 Weeks)</p>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${selectedDistrict.risk >= 70 ? "bg-chart-red" : selectedDistrict.risk >= 50 ? "bg-chart-yellow" : "bg-chart-green"}`}
                      style={{ width: `${Math.min(selectedDistrict.risk + 8, 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{Math.min(selectedDistrict.risk + 8, 100)}% predicted</p>
                </div>
              </div>
            </ChartCard>
          ) : (
            <div className="bg-card rounded-lg border border-border/50 shadow-sm p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
              <MapPin className="h-8 w-8 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">Select a district</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Click on the map to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
