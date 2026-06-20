import { useMemo, useState } from "react";
import { Link, useSearch } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { MatchReport } from "@vedic-match/shared";
import { api, ApiError } from "../lib/api";
import { addSavedReport, getLastMatch, getSavedToken, type SavedReport } from "../lib/store";
import { ReportView } from "../components/ReportView";
import { Button, Card, Spinner } from "../components/ui";

export function Report() {
  const search = useSearch();
  const { id, token } = useMemo(() => {
    const p = new URLSearchParams(search);
    const rawId = p.get("id");
    return { id: rawId ? Number(rawId) : null, token: p.get("t") };
  }, [search]);

  if (id !== null) return <SavedReport id={id} urlToken={token} />;
  return <FreshReport />;
}

function summarise(id: number, token: string, createdAt: string, r: MatchReport): SavedReport {
  return {
    id,
    token,
    createdAt,
    person1Name: r.person1.name,
    person2Name: r.person2.name,
    overallScore: r.overallScore,
    compatibilityPercent: r.compatibilityPercent,
    verdict: r.verdict,
    manglik: r.doshas.manglik.person1Affected || r.doshas.manglik.person2Affected,
    bhakoot: r.doshas.bhakoot.present,
    nadi: r.doshas.nadi.present,
  };
}

function FreshReport() {
  const last = getLastMatch();
  const [saved, setSaved] = useState<{ id: number; token: string } | null>(null);

  const save = useMutation({
    mutationFn: () => api.saveReport(last!.request),
    onSuccess: (res) => {
      addSavedReport(summarise(res.id, res.token, String(res.createdAt), last!.report));
      setSaved({ id: res.id, token: res.token });
    },
  });

  if (!last) {
    return (
      <EmptyState
        title="No report to show"
        body="Compute a match first to see a full compatibility report here."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]">
          ← New match
        </Link>
        <div className="flex items-center gap-3">
          {saved ? (
            <Link
              href={`/report?id=${saved.id}&t=${encodeURIComponent(saved.token)}`}
              className="text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-300 dark:hover:text-emerald-200"
            >
              ✓ Saved · view permalink
            </Link>
          ) : (
            <Button variant="ghost" onClick={() => save.mutate()} disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save report"}
            </Button>
          )}
        </div>
      </div>

      {save.isError && (
        <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-200">
          {save.error instanceof ApiError ? save.error.message : "Could not save report."}
        </p>
      )}

      <ReportView report={last.report} />
    </div>
  );
}

function SavedReport({ id, urlToken }: { id: number; urlToken: string | null }) {
  const token = urlToken ?? getSavedToken(id);

  const query = useQuery({
    queryKey: ["report", id, token],
    queryFn: () => api.getReport(id, token!),
    enabled: !!token,
  });

  if (!token) {
    return (
      <EmptyState
        title="Report Not Found"
        body="This report link is missing its access token, so it can't be opened."
        action={{ href: "/reports", label: "Return to Reports" }}
      />
    );
  }

  if (query.isLoading) {
    return (
      <Card className="grid place-items-center p-16">
        <Spinner label="Loading report…" />
      </Card>
    );
  }

  if (query.isError || !query.data) {
    return (
      <EmptyState
        title="Report Not Found"
        body="The requested compatibility report could not be found or has been deleted."
        action={{ href: "/reports", label: "Return to Reports" }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/reports" className="text-sm text-[var(--ink-soft)] hover:text-[var(--ink)]">
        ← Back to Reports
      </Link>
      <ReportView report={query.data.report} />
    </div>
  );
}

function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: { href: string; label: string };
}) {
  return (
    <Card className="mx-auto max-w-lg p-10 text-center">
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[var(--inset)] text-2xl">
        ✶
      </div>
      <h2 className="text-lg font-semibold text-[var(--ink)]">{title}</h2>
      <p className="mt-2 text-sm text-[var(--ink-soft)]">{body}</p>
      <div className="mt-6">
        <Link href={action?.href ?? "/"}>
          <Button>{action?.label ?? "Compute a match"}</Button>
        </Link>
      </div>
    </Card>
  );
}
