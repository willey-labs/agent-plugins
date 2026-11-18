import { capabilityOf } from '../deck-view.mjs';
import { esc, slide } from './frame.mjs';
import { journeyChart } from './journey-chart.mjs';

function level(name, what, example) {
  return `<div class="level"><span>${esc(name)}</span><p>${esc(what)}</p><b>${esc(example)}</b></div>`;
}

export function cutSlide(deck, number) {
  const sub = deck.subs.find((s) => s.id === deck.copy.example);
  const capability = capabilityOf(deck, sub.feature.capability);
  const milestone = deck.milestones.find((m) => m.id === sub.milestone);
  const chev = '<div class="chev"></div>';
  return slide({ number, footer: deck.copy.title, label: 'How the work is cut', body: `
  <h1 class="headline">Capability first, then feature, then sub‑feature</h1>
  <div class="levels">
    ${level('Capability', 'An area of the business someone would miss', capability.name)}${chev}
    ${level('Feature', 'A screen, service or connection people use', sub.feature.name)}${chev}
    ${level('Sub-feature', 'One behaviour you can see or test', sub.name)}${chev}
    ${level('Milestone', 'A set of sub-features with one test that closes it', milestone ? `${milestone.id} ${milestone.name}` : 'Not planned yet')}
  </div>` });
}

export function rulesSlide(deck, number) {
  const rules = [
    ['One', 'main capability per milestone', 'Its goal says which person is better off.'],
    ['Borrow', 'only what the test needs', 'A sub-feature from another capability joins only when a step of the exit check needs it.'],
    ['Once', 'every sub‑feature lands once', `${deck.subs.length} sub-features, each in exactly one milestone. Nothing planned twice, nothing lost.`],
  ];
  const cards = rules.map(([big, title, text]) => `<div class="rulecard"><b>${big}</b><h2>${esc(title)}</h2><p>${esc(text)}</p></div>`).join('');
  return slide({ number, footer: deck.copy.title, label: 'How the work is cut', body: `
  <h1 class="headline">Three rules keep every milestone focused</h1>
  <div class="rulecards">${cards}</div>` });
}

export function journeySlide(deck, number) {
  return slide({ number, footer: deck.copy.title, label: 'The journey', cls: 'journey-slide', body: `
  <h1 class="headline">Each milestone moves one capability forward</h1>
  ${journeyChart(deck)}` });
}
