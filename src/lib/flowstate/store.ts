import { create } from "zustand";

export type Cohort = "Adolescent" | "Young Adult" | "Mature Aspirant";

export interface Telemetry {
  academic: number;
  relationship: number;
  distortion: number;
  stress: number;
  distortions: string[];
}

export interface VaultEntry {
  id: string;
  sealed: string;
  at: number;
  unlockAt: number;
}

export interface AtomicBlock {
  id: string;
  label: string;
  minutes: number;
  done: boolean;
}

interface State {
  cohort: Cohort;
  telemetry: Telemetry;
  vault: VaultEntry[];
  blocks: AtomicBlock[];
  focusRunning: boolean;
  focusInterceptShown: boolean;
  totalFocusLogged: number;
  worriesLocked: number;
  tasksCompleted: number;
  crisisLock: boolean;
  setCohort: (c: Cohort) => void;
  setTelemetry: (t: Telemetry) => void;
  addVault: (e: VaultEntry) => void;
  setBlocks: (b: AtomicBlock[]) => void;
  toggleBlock: (id: string) => void;
  setFocusRunning: (v: boolean) => void;
  setIntercept: (v: boolean) => void;
  addFocusMinutes: (m: number) => void;
  triggerCrisis: () => void;
  dismissCrisis: () => void;
}

export const useFlowStore = create<State>((set) => ({
  cohort: "Young Adult",
  telemetry: { academic: 0, relationship: 0, distortion: 0, stress: 0, distortions: [] },
  vault: [],
  blocks: [],
  focusRunning: false,
  focusInterceptShown: false,
  totalFocusLogged: 1240,
  worriesLocked: 42,
  tasksCompleted: 89,
  crisisLock: false,
  setCohort: (cohort) => set({ cohort }),
  setTelemetry: (telemetry) => set({ telemetry }),
  addVault: (e) => set((s) => ({ vault: [e, ...s.vault], worriesLocked: s.worriesLocked + 1 })),
  setBlocks: (blocks) => set({ blocks }),
  toggleBlock: (id) =>
    set((s) => ({
      blocks: s.blocks.map((b) => (b.id === id ? { ...b, done: !b.done } : b)),
      tasksCompleted: s.tasksCompleted + 1,
    })),
  setFocusRunning: (v) => set({ focusRunning: v }),
  setIntercept: (v) => set({ focusInterceptShown: v }),
  addFocusMinutes: (m) => set((s) => ({ totalFocusLogged: s.totalFocusLogged + m })),
  triggerCrisis: () => set({ crisisLock: true }),
  dismissCrisis: () => set({ crisisLock: false }),
}));
