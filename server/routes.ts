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
        'Solutions That Stood Out',
        'Context Use Case or Opportunity',
        'Real-World Challenges',
        'Other Comments'
      ];
      
      // Create CSV rows
      const rows = feedback.map(f => {
        return [
          escapeCSV(f.submittedAt || ''),
          escapeCSV(f.visitorName || ''),
          escapeCSV(f.visitorCompany || ''),
          escapeCSV(f.visitorEmail || ''),
          escapeCSV(f.visitorPhone || ''),
          escapeCSV(f.standoutSolutions || ''),
          escapeCSV(f.contextOpportunity || ''),
          escapeCSV(f.realWorldChallenges || ''),
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

  // Product Feedback endpoints
  app.post("/api/product-feedback", async (req, res) => {
    try {
      const { insertProductFeedbackSchema } = await import("@shared/schema");
      const validatedData = insertProductFeedbackSchema.parse(req.body);
      
      const productFeedback = await storage.createProductFeedback(validatedData);
      res.status(201).json({ 
        message: "Product feedback submitted successfully", 
        id: productFeedback.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid product feedback data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to submit product feedback" });
    }
  });

  // Get all product feedback (admin endpoint)
  app.get("/api/product-feedback", requireAuth, async (req, res) => {
    try {
      const allProductFeedback = await storage.getAllProductFeedback();
      res.json(allProductFeedback);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product feedback" });
    }
  });

  // Export product feedback as CSV (admin endpoint)
  app.get("/api/product-feedback/export", requireAuth, async (req, res) => {
    try {
      const allProductFeedback = await storage.getAllProductFeedback();
      
      // Helper function to escape CSV values
      const escapeCSV = (value: string) => {
        const escaped = value.replace(/"/g, '""');
        return `"${escaped}"`;
      };
      
      // Create CSV headers
      const headers = [
        'Submission Date',
        'Product ID',
        'Product Name',
        'Visitor Name',
        'Organisation or Company',
        'Email',
        'Context Use Case or Opportunity',
        'What Stands Out',
        'Real-World Challenges',
        'Other Comments'
      ];
      
      // Create CSV rows
      const rows = await Promise.all(allProductFeedback.map(async (f) => {
        const product = await storage.getProductById(f.productId);
        return [
          escapeCSV(f.submittedAt || ''),
          escapeCSV(f.productId || ''),
          escapeCSV(product?.name || 'Unknown'),
          escapeCSV(f.visitorName || ''),
          escapeCSV(f.visitorCompany || ''),
          escapeCSV(f.visitorEmail || ''),
          escapeCSV(f.contextOpportunity || ''),
          escapeCSV(f.standoutFeatures || ''),
          escapeCSV(f.realWorldChallenges || ''),
          escapeCSV(f.comments || '')
        ].join(',');
      }));
      
      const csv = [headers.join(','), ...rows].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="product-feedback-export-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csv);
    } catch (error) {
      res.status(500).json({ message: "Failed to export product feedback" });
    }
  });

  // Create product (admin endpoint)
  app.post("/api/products", requireAuth, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      
      // Check if section already has 50 products (count all products, including hidden ones)
      const sectionProducts = await storage.getAllProductsBySection(validatedData.sectionId);
      if (sectionProducts.length >= 50) {
        return res.status(400).json({ 
          message: `Section ${validatedData.sectionId} already has the maximum of 50 products. Please delete a product or choose a different section.` 
        });
      }
      
      // Clean up video fields - convert "none", "__NONE__", or empty strings to undefined (which becomes null in DB)
      const cleanedData = {
        ...validatedData,
        videoUrl: validatedData.videoUrl && validatedData.videoUrl.trim() && validatedData.videoUrl.toLowerCase() !== "none" 
          ? validatedData.videoUrl 
          : undefined,
        videoType: validatedData.videoType && validatedData.videoType.trim() && 
          validatedData.videoType.toLowerCase() !== "none" &&
          validatedData.videoType !== "__NONE__"
          ? validatedData.videoType 
          : undefined,
      };
      
      const product = await storage.createProduct(cleanedData);
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

      // If changing section, check if new section already has 50 products (count all products, including hidden ones)
      if (validatedData.sectionId !== undefined) {
        const currentProduct = await storage.getProductById(req.params.id);
        if (currentProduct && currentProduct.sectionId !== validatedData.sectionId) {
          const sectionProducts = await storage.getAllProductsBySection(validatedData.sectionId);
          if (sectionProducts.length >= 50) {
            return res.status(400).json({ 
              message: `Section ${validatedData.sectionId} already has the maximum of 50 products. Please delete a product from that section first.` 
            });
          }
        }
      }

      // Clean up video fields - convert "none", "__NONE__", or empty strings to null, treat explicit null as clearing the field
      let cleanedVideoUrl: string | null | undefined = undefined;
      if (validatedData.videoUrl !== undefined) {
        cleanedVideoUrl = validatedData.videoUrl === null || !validatedData.videoUrl?.trim() || validatedData.videoUrl.toLowerCase() === "none"
          ? null
          : validatedData.videoUrl;
      }
      
      let cleanedVideoType: string | null | undefined = undefined;
      if (validatedData.videoType !== undefined) {
        cleanedVideoType = validatedData.videoType === null || !validatedData.videoType?.trim() || 
          validatedData.videoType.toLowerCase() === "none" ||
          validatedData.videoType === "__NONE__"
          ? null
          : validatedData.videoType;
      }

      // Convert readonly features array to regular array if present
      const updateData: Partial<Product> = {
        ...validatedData,
        ...(validatedData.features && { features: validatedData.features as string[] }),
        ...(cleanedVideoUrl !== undefined && { videoUrl: cleanedVideoUrl }),
        ...(cleanedVideoType !== undefined && { videoType: cleanedVideoType }),
      } as Partial<Product>;

      const product = await storage.updateProduct(req.params.id, updateData);
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

  // Track product view
  app.post("/api/products/:id/track-view", async (req, res) => {
    try {
      const product = await storage.incrementViewCount(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ success: true, viewCount: product.viewCount });
    } catch (error) {
      res.status(500).json({ message: "Failed to track view" });
    }
  });

  // Track video click
  app.post("/api/products/:id/track-video-click", async (req, res) => {
    try {
      const product = await storage.incrementVideoClickCount(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ success: true, videoClickCount: product.videoClickCount });
    } catch (error) {
      res.status(500).json({ message: "Failed to track video click" });
    }
  });

  // Track website click
  app.post("/api/products/:id/track-website-click", async (req, res) => {
    try {
      const product = await storage.incrementWebsiteClickCount(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ success: true, websiteClickCount: product.websiteClickCount });
    } catch (error) {
      res.status(500).json({ message: "Failed to track website click" });
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

  // Normalize upload URL to object path (admin endpoint)
  app.post("/api/objects/normalize", requireAuth, async (req, res) => {
    try {
      const { uploadURL } = req.body;
      if (!uploadURL) {
        return res.status(400).json({ error: "uploadURL is required" });
      }
      
      // Try to use the object storage service normalization
      try {
        const objectStorageService = new ObjectStorageService();
        const normalizedPath = objectStorageService.normalizeObjectEntityPath(uploadURL);
        return res.json({ normalizedPath });
      } catch (normalizeError) {
        // Fallback to manual path extraction if env vars not set
        console.warn("Normalization failed, using fallback:", normalizeError);
        const pathParts = uploadURL.split("/");
        const objectId = pathParts[pathParts.length - 1];
        const normalizedPath = `/objects/uploads/${objectId}`;
        return res.json({ normalizedPath });
      }
    } catch (error) {
      console.error("Error normalizing upload URL:", error);
      res.status(500).json({ error: "Failed to normalize upload URL" });
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
