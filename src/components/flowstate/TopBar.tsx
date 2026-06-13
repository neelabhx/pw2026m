import { Bell, Search } from "lucide-react";

export function TopBar({ search = "Scan neural archive…" }: { search?: string }) {
  return (
    <header className="flex items-center justify-between gap-6 px-8 py-6 border-b border-border/40">
      <h2 className="text-xl font-semibold text-primary text-glow-cyan">Aspirant Command</h2>
      <div className="hidden md:flex flex-1 max-w-md relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          placeholder={search}
          className="w-full bg-panel/60 border border-border/60 rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 bg-primary/5 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Flow Status: <span className="text-primary">Active</span>
        </div>
        <button className="p-2 rounded-full hover:bg-white/5"><Bell className="w-4 h-4" /></button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary ring-2 ring-primary/40" />
      </div>
    </header>
  );
}
