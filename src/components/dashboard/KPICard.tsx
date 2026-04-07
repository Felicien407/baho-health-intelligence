import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: LucideIcon;
  colorClass: string;
  delay?: number;
}

export function KPICard({ title, value, change, changeType = "neutral", icon: Icon, colorClass, delay = 0 }: KPICardProps) {
  return (
    <div
      className="bg-card rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200 border border-border/50 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground animate-count-up" style={{ animationDelay: `${delay + 200}ms` }}>
            {value}
          </p>
        </div>
        <div className={`p-2.5 rounded-lg ${colorClass}`}>
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>
      {change && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span className={
            changeType === "up" ? "text-chart-green font-medium" :
            changeType === "down" ? "text-destructive font-medium" :
            "text-muted-foreground"
          }>
            {changeType === "up" ? "↑" : changeType === "down" ? "↓" : "•"} {change}
          </span>
          <span className="text-muted-foreground">vs last period</span>
        </div>
      )}
    </div>
  );
}
