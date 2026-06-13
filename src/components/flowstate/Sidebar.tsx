import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutGrid, MessagesSquare, Archive, ScanLine, Settings, HelpCircle, Zap, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const items = [
  { to: "/", label: "Dashboard", icon: LayoutGrid },
  { to: "/vent", label: "Vent", icon: MessagesSquare },
  { to: "/vault", label: "Vault", icon: Archive },
  { to: "/focus", label: "Focus", icon: ScanLine },
] as const;

export function Sidebar() {
  const { location } = useRouterState();
  const navigate = useNavigate();
  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border/40 bg-panel/40 backdrop-blur-xl px-6 py-8 sticky top-0 h-screen">
      <Link to="/" className="block">
        <h1 className="text-3xl font-bold text-primary text-glow-cyan tracking-tight">FlowState</h1>
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">Clinical Futurism</p>
      </Link>

      <nav className="mt-12 flex flex-col gap-1">
        {items.map((it) => {
          const active = location.pathname === it.to;
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative ${
                active
                  ? "bg-primary/10 text-primary ring-cyan"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{it.label}</span>
              {active && <span className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-l bg-primary glow-cyan" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <Link
          to="/focus"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm animate-pulse-glow hover:scale-[1.02] transition"
        >
          <Zap className="w-4 h-4" />
          Enter Flow State
        </Link>
        <div className="flex flex-col gap-1 text-muted-foreground">
          <button className="flex items-center gap-3 px-4 py-2 text-sm hover:text-foreground">
            <Settings className="w-4 h-4" /> Settings
          </button>
          <button className="flex items-center gap-3 px-4 py-2 text-sm hover:text-foreground">
            <HelpCircle className="w-4 h-4" /> Support
          </button>
          <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-2 text-sm hover:text-foreground">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
