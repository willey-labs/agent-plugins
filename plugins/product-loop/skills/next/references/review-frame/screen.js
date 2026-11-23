/* Review frame, part 7 of 7: real size on desktop and on a phone, and the review started. */
const REVIEW_DEVICE_KEY = 'review-frame-device';
const REVIEW_PAGE_FRAME = 10 + 10 + 2 * 20 + 2;
const REVIEW_SIDE_COLUMN = 300 + 24 + 120;
const REVIEW_PHONE_EDGES = 2 * 6;

function reviewRealWidth() {
  const { desktop, mobile } = REVIEW.config;
  const wanted = REVIEW.device === 'mobile' ? mobile.width + REVIEW_PHONE_EDGES : desktop.width(window.screen);
  return Math.round(Math.max(280, Math.min(wanted, window.innerWidth - REVIEW_SIDE_COLUMN)));
}

function reviewSizeSlides() {
  const root = document.documentElement;
  document.body.classList.add('paged');
  root.style.setProperty('--real-w', `${reviewRealWidth()}px`);
  const top = reviewFind('.review-top').offsetHeight;
  root.style.setProperty('--top-h', `${top}px`);
  root.style.setProperty('--slide-h', `${Math.max(300, window.innerHeight - top - REVIEW_PAGE_FRAME)}px`);
  const shown = REVIEW.sliders[REVIEW.deck.index];
  if (shown) reviewGoToSlide(shown, shown.index, false);
}

function reviewReadDevice() {
  try {
    return localStorage.getItem(REVIEW_DEVICE_KEY) === 'mobile' ? 'mobile' : 'desktop';
  } catch {
    return 'desktop';
  }
}

function reviewPaintDevice() {
  document.documentElement.classList.toggle('device-mobile', REVIEW.device === 'mobile');
  document.querySelectorAll('.device-switch button').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.device === REVIEW.device)));
}

function reviewSetDevice(device) {
  REVIEW.device = device;
  try {
    localStorage.setItem(REVIEW_DEVICE_KEY, device);
  } catch {
    console.info('This browser keeps no settings; the review opens on desktop next time.');
  }
  reviewPaintDevice();
  REVIEW.decisions.forEach(reviewRender);
  reviewSizeSlides();
  const current = REVIEW.decisions[REVIEW.deck.index];
  if (current) reviewPlay(current);
}

function reviewBuildDeviceSwitch() {
  reviewFind('.review-top').insertAdjacentHTML('beforeend', '<div class="device-switch" role="group" aria-label="Screen"><button type="button" data-device="desktop">Desktop</button><button type="button" data-device="mobile">Mobile</button></div>');
  reviewFind('.device-switch').addEventListener('click', (event) => {
    const button = event.target.closest('[data-device]');
    if (button && button.dataset.device !== REVIEW.device) reviewSetDevice(button.dataset.device);
  });
  reviewPaintDevice();
}

function reviewPlayWhenShown(articles) {
  const watcher = new IntersectionObserver((entries) => {
    entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
      const decision = REVIEW.decisions.find((candidate) => candidate.article === entry.target);
      watcher.unobserve(entry.target);
      if (decision && !decision.played) { decision.played = true; reviewPlay(decision); }
    });
  }, { threshold: 0.35 });
  articles.forEach((article) => watcher.observe(article));
}

async function startReview(config = {}) {
  const base = REVIEW.config;
  REVIEW.config = { ...base, ...config, desktop: { ...base.desktop, ...config.desktop }, mobile: { ...base.mobile, ...config.mobile } };
  REVIEW.device = reviewReadDevice();
  const articles = [...document.querySelectorAll('.decision')];
  REVIEW.decisions = articles.map(reviewSetUp);
  articles.forEach(reviewBuildSlider);
  reviewBuildDeck(articles);
  reviewBuildDeviceSwitch();
  reviewSizeSlides();
  window.addEventListener('resize', reviewSizeSlides);
  new ResizeObserver(reviewSizeSlides).observe(reviewFind('.review-top'));
  document.addEventListener('keydown', reviewMoveWithKeys);
  articles.forEach(reviewWireAnswers);
  await reviewConnectAnswers();
  articles.forEach(reviewPaintAnswer);
  reviewStartAtPicks();
  reviewShowDecision(reviewFirstOpenDecision());
  reviewPlayWhenShown(articles);
}
