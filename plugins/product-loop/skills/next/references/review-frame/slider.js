/* Review frame, part 5 of 7: one option per screen, slid back and forth, its details beside it. */
const REVIEW_SWIPE_PX = 60;
const REVIEW_NOT_A_SWIPE = 'button, a, input, textarea, select, label, [contenteditable="true"]';

function reviewPaintDetail(slider) {
  const option = slider.track.querySelectorAll(':scope > .option')[slider.index];
  if (!option) return;
  const realPick = reviewFind('.pick', option);
  const pick = realPick.cloneNode(true);
  pick.addEventListener('click', () => realPick.click());
  const detail = reviewFind('.opt-detail', slider.article);
  detail.classList.toggle('picked', option.classList.contains('picked'));
  detail.replaceChildren(...['.opt-head', '.cost', '.outcome'].map((part) => reviewFind(part, option).cloneNode(true)), pick);
}

function reviewWatchDetails(slider) {
  const watcher = new MutationObserver(() => reviewPaintDetail(slider));
  slider.track.querySelectorAll(':scope > .option').forEach((option) => {
    watcher.observe(option, { attributes: true, attributeFilter: ['class'] });
    watcher.observe(reviewFind('.outcome', option), { childList: true, characterData: true, subtree: true });
    watcher.observe(reviewFind('.pick', option), { childList: true, attributes: true, subtree: true });
  });
}

function reviewPaintSlider(slider) {
  const { track, article, letters } = slider;
  slider.index = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
  article.querySelectorAll('.slide-dot').forEach((dot, index) => dot.setAttribute('aria-current', String(index === slider.index)));
  reviewFind('.slide-count', article).textContent = `${letters[slider.index]} · ${slider.index + 1} of ${letters.length}`;
  reviewFind('.slide-arrow[data-step="-1"]', article).disabled = slider.index === 0;
  reviewFind('.slide-arrow[data-step="1"]', article).disabled = slider.index === letters.length - 1;
  reviewPaintDetail(slider);
}

function reviewGoToSlide(slider, index, smooth = true) {
  const clamped = Math.max(0, Math.min(slider.letters.length - 1, index));
  slider.track.scrollTo({ left: clamped * slider.track.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
}

function reviewDragToSwipe(slider) {
  const { track } = slider;
  let drag = null;
  track.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest(REVIEW_NOT_A_SWIPE)) return;
    drag = { x: event.clientX, left: track.scrollLeft, from: slider.index, moved: false };
    track.setPointerCapture(event.pointerId);
  });
  track.addEventListener('pointermove', (event) => {
    if (!drag) return;
    drag.moved = drag.moved || Math.abs(event.clientX - drag.x) > 6;
    if (drag.moved) { track.classList.add('dragging'); track.scrollLeft = drag.left - (event.clientX - drag.x); }
  });
  track.addEventListener('pointerup', (event) => {
    if (!drag) return;
    const moved = event.clientX - drag.x;
    track.classList.remove('dragging');
    reviewGoToSlide(slider, drag.from + (Math.abs(moved) < REVIEW_SWIPE_PX ? 0 : -Math.sign(moved)));
    drag = null;
  });
}

function reviewSlideArrow(step) {
  return `<button type="button" class="slide-arrow" data-step="${step}" aria-label="${step < 0 ? 'Previous option' : 'Next option'}">${reviewChevron(step)}</button>`;
}

function reviewSliderShell(article, track, letters) {
  const controls = reviewFind('.d-controls', article);
  controls.insertAdjacentHTML('beforeend', `<div class="slide-nav">${letters.map((letter) => `<button type="button" class="slide-dot" data-go="${letter}">${letter}</button>`).join('')}<span class="slide-count"></span></div>`);
  controls.insertAdjacentHTML('afterend', '<div class="opt-detail" aria-live="polite"></div>');
  track.insertAdjacentHTML('beforebegin', '<div class="slider"></div>');
  const holder = reviewFind('.slider', article);
  holder.insertAdjacentHTML('beforeend', reviewSlideArrow(-1));
  holder.append(track);
  holder.insertAdjacentHTML('beforeend', reviewSlideArrow(1));
  return holder;
}

function reviewBuildSlider(article) {
  const track = reviewFind('.options', article);
  const letters = [...track.querySelectorAll(':scope > .option')].map((option) => option.dataset.letter);
  track.classList.add('track');
  const holder = reviewSliderShell(article, track, letters);
  const slider = { article, track, letters, index: 0 };
  reviewFind('.slide-nav', article).addEventListener('click', (event) => {
    const dot = event.target.closest('[data-go]');
    if (dot) reviewGoToSlide(slider, letters.indexOf(dot.dataset.go));
  });
  holder.addEventListener('click', (event) => {
    const arrow = event.target.closest('[data-step]');
    if (arrow) reviewGoToSlide(slider, slider.index + Number(arrow.dataset.step));
  });
  track.addEventListener('scroll', () => requestAnimationFrame(() => reviewPaintSlider(slider)), { passive: true });
  reviewDragToSwipe(slider);
  reviewWatchDetails(slider);
  REVIEW.sliders.push(slider);
  reviewPaintSlider(slider);
}
