import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distRoot = path.resolve(__dirname, '../../../dist/apps/web');
const assetsDir = path.join(distRoot, 'assets');

if (fs.existsSync(assetsDir)) {
  for (const name of fs.readdirSync(assetsDir)) {
    fs.rmSync(path.join(assetsDir, name), { force: true });
  }
}

for (const name of ['index.html']) {
  const file = path.join(distRoot, name);
  if (fs.existsSync(file)) {
    fs.rmSync(file, { force: true });
  }
}

console.log('[build:clean] removed stale dist assets:', distRoot);
