/** Finds the milestone folders under docs/ and reports what each one holds. */

import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { answersIn, progressOf } from './decisions-markdown.mjs';
import { stateOfDrawing } from './final-look.mjs';

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

async function describe({ docs, id }) {
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
  };
}

export async function listMilestones(docs) {
  const entries = await readdir(docs, { withFileTypes: true });
  const ids = entries
    .filter((entry) => entry.isDirectory() && isMilestoneId(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => numberOf(a) - numberOf(b));
  return Promise.all(ids.map((id) => describe({ docs, id })));
}
