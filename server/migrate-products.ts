import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { products } from "@shared/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const PRODUCTS_FILE = join(__dirname, "data", "products.json");

async function migrateProducts() {
  try {
    console.log("Loading products from JSON file...");
    const data = readFileSync(PRODUCTS_FILE, "utf-8");
    const { products: productList } = JSON.parse(data);
    
    console.log(`Found ${productList.length} products to migrate`);
    
    for (const product of productList) {
      try {
        await db.insert(products).values({
          id: product.id,
          name: product.name,
          company: product.company,
          type: product.type,
          description: product.description,
          image: product.image,
          videoUrl: product.videoUrl || "",
          brochureUrl: product.brochureUrl || null,
          theImpact: product.theImpact || "",
          features: product.features || [],
          sectionId: product.sectionId,
          sectionName: product.sectionName,
          onDisplay: product.onDisplay ?? true,
        }).onConflictDoUpdate({
          target: products.id,
          set: {
            name: product.name,
            company: product.company,
            type: product.type,
            description: product.description,
            image: product.image,
            videoUrl: product.videoUrl || "",
            brochureUrl: product.brochureUrl || null,
            theImpact: product.theImpact || "",
            features: product.features || [],
            sectionId: product.sectionId,
            sectionName: product.sectionName,
            onDisplay: product.onDisplay ?? true,
          },
        });
        console.log(`✓ Migrated: ${product.name}`);
      } catch (error) {
        console.error(`✗ Failed to migrate ${product.name}:`, error);
      }
    }
    
    console.log("\nMigration complete!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrateProducts();
