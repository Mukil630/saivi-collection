import 'dotenv/config';
import pg from 'pg';
import fs from 'fs';

const { Pool } = pg;

const PG_CONNECTION_STRING = process.env.SUPABASE_DB_URL;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!PG_CONNECTION_STRING || !supabaseUrl || !supabaseKey) {
  console.error("❌ ERROR: Missing Supabase database URL, project URL, or API key in .env!");
  process.exit(1);
}

const pool = new Pool({
  connectionString: PG_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
});

function extractFileId(url) {
  if (!url) return null;
  // Match id=...
  let match = url.match(/[?&]id=([^&]+)/);
  if (match) return match[1];
  
  // Match d/...
  match = url.match(/\/d\/([^/]+)/);
  if (match) return match[1];

  // Match folders/...
  match = url.match(/\/file\/d\/([^/]+)/);
  if (match) return match[1];
  
  return null;
}

async function uploadToSupabaseStorage(filename, buffer, mimeType = 'image/jpeg') {
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

async function downloadImage(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (err) {
    console.error(`   [DOWNLOAD] Failed to download image from ${url}:`, err.message);
    return null;
  }
}

async function runMigration() {
  console.log("⚡ Starting Google Drive images migration to Supabase Storage...");
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

      // Helper to process a single URL
      const processUrl = async (url, label) => {
        if (url && (url.includes('drive.google.com') || url.includes('googleusercontent.com'))) {
          const fileId = extractFileId(url);
          if (!fileId) {
            console.warn(`   ⚠️ Could not extract Google Drive File ID from: ${url}`);
            return null;
          }
          const filename = `gdrive_${fileId}.jpeg`;
          const downloadUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
          
          console.log(`   📤 [${label}] Downloading & migrating Google Drive image: ${fileId}`);
          const buffer = await downloadImage(downloadUrl);
          if (buffer) {
            const publicUrl = await uploadToSupabaseStorage(filename, buffer, 'image/jpeg');
            if (publicUrl) {
              console.log(`   ✅ Success! Public URL: ${publicUrl}`);
              return publicUrl;
            }
          }
        }
        return null;
      };

      // 1. Check primary image
      const migratedPrimary = await processUrl(p.image, "PRIMARY");
      if (migratedPrimary) {
        newImage = migratedPrimary;
        isUpdated = true;
      }

      // 2. Check additional images
      if (p.additionalImages && Array.isArray(p.additionalImages)) {
        for (let i = 0; i < p.additionalImages.length; i++) {
          const migratedUrl = await processUrl(p.additionalImages[i], `ADDITIONAL[${i}]`);
          if (migratedUrl) {
            newAdditionalImages[i] = migratedUrl;
            isUpdated = true;
          }
        }
      }

      // 3. Check color images
      if (p.colorImages && typeof p.colorImages === 'object') {
        for (const [color, imgUrl] of Object.entries(p.colorImages)) {
          const migratedUrl = await processUrl(imgUrl, `COLOR[${color}]`);
          if (migratedUrl) {
            newColorImages[color] = migratedUrl;
            isUpdated = true;
          }
        }
      }

      // 4. Save updates to SQL DB
      if (isUpdated) {
        await client.query(
          `UPDATE products 
           SET "image" = $1, "additionalImages" = $2, "colorImages" = $3
           WHERE id = $4`,
          [newImage, newAdditionalImages, JSON.stringify(newColorImages), p.id]
        );
        updatedProductsCount++;
        console.log(`   💾 Saved updated URLs in database for: ${p.name}`);
      }
    }

    console.log(`\n🎉 Google Drive image migration complete!`);
    console.log(`📊 Successfully migrated and updated database records for ${updatedProductsCount} products.`);

  } catch (err) {
    console.error("❌ Fatal migration error:", err);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

runMigration();
