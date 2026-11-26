/* Review frame, part 3 of 7: each decision drawn, reset and played across its options. */
function reviewHasNoPhone(decision) {
  return REVIEW.device === 'mobile' && decision.def.mobile === false;
}

function reviewRenderOption(decision, option) {
  const fresh = option.proto.cloneNode(false);
  option.proto.replaceWith(fresh);
  option.proto = fresh;
  option.outcome.textContent = '';
  option.ctx = reviewContext(decision, option, decision.runId);
  if (reviewHasNoPhone(decision)) { fresh.innerHTML = REVIEW_NO_PHONE; return; }
  decision.def.render(option.ctx);
  fresh.insertAdjacentHTML('beforeend', `<div class="pointer">${REVIEW_POINTER_SVG}</div>`);
  fresh.querySelectorAll('[data-scroll="newest"]').forEach(reviewPinToNewest);
}

function reviewRender(decision) {
  decision.runId += 1;
  decision.article.classList.remove('playing');
  decision.options.forEach((option) => reviewRenderOption(decision, option));
}

async function reviewPlayOption(decision, option, runId) {
  try {
    const line = await decision.def.play(option.ctx);
    if (decision.runId === runId) option.outcome.textContent = line;
  } catch (error) {
    if (!(error instanceof ReviewCancelled)) throw error;
  }
}

async function reviewPlay(decision) {
  reviewRender(decision);
  if (reviewHasNoPhone(decision)) return;
  const runId = decision.runId;
  decision.article.classList.add('playing');
  await Promise.all(decision.options.map((option) => reviewPlayOption(decision, option, runId)));
  if (decision.runId === runId) decision.article.classList.remove('playing');
}

function reviewStateButtons(decision) {
  const states = reviewFind('.states', decision.article);
  decision.def.states.forEach((state) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = state.label;
    button.setAttribute('aria-pressed', String(state.key === decision.state));
    button.addEventListener('click', () => {
      decision.state = state.key;
      states.querySelectorAll('button').forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
      reviewRender(decision);
    });
    states.append(button);
  });
}

function reviewFeatureSettled(article) {
  for (let node = article.previousElementSibling; node; node = node.previousElementSibling) {
    if (node.matches('.feature-settled')) return node;
    if (node.matches('.feature-title')) return null;
  }
  return null;
}

function reviewCarrySettled(article) {
  const settled = reviewFeatureSettled(article);
  if (!settled || settled.children.length === 0) return;
  const list = settled.cloneNode(true);
  list.removeAttribute('class');
  const box = document.createElement('div');
  box.className = 'd-settled';
  box.innerHTML = '<span class="label">Settled, not asked</span>';
  box.append(list);
  reviewFind('.d-head', article).append(box);
}

function reviewSetUp(article) {
  reviewCarrySettled(article);
  const def = REVIEW.defs[article.dataset.decision];
  const options = [...article.querySelectorAll('.option')].map((element) => ({
    letter: element.dataset.letter, element, proto: reviewFind('.proto', element), outcome: reviewFind('.outcome', element),
  }));
  const decision = { id: article.dataset.decision, def, article, options, state: def.states[0].key, runId: 0, played: false };
  reviewStateButtons(decision);
  reviewFind('.k-btn.play', article).addEventListener('click', () => { decision.played = true; reviewPlay(decision); });
  reviewFind('.k-btn.reset', article).addEventListener('click', () => reviewRender(decision));
  reviewRender(decision);
  return decision;
}
