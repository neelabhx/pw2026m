import { useState, useRef, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/flowstate/Layout";
import { useFlowStore, type Cohort } from "@/lib/flowstate/store";
import { analyze, respond, isCrisis } from "@/lib/flowstate/engines";
import { Sparkles, Send, Mic, Pencil, Brain, Wifi, MapPin, User } from "lucide-react";

export const Route = createFileRoute("/_authenticated/vent")({
  head: () => ({ meta: [{ title: "Vent — FlowState" }] }),
  component: VentPage,
});

interface Msg { who: "ai" | "user"; text: string }

function VentPage() {
  const cohort = useFlowStore((s) => s.cohort);
  const setCohort = useFlowStore((s) => s.setCohort);
  const telemetry = useFlowStore((s) => s.telemetry);
  const setTelemetry = useFlowStore((s) => s.setTelemetry);
  const triggerCrisis = useFlowStore((s) => s.triggerCrisis);

  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { who: "ai", text: "Hey. I can feel the tension in your typing cadence. The competitive exam pressure is peaking, isn't it? Talk to me. No judgment, just space for you to let it all out. What's weighing heaviest on your mind right now?" },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  // live telemetry while typing
  useEffect(() => {
    setTelemetry(analyze(input));
  }, [input, setTelemetry]);

  function submit() {
    const text = input.trim();
    if (!text) return;
    if (isCrisis(text)) { triggerCrisis(); return; }
    const reply = respond(text, cohort);
    setMsgs((m) => [...m, { who: "user", text }, { who: "ai", text: reply }]);
    setInput("");
  }

  return (
    <Layout>
      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        {/* Conversation */}
        <div className="glass rounded-3xl p-6 md:p-8 flex flex-col min-h-[70vh]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-primary/10 ring-1 ring-primary/40 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold">The Safe Older Sibling</div>
                <div className="text-xs text-muted-foreground">Neural Listening Active • 0.4ms Latency</div>
              </div>
            </div>
            <span className="text-xs font-bold tracking-[0.2em] text-primary">LIVE SYNCING</span>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {msgs.map((m, i) =>
              m.who === "ai" ? (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm border border-border/60 bg-card/40 p-4 text-sm leading-relaxed max-w-[80%]">
                    {m.text}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex items-start gap-3 justify-end">
                  <div className="rounded-2xl rounded-tr-sm border border-primary/40 bg-primary/[0.06] p-4 text-sm leading-relaxed max-w-[80%]">
                    {m.text}
                  </div>
                  <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-3.5 h-3.5 text-secondary" />
                  </div>
                </div>
              )
            )}
            <div ref={endRef} />
          </div>

          {/* Composer */}
          <div className="mt-6 rounded-2xl border border-border/60 bg-panel/40 p-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
              placeholder="Vent your study pressure…"
              className="w-full bg-transparent resize-none outline-none text-sm min-h-[60px]"
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <button className="flex items-center gap-1.5 hover:text-foreground"><Mic className="w-3.5 h-3.5" /> Voice Input</button>
                <button className="flex items-center gap-1.5 hover:text-foreground"><Pencil className="w-3.5 h-3.5" /> Sketch Emotion</button>
                <span className="hidden md:inline">Shift + Enter for new line</span>
              </div>
              <button onClick={submit} className="p-2 rounded-full bg-primary text-primary-foreground hover:scale-105 transition">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cohort selector + distortion tags */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mr-2">Cohort</div>
            {(["Adolescent", "Young Adult", "Mature Aspirant"] as Cohort[]).map((c) => (
              <button
                key={c}
                onClick={() => setCohort(c)}
                className={`text-xs px-3 py-1.5 rounded-full border transition ${
                  cohort === c ? "border-primary/60 bg-primary/10 text-primary" : "border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {telemetry.distortions.length > 0 && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Distortion Tags</span>
              {telemetry.distortions.map((d) => (
                <span key={d} className="text-xs px-3 py-1 rounded-full border border-secondary/40 bg-secondary/10 text-secondary">{d}</span>
              ))}
            </div>
          )}
        </div>

        {/* Telemetry sidebar */}
        <aside className="space-y-5">
          <div className="glass rounded-3xl p-6">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-foreground/90 mb-6">Clinical Extraction<br />Telemetry</h3>
            <TelemBar label="Academic Backlog" value={telemetry.academic} color="primary" />
            <TelemBar label="Relationship Friction" value={telemetry.relationship} color="secondary" />
            <TelemBar label="Cognitive Distortion" value={telemetry.distortion} color="destructive" />

            <div className="mt-8 flex justify-center">
              <div className="relative w-40 h-40 rounded-full border-2 border-border flex items-center justify-center">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="oklch(0.85 0.18 195)" strokeWidth="2"
                    strokeDasharray={`${(telemetry.stress / 100) * 289} 289`}
                    style={{ filter: "drop-shadow(0 0 6px oklch(0.85 0.18 195 / 0.6))" }} />
                </svg>
                <div className="text-center">
                  <div className="text-3xl font-bold">{telemetry.stress}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Stress Index</div>
                </div>
              </div>
            </div>
            {telemetry.stress > 70 && (
              <p className="mt-5 text-sm italic text-center text-muted-foreground">
                "Cognitive load exceeds threshold. Immediate venting recommended."
              </p>
            )}
          </div>

          <div className="glass rounded-3xl p-6 relative overflow-hidden">
            <Wifi className="absolute top-4 right-12 w-5 h-5 text-primary/30" />
            <MapPin className="absolute top-4 right-4 w-5 h-5 text-primary/30" />
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-3">Neural Insight</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {telemetry.academic > telemetry.relationship && telemetry.academic > 10
                ? <>Your distress peaks when discussing <strong className="text-foreground">"Physics Mock Tests"</strong>. This suggests a localized performance anxiety rather than a global academic burnout.</>
                : telemetry.relationship > 10
                ? <>Relational static is the dominant signal. The system suggests <strong className="text-foreground">temporal distancing</strong>: respond after the next focus block, not before.</>
                : "Type freely. Pattern detection requires more signal."}
            </p>
            <button className="mt-4 text-xs font-bold tracking-widest text-primary hover:underline">VIEW DRILL-DOWN →</button>
          </div>
        </aside>
      </div>
    </Layout>
  );
}

function TelemBar({ label, value, color }: { label: string; value: number; color: "primary" | "secondary" | "destructive" }) {
  const colorMap = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    destructive: "bg-destructive",
  };
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-sm font-mono">{value}%</span>
      </div>
      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
        <div className={`h-full ${colorMap[color]} transition-all duration-500`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
