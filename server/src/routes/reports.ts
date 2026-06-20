import { Router } from "express";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import {
  DeleteReportParams,
  GetReportParams,
  GetReportResponse,
  ReportTokenQuery,
  SaveReportBody,
  SaveReportResponse,
} from "@vedic-match/shared";
import { db } from "../db/index.js";
import { reportsTable } from "../db/schema.js";
import { buildReport } from "../lib/vedic.js";

const router = Router();

function newToken() {
  return randomBytes(32).toString("base64url");
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function tokenMatches(provided: string, storedHash: string) {
  const a = Buffer.from(hashToken(provided), "hex");
  const b = Buffer.from(storedHash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

router.post("/reports", async (req, res) => {
  const parsed = SaveReportBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const report = buildReport(parsed.data.person1, parsed.data.person2);
  const token = newToken();

  const [row] = await db
    .insert(reportsTable)
    .values({
      tokenHash: hashToken(token),
      request: parsed.data,
      report,
    })
    .returning();

  if (!row) {
    res.status(500).json({ error: "Failed to save report" });
    return;
  }

  res.status(201).json(
    SaveReportResponse.parse({
      id: row.id,
      createdAt: row.createdAt.toISOString(),
      request: row.request,
      report: row.report,
      token,
    }),
  );
});

router.get("/reports/:id", async (req, res) => {
  const params = GetReportParams.safeParse(req.params);
  const query = ReportTokenQuery.safeParse(req.query);
  if (!params.success || !query.success) {
    res.status(400).json({ error: "A valid report id and token are required" });
    return;
  }

  const [row] = await db.select().from(reportsTable).where(eq(reportsTable.id, params.data.id));
  // Same 404 for "missing" and "wrong token" so we never confirm a report exists.
  if (!row || !tokenMatches(query.data.t, row.tokenHash)) {
    res.status(404).json({ error: "Report not found" });
    return;
  }

  res.json(
    GetReportResponse.parse({
      id: row.id,
      createdAt: row.createdAt.toISOString(),
      request: row.request,
      report: row.report,
    }),
  );
});

router.delete("/reports/:id", async (req, res) => {
  const params = DeleteReportParams.safeParse(req.params);
  const query = ReportTokenQuery.safeParse(req.query);
  if (!params.success || !query.success) {
    res.status(400).json({ error: "A valid report id and token are required" });
    return;
  }

  const [row] = await db.select().from(reportsTable).where(eq(reportsTable.id, params.data.id));
  if (!row || !tokenMatches(query.data.t, row.tokenHash)) {
    res.status(404).json({ error: "Report not found" });
    return;
  }

  await db.delete(reportsTable).where(eq(reportsTable.id, row.id));
  res.sendStatus(204);
});

export default router;
