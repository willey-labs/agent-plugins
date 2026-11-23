/* Review frame, part 1 of 7: the review's shared state and the helpers every part uses. */
const REVIEW_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const REVIEW_POINTER_SVG = '<svg viewBox="0 0 22 22" width="22" height="22" aria-hidden="true"><path d="M4 2v16.5l4.6-4.3 2.9 6.6 2.7-1.2-2.9-6.5H18z" fill="#111" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>';
const REVIEW_NO_PHONE = '<p class="no-phone">The product has no phone screen for this. It shows on desktop only.</p>';
const REVIEW_CHEVRONS = { '-1': '<path d="m15 18-6-6 6-6"/>', 1: '<path d="m9 18 6-6-6-6"/>' };
const REVIEW = {
  defs: {}, answers: {}, decisions: [], sliders: [], mode: 'file', device: 'desktop',
  deck: { index: 0, articles: [] },
  config: { desktop: { width: (screen) => screen.availWidth }, mobile: { width: 390 }, publishedAt: '' },
};

class ReviewCancelled extends Error {}

function reviewFind(selector, root = document) {
  return root.querySelector(selector);
}

function reviewEsc(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function reviewChevron(step) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${REVIEW_CHEVRONS[step]}</svg>`;
}

function reviewAnswerKey(id) {
  return id.toLowerCase().replace('-', '');
}

function defineDecision(id, def) {
  REVIEW.defs[id] = def;
}
