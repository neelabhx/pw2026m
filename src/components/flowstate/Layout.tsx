import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { CrisisOverlay } from "./CrisisOverlay";
import { FocusIntercept } from "./FocusIntercept";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <TopBar />
        <FocusIntercept />
        <div className="px-6 md:px-10 py-8">{children}</div>
      </main>
      <CrisisOverlay />
    </div>
  );
}
