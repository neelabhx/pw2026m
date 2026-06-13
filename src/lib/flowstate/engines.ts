// Local clinical telemetry & response engines — zero-dependency keyword parsers.

import type { Cohort, Telemetry } from "./store";

const ACAD = ["syllabus","backlog","mock","exam","jee","neet","gate","upsc","score","test","study","marks","physics","chemistry","math","revision","prep"];
const DATE = ["text","situationship","relationship","boyfriend","girlfriend","date","ghosted","ignore","crush","breakup","love","dating"];
const DISTORT_MAP: Record<string, string> = {
  always: "Overgeneralization",
  never: "Overgeneralization",
  everyone: "Overgeneralization",
  nobody: "Overgeneralization",
  ruined: "Catastrophizing",
  worst: "Catastrophizing",
  disaster: "Catastrophizing",
  over: "Catastrophizing",
  "can't cope": "Catastrophizing",
  "fall behind": "Catastrophizing",
  perfect: "Black & White Thinking",
  failure: "Black & White Thinking",
  useless: "Black & White Thinking",
  should: "Should Statements",
  must: "Should Statements",
  disappoint: "Personalization",
  "my fault": "Personalization",
};

function density(text: string, words: string[]): number {
  const t = text.toLowerCase();
  let hits = 0;
  for (const w of words) {
    const re = new RegExp(`\\b${w}\\b`, "g");
    const m = t.match(re);
    if (m) hits += m.length;
  }
  const total = Math.max(t.split(/\s+/).length, 1);
  return Math.min(100, Math.round((hits / total) * 320));
}

export function analyze(text: string): Telemetry {
  if (!text.trim()) return { academic: 0, relationship: 0, distortion: 0, stress: 0, distortions: [] };
  const academic = density(text, ACAD);
  const relationship = density(text, DATE);
  const t = text.toLowerCase();
  const tags = new Set<string>();
  let distortHits = 0;
  for (const k in DISTORT_MAP) {
    if (t.includes(k)) {
      tags.add(DISTORT_MAP[k]);
      distortHits++;
    }
  }
  const distortion = Math.min(100, 20 + distortHits * 18);
  const stress = Math.min(99, Math.round((academic * 0.35 + relationship * 0.25 + distortion * 0.5)));
  return { academic, relationship, distortion, stress, distortions: Array.from(tags) };
}

const TEMPLATES = {
  Adolescent: {
    Academic: "Hey — that exam pressure is real, and it doesn't define you. What's one tiny chapter we could just glance at together first?",
    Romantic: "I hear you. That kind of friction hurts at any age. You don't owe anyone a faster response than your nervous system can handle.",
    Mixed: "Lot weighing on you right now — school stuff AND people stuff. Let's untangle one thread. Which is louder today?",
    General: "Take a breath. I'm here. Talk it out — no judgment, just space.",
  },
  "Young Adult": {
    Academic: "I can feel the tension in your typing cadence. The competitive exam pressure is peaking, isn't it? Talk to me. No judgment, just space for you to let it all out. What's weighing heaviest on your mind right now?",
    Romantic: "Relational friction during prep season hits twice as hard. Your worth isn't measured in their reply timing. Walk me through what happened.",
    Mixed: "Academic load and relational static at the same time — that's a real cognitive tax. Let's name them separately so they stop tangling.",
    General: "Neural listening active. Whatever's loud in your head right now, externalize it here.",
  },
  "Mature Aspirant": {
    Academic: "The stakes feel personal at this stage — I get it. Let's separate the data (your prep) from the narrative (your worth).",
    Romantic: "Long-game pressure on relationships during prep is a known load. What's the friction pattern you're noticing?",
    Mixed: "You're balancing prep, expectations, and a life. That's not weakness — that's bandwidth. Which channel needs attention first?",
    General: "I'm listening. Take the floor.",
  },
} as const;

export function respond(text: string, cohort: Cohort): string {
  const tel = analyze(text);
  let cat: keyof (typeof TEMPLATES)["Young Adult"] = "General";
  if (tel.academic > 15 && tel.relationship > 15) cat = "Mixed";
  else if (tel.academic > tel.relationship && tel.academic > 10) cat = "Academic";
  else if (tel.relationship > 10) cat = "Romantic";
  return TEMPLATES[cohort][cat];
}

// Crisis scanner — English + Hinglish markers
const CRISIS = [
  /\bkill myself\b/i, /\bend it all\b/i, /\bsuicid/i, /\bself[- ]?harm/i,
  /\bdon'?t want to live\b/i, /\bwant to die\b/i, /\bcut myself\b/i,
  /\bmarne ka mann\b/i, /\bmar jaun\b/i, /\bjeena nahi\b/i, /\bkhatam kar/i,
  /\bno reason to live\b/i, /\bbetter off dead\b/i,
];
export function isCrisis(text: string): boolean {
  return CRISIS.some((re) => re.test(text));
}

// Goal de-escalation
export function shatterGoal(goal: string): { id: string; label: string; minutes: number; done: boolean }[] {
  const g = goal.toLowerCase().trim();
  if (!g) return [];
  const presets: Record<string, string[]> = {
    polity: ["Read 5 pages of Laxmikanth", "Summarize Articles 14-18", "Solve 10 prelims MCQs"],
    physics: ["Derive 2 key formulas", "Solve 8 problems from current chapter", "Review previous mock errors"],
    fluid: ["Define Navier-Stokes Equations", "Apply Boundary Conditions", "Solve Velocity Fields"],
    chemistry: ["Memorize 1 reaction mechanism", "Solve 10 mole concept questions", "Revise periodic trends"],
    math: ["Solve 5 integration problems", "Review one theorem proof", "Attempt 1 mock section"],
  };
  for (const k in presets) {
    if (g.includes(k)) {
      return presets[k].map((label, i) => ({
        id: `b-${Date.now()}-${i}`,
        label,
        minutes: [15, 20, 10][i] ?? 15,
        done: false,
      }));
    }
  }
  return [
    { id: `b-${Date.now()}-0`, label: `Outline scope of "${goal}"`, minutes: 10, done: false },
    { id: `b-${Date.now()}-1`, label: `Deep work on "${goal}" — core concepts`, minutes: 20, done: false },
    { id: `b-${Date.now()}-2`, label: `Practice questions on "${goal}"`, minutes: 15, done: false },
  ];
}

// "Cryptographic" sealing (base64 scramble for UX)
export function seal(text: string): string {
  try {
    const b = typeof btoa === "function" ? btoa(unescape(encodeURIComponent(text))) : text;
    return b.split("").reverse().join("");
  } catch {
    return text;
  }
}
