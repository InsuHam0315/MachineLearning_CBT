/* =========================================================================
   storage.ts — localStorage 유틸 + 학습기록 집계 (SSR 안전)
   ========================================================================= */
import { ML_COVERAGE } from "@/data/lecture_coverage";

export const KEYS = {
  user: "mlCurrentUser",
  wrong: "mlWrongNotes",
  records: "mlStudyRecords",
  practice: "mlPracticeState",
};

function store(): Storage | null {
  try { return typeof window !== "undefined" ? window.localStorage : null; }
  catch { return null; }
}

export function getItem<T>(key: string, fallback: T): T {
  const s = store();
  if (!s) return fallback;
  try {
    const v = s.getItem(key);
    return v == null ? fallback : (JSON.parse(v) as T);
  } catch { return fallback; }
}
export function setItem(key: string, val: unknown): void {
  const s = store();
  if (!s) return;
  try { s.setItem(key, JSON.stringify(val)); } catch { /* ignore */ }
}
export function removeItem(key: string): void {
  const s = store();
  if (!s) return;
  try { s.removeItem(key); } catch { /* ignore */ }
}

export interface User { name: string; sid?: string; since: number; }
export function getUser(): User | null { return getItem<User | null>(KEYS.user, null); }
export function setUser(u: User): void { setItem(KEYS.user, u); }
export function logout(): void { removeItem(KEYS.user); }

export function chapterTitle(id: string): string {
  const list: any[] = ML_COVERAGE as any;
  for (const c of list) if (c.id === id) return c.title;
  return id || "";
}

/* ---- 학습기록 ---- */
export interface SCEvent { page: string; id: string; topic: string; type: string; sourceLecture: string; sc: string; ts: number; }

export function logEvent(ev: SCEvent): void {
  const rec = getItem<{ events: SCEvent[] }>(KEYS.records, { events: [] });
  if (!rec.events) rec.events = [];
  rec.events.push(ev);
  if (rec.events.length > 800) rec.events = rec.events.slice(rec.events.length - 800);
  setItem(KEYS.records, rec);
}

export interface RecordsSummary {
  user: User | null;
  totalChecks: number;
  uniqueCount: number;
  scDist: { good: number; meh: number; bad: number };
  weakTopics: any[];
  weakTypes: any[];
  recent: SCEvent[];
  wrongCount: number;
}

export function computeRecords(): RecordsSummary {
  const rec = getItem<{ events: SCEvent[] }>(KEYS.records, { events: [] });
  const events = rec.events || [];
  const wrong = getItem<any[]>(KEYS.wrong, []);

  const scDist = { good: 0, meh: 0, bad: 0 } as Record<string, number>;
  const byTopic: Record<string, any> = {};
  const byType: Record<string, any> = {};
  const byProblem: Record<string, SCEvent> = {};

  events.forEach((e) => {
    if (scDist[e.sc] !== undefined) scDist[e.sc]++;
    const w = e.sc === "bad" ? 2 : e.sc === "meh" ? 1 : 0;
    if (e.topic) {
      byTopic[e.topic] = byTopic[e.topic] || { topic: e.topic, score: 0, bad: 0, meh: 0, good: 0, n: 0 };
      byTopic[e.topic].score += w; byTopic[e.topic][e.sc] = (byTopic[e.topic][e.sc] || 0) + 1; byTopic[e.topic].n++;
    }
    if (e.type) {
      byType[e.type] = byType[e.type] || { type: e.type, score: 0, bad: 0, meh: 0, good: 0, n: 0 };
      byType[e.type].score += w; byType[e.type][e.sc] = (byType[e.type][e.sc] || 0) + 1; byType[e.type].n++;
    }
    byProblem[e.id] = e;
  });

  const top = (map: Record<string, any>) =>
    Object.keys(map).map((k) => map[k]).filter((o) => o.score > 0).sort((a, b) => b.score - a.score || b.n - a.n);

  return {
    user: getUser(),
    totalChecks: events.length,
    uniqueCount: Object.keys(byProblem).length,
    scDist: scDist as any,
    weakTopics: top(byTopic).slice(0, 8),
    weakTypes: top(byType).slice(0, 6),
    recent: events.slice().sort((a, b) => b.ts - a.ts).slice(0, 14),
    wrongCount: Array.isArray(wrong) ? wrong.length : 0,
  };
}

export function unique<T>(arr: T[]): T[] {
  const seen = new Set<T>(); const out: T[] = [];
  (arr || []).forEach((x) => { if (x && !seen.has(x)) { seen.add(x); out.push(x); } });
  return out;
}
