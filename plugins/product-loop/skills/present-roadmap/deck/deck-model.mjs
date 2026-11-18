/** Loads what the deck shows: the capability map, the roadmap's milestones with their pages, and the words written for the slides. */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { mapState } from '../../serve/review-server/map/map-state.mjs';

const PALETTE = [
  { color: '#2a78d6', tint: '#e6effa', onColor: '#ffffff' },
  { color: '#eb6834', tint: '#fdeee7', onColor: '#1a1612' },
  { color: '#1baf7a', tint: '#e3f5ee', onColor: '#1a1612' },
  { color: '#6250d6', tint: '#ecebfb', onColor: '#ffffff' },
];

export const MAX_AREAS = PALETTE.length;
export const COPY_PATH = join('presentation', 'slides.json');

function areasOf(copy) {
  return (copy.areas ?? []).slice(0, MAX_AREAS).map((area, index) => ({ ...area, ...PALETTE[index] }));
}

async function copyIn(docs) {
  const file = join(docs, COPY_PATH);
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (failure) {
    throw new Error(`${file} is not valid JSON: ${failure.message}`);
  }
}

export async function loadDeck(docs) {
  const state = await mapState(docs);
  if (!state.exists) return { missing: 'docs/capabilities.md' };
  const copy = await copyIn(docs);
  if (!copy) return { missing: `docs/${COPY_PATH}` };
  const features = state.capabilities.flatMap((c) => c.features.map((f) => ({ ...f, capability: c.id })));
  const subs = features.flatMap((feature) => feature.subs.map((sub) => ({ ...sub, feature })));
  return { state, copy, areas: areasOf(copy), features, subs, milestones: state.milestones };
}
