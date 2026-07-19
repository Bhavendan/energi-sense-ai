import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockAlerts } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/alerts")({
  component: AlertsPage,
});

function AlertsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Alerts Center</h1>
          <p className="text-sm text-muted-foreground">All notifications from your device</p>
        </div>
        <Badge variant="outline"><Bell className="mr-1 h-3 w-3"/>{mockAlerts.length} alerts</Badge>
      </div>

      <div className="grid gap-3">
        {mockAlerts.map((a) => {
          const styles =
            a.level === "critical" ? { bg: "border-destructive/30 bg-destructive/5", txt: "text-destructive", Icon: AlertTriangle } :
            a.level === "warning" ? { bg: "border-warning/30 bg-warning/5", txt: "text-warning", Icon: AlertTriangle } :
            { bg: "border-info/30 bg-info/5", txt: "text-info", Icon: CheckCircle2 };
          const Icon = styles.Icon;
          return (
            <Card key={a.id} className={`card-elegant ${styles.bg} border`}>
              <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2 space-y-0">
                <div className="flex min-w-0 items-center gap-3">
                  <div className={`grid h-10 w-10 place-items-center rounded-xl bg-background ${styles.txt}`}><Icon className="h-4 w-4"/></div>
                  <div className="min-w-0">
                    <CardTitle className="truncate text-base">{a.title}</CardTitle>
                    <CardDescription className="truncate">{a.desc}</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className={styles.txt}>{a.level}</Badge>
              </CardHeader>
              <CardContent className="pt-0 text-xs text-muted-foreground">{a.time}</CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
