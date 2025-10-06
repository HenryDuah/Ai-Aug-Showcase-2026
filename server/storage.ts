import { type Product, type InsertProduct, type Feedback, type InsertFeedback } from "@shared/schema";
import { randomUUID } from "crypto";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
}

const PRODUCTS_FILE = join(__dirname, "data", "products.json");

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private feedbacks: Map<string, Feedback>;

  constructor() {
    this.products = new Map();
    this.feedbacks = new Map();
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
    const id = insertProduct.id || randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      audioUrl: insertProduct.audioUrl ?? null,
      features: insertProduct.features ? [...insertProduct.features] : null,
      onDisplay: insertProduct.onDisplay ?? null,
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const existing = this.products.get(id);
    if (!existing) {
      throw new Error(`Product with id ${id} not found`);
    }
    const updated = { ...existing, ...updates };
    this.products.set(id, updated);
    this.saveProducts();
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const id = randomUUID();
    const feedback: Feedback = {
      ...insertFeedback,
      id,
      visitorName: insertFeedback.visitorName ?? null,
      visitorEmail: insertFeedback.visitorEmail ?? null,
      visitorCompany: insertFeedback.visitorCompany ?? null,
      interestingProducts: insertFeedback.interestingProducts ? [...insertFeedback.interestingProducts] : null,
      comments: insertFeedback.comments ?? null,
      submittedAt: new Date().toISOString(),
    };
    this.feedbacks.set(id, feedback);
    return feedback;
  }

  async getAllFeedback(): Promise<Feedback[]> {
    return Array.from(this.feedbacks.values());
  }
}

export const storage = new MemStorage();
