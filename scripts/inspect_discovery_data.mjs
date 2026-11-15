import fs from 'fs';

const content = fs.readFileSync('src/modules/discovery/data/discoveryData.ts', 'utf8');

function showHotspots(id) {
  const marker = `${id}: {`;
  const idx = content.indexOf(marker);
  if (idx === -1) return;
  const hotspotIdx = content.indexOf('hotspots: [', idx);
  if (hotspotIdx === -1) return;
  console.log(`=== HOTSPOTS: ${id} ===`);
  console.log(content.substring(hotspotIdx, hotspotIdx + 1600));
}

showHotspots('mars');
showHotspots('moon');
showHotspots('neptune');
