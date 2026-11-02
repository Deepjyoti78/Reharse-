import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function analyzeCollage(filename) {
  const filePath = path.join('public', filename);
  const image = sharp(filePath);
  const { width, height } = await image.metadata();
  const raw = await image.raw().toBuffer();

  function getPixel(x, y) {
    const idx = (y * width + x) * 3;
    return [raw[idx], raw[idx + 1], raw[idx + 2]];
  }

  // Check row-wise average colors/variances and column-wise average colors/variances
  // Separators are typically cream/white or uniform colored bands
  const rowVariance = [];
  for (let y = 0; y < height; y++) {
    let rSum = 0, gSum = 0, bSum = 0;
    for (let x = 0; x < width; x += 10) {
      const [r, g, b] = getPixel(x, y);
      rSum += r; gSum += g; bSum += b;
    }
    const count = Math.ceil(width / 10);
    const avgR = rSum / count, avgG = gSum / count, avgB = bSum / count;

    let varSum = 0;
    for (let x = 0; x < width; x += 10) {
      const [r, g, b] = getPixel(x, y);
      varSum += Math.abs(r - avgR) + Math.abs(g - avgG) + Math.abs(b - avgB);
    }
    rowVariance.push({ y, avg: [Math.round(avgR), Math.round(avgG), Math.round(avgB)], variance: Math.round(varSum / count) });
  }

  const colVariance = [];
  for (let x = 0; x < width; x++) {
    let rSum = 0, gSum = 0, bSum = 0;
    for (let y = 0; y < height; y += 10) {
      const [r, g, b] = getPixel(x, y);
      rSum += r; gSum += g; bSum += b;
    }
    const count = Math.ceil(height / 10);
    const avgR = rSum / count, avgG = gSum / count, avgB = bSum / count;

    let varSum = 0;
    for (let y = 0; y < height; y += 10) {
      const [r, g, b] = getPixel(x, y);
      varSum += Math.abs(r - avgR) + Math.abs(g - avgG) + Math.abs(b - avgB);
    }
    colVariance.push({ x, avg: [Math.round(avgR), Math.round(avgG), Math.round(avgB)], variance: Math.round(varSum / count) });
  }

  // Find local minima of variance that could be separator lines
  // Also sample grid centers (like 3x3, 2x2, 3x2, etc.)
  console.log(`\n========================================`);
  console.log(`Collage: ${filename} (${width}x${height})`);

  // Print variance at suspected grid intervals
  // For 1536x1024, 3 columns = 512 each, 2 rows = 512 each OR 3 rows = 341 each
  const sampleCols = [0, 10, width/4, width/3, width/2, (2*width)/3, (3*width)/4, width-10, width-1];
  console.log('Sample Col Variances:', sampleCols.map(x => ({ x: Math.round(x), var: colVariance[Math.round(x)]?.variance, avg: colVariance[Math.round(x)]?.avg })));

  const sampleRows = [0, 10, height/4, height/3, height/2, (2*height)/3, (3*height)/4, height-10, height-1];
  console.log('Sample Row Variances:', sampleRows.map(y => ({ y: Math.round(y), var: rowVariance[Math.round(y)]?.variance, avg: rowVariance[Math.round(y)]?.avg })));
}

async function run() {
  const publicDir = path.resolve('public');
  const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.png'));
  for (const f of files) {
    await analyzeCollage(f);
  }
}

run().catch(console.error);

