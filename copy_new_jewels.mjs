import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempJewelsDir = 'E:\\temp_jewels';
const targetUploadsDir = path.join(__dirname, 'backend', 'public', 'uploads');
const targetSourceDir = path.join(__dirname, 'images', 'Jewels');

function main() {
  if (!fs.existsSync(tempJewelsDir)) {
    console.error(`❌ Temp jewels directory not found at: ${tempJewelsDir}`);
    process.exit(1);
  }

  // Get and sort files from temp folder
  const files = fs.readdirSync(tempJewelsDir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);
  }).sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

  console.log(`📋 Found ${files.length} jewel images to process and copy.`);

  let copiedUploads = 0;
  let copiedSources = 0;

  files.forEach((file, index) => {
    const srcPath = path.join(tempJewelsDir, file);
    
    // 1. Copy to backend/public/uploads as jewel_X.jpeg
    const destUploadsName = `jewel_${index + 1}.jpeg`;
    const destUploadsPath = path.join(targetUploadsDir, destUploadsName);
    fs.copyFileSync(srcPath, destUploadsPath);
    copiedUploads++;

    // 2. Copy to images/Jewels with original filename
    const destSourcePath = path.join(targetSourceDir, file);
    fs.copyFileSync(srcPath, destSourcePath);
    copiedSources++;
  });

  console.log(`✅ Copied ${copiedUploads} files to backend uploads folder.`);
  console.log(`✅ Copied ${copiedSources} files to source images/Jewels folder.`);
  console.log('🎉 Jewel images update complete!');
}

main();
