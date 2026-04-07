import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
  delay?: number;
}

export function ChartCard({ title, subtitle, children, className = "", action, delay = 0 }: ChartCardProps) {
  return (
    <div
      className={`bg-card rounded-lg border border-border/50 shadow-sm opacity-0 animate-fade-in-up ${className}`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="p-4 pb-2 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="p-4 pt-2">
        {children}
      </div>
    </div>
  );
}
