// Leonida Trophy Atlas — the entry program for gta6-trophy-guide-01 (Node 22,
// standard library only). The guide itself is app/: plain static files, opened at
// app/index.html, working offline. This program hands it in: it checks the trophy
// list is complete, copies app/ and screenshots/ to /output, and writes
// /output/dossier.json with the vendored make.fun library — the summary the judge
// reads (the screenshots, the first load's files and bytes, and the source).
// vendor/makefun-frontend.ts is the kit's copy and must stay unchanged: the scorer
// requires dossier.json to be byte for byte what its own copy writes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The gate requires every one of the 55 official trophies to be named with a
// non-blank guide. Refuse to hand in a list that is short before anything is copied.
const trophyDoc = JSON.parse(readFileSync(join(here, 'app', 'data', 'trophies.json'), 'utf8'));
const trophyCount = trophyDoc.trophies.length;
const missingGuide = trophyDoc.trophies.filter((t) => !t.name || !String(t.guide || '').trim());
if (trophyCount !== 55 || missingGuide.length > 0) {
  throw new Error(`trophies.json holds ${trophyCount} trophies, ${missingGuide.length} without a guide; expected 55 with a guide each`);
}

const shots = existsSync(join(here, 'screenshots')) ? readdirSync(join(here, 'screenshots')).filter((f) => !f.startsWith('.')) : [];
if (shots.length < 3 || shots.length > 4) {
  throw new Error(`screenshots/ holds ${shots.length} images; expected 3 or 4`);
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps: only text_max_bytes shapes the bytes; the others refuse
// an entry the scorer would refuse (more than 4 screenshots or one over 256 KiB;
// more than 993 files and directories in app/ or 48 MiB of app files).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);

console.log(`Leonida Trophy Atlas: ${trophyCount} trophies, ${shots.length} screenshots, dossier written to ${join(out, 'dossier.json')}`);

// Say how big the hand-in is, so a local run shows at a glance what the judge will read.
const dossierBytes = statSync(join(out, 'dossier.json')).size;
console.log(`dossier.json: ${dossierBytes} bytes (cap 1572864)`);
