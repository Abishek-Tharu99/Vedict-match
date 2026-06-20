import { useEffect, useRef, useState } from "react";
import type { Gender, GeocodeResult, PersonInput } from "@vedic-match/shared";
import { api } from "../lib/api";
import { Field, Input, Select, cn } from "./ui";

export type PartnerDraft = {
  name: string;
  gender: Gender;
  dateOfBirth: string;
  timeOfBirth: string;
  birthPlace: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string;
};

export const emptyDraft: PartnerDraft = {
  name: "",
  gender: "female",
  dateOfBirth: "",
  timeOfBirth: "",
  birthPlace: "",
  latitude: null,
  longitude: null,
  timezone: "",
};

export type PartnerErrors = Partial<Record<keyof PartnerDraft, string>>;

export function validatePartner(d: PartnerDraft): PartnerErrors {
  const e: PartnerErrors = {};
  if (!d.name.trim()) e.name = "Name is required";
  if (!d.dateOfBirth) e.dateOfBirth = "Date of birth is required";
  if (!d.timeOfBirth) e.timeOfBirth = "Time of birth is required";
  // if (!d.birthPlace.trim() || d.latitude === null || d.longitude === null)
  //   e.birthPlace = "Pick a birth place from the suggestions";
  return e;
}

export function toPersonInput(d: PartnerDraft): PersonInput {
  return {
    name: d.name.trim(),
    gender: d.gender,
    dateOfBirth: d.dateOfBirth,
    timeOfBirth: d.timeOfBirth,
    birthPlace: d.birthPlace,
    latitude: d.latitude ?? 0,
    longitude: d.longitude ?? 0,
    timezone: d.timezone || "UTC",
  };
}

export function PartnerForm({
  title,
  accent,
  value,
  errors,
  onChange,
}: {
  title: string;
  accent: string;
  value: PartnerDraft;
  errors: PartnerErrors;
  onChange: (next: PartnerDraft) => void;
}) {
  const idp = title.replace(/\s+/g, "-").toLowerCase();
  const set = <K extends keyof PartnerDraft>(key: K, v: PartnerDraft[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <span className={cn("h-2.5 w-2.5 rounded-full", accent)} />
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
          {title}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name" htmlFor={`${idp}-name`} error={errors.name}>
          <Input
            id={`${idp}-name`}
            value={value.name}
            placeholder="e.g. Aarav"
            onChange={(ev: { currentTarget: HTMLInputElement }) =>
              set("name", ev.currentTarget.value)
            }
          />
        </Field>

        <Field label="Gender" htmlFor={`${idp}-gender`}>
          <Select
            id={`${idp}-gender`}
            value={value.gender}
            onChange={(ev: { currentTarget: HTMLSelectElement }) =>
              set("gender", ev.currentTarget.value as Gender)
            }
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </Select>
        </Field>

        <Field label="Date of birth" htmlFor={`${idp}-dob`} error={errors.dateOfBirth}>
          <Input
            id={`${idp}-dob`}
            type="date"
            value={value.dateOfBirth}
            onChange={(ev: { currentTarget: HTMLInputElement }) =>
              set("dateOfBirth", ev.currentTarget.value)
            }
          />
        </Field>

        <Field label="Time of birth" htmlFor={`${idp}-tob`} error={errors.timeOfBirth}>
          <Input
            id={`${idp}-tob`}
            type="time"
            value={value.timeOfBirth}
            onChange={(ev: { currentTarget: HTMLInputElement }) =>
              set("timeOfBirth", ev.currentTarget.value)
            }
          />
        </Field>

        <div className="sm:col-span-2">
          <PlaceAutocomplete
            id={`${idp}-place`}
            value={value}
            error={errors.birthPlace}
            onPick={(r) =>
              onChange({
                ...value,
                birthPlace: r.name,
                latitude: r.latitude,
                longitude: r.longitude,
                timezone: r.timezone,
              })
            }
            onText={(text) =>
              onChange({
                ...value,
                birthPlace: text,
                latitude: null,
                longitude: null,
                timezone: "",
              })
            }
          />
        </div>
      </div>

      <p className="mt-3 text-xs text-[var(--ink-faint)]">
        Accurate time and place are essential for Vedic calculations.
      </p>
    </div>
  );
}

function PlaceAutocomplete({
  id,
  value,
  error,
  onPick,
  onText,
}: {
  id: string;
  value: PartnerDraft;
  error?: string;
  onPick: (r: GeocodeResult) => void;
  onText: (text: string) => void;
}) {
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = value.birthPlace.trim();
    if (value.latitude !== null || q.length < 2) {
      setResults([]);
      return;
    }
    let active = true;
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await api.geocode(q);
        if (active) {
          setResults(res.results);
          setOpen(true);
        }
      } catch {
        if (active) setResults([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 300);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [value.birthPlace, value.latitude]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={boxRef}>
      <Field label="Place of birth" htmlFor={id} error={error}>
        <div className="relative">
          <Input
            id={id}
            autoComplete="off"
            value={value.birthPlace}
            placeholder="Search a city…"
            onFocus={() => results.length && setOpen(true)}
            onChange={(ev: { currentTarget: HTMLInputElement }) => onText(ev.currentTarget.value)}
          />
          {value.latitude !== null && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-300">
              ✓
            </span>
          )}
          {loading && (
            <span className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--ink-soft)]" />
          )}
        </div>
      </Field>

      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-[var(--line)] bg-[var(--popover-bg)] p-1 shadow-2xl">
          {results.map((r, i) => (
            <li key={`${r.name}-${i}`}>
              <button
                type="button"
                onClick={() => {
                  onPick(r);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-[var(--ink-soft)] hover:bg-[var(--inset)]"
              >
                <span>{r.name}</span>
                <span className="text-xs text-[var(--ink-faint)]">{r.timezone}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
