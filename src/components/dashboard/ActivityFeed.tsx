import { useEffect, useState } from "react";
import { useIpcStore } from "@/lib/ipc/store";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ActivityFeed({ compact }: { compact?: boolean }) {
  const activity = useIpcStore((s) => s.activity);
  const items = compact ? activity.slice(0, 6) : activity.slice(0, 16);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Card className={cn(compact && "h-full")}>
      <CardHeader className="pb-2">
        <CardTitle>Event Log</CardTitle>
        <CardDescription>Live edge controller activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {items.length === 0 && (
          <div className="py-6 text-center text-sm text-fg-muted">
            {mounted ? "Waiting for events…" : "Connecting…"}
          </div>
        )}
        {items.map((e) => (
          <div
            key={e.id}
            className="flex gap-2.5 rounded-md border border-border bg-surface-2/60 px-2.5 py-2"
          >
            <span
              className={cn(
                "mt-1.5 size-1.5 shrink-0 rounded-full",
                e.level === "ok" && "bg-ok",
                e.level === "info" && "bg-info",
                e.level === "warn" && "bg-warn",
                e.level === "danger" && "bg-danger",
              )}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                  {e.source}
                </span>
                <span className="tabular font-mono text-[10px] text-fg-subtle" suppressHydrationWarning>
                  {mounted
                    ? new Date(e.t).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : "--:--:--"}
                </span>
              </div>
              <div className="truncate text-xs text-fg">{e.message}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
