import { useEffect } from "react";
import { Command } from "cmdk";
import {
  Activity,
  DraftingCompass,
  GitBranch,
  Images,
  LayoutDashboard,
  Power,
  Radio,
  Zap,
  AlertTriangle,
  RotateCcw,
  Sun,
  Wrench,
} from "lucide-react";
import { useIpcStore, VIEW_META, getProductSpec } from "@/lib/ipc/store";
import type { ProductLine, ViewId } from "@/lib/ipc/types";
import { PRODUCTS } from "@/lib/ipc/constants";

const ICONS: Record<ViewId, React.ElementType> = {
  overview: LayoutDashboard,
  circuits: Power,
  nilm: Activity,
  load: Zap,
  vpp: Radio,
  tech: Wrench,
  prototypes: Images,
  blueprints: DraftingCompass,
  architecture: GitBranch,
};

const PRODUCTS_ORDER: ProductLine[] = ["R1", "R1+", "C1", "C2", "D1", "D2"];

export function CommandPalette() {
  const open = useIpcStore((s) => s.commandOpen);
  const setCommandOpen = useIpcStore((s) => s.setCommandOpen);
  const setView = useIpcStore((s) => s.setView);
  const setProduct = useIpcStore((s) => s.setProduct);
  const simulateBlackout = useIpcStore((s) => s.simulateBlackout);
  const restoreGrid = useIpcStore((s) => s.restoreGrid);
  const triggerDemandEvent = useIpcStore((s) => s.triggerDemandEvent);
  const product = useIpcStore((s) => s.product);
  const health = useIpcStore((s) => s.health);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(!useIpcStore.getState().commandOpen);
      }
      if (e.key === "Escape") setCommandOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setCommandOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-3">
      <button
        type="button"
        className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
        aria-label="Close command palette"
        onClick={() => setCommandOpen(false)}
      />
      <Command
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-border bg-surface shadow-[var(--shadow-elevated)]"
        label="Command palette"
      >
        <div className="flex items-center border-b border-border px-3">
          <Command.Input
            placeholder="Jump to view, switch product, run actions…"
            className="h-12 w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg-subtle"
            autoFocus
          />
          <kbd className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle sm:inline">
            esc
          </kbd>
        </div>
        <Command.List className="max-h-80 overflow-y-auto p-2 scrollbar-thin">
          <Command.Empty className="px-3 py-6 text-center text-sm text-fg-muted">
            No matches
          </Command.Empty>

          <Command.Group heading="Navigate" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-fg-subtle">
            {VIEW_META.map((v) => {
              const Icon = ICONS[v.id];
              return (
                <Command.Item
                  key={v.id}
                  value={`${v.label} ${v.hint}`}
                  onSelect={() => setView(v.id)}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-fg aria-selected:bg-surface-2"
                >
                  <Icon className="size-4 text-accent" />
                  <div className="min-w-0 flex-1">
                    <div>{v.label}</div>
                    <div className="text-[11px] text-fg-muted">{v.hint}</div>
                  </div>
                </Command.Item>
              );
            })}
          </Command.Group>

          <Command.Group
            heading="Product line"
            className="mt-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-fg-subtle"
          >
            {PRODUCTS_ORDER.map((p) => {
              const spec = getProductSpec(p);
              return (
                <Command.Item
                  key={p}
                  value={`product ${p} ${spec.name} ${spec.segment}`}
                  onSelect={() => setProduct(p)}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm aria-selected:bg-surface-2"
                >
                  <span className="flex size-7 items-center justify-center rounded-sm bg-surface-3 font-mono text-[11px] text-accent">
                    {p}
                  </span>
                  <div>
                    <div>
                      {spec.name}
                      {product === p ? " · active" : ""}
                    </div>
                    <div className="text-[11px] text-fg-muted">
                      {spec.segment} · {spec.voltage}
                    </div>
                  </div>
                </Command.Item>
              );
            })}
          </Command.Group>

          <Command.Group
            heading="Actions"
            className="mt-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-fg-subtle"
          >
            <Command.Item
              value="fire demand response event"
              onSelect={() => {
                triggerDemandEvent();
                setCommandOpen(false);
              }}
              className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm aria-selected:bg-surface-2"
            >
              <Zap className="size-4 text-warn" />
              Fire demand response event
            </Command.Item>
            {health.gridMode === "GRID" ? (
              <Command.Item
                value="simulate blackout island"
                onSelect={() => {
                  simulateBlackout();
                  setCommandOpen(false);
                }}
                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm aria-selected:bg-surface-2"
              >
                <AlertTriangle className="size-4 text-warn" />
                Simulate blackout / island mode
              </Command.Item>
            ) : (
              <Command.Item
                value="restore grid mains"
                onSelect={() => {
                  restoreGrid();
                  setCommandOpen(false);
                }}
                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm aria-selected:bg-surface-2"
              >
                <RotateCcw className="size-4 text-ok" />
                Restore utility mains
              </Command.Item>
            )}
            <Command.Item
              value="product catalog"
              onSelect={() => setView("architecture")}
              className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm aria-selected:bg-surface-2"
            >
              <Sun className="size-4 text-accent" />
              Open product matrix
            </Command.Item>
          </Command.Group>
        </Command.List>
        <div className="border-t border-border px-3 py-2 text-[10px] text-fg-subtle">
          {Object.keys(PRODUCTS).length} SKUs · {VIEW_META.length} views · Ctrl/⌘K
        </div>
      </Command>
    </div>
  );
}
