import { createFileRoute } from "@tanstack/react-router";
import { Cpu, Wifi, Radio, CheckCircle2, Signal, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockDevice } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/device")({
  component: DevicePage,
});

function DevicePage() {
  const d = mockDevice;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Device</h1>
        <p className="text-sm text-muted-foreground">Hardware and connectivity status</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="card-elegant card-hover">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary"><Cpu className="h-4 w-4"/></div><CardTitle className="text-base">ESP32</CardTitle></div>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/15"><CheckCircle2 className="mr-1 h-3 w-3"/>Online</Badge>
            </div>
            <CardDescription>Microcontroller</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Firmware" value={d.esp32.firmware}/>
            <Row label="Uptime" value={d.esp32.uptime}/>
            <Row label="Free heap" value="184 KB"/>
          </CardContent>
        </Card>

        <Card className="card-elegant card-hover">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><div className="grid h-9 w-9 place-items-center rounded-lg bg-secondary/15 text-secondary"><Radio className="h-4 w-4"/></div><CardTitle className="text-base">PZEM-004T</CardTitle></div>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/15"><CheckCircle2 className="mr-1 h-3 w-3"/>Online</Badge>
            </div>
            <CardDescription>Energy sensor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Version" value={d.pzem.firmware}/>
            <Row label="Last comm" value={d.pzem.lastComm} icon={<Clock className="h-3 w-3"/>}/>
            <Row label="Address" value="0x01"/>
          </CardContent>
        </Card>

        <Card className="card-elegant card-hover">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><div className="grid h-9 w-9 place-items-center rounded-lg bg-info/15 text-info"><Wifi className="h-4 w-4"/></div><CardTitle className="text-base">Wi-Fi</CardTitle></div>
              <Badge variant="outline"><Signal className="mr-1 h-3 w-3"/>{d.wifi.signal} dBm</Badge>
            </div>
            <CardDescription>{d.wifi.ssid}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <div className="mb-1 flex justify-between text-xs text-muted-foreground"><span>Signal quality</span><span className="font-medium text-foreground">{d.wifi.quality}%</span></div>
              <Progress value={d.wifi.quality} className="h-2"/>
            </div>
            <Row label="IP" value="192.168.1.42"/>
            <Row label="Gateway" value="192.168.1.1"/>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="inline-flex items-center gap-1 font-mono text-xs font-medium">{icon}{value}</span>
    </div>
  );
}
