import { useFlowStore } from "@/lib/flowstate/store";
import { Phone, Heart, ShieldAlert } from "lucide-react";

const HELPLINES = [
  { name: "Kiran (India National)", number: "1800-599-0019", desc: "24/7 mental health helpline" },
  { name: "Vandrevala Foundation", number: "1860-2662-345", desc: "Free counselling, 24/7" },
  { name: "Tele-MANAS", number: "14416", desc: "Govt. of India mental health support" },
];

export function CrisisOverlay() {
  const open = useFlowStore((s) => s.crisisLock);
  const dismiss = useFlowStore((s) => s.dismissCrisis);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-6 animate-slide-down">
      <div className="max-w-2xl w-full glass rounded-3xl p-8 md:p-12 ring-cyan">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Pivot Protocol Engaged</h2>
            <p className="text-sm text-muted-foreground">You matter. Please reach out — these humans are trained to help.</p>
          </div>
        </div>

        <div className="space-y-3">
          {HELPLINES.map((h) => (
            <a
              key={h.number}
              href={`tel:${h.number.replace(/[^0-9]/g, "")}`}
              className="flex items-center gap-4 p-5 rounded-2xl glass hover:ring-cyan transition group"
            >
              <Phone className="w-5 h-5 text-primary group-hover:scale-110 transition" />
              <div className="flex-1">
                <div className="font-semibold">{h.name}</div>
                <div className="text-xs text-muted-foreground">{h.desc}</div>
              </div>
              <div className="font-mono text-primary text-lg">{h.number}</div>
            </a>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Heart className="w-4 h-4 text-secondary" />
          You are not alone. This screen will stay until you confirm you're safe.
        </div>

        <button
          onClick={dismiss}
          className="mt-6 w-full py-3 rounded-full border border-border/60 text-sm hover:bg-white/5"
        >
          I've reached out — return to FlowState
        </button>
      </div>
    </div>
  );
}
