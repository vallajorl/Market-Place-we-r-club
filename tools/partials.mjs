// Copia los fragmentos compartidos de _partials/ dentro de cada página.
//
// Cada página marca dónde va cada fragmento:
//   <!-- partial:header -->  …contenido generado…  <!-- /partial:header -->
//
// Uso:
//   node tools/partials.mjs          → actualiza todas las páginas
//   node tools/partials.mjs --check  → solo avisa si alguna está desactualizada (sale con 1)
//
// En el header se marca automáticamente con aria-current="page" el enlace de
// la sección en la que está la página (/precios/ en /precios/, etc.).

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SKIP = new Set(['_partials', 'node_modules', '.git', '.claude', 'tools', 'reviews', 'docs']);
const check = process.argv.includes('--check');

function findPages(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...findPages(p));
    else if (name === 'index.html') out.push(p);
  }
  return out;
}

function loadPartial(name) {
  return readFileSync(join(ROOT, '_partials', name + '.html'), 'utf8').replace(/\r\n/g, '\n').trimEnd();
}

function urlPathOf(file) {
  const rel = relative(ROOT, file).split(sep).join('/');
  return '/' + rel.replace(/index\.html$/, '');
}

function markCurrent(html, pagePath) {
  return html.replace(/<a href="([^"]+)"([^>]*)>/g, (m, href, rest) => {
    if (!html.includes('nav__links') || rest.includes('class=')) return m;
    const isCurrent = href === pagePath || (href !== '/' && pagePath.startsWith(href));
    return isCurrent ? `<a href="${href}" aria-current="page"${rest}>` : m;
  });
}

const RE = /<!-- partial:([\w-]+) -->[\s\S]*?<!-- \/partial:\1 -->/g;
let stale = 0;

for (const file of findPages(ROOT)) {
  const src = readFileSync(file, 'utf8');
  const pagePath = urlPathOf(file);
  const next = src.replace(RE, (_, name) => {
    let body = loadPartial(name);
    if (name === 'header') body = markCurrent(body, pagePath);
    return `<!-- partial:${name} -->\n${body}\n<!-- /partial:${name} -->`;
  });
  if (next !== src) {
    stale++;
    if (check) console.log('desactualizada:', pagePath);
    else { writeFileSync(file, next); console.log('actualizada:', pagePath); }
  }
}

if (check && stale) process.exit(1);
if (!stale) console.log('Todas las páginas están al día.');
