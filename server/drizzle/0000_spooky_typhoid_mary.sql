CREATE TABLE "blogs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"cover_image" text,
	"author" text NOT NULL,
	"category" text,
	"published" boolean DEFAULT false,
	"featured" boolean DEFAULT false,
	"views" integer DEFAULT 0,
	"reading_time" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "blogs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "match_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"token_hash" text NOT NULL,
	"request" jsonb NOT NULL,
	"report" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
