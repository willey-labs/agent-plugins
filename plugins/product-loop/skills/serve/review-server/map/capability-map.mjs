/** Reads docs/capabilities.md: every capability, its features, and the milestone each sub-feature lands in. */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { labelled, tableWith } from './markdown-text.mjs';

const CAPABILITY = /^##\s+(C-\d+)\s+(.+?)\s*$/;
const FEATURE = /^###\s+(F-\d+)\s+(.+?)(?:\s+·\s+([a-z]+))?\s*$/;
const LABEL_LINE = /^[A-Z][A-Za-z ]*:/;

function blocksOf(lines) {
  const capabilities = [];
  for (const line of lines) {
    const capability = CAPABILITY.exec(line);
    const feature = FEATURE.exec(line);
    const open = capabilities.at(-1);
    if (capability) capabilities.push({ id: capability[1], name: capability[2], lines: [], features: [] });
    else if (feature && open) open.features.push({ id: feature[1], name: feature[2], kind: feature[3] ?? '', lines: [] });
    else if (open) (open.features.at(-1) ?? open).lines.push(line);
  }
  return capabilities;
}

function subFeaturesOf(feature) {
  const table = tableWith(feature.lines, ['id', 'sub-feature', 'milestone']);
  return (table?.rows ?? []).map((row) => ({ id: row.id, name: row['sub-feature'], milestone: row.milestone }));
}

function capabilityOf(block) {
  return {
    id: block.id,
    name: block.name,
    serves: labelled(block.lines, 'Serves') ?? '',
    outcome: labelled(block.lines, 'Outcome') ?? '',
    features: block.features.map((feature) => ({
      id: feature.id, name: feature.name, kind: feature.kind, subs: subFeaturesOf(feature),
    })),
  };
}

function introOf(lines) {
  const end = lines.findIndex((line) => line.startsWith('## '));
  const intro = end === -1 ? lines : lines.slice(0, end);
  const line = intro.find((text) => text.trim() && !/^[#|]/.test(text) && !LABEL_LINE.test(text));
  return { line: line?.trim() ?? '', actors: labelled(intro, 'Actors') ?? '', status: labelled(intro, 'Map') ?? '' };
}

export async function readCapabilityMap(docs) {
  const file = join(docs, 'capabilities.md');
  if (!existsSync(file)) return null;
  const lines = (await readFile(file, 'utf8')).split('\n');
  return { ...introOf(lines), capabilities: blocksOf(lines).map(capabilityOf) };
}
