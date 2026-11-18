/** Everything the map page shows: the map, the roadmap's milestones with their pages, and what fails the checks. */

import { readCapabilityMap } from './capability-map.mjs';
import { MILESTONE_LIMIT, mapProblems } from './map-checks.mjs';
import { readRoadmap } from './roadmap.mjs';

export async function mapState(docs) {
  const map = await readCapabilityMap(docs);
  if (!map) return { exists: false };
  const milestones = await readRoadmap(docs);
  return { exists: true, ...map, milestones, limit: MILESTONE_LIMIT, problems: mapProblems({ map, milestones }) };
}

export function mapSummary(state) {
  if (!state.exists) return { exists: false };
  return { exists: true, status: state.status, problems: state.problems.length };
}
