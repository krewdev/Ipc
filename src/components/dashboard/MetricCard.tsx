import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  unit,
  hint,
  trend,
  accent,
  className,
}: {
  label: string;
  value: string;
  unit?: string;
  hint?: string;
  trend?: "up" | "down" | "flat";
  accent?: "default" | "ok" | "warn" | "danger" | "primary";
  className?: string;
}) {
  const accentClass =
    accent === "ok"
      ? "text-ok"
      : accent === "warn"
        ? "text-warn"
        : accent === "danger"
          ? "text-danger"
          : accent === "primary"
            ? "text-accent"
            : "text-fg";

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="text-[11px] font-medium uppercase tracking-wider text-fg-subtle">{label}</div>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className={cn("tabular text-2xl font-semibold tracking-tight sm:text-3xl", accentClass)}>
            {value}
          </span>
          {unit ? <span className="text-sm text-fg-muted">{unit}</span> : null}
        </div>
        {hint ? (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-fg-muted">
            {trend === "up" && <span className="text-ok">▲</span>}
            {trend === "down" && <span className="text-danger">▼</span>}
            {hint}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
