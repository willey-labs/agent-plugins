/* Review frame, part 4 of 7: picks and notes, read from and saved to the review server. */
async function reviewFetchJson(url, init) {
  try {
    const response = await fetch(url, { cache: 'no-store', ...init });
    return { ok: response.ok, body: await response.json() };
  } catch {
    return { ok: false, body: null };
  }
}

async function reviewPostAnswer(id, { choice, note }) {
  if (REVIEW.mode !== 'server') return false;
  const sent = await reviewFetchJson('decision', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, choice, note }) });
  return sent.ok && sent.body && sent.body.ok === true;
}

function reviewPaintCount() {
  const answered = REVIEW.decisions.filter((decision) => REVIEW.answers[reviewAnswerKey(decision.id)]?.choice).length;
  reviewFind('#answered-count').textContent = answered;
  reviewFind('#total-count').textContent = REVIEW.decisions.length;
  reviewFind('#done-panel').hidden = answered !== REVIEW.decisions.length;
}

function reviewPaintAnswer(article) {
  const answer = REVIEW.answers[reviewAnswerKey(article.dataset.decision)];
  const choice = answer?.choice ?? '';
  article.querySelectorAll('.option').forEach((option) => {
    const picked = choice === option.dataset.letter.toLowerCase();
    option.classList.toggle('picked', picked);
    const button = reviewFind('.pick', option);
    button.setAttribute('aria-pressed', String(picked));
    button.textContent = picked ? `Picked ${option.dataset.letter}` : `Pick ${option.dataset.letter}`;
  });
  article.querySelectorAll('.slide-dot').forEach((dot) => dot.classList.toggle('is-picked', choice === dot.dataset.go.toLowerCase()));
  reviewFind(`.deck-dot[data-id="${article.dataset.decision}"]`)?.classList.toggle('done', choice !== '');
  const note = reviewFind('.d-note textarea', article);
  if (answer && document.activeElement !== note) note.value = answer.note ?? '';
  reviewPaintCount();
}

function reviewSavedLine({ choice, note }) {
  if (choice) return `Saved: ${choice.toUpperCase()}.`;
  return note ? 'Saved your note. The decision stays open until you pick.' : 'Pick taken back.';
}

function reviewSettleSave(article, { key, before, sent, saved }) {
  const status = reviewFind('.d-saved', article);
  status.className = saved ? 'd-saved' : 'd-saved bad';
  status.textContent = saved ? reviewSavedLine(sent) : 'This did not save. Try again.';
  if (saved && !sent.choice && !sent.note) delete REVIEW.answers[key];
  if (!saved && before) REVIEW.answers[key] = before;
  if (!saved && !before) delete REVIEW.answers[key];
  reviewPaintAnswer(article);
}

async function reviewSave(article, choice) {
  const key = reviewAnswerKey(article.dataset.decision);
  const sent = { choice, note: reviewFind('.d-note textarea', article).value.trim() };
  const before = REVIEW.answers[key];
  if (!sent.choice && !sent.note && !before) return;
  REVIEW.answers[key] = sent;
  reviewPaintAnswer(article);
  const status = reviewFind('.d-saved', article);
  if (REVIEW.mode !== 'server') {
    status.className = 'd-saved bad';
    status.textContent = 'Not saved: this copy has no review server behind it.';
    return;
  }
  status.className = 'd-saved';
  status.textContent = 'Saving…';
  const saved = await reviewPostAnswer(article.dataset.decision, sent);
  reviewSettleSave(article, { key, before, sent, saved });
}

function reviewWireAnswers(article) {
  const current = () => REVIEW.answers[reviewAnswerKey(article.dataset.decision)]?.choice ?? '';
  article.querySelectorAll('.option').forEach((option) => {
    reviewFind('.pick', option).addEventListener('click', () => {
      const letter = option.dataset.letter.toLowerCase();
      reviewSave(article, current() === letter ? '' : letter);
    });
  });
  reviewFind('.d-note textarea', article).addEventListener('change', () => reviewSave(article, current()));
}

function reviewKeepServerAwake() {
  setInterval(() => {
    reviewFetchJson('health').then((health) => {
      if (!health.ok) console.warn('The review server stopped answering; picks will not save until it is back.');
    });
  }, 4 * 60 * 1000);
}

async function reviewConnectAnswers() {
  const health = await reviewFetchJson('health');
  if (health.body && health.body.signature === 'product-loop/review') {
    REVIEW.mode = 'server';
    Object.assign(REVIEW.answers, (await reviewFetchJson('decisions.json')).body ?? {});
    reviewKeepServerAwake();
    return;
  }
  const note = reviewFind('#save-note');
  note.hidden = false;
  note.textContent = REVIEW.config.publishedAt
    ? `Picks are not being saved here. Answer at ${REVIEW.config.publishedAt}.`
    : 'Picks are not being saved here: open this page through the review server.';
}
