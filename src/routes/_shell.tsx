import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { AppNavbar } from "@/components/dashboard/AppNavbar";
import { auth } from "@/lib/auth";

export const Route = createFileRoute("/_shell")({
  beforeLoad: () => {
    // Client-only auth check; skip during SSR (window undefined).
    if (typeof window !== "undefined" && !auth.isAuthed()) {
      throw redirect({ to: "/" });
    }
  },
  component: ShellLayout,
});

function ShellLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex min-w-0 flex-1 flex-col">
          <AppNavbar />
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
          <footer className="border-t px-6 py-3 text-center text-xs text-muted-foreground">
            Smart Energy Digital Twin · © {new Date().getFullYear()} · Powered by ESP32 + PZEM-004T
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
