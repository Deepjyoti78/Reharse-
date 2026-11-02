import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function findBorders(filename) {
  const filePath = path.join('public', filename);
  const image = sharp(filePath);
  const { width, height } = await image.metadata();
  const raw = await image.raw().toBuffer();

  function isSeparatorPixel(r, g, b) {
    // Most separators in these collages are off-white / cream: r > 235, g > 225, b > 200
    // and low saturation (difference between max and min channel < 45)
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return r > 230 && g > 220 && b > 195 && (max - min) < 55;
  }

  // Row separator scores: fraction of pixels that match separator color
  const rowScores = [];
  for (let y = 0; y < height; y++) {
    let sepCount = 0;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      if (isSeparatorPixel(raw[idx], raw[idx + 1], raw[idx + 2])) {
        sepCount++;
      }
    }
    rowScores.push(sepCount / width);
  }

  // Col separator scores: fraction of pixels that match separator color
  const colScores = [];
  for (let x = 0; x < width; x++) {
    let sepCount = 0;
    for (let y = 0; y < height; y++) {
      const idx = (y * width + x) * 3;
      if (isSeparatorPixel(raw[idx], raw[idx + 1], raw[idx + 2])) {
        sepCount++;
      }
    }
    colScores.push(sepCount / height);
  }

  // Helper to find intervals where score > threshold (e.g. 0.8)
  function findBands(scores, minLength = 4, threshold = 0.75) {
    const bands = [];
    let start = null;
    for (let i = 0; i < scores.length; i++) {
      if (scores[i] >= threshold) {
        if (start === null) start = i;
      } else {
        if (start !== null) {
          if (i - start >= minLength) {
            bands.push({ start, end: i - 1, width: i - start });
          }
          start = null;
        }
      }
    }
    if (start !== null && scores.length - start >= minLength) {
      bands.push({ start, end: scores.length - 1, width: scores.length - start });
    }
    return bands;
  }

  console.log(`\n========================================`);
  console.log(`Collage: ${filename} (${width}x${height})`);
  
  const colBands = findBands(colScores, 3, 0.7);
  const rowBands = findBands(rowScores, 3, 0.7);

  console.log('Vertical Separators (X bands):', colBands);
  console.log('Horizontal Separators (Y bands):', rowBands);

  // If bands divide into panels, let's compute panel bounding boxes
  const xCuts = [];
  // include left edge and right edge
  for (const b of colBands) {
    xCuts.push(b);
  }

  // Panels horizontally are between colBands[i].end+1 and colBands[i+1].start-1
  const xPanels = [];
  let prevX = 0;
  if (colBands.length > 0 && colBands[0].start <= 10) {
    prevX = colBands[0].end + 1;
  }
  for (let i = (colBands.length > 0 && colBands[0].start <= 10 ? 1 : 0); i < colBands.length; i++) {
    if (colBands[i].start > prevX + 20) {
      xPanels.push({ left: prevX, right: colBands[i].start - 1, width: colBands[i].start - prevX });
    }
    prevX = colBands[i].end + 1;
  }
  if (prevX < width - 10) {
    xPanels.push({ left: prevX, right: width - 1, width: width - prevX });
  }

  const yPanels = [];
  let prevY = 0;
  if (rowBands.length > 0 && rowBands[0].start <= 10) {
    prevY = rowBands[0].end + 1;
  }
  for (let i = (rowBands.length > 0 && rowBands[0].start <= 10 ? 1 : 0); i < rowBands.length; i++) {
    if (rowBands[i].start > prevY + 20) {
      yPanels.push({ top: prevY, bottom: rowBands[i].start - 1, height: rowBands[i].start - prevY });
    }
    prevY = rowBands[i].end + 1;
  }
  if (prevY < height - 10) {
    yPanels.push({ top: prevY, bottom: height - 1, height: height - prevY });
  }

  console.log(`Detected Grid: ${xPanels.length} cols x ${yPanels.length} rows (${xPanels.length * yPanels.length} panels total)`);
  console.log('X Panels:', xPanels);
  console.log('Y Panels:', yPanels);

  return { filename, width, height, xPanels, yPanels, colBands, rowBands };
}

async function run() {
  const publicDir = path.resolve('public');
  const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.png'));
  const results = [];
  for (const f of files) {
    results.push(await findBorders(f));
  }
}

run().catch(console.error);

