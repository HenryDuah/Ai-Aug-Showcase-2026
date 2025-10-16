import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, boolean, integer, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Product schema
export const products = pgTable("products", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  videoUrl: text("video_url"),
  videoType: text("video_type"),
  brochureUrl: text("brochure_url"),
  website: text("website"),
  theImpact: text("the_impact").notNull(),
  features: json("features").$type<string[]>().default([]),
  sectionId: integer("section_id").notNull(),
  sectionName: text("section_name").notNull(),
  onDisplay: boolean("on_display").default(true),
});

// Feedback schema
export const feedback = pgTable("feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  visitorName: text("visitor_name").notNull(),
  visitorCompany: text("visitor_company").notNull(),
  visitorEmail: text("visitor_email"),
  visitorPhone: text("visitor_phone"),
  comments: text("comments"),
  submittedAt: text("submitted_at").default(sql`CURRENT_TIMESTAMP`),
});

// Product Feedback schema
export const productFeedback = pgTable("product_feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull(),
  visitorName: text("visitor_name"),
  visitorEmail: text("visitor_email"),
  comments: text("comments"),
  submittedAt: text("submitted_at").default(sql`CURRENT_TIMESTAMP`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users);
export const insertProductSchema = createInsertSchema(products).omit({ id: true });
export const insertFeedbackSchema = createInsertSchema(feedback).pick({
  visitorName: true,
  visitorCompany: true,
  visitorEmail: true,
  visitorPhone: true,
  comments: true,
});
export const insertProductFeedbackSchema = createInsertSchema(productFeedback).pick({
  productId: true,
  visitorName: true,
  visitorEmail: true,
  comments: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type ProductFeedback = typeof productFeedback.$inferSelect;
export type InsertProductFeedback = z.infer<typeof insertProductFeedbackSchema>;

// Section type (not stored in DB, defined in JSON)
export type Section = {
  id: number;
  name: string;
  description: string;
  color: string;
};
