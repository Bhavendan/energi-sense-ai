import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@energy.io");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.isAuthed()) navigate({ to: "/dashboard" });
  }, [navigate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setTimeout(() => {
      auth.login(email);
      toast.success("Welcome back", { description: email });
      navigate({ to: "/dashboard" });
    }, 700);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-2 lg:items-center">
        <div className="hidden lg:block">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground shadow-sm">
            <span className="h-2 w-2 rounded-full bg-primary pulse-glow" />
            Live ESP32 · PZEM-004T telemetry
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            Your energy, <span className="text-primary">digitally twinned.</span>
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Real-time monitoring, AI-driven predictions, and actionable recommendations for
            every watt your devices draw.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li>• Live voltage · current · power · energy telemetry</li>
            <li>• Digital twin with runtime, health & cost projection</li>
            <li>• Peak analysis, waste detection & what-if simulation</li>
          </ul>
        </div>

        <Card className="card-elegant p-8 shadow-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold">Sign in</p>
              <p className="text-xs text-muted-foreground">Smart Energy Digital Twin</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" autoComplete="email" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  onClick={() => toast.info("Password reset link sent (demo)")}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? "Signing in…" : "Sign in"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Demo credentials are pre-filled. Any values work.
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
