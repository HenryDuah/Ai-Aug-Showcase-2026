import { type Product, type InsertProduct, type Feedback, type InsertFeedback, type ProductFeedback, type InsertProductFeedback, type User, type InsertUser, products, feedback, productFeedback, users } from "@shared/schema";
import { randomUUID } from "crypto";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, and } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProductsBySection(sectionId: number): Promise<Product[]>;
  getAllProductsBySection(sectionId: number): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<boolean>;

  // Analytics tracking methods
  incrementViewCount(productId: string): Promise<Product | undefined>;
  incrementVideoClickCount(productId: string): Promise<Product | undefined>;
  incrementWebsiteClickCount(productId: string): Promise<Product | undefined>;

  // Feedback methods
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getAllFeedback(): Promise<Feedback[]>;

  // Product Feedback methods
  createProductFeedback(feedback: InsertProductFeedback): Promise<ProductFeedback>;
  getProductFeedbackByProductId(productId: string): Promise<ProductFeedback[]>;
  getAllProductFeedback(): Promise<ProductFeedback[]>;

  // User methods
  getUserByUsername(username: string): Promise<User | undefined>;
  getUser(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Session store
  sessionStore: any;
}

const PRODUCTS_FILE = join(__dirname, "data", "products.json");

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private feedbacks: Map<string, Feedback>;
  public sessionStore: any;

  constructor() {
    this.products = new Map();
    this.feedbacks = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    this.loadProducts();
  }

  private loadProducts() {
    try {
      const data = readFileSync(PRODUCTS_FILE, "utf-8");
      const { products } = JSON.parse(data);
      products.forEach((product: Product) => {
        this.products.set(product.id, product);
      });
    } catch (error) {
      console.error("Failed to load products from JSON:", error);
    }
  }

  private saveProducts() {
    try {
      const products = Array.from(this.products.values());
      const data = JSON.stringify({ products }, null, 2);
      writeFileSync(PRODUCTS_FILE, data, "utf-8");
    } catch (error) {
      console.error("Failed to save products to JSON:", error);
    }
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsBySection(sectionId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.sectionId === sectionId && product.onDisplay
    );
  }

  async getAllProductsBySection(sectionId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.sectionId === sectionId
    );
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      features: insertProduct.features ? [...insertProduct.features] : null,
      videoUrl: insertProduct.videoUrl ?? null,
      videoType: insertProduct.videoType ?? null,
      brochureUrl: insertProduct.brochureUrl ?? null,
      website: insertProduct.website ?? null,
      onDisplay: insertProduct.onDisplay ?? true,
      viewCount: 0,
      videoClickCount: 0,
      websiteClickCount: 0,
      useCase: insertProduct.useCase ?? null,
      healthcareTags: insertProduct.healthcareTags ? [...insertProduct.healthcareTags] : null,
      stageOfDevelopment: insertProduct.stageOfDevelopment ? [...insertProduct.stageOfDevelopment] : null,
      geography: insertProduct.geography ?? null,
      reportedOutcomes: insertProduct.reportedOutcomes ?? null,
      dataCollected: insertProduct.dataCollected ? [...insertProduct.dataCollected] : null,
      offlineCapability: insertProduct.offlineCapability ?? null,
      integration: insertProduct.integration ? [...insertProduct.integration] : null,
      regulatoryApprovals: insertProduct.regulatoryApprovals ? [...insertProduct.regulatoryApprovals] : null,
      complianceCertifications: insertProduct.complianceCertifications ? [...insertProduct.complianceCertifications] : null,
      whatsInTheBox: insertProduct.whatsInTheBox ?? null,
      componentWeight: insertProduct.componentWeight ?? null,
      powerBattery: insertProduct.powerBattery ?? null,
      connectivity: insertProduct.connectivity ?? null,
      environmentalConditions: insertProduct.environmentalConditions ?? null,
      userTypes: insertProduct.userTypes ? [...insertProduct.userTypes] : null,
      cost: insertProduct.cost ?? null,
      strengths: insertProduct.strengths ?? null,
      considerations: insertProduct.considerations ?? null,
    };
    this.products.set(id, product);
    this.saveProducts();
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const existing = this.products.get(id);
    if (!existing) {
      throw new Error(`Product with id ${id} not found`);
    }
    // Ensure features is properly typed as string[] when present
    const normalizedUpdates = {
      ...updates,
      ...(updates.features && { features: Array.isArray(updates.features) ? updates.features : null }),
    };
    const updated = { ...existing, ...normalizedUpdates };
    this.products.set(id, updated);
    this.saveProducts();
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const deleted = this.products.delete(id);
    if (deleted) {
      this.saveProducts();
    }
    return deleted;
  }

  async incrementViewCount(productId: string): Promise<Product | undefined> {
    const product = this.products.get(productId);
    if (!product) return undefined;
    
    const updated = { ...product, viewCount: (product.viewCount ?? 0) + 1 };
    this.products.set(productId, updated);
    this.saveProducts();
    return updated;
  }

  async incrementVideoClickCount(productId: string): Promise<Product | undefined> {
    const product = this.products.get(productId);
    if (!product) return undefined;
    
    const updated = { ...product, videoClickCount: (product.videoClickCount ?? 0) + 1 };
    this.products.set(productId, updated);
    this.saveProducts();
    return updated;
  }

  async incrementWebsiteClickCount(productId: string): Promise<Product | undefined> {
    const product = this.products.get(productId);
    if (!product) return undefined;
    
    const updated = { ...product, websiteClickCount: (product.websiteClickCount ?? 0) + 1 };
    this.products.set(productId, updated);
    this.saveProducts();
    return updated;
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const [newFeedback] = await db.insert(feedback).values({
      visitorName: insertFeedback.visitorName,
      visitorCompany: insertFeedback.visitorCompany,
      visitorEmail: insertFeedback.visitorEmail ?? null,
      visitorPhone: insertFeedback.visitorPhone ?? null,
      comments: insertFeedback.comments ?? null,
    }).returning();
    return newFeedback;
  }

  async getAllFeedback(): Promise<Feedback[]> {
    return await db.select().from(feedback);
  }

  async createProductFeedback(insertProductFeedback: InsertProductFeedback): Promise<ProductFeedback> {
    const [newProductFeedback] = await db.insert(productFeedback).values({
      productId: insertProductFeedback.productId,
      visitorName: insertProductFeedback.visitorName ?? null,
      visitorEmail: insertProductFeedback.visitorEmail ?? null,
      visitorRole: insertProductFeedback.visitorRole ?? null,
      visitorRoleOther: insertProductFeedback.visitorRoleOther ?? null,
      comments: insertProductFeedback.comments ?? null,
    }).returning();
    return newProductFeedback;
  }

  async getProductFeedbackByProductId(productId: string): Promise<ProductFeedback[]> {
    return await db.select().from(productFeedback).where(eq(productFeedback.productId, productId));
  }

  async getAllProductFeedback(): Promise<ProductFeedback[]> {
    return await db.select().from(productFeedback);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
}

// Database-backed storage for production use
export class DbStorage implements IStorage {
  public sessionStore: any;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductsBySection(sectionId: number): Promise<Product[]> {
    return await db.select().from(products).where(
      and(
        eq(products.sectionId, sectionId),
        eq(products.onDisplay, true)
      )
    );
  }

  async getAllProductsBySection(sectionId: number): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.sectionId, sectionId));
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const [product] = await db.insert(products).values({
      id,
      name: insertProduct.name,
      company: insertProduct.company,
      type: insertProduct.type,
      description: insertProduct.description,
      image: insertProduct.image,
      videoUrl: insertProduct.videoUrl ?? null,
      videoType: insertProduct.videoType ?? null,
      brochureUrl: insertProduct.brochureUrl ?? null,
      website: insertProduct.website ?? null,
      theImpact: insertProduct.theImpact,
      features: insertProduct.features ? [...insertProduct.features] : [],
      sectionId: insertProduct.sectionId,
      sectionName: insertProduct.sectionName,
      onDisplay: insertProduct.onDisplay ?? true,
    }).returning();
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const [product] = await db.update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id)).returning();
    return result.length > 0;
  }

  async incrementViewCount(productId: string): Promise<Product | undefined> {
    const product = await this.getProductById(productId);
    if (!product) return undefined;
    
    const [updated] = await db.update(products)
      .set({ viewCount: (product.viewCount ?? 0) + 1 })
      .where(eq(products.id, productId))
      .returning();
    return updated;
  }

  async incrementVideoClickCount(productId: string): Promise<Product | undefined> {
    const product = await this.getProductById(productId);
    if (!product) return undefined;
    
    const [updated] = await db.update(products)
      .set({ videoClickCount: (product.videoClickCount ?? 0) + 1 })
      .where(eq(products.id, productId))
      .returning();
    return updated;
  }

  async incrementWebsiteClickCount(productId: string): Promise<Product | undefined> {
    const product = await this.getProductById(productId);
    if (!product) return undefined;
    
    const [updated] = await db.update(products)
      .set({ websiteClickCount: (product.websiteClickCount ?? 0) + 1 })
      .where(eq(products.id, productId))
      .returning();
    return updated;
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const [newFeedback] = await db.insert(feedback).values({
      visitorName: insertFeedback.visitorName,
      visitorCompany: insertFeedback.visitorCompany,
      visitorEmail: insertFeedback.visitorEmail ?? null,
      visitorPhone: insertFeedback.visitorPhone ?? null,
      comments: insertFeedback.comments ?? null,
    }).returning();
    return newFeedback;
  }

  async getAllFeedback(): Promise<Feedback[]> {
    return await db.select().from(feedback);
  }

  async createProductFeedback(insertProductFeedback: InsertProductFeedback): Promise<ProductFeedback> {
    const [newProductFeedback] = await db.insert(productFeedback).values({
      productId: insertProductFeedback.productId,
      visitorName: insertProductFeedback.visitorName ?? null,
      visitorEmail: insertProductFeedback.visitorEmail ?? null,
      visitorRole: insertProductFeedback.visitorRole ?? null,
      visitorRoleOther: insertProductFeedback.visitorRoleOther ?? null,
      comments: insertProductFeedback.comments ?? null,
    }).returning();
    return newProductFeedback;
  }

  async getProductFeedbackByProductId(productId: string): Promise<ProductFeedback[]> {
    return await db.select().from(productFeedback).where(eq(productFeedback.productId, productId));
  }

  async getAllProductFeedback(): Promise<ProductFeedback[]> {
    return await db.select().from(productFeedback);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
}

// Use database storage for both development and production
export const storage = new DbStorage();
