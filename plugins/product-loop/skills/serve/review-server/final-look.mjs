import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

export function stampIn(html) {
  const tag = html.match(/<meta\s+name=["']drawn-from["']\s+content=["']([^"']*)["']/i);
  if (!tag) return null;
  const stamp = {};
  for (const part of tag[1].split(',')) {
    const [, id, letter] = part.trim().match(/^(D-\d+)\s+([A-Za-z])$/) ?? [];
    if (id) stamp[id.toLowerCase().replace('-', '')] = letter.toLowerCase();
  }
  return stamp;
}

export function driftBetween({ stamp, answers }) {
  const ids = new Set([...Object.keys(stamp), ...Object.keys(answers)]);
  return [...ids]
    .filter((id) => (stamp[id] ?? null) !== (answers[id]?.choice ?? null))
    .sort()
    .map((id) => id.toUpperCase().replace(/^D(\d+)$/, 'D-$1'));
}

export async function stateOfDrawing({ folder, answers }) {
  const file = join(folder, 'final-look.html');
  if (!existsSync(file)) return { state: 'none', drifted: [] };

  const stamp = stampIn(await readFile(file, 'utf8'));
  if (!stamp) return { state: 'unstamped', drifted: [] };

  const drifted = driftBetween({ stamp, answers });
  return { state: drifted.length ? 'stale' : 'current', drifted };
}
