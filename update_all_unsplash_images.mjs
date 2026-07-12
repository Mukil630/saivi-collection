import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFile = path.join(__dirname, 'backend', 'database.json');

// Categorized high-quality fashion imagery from Unsplash matching colors where possible
const imageCatalog = {
  kurtis: [
    { colors: [/red/i, /wine/i, /maroon/i, /crimson/i], url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop' },
    { colors: [/purple/i, /lavender/i, /mauve/i], url: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=800&auto=format&fit=crop' },
    { colors: [/black/i, /grey/i, /gray/i], url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop' },
    { colors: [/yellow/i, /mustard/i, /gold/i], url: 'https://images.unsplash.com/photo-1562572159-4ebcd318f4dd?w=800&auto=format&fit=crop' },
    { colors: [/green/i, /teal/i, /lime/i], url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop' },
    { colors: [/blue/i, /navy/i, /indigo/i], url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop' },
    { colors: [/pink/i, /peach/i, /rose/i], url: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=800&auto=format&fit=crop' },
    { colors: [], url: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&auto=format&fit=crop' }
  ],
  kidscollections: [
    { colors: [/red/i, /orange/i, /brick/i], url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop' },
    { colors: [/blue/i, /navy/i, /indigo/i], url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop' },
    { colors: [/white/i, /grey/i, /gray/i, /mauve/i], url: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop' },
    { colors: [/purple/i, /pink/i, /yellow/i, /green/i], url: 'https://images.unsplash.com/photo-1622290319146-7b63df48a635?w=800&auto=format&fit=crop' },
    { colors: [], url: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&auto=format&fit=crop' }
  ],
  sarees: [
    { colors: [/blue/i, /navy/i], url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop' },
    { colors: [/red/i, /crimson/i, /maroon/i, /mustard/i], url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop' },
    { colors: [/green/i, /emerald/i], url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop' },
    { colors: [/pink/i, /pastel/i, /rose/i], url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop' },
    { colors: [], url: 'https://images.unsplash.com/photo-1562572159-4ebcd318f4dd?w=800&auto=format&fit=crop' }
  ],
  pant: [
    { colors: [/maroon/i, /red/i, /wine/i], url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop' },
    { colors: [/sandle/i, /beige/i, /brown/i, /grey/i, /sand/i], url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop' },
    { colors: [], url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop' }
  ],
  palazzoset: [
    { colors: [/pink/i, /rose/i], url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop' },
    { colors: [], url: 'https://images.unsplash.com/photo-1561932850-f13404855e53?w=800&auto=format&fit=crop' }
  ],
  elixir: [
    { colors: [], url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop' }
  ],
  frock: [
    { colors: [/red/i], url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop' },
    { colors: [], url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop' }
  ],
  nightgowns: [
    { colors: [/yellow/i, /white/i], url: 'https://images.unsplash.com/photo-1562572159-4ebcd318f4dd?w=800&auto=format&fit=crop' },
    { colors: [/pink/i, /lavender/i, /peach/i, /blush/i], url: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=800&auto=format&fit=crop' },
    { colors: [/navy/i, /teal/i, /blue/i, /green/i], url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop' },
    { colors: [/grey/i, /gray/i, /brown/i], url: 'https://images.unsplash.com/photo-1608063615781-e5ef77d3cf11?w=800&auto=format&fit=crop' },
    { colors: [], url: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?w=800&auto=format&fit=crop' }
  ],
  shorttop: [
    { colors: [/yellow/i, /peach/i], url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop' },
    { colors: [], url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop' }
  ],
  clearancesale: [
    { colors: [], url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop' }
  ],
  coords: [
    { colors: [/black/i, /grey/i, /gray/i, /brown/i], url: 'https://images.unsplash.com/photo-1539008835657-9e8e9680fe0a?w=800&auto=format&fit=crop' },
    { colors: [/red/i, /blue/i, /green/i, /purple/i], url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop' },
    { colors: [], url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop' }
  ],
  skirts: [
    { colors: [/red/i, /green/i], url: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=800&auto=format&fit=crop' },
    { colors: [], url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop' }
  ]
};

function main() {
  if (!fs.existsSync(dbFile)) {
    console.error(`❌ Database file not found at: ${dbFile}`);
    process.exit(1);
  }

  const dbData = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
  let updatedCount = 0;

  // Track counts per category to do round-robin default fallback
  const categoryIndices = {};

  dbData.products = dbData.products.map(p => {
    // Check if the product has an Unsplash URL (non-local)
    if (p.image && p.image.startsWith('http') && p.image.includes('unsplash.com')) {
      const catKey = p.category.toLowerCase().replace(/[\s-]/g, '');
      const catalog = imageCatalog[catKey];

      if (catalog) {
        const productName = p.name.toLowerCase();
        let matchedImage = null;

        // Try to match by color in the product name
        for (const entry of catalog) {
          if (entry.colors.length > 0 && entry.colors.some(regex => regex.test(productName))) {
            matchedImage = entry.url;
            break;
          }
        }

        // Fallback to general/default image in the catalog using round-robin index
        if (!matchedImage) {
          categoryIndices[catKey] = (categoryIndices[catKey] || 0) + 1;
          const defaultEntries = catalog.filter(entry => entry.colors.length === 0);
          if (defaultEntries.length > 0) {
            const idx = categoryIndices[catKey] % defaultEntries.length;
            matchedImage = defaultEntries[idx].url;
          } else {
            // If no explicit default, use the first entry
            matchedImage = catalog[0].url;
          }
        }

        p.image = matchedImage;
        updatedCount++;
      } else {
        console.warn(`⚠️ No catalog mapping found for category: "${p.category}" (Product: "${p.name}")`);
      }
    }
    return p;
  });

  fs.writeFileSync(dbFile, JSON.stringify(dbData, null, 2), 'utf8');
  console.log(`✅ Successfully replaced and updated ${updatedCount} placeholder Unsplash URLs in database.json with category-specific high-quality imagery!`);
}

main();
