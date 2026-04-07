import { Badge } from "@/components/ui/badge";

type Status = "active" | "pending" | "inactive" | "critical" | "warning" | "low" | "high" | "medium" | "green" | "yellow" | "red";

const statusStyles: Record<Status, string> = {
  active: "bg-chart-green/15 text-chart-green border-chart-green/20",
  green: "bg-chart-green/15 text-chart-green border-chart-green/20",
  pending: "bg-chart-yellow/15 text-chart-yellow border-chart-yellow/20",
  yellow: "bg-chart-yellow/15 text-chart-yellow border-chart-yellow/20",
  warning: "bg-chart-yellow/15 text-chart-yellow border-chart-yellow/20",
  medium: "bg-chart-yellow/15 text-chart-yellow border-chart-yellow/20",
  inactive: "bg-muted text-muted-foreground border-border",
  low: "bg-chart-blue/15 text-chart-blue border-chart-blue/20",
  critical: "bg-destructive/15 text-destructive border-destructive/20",
  high: "bg-chart-red/15 text-chart-red border-chart-red/20",
  red: "bg-chart-red/15 text-chart-red border-chart-red/20",
};

export function StatusBadge({ status, label }: { status: Status; label?: string }) {
  return (
    <Badge variant="outline" className={`text-[10px] font-semibold uppercase tracking-wider ${statusStyles[status]}`}>
      {label || status}
    </Badge>
  );
}
