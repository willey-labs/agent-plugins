import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { answersIn, progressOf } from './decisions-markdown.mjs';
import { stateOfDrawing } from './final-look.mjs';
import { tableWith } from './map/markdown-text.mjs';
import { NO_GAPS, prototypeGaps } from './prototype-gaps.mjs';

const FOLDER_PATTERN = /^m\d+-/;

export function isMilestoneId(id) {
  return FOLDER_PATTERN.test(id);
}

function numberOf(id) {
  return Number(id.match(/^m(\d+)/)?.[1] ?? 0);
}

function titleOf(id) {
  return `M${numberOf(id)} ${id.replace(FOLDER_PATTERN, '').replace(/-/g, ' ')}`;
}

async function doneFolders(docs) {
  const file = join(docs, 'roadmap.md');
  if (!existsSync(file)) return new Set();
  const table = tableWith((await readFile(file, 'utf8')).split('\n'), ['status', 'folder']);
  const done = (table?.rows ?? []).filter((row) => row.status === 'done');
  return new Set(done.map((row) => row.folder.replace(/\/+$/, '')));
}

async function describe({ docs, id, done }) {
  const folder = join(docs, id);
  const markdown = join(folder, 'decisions.md');
  const text = existsSync(markdown) ? await readFile(markdown, 'utf8') : null;
  return {
    id,
    title: titleOf(id),
    decisions: existsSync(join(folder, 'decisions.html')),
    finalLook: existsSync(join(folder, 'final-look.html')),
    look: await stateOfDrawing({ folder, answers: text ? answersIn(text) : {} }),
    progress: text ? progressOf(text) : null,
    gaps: done ? NO_GAPS : await prototypeGaps(folder),
  };
}

export async function listMilestones(docs) {
  const entries = await readdir(docs, { withFileTypes: true });
  const done = await doneFolders(docs);
  const ids = entries
    .filter((entry) => entry.isDirectory() && isMilestoneId(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => numberOf(a) - numberOf(b));
  return Promise.all(ids.map((id) => describe({ docs, id, done: done.has(id) })));
}
