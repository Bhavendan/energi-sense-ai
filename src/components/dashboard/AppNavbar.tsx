import { useEffect, useState } from "react";
import { Moon, Sun, Wifi, WifiOff } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/hooks/use-theme";
import { auth } from "@/lib/auth";

export function AppNavbar({ connected = true }: { connected?: boolean }) {
  const { theme, toggle } = useTheme();
  const [now, setNow] = useState(new Date());
  const [email, setEmail] = useState("user@energy.io");

  useEffect(() => {
    setEmail(auth.user());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger />
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-semibold sm:text-base">
          Smart Energy Digital Twin
        </h1>
        <p className="hidden text-xs text-muted-foreground sm:block">
          AI-powered IoT energy monitoring & optimization
        </p>
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <span className="font-mono text-sm tabular-nums text-muted-foreground">
          {now.toLocaleTimeString()}
        </span>
      </div>

      <Badge
        variant="outline"
        className={
          "gap-1.5 " +
          (connected
            ? "border-primary/30 bg-primary/10 text-primary"
            : "border-destructive/30 bg-destructive/10 text-destructive")
        }
      >
        {connected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        {connected ? "Device Online" : "Offline"}
      </Badge>

      <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
          {email.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </header>
  );
}
