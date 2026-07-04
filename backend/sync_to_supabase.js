import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = path.join(__dirname, 'database.json');

const PG_CONNECTION_STRING = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

if (!PG_CONNECTION_STRING) {
  console.error("❌ ERROR: No SUPABASE_DB_URL or DATABASE_URL found in .env.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: PG_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
});

async function sync() {
  console.log("⚡ Starting sync of database.json to Supabase PostgreSQL...");

  try {
    // Check connection and ensure tables exist
    console.log("🔌 Connecting to PostgreSQL...");
    const client = await pool.connect();
    console.log("✅ Connected successfully!");
    
    // Ensure table exists (copied schema from db.js)
    console.log("🛠️ Verifying tables...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        "id" VARCHAR(50) PRIMARY KEY,
        "createdAt" VARCHAR(50) NOT NULL,
        "featured" BOOLEAN DEFAULT FALSE,
        "sizes" TEXT[],
        "colors" TEXT[],
        "stock" INTEGER DEFAULT 20,
        "name" TEXT NOT NULL,
        "price" NUMERIC NOT NULL,
        "oldPrice" NUMERIC,
        "image" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "description" TEXT DEFAULT '',
        "colorImages" JSONB DEFAULT '{}'::jsonb,
        "additionalImages" TEXT[] DEFAULT '{}'::text[]
      )
    `);

    // Fetch existing product IDs
    const existingRes = await client.query('SELECT id FROM products');
    const existingIds = new Set(existingRes.rows.map(row => row.id));
    console.log(`📊 Found ${existingIds.size} products already in Supabase database.`);

    // Read local database.json
    if (!fs.existsSync(dbFile)) {
      console.error(`❌ database.json not found at: ${dbFile}`);
      client.release();
      process.exit(1);
    }

    const dbData = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
    const localProducts = dbData.products || [];
    console.log(`📖 Read ${localProducts.length} products from database.json.`);

    let insertedCount = 0;
    let skippedCount = 0;

    for (const p of localProducts) {
      if (existingIds.has(p.id)) {
        skippedCount++;
        continue;
      }

      const sizes = p.sizes || ["S", "M", "L", "XL"];
      const colors = p.colors || ["Default"];
      const stock = p.stock !== undefined ? parseInt(p.stock) : 20;
      const featured = !!p.featured;
      const price = parseFloat(p.price);
      const oldPrice = p.oldPrice ? parseFloat(p.oldPrice) : null;
      const colorImages = p.colorImages || {};
      const additionalImages = p.additionalImages || [];

      await client.query(
        `INSERT INTO products ("id", "createdAt", "featured", "sizes", "colors", "stock", "name", "price", "oldPrice", "image", "category", "description", "colorImages", "additionalImages")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          p.id,
          p.createdAt || new Date().toISOString(),
          featured,
          sizes,
          colors,
          stock,
          p.name,
          price,
          oldPrice,
          p.image,
          p.category,
          p.description || '',
          JSON.stringify(colorImages),
          additionalImages
        ]
      );
      insertedCount++;
    }

    console.log(`🏁 Sync Finished!`);
    console.log(`   - Inserted new: ${insertedCount}`);
    console.log(`   - Skipped existing: ${skippedCount}`);

    client.release();
  } catch (err) {
    console.error("❌ Sync failed with error:", err);
  } finally {
    await pool.end();
  }
}

sync();
