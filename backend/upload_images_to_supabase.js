import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'public', 'uploads');

const PG_CONNECTION_STRING = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!PG_CONNECTION_STRING || !supabaseUrl || !supabaseKey) {
  console.error("❌ ERROR: Missing database credentials or Supabase URL/Key in .env!");
  console.error({
    hasDbUrl: !!PG_CONNECTION_STRING,
    hasSupabaseUrl: !!supabaseUrl,
    hasSupabaseKey: !!supabaseKey
  });
  process.exit(1);
}

const pool = new Pool({
  connectionString: PG_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
});

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.webp': return 'image/webp';
    case '.gif': return 'image/gif';
    case '.svg': return 'image/svg+xml';
    default: return 'application/octet-stream';
  }
}

async function uploadToSupabaseStorage(filename, buffer, mimeType) {
  const url = `${supabaseUrl}/storage/v1/object/savis-images/${filename}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': mimeType,
        'x-upsert': 'true'
      },
      body: buffer
    });
    if (response.ok) {
      return `${supabaseUrl}/storage/v1/object/public/savis-images/${filename}`;
    } else {
      const errText = await response.text();
      console.error(`   [STORAGE] Failed to upload ${filename}:`, errText);
      return null;
    }
  } catch (err) {
    console.error(`   [STORAGE] Connection error for ${filename}:`, err.message);
    return null;
  }
}

async function runImageMigration() {
  console.log("⚡ Starting image migration to Supabase Storage...");
  let client;
  
  try {
    client = await pool.connect();
    console.log("✅ Connected to PostgreSQL database.");

    // Fetch all products
    const res = await client.query('SELECT * FROM products');
    const products = res.rows;
    console.log(`📋 Found ${products.length} products to check.`);

    let updatedProductsCount = 0;

    for (const p of products) {
      let isUpdated = false;
      let newImage = p.image;
      let newAdditionalImages = [...(p.additionalImages || [])];
      let newColorImages = { ...(p.colorImages || {}) };

      console.log(`📦 Checking product: ${p.name} (ID: ${p.id})`);

      // 1. Migrate primary image if local
      if (p.image && (p.image.startsWith('/uploads/') || p.image.startsWith('uploads/'))) {
        const filename = path.basename(p.image);
        const localPath = path.join(uploadsDir, filename);

        if (fs.existsSync(localPath)) {
          console.log(`   📤 Uploading primary image: ${filename}`);
          const buffer = fs.readFileSync(localPath);
          const mimeType = getMimeType(localPath);
          const publicUrl = await uploadToSupabaseStorage(filename, buffer, mimeType);
          
          if (publicUrl) {
            newImage = publicUrl;
            isUpdated = true;
            console.log(`   ✅ Success! Public URL: ${publicUrl}`);
          }
        } else {
          console.warn(`   ⚠️ Local file not found for primary image at: ${localPath}`);
        }
      }

      // 2. Migrate additional images if local
      if (p.additionalImages && Array.isArray(p.additionalImages)) {
        for (let i = 0; i < p.additionalImages.length; i++) {
          const imgUrl = p.additionalImages[i];
          if (imgUrl && (imgUrl.startsWith('/uploads/') || imgUrl.startsWith('uploads/'))) {
            const filename = path.basename(imgUrl);
            const localPath = path.join(uploadsDir, filename);

            if (fs.existsSync(localPath)) {
              console.log(`   📤 Uploading additional image [${i}]: ${filename}`);
              const buffer = fs.readFileSync(localPath);
              const mimeType = getMimeType(localPath);
              const publicUrl = await uploadToSupabaseStorage(filename, buffer, mimeType);

              if (publicUrl) {
                newAdditionalImages[i] = publicUrl;
                isUpdated = true;
                console.log(`   ✅ Success! Public URL: ${publicUrl}`);
              }
            }
          }
        }
      }

      // 3. Migrate color images if local
      if (p.colorImages && typeof p.colorImages === 'object') {
        for (const [color, imgUrl] of Object.entries(p.colorImages)) {
          if (imgUrl && (imgUrl.startsWith('/uploads/') || imgUrl.startsWith('uploads/'))) {
            const filename = path.basename(imgUrl);
            const localPath = path.join(uploadsDir, filename);

            if (fs.existsSync(localPath)) {
              console.log(`   📤 Uploading color image [${color}]: ${filename}`);
              const buffer = fs.readFileSync(localPath);
              const mimeType = getMimeType(localPath);
              const publicUrl = await uploadToSupabaseStorage(filename, buffer, mimeType);

              if (publicUrl) {
                newColorImages[color] = publicUrl;
                isUpdated = true;
                console.log(`   ✅ Success! Public URL: ${publicUrl}`);
              }
            }
          }
        }
      }

      // 4. Update the DB record if changes were made
      if (isUpdated) {
        await client.query(
          `UPDATE products 
           SET "image" = $1, "additionalImages" = $2, "colorImages" = $3
           WHERE id = $4`,
          [newImage, newAdditionalImages, JSON.stringify(newColorImages), p.id]
        );
        updatedProductsCount++;
        console.log(`   💾 Updated SQL database record for: ${p.name}`);
      }
    }

    console.log(`\n🎉 Image migration complete!`);
    console.log(`📊 Successfully migrated and updated database records for ${updatedProductsCount} products.`);

  } catch (err) {
    console.error("❌ Fatal migration error:", err);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

runImageMigration();
