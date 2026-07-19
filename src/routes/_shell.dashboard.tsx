import { createFileRoute } from "@tanstack/react-router";
import { Activity, Battery, Bolt, Gauge, Sigma, Waves, Cpu, Sparkles, Zap, Timer, Sun, Power, TrendingDown, AlertTriangle, CheckCircle2, IndianRupee, TrendingUp, PlayCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { LiveChartCard } from "@/components/dashboard/LiveChartCard";
import { useLive } from "@/hooks/use-live";
import { generateHourly, mockAlerts, mockRecommendations } from "@/lib/mock-data";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";

export const Route = createFileRoute("/_shell/dashboard")({
  component: DashboardPage,
});

const RATE = 8.5; // ₹/kWh
const BUDGET = 3000;

const iconMap: Record<string, typeof Timer> = { Timer, Sun, Power, TrendingDown };

function DashboardPage() {
  const { current, series } = useLive(2500);
  const hourly = useMemo(() => generateHourly(), []);
  const todayEnergy = useMemo(() => hourly.reduce((s, h) => s + h.energy, 0), [hourly]);
  const todayCost = todayEnergy * RATE;
  const monthlyBill = todayCost * 30;
  const peak = useMemo(() => hourly.reduce((m, h) => (h.power > m.power ? h : m), hourly[0]), [hourly]);

  const nextHourPred = current ? (current.power / 1000) * 1.05 : 0;
  const todayPred = todayEnergy * 1.02;

  if (!current) {
    return <div className="grid gap-4 md:grid-cols-3">{Array.from({length:6}).map((_,i)=><div key={i} className="h-28 animate-pulse rounded-xl bg-muted"/>)}</div>;
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <section>
        <div className="mb-3 flex items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold">Live Telemetry</h2>
            <p className="text-xs text-muted-foreground">Streaming from ESP32 · PZEM-004T V3</p>
          </div>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/15">Updated {new Date(current.timestamp).toLocaleTimeString()}</Badge>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <KpiCard label="Voltage" value={current.voltage} unit="V" icon={Bolt} trend={0.4} accent="primary" />
          <KpiCard label="Current" value={current.current} unit="A" icon={Activity} trend={-1.2} decimals={2} accent="secondary" />
          <KpiCard label="Power" value={current.power} unit="W" icon={Zap} trend={2.1} decimals={0} accent="warning" />
          <KpiCard label="Energy" value={current.energy} unit="kWh" icon={Battery} trend={0.8} decimals={3} accent="primary" />
          <KpiCard label="Frequency" value={current.frequency} unit="Hz" icon={Waves} decimals={2} accent="info" />
          <KpiCard label="Power Factor" value={current.pf} unit="" icon={Gauge} decimals={2} accent="secondary" />
        </div>
      </section>

      {/* Live charts */}
      <section className="grid gap-4 lg:grid-cols-2">
        <LiveChartCard title="Voltage vs Time" data={series} dataKey="voltage" unit="V" color="var(--color-primary)" />
        <LiveChartCard title="Current vs Time" data={series} dataKey="current" unit="A" color="var(--color-secondary)" />
        <LiveChartCard title="Power vs Time" data={series} dataKey="power" unit="W" color="var(--color-warning)" />
        <LiveChartCard title="Energy Consumption vs Time" data={series} dataKey="energy" unit="kWh" color="var(--color-info)" />
      </section>

      {/* Digital Twin + Prediction + Bill */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="card-elegant lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary"><Cpu className="h-4 w-4" /></div>
                <CardTitle className="text-base">Digital Twin</CardTitle>
              </div>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/15">Synced</Badge>
            </div>
            <CardDescription>Virtual replica of the connected appliance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="energy-flow rounded-lg border bg-gradient-to-r from-primary/5 via-primary/10 to-secondary/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-lg font-semibold text-primary">{current.power > 20 ? "Running" : current.power > 5 ? "Idle" : "Off"}</p>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground pulse-glow">
                  <Zap className="h-4 w-4" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Stat label="Runtime" value="3h 42m" />
              <Stat label="Today's Energy" value={`${todayEnergy.toFixed(2)} kWh`} />
              <Stat label="Today's Cost" value={`₹${todayCost.toFixed(1)}`} />
              <Stat label="Health" value={<span className="text-primary">Optimal</span>} />
              <Stat label="Sync" value={<span className="text-primary">Live</span>} />
              <Stat label="Updated" value={new Date(current.timestamp).toLocaleTimeString()} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-info/15 text-info"><Sparkles className="h-4 w-4" /></div>
              <CardTitle className="text-base">Energy Prediction</CardTitle>
            </div>
            <CardDescription>AI forecast · next hour & today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Next Hour" value={`${nextHourPred.toFixed(2)} kWh`} />
              <Stat label="Today" value={`${todayPred.toFixed(2)} kWh`} />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>Confidence</span><span className="font-medium text-foreground">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <ResponsiveContainer width="100%" height={90}>
              <LineChart data={hourly.slice(-12)}>
                <Line type="monotone" dataKey="energy" stroke="var(--color-info)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-warning/15 text-warning"><IndianRupee className="h-4 w-4" /></div>
              <CardTitle className="text-base">Electricity Bill</CardTitle>
            </div>
            <CardDescription>Current tariff ₹{RATE}/kWh</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Now" value={`₹${((current.power/1000)*RATE).toFixed(2)}/h`} />
              <Stat label="Today" value={`₹${todayCost.toFixed(0)}`} />
              <Stat label="Est. Month" value={`₹${monthlyBill.toFixed(0)}`} />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>Monthly budget ₹{BUDGET}</span>
                <span className="font-medium text-foreground">{Math.min(100, (monthlyBill/BUDGET)*100).toFixed(0)}%</span>
              </div>
              <Progress value={Math.min(100, (monthlyBill/BUDGET)*100)} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Peak + Waste + Recs */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="card-elegant lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Peak Usage Analysis</CardTitle>
              <Badge variant="outline">Peak: {peak.hour} · {peak.power} W</Badge>
            </div>
            <CardDescription>Daily load profile (24h)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={hourly} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} interval={2} />
                <YAxis tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="power" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <WasteCard power={current.power} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="card-elegant lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">AI Recommendations</CardTitle>
            <CardDescription>Actionable savings powered by your usage patterns</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {mockRecommendations.map((r) => {
              const Icon = iconMap[r.icon] ?? Sparkles;
              return (
                <div key={r.id} className="group rounded-lg border p-4 transition hover:border-primary/40 hover:bg-primary/5">
                  <div className="flex items-start gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary transition group-hover:scale-110">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{r.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{r.desc}</p>
                    </div>
                    <Badge variant="outline" className="border-primary/30 text-primary">Save {r.impact}</Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Smart Alerts</CardTitle>
              <Badge variant="outline">{mockAlerts.length} new</Badge>
            </div>
            <CardDescription>Recent anomalies & thresholds</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockAlerts.slice(0, 4).map((a) => (
              <div key={a.id} className={`flex items-start gap-3 rounded-lg border p-3 ${
                a.level === "critical" ? "border-destructive/30 bg-destructive/5" :
                a.level === "warning" ? "border-warning/30 bg-warning/5" :
                "border-info/30 bg-info/5"
              }`}>
                {a.level === "critical" ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" /> :
                 a.level === "warning" ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" /> :
                 <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-info" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.desc}</p>
                </div>
                <span className="shrink-0 text-[10px] text-muted-foreground">{a.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <WhatIfCard />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-muted/30 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function WasteCard({ power }: { power: number }) {
  const status = power > 1800 ? "critical" : power > 1200 ? "warning" : "normal";
  const cfg = {
    normal: { bg: "border-primary/30 bg-primary/5", label: "Normal", color: "text-primary", reason: "Consumption within expected range." },
    warning: { bg: "border-warning/30 bg-warning/5", label: "Warning", color: "text-warning", reason: "Elevated runtime detected in the last hour." },
    critical: { bg: "border-destructive/30 bg-destructive/5", label: "Critical", color: "text-destructive", reason: "Unexpected consumption above baseline." },
  }[status];
  return (
    <Card className={`card-elegant ${cfg.bg} border`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className={`grid h-9 w-9 place-items-center rounded-lg bg-background ${cfg.color}`}><AlertTriangle className="h-4 w-4" /></div>
          <CardTitle className="text-base">Energy Waste Detection</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Status</p>
          <Badge className={`${cfg.color} bg-background`}>{cfg.label}</Badge>
        </div>
        <p className="text-sm">{cfg.reason}</p>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg border bg-background p-2"><p className="text-muted-foreground">Standby</p><p className="font-semibold">12 W</p></div>
          <div className="rounded-lg border bg-background p-2"><p className="text-muted-foreground">Runtime</p><p className="font-semibold">3h 42m</p></div>
          <div className="rounded-lg border bg-background p-2"><p className="text-muted-foreground">Baseline</p><p className="font-semibold">1.1 kW</p></div>
        </div>
      </CardContent>
    </Card>
  );
}

function WhatIfCard() {
  const [runtime, setRuntime] = useState(4);
  const [extra, setExtra] = useState(1);
  const [tariff, setTariff] = useState(RATE);
  const [result, setResult] = useState<{ energy: number; cost: number; save: number } | null>(null);

  const run = () => {
    const kW = 1.2;
    const baseE = runtime * kW;
    const newE = (runtime + extra) * kW;
    setResult({
      energy: +newE.toFixed(2),
      cost: +(newE * tariff).toFixed(2),
      save: +((baseE - newE) * tariff).toFixed(2),
    });
  };

  const chart = result
    ? [
        { name: "Before", cost: +(runtime * 1.2 * tariff).toFixed(2) },
        { name: "After", cost: result.cost },
      ]
    : [];

  return (
    <Card className="card-elegant">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-secondary/15 text-secondary"><TrendingUp className="h-4 w-4" /></div>
          <CardTitle className="text-base">What-if Energy Simulation</CardTitle>
        </div>
        <CardDescription>Explore how usage changes impact your bill</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-1">
          <div className="space-y-1.5">
            <Label>Current Runtime (h)</Label>
            <Input type="number" value={runtime} onChange={(e)=>setRuntime(+e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Additional Runtime (h)</Label>
            <Input type="number" value={extra} onChange={(e)=>setExtra(+e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Tariff (₹/kWh)</Label>
            <Input type="number" value={tariff} step="0.1" onChange={(e)=>setTariff(+e.target.value)} />
          </div>
          <Button onClick={run} className="w-full"><PlayCircle className="mr-2 h-4 w-4"/>Run Simulation</Button>
        </div>
        <div className="lg:col-span-2 grid gap-3">
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Est. Energy" value={result ? `${result.energy} kWh` : "—"} />
            <Stat label="Est. Cost" value={result ? `₹${result.cost}` : "—"} />
            <Stat label="Savings" value={result ? <span className={result.save>=0?"text-primary":"text-destructive"}>₹{result.save}</span> : "—"} />
          </div>
          <div className="rounded-lg border p-3">
            <p className="mb-1 text-xs text-muted-foreground">Before vs After</p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={chart}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
                <YAxis tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="cost" fill="var(--color-secondary)" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// import needed at top; also using Sigma (unused now)
export { Sigma };
