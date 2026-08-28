import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useIpcStore } from "@/lib/ipc/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PowerChart() {
  const history = useIpcStore((s) => s.history);

  const data = history.map((h) => ({
    t: new Date(h.t).toLocaleTimeString([], { minute: "2-digit", second: "2-digit" }),
    Load: Math.round(h.p) / 1000,
    Solar: Math.round(h.solar) / 1000,
    Battery: Math.round(h.battery) / 1000,
    Grid: Math.round(h.grid) / 1000,
  }));

  return (
    <Card className="col-span-full">
      <CardHeader className="flex-row items-start justify-between gap-2 space-y-0">
        <div>
          <CardTitle>Real-time Power Flow</CardTitle>
          <CardDescription>Load, solar, battery, and grid exchange (kW)</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="h-64 sm:h-72">
        {data.length < 2 ? (
          <div className="flex h-full items-center justify-center text-sm text-fg-muted">
            Collecting samples…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3d9e8f" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#3d9e8f" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gSolar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c9a227" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#c9a227" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gBatt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5b8def" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#5b8def" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="t"
                tick={{ fill: "#5c6370", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                minTickGap={32}
              />
              <YAxis
                tick={{ fill: "#5c6370", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
                unit="k"
              />
              <Tooltip
                contentStyle={{
                  background: "#14171c",
                  border: "1px solid #252a33",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "#8b929e" }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, color: "#8b929e" }}
                iconType="circle"
                iconSize={8}
              />
              <Area
                type="monotone"
                dataKey="Load"
                stroke="#3d9e8f"
                fill="url(#gLoad)"
                strokeWidth={1.5}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="Solar"
                stroke="#c9a227"
                fill="url(#gSolar)"
                strokeWidth={1.5}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="Battery"
                stroke="#5b8def"
                fill="url(#gBatt)"
                strokeWidth={1.5}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="Grid"
                stroke="#8b7cf0"
                fill="transparent"
                strokeWidth={1.25}
                strokeDasharray="4 3"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
