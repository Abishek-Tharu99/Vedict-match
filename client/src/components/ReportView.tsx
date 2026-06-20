import type { MatchReport, PersonSummary } from "@vedic-match/shared";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../lib/theme";
import { STATUS_COLOR, VERDICT_META } from "../lib/format";
import { Badge, Card, SectionTitle, cn } from "./ui";

export function ReportView({ report }: { report: MatchReport }) {
  const { theme } = useTheme();
  const meta = VERDICT_META[report.verdict];
  const gridStroke = theme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(28,20,38,0.14)";
  const tickFill = theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(28,20,38,0.6)";

  return (
    <div className="space-y-6">
      <ScoreHero report={report} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PersonCard person={report.person1} accent="bg-rose-400" />
        <PersonCard person={report.person2} accent="bg-sky-400" />
      </div>

      <Card className="p-6 animate-fade-up">
        <SectionTitle hint="Ashtakoot — eight kootas, 36 points total">
          Guna Milan Breakdown
        </SectionTitle>
        <div className="space-y-3">
          {report.kutaScores.map((k) => (
            <div key={k.name}>
              <div className="mb-1 flex items-baseline justify-between text-sm">
                <span className="font-medium text-[var(--ink)]">{k.name}</span>
                <span className="tabular-nums text-[var(--ink-soft)]">
                  {k.score} / {k.max}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--track)]">
                <div
                  className={cn("h-full rounded-full", STATUS_COLOR[k.status])}
                  style={{ width: `${(k.score / k.max) * 100}%` }}
                />
              </div>
              {k.description && k.description !== "—" && (
                <p className="mt-1 text-xs text-[var(--ink-faint)]">{k.description}</p>
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6 animate-fade-up">
          <SectionTitle hint="Five dimensions of harmony">Compatibility Matrix</SectionTitle>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={report.compatibilityMatrix} outerRadius="72%">
                <PolarGrid stroke={gridStroke} />
                <PolarAngleAxis dataKey="category" tick={{ fill: tickFill, fontSize: 12 }} />
                <Radar
                  dataKey="score"
                  stroke="var(--color-saffron-soft)"
                  fill="var(--color-saffron)"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5">
            {report.compatibilityMatrix.map((m) => (
              <li key={m.category} className="flex items-center justify-between text-sm">
                <span className="text-[var(--ink-soft)]">{m.category}</span>
                <span className="text-[var(--ink-faint)]">
                  <span className="tabular-nums text-[var(--ink)]">{m.score.toFixed(1)}</span> ·{" "}
                  {m.insight}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 animate-fade-up">
          <SectionTitle hint="Dosha screening">Doshas</SectionTitle>
          <div className="space-y-3">
            <DoshaRow
              label="Mangal (Manglik)"
              present={
                report.doshas.manglik.person1Affected || report.doshas.manglik.person2Affected
              }
              impact={report.doshas.manglik.impact}
              note={report.doshas.manglik.note}
            />
            <DoshaRow
              label="Bhakoot"
              present={report.doshas.bhakoot.present}
              impact={report.doshas.bhakoot.impact}
              note={report.doshas.bhakoot.note}
            />
            <DoshaRow
              label="Nadi"
              present={report.doshas.nadi.present}
              impact={report.doshas.nadi.impact}
              note={report.doshas.nadi.note}
            />
          </div>
          <p className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--sunken)] p-3 text-sm text-[var(--ink-soft)]">
            {report.doshas.verdict}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1 animate-fade-up">
          <SectionTitle>Stability</SectionTitle>
          <Stat label="Longevity" value={report.stability.longevityScore} />
          <Stat label="Growth potential" value={report.stability.growthPotential} />
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-[var(--ink-soft)]">Conflict risk</span>
            <Badge
              className={cn(
                "capitalize",
                report.stability.conflictRisk === "low"
                  ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-200"
                  : report.stability.conflictRisk === "medium"
                    ? "border-amber-400/30 bg-amber-500/15 text-amber-700 dark:text-amber-100"
                    : "border-rose-400/30 bg-rose-500/15 text-rose-700 dark:text-rose-200",
              )}
            >
              {report.stability.conflictRisk}
            </Badge>
          </div>
          <p className="mt-3 text-sm text-[var(--ink-soft)]">{report.stability.conclusion}</p>
        </Card>

        <Card className={cn("p-6 lg:col-span-2 ring-1 animate-fade-up", meta.ring)}>
          <div className="mb-3 flex items-center gap-3">
            <span className="text-2xl">{report.finalVerdict.emoji}</span>
            <div>
              <p className="text-xs uppercase tracking-wide text-[var(--ink-faint)]">Final verdict</p>
              <p className={cn("text-lg font-semibold", meta.text)}>{report.finalVerdict.label}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <VerdictList title="Strengths" items={report.finalVerdict.strengths} tone="good" />
            <VerdictList
              title="Challenges"
              items={report.finalVerdict.challenges}
              tone="poor"
            />
          </div>
          <p className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--sunken)] p-3 text-sm text-[var(--ink-soft)]">
            {report.finalVerdict.recommendation}
          </p>
        </Card>
      </div>
    </div>
  );
}

function ScoreHero({ report }: { report: MatchReport }) {
  const { theme } = useTheme();
  const meta = VERDICT_META[report.verdict];
  const trackStroke = theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(28,20,38,0.1)";

  return (
    <Card className={cn("overflow-hidden p-6 ring-1 sm:p-8 animate-fade-up", meta.ring)}>
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge className={meta.chip}>
              {meta.emoji} {meta.label}
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
            {report.person1.name} &amp; {report.person2.name}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[var(--ink-soft)]">{report.keyInsight}</p>
        </div>

        <div className="relative grid h-36 w-36 shrink-0 place-items-center">
          <svg viewBox="0 0 120 120" className="h-36 w-36 -rotate-90">
            <circle cx="60" cy="60" r="52" fill="none" stroke={trackStroke} strokeWidth="12" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="url(#g)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(report.compatibilityPercent / 100) * 2 * Math.PI * 52} ${2 * Math.PI * 52}`}
            />
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--color-saffron)" />
                <stop offset="100%" stopColor="var(--color-saffron-soft)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute text-center">
            <div className="text-3xl font-bold text-[var(--ink)]">{report.overallScore}</div>
            <div className="text-xs text-[var(--ink-faint)]">of {report.maxScore}</div>
            <div className="mt-0.5 text-xs font-medium text-[var(--color-saffron-soft)]">
              {report.compatibilityPercent}%
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function PersonCard({ person, accent }: { person: PersonSummary; accent: string }) {
  const rows: Array<[string, string]> = [
    ["Lagna", person.lagna],
    ["Rashi", person.rashi],
    ["Nakshatra", person.nakshatra],
    ["Nadi", person.nadi],
    ["Gana", person.gana],
    ["Varna", person.varna],
    ["Yoni", person.yoni],
    ["Vashya", person.vashya],
    ["Tara", person.tara],
    ["Sign lord", person.grahaMaitri],
  ];
  return (
    <Card className="p-6 animate-fade-up">
      <div className="mb-4 flex items-center gap-2">
        <span className={cn("h-2.5 w-2.5 rounded-full", accent)} />
        <h3 className="text-base font-semibold text-[var(--ink)]">{person.name}</h3>
        <span className="text-xs capitalize text-[var(--ink-faint)]">· {person.gender}</span>
      </div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-2.5">
        {rows.map(([k, v]) => (
          <div
            key={k}
            className="flex items-center justify-between border-b border-[var(--line-soft)] pb-1.5"
          >
            <dt className="text-xs text-[var(--ink-faint)]">{k}</dt>
            <dd className="text-sm font-medium text-[var(--ink)]">{v}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

function DoshaRow({
  label,
  present,
  impact,
  note,
}: {
  label: string;
  present: boolean;
  impact: string;
  note: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--sunken)] p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--ink)]">{label}</span>
        <Badge
          className={
            present
              ? "border-rose-400/30 bg-rose-500/15 text-rose-700 dark:text-rose-200"
              : "border-emerald-400/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-200"
          }
        >
          {present ? `present · ${impact}` : "clear"}
        </Badge>
      </div>
      <p className="mt-1 text-xs text-[var(--ink-soft)]">{note}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="mb-2">
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="text-[var(--ink-soft)]">{label}</span>
        <span className="tabular-nums text-[var(--ink)]">{value.toFixed(1)} / 10</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[var(--track)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-saffron)] to-[var(--color-saffron-soft)]"
          style={{ width: `${(value / 10) * 100}%` }}
        />
      </div>
    </div>
  );
}

function VerdictList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "good" | "poor";
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--ink-faint)]">
        {title}
      </p>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-sm text-[var(--ink-soft)]">
            <span
              className={
                tone === "good"
                  ? "text-emerald-600 dark:text-emerald-300"
                  : "text-rose-600 dark:text-rose-300"
              }
            >
              {tone === "good" ? "✦" : "▲"}
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
