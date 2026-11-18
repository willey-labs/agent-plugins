import { readFileSync } from 'node:fs';

import { detailPage } from './slides/detail-pages.mjs';
import { esc, slide } from './slides/frame.mjs';
import { cutSlide, journeySlide, rulesSlide } from './slides/method-slides.mjs';
import { milestoneSlide, overviewSlide, statusSlide } from './slides/milestone-slides.mjs';
import { areasSlide, flowSlide, titleSlide } from './slides/opening-slides.mjs';

const css = readFileSync(new URL('./deck.css', import.meta.url), 'utf8');
const layoutCheck = readFileSync(new URL('./layout-check.js', import.meta.url), 'utf8');

function talkSlides(deck) {
  const builders = [
    () => titleSlide(deck),
    (n) => flowSlide(deck, n),
    (n) => areasSlide(deck, n),
    (n) => cutSlide(deck, n),
    (n) => rulesSlide(deck, n),
    (n) => journeySlide(deck, n),
    (n) => overviewSlide(deck, n),
    ...deck.milestones.map((milestone) => (n) => milestoneSlide(deck, milestone, n)),
    (n) => statusSlide(deck, n),
  ];
  return builders.map((build, index) => build(index + 1));
}

function appendix(deck) {
  const divider = slide({ dark: true, cls: 'divider', label: 'Appendix', name: 'appendix divider', body: `
  <h1>Every milestone in detail</h1>
  <p>The full exit check, and every sub-feature each milestone builds, for questions after the talk.</p>` });
  return [divider, ...deck.milestones.map((milestone) => detailPage(deck, milestone))];
}

export function deckHtml(deck) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(deck.copy.title)}</title>
<style>${css}</style></head>
<body>${[...talkSlides(deck), ...appendix(deck)].join('\n')}
<script>${layoutCheck}</script></body></html>`;
}
