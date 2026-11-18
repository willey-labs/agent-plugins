import { areaOf, borrowedStep, buildOf, capabilityOf, statusLabel, subsIn } from '../deck-view.mjs';
import { esc, slide } from './frame.mjs';

function stepItem({ deck, milestone, step, index }) {
  const borrowed = subsIn(deck, milestone.id).filter((sub) => borrowedStep(milestone, sub) === index + 1);
  const ids = borrowed.map((sub) => `<span class="brings" style="--c:${areaOf(deck, sub.feature.capability).color}">${esc(sub.id)}</span>`).join('');
  return `<li><span class="num">${index + 1}</span><div><p>${esc(step)}</p>${ids ? `<div class="needs">borrows ${ids}</div>` : ''}</div></li>`;
}

function chip(deck, milestone, sub) {
  const area = areaOf(deck, sub.feature.capability);
  const step = borrowedStep(milestone, sub);
  const unbuilt = milestone.status === 'current' && buildOf(milestone, sub.feature.id) !== 'built';
  const badges = `${step ? `<em>step ${step}</em>` : ''}${unbuilt ? '<em class="todo">not built yet</em>' : ''}`;
  return `<span class="chip${step ? ' pulled' : ''}${unbuilt ? ' open' : ''}" style="--c:${area.color};--t:${area.tint}"><b>${esc(sub.id)}</b>${esc(sub.name)}${badges}</span>`;
}

function builtList(deck, milestone) {
  const byFeature = new Map();
  for (const sub of subsIn(deck, milestone.id)) byFeature.set(sub.feature, [...(byFeature.get(sub.feature) ?? []), sub]);
  return [...byFeature].map(([feature, list]) => `<div class="fgroup"><h4>${esc(feature.name)}</h4>
  <div class="chips">${list.map((sub) => chip(deck, milestone, sub)).join('')}</div></div>`).join('');
}

function leftColumn(deck, milestone, position) {
  const area = areaOf(deck, milestone.capability);
  const capability = capabilityOf(deck, milestone.capability);
  const page = milestone.page;
  const later = page?.excludes ? `<p class="later"><span>Left for later</span>${esc(page.excludes)}</p>` : '';
  return `<div class="mleft">
    <p class="eyebrow">Milestone ${position} of ${deck.milestones.length} · <span class="status ${milestone.status}">${statusLabel(milestone)}</span></p>
    <div class="mnum">${esc(milestone.id)}</div>
    <h1 class="mtitle">${esc(milestone.name)}</h1>
    ${capability ? `<p class="mcap"><i style="background:${area.color}"></i>${esc(capability.id)} ${esc(capability.name)}</p>` : ''}
    ${page?.goal ? `<blockquote>${esc(page.goal)}</blockquote>` : ''}
    ${later}
  </div>`;
}

export function detailPage(deck, milestone) {
  const area = areaOf(deck, milestone.capability);
  const position = deck.milestones.indexOf(milestone) + 1;
  const page = milestone.page;
  const test = page
    ? `<ol class="story">${page.exit.map((step, index) => stepItem({ deck, milestone, step, index })).join('')}</ol>`
    : '<p class="later-note">The goal and the exit check are written when the milestone opens.</p>';
  const dense = subsIn(deck, milestone.id).length > 16 ? ' dense' : '';
  return slide({ cls: `detail${dense}`, name: `appendix page for ${milestone.id}`, body: `<div class="detail-grid" style="--c:${area.color};--t:${area.tint}">
  ${leftColumn(deck, milestone, position)}
  <div class="mright"><h2>The test that closes it</h2>${test}<h2>What gets built</h2><div class="built">${builtList(deck, milestone)}</div></div>
</div>` });
}
