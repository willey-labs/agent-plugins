/* Review frame, part 6 of 7: one decision per screen, paged by chips, arrows and keys. */
const REVIEW_EDITABLE = 'input, textarea, select, [contenteditable="true"]';
const REVIEW_DECISION_KEYS = { ArrowUp: -1, PageUp: -1, ArrowDown: 1, PageDown: 1 };
const REVIEW_OPTION_KEYS = { ArrowLeft: -1, ArrowRight: 1 };

function reviewDeckStep(step) {
  return `<button type="button" class="deck-step" data-deck-step="${step}" aria-label="${step < 0 ? 'Previous decision' : 'Next decision'}">${reviewChevron(step)}</button>`;
}

function reviewShowDecision(index) {
  const { deck } = REVIEW;
  deck.index = Math.max(0, Math.min(deck.articles.length - 1, index));
  deck.articles.forEach((article, position) => article.classList.toggle('current', position === deck.index));
  document.querySelectorAll('.deck-dot').forEach((dot) => dot.setAttribute('aria-current', String(Number(dot.dataset.deck) === deck.index)));
  reviewFind('.deck-count').textContent = `${deck.articles[deck.index].dataset.decision} · ${deck.index + 1} of ${deck.articles.length}`;
  reviewFind('[data-deck-step="-1"]').disabled = deck.index === 0;
  reviewFind('[data-deck-step="1"]').disabled = deck.index === deck.articles.length - 1;
  const slider = REVIEW.sliders[deck.index];
  requestAnimationFrame(() => reviewGoToSlide(slider, slider.index, false));
}

function reviewBuildDeck(articles) {
  REVIEW.deck.articles = articles;
  const dots = articles.map((article, index) => `<button type="button" class="deck-dot" data-deck="${index}" data-id="${article.dataset.decision}">${article.dataset.decision}</button>`).join('');
  reviewFind('.review-top').insertAdjacentHTML('beforeend', `<nav class="deck-nav" aria-label="Decisions">${reviewDeckStep(-1)}${dots}${reviewDeckStep(1)}<span class="deck-count"></span></nav>`);
  reviewFind('.deck-nav').addEventListener('click', (event) => {
    const dot = event.target.closest('[data-deck]');
    const step = event.target.closest('[data-deck-step]');
    if (dot) reviewShowDecision(Number(dot.dataset.deck));
    if (step) reviewShowDecision(REVIEW.deck.index + Number(step.dataset.deckStep));
  });
}

function reviewFirstOpenDecision() {
  const open = REVIEW.deck.articles.findIndex((article) => !REVIEW.answers[reviewAnswerKey(article.dataset.decision)]?.choice);
  return open < 0 ? 0 : open;
}

function reviewStartAtPicks() {
  REVIEW.sliders.forEach((slider) => {
    const picked = REVIEW.answers[reviewAnswerKey(slider.article.dataset.decision)]?.choice;
    slider.index = Math.max(picked ? slider.letters.indexOf(picked.toUpperCase()) : 0, 0);
  });
}

function reviewMoveWithKeys(event) {
  if (event.target.closest && event.target.closest(REVIEW_EDITABLE)) return;
  if (REVIEW_DECISION_KEYS[event.key]) {
    event.preventDefault();
    reviewShowDecision(REVIEW.deck.index + REVIEW_DECISION_KEYS[event.key]);
    return;
  }
  const slider = REVIEW.sliders[REVIEW.deck.index];
  if (!REVIEW_OPTION_KEYS[event.key] || !slider) return;
  event.preventDefault();
  reviewGoToSlide(slider, slider.index + REVIEW_OPTION_KEYS[event.key]);
}
