import { Router } from "express";
import { GeocodePlaceQueryParams, GeocodePlaceResponse } from "@vedic-match/shared";

const router = Router();

interface OpenMeteoResult {
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

router.get("/geocode", async (req, res) => {
  const parsed = GeocodePlaceQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { q } = parsed.data;
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    q,
  )}&count=5&language=en&format=json`;

  try {
    const apiRes = await fetch(url);
    if (!apiRes.ok) {
      req.log.error({ status: apiRes.status }, "Geocoding upstream failed");
      res.status(502).json({ error: "Geocoding service failed" });
      return;
    }
    const json = (await apiRes.json()) as { results?: OpenMeteoResult[] };
    const results = (json.results ?? []).map((r) => {
      const parts = [r.name, r.admin1, r.country].filter(Boolean);
      return {
        name: parts.join(", "),
        latitude: r.latitude,
        longitude: r.longitude,
        timezone: r.timezone,
        country: r.country ?? null,
        admin1: r.admin1 ?? null,
      };
    });
    res.json(GeocodePlaceResponse.parse({ results }));
  } catch (err) {
    req.log.error({ err }, "Geocoding error");
    res.status(502).json({ error: "Geocoding service unreachable" });
  }
});

export default router;
