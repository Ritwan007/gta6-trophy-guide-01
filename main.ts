// Leonida Trophy Atlas: an offline GTA VI trophy guide and tracker, handed
// in as plain static files. Node 22, standard library only. The program
// copies app/ and screenshots/ from beside this file to /output and writes
// /output/dossier.json with the vendored make.fun library, byte for byte
// the dossier the scorer rebuilds. Leave vendor/makefun-frontend.ts alone.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps: only text_max_bytes shapes the bytes, the rest
// refuse an entry the scorer would refuse (more than 4 screenshots or one
// over 256 KiB; more than 993 files and directories in app/ or 48 MiB).
const dossierPath = join(out, 'dossier.json');
writeFileSync(
  dossierPath,
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);

// A one-line build summary on stdout, so a run shows what it handed in:
// the dossier bytes and the screenshots it carries.
const shotNames = existsSync(join(out, 'screenshots')) ? readdirSync(join(out, 'screenshots')).sort() : [];
console.log(
  `leonida-trophy-atlas: dossier ${statSync(dossierPath).size} bytes, ` +
    `${shotNames.length} screenshot(s) (${shotNames.join(', ')}) -> ${out}`,
);
