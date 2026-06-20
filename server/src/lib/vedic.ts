import type {
  ConflictRisk,
  Impact,
  KutaStatus,
  MatchReport,
  PersonInput,
  PersonSummary,
  Verdict,
} from "@vedic-match/shared";

/**
 * Heuristic Ashtakoota (36-point Guna Milan) engine.
 *
 * This computes approximate Moon-sign (rashi), nakshatra, lagna and Mars
 * placement from date/time/place using simplified mean-longitude formulae,
 * then scores the eight kootas and detects Mangal / Bhakoot / Nadi doshas.
 * It is intended for entertainment / educational use, not precision jyotish.
 */

const RASHIS = [
  "Mesha",
  "Vrishabha",
  "Mithuna",
  "Karka",
  "Simha",
  "Kanya",
  "Tula",
  "Vrishchika",
  "Dhanu",
  "Makara",
  "Kumbha",
  "Meena",
] as const;

const RASHI_LORDS = [
  "Mars",
  "Venus",
  "Mercury",
  "Moon",
  "Sun",
  "Mercury",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Saturn",
  "Jupiter",
] as const;

type Varna = "Brahmin" | "Kshatriya" | "Vaishya" | "Shudra";
type Vashya = "Chatushpada" | "Manava" | "Jalachara" | "Vanachara" | "Keeta";
type Nadi = "Adi" | "Madhya" | "Antya";
type Gana = "Deva" | "Manushya" | "Rakshasa";
type Planet = "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn";

const VARNA_BY_RASHI: Varna[] = [
  "Kshatriya",
  "Vaishya",
  "Shudra",
  "Brahmin",
  "Kshatriya",
  "Vaishya",
  "Shudra",
  "Brahmin",
  "Kshatriya",
  "Vaishya",
  "Shudra",
  "Brahmin",
];

const VASHYA_BY_RASHI: Vashya[] = [
  "Chatushpada",
  "Chatushpada",
  "Manava",
  "Jalachara",
  "Vanachara",
  "Manava",
  "Manava",
  "Keeta",
  "Manava",
  "Jalachara",
  "Manava",
  "Jalachara",
];

interface Nakshatra {
  name: string;
  nadi: Nadi;
  gana: Gana;
  yoni: string;
}

const NAKSHATRAS: Nakshatra[] = [
  { name: "Ashwini", nadi: "Adi", gana: "Deva", yoni: "Horse" },
  { name: "Bharani", nadi: "Madhya", gana: "Manushya", yoni: "Elephant" },
  { name: "Krittika", nadi: "Antya", gana: "Rakshasa", yoni: "Sheep" },
  { name: "Rohini", nadi: "Antya", gana: "Manushya", yoni: "Serpent" },
  { name: "Mrigashira", nadi: "Madhya", gana: "Deva", yoni: "Serpent" },
  { name: "Ardra", nadi: "Adi", gana: "Manushya", yoni: "Dog" },
  { name: "Punarvasu", nadi: "Adi", gana: "Deva", yoni: "Cat" },
  { name: "Pushya", nadi: "Madhya", gana: "Deva", yoni: "Sheep" },
  { name: "Ashlesha", nadi: "Antya", gana: "Rakshasa", yoni: "Cat" },
  { name: "Magha", nadi: "Antya", gana: "Rakshasa", yoni: "Rat" },
  { name: "Purva Phalguni", nadi: "Madhya", gana: "Manushya", yoni: "Rat" },
  { name: "Uttara Phalguni", nadi: "Adi", gana: "Manushya", yoni: "Cow" },
  { name: "Hasta", nadi: "Adi", gana: "Deva", yoni: "Buffalo" },
  { name: "Chitra", nadi: "Madhya", gana: "Rakshasa", yoni: "Tiger" },
  { name: "Swati", nadi: "Antya", gana: "Deva", yoni: "Buffalo" },
  { name: "Vishakha", nadi: "Antya", gana: "Rakshasa", yoni: "Tiger" },
  { name: "Anuradha", nadi: "Madhya", gana: "Deva", yoni: "Deer" },
  { name: "Jyeshtha", nadi: "Adi", gana: "Rakshasa", yoni: "Deer" },
  { name: "Mula", nadi: "Adi", gana: "Rakshasa", yoni: "Dog" },
  { name: "Purva Ashadha", nadi: "Madhya", gana: "Manushya", yoni: "Monkey" },
  { name: "Uttara Ashadha", nadi: "Antya", gana: "Manushya", yoni: "Mongoose" },
  { name: "Shravana", nadi: "Antya", gana: "Deva", yoni: "Monkey" },
  { name: "Dhanishtha", nadi: "Madhya", gana: "Rakshasa", yoni: "Lion" },
  { name: "Shatabhisha", nadi: "Adi", gana: "Rakshasa", yoni: "Horse" },
  { name: "Purva Bhadrapada", nadi: "Adi", gana: "Manushya", yoni: "Lion" },
  { name: "Uttara Bhadrapada", nadi: "Madhya", gana: "Manushya", yoni: "Cow" },
  { name: "Revati", nadi: "Antya", gana: "Deva", yoni: "Elephant" },
];

const VARNA_RANK: Record<Varna, number> = {
  Brahmin: 4,
  Kshatriya: 3,
  Vaishya: 2,
  Shudra: 1,
};

const PLANET_FRIENDSHIP: Record<Planet, { friends: Planet[]; neutral: Planet[] }> = {
  Sun: { friends: ["Moon", "Mars", "Jupiter"], neutral: ["Mercury"] },
  Moon: { friends: ["Sun", "Mercury"], neutral: ["Mars", "Jupiter", "Venus", "Saturn"] },
  Mars: { friends: ["Sun", "Moon", "Jupiter"], neutral: ["Venus", "Saturn"] },
  Mercury: { friends: ["Sun", "Venus"], neutral: ["Mars", "Jupiter", "Saturn"] },
  Jupiter: { friends: ["Sun", "Moon", "Mars"], neutral: ["Saturn"] },
  Venus: { friends: ["Mercury", "Saturn"], neutral: ["Mars", "Jupiter"] },
  Saturn: { friends: ["Mercury", "Venus"], neutral: ["Jupiter"] },
};

type Relation = "friend" | "neutral" | "enemy";

function planetRelation(a: string, b: string): Relation {
  if (a === b) return "friend";
  const meta = PLANET_FRIENDSHIP[a as Planet];
  if (!meta) return "neutral";
  if (meta.friends.includes(b as Planet)) return "friend";
  if (meta.neutral.includes(b as Planet)) return "neutral";
  return "enemy";
}

const AYANAMSA_DEG = 24;

function julianDay(year: number, month: number, day: number, hourUtc: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd =
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    b -
    1524.5;
  return jd + hourUtc / 24;
}

function norm360(x: number): number {
  return ((x % 360) + 360) % 360;
}

interface Chart {
  rashiIndex: number;
  rashiName: string;
  rashiLord: string;
  nakshatraIndex: number;
  nakshatra: Nakshatra;
  varna: Varna;
  vashya: Vashya;
  tara: string;
  lagnaIndex: number;
  lagnaName: string;
  marsHouse: number;
}

function computeChart(input: PersonInput): Chart {
  const [yStr, mStr, dStr] = input.dateOfBirth.split("-");
  const [hhStr, mmStr] = input.timeOfBirth.split(":");
  const year = Number(yStr);
  const month = Number(mStr);
  const day = Number(dStr);
  const hours = Number(hhStr);
  const mins = Number(mmStr);

  const localHour = hours + mins / 60;
  const utcHour = localHour - input.longitude / 15;
  const jd = julianDay(year, month, day, utcHour);
  const d = jd - 2451545;

  const moonTropical = norm360(218.316 + 13.176396 * d);
  const sunTropical = norm360(280.46 + 0.9856474 * d);
  const marsTropical = norm360(355.45 + 0.5240207766 * d);

  const moonSidereal = norm360(moonTropical - AYANAMSA_DEG);
  const sunSidereal = norm360(sunTropical - AYANAMSA_DEG);
  const marsSidereal = norm360(marsTropical - AYANAMSA_DEG);

  const rashiIndex = Math.floor(moonSidereal / 30);
  const rashiName = RASHIS[rashiIndex];
  const rashiLord = RASHI_LORDS[rashiIndex];

  const nakshatraIndex = Math.floor(moonSidereal / (360 / 27));
  const nakshatra = NAKSHATRAS[nakshatraIndex];

  const lagnaLon = norm360(sunSidereal + utcHour * 15 + input.longitude);
  const lagnaIndex = Math.floor(lagnaLon / 30);
  const lagnaName = RASHIS[lagnaIndex];

  const marsRashi = Math.floor(marsSidereal / 30);
  const marsHouse = ((marsRashi - lagnaIndex + 12) % 12) + 1;

  return {
    rashiIndex,
    rashiName,
    rashiLord,
    nakshatraIndex,
    nakshatra,
    varna: VARNA_BY_RASHI[rashiIndex],
    vashya: VASHYA_BY_RASHI[rashiIndex],
    tara: nakshatra.name,
    lagnaIndex,
    lagnaName,
    marsHouse,
  };
}

function varnaScore(bride: Chart, groom: Chart): number {
  const b = VARNA_RANK[bride.varna] ?? 1;
  const g = VARNA_RANK[groom.varna] ?? 1;
  return g >= b ? 1 : 0;
}

function vashyaScore(bride: Chart, groom: Chart): number {
  if (bride.vashya === groom.vashya) return 2;
  const compat: Record<Vashya, Vashya[]> = {
    Chatushpada: ["Manava", "Vanachara"],
    Manava: ["Chatushpada", "Jalachara"],
    Jalachara: ["Manava", "Keeta"],
    Vanachara: ["Chatushpada"],
    Keeta: ["Jalachara"],
  };
  return compat[bride.vashya]?.includes(groom.vashya) ? 1 : 0;
}

function taraScore(bride: Chart, groom: Chart): number {
  const dist1 = ((groom.nakshatraIndex - bride.nakshatraIndex + 27) % 27) + 1;
  const dist2 = ((bride.nakshatraIndex - groom.nakshatraIndex + 27) % 27) + 1;
  const t1 = ((dist1 - 1) % 9) + 1;
  const t2 = ((dist2 - 1) % 9) + 1;
  const goodTaras = new Set([2, 4, 6, 7, 9]);
  return (goodTaras.has(t1) ? 1.5 : 0) + (goodTaras.has(t2) ? 1.5 : 0);
}

function yoniScore(bride: Chart, groom: Chart): number {
  const enemies: Record<string, string> = {
    Cow: "Tiger",
    Tiger: "Cow",
    Elephant: "Lion",
    Lion: "Elephant",
    Horse: "Buffalo",
    Buffalo: "Horse",
    Dog: "Deer",
    Deer: "Dog",
    Cat: "Rat",
    Rat: "Cat",
    Monkey: "Sheep",
    Sheep: "Monkey",
    Mongoose: "Serpent",
    Serpent: "Mongoose",
  };
  if (bride.nakshatra.yoni === groom.nakshatra.yoni) return 4;
  if (enemies[bride.nakshatra.yoni] === groom.nakshatra.yoni) return 0;
  return 3;
}

function grahaMaitriScore(bride: Chart, groom: Chart): number {
  const rel = planetRelation(bride.rashiLord, groom.rashiLord);
  if (rel === "friend") return 5;
  if (rel === "neutral") return 3;
  return 1;
}

function ganaScore(bride: Chart, groom: Chart): number {
  const a = bride.nakshatra.gana;
  const b = groom.nakshatra.gana;
  if (a === b) return 6;
  if ((a === "Deva" && b === "Manushya") || (a === "Manushya" && b === "Deva")) return 5;
  if ((a === "Manushya" && b === "Rakshasa") || (a === "Rakshasa" && b === "Manushya")) return 1;
  return 0;
}

function bhakootScore(bride: Chart, groom: Chart): { score: number; affected: boolean } {
  const distA = ((groom.rashiIndex - bride.rashiIndex + 12) % 12) + 1;
  const distB = ((bride.rashiIndex - groom.rashiIndex + 12) % 12) + 1;
  const pair = new Set([distA, distB]);
  const bad =
    (pair.has(2) && pair.has(12)) ||
    (pair.has(5) && pair.has(9)) ||
    (pair.has(6) && pair.has(8));
  return { score: bad ? 0 : 7, affected: bad };
}

function nadiScore(bride: Chart, groom: Chart): { score: number; affected: boolean } {
  const same = bride.nakshatra.nadi === groom.nakshatra.nadi;
  return { score: same ? 0 : 8, affected: same };
}

function ratingFor(score: number): { verdict: Verdict; label: string; emoji: string } {
  if (score >= 28) return { verdict: "excellent", label: "Excellent", emoji: "🟢" };
  if (score >= 22) return { verdict: "good", label: "Good", emoji: "🟡" };
  if (score >= 18) return { verdict: "average", label: "Average", emoji: "🟠" };
  return { verdict: "risky", label: "Risky", emoji: "🔴" };
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

const KUTA_BLURBS: Record<string, [string, string, string]> = {
  Varna: [
    "Spiritual compatibility is well-aligned.",
    "Spiritual outlooks differ but can coexist.",
    "Spiritual values may need negotiation.",
  ],
  Vashya: [
    "Mutual influence flows easily between partners.",
    "Workable balance of give and take.",
    "One partner may dominate; conscious balance helps.",
  ],
  Tara: [
    "Health and luck support the union.",
    "Mostly supportive with minor friction.",
    "Watch for setbacks; care for each other's wellbeing.",
  ],
  Yoni: [
    "Strong natural attraction and intimacy.",
    "Adequate compatibility; intimacy needs intention.",
    "Inherent friction; tenderness must be cultivated.",
  ],
  "Graha Maitri": [
    "Mental wavelengths align beautifully.",
    "Mostly compatible mindsets.",
    "Different mental frequencies; communication is key.",
  ],
  Gana: [
    "Temperaments harmonize well.",
    "Different but workable temperaments.",
    "Temperaments clash; patience required.",
  ],
  Bhakoot: [
    "Emotional and material life flows well.",
    "—",
    "Bhakoot Dosha present; consult remedies.",
  ],
  Nadi: [
    "No Nadi Dosha; biological compatibility supported.",
    "—",
    "Nadi Dosha present; carefully consider compatibility.",
  ],
};

function describeKuta(
  name: string,
  score: number,
  max: number,
): { status: KutaStatus; description: string } {
  const ratio = score / max;
  let status: KutaStatus;
  if (ratio >= 0.7) status = "good";
  else if (ratio >= 0.34) status = "caution";
  else status = "poor";
  const idx = status === "good" ? 0 : status === "caution" ? 1 : 2;
  return { status, description: KUTA_BLURBS[name]?.[idx] ?? "" };
}

interface Compatibility {
  person1Chart: Chart;
  person2Chart: Chart;
  totalScore: number;
  kutaScores: Array<{
    name: string;
    score: number;
    max: number;
    status: KutaStatus;
    description: string;
  }>;
  manglik: { p1: boolean; p2: boolean };
  bhakoot: { affected: boolean };
  nadi: { affected: boolean };
}

function calculateCompatibility(p1Input: PersonInput, p2Input: PersonInput): Compatibility {
  const p1 = computeChart(p1Input);
  const p2 = computeChart(p2Input);

  const varna = varnaScore(p1, p2);
  const vashya = vashyaScore(p1, p2);
  const tara = taraScore(p1, p2);
  const yoni = yoniScore(p1, p2);
  const graha = grahaMaitriScore(p1, p2);
  const gana = ganaScore(p1, p2);
  const bhakoot = bhakootScore(p1, p2);
  const nadi = nadiScore(p1, p2);

  const entries = [
    { name: "Varna", score: varna, max: 1 },
    { name: "Vashya", score: vashya, max: 2 },
    { name: "Tara", score: tara, max: 3 },
    { name: "Yoni", score: yoni, max: 4 },
    { name: "Graha Maitri", score: graha, max: 5 },
    { name: "Gana", score: gana, max: 6 },
    { name: "Bhakoot", score: bhakoot.score, max: 7 },
    { name: "Nadi", score: nadi.score, max: 8 },
  ];

  const kutaScores = entries.map((e) => ({ ...e, ...describeKuta(e.name, e.score, e.max) }));
  const total = entries.reduce((acc, e) => acc + e.score, 0);

  const manglikHouses = new Set([1, 4, 7, 8, 12]);
  const manglik = {
    p1: manglikHouses.has(p1.marsHouse),
    p2: manglikHouses.has(p2.marsHouse),
  };

  return {
    person1Chart: p1,
    person2Chart: p2,
    totalScore: total,
    kutaScores,
    manglik,
    bhakoot: { affected: bhakoot.affected },
    nadi: { affected: nadi.affected },
  };
}

function personSummary(input: PersonInput, chart: Chart, matchTara: string): PersonSummary {
  return {
    name: input.name,
    gender: input.gender,
    lagna: chart.lagnaName,
    rashi: chart.rashiName,
    nakshatra: chart.nakshatra.name,
    nadi: chart.nakshatra.nadi,
    gana: chart.nakshatra.gana,
    varna: chart.varna,
    yoni: chart.nakshatra.yoni,
    vashya: chart.vashya,
    tara: matchTara,
    grahaMaitri: chart.rashiLord,
  };
}

export function buildReport(p1Input: PersonInput, p2Input: PersonInput): MatchReport {
  const calc = calculateCompatibility(p1Input, p2Input);
  const max = 36;
  const percent = Math.round((calc.totalScore / max) * 1000) / 10;
  const rating = ratingFor(calc.totalScore);

  const t1 =
    ((calc.person2Chart.nakshatraIndex - calc.person1Chart.nakshatraIndex + 27) % 27) + 1;
  const t2 =
    ((calc.person1Chart.nakshatraIndex - calc.person2Chart.nakshatraIndex + 27) % 27) + 1;
  const taraName = (n: number) => `Tara ${((n - 1) % 9) + 1}`;

  const manglikImpact: Impact =
    calc.manglik.p1 && calc.manglik.p2
      ? "low"
      : calc.manglik.p1 || calc.manglik.p2
        ? "medium"
        : "none";
  const bhakootImpact: Impact = calc.bhakoot.affected ? "high" : "none";
  const nadiImpact: Impact = calc.nadi.affected ? "high" : "none";

  const kuta = (name: string) => calc.kutaScores.find((k) => k.name === name)!;

  const mental = clamp((kuta("Graha Maitri").score / 5) * 5 + (kuta("Gana").score / 6) * 5, 0, 10);
  const emotional = clamp(
    (kuta("Bhakoot").score / 7) * 6 + (calc.nadi.affected ? 0 : 4),
    0,
    10,
  );
  const physical = clamp((kuta("Yoni").score / 4) * 6 + (kuta("Vashya").score / 2) * 4, 0, 10);
  const communication = clamp((kuta("Tara").score / 3) * 6 + (kuta("Varna").score / 1) * 4, 0, 10);
  const lifestyleBase = (calc.totalScore / max) * 10;
  const lifestyle = clamp(
    lifestyleBase - (manglikImpact === "medium" ? 1.5 : manglikImpact === "low" ? 0.5 : 0),
    0,
    10,
  );

  const round1 = (n: number) => Math.round(n * 10) / 10;
  const longevity = round1(clamp((calc.totalScore / max) * 9 + (calc.nadi.affected ? -1 : 1), 0, 10));
  const growth = round1(clamp((kuta("Graha Maitri").score / 5 + kuta("Gana").score / 6) * 5, 0, 10));
  const conflictRisk: ConflictRisk =
    calc.bhakoot.affected || calc.nadi.affected
      ? "high"
      : calc.totalScore < 22
        ? "medium"
        : "low";

  const strengths: string[] = [];
  const challenges: string[] = [];
  for (const k of calc.kutaScores) {
    if (k.status === "good") strengths.push(`${k.name}: ${k.description}`);
    if (k.status === "poor") challenges.push(`${k.name}: ${k.description}`);
  }
  if (calc.manglik.p1 || calc.manglik.p2) {
    challenges.push(
      calc.manglik.p1 && calc.manglik.p2
        ? "Both partners are Manglik — the doshas neutralize each other."
        : `${calc.manglik.p1 ? p1Input.name : p2Input.name} is Manglik — consider traditional remedies.`,
    );
  }
  if (calc.bhakoot.affected)
    challenges.push("Bhakoot Dosha may bring emotional or financial friction.");
  if (calc.nadi.affected)
    challenges.push("Nadi Dosha is present — health and progeny considerations advised.");

  const recommendation =
    rating.verdict === "excellent"
      ? "An auspicious match. Proceed with confidence and shared rituals to honor the union."
      : rating.verdict === "good"
        ? "A positive match overall. Address the noted areas with open communication."
        : rating.verdict === "average"
          ? "Workable, but conscious effort is needed. Consider counsel from a trusted astrologer."
          : "Several signals warrant pause. Reflect carefully and seek guidance before proceeding.";

  const keyInsight =
    rating.verdict === "excellent"
      ? `${p1Input.name} and ${p2Input.name} share strong cosmic alignment across most kootas.`
      : rating.verdict === "good"
        ? `${p1Input.name} and ${p2Input.name} have a generally harmonious match with a few areas to navigate.`
        : rating.verdict === "average"
          ? `${p1Input.name} and ${p2Input.name} have a mixed compatibility — strengths and challenges in balance.`
          : `${p1Input.name} and ${p2Input.name} face notable astrological challenges; tread thoughtfully.`;

  const verdictText =
    !calc.bhakoot.affected && !calc.nadi.affected && manglikImpact === "none"
      ? "No major doshas detected — the chart is clear."
      : "Doshas present — review notes and consider traditional remedies.";

  return {
    person1: personSummary(p1Input, calc.person1Chart, taraName(t1)),
    person2: personSummary(p2Input, calc.person2Chart, taraName(t2)),
    overallScore: Math.round(calc.totalScore * 10) / 10,
    maxScore: max,
    compatibilityPercent: percent,
    verdict: rating.verdict,
    keyInsight,
    kutaScores: calc.kutaScores,
    doshas: {
      manglik: {
        person1Affected: calc.manglik.p1,
        person2Affected: calc.manglik.p2,
        impact: manglikImpact,
        note:
          manglikImpact === "none"
            ? "Neither partner has Mangal Dosha."
            : manglikImpact === "low"
              ? "Both partners share Manglik status; the dosha is mutually neutralized."
              : `${calc.manglik.p1 ? p1Input.name : p2Input.name} carries Mangal Dosha; remedies suggested.`,
      },
      bhakoot: {
        present: calc.bhakoot.affected,
        impact: bhakootImpact,
        note: calc.bhakoot.affected
          ? "Moon-sign placement triggers Bhakoot Dosha. Watch for friction in shared resources."
          : "No Bhakoot Dosha — emotional and material flow is smooth.",
      },
      nadi: {
        present: calc.nadi.affected,
        impact: nadiImpact,
        note: calc.nadi.affected
          ? "Both partners share the same Nadi — considered the most serious dosha."
          : "Different Nadis — biological compatibility supported.",
      },
      verdict: verdictText,
    },
    compatibilityMatrix: [
      {
        category: "Mental",
        score: round1(mental),
        insight:
          mental >= 7
            ? "Aligned thinking patterns."
            : mental >= 4
              ? "Workable mental rapport."
              : "Different mental wavelengths.",
      },
      {
        category: "Emotional",
        score: round1(emotional),
        insight:
          emotional >= 7
            ? "Emotional currents flow easily."
            : emotional >= 4
              ? "Adequate emotional bond, room to grow."
              : "Emotional alignment needs care.",
      },
      {
        category: "Physical",
        score: round1(physical),
        insight:
          physical >= 7
            ? "Strong physical chemistry."
            : physical >= 4
              ? "Cooperative physical compatibility."
              : "Friction in physical compatibility.",
      },
      {
        category: "Communication",
        score: round1(communication),
        insight:
          communication >= 7
            ? "Expressive, easy communication."
            : communication >= 4
              ? "Communication flows with effort."
              : "Misunderstandings likely; practice patience.",
      },
      {
        category: "Lifestyle",
        score: round1(lifestyle),
        insight:
          lifestyle >= 7
            ? "Shared lifestyle rhythms."
            : lifestyle >= 4
              ? "Lifestyle differences manageable."
              : "Different lifestyle priorities.",
      },
    ],
    stability: {
      longevityScore: longevity,
      conflictRisk,
      growthPotential: growth,
      conclusion:
        conflictRisk === "low"
          ? "A stable foundation with strong potential for lasting growth."
          : conflictRisk === "medium"
            ? "Stability is workable but requires intentional partnership."
            : "Notable risk of conflict; deliberate effort and counsel are advised.",
    },
    finalVerdict: {
      rating: rating.verdict,
      label: rating.label,
      emoji: rating.emoji,
      strengths: strengths.length
        ? strengths.slice(0, 5)
        : ["A balanced foundation across the eight kootas."],
      challenges: challenges.length
        ? challenges.slice(0, 5)
        : ["No major challenges detected — minor everyday differences only."],
      recommendation,
    },
  };
}
