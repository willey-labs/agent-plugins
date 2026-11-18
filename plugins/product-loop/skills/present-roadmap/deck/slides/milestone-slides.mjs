import { areaOf, borrowedStep, buildOf, builtShare, capabilityOf, copyFor, statusLabel, subsIn } from '../deck-view.mjs';
import { counted, esc, slide } from './frame.mjs';

const BUILD_BADGE = { none: 'not started', planned: 'not started', building: 'being built' };

function tile(deck, milestone) {
  const area = areaOf(deck, milestone.capability);
  return `<div class="mtile ${milestone.status}" style="--c:${area.color};--t:${area.tint}">
  <b>${esc(milestone.id)}</b><h3>${esc(milestone.name)}</h3><p>${esc(copyFor(deck, milestone.id).headline)}</p>
  <span>${statusLabel(milestone)}</span></div>`;
}

export function overviewSlide(deck, number) {
  const count = deck.milestones.length;
  const columns = count <= 4 ? Math.max(count, 1) : count <= 8 ? 4 : count <= 15 ? 5 : 6;
  return slide({ number, footer: deck.copy.title, label: `${deck.milestones.length} milestones`, body: `
  <h1 class="headline">${deck.milestones.length} milestones, each one a change people can feel</h1>
  <div class="mtiles" style="--cols:${columns}">${deck.milestones.map((m) => tile(deck, m)).join('')}</div>` });
}

function storyStep({ deck, milestone, caption, index }) {
  const borrowed = subsIn(deck, milestone.id).filter((sub) => borrowedStep(milestone, sub) === index + 1);
  const features = [...new Set(borrowed.map((sub) => sub.feature))];
  const tags = features.map((f) => `<em style="--g:${areaOf(deck, f.capability).color}">${esc(f.name)}</em>`).join('');
  return `<li><span class="n">${index + 1}</span><div><p>${esc(caption)}</p>${tags ? `<div class="tags">${tags}</div>` : ''}</div></li>`;
}

function featurePill({ deck, milestone, feature, list }) {
  const area = areaOf(deck, feature.capability);
  const borrowed = list.some((sub) => borrowedStep(milestone, sub));
  const badge = milestone.status === 'current' ? BUILD_BADGE[buildOf(milestone, feature.id)] : null;
  const classes = `fpill${borrowed ? ' borrowed' : ''}${badge ? ' open' : ''}`;
  return `<span class="${classes}" style="--c:${area.color};--t:${area.tint}">${esc(feature.name)}<b>${list.length}</b>${badge ? `<i>${badge}</i>` : ''}</span>`;
}

function featurePills(deck, milestone) {
  const byFeature = new Map();
  for (const sub of subsIn(deck, milestone.id)) byFeature.set(sub.feature, [...(byFeature.get(sub.feature) ?? []), sub]);
  return [...byFeature].map(([feature, list]) => featurePill({ deck, milestone, feature, list })).join('');
}

export function milestoneSlide(deck, milestone, number) {
  const area = areaOf(deck, milestone.capability);
  const words = copyFor(deck, milestone.id);
  const position = deck.milestones.indexOf(milestone) + 1;
  const steps = milestone.page
    ? `<ol class="sstory">${words.steps.map((caption, index) => storyStep({ deck, milestone, caption, index })).join('')}</ol>`
    : '<p class="later-note">Its test is written when the milestone opens.</p>';
  const tight = words.steps.length > 5 && words.headline.length > 52 ? ' tight' : '';
  const capability = capabilityOf(deck, milestone.capability);
  return slide({ number, name: `slide ${number} (${milestone.id})`, footer: deck.copy.title, label: `Milestone ${position} of ${deck.milestones.length}`, cls: `mslide${tight}`, body: `
  <div class="mhead" style="--c:${area.color};--t:${area.tint}">
    <div class="mid">${esc(milestone.id)}</div>
    <div class="mmeta"><span class="status ${milestone.status}">${statusLabel(milestone)}</span>${capability ? `<span class="mcapchip"><i></i>${esc(capability.name)}</span>` : ''}<span class="mname">${esc(milestone.name)}</span></div>
  </div>
  <h1 class="mheadline">${esc(words.headline)}</h1>
  <div class="mbody" style="--c:${area.color};--t:${area.tint}">
    <div><h2>Done when</h2>${steps}</div>
    <div><h2>What gets built · ${counted(subsIn(deck, milestone.id).length, 'sub-feature')}</h2><div class="fpills">${featurePills(deck, milestone)}</div>
      <p class="legend-note"><span class="sw"></span>main capability <span class="sw borrowed"></span>borrowed for a step of the test</p></div>
  </div>` });
}

function statusHeadline(deck, current, left) {
  const built = deck.milestones.filter((m) => m.status === 'done').length;
  if (!current) return `${built} of ${deck.milestones.length} milestones built.`;
  const remaining = counted(left.length, 'sub-feature');
  return `${built} of ${deck.milestones.length} milestones built. ${current.id} is ${remaining} from done.`;
}

export function statusSlide(deck, number) {
  const current = deck.milestones.find((m) => m.status === 'current');
  const left = current ? subsIn(deck, current.id).filter((s) => buildOf(current, s.feature.id) !== 'built') : [];
  const segments = deck.milestones.map((m) => `<div class="seg"><div class="fill" style="width:${builtShare(deck, m) * 100}%;background:${areaOf(deck, m.capability).color}"></div><span>${esc(m.id)}</span></div>`).join('');
  const shown = left.slice(0, 5).map((s) => `<li><b>${esc(s.id)}</b> ${esc(s.name)}</li>`).join('');
  const more = left.length > 5 ? `<li class="more">and ${left.length - 5} more</li>` : '';
  const boxes = [
    current ? `<div><h2>Left in ${esc(current.id)}</h2><ul>${shown}${more}</ul></div>` : '',
    deck.copy.next ? `<div><h2>Next</h2><p>${esc(deck.copy.next)}</p></div>` : '',
    deck.copy.after ? `<div><h2>After that</h2><p>${esc(deck.copy.after)}</p></div>` : '',
  ].filter(Boolean).join('');
  return slide({ number, footer: deck.copy.title, label: 'Where we are', body: `
  <h1 class="headline">${esc(statusHeadline(deck, current, left))}</h1>
  <div class="progress" style="--cols:${deck.milestones.length}">${segments}</div>
  <div class="next">${boxes}</div>` });
}
