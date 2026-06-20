import { useState } from "react";
import { Link } from "wouter";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Verdict } from "@vedic-match/shared";
import { api } from "../lib/api";
import { getSavedReports, removeSavedReport, type SavedReport } from "../lib/store";
import { useTheme } from "../lib/theme";
import { VERDICT_META, formatDate, pct } from "../lib/format";
import { Badge, Button, Card, SectionTitle, cn } from "../components/ui";

const VERDICT_BAR_COLOR: Record<Verdict, string> = {
  excellent: "#34d399",
  good: "#fcd34d",
  average: "#fb923c",
  risky: "#fb7185",
};

const ALL_VERDICTS: Verdict[] = ["excellent", "good", "average", "risky"];
const round1 = (n: number) => Math.round(n * 10) / 10;

export function Reports() {
  const { theme } = useTheme();
  const [items, setItems] = useState<SavedReport[]>(() => getSavedReports());
  const refresh = () => setItems(getSavedReports());

  const total = items.length;
  const avgScore = total ? round1(items.reduce((s, r) => s + r.overallScore, 0) / total) : 0;
  const avgPercent = total ? round1(items.reduce((s, r) => s + r.compatibilityPercent, 0) / total) : 0;
  const verdictBreakdown = ALL_VERDICTS.map((v) => ({
    verdict: v,
    count: items.filter((r) => r.verdict === v).length,
  }));
  const rate = (n: number) => (total ? n / total : 0);
  const manglikRate = rate(items.filter((r) => r.manglik).length);
  const bhakootRate = rate(items.filter((r) => r.bhakoot).length);
  const nadiRate = rate(items.filter((r) => r.nadi).length);

  const dark = theme === "dark";
  const tickFill = dark ? "rgba(255,255,255,0.6)" : "rgba(28,20,38,0.6)";
  const tickFaint = dark ? "rgba(255,255,255,0.4)" : "rgba(28,20,38,0.42)";
  const cursorFill = dark ? "rgba(255,255,255,0.05)" : "rgba(28,20,38,0.06)";
  const tooltipBg = dark ? "#160f1f" : "#ffffff";
  const tooltipBorder = dark ? "rgba(255,255,255,0.12)" : "rgba(28,20,38,0.12)";
  const tooltipText = dark ? "#fff" : "#1c1426";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--ink)]">Your Saved Matches</h1>
        <p className="mt-1 text-sm text-[var(--ink-soft)]">
          Reports you've saved on this device. Each keeps a private link only you hold.
        </p>
      </div>

      <StatsRow total={total} avgScore={avgScore} avgPercent={avgPercent} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-3">
          <SectionTitle hint="Across your saved reports">Verdict Breakdown</SectionTitle>
          <div className="h-56">
            {total > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={verdictBreakdown}>
                  <XAxis
                    dataKey="verdict"
                    tick={{ fill: tickFill, fontSize: 12 }}
                    tickFormatter={(v: Verdict) => VERDICT_META[v].label}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: tickFaint, fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                  />
                  <Tooltip
                    cursor={{ fill: cursorFill }}
                    contentStyle={{
                      background: tooltipBg,
                      border: `1px solid ${tooltipBorder}`,
                      borderRadius: 12,
                      color: tooltipText,
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {verdictBreakdown.map((d) => (
                      <Cell key={d.verdict} fill={VERDICT_BAR_COLOR[d.verdict]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="grid h-full place-items-center text-sm text-[var(--ink-faint)]">
                Save your first match to see it here.
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <SectionTitle hint="Across your saved reports">Dosha Prevalence</SectionTitle>
          <div className="space-y-4">
            <DoshaBar label="Manglik" rate={manglikRate} />
            <DoshaBar label="Bhakoot Dosha" rate={bhakootRate} />
            <DoshaBar label="Nadi Dosha" rate={nadiRate} />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <SectionTitle hint="Click a row to open the full report">Saved Reports</SectionTitle>
        {total === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-[var(--ink-soft)]">
              You haven't saved any compatibility reports on this device.
            </p>
            <Link href="/">
              <Button className="mt-4">Compute a match</Button>
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-[color:var(--line-soft)]">
            {items.map((r) => (
              <ReportRow key={r.id} report={r} onDeleted={refresh} />
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function StatsRow({
  total,
  avgScore,
  avgPercent,
}: {
  total: number;
  avgScore: number;
  avgPercent: number;
}) {
  const items = [
    { label: "Reports Saved", value: String(total) },
    { label: "Avg Compatibility", value: total ? `${avgPercent}%` : "—" },
    { label: "Avg Guna Score", value: total ? `${avgScore} / 36` : "—" },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((it) => (
        <Card key={it.label} className="p-5">
          <p className="text-xs uppercase tracking-wide text-[var(--ink-faint)]">{it.label}</p>
          <p className="mt-2 text-2xl font-bold text-[var(--ink)]">{it.value}</p>
        </Card>
      ))}
    </div>
  );
}

function DoshaBar({ label, rate }: { label: string; rate: number }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="text-[var(--ink-soft)]">{label}</span>
        <span className="tabular-nums text-[var(--ink)]">{pct(rate)}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--track)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-saffron)] to-[var(--color-saffron-soft)]"
          style={{ width: `${Math.min(100, rate * 100)}%` }}
        />
      </div>
    </div>
  );
}

function ReportRow({ report, onDeleted }: { report: SavedReport; onDeleted: () => void }) {
  const [busy, setBusy] = useState(false);
  const meta = VERDICT_META[report.verdict];

  async function remove() {
    if (!confirm(`This will permanently remove the match report for ${report.person1Name} & ${report.person2Name}.`))
      return;
    setBusy(true);
    try {
      await api.deleteReport(report.id, report.token);
    } catch {
      // already gone on the server (or token rejected) — drop it locally regardless
    }
    removeSavedReport(report.id);
    onDeleted();
  }

  return (
    <li className="group flex items-center gap-4 py-3">
      <Link
        href={`/report?id=${report.id}&t=${encodeURIComponent(report.token)}`}
        className="flex flex-1 items-center gap-4 overflow-hidden"
      >
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--inset)] text-sm font-bold text-[var(--ink)]">
          {Math.round(report.compatibilityPercent)}%
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-[var(--ink)]">
            {report.person1Name} &amp; {report.person2Name}
          </p>
          <p className="text-xs text-[var(--ink-faint)]">{formatDate(report.createdAt)}</p>
        </div>
      </Link>
      <Badge className={cn("hidden sm:inline-flex", meta.chip)}>
        {meta.emoji} {meta.label}
      </Badge>
      <span className="hidden tabular-nums text-sm text-[var(--ink-soft)] sm:inline">
        {report.overallScore}/36
      </span>
      <button
        title="Delete this report"
        onClick={remove}
        disabled={busy}
        className="rounded-lg p-2 text-[var(--ink-faint)] transition hover:bg-rose-500/10 hover:text-rose-500 disabled:opacity-50 dark:hover:text-rose-300"
      >
        ✕
      </button>
    </li>
  );
}
