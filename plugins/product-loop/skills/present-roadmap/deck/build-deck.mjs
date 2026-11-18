import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { findChrome, layoutProblems, printPdf } from './chrome.mjs';
import { copyProblems } from './copy-checks.mjs';
import { deckHtml } from './deck-html.mjs';
import { loadDeck } from './deck-model.mjs';

const docs = resolve(process.argv[2] ?? 'docs');
const out = join(docs, 'presentation');

function report(lines, code) {
  process.stdout.write(`${lines.join('\n')}\n`);
  process.exit(code);
}

const deck = await loadDeck(docs);
if (deck.missing) report([`No ${deck.missing} yet.`], 1);

const wrong = copyProblems(deck);
if (wrong.length) report(['The slide words disagree with the plan:', ...wrong.map((line) => `- ${line}`)], 1);

mkdirSync(out, { recursive: true });
const html = join(out, 'deck.html');
const pdf = join(out, 'deck.pdf');
writeFileSync(html, deckHtml(deck));

const chrome = findChrome();
if (!chrome) report([`Wrote ${html}.`, 'No Chrome or Chromium found, so there is no PDF. Set CHROME_PATH to one and build again.'], 1);

printPdf({ chrome, html, pdf });
const overflow = layoutProblems({ chrome, html });
if (overflow.length) report([`Wrote ${pdf}, but some slides overflow:`, ...overflow.map((line) => `- ${line}`)], 1);
report([`Wrote ${pdf} (${deck.milestones.length} milestones, ${deck.subs.length} sub-features).`], 0);
