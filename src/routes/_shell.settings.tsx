import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save, Moon, Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme";
import { auth } from "@/lib/auth";

export const Route = createFileRoute("/_shell/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggle } = useTheme();
  const [tariff, setTariff] = useState(8.5);
  const [budget, setBudget] = useState(3000);
  const [vMin, setVMin] = useState(210);
  const [vMax, setVMax] = useState(240);
  const [iMax, setIMax] = useState(10);
  const [email, setEmail] = useState("user@energy.io");

  useEffect(() => { setEmail(auth.user()); }, []);

  const save = () => toast.success("Settings saved");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure tariff, alerts, appearance and profile</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="card-elegant">
          <CardHeader className="pb-2"><CardTitle className="text-base">Billing</CardTitle><CardDescription>Electricity tariff and budget</CardDescription></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Field label="Tariff (₹/kWh)"><Input type="number" step="0.1" value={tariff} onChange={(e)=>setTariff(+e.target.value)} /></Field>
            <Field label="Monthly Budget (₹)"><Input type="number" value={budget} onChange={(e)=>setBudget(+e.target.value)} /></Field>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader className="pb-2"><CardTitle className="text-base">Alert Thresholds</CardTitle><CardDescription>Voltage & current limits</CardDescription></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <Field label="V min"><Input type="number" value={vMin} onChange={(e)=>setVMin(+e.target.value)} /></Field>
            <Field label="V max"><Input type="number" value={vMax} onChange={(e)=>setVMax(+e.target.value)} /></Field>
            <Field label="I max (A)"><Input type="number" value={iMax} onChange={(e)=>setIMax(+e.target.value)} /></Field>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader className="pb-2"><CardTitle className="text-base">Appearance</CardTitle><CardDescription>Theme and interface</CardDescription></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                {theme === "dark" ? <Moon className="h-4 w-4"/> : <Sun className="h-4 w-4"/>}
                <div>
                  <p className="text-sm font-medium">Dark mode</p>
                  <p className="text-xs text-muted-foreground">Reduce eye strain in low light</p>
                </div>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={toggle} />
            </div>
          </CardContent>
        </Card>

        <Card className="card-elegant">
          <CardHeader className="pb-2"><CardTitle className="text-base">Profile</CardTitle><CardDescription>Account info</CardDescription></CardHeader>
          <CardContent className="grid gap-3">
            <Field label="Email"><Input value={email} onChange={(e)=>setEmail(e.target.value)} /></Field>
            <Field label="Organization"><Input defaultValue="Energy Lab Pvt Ltd" /></Field>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={save}><Save className="mr-2 h-4 w-4"/>Save changes</Button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
