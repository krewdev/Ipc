import { cn } from "@/lib/utils";

/** Outer drawing border + header strip for dense blueprint sheets */
export function SheetFrame({
  dwg,
  rev,
  title,
  standard,
  children,
  className,
  units = "MM",
  scale = "NTS",
}: {
  dwg: string;
  rev: string;
  title: string;
  standard: string;
  children: React.ReactNode;
  className?: string;
  units?: string;
  scale?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border-2 border-primary/40 bg-[#050a10]",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-primary/30 bg-[#0a121c] px-3 py-2 font-mono text-[10px]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-accent font-semibold">{dwg}</span>
          <span className="text-fg-subtle">REV {rev}</span>
          <span className="text-fg-muted">{title}</span>
        </div>
        <div className="flex gap-3 text-fg-subtle">
          <span>UNITS {units}</span>
          <span>SCALE {scale}</span>
          <span className="hidden sm:inline">{standard}</span>
        </div>
      </div>
      <div className="p-2 sm:p-3">{children}</div>
      <div className="grid grid-cols-12 border-t border-primary/30 font-mono text-[9px] text-fg-subtle">
        <div className="col-span-5 border-r border-primary/20 px-2 py-1.5 sm:col-span-4">
          xAI ENGINEERING · CONTROLLED · DO NOT SCALE
        </div>
        <div className="col-span-3 border-r border-primary/20 px-2 py-1.5">DRAWN J. YOUNG</div>
        <div className="col-span-2 border-r border-primary/20 px-2 py-1.5">2026-06-22</div>
        <div className="col-span-2 px-2 py-1.5 sm:col-span-3">SHEET 1 OF 1</div>
      </div>
    </div>
  );
}
