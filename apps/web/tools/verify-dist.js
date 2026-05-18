import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(__dirname, '..');
const distRoot = path.resolve(__dirname, '../../../dist/apps/web');
const indexPath = path.join(distRoot, 'index.html');
const assetsDir = path.join(distRoot, 'assets');
const productionEnvPath = path.join(webRoot, '.env.production');

/** @see apps/web/governance/VERIFY-DIST-RULES.md */
const FORBIDDEN_BUNDLE_SUBSTRINGS = [
  'api.smartfashion.site',
  'horizons-vite-error',
  'horizons-runtime-error',
  'horizons-console-error',
  'horizons-navigation-error',
  'hcgi/platform',
  'railway.app',
  'abc.up.railway',
];

function fail(message) {
  console.error('[verify-dist] FAIL:', message);
  process.exit(1);
}

function warn(message) {
  console.warn('[verify-dist] CRITICAL-DEBT:', message);
}

function parseEnvFile(filePath) {
  /** @type {Record<string, string>} */
  const out = {};
  if (!fs.existsSync(filePath)) return out;
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    out[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return out;
}

function assertNoForbidden(content, label) {
  for (const needle of FORBIDDEN_BUNDLE_SUBSTRINGS) {
    if (content.includes(needle)) {
      fail(`${label} contains forbidden "${needle}"`);
    }
  }
}

if (!fs.existsSync(indexPath)) {
  fail('missing dist/apps/web/index.html — run npm run build:clean');
}

const productionEnv = parseEnvFile(productionEnvPath);
const contractApiBase = (
  process.env.VITE_API_BASE_URL ||
  productionEnv.VITE_API_BASE_URL ||
  ''
).trim();

const indexHtml = fs.readFileSync(indexPath, 'utf8');
const jsInHtml = indexHtml.match(/\/assets\/(index-[^"]+\.js)/)?.[1];
const cssInHtml = indexHtml.match(/\/assets\/(index-[^"]+\.css)/)?.[1];

if (!jsInHtml || !cssInHtml) {
  fail('index.html missing hashed /assets/index-* references');
}

assertNoForbidden(indexHtml, 'index.html');

if (!fs.existsSync(assetsDir)) {
  fail('missing dist/apps/web/assets directory');
}

const jsFiles = fs.readdirSync(assetsDir).filter((f) => f.endsWith('.js'));
const cssFiles = fs.readdirSync(assetsDir).filter((f) => f.endsWith('.css'));

const indexJsFiles = jsFiles.filter((f) => /^index-/.test(f) && f.endsWith('.js'));
const indexCssFiles = cssFiles.filter((f) => /^index-/.test(f) && f.endsWith('.css'));

if (indexJsFiles.length !== 1) {
  fail(
    `expected exactly one index-*.js in assets (stale-hash guard); found: ${indexJsFiles.join(', ') || '(none)'}`
  );
}
if (indexCssFiles.length !== 1) {
  fail(
    `expected exactly one index-*.css in assets (stale-hash guard); found: ${indexCssFiles.join(', ') || '(none)'}`
  );
}

if (!jsFiles.includes(jsInHtml)) {
  fail(`index.html references ${jsInHtml} but assets has ${jsFiles.join(', ')}`);
}
if (!cssFiles.includes(cssInHtml)) {
  fail(`index.html references ${cssInHtml} but assets has ${cssFiles.join(', ')}`);
}

const bundle = jsFiles.map((f) => fs.readFileSync(path.join(assetsDir, f), 'utf8')).join('\n');
const allCss = cssFiles.map((f) => fs.readFileSync(path.join(assetsDir, f), 'utf8')).join('\n');

assertNoForbidden(bundle, 'JS bundle');
assertNoForbidden(allCss, 'CSS bundle');

const pbChunks = jsFiles.filter((f) => f.startsWith('pocketbaseClient-'));
if (pbChunks.length > 0) {
  fail(`forbidden pocketbase chunk in assets: ${pbChunks.join(', ')}`);
}

if (/\bpocketbase\b/i.test(bundle) || bundle.includes('PocketBase')) {
  fail('JS bundle still contains PocketBase runtime references');
}

if (contractApiBase) {
  const normalized = contractApiBase.replace(/\/+$/, '');
  if (!bundle.includes(normalized)) {
    fail(`bundle missing production API base "${normalized}" — check apps/web/.env.production`);
  }
  if (/smartfashion\.site\/api(?!\/v1)/.test(bundle)) {
    fail('bundle references smartfashion.site/api without /v1 — check VITE_API_BASE_URL');
  }
} else {
  fail('missing VITE_API_BASE_URL in .env.production');
}

const pbUrl = (process.env.VITE_POCKETBASE_URL ?? productionEnv.VITE_POCKETBASE_URL ?? '').trim();
if (pbUrl) {
  const host = pbUrl.replace(/\/+$/, '').replace(/\/api$/, '').replace(/^https?:\/\//, '');
  if (host && !bundle.includes(host)) {
    fail(`bundle missing VITE_POCKETBASE_URL host "${host}"`);
  }
}

const bnLocale = path.join(distRoot, 'locales/bn/translation.json');
const enLocale = path.join(distRoot, 'locales/en/translation.json');
if (fs.existsSync(path.join(distRoot, 'locales'))) {
  if (!fs.existsSync(bnLocale) || !fs.existsSync(enLocale)) {
    fail('dist locales/ incomplete — expected bn and en translation.json');
  }
}

console.log('[verify-dist] OK');
console.log('  index.html ->', jsInHtml, cssInHtml);
console.log('  assets js:', jsFiles.join(', '));
console.log('  contract API:', contractApiBase);
