/** Answers the questions every slide asks of the loaded deck: which area a capability sits in, what a milestone builds, how far along it is. */

const NEUTRAL = { name: '', color: '#6f685f', tint: '#efebe5', onColor: '#ffffff' };

export function areaOf(deck, capabilityId) {
  return deck.areas.find((area) => (area.capabilities ?? []).includes(capabilityId)) ?? NEUTRAL;
}

export function capabilityOf(deck, capabilityId) {
  return deck.state.capabilities.find((capability) => capability.id === capabilityId);
}

export function subsIn(deck, milestoneId) {
  return deck.subs.filter((sub) => sub.milestone === milestoneId);
}

export function borrowedStep(milestone, sub) {
  if (!milestone.capability || sub.feature.capability === milestone.capability) return null;
  return milestone.page?.subs?.find((row) => row.id === sub.id)?.exitStep ?? null;
}

export function statusLabel(milestone) {
  if (milestone.status === 'done') return 'Built';
  if (milestone.status === 'current') return 'In progress';
  return 'Planned';
}

export function buildOf(milestone, featureId) {
  if (milestone.status === 'done') return 'built';
  return milestone.page?.features?.find((row) => row.id === featureId)?.build ?? 'none';
}

export function builtShare(deck, milestone) {
  if (milestone.status === 'done') return 1;
  const taken = subsIn(deck, milestone.id);
  if (!taken.length) return 0;
  return taken.filter((sub) => buildOf(milestone, sub.feature.id) === 'built').length / taken.length;
}

export function copyFor(deck, milestoneId) {
  return deck.copy.milestones?.[milestoneId] ?? { headline: '', steps: [] };
}
