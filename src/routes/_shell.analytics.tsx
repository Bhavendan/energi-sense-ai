import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart, BarChart, Bar } from "recharts";
import { generateHourly, generateDaily, generateMonthly } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const [range, setRange] = useState<"today"|"week"|"month"|"custom">("today");
  const hourly = useMemo(() => generateHourly(), []);
  const daily = useMemo(() => generateDaily(7), []);
  const monthly = useMemo(() => generateMonthly(), []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Historical Analytics</h1>
          <p className="text-sm text-muted-foreground">Trends across power, energy and cost</p>
        </div>
        <Tabs value={range} onValueChange={(v)=>setRange(v as typeof range)}>
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="card-elegant">
          <CardHeader className="pb-2"><CardTitle className="text-base">Hourly Power</CardTitle><CardDescription>Last 24 hours</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={hourly}>
                <defs><linearGradient id="ah" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.4}/><stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-border)"/>
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} interval={2}/>
                <YAxis tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}/>
                <Tooltip contentStyle={{ background:"var(--color-popover)", border:"1px solid var(--color-border)", borderRadius:8, fontSize:12 }}/>
                <Area type="monotone" dataKey="power" stroke="var(--color-primary)" strokeWidth={2} fill="url(#ah)"/>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader className="pb-2"><CardTitle className="text-base">Daily Energy</CardTitle><CardDescription>Last 7 days</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={daily}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-border)"/>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}/>
                <YAxis tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}/>
                <Tooltip contentStyle={{ background:"var(--color-popover)", border:"1px solid var(--color-border)", borderRadius:8, fontSize:12 }}/>
                <Bar dataKey="energy" fill="var(--color-secondary)" radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader className="pb-2"><CardTitle className="text-base">Monthly Energy</CardTitle><CardDescription>Year-to-date</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthly}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-border)"/>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}/>
                <YAxis tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}/>
                <Tooltip contentStyle={{ background:"var(--color-popover)", border:"1px solid var(--color-border)", borderRadius:8, fontSize:12 }}/>
                <Line type="monotone" dataKey="energy" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 3 }}/>
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Bill Trend</CardTitle>
              <Badge variant="outline">₹8.5/kWh</Badge>
            </div>
            <CardDescription>Monthly billing history</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthly}>
                <defs><linearGradient id="ab" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-warning)" stopOpacity={0.4}/><stop offset="100%" stopColor="var(--color-warning)" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--color-border)"/>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}/>
                <YAxis tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}/>
                <Tooltip contentStyle={{ background:"var(--color-popover)", border:"1px solid var(--color-border)", borderRadius:8, fontSize:12 }}/>
                <Area type="monotone" dataKey="bill" stroke="var(--color-warning)" strokeWidth={2} fill="url(#ab)"/>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
