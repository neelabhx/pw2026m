import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/flowstate/Layout";
import { useFlowStore } from "@/lib/flowstate/store";
import { Zap, Timer, Lock, CheckCircle2, Activity, Calendar } from "lucide-react";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "FlowState — Reclaim Your Cognitive Sovereignty" },
      { name: "description", content: "Clinical-grade focus, venting, and worry sealing for high-stakes aspirants." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <Layout>
      <DashboardContent />
    </Layout>
  );
}

function DashboardContent() {
  const { totalFocusLogged, worriesLocked, tasksCompleted } = useFlowStore();
  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl glass p-10 md:p-14 ring-cyan">
        <div className="absolute inset-0 opacity-60 pointer-events-none">
          <div className="absolute -right-20 top-0 w-[600px] h-[600px] bg-gradient-radial from-primary/30 via-transparent to-transparent blur-3xl" />
          <div className="absolute right-10 top-10 w-[400px] h-[300px]" style={{
            background: "radial-gradient(ellipse at center, oklch(0.85 0.18 195 / 0.25), transparent 70%)"
          }} />
        </div>
        <div className="relative max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold leading-[1.05]">
            Reclaim Your<br />
            <span className="text-primary text-glow-cyan">Cognitive Sovereignty</span>
          </h1>
          <p className="mt-6 text-muted-foreground text-lg max-w-xl">
            Your neuro-architecture is optimized for performance. Initiate the flow sequence
            to dissolve distractions and enter the peak state.
          </p>
          <Link
            to="/focus"
            className="mt-8 inline-flex items-center gap-2 px-7 py-4 rounded-full bg-primary text-primary-foreground font-semibold animate-pulse-glow hover:scale-[1.02] transition"
          >
            Launch Deep Flow <Zap className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Stat cards */}
      <section className="grid md:grid-cols-3 gap-5">
        <StatCard icon={Timer} label="Total Focus Logged" value={String(totalFocusLogged)} unit="min" trend="+12% vs last session" barPct={72} barColor="primary" />
        <StatCard icon={Lock} label="Worries Locked" value={String(worriesLocked)} unit="items" trend="Cleared" barPct={55} barColor="secondary" />
        <StatCard icon={CheckCircle2} label="Tasks Completed" value={String(tasksCompleted)} unit="units" trend="89% Efficiency" footer="Project: Exam Core" />
      </section>

      {/* Telemetry + History */}
      <section className="grid lg:grid-cols-2 gap-5">
        <ClinicalTelemetry />
        <FlowHistory />
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon, label, value, unit, trend, barPct, barColor, footer,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; value: string; unit: string; trend: string;
  barPct?: number; barColor?: "primary" | "secondary"; footer?: string;
}) {
  return (
    <div className="glass rounded-2xl p-6 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="w-11 h-11 rounded-xl bg-primary/10 ring-1 ring-primary/30 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className="text-xs text-muted-foreground">{trend}</span>
      </div>
      <div className="mt-8 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-4xl font-bold tracking-tight">{value}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
      {barPct !== undefined && (
        <div className="mt-5 h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div
            className={`h-full rounded-full ${barColor === "secondary" ? "bg-secondary" : "bg-primary"}`}
            style={{ width: `${barPct}%`, boxShadow: barColor === "secondary" ? "0 0 12px oklch(0.55 0.24 295 / 0.6)" : "0 0 12px oklch(0.85 0.18 195 / 0.6)" }}
          />
        </div>
      )}
      {footer && (
        <div className="mt-5 flex items-center gap-2">
          <div className="flex -space-x-2">
            <div className="w-7 h-7 rounded-full bg-muted text-[10px] flex items-center justify-center ring-2 ring-background">ML</div>
            <div className="w-7 h-7 rounded-full bg-muted text-[10px] flex items-center justify-center ring-2 ring-background">DS</div>
            <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center ring-2 ring-background">+5</div>
          </div>
          <span className="text-xs text-muted-foreground ml-auto">{footer}</span>
        </div>
      )}
    </div>
  );
}

function ClinicalTelemetry() {
  // Simulated line points
  const points = [40, 55, 62, 75, 70, 58, 45, 50, 65, 78, 82, 76, 60];
  const w = 320, h = 140;
  const max = 100;
  const path = points
    .map((p, i) => `${(i / (points.length - 1)) * w},${h - (p / max) * h}`)
    .join(" L ");
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <span className="font-semibold">Clinical Telemetry</span>
        </div>
        <div className="flex gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-white/5">HRV</span>
          <span className="text-xs px-3 py-1 rounded-full bg-primary/15 text-primary ring-1 ring-primary/40">Focus Depth</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40">
        <defs>
          <linearGradient id="tel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.85 0.18 195)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="oklch(0.85 0.18 195)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`M ${path} L ${w},${h} L 0,${h} Z`} fill="url(#tel)" />
        <path d={`M ${path}`} fill="none" stroke="oklch(0.85 0.18 195)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px oklch(0.85 0.18 195 / 0.7))" }} />
      </svg>

      <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
        <div><div className="text-muted-foreground text-xs">Average Depth</div><div className="font-bold text-lg">84%</div></div>
        <div><div className="text-muted-foreground text-xs">Peak HRV</div><div className="font-bold text-lg">92ms</div></div>
        <div><div className="text-muted-foreground text-xs">Cognitive Load</div><div className="font-bold text-lg text-secondary">Low</div></div>
      </div>
    </div>
  );
}

function FlowHistory() {
  const cells = Array.from({ length: 7 * 13 }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const r = seed / 233280;
    if (r < 0.45) return 0;
    if (r < 0.7) return 1;
    if (r < 0.9) return 2;
    return 3;
  });
  const colors = [
    "bg-white/5",
    "bg-secondary/30",
    "bg-secondary/60",
    "bg-secondary",
  ];
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-secondary" />
          <span className="font-semibold">Flow History</span>
        </div>
        <span className="text-xs text-muted-foreground">Last 90 Days</span>
      </div>
      <div className="grid grid-cols-13 gap-1.5" style={{ gridTemplateColumns: "repeat(13, minmax(0, 1fr))" }}>
        {cells.map((c, i) => (
          <div key={i} className={`aspect-square rounded ${colors[c]}`} style={{ boxShadow: c === 3 ? "0 0 8px oklch(0.55 0.24 295 / 0.6)" : undefined }} />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>Less Flow</span>
        <div className="flex gap-1">
          {colors.map((c, i) => <div key={i} className={`w-3 h-3 rounded ${c}`} />)}
        </div>
        <span>Peak Flow</span>
      </div>
    </div>
  );
}
