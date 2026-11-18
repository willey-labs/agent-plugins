/** Checks the words written for the slides against the map and the roadmap, so the deck never says something the plan doesn't hold. */

import { MAX_AREAS } from './deck-model.mjs';
import { ICON_NAMES } from './slides/frame.mjs';

function areaProblems(deck) {
  const areas = deck.copy.areas ?? [];
  const placed = areas.flatMap((area) => area.capabilities ?? []);
  const known = new Set(deck.state.capabilities.map((c) => c.id));
  return [
    ...(areas.length < 1 || areas.length > MAX_AREAS ? [`areas holds ${areas.length}; write between 1 and ${MAX_AREAS}.`] : []),
    ...[...known].filter((id) => !placed.includes(id)).map((id) => `${id} sits in no area.`),
    ...placed.filter((id, i) => placed.indexOf(id) !== i).map((id) => `${id} sits in more than one area.`),
    ...placed.filter((id) => !known.has(id)).map((id) => `areas names ${id}, which the map doesn't hold.`),
  ];
}

function milestoneProblems(deck) {
  return deck.milestones.flatMap((milestone) => {
    const words = deck.copy.milestones?.[milestone.id];
    if (!words?.headline) return [`${milestone.id} has no headline.`];
    const expected = milestone.page?.exit.length ?? 0;
    const written = (words.steps ?? []).length;
    if (written === expected) return [];
    return [`${milestone.id} has ${written} steps; its exit check has ${expected}.`];
  });
}

function actorProblems(actors, where) {
  return (actors ?? []).flatMap((actor) =>
    ICON_NAMES.includes(actor.icon) ? [] : [`${where} actor "${actor.name}" uses icon "${actor.icon}"; pick one of ${ICON_NAMES.join(', ')}.`]);
}

function flowProblems(deck) {
  const flow = deck.copy.flow ?? {};
  const front = flow.front ?? [];
  return [
    ...(front.length < 2 || front.length > 3 ? [`flow.front holds ${front.length} actors; write 2 or 3.`] : []),
    ...((flow.links ?? []).length !== Math.max(front.length - 1, 0) ? ['flow.links needs one label between each pair of front actors.'] : []),
    ...actorProblems(front, 'flow.front'),
    ...actorProblems(flow.behind, 'flow.behind'),
  ];
}

export function copyProblems(deck) {
  const example = deck.subs.find((sub) => sub.id === deck.copy.example);
  return [
    ...(['title', 'subtitle'].filter((key) => !deck.copy[key]).map((key) => `${key} is empty.`)),
    ...(example ? [] : [`example names "${deck.copy.example ?? ''}", which is no sub-feature on the map.`]),
    ...areaProblems(deck),
    ...flowProblems(deck),
    ...milestoneProblems(deck),
  ];
}
