/** Checks the capability map against the roadmap and the milestone pages: where each sub-feature lands, and why. */

export const MILESTONE_LIMIT = 15;

function subFeaturesOf(map) {
  return map.capabilities.flatMap((capability) =>
    capability.features.flatMap((feature) => feature.subs.map((sub) => ({ ...sub, capability: capability.id }))));
}

function strays({ subs, milestones }) {
  const known = new Set(milestones.map((milestone) => milestone.id));
  return subs
    .filter((sub) => sub.milestone !== 'later' && !known.has(sub.milestone))
    .map((sub) => `${sub.id} lands in ${sub.milestone || 'no milestone'}, which the roadmap doesn't list.`);
}

function sizes({ subs, milestones }) {
  return milestones.flatMap((milestone) => {
    const count = subs.filter((sub) => sub.milestone === milestone.id).length;
    if (count === 0) return [`${milestone.id} takes no sub-feature on the map.`];
    if (count > MILESTONE_LIMIT) return [`${milestone.id} takes ${count} sub-features, past the limit of ${MILESTONE_LIMIT}.`];
    return [];
  });
}

function unexplained({ subs, milestone }) {
  if (!milestone.capability) return [];
  const steps = Object.fromEntries(milestone.page.subs.map((sub) => [sub.id, sub.exitStep]));
  const last = milestone.page.exit.length;
  return subs
    .filter((sub) => sub.milestone === milestone.id && sub.capability !== milestone.capability)
    .filter((sub) => !(steps[sub.id] >= 1 && steps[sub.id] <= last))
    .map((sub) => `${sub.id} comes from ${sub.capability}, outside ${milestone.id}'s main capability ${milestone.capability}, and names no exit step that needs it.`);
}

function disagreements({ subs, milestone }) {
  const onPage = new Set(milestone.page.subs.map((sub) => sub.id));
  const onMap = subs.filter((sub) => sub.milestone === milestone.id);
  const landing = Object.fromEntries(subs.map((sub) => [sub.id, sub.milestone]));
  const missing = onMap.filter((sub) => !onPage.has(sub.id)).map((sub) => `${sub.id} is in ${milestone.id} on the map but not on its page.`);
  const extra = [...onPage]
    .filter((id) => landing[id] !== milestone.id)
    .map((id) => `${id} is on ${milestone.id}'s page but the map puts it in ${landing[id] ?? 'no milestone'}.`);
  return [...missing, ...extra];
}

export function mapProblems({ map, milestones }) {
  const subs = subFeaturesOf(map);
  const paged = milestones.filter((milestone) => milestone.page?.subs);
  return [
    ...strays({ subs, milestones }),
    ...sizes({ subs, milestones }),
    ...paged.flatMap((milestone) => [...unexplained({ subs, milestone }), ...disagreements({ subs, milestone })]),
  ];
}
