import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { api, ApiError } from "../lib/api";
import { setLastMatch } from "../lib/store";
import {
  PartnerForm,
  emptyDraft,
  toPersonInput,
  validatePartner,
  type PartnerDraft,
  type PartnerErrors,
} from "../components/PartnerForm";
import { Button, Card, SectionTitle } from "../components/ui";

export function Home() {
  const [, navigate] = useLocation();
  const [p1, setP1] = useState<PartnerDraft>({ ...emptyDraft, gender: "female" });
  const [p2, setP2] = useState<PartnerDraft>({ ...emptyDraft, gender: "male" });
  const [e1, setE1] = useState<PartnerErrors>({});
  const [e2, setE2] = useState<PartnerErrors>({});

  const mutation = useMutation({
    mutationFn: async () => {
      const request = { person1: toPersonInput(p1), person2: toPersonInput(p2) };
      const report = await api.computeMatch(request);
      return { request, report };
    },
    onSuccess: (data) => {
      setLastMatch(data);
      navigate("/report");
    },
  });

  function onSubmit() {
    const v1 = validatePartner(p1);
    const v2 = validatePartner(p2);
    setE1(v1);
    setE2(v2);
    if (Object.keys(v1).length || Object.keys(v2).length) return;
    mutation.mutate();
  }

  return (
    <div className="space-y-8">
      <section className="pt-2 text-center sm:pt-6">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--inset)] px-3 py-1 text-xs text-[var(--ink-soft)]">
          ✶ Ashtakoot Guna Milan
        </p>
        <h1 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-[var(--ink)] sm:text-4xl">
          Vedic Matchmaking, Reimagined
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--ink-soft)]">
          Enter birth details to generate a beautifully crafted, comprehensive Ashtakoot
          compatibility report based on ancient Vedic astrology.
        </p>
      </section>

      <Card className="p-6 sm:p-8">
        <SectionTitle hint="Fill these details to compute compatibility">Compute a Match</SectionTitle>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <PartnerForm
            title="First Partner's Birth Details"
            accent="bg-rose-400"
            value={p1}
            errors={e1}
            onChange={setP1}
          />
          <div className="lg:border-l lg:border-[var(--line)] lg:pl-8">
            <PartnerForm
              title="Second Partner's Birth Details"
              accent="bg-sky-400"
              value={p2}
              errors={e2}
              onChange={setP2}
            />
          </div>
        </div>

        {mutation.isError && (
          <p className="mt-5 rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-200">
            {mutation.error instanceof ApiError
              ? mutation.error.message
              : "Something went wrong computing the match."}
          </p>
        )}

        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-end">
          <Button onClick={onSubmit} disabled={mutation.isPending} className="w-full sm:w-auto">
            {mutation.isPending ? "Aligning the stars…" : "Compute Compatibility →"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
