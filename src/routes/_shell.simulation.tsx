import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PlayCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/_shell/simulation")({
  component: SimulationPage,
});

function SimulationPage() {
  const [runtime, setRuntime] = useState(4);
  const [extra, setExtra] = useState(2);
  const [tariff, setTariff] = useState(8.5);
  const [avgKW, setAvgKW] = useState(1.2);
  const [result, setResult] = useState<{ before: number; after: number; energy: number; save: number } | null>(null);

  const run = () => {
    const before = runtime * avgKW * tariff;
    const after = (runtime + extra) * avgKW * tariff;
    setResult({
      before: +before.toFixed(2),
      after: +after.toFixed(2),
      energy: +((runtime + extra) * avgKW).toFixed(2),
      save: +(before - after).toFixed(2),
    });
  };

  const chart = result ? [
    { name: "Before", cost: result.before },
    { name: "After", cost: result.after },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">What-if Simulation</h1>
        <p className="text-sm text-muted-foreground">Model tariff and runtime changes before they happen</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="card-elegant lg:col-span-1">
          <CardHeader className="pb-2"><CardTitle className="text-base">Inputs</CardTitle><CardDescription>Adjust and run</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5"><Label>Current Runtime (h/day)</Label><Input type="number" value={runtime} onChange={(e)=>setRuntime(+e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Additional Runtime (h/day)</Label><Input type="number" value={extra} onChange={(e)=>setExtra(+e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Electricity Tariff (₹/kWh)</Label><Input type="number" step="0.1" value={tariff} onChange={(e)=>setTariff(+e.target.value)} /></div>
            <div className="space-y-1.5">
              <div className="flex justify-between"><Label>Avg Load</Label><span className="text-xs text-muted-foreground">{avgKW.toFixed(2)} kW</span></div>
              <Slider value={[avgKW]} min={0.2} max={3} step={0.05} onValueChange={(v)=>setAvgKW(v[0])} />
            </div>
            <Button onClick={run} className="w-full"><PlayCircle className="mr-2 h-4 w-4"/>Run Simulation</Button>
          </CardContent>
        </Card>

        <Card className="card-elegant lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary"/><CardTitle className="text-base">Result</CardTitle></div>
            <CardDescription>Comparison of estimated daily cost</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Est. Energy" value={result ? `${result.energy} kWh` : "—"} />
              <Stat label="Est. Cost" value={result ? `₹${result.after}` : "—"} />
              <Stat label="Δ vs Current" value={result ? <span className={result.save>=0?"text-primary":"text-destructive"}>₹{result.save}</span> : "—"} />
            </div>
            <div className="rounded-lg border p-3">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chart}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-border)"/>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}/>
                  <YAxis tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}/>
                  <Tooltip contentStyle={{ background:"var(--color-popover)", border:"1px solid var(--color-border)", borderRadius:8, fontSize:12 }}/>
                  <Bar dataKey="cost" fill="var(--color-primary)" radius={[6,6,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-muted/30 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-mono text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}
