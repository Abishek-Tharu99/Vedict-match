import { uuid, boolean, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
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


export const blogs = pgTable("blogs", {
  id: uuid("id").defaultRandom().primaryKey(),

  title: text("title").notNull(),

  slug: text("slug").notNull().unique(),

  excerpt: text("excerpt"),

  content: text("content").notNull(),

  coverImage: text("cover_image"),

  author: text("author").notNull(),

  category: text("category"),

  published: boolean("published").default(false),

  featured: boolean("featured").default(false),

  views: integer("views").default(0),

  readingTime: integer("reading_time"),

  createdAt: timestamp("created_at").defaultNow(),

  updatedAt: timestamp("updated_at").defaultNow(),
});