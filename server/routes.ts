import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFeedbackSchema, insertProductSchema, type Product } from "@shared/schema";
import { z } from "zod";
import { setupAuth, requireAuth } from "./auth";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication - must be before other routes
  setupAuth(app);
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get products by section
  app.get("/api/products/section/:sectionId", async (req, res) => {
    try {
      const sectionId = parseInt(req.params.sectionId);
      if (isNaN(sectionId)) {
        return res.status(400).json({ message: "Invalid section ID" });
      }
      
      const products = await storage.getProductsBySection(sectionId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products for section" });
    }
  });

  // Get single product by ID
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Submit feedback
  app.post("/api/feedback", async (req, res) => {
    try {
      const validatedData = insertFeedbackSchema.parse(req.body);
      const feedback = await storage.createFeedback(validatedData);
      res.status(201).json({ 
        message: "Feedback submitted successfully", 
        id: feedback.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid feedback data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to submit feedback" });
    }
  });

  // Get all feedback (admin endpoint)
  app.get("/api/feedback", requireAuth, async (req, res) => {
    try {
      const feedback = await storage.getAllFeedback();
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });

  // Export feedback as CSV (admin endpoint)
  app.get("/api/feedback/export", requireAuth, async (req, res) => {
    try {
      const feedback = await storage.getAllFeedback();
      
      // Helper function to escape CSV values
      const escapeCSV = (value: string) => {
        const escaped = value.replace(/"/g, '""');
        return `"${escaped}"`;
      };
      
      // Create CSV headers
      const headers = [
        'Submission Date',
        'Visitor Name',
        'Company',
        'Email',
        'Phone',
        'Comments'
      ];
      
      // Create CSV rows
      const rows = feedback.map(f => {
        return [
          escapeCSV(f.submittedAt || ''),
          escapeCSV(f.visitorName || ''),
          escapeCSV(f.visitorCompany || ''),
          escapeCSV(f.visitorEmail || ''),
          escapeCSV(f.visitorPhone || ''),
          escapeCSV(f.comments || '')
        ].join(',');
      });
      
      const csv = [headers.join(','), ...rows].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="feedback-export-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csv);
    } catch (error) {
      res.status(500).json({ message: "Failed to export feedback" });
    }
  });

  // Create product (admin endpoint)
  app.post("/api/products", requireAuth, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      
      // Check if section already has 6 products
      const sectionProducts = await storage.getProductsBySection(validatedData.sectionId);
      if (sectionProducts.length >= 6) {
        return res.status(400).json({ 
          message: `Section ${validatedData.sectionId} already has the maximum of 6 products. Please delete a product or choose a different section.` 
        });
      }
      
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid product data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Update product (admin endpoint)
  app.patch("/api/products/:id", requireAuth, async (req, res) => {
    try {
      // Validate update data using partial schema
      const updateSchema = insertProductSchema.partial();
      const validatedData = updateSchema.parse(req.body);

      if (Object.keys(validatedData).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }

      // If changing section, check if new section already has 6 products
      if (validatedData.sectionId !== undefined) {
        const currentProduct = await storage.getProductById(req.params.id);
        if (currentProduct && currentProduct.sectionId !== validatedData.sectionId) {
          const sectionProducts = await storage.getProductsBySection(validatedData.sectionId);
          if (sectionProducts.length >= 6) {
            return res.status(400).json({ 
              message: `Section ${validatedData.sectionId} already has the maximum of 6 products. Please delete a product from that section first.` 
            });
          }
        }
      }

      const product = await storage.updateProduct(req.params.id, validatedData);
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid product data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  // Delete product (admin endpoint)
  app.delete("/api/products/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Update product display status (admin endpoint)
  app.patch("/api/products/:id/display", requireAuth, async (req, res) => {
    try {
      const { onDisplay } = req.body;
      if (typeof onDisplay !== 'boolean') {
        return res.status(400).json({ message: "onDisplay must be a boolean" });
      }

      const product = await storage.updateProduct(req.params.id, { onDisplay });
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product display status" });
    }
  });

  // Get upload URL for audio files (admin endpoint)
  app.post("/api/objects/upload", requireAuth, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Serve uploaded audio files (public endpoint)
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error accessing object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
