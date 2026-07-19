import { createFileRoute } from "@tanstack/react-router";
import { Cpu, Zap, Activity, Battery, IndianRupee, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLive } from "@/hooks/use-live";
import { LiveChartCard } from "@/components/dashboard/LiveChartCard";

export const Route = createFileRoute("/_shell/digital-twin")({
  component: DigitalTwinPage,
});

function DigitalTwinPage() {
  const { current, series } = useLive(2500);
  if (!current) return <div className="h-40 animate-pulse rounded-xl bg-muted"/>;
  const runningPct = Math.min(100, (current.power / 2000) * 100);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Digital Twin</h1>
        <p className="text-sm text-muted-foreground">Virtual replica reflecting real-time device behavior</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="card-elegant lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground pulse-glow"><Cpu className="h-5 w-5"/></div>
                <div>
                  <CardTitle className="text-lg">Appliance-01</CardTitle>
                  <CardDescription>ESP32 · PZEM-004T V3</CardDescription>
                </div>
              </div>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/15"><CheckCircle2 className="mr-1 h-3 w-3"/>Synchronized</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="energy-flow rounded-xl border bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 p-6">
              <div className="grid gap-4 sm:grid-cols-4">
                <TwinStat icon={Zap} label="Status" value={current.power > 20 ? "Running" : "Idle"} />
                <TwinStat icon={Activity} label="Power" value={`${current.power.toFixed(0)} W`} />
                <TwinStat icon={Battery} label="Today" value={`${(current.energy).toFixed(2)} kWh`} />
                <TwinStat icon={IndianRupee} label="Cost" value={`₹${((current.energy)*8.5).toFixed(1)}`} />
              </div>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                  <span>Load</span><span>{runningPct.toFixed(0)}%</span>
                </div>
                <Progress value={runningPct} className="h-2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MiniStat label="Runtime" value="3h 42m" />
              <MiniStat label="Health" value={<span className="text-primary">Optimal</span>} />
              <MiniStat label="Sync" value={<span className="text-primary">Live</span>} />
              <MiniStat label="Updated" value={new Date(current.timestamp).toLocaleTimeString()} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader className="pb-2"><CardTitle className="text-base">Health Diagnostics</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { l: "Voltage stability", v: 96 },
              { l: "Current consistency", v: 88 },
              { l: "Thermal profile", v: 92 },
              { l: "Power factor", v: Math.round(current.pf * 100) },
            ].map((x) => (
              <div key={x.l}>
                <div className="mb-1 flex justify-between text-xs"><span className="text-muted-foreground">{x.l}</span><span className="font-medium">{x.v}%</span></div>
                <Progress value={x.v} className="h-1.5"/>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <LiveChartCard title="Power Signature" data={series} dataKey="power" unit="W" color="var(--color-primary)"/>
        <LiveChartCard title="Energy Accumulation" data={series} dataKey="energy" unit="kWh" color="var(--color-secondary)"/>
      </div>
    </div>
  );
}

function TwinStat({ icon: Icon, label, value }: { icon: typeof Zap; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-background text-primary shadow-sm"><Icon className="h-4 w-4"/></div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="truncate font-mono text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}
function MiniStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-muted/30 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}
