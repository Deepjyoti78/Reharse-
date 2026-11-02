import sharp from 'sharp';
import path from 'path';

async function inspectCol2() {
  const filePath = path.join('public', 'Retro Modernist Productivity Illustration Collection-2.png');
  const image = sharp(filePath);
  const { width, height } = await image.metadata();
  const raw = await image.raw().toBuffer();

  // Print brightness across X at different Y heights
  console.log(`Size: ${width}x${height}`);
  for (const y of [130, 390, 620, 880]) {
    // print where in X the brightness is very high (> 230)
    let brightX = [];
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      const b = (raw[idx] + raw[idx+1] + raw[idx+2]) / 3;
      if (b > 230) {
        brightX.push(x);
      }
    }
    // group contiguous
    let groups = [];
    let cur = null;
    for (const x of brightX) {
      if (cur === null) { cur = { start: x, end: x }; }
      else if (x === cur.end + 1) { cur.end = x; }
      else {
        if (cur.end - cur.start > 3) groups.push(cur);
        cur = { start: x, end: x };
      }
    }
    if (cur && cur.end - cur.start > 3) groups.push(cur);
    console.log(`At Y=${y}, separator groups in X:`, groups);
  }
}

inspectCol2().catch(console.error);

