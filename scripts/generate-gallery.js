import fs from 'fs';
import path from 'path';

function makeGallery() {
  const catalogPath = path.resolve('public/images/rehearse/catalog.json');
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Extracted Rehearse Panels Gallery</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #2a1a12; color: #f3e7c9; padding: 20px; }
    h1 { text-align: center; font-size: 28px; margin-bottom: 20px; color: #e0b25c; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
    .card { background: #3a2318; border-radius: 12px; overflow: hidden; border: 1px solid rgba(243, 231, 201, 0.15); display: flex; flex-direction: column; }
    .card img { width: 100%; aspect-ratio: 4/3; object-fit: contain; background: #1f120b; }
    .info { padding: 12px; font-size: 13px; line-height: 1.4; }
    .title { font-weight: bold; color: #e0b25c; margin-bottom: 4px; font-size: 14px; }
    .dims { color: #a9b5a0; font-family: monospace; font-size: 11px; }
    .source { color: #f3e7c9; opacity: 0.7; font-size: 11px; margin-top: 4px; }
  </style>
</head>
<body>
  <h1>Rehearse Extracted Visual Asset Library (${catalog.length} Panels)</h1>
  <div class="grid">
    ${catalog.map((c, i) => `
      <div class="card" id="panel-${i+1}">
        <img src="${c.relPath}" alt="${c.file}" loading="lazy" />
        <div class="info">
          <div class="title">#${i+1} : ${c.file}</div>
          <div class="dims">${c.width} x ${c.height} px (Row ${c.row}, Col ${c.col})</div>
          <div class="source">Source: ${c.source.substring(0, 35)}...</div>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

  fs.writeFileSync(path.resolve('public/gallery.html'), html);
  console.log('Gallery written to public/gallery.html');
}

makeGallery();

