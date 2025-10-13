import { type Product, type InsertProduct, type Feedback, type InsertFeedback, type User, type InsertUser, products, feedback, users } from "@shared/schema";
import { randomUUID } from "crypto";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
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
  getProductById(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<boolean>;

  // Feedback methods
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getAllFeedback(): Promise<Feedback[]>;

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

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      features: insertProduct.features ? [...insertProduct.features] : null,
      brochureUrl: insertProduct.brochureUrl ?? null,
      onDisplay: insertProduct.onDisplay ?? true,
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

export const storage = new MemStorage();
