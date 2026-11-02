import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function checkSeparators(filename) {
  const filePath = path.join('public', filename);
  const image = sharp(filePath);
  const { width, height } = await image.metadata();
  const raw = await image.raw().toBuffer();

  console.log(`\n========================================`);
  console.log(`Analyzing: ${filename}`);

  // For columns, let's find the variance across x from 0 to width
  // A separator line usually has low standard deviation across y, OR high brightness
  const colBrightness = [];
  for (let x = 0; x < width; x++) {
    let sum = 0;
    for (let y = 0; y < height; y++) {
      const idx = (y * width + x) * 3;
      sum += (raw[idx] + raw[idx+1] + raw[idx+2]) / 3;
    }
    colBrightness.push(sum / height);
  }

  const rowBrightness = [];
  for (let y = 0; y < height; y++) {
    let sum = 0;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      sum += (raw[idx] + raw[idx+1] + raw[idx+2]) / 3;
    }
    rowBrightness.push(sum / width);
  }

  // Find peaks in brightness (cream/white separator bands are much brighter than the darker illustrations)
  function findPeaks(arr, window = 20) {
    const peaks = [];
    for (let i = 10; i < arr.length - 10; i++) {
      let isMax = true;
      for (let j = Math.max(0, i - window); j <= Math.min(arr.length - 1, i + window); j++) {
        if (j !== i && arr[j] > arr[i]) {
          isMax = false;
          break;
        }
      }
      if (isMax && arr[i] > 180) { // bright enough
        peaks.push({ pos: i, val: Math.round(arr[i]) });
      }
    }
    return peaks;
  }

  console.log('X Brightness Peaks:', findPeaks(colBrightness, 30));
  console.log('Y Brightness Peaks:', findPeaks(rowBrightness, 30));
}

async function run() {
  const publicDir = path.resolve('public');
  const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.png'));
  for (const f of files) {
    await checkSeparators(f);
  }
}

run().catch(console.error);

