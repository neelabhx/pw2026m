import { useEffect } from "react";
import { useFlowStore } from "@/lib/flowstate/store";
import { AlertTriangle, X } from "lucide-react";

export function FocusIntercept() {
  const running = useFlowStore((s) => s.focusRunning);
  const shown = useFlowStore((s) => s.focusInterceptShown);
  const setShown = useFlowStore((s) => s.setIntercept);

  useEffect(() => {
    if (!running) return;
    const onVis = () => {
      if (document.visibilityState === "visible") setShown(true);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [running, setShown]);

  if (!shown) return null;
  return (
    <div className="sticky top-0 z-50 bg-destructive/15 border-b border-destructive/40 backdrop-blur-xl animate-slide-down">
      <div className="flex items-center gap-3 px-6 py-3">
        <AlertTriangle className="w-5 h-5 text-destructive" />
        <div className="flex-1 text-sm">
          <span className="font-semibold text-destructive">Focus Guard:</span>{" "}
          You left the flow. Re-anchor now — the session is still live.
        </div>
        <button onClick={() => setShown(false)} className="p-1 hover:bg-destructive/20 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
