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

  // Export feedback as CSV (admin endpoint)
  app.get("/api/feedback/export", async (req, res) => {
    try {
      const feedback = await storage.getAllFeedback();
      const products = await storage.getAllProducts();
      
      // Helper function to escape CSV values
      const escapeCSV = (value: string) => {
        const escaped = value.replace(/"/g, '""');
        return `"${escaped}"`;
      };
      
      // Create CSV headers
      const headers = [
        'Submission Date',
        'Visitor Name',
        'Email',
        'Company',
        'Interesting Products',
        'Comments'
      ];
      
      // Create CSV rows
      const rows = feedback.map(f => {
        const productNames = f.interestingProducts
          ?.map(id => {
            const product = products.find(p => p.id === id);
            return product ? product.name : `Unknown (${id})`;
          })
          .join('; ') || '';
        
        return [
          escapeCSV(f.submittedAt || ''),
          escapeCSV(f.visitorName || ''),
          escapeCSV(f.visitorEmail || ''),
          escapeCSV(f.visitorCompany || ''),
          escapeCSV(productNames),
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
