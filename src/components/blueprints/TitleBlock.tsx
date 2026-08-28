import { cn } from "@/lib/utils";

export function TitleBlock({
  dwg,
  rev,
  title,
  scale = "NTS",
  sheet = "1 of 1",
  className,
}: {
  dwg: string;
  rev: string;
  title: string;
  scale?: string;
  sheet?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-6 overflow-hidden rounded-md border border-primary/30 bg-bg/60 font-mono text-[10px] text-accent",
        className,
      )}
    >
      <div className="col-span-3 border-r border-primary/20 p-2">
        <div className="text-[9px] uppercase tracking-wider text-fg-subtle">Drawing</div>
        <div className="mt-0.5 text-xs font-semibold text-fg">{dwg}</div>
        <div className="mt-1 line-clamp-2 text-[10px] leading-snug text-fg-muted">{title}</div>
      </div>
      <div className="border-r border-primary/20 p-2">
        <div className="text-[9px] uppercase tracking-wider text-fg-subtle">Rev</div>
        <div className="mt-1 text-sm font-semibold text-fg">{rev}</div>
      </div>
      <div className="border-r border-primary/20 p-2">
        <div className="text-[9px] uppercase tracking-wider text-fg-subtle">Scale</div>
        <div className="mt-1 text-sm font-semibold text-fg">{scale}</div>
      </div>
      <div className="p-2">
        <div className="text-[9px] uppercase tracking-wider text-fg-subtle">Sheet</div>
        <div className="mt-1 text-sm font-semibold text-fg">{sheet}</div>
      </div>
      <div className="col-span-6 flex items-center justify-between border-t border-primary/20 px-2 py-1.5 text-[9px] text-fg-subtle">
        <span>xAI Engineering · Controlled Document</span>
        <span>IPC DRAWING PACKAGE 2026</span>
      </div>
    </div>
  );
}
