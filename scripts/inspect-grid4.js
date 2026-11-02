import sharp from 'sharp';
import path from 'path';

async function inspectGrid4() {
  const filePath = path.join('public', 'Retro Editorial Illustration Grid-4.png');
  const image = sharp(filePath);
  const { width, height } = await image.metadata();
  const raw = await image.raw().toBuffer();

  for (const y of [160, 500, 850]) {
    let brightX = [];
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      const b = (raw[idx] + raw[idx+1] + raw[idx+2]) / 3;
      if (b > 220) brightX.push(x);
    }
    let groups = [];
    let cur = null;
    for (const x of brightX) {
      if (cur === null) cur = { start: x, end: x };
      else if (x === cur.end + 1) cur.end = x;
      else {
        if (cur.end - cur.start > 3) groups.push(cur);
        cur = { start: x, end: x };
      }
    }
    if (cur && cur.end - cur.start > 3) groups.push(cur);
    console.log(`Grid 4 Y=${y}:`, groups);
  }
}

inspectGrid4().catch(console.error);

