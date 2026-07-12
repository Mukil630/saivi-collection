import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendUploadsDir = path.join(__dirname, 'frontend', 'public', 'uploads');

const sources = [
  { dir: path.join(__dirname, 'images', 'female'), prefix: 'female', max: 93 },
  { dir: path.join(__dirname, 'images', 'kids'), prefix: 'kids', max: 100 },
  { dir: path.join(__dirname, 'images', 'Jewels'), prefix: 'jewel', max: 47 }
];

function main() {
  // Ensure frontend/public/uploads exists
  if (!fs.existsSync(frontendUploadsDir)) {
    fs.mkdirSync(frontendUploadsDir, { recursive: true });
    console.log(`📁 Created directory: ${frontendUploadsDir}`);
  }

  sources.forEach(src => {
    if (!fs.existsSync(src.dir)) {
      console.error(`❌ Source directory not found: ${src.dir}`);
      return;
    }

    const files = fs.readdirSync(src.dir).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);
    }).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    console.log(`📋 Processing ${files.length} images from ${src.prefix} folder...`);

    let copied = 0;
    files.forEach((file, index) => {
      // Limit to the max count if specified
      if (index >= src.max) return;

      const srcPath = path.join(src.dir, file);
      const destPath = path.join(frontendUploadsDir, `${src.prefix}_${index + 1}.jpeg`);

      fs.copyFileSync(srcPath, destPath);
      copied++;
    });

    console.log(`✅ Copied ${copied} images to frontend/public/uploads as ${src.prefix}_X.jpeg`);
  });

  console.log('🎉 Frontend static images setup complete!');
}

main();
