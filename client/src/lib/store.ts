import type { MatchReport, MatchRequest, Verdict } from "@vedic-match/shared";

/**
 * Tiny session-backed store so the freshly computed report survives the
 * navigation from "/" to "/report" (and a page refresh).
 */
const KEY = "vedic-match:last";

export interface LastMatch {
  request: MatchRequest;
  report: MatchReport;
}

export function setLastMatch(value: LastMatch): void {
  sessionStorage.setItem(KEY, JSON.stringify(value));
}

export function getLastMatch(): LastMatch | null {
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LastMatch;
  } catch {
    return null;
  }
}

export function clearLastMatch(): void {
  sessionStorage.removeItem(KEY);
}

// --- Saved reports (this device) ---
// There are no accounts, so "my saved reports" lives in localStorage. Each entry
// keeps the capability token the server needs to re-open or delete that report.
const SAVED_KEY = "vedic-match:saved";

export interface SavedReport {
  id: number;
  token: string;
  createdAt: string;
  person1Name: string;
  person2Name: string;
  overallScore: number;
  compatibilityPercent: number;
  verdict: Verdict;
  manglik: boolean;
  bhakoot: boolean;
  nadi: boolean;
}

export function getSavedReports(): SavedReport[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? (JSON.parse(raw) as SavedReport[]) : [];
  } catch {
    return [];
  }
}

export function addSavedReport(entry: SavedReport): void {
  const next = [entry, ...getSavedReports().filter((r) => r.id !== entry.id)];
  localStorage.setItem(SAVED_KEY, JSON.stringify(next));
}

export function removeSavedReport(id: number): void {
  const next = getSavedReports().filter((r) => r.id !== id);
  localStorage.setItem(SAVED_KEY, JSON.stringify(next));
}

export function getSavedToken(id: number): string | null {
  return getSavedReports().find((r) => r.id === id)?.token ?? null;
}
