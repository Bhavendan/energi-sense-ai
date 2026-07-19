import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useCountUp } from "@/hooks/use-live";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  trend?: number;
  decimals?: number;
  accent?: "primary" | "secondary" | "warning" | "info" | "destructive";
};

const accentMap: Record<NonNullable<Props["accent"]>, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  warning: "bg-warning/15 text-warning",
  info: "bg-info/10 text-info",
  destructive: "bg-destructive/10 text-destructive",
};

export function KpiCard({ label, value, unit, icon: Icon, trend, decimals = 1, accent = "primary" }: Props) {
  const shown = useCountUp(value);
  const up = (trend ?? 0) >= 0;
  return (
    <Card className="card-elegant card-hover animate-in fade-in slide-in-from-bottom-2 duration-500 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 flex items-baseline gap-1.5 font-mono tabular-nums">
            <span className="text-3xl font-bold text-foreground">
              {shown.toFixed(decimals)}
            </span>
            <span className="text-sm font-medium text-muted-foreground">{unit}</span>
          </p>
          {trend !== undefined && (
            <div
              className={cn(
                "mt-2 inline-flex items-center gap-1 text-xs font-medium",
                up ? "text-primary" : "text-destructive",
              )}
            >
              {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(trend).toFixed(1)}% vs last hour
            </div>
          )}
        </div>
        <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", accentMap[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
