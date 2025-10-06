import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFeedbackSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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
  app.get("/api/feedback", async (req, res) => {
    try {
      const feedback = await storage.getAllFeedback();
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });

  // Update product display status (admin endpoint)
  app.patch("/api/products/:id/display", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
