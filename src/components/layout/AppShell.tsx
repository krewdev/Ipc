import {
  Activity,
  Cpu,
  DraftingCompass,
  GitBranch,
  Images,
  LayoutDashboard,
  Network,
  Power,
  Radio,
  Search,
  Wrench,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useIpcStore, getProductSpec } from "@/lib/ipc/store";
import type { ProductLine, ViewId } from "@/lib/ipc/types";
import { PRODUCTS } from "@/lib/ipc/constants";
import { cn, formatPower } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CommandPalette } from "./CommandPalette";

const NAV: { id: ViewId; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "circuits", label: "Circuits", icon: Power },
  { id: "nilm", label: "NILM Engine", icon: Activity },
  { id: "load", label: "Load Mgmt", icon: Zap },
  { id: "vpp", label: "VPP / OpenADR", icon: Radio },
  { id: "tech", label: "Technician", icon: Wrench },
  { id: "prototypes", label: "Prototypes", icon: Images },
  { id: "blueprints", label: "Blueprints", icon: DraftingCompass },
  { id: "architecture", label: "Architecture", icon: GitBranch },
];

const PRODUCT_ORDER: ProductLine[] = ["R1", "R1+", "C1", "C2", "D1", "D2"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const view = useIpcStore((s) => s.view);
  const setView = useIpcStore((s) => s.setView);
  const product = useIpcStore((s) => s.product);
  const setProduct = useIpcStore((s) => s.setProduct);
  const health = useIpcStore((s) => s.health);
  const running = useIpcStore((s) => s.running);
  const start = useIpcStore((s) => s.start);
  const edge = useIpcStore((s) => s.edge);
  const setCommandOpen = useIpcStore((s) => s.setCommandOpen);
  const [mobileOpen, setMobileOpen] = useState(false);
  const spec = getProductSpec(product);

  useEffect(() => {
    start();
  }, [start]);

  const modeBadge =
    health.gridMode === "GRID"
      ? { variant: "ok" as const, label: "Grid Tied" }
      : health.gridMode === "ISLAND"
        ? { variant: "warn" as const, label: "Island Mode" }
        : health.gridMode === "FAILOVER"
          ? { variant: "danger" as const, label: "Failover" }
          : { variant: "info" as const, label: health.gridMode };

  return (
    <div className="flex min-h-dvh bg-bg">
      <CommandPalette />
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-bg-elevated lg:flex">
        <div className="flex items-center gap-3 px-4 py-5">
          <div className="flex size-9 items-center justify-center rounded-md bg-primary-soft text-accent">
            <Cpu className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold tracking-tight">xAI IPC</div>
            <div className="truncate text-[11px] text-fg-subtle">Intelligent Power Core</div>
          </div>
        </div>
        <div className="px-3 pb-2">
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="flex h-9 w-full items-center gap-2 rounded-md border border-border bg-surface px-2.5 text-left text-xs text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
          >
            <Search className="size-3.5" />
            <span className="flex-1">Search…</span>
            <kbd className="rounded border border-border px-1 font-mono text-[10px] text-fg-subtle">
              ⌘K
            </kbd>
          </button>
        </div>
        <Separator />
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3 scrollbar-thin">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150",
                  active
                    ? "bg-surface-2 text-fg"
                    : "text-fg-muted hover:bg-surface hover:text-fg",
                )}
              >
                <Icon className={cn("size-4", active ? "text-accent" : "")} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="space-y-3 p-3">
          <div className="rounded-lg border border-border bg-surface p-3">
            <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-fg-subtle">
              Product Line
            </div>
            <div className="grid grid-cols-3 gap-1">
              {PRODUCT_ORDER.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProduct(p)}
                  className={cn(
                    "h-8 rounded-sm text-[11px] font-medium transition-colors",
                    product === p
                      ? "bg-primary text-primary-fg"
                      : "bg-surface-2 text-fg-muted hover:text-fg",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="mt-2 text-[11px] text-fg-muted">
              {spec.name} · {spec.segment}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-surface p-3 text-[11px] text-fg-muted">
            <div className="flex items-center justify-between">
              <span>Edge TPU</span>
              <span className="tabular text-fg">{edge.tpuUtil.toFixed(0)}%</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span>Inference</span>
              <span className="tabular text-fg">{edge.inferenceMs.toFixed(1)} ms</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span>Sample rate</span>
              <span className="tabular text-fg">50 kHz</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-bg/90 px-3 backdrop-blur-md sm:px-5">
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <Network className="size-4 text-accent" />
              <span className="text-sm font-medium">{spec.name}</span>
              <span className="text-fg-subtle">/</span>
              <span className="text-sm text-fg-muted">{spec.voltage}</span>
            </div>
            <div className="text-sm font-medium sm:hidden">{NAV.find((n) => n.id === view)?.label}</div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden"
              onClick={() => setCommandOpen(true)}
              aria-label="Search"
            >
              <Search className="size-4" />
            </Button>
            <Badge variant={modeBadge.variant}>{modeBadge.label}</Badge>
            <Badge variant={running ? "ok" : "default"} className="hidden sm:inline-flex">
              <span
                className={cn(
                  "mr-1.5 inline-block size-1.5 rounded-full",
                  running ? "bg-ok animate-pulse" : "bg-fg-subtle",
                )}
              />
              Live
            </Badge>
            <div className="hidden tabular text-sm text-fg md:block">
              {formatPower(health.totalPowerW)}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto scrollbar-thin p-3 sm:p-5">{children}</main>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-bg/70"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-border bg-bg-elevated shadow-[var(--shadow-elevated)]">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-2">
                <Cpu className="size-5 text-accent" />
                <span className="font-semibold">xAI IPC</span>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={() => setMobileOpen(false)}>
                <X className="size-5" />
              </Button>
            </div>
            <Separator />
            <nav className="flex flex-col gap-0.5 overflow-y-auto p-3">
              {NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setView(item.id);
                      setMobileOpen(false);
                    }}
                    className={cn(
                      "flex h-11 items-center gap-3 rounded-md px-3 text-sm",
                      view === item.id ? "bg-surface-2 text-fg" : "text-fg-muted",
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
            <div className="mt-auto space-y-2 p-3">
              <div className="text-[10px] font-medium uppercase tracking-wider text-fg-subtle">
                Product
              </div>
              <div className="grid grid-cols-3 gap-1">
                {PRODUCT_ORDER.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setProduct(p)}
                    className={cn(
                      "h-9 rounded-sm text-xs font-medium",
                      product === p ? "bg-primary text-primary-fg" : "bg-surface-2 text-fg-muted",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="text-xs text-fg-muted">
                {Object.values(PRODUCTS).find((x) => x.id === product)?.name}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
