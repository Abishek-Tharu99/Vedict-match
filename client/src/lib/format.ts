import type { Verdict } from "@vedic-match/shared";

export const VERDICT_META: Record<
  Verdict,
  { label: string; emoji: string; text: string; ring: string; bar: string; chip: string }
> = {
  excellent: {
    label: "Excellent",
    emoji: "🟢",
    text: "text-emerald-700 dark:text-emerald-300",
    ring: "ring-emerald-400/40",
    bar: "from-emerald-400 to-teal-300",
    chip: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-200 border-emerald-400/30",
  },
  good: {
    label: "Good",
    emoji: "🟡",
    text: "text-amber-700 dark:text-amber-300",
    ring: "ring-amber-400/40",
    bar: "from-amber-300 to-yellow-200",
    chip: "bg-amber-500/15 text-amber-700 dark:text-amber-100 border-amber-400/30",
  },
  average: {
    label: "Average",
    emoji: "🟠",
    text: "text-orange-700 dark:text-orange-300",
    ring: "ring-orange-400/40",
    bar: "from-orange-400 to-amber-300",
    chip: "bg-orange-500/15 text-orange-700 dark:text-orange-100 border-orange-400/30",
  },
  risky: {
    label: "Risky",
    emoji: "🔴",
    text: "text-rose-700 dark:text-rose-300",
    ring: "ring-rose-400/40",
    bar: "from-rose-500 to-red-400",
    chip: "bg-rose-500/15 text-rose-700 dark:text-rose-100 border-rose-400/30",
  },
};

export const STATUS_COLOR: Record<string, string> = {
  good: "bg-emerald-400",
  caution: "bg-amber-300",
  poor: "bg-rose-400",
};

export function formatDate(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}
