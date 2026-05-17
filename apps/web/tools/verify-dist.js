import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distRoot = path.resolve(__dirname, '../../../dist/apps/web');
const indexPath = path.join(distRoot, 'index.html');
const assetsDir = path.join(distRoot, 'assets');

function fail(message) {
  console.error('[verify-dist] FAIL:', message);
  process.exit(1);
}

if (!fs.existsSync(indexPath)) {
  fail('missing dist/apps/web/index.html — run npm run build:clean');
}

const indexHtml = fs.readFileSync(indexPath, 'utf8');
const jsInHtml = indexHtml.match(/\/assets\/(index-[^"]+\.js)/)?.[1];
const cssInHtml = indexHtml.match(/\/assets\/(index-[^"]+\.css)/)?.[1];

if (!jsInHtml || !cssInHtml) {
  fail('index.html missing hashed /assets/index-* references');
}

if (!fs.existsSync(assetsDir)) {
  fail('missing dist/apps/web/assets directory');
}

const jsFiles = fs.readdirSync(assetsDir).filter((f) => f.endsWith('.js'));
const cssFiles = fs.readdirSync(assetsDir).filter((f) => f.endsWith('.css'));

if (!jsFiles.includes(jsInHtml)) {
  fail(`index.html references ${jsInHtml} but assets has ${jsFiles.join(', ')}`);
}
if (!cssFiles.includes(cssInHtml)) {
  fail(`index.html references ${cssInHtml} but assets has ${cssFiles.join(', ')}`);
}

const bundle = jsFiles.map((f) => fs.readFileSync(path.join(assetsDir, f), 'utf8')).join('\n');
if (bundle.includes('hcgi/platform')) {
  fail('bundle still contains hcgi/platform — rebuild from current source');
}

if (bundle.includes('railway.app') || bundle.includes('abc.up.railway')) {
  fail('bundle still contains Railway PocketBase URL — rebuild with apps/web/.env.production');
}

const apiUrl = (process.env.VITE_API_BASE_URL || '').trim();
if (apiUrl) {
  const host = apiUrl.replace(/\/+$/, '').replace(/^https?:\/\//, '');
  if (host && !bundle.includes(host)) {
    fail(`bundle missing VITE_API_BASE_URL host "${host}" — check .env.production`);
  }
}

const pbUrl = (process.env.VITE_POCKETBASE_URL || '').trim();
if (pbUrl) {
  const host = pbUrl.replace(/\/+$/, '').replace(/\/api$/, '').replace(/^https?:\/\//, '');
  if (host && !bundle.includes(host)) {
    fail(`bundle missing VITE_POCKETBASE_URL host "${host}" — rebuild with .env set`);
  }
}

console.log('[verify-dist] OK');
console.log('  index.html ->', jsInHtml, cssInHtml);
console.log('  assets:', jsFiles[0], cssFiles[0]);
