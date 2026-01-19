import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, boolean, integer, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Predefined lists for product fields
export const HEALTHCARE_TAGS = [
  "Maternal Health",
  "Neonatal & Child Health",
  "Non-Communicable Diseases (NCDs)",
  "Communicable Diseases",
  "General Screening",
  "Health Workforce Support",
  "Health System Operations"
] as const;

export const STAGE_OF_DEVELOPMENT = [
  "Launched",
  "Pilot deployments in Africa",
  "Pilot deployments outside of Africa",
  "Implemented in Africa",
  "Implemented outside of Africa",
  "Validation Studies done"
] as const;

export const OFFLINE_CAPABILITY_OPTIONS = ["Yes", "No", "Limited"] as const;

export const VIDEO_TYPES = [
  "Demo video",
  "Marketing video",
  "Walkthrough/tutorial"
] as const;

export const REGULATORY_APPROVALS = [
  "FDA Approval (USA)",
  "CE Mark (EU)",
  "UKCA Mark",
  "Approval in HQ Country",
  "Approval in African Countries",
  "Other Regulatory Approval"
] as const;

export const COMPLIANCE_CERTIFICATIONS = [
  "ISO",
  "IEC",
  "GMP",
  "GDPR",
  "HIPAA",
  "Other Compliance Certifications"
] as const;

export const USER_TYPES = [
  "Community Health Workers (CHWs)",
  "Public Health Officers",
  "Health Extension Workers",
  "Nurses",
  "Midwives",
  "Physician Assistants"
] as const;

export const VISITOR_ROLES = [
  "CHW",
  "Nurse",
  "Program Manager",
  "MOH",
  "Other"
] as const;

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
  oneLineDescription: text("one_line_description"),
  company: text("company").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  videoUrl: text("video_url"),
  videoType: text("video_type"),
  website: text("website"),
  features: json("features").$type<string[]>().default([]),
  sectionId: integer("section_id").notNull(),
  sectionName: text("section_name").notNull(),
  onDisplay: boolean("on_display").default(true),
  viewCount: integer("view_count").default(0),
  videoClickCount: integer("video_click_count").default(0),
  websiteClickCount: integer("website_click_count").default(0),
  
  // New fields for redesigned catalogue
  useCase: text("use_case"),
  healthcareTags: json("healthcare_tags").$type<string[]>().default([]),
  stageOfDevelopment: json("stage_of_development").$type<string[]>().default([]),
  geography: text("geography"),
  reportedOutcomes: text("reported_outcomes"),
  dataCollected: json("data_collected").$type<string[]>().default([]),
  offlineCapability: text("offline_capability"),
  integration: json("integration").$type<string[]>().default([]),
  regulatoryApprovals: json("regulatory_approvals").$type<string[]>().default([]),
  complianceCertifications: json("compliance_certifications").$type<string[]>().default([]),
  whatsInTheBox: text("whats_in_the_box"),
  componentWeight: text("component_weight"),
  powerBattery: text("power_battery"),
  connectivity: text("connectivity"),
  environmentalConditions: text("environmental_conditions"),
  userTypes: json("user_types").$type<string[]>().default([]),
  cost: text("cost"),
  strengths: text("strengths"),
  considerations: text("considerations"),
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
  visitorRole: text("visitor_role"),
  visitorRoleOther: text("visitor_role_other"),
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
  visitorRole: true,
  visitorRoleOther: true,
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
