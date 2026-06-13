import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/flowstate/Layout";
import { useFlowStore } from "@/lib/flowstate/store";
import { seal, isCrisis } from "@/lib/flowstate/engines";
import { Lock, ShieldCheck, History, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/vault")({
  head: () => ({ meta: [{ title: "Worry Vault — FlowState" }] }),
  component: VaultPage,
});

function VaultPage() {
  const vault = useFlowStore((s) => s.vault);
  const addVault = useFlowStore((s) => s.addVault);
  const trigger = useFlowStore((s) => s.triggerCrisis);
  const [text, setText] = useState("");
  const [sealing, setSealing] = useState(false);

  function onSeal() {
    if (!text.trim()) return;
    if (isCrisis(text)) { trigger(); return; }
    setSealing(true);
    setTimeout(() => {
      addVault({
        id: `v-${Date.now()}`,
        sealed: seal(text),
        at: Date.now(),
        unlockAt: Date.now() + 45 * 60 * 1000,
      });
      setText("");
      setSealing(false);
    }, 900);
  }

  return (
    <Layout>
      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="relative">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-primary text-glow-cyan">The Worry Vault</h1>
            <p className="text-muted-foreground mt-3">Externalize the cognitive load. Encrypt and release your distractions.</p>
          </div>

          {/* Giant lock backdrop */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07]">
            <Lock className="w-[420px] h-[420px]" />
          </div>

          <div className="relative glass rounded-3xl p-6 md:p-8">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter distracting thoughts here… (e.g., 'Will I finish the syllabus in time?')"
              className="w-full bg-transparent resize-none outline-none min-h-[260px] text-base placeholder:text-muted-foreground/60"
            />
            <div className="border-t border-border/40 pt-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex gap-2">
                <span className="text-xs px-3 py-1.5 rounded-full border border-primary/40 text-primary">End-to-End Encrypted</span>
                <span className="text-xs px-3 py-1.5 rounded-full border border-secondary/40 text-secondary">Clinical Privacy</span>
              </div>
              <button
                onClick={onSeal}
                disabled={sealing}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold animate-pulse-glow hover:scale-[1.02] transition disabled:opacity-60"
              >
                <Lock className={`w-4 h-4 ${sealing ? "animate-spin-slow" : ""}`} />
                {sealing ? "Sealing…" : "Encrypt and Seal Vault"}
              </button>
            </div>
          </div>

          <div className="relative mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-primary" />
            Locked thoughts are held securely and hidden until your session concludes.
          </div>
        </div>

        <aside className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 font-semibold">
              <History className="w-4 h-4" /> Vault History
            </div>
            <button className="text-muted-foreground hover:text-foreground"><RefreshCw className="w-4 h-4" /></button>
          </div>

          {vault.length === 0 && <p className="text-sm text-muted-foreground">No sealed thoughts yet. Encrypt your first distraction.</p>}

          <div className="space-y-3">
            {vault.map((v, i) => (
              <VaultRow key={v.id} sealed={v.sealed} at={v.at} unlockAt={v.unlockAt} sessionN={402 - i} />
            ))}
          </div>
        </aside>
      </div>
    </Layout>
  );
}

function VaultRow({ sealed, at, unlockAt, sessionN }: { sealed: string; at: number; unlockAt: number; sessionN: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const remaining = Math.max(0, unlockAt - now);
  const totalMs = unlockAt - at;
  const pct = totalMs ? Math.min(100, ((totalMs - remaining) / totalMs) * 100) : 100;
  const t = new Date(at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="rounded-xl border border-primary/30 p-4 bg-card/40 ring-cyan">
      <div className="flex items-center justify-between text-[10px] tracking-widest text-muted-foreground mb-2">
        <span>SESSION #{sessionN}</span>
        <span>{t}</span>
      </div>
      <div className="font-mono text-xs break-all text-muted-foreground line-clamp-2">{sealed.slice(0, 60)}…</div>
      <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full bg-primary" style={{ width: `${pct}%`, boxShadow: "0 0 8px oklch(0.85 0.18 195 / 0.6)" }} />
      </div>
      <div className="mt-2 text-[10px] tracking-widest text-primary text-right">
        {remaining > 0 ? `LOCKED · ${Math.ceil(remaining / 60000)}m` : "STABILIZED"}
      </div>
    </div>
  );
}
