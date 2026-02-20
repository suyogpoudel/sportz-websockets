import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  timestamp,
  integer,
  json,
  text,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enum for match status
export const matchStatusEnum = pgEnum("match_status", [
  "scheduled",
  "live",
  "finished",
]);

// Matches table
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  sport: varchar("sport").notNull(),
  homeTeam: varchar("home_team").notNull(),
  awayTeam: varchar("away_team").notNull(),
  status: matchStatusEnum("status").notNull().default("scheduled"),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }),
  homeScore: integer("home_score").notNull().default(0),
  awayScore: integer("away_score").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Commentary table
export const commentary = pgTable("commentary", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id")
    .notNull()
    .references(() => matches.id, { onDelete: "cascade" }),
  minute: integer("minute").notNull(),
  sequence: integer("sequence").notNull(),
  period: varchar("period").notNull(),
  eventType: varchar("event_type").notNull(),
  actor: varchar("actor").notNull(),
  team: varchar("team").notNull(),
  message: text("message").notNull(),
  metadata: json("metadata"),
  tags: text("tags"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Relations
export const matchesRelations = relations(matches, ({ many }) => ({
  commentary: many(commentary),
}));

export const commentaryRelations = relations(commentary, ({ one }) => ({
  match: one(matches, {
    fields: [commentary.matchId],
    references: [matches.id],
  }),
}));
