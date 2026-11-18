import { areaOf, capabilityOf, statusLabel } from '../deck-view.mjs';
import { counted, esc, icon, slide } from './frame.mjs';

function station(deck, milestone, index) {
  const count = deck.milestones.length;
  const side = index % 2 === 0 ? 'above' : 'below';
  const left = count > 1 ? (index / (count - 1)) * 100 : 50;
  const current = milestone.status === 'current';
  const tag = current ? '<i>in progress</i>' : '';
  return `<div class="station ${side}${current ? ' current' : ''}${milestone.status === 'open' ? ' planned' : ''}" style="left:${left}%">
<span class="dot" style="background:${areaOf(deck, milestone.capability).color}"></span>
<span class="label"><b>${esc(milestone.id)}</b>${esc(milestone.name)}${tag}</span></div>`;
}

export function titleSlide(deck) {
  const built = deck.milestones.filter((m) => statusLabel(m) === 'Built').length;
  const stats = [
    [deck.state.capabilities.length, 'capabilities'], [deck.features.length, 'features'],
    [deck.subs.length, 'sub-features'], [`${built} of ${deck.milestones.length}`, 'milestones built'],
  ].map(([value, label]) => `<span><b>${value}</b> ${label}</span>`).join('');
  return slide({ dark: true, cls: 'title', body: `
  <p class="kicker">${esc(deck.copy.date ?? '')}</p>
  <h1>${esc(deck.copy.title)}</h1>
  <p class="lede">${esc(deck.copy.subtitle)}</p>
  <div class="route"><div class="track"></div>${deck.milestones.map((m, i) => station(deck, m, i)).join('')}</div>
  <div class="title-stats">${stats}</div>` });
}

function actor(deck, entry) {
  const area = deck.areas.find((a) => a.name === entry.area);
  return `<div class="actor">${icon(entry.icon, area?.color ?? '#6f685f', 52)}<b>${esc(entry.name)}</b><span>${esc(entry.text)}</span></div>`;
}

export function flowSlide(deck, number) {
  const flow = deck.copy.flow;
  const parts = flow.front.flatMap((entry, i) => [
    actor(deck, entry), ...(i < flow.links.length ? [`<div class="arrow"><span>${esc(flow.links[i])}</span></div>`] : []),
  ]);
  const behind = (flow.behind ?? []).map((entry) => actor(deck, entry)).join('');
  return slide({ number, footer: deck.copy.title, label: 'The product', body: `
  <h1 class="headline">${esc(flow.headline)}</h1>
  <div class="flow cols-${flow.front.length}">${parts.join('')}</div>
  ${behind ? `<div class="behind">${behind}</div>` : ''}` });
}

function areaColumn(deck, area) {
  const items = (area.capabilities ?? []).map((id) => capabilityOf(deck, id)).filter(Boolean).map((c) => {
    const subs = c.features.reduce((n, f) => n + f.subs.length, 0);
    return `<li><b>${esc(c.name)}</b><span>${counted(c.features.length, 'feature')} · ${counted(subs, 'sub-feature')}</span></li>`;
  }).join('');
  return `<div class="area" style="--c:${area.color};--t:${area.tint}"><h2>${esc(area.name)}</h2><ul>${items}</ul></div>`;
}

export function areasSlide(deck, number) {
  const count = deck.state.capabilities.length;
  return slide({ number, footer: deck.copy.title, label: 'The map', body: `
  <h1 class="headline">${count} capabilities, in ${deck.areas.length} areas of the business</h1>
  <div class="areas cols-${deck.areas.length}">${deck.areas.map((a) => areaColumn(deck, a)).join('')}</div>` });
}
