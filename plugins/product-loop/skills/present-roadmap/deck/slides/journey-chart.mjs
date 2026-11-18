/** The journey chart: capabilities as lanes grouped by area, milestones as columns, a bubble wherever a milestone builds part of a capability. */

import { areaOf, subsIn } from '../deck-view.mjs';
import { esc } from './frame.mjs';

const WIDTH = 1000;
const LABEL_W = 250;
const HEAD_H = 64;
const LANE_H = 36;
const GROUP_GAP = 10;

const radius = (count) => 4 + Math.sqrt(count) * 4;

function lanesOf(deck) {
  const ordered = deck.areas.flatMap((area) => (area.capabilities ?? []).map((id) => ({ id, area })));
  let y = HEAD_H;
  return ordered.map(({ id, area }, index) => {
    if (index > 0 && ordered[index - 1].area !== area) y += GROUP_GAP;
    const lane = { capability: deck.state.capabilities.find((c) => c.id === id), area, top: y };
    y += LANE_H;
    return lane;
  }).filter((lane) => lane.capability);
}

function header(deck, colW) {
  return deck.milestones.map((m, i) => {
    const x = LABEL_W + i * colW + colW / 2;
    const band = m.status === 'current' ? `<rect x="${x - colW / 2 + 2}" y="6" width="${colW - 4}" height="100%" rx="6" fill="#fff4e0"/>` : '';
    const tag = m.status === 'current' ? `<text x="${x}" y="54" class="jtag">in progress</text>` : '';
    return `${band}<text x="${x}" y="36" class="jhead${m.status === 'open' ? ' planned' : ''}">${esc(m.id)}</text>${tag}`;
  }).join('');
}

function bubble({ x, y, count, area, main, planned }) {
  const fill = main ? area.color : '#ffffff';
  const ink = main ? area.onColor : '#1a1612';
  const fade = planned ? ' opacity="0.45"' : '';
  const ring = main ? '' : ` stroke="${area.color}" stroke-width="2" stroke-dasharray="3 2"`;
  return `<g${fade}><circle cx="${x}" cy="${y}" r="${radius(count)}" fill="${fill}"${ring}/><text x="${x}" y="${y + 3.6}" class="jnum" fill="${ink}">${count}</text></g>`;
}

function lane(deck, { capability, area, top }, colW) {
  const y = top + LANE_H / 2;
  const marks = deck.milestones.map((m, i) => {
    const count = subsIn(deck, m.id).filter((sub) => sub.feature.capability === capability.id).length;
    if (!count) return '';
    const x = LABEL_W + i * colW + colW / 2;
    return bubble({ x, y, count, area, main: m.capability === capability.id, planned: m.status === 'open' });
  }).join('');
  return `<rect x="0" y="${top + 4}" width="5" height="${LANE_H - 8}" rx="2" fill="${area.color}"/>
<text x="14" y="${y + 4}" class="jlabel"><tspan class="jcid">${esc(capability.id)}</tspan> ${esc(capability.name)}</text>
<line x1="${LABEL_W}" x2="${WIDTH}" y1="${y}" y2="${y}" class="jrule"/>${marks}`;
}

function legend(deck) {
  const areas = deck.areas.map((a) => `<span><i style="background:${a.color}"></i>${esc(a.name)}</span>`).join('');
  return `<div class="jlegend">
  <span><svg width="16" height="16"><circle cx="8" cy="8" r="7" fill="#57534d"/></svg>main capability of the milestone</span>
  <span><svg width="16" height="16"><circle cx="8" cy="8" r="6" fill="#fff" stroke="#57534d" stroke-width="2" stroke-dasharray="3 2"/></svg>borrowed for a step of its test</span>
  <span>number and size: sub-features built</span>${areas}</div>`;
}

export function journeyChart(deck) {
  const lanes = lanesOf(deck);
  const colW = (WIDTH - LABEL_W) / Math.max(deck.milestones.length, 1);
  const height = (lanes.at(-1)?.top ?? HEAD_H) + LANE_H + 8;
  return `<svg class="journey" viewBox="0 0 ${WIDTH} ${height}" preserveAspectRatio="xMidYMin meet">${header(deck, colW)}${
    lanes.map((l) => lane(deck, l, colW)).join('')}</svg>${legend(deck)}`;
}
