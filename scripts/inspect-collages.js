import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function inspect() {
  const publicDir = path.resolve('public');
  const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.png'));

  console.log(`Found ${files.length} collage files.`);

  for (const file of files) {
    const filePath = path.join(publicDir, file);
    const meta = await sharp(filePath).metadata();
    console.log(`\n=== ${file} ===`);
    console.log(`Size: ${meta.width} x ${meta.height}, format: ${meta.format}, channels: ${meta.channels}`);
  }
}

inspect().catch(console.error);

