import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Product schema
export const products = pgTable("products", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  audioUrl: text("audio_url"),
  features: json("features").$type<string[]>().default([]),
  sectionId: integer("section_id").notNull(),
  sectionName: text("section_name").notNull(),
  onDisplay: boolean("on_display").default(true),
});

// Feedback schema
export const feedback = pgTable("feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  visitorName: text("visitor_name"),
  visitorEmail: text("visitor_email"),
  visitorCompany: text("visitor_company"),
  interestingProducts: json("interesting_products").$type<string[]>().default([]),
  comments: text("comments"),
  submittedAt: text("submitted_at").default(sql`CURRENT_TIMESTAMP`),
});

// Insert schemas
export const insertProductSchema = createInsertSchema(products);
export const insertFeedbackSchema = createInsertSchema(feedback).pick({
  visitorName: true,
  visitorEmail: true,
  visitorCompany: true,
  interestingProducts: true,
  comments: true,
});

// Types
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;

// Section type (not stored in DB, defined in JSON)
export type Section = {
  id: number;
  name: string;
  description: string;
  color: string;
};
