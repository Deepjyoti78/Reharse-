import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Directory setup
const baseDir = path.resolve('public/images/rehearse');
const subdirs = [
  'interview',
  'ai-interviewer',
  'practice',
  'feedback',
  'analytics',
  'learning',
  'success',
  'decorative'
];

for (const sub of subdirs) {
  fs.mkdirSync(path.join(baseDir, sub), { recursive: true });
}

// Function to find horizontal lines (Y separators) in an image
async function findHorizontalSeparators(raw, width, height) {
  const rowScores = [];
  for (let y = 0; y < height; y++) {
    let sepCount = 0;
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      const r = raw[idx], g = raw[idx+1], b = raw[idx+2];
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      if (r > 220 && g > 210 && b > 185 && (max - min) < 55) {
        sepCount++;
      }
    }
    rowScores.push(sepCount / width);
  }

  const bands = [];
  let start = null;
  for (let y = 0; y < height; y++) {
    if (rowScores[y] > 0.5) {
      if (start === null) start = y;
    } else {
      if (start !== null) {
        if (y - start >= 4) bands.push({ start, end: y - 1 });
        start = null;
      }
    }
  }
  if (start !== null && height - start >= 4) {
    bands.push({ start, end: height - 1 });
  }

  // Row panels
  const rows = [];
  let prevY = 0;
  if (bands.length > 0 && bands[0].start <= 15) {
    prevY = bands[0].end + 1;
  }
  for (let i = (bands.length > 0 && bands[0].start <= 15 ? 1 : 0); i < bands.length; i++) {
    if (bands[i].start > prevY + 40) {
      rows.push({ top: prevY, bottom: bands[i].start - 1 });
    }
    prevY = bands[i].end + 1;
  }
  if (prevY < height - 15) {
    rows.push({ top: prevY, bottom: height - 1 });
  }

  return { bands, rows };
}

// Function to find vertical lines (X separators) within a specific row band
function findVerticalSeparatorsInRow(raw, width, top, bottom) {
  const rowHeight = bottom - top + 1;
  const colScores = [];
  for (let x = 0; x < width; x++) {
    let sepCount = 0;
    for (let y = top; y <= bottom; y++) {
      const idx = (y * width + x) * 3;
      const r = raw[idx], g = raw[idx+1], b = raw[idx+2];
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      if (r > 215 && g > 205 && b > 180 && (max - min) < 60) {
        sepCount++;
      }
    }
    colScores.push(sepCount / rowHeight);
  }

  const bands = [];
  let start = null;
  for (let x = 0; x < width; x++) {
    // If colScore > 0.45 or local brightness is very high
    if (colScores[x] > 0.45) {
      if (start === null) start = x;
    } else {
      if (start !== null) {
        if (x - start >= 4) bands.push({ start, end: x - 1 });
        start = null;
      }
    }
  }
  if (start !== null && width - start >= 4) {
    bands.push({ start, end: width - 1 });
  }

  const cols = [];
  let prevX = 0;
  if (bands.length > 0 && bands[0].start <= 15) {
    prevX = bands[0].end + 1;
  }
  for (let i = (bands.length > 0 && bands[0].start <= 15 ? 1 : 0); i < bands.length; i++) {
    if (bands[i].start > prevX + 40) {
      cols.push({ left: prevX, right: bands[i].start - 1 });
    }
    prevX = bands[i].end + 1;
  }
  if (prevX < width - 15) {
    cols.push({ left: prevX, right: width - 1 });
  }

  return cols;
}

async function processAllCollages() {
  const publicDir = path.resolve('public');
  const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.png') && f.startsWith('Retro'));

  console.log(`Processing ${files.length} collages...`);

  const catalog = [];
  let globalIndex = 1;

  for (let fi = 0; fi < files.length; fi++) {
    const filename = files[fi];
    const filePath = path.join(publicDir, filename);
    const image = sharp(filePath);
    const meta = await image.metadata();
    const raw = await image.raw().toBuffer();

    const { rows } = await findHorizontalSeparators(raw, meta.width, meta.height);
    console.log(`\nCollage [${fi+1}/${files.length}]: ${filename} -> Found ${rows.length} rows`);

    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      let cols = findVerticalSeparatorsInRow(raw, meta.width, row.top, row.bottom);
      
      // Safety check for Grid-4 or images where 3 columns were expected
      if (filename.includes('Grid-4') && cols.length === 2 && cols[1].right - cols[1].left > 800) {
        cols = [
          { left: cols[0].left, right: 509 },
          { left: 520, right: 1017 },
          { left: 1028, right: 1530 }
        ];
      }

      console.log(`  Row ${r+1} (Y: ${row.top}..${row.bottom}): ${cols.length} panels`);

      for (let c = 0; c < cols.length; c++) {
        const col = cols[c];
        
        // Add 2px inner safety padding to strip any residual separator line
        const left = Math.min(meta.width - 1, col.left + 2);
        const top = Math.min(meta.height - 1, row.top + 2);
        const w = Math.max(10, col.right - col.left - 3);
        const h = Math.max(10, row.bottom - row.top - 3);

        const outName = `panel_${fi+1}_r${r+1}_c${c+1}.webp`;
        const outPath = path.join(baseDir, 'decorative', outName);

        await sharp(filePath)
          .extract({ left, top, width: w, height: h })
          .webp({ quality: 92 })
          .toFile(outPath);

        catalog.push({
          id: globalIndex,
          source: filename,
          row: r + 1,
          col: c + 1,
          file: outName,
          relPath: `/images/rehearse/decorative/${outName}`,
          width: w,
          height: h
        });

        globalIndex++;
      }
    }
  }

  console.log(`\nSuccessfully extracted ${catalog.length} individual illustration panels!`);
  fs.writeFileSync(path.join(baseDir, 'catalog.json'), JSON.stringify(catalog, null, 2));
}

processAllCollages().catch(console.error);
