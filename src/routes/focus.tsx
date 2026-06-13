import { useState, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/flowstate/Layout";
import { useFlowStore } from "@/lib/flowstate/store";
import { shatterGoal } from "@/lib/flowstate/engines";
import { Play, Pause, RotateCcw, SkipForward, Zap, Rocket, CheckCircle2, Circle, Plus, Brain } from "lucide-react";

export const Route = createFileRoute("/focus")({
  head: () => ({ meta: [{ title: "Focus — FlowState" }] }),
  component: FocusPage,
});

const DURATIONS = [10, 45, 60];

function FocusPage() {
  const [duration, setDuration] = useState(45);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunningLocal] = useState(false);
  const [goal, setGoal] = useState("");
  const blocks = useFlowStore((s) => s.blocks);
  const setBlocks = useFlowStore((s) => s.setBlocks);
  const toggleBlock = useFlowStore((s) => s.toggleBlock);
  const setFocusRunning = useFlowStore((s) => s.setFocusRunning);
  const addFocusMinutes = useFlowStore((s) => s.addFocusMinutes);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { setFocusRunning(running); }, [running, setFocusRunning]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setElapsed((e) => {
        if (e + 1 >= duration * 60) {
          setRunningLocal(false);
          addFocusMinutes(duration);
          return duration * 60;
        }
        return e + 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, duration, addFocusMinutes]);

  function reset() { setElapsed(0); setRunningLocal(false); }
  function pickDuration(d: number) { setDuration(d); setElapsed(0); }

  function shatter() {
    if (!goal.trim()) return;
    setBlocks(shatterGoal(goal));
  }

  const remaining = duration * 60 - elapsed;
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const pct = (elapsed / (duration * 60)) * 100;

  // SVG circle math
  const R = 130;
  const C = 2 * Math.PI * R;
  const offset = C - (pct / 100) * C;

  const cognitiveLoad = Math.max(8, 50 - Math.floor(pct / 4));

  return (
    <Layout>
      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* Timer */}
        <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center min-h-[70vh] relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at center, oklch(0.85 0.18 195 / 0.08), transparent 70%)" }} />
          <div className="relative w-[320px] h-[320px] flex items-center justify-center">
            <svg viewBox="0 0 300 300" className="w-full h-full -rotate-90">
              <circle cx="150" cy="150" r={R} fill="none" stroke="oklch(0.3 0.03 245)" strokeWidth="10" />
              <circle
                cx="150" cy="150" r={R}
                fill="none"
                stroke="oklch(0.85 0.18 195)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={offset}
                style={{ filter: "drop-shadow(0 0 12px oklch(0.85 0.18 195 / 0.8))", transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-7xl font-bold text-primary text-glow-cyan tabular-nums">{mm}:{ss}</div>
              <div className="text-xs tracking-[0.3em] text-muted-foreground mt-2">ACTIVE SESSION</div>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-10">
            <button onClick={reset} className="w-12 h-12 rounded-full border border-border/60 flex items-center justify-center hover:bg-white/5">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setRunningLocal((r) => !r)}
              className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center animate-pulse-glow hover:scale-105 transition"
            >
              {running ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
            </button>
            <button onClick={() => setElapsed(duration * 60)} className="w-12 h-12 rounded-full border border-border/60 flex items-center justify-center hover:bg-white/5">
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-3 mt-8">
            {DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => pickDuration(d)}
                className={`px-6 py-2.5 rounded-xl border text-sm transition ${
                  duration === d ? "border-primary/60 bg-primary/10 text-primary" : "border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {d}m
              </button>
            ))}
          </div>
        </div>

        {/* Goal shatterer + Cognitive load */}
        <aside className="space-y-5">
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Zap className="w-4 h-4" />
              <h3 className="font-bold text-lg">Atomic Goal Shatterer</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-5">Break your macro objectives into quantum blocks.</p>

            <div className="relative">
              <input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") shatter(); }}
                placeholder="Enter Macro Target (e.g., Master Polity)"
                className="w-full bg-panel/60 border border-border/60 rounded-xl pl-4 pr-12 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button onClick={shatter} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:scale-110 transition">
                <Rocket className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-6 text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-3">Current Focused Blocks</div>
            <div className="space-y-2">
              {blocks.length === 0 && (
                <div className="text-sm text-muted-foreground/70 italic px-2 py-3">No blocks yet — shatter a goal above.</div>
              )}
              {blocks.map((b) => (
                <button
                  key={b.id}
                  onClick={() => toggleBlock(b.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition text-left ${
                    b.done ? "border-primary/60 bg-primary/10" : "border-border/60 hover:border-primary/40"
                  }`}
                >
                  {b.done ? <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> : <Circle className="w-5 h-5 text-muted-foreground shrink-0" />}
                  <span className={`flex-1 text-sm font-medium ${b.done ? "text-primary" : ""}`}>{b.label}</span>
                  <span className="font-mono text-xs text-muted-foreground">{String(b.minutes).padStart(2, "0")}:00</span>
                </button>
              ))}
              <button className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-border/60 text-sm text-muted-foreground hover:text-foreground">
                <Plus className="w-4 h-4" /> Add Sub-quantum Block
              </button>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-secondary/15 flex items-center justify-center shrink-0">
              <Brain className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <div className="font-semibold">Cognitive Load Index: {cognitiveLoad}%</div>
              <p className="text-sm text-muted-foreground mt-1">
                {running
                  ? `Optimal for high-complexity pattern recognition. Maintaining flow state for ${Math.floor(elapsed / 60)} mins.`
                  : "Idle. Engage timer to begin telemetry capture."}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </Layout>
  );
}
