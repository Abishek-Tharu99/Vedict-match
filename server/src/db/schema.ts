import { jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import type { MatchReport, MatchRequest } from "@vedic-match/shared";

export const reportsTable = pgTable("match_reports", {
  id: serial("id").primaryKey(),
  // sha-256 of the capability token; the plaintext token is only ever returned once.
  tokenHash: text("token_hash").notNull(),
  request: jsonb("request").$type<MatchRequest>().notNull(),
  report: jsonb("report").$type<MatchReport>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ReportRow = typeof reportsTable.$inferSelect;
