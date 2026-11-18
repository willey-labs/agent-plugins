/** Reads docs/roadmap.md and the page of every milestone it lists. */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { labelled, sectionLines, tableWith } from './markdown-text.mjs';

const ROADMAP_COLUMNS = ['id', 'milestone', 'status', 'folder'];
const NUMBERED_STEP = /^\d+\.\s+(.*)$/;

function featuresOn(lines) {
  const table = tableWith(sectionLines(lines, 'features'), ['id', 'feature', 'decision', 'build']);
  return (table?.rows ?? []).map((row) => ({
    id: row.id, name: row.feature, capability: row.capability ?? '', decision: row.decision, build: row.build,
  }));
}

function subFeaturesOn(lines) {
  const table = tableWith(sectionLines(lines, 'sub-features'), ['id', 'sub-feature']);
  if (!table) return null;
  return table.rows.map((row) => ({ id: row.id, name: row['sub-feature'], exitStep: Number(row['exit step']) || null }));
}

function pageOf(lines) {
  return {
    capability: labelled(lines, 'Capability')?.match(/C-\d+/)?.[0] ?? null,
    goal: labelled(lines, 'Goal') ?? '',
    excludes: labelled(lines, 'Excludes') ?? '',
    exit: sectionLines(lines, 'exit check').map((line) => NUMBERED_STEP.exec(line.trim())?.[1]).filter(Boolean),
    features: featuresOn(lines),
    subs: subFeaturesOn(lines),
  };
}

async function milestoneOf({ docs, row }) {
  const file = join(docs, (row.folder ?? '').replace(/\/+$/, ''), '_milestone.md');
  const readable = file.startsWith(docs) && existsSync(file);
  const page = readable ? pageOf((await readFile(file, 'utf8')).split('\n')) : null;
  const capability = /^C-\d+$/.test(row.capability ?? '') ? row.capability : page?.capability ?? null;
  return { id: row.id, name: row.milestone, status: row.status, folder: row.folder, capability, page };
}

export async function readRoadmap(docs) {
  const file = join(docs, 'roadmap.md');
  if (!existsSync(file)) return [];
  const table = tableWith((await readFile(file, 'utf8')).split('\n'), ROADMAP_COLUMNS);
  return Promise.all((table?.rows ?? []).map((row) => milestoneOf({ docs, row })));
}
