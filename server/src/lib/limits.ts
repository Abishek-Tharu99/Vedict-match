import rateLimit from "express-rate-limit";
import type { Request, Response } from "express";

function tooMany(req: Request, res: Response) {
  req.log?.warn({ ip: req.ip, path: req.path }, "rate limit hit");
  res.status(429).json({ error: "Too many requests — please slow down." });
}

export const apiLimiter = rateLimit({
  windowMs: 60_000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler: tooMany,
});

// geocode proxies an external API, match runs the engine, and saving writes to
// the db — keep those on a shorter leash than plain reads.
export const heavyLimiter = rateLimit({
  windowMs: 60_000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: tooMany,
});
