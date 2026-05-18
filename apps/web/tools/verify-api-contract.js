import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..');
const srcRoot = path.join(webRoot, 'src');
const endpointsFile = path.join(srcRoot, 'lib/api/endpoints.js');

function fail(message) {
  console.error('[verify-api-contract] FAIL:', message);
  process.exit(1);
}

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      walk(full, files);
    } else if (/\.(js|jsx)$/.test(name)) {
      files.push(full);
    }
  }
  return files;
}

const forbidden = [
  /api\.smartfashion\.site/i,
  /VITE_API_URL/,
  /VITE_BACKEND_URL/,
  /['"`]\/api\/(?!v1)/, // bare /api/ not /api/v1 in string literals (heuristic)
];

const srcFiles = walk(srcRoot).filter((f) => !f.includes(`${path.sep}lib${path.sep}api${path.sep}`));

for (const file of srcFiles) {
  const text = fs.readFileSync(file, 'utf8');
  for (const pattern of forbidden) {
    if (pattern.test(text)) {
      fail(`${path.relative(webRoot, file)} matches forbidden pattern ${pattern}`);
    }
  }
}

if (!fs.existsSync(endpointsFile)) {
  fail('missing lib/api/endpoints.js');
}

const endpointsSrc = fs.readFileSync(endpointsFile, 'utf8');
const requiredPaths = ['/homepage', '/categories', '/products', '/auth/login', '/hero-slides', '/homepage-banners'];
for (const p of requiredPaths) {
  if (!endpointsSrc.includes(p)) {
    fail(`endpoints.js missing path ${p}`);
  }
}

const envProd = path.join(webRoot, '.env.production');
if (fs.existsSync(envProd)) {
  const env = fs.readFileSync(envProd, 'utf8');
  if (!env.includes('https://smartfashion.site/api/v1')) {
    fail('.env.production must set VITE_API_BASE_URL=https://smartfashion.site/api/v1');
  }
}

console.log('[verify-api-contract] OK');
console.log('  scanned', srcFiles.length, 'source files');
console.log('  contract base: https://smartfashion.site/api/v1');
