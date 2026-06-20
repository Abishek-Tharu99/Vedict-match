import { z } from "zod";

/**
 * Shared API contract for the Vedic Marriage Compatibility app.
 * Consumed by both the Express backend (request validation + response parsing)
 * and the React frontend (typed API client).
 */

export const Gender = z.enum(["male", "female", "other"]);
export const Verdict = z.enum(["excellent", "good", "average", "risky"]);
export const Nadi = z.enum(["Adi", "Madhya", "Antya"]);
export const Gana = z.enum(["Deva", "Manushya", "Rakshasa"]);
export const Varna = z.enum(["Brahmin", "Kshatriya", "Vaishya", "Shudra"]);
export const Impact = z.enum(["none", "low", "medium", "high"]);
export const ConflictRisk = z.enum(["low", "medium", "high"]);
export const KutaStatus = z.enum(["good", "caution", "poor"]);
export const MatrixCategory = z.enum([
  "Mental",
  "Emotional",
  "Physical",
  "Communication",
  "Lifestyle",
]);

// --- Health ---
export const HealthCheckResponse = z.object({
  status: z.string(),
});

// --- Geocoding ---
export const geocodePlaceQueryQMin = 2;
export const GeocodePlaceQueryParams = z.object({
  q: z
    .string()
    .min(geocodePlaceQueryQMin)
    .describe('Place name to search (e.g. "Mumbai", "San Francisco, CA")'),
});
export const GeocodePlaceResponse = z.object({
  results: z.array(
    z.object({
      name: z.string().describe('Display name e.g. "Mumbai, Maharashtra, India"'),
      latitude: z.number(),
      longitude: z.number(),
      timezone: z.string().describe('IANA timezone, e.g. "Asia/Kolkata"'),
      country: z.string().nullish(),
      admin1: z.string().nullish().describe("State / region"),
    }),
  ),
});

// --- Birth input (one partner) ---
export const PersonInput = z.object({
  name: z.string().min(1),
  gender: Gender,
  dateOfBirth: z.string().describe("YYYY-MM-DD"),
  timeOfBirth: z.string().describe("HH:MM (24h)"),
  birthPlace: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
});

export const MatchRequest = z.object({
  person1: PersonInput,
  person2: PersonInput,
});

// --- Computed report ---
export const PersonSummary = z.object({
  name: z.string(),
  gender: Gender,
  lagna: z.string().describe("Ascendant rashi name"),
  rashi: z.string().describe("Moon sign name"),
  nakshatra: z.string(),
  nadi: Nadi,
  gana: Gana,
  varna: Varna,
  yoni: z.string(),
  vashya: z.string(),
  tara: z.string(),
  grahaMaitri: z.string().describe("Moon sign lord"),
});

export const KutaScore = z.object({
  name: z
    .string()
    .describe("Koota name (Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi)"),
  score: z.number(),
  max: z.number(),
  status: KutaStatus,
  description: z.string(),
});

export const DoshaDetail = z.object({
  present: z.boolean(),
  impact: Impact,
  note: z.string(),
});

export const MatchReport = z.object({
  person1: PersonSummary,
  person2: PersonSummary,
  overallScore: z.number().describe("0-36"),
  maxScore: z.number().describe("Always 36"),
  compatibilityPercent: z.number().describe("0-100"),
  verdict: Verdict,
  keyInsight: z.string(),
  kutaScores: z.array(KutaScore),
  doshas: z.object({
    manglik: z.object({
      person1Affected: z.boolean(),
      person2Affected: z.boolean(),
      impact: Impact,
      note: z.string(),
    }),
    bhakoot: DoshaDetail,
    nadi: DoshaDetail,
    verdict: z.string(),
  }),
  compatibilityMatrix: z.array(
    z.object({
      category: MatrixCategory,
      score: z.number().describe("0-10"),
      insight: z.string(),
    }),
  ),
  stability: z.object({
    longevityScore: z.number().describe("0-10"),
    conflictRisk: ConflictRisk,
    growthPotential: z.number().describe("0-10"),
    conclusion: z.string(),
  }),
  finalVerdict: z.object({
    rating: Verdict,
    label: z.string(),
    emoji: z.string(),
    strengths: z.array(z.string()),
    challenges: z.array(z.string()),
    recommendation: z.string(),
  }),
});

// --- /api/match ---
export const ComputeMatchBody = MatchRequest;
export const ComputeMatchResponse = MatchReport;

// --- /api/reports ---
// Saved reports have no owner. Whoever holds the capability token handed back at
// save time can read or delete that single report; nothing lists them.
export const SaveReportBody = MatchRequest;

export const GetReportParams = z.object({ id: z.coerce.number() });
export const DeleteReportParams = z.object({ id: z.coerce.number() });
export const ReportTokenQuery = z.object({ t: z.string().min(16) });

export const GetReportResponse = z.object({
  id: z.number(),
  createdAt: z.coerce.date(),
  request: MatchRequest,
  report: MatchReport,
});

export const SaveReportResponse = GetReportResponse.extend({
  token: z.string(),
});

// --- Inferred types ---
export type Gender = z.infer<typeof Gender>;
export type Verdict = z.infer<typeof Verdict>;
export type Impact = z.infer<typeof Impact>;
export type ConflictRisk = z.infer<typeof ConflictRisk>;
export type KutaStatus = z.infer<typeof KutaStatus>;
export type MatrixCategory = z.infer<typeof MatrixCategory>;
export type PersonInput = z.infer<typeof PersonInput>;
export type MatchRequest = z.infer<typeof MatchRequest>;
export type PersonSummary = z.infer<typeof PersonSummary>;
export type KutaScore = z.infer<typeof KutaScore>;
export type MatchReport = z.infer<typeof MatchReport>;
export type GetReportResponse = z.infer<typeof GetReportResponse>;
export type SaveReportResponse = z.infer<typeof SaveReportResponse>;
export type GeocodePlaceResponse = z.infer<typeof GeocodePlaceResponse>;
export type GeocodeResult = GeocodePlaceResponse["results"][number];
