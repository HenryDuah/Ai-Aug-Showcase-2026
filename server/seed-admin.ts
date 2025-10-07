import { storage } from "./storage";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function seedAdmin() {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    console.warn("Warning: ADMIN_USERNAME and ADMIN_PASSWORD environment variables not set. Admin user will not be created.");
    return;
  }

  try {
    // Check if admin user already exists
    const existingAdmin = await storage.getUserByUsername(adminUsername);
    
    if (existingAdmin) {
      console.log(`Admin user '${adminUsername}' already exists`);
      return;
    }

    // Create admin user
    const hashedPassword = await hashPassword(adminPassword);
    await storage.createUser({
      username: adminUsername,
      password: hashedPassword,
    });

    console.log(`Admin user '${adminUsername}' created successfully`);
  } catch (error) {
    console.error("Failed to seed admin user:", error);
  }
}
