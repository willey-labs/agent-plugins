/* Review frame, part 2 of 7: what a decision's play can do inside one option's prototype. */
function reviewPinToNewest(list) {
  const stick = () => { if (!list.dataset.readingBack) list.scrollTop = list.scrollHeight; };
  new ResizeObserver(stick).observe(list);
  new MutationObserver(stick).observe(list, { childList: true, subtree: true });
  list.addEventListener('scroll', () => {
    if (list.scrollHeight - list.scrollTop - list.clientHeight > 4) list.dataset.readingBack = 'yes';
    else delete list.dataset.readingBack;
  }, { passive: true });
  requestAnimationFrame(stick);
}

function reviewWriteInto(target, html) {
  if (target.setText) { target.setText(html); return; }
  target.innerHTML = html;
  target.dispatchEvent(new Event('input', { bubbles: true }));
}

async function reviewTypeLine(ctx, typing) {
  const { target, field, before, line, perWord } = typing;
  let text = '';
  for (const word of line.split(' ')) {
    text += (text ? ' ' : '') + word;
    reviewWriteInto(target, `${before}<p>${reviewEsc(text)}</p>`);
    field.scrollTop = field.scrollHeight;
    await ctx.wait(perWord);
  }
  return `${before}<p>${reviewEsc(line)}</p>`;
}

async function reviewType(ctx, target, { lines, perWord }) {
  const field = target.field ?? target;
  await ctx.click(field);
  field.focus({ preventScroll: true });
  let html = field.textContent.trim() === '' ? '' : field.innerHTML;
  for (const line of lines) {
    if (line === '') { html += '<p><br></p>'; reviewWriteInto(target, html); continue; }
    html = await reviewTypeLine(ctx, { target, field, before: html, line, perWord });
  }
  field.blur();
}

async function reviewPoint(ctx, proto, target) {
  if (!target) return;
  const box = proto.getBoundingClientRect();
  const spot = target.getBoundingClientRect();
  const hand = proto.querySelector(':scope > .pointer');
  hand.classList.add('on');
  hand.style.transform = `translate(${spot.left - box.left + Math.min(spot.width / 2, 40)}px, ${spot.top - box.top + spot.height / 2}px)`;
  await ctx.wait(680);
}

async function reviewClick(ctx, proto, target) {
  if (!target) return;
  await ctx.point(target);
  const hand = proto.querySelector(':scope > .pointer');
  hand.classList.remove('tap');
  void hand.offsetWidth;
  hand.classList.add('tap');
  target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  await ctx.wait(320);
}

function reviewContext(decision, option, runId) {
  const proto = option.proto;
  const alive = () => decision.runId === runId;
  const ctx = {
    el: proto, letter: option.letter, state: decision.state, device: REVIEW.device, data: {},
    $: (selector) => proto.querySelector(selector),
    async wait(ms) {
      if (!alive()) throw new ReviewCancelled();
      if (!REVIEW_REDUCED_MOTION) await new Promise((resolve) => setTimeout(resolve, ms));
      if (!alive()) throw new ReviewCancelled();
    },
  };
  ctx.point = (target) => reviewPoint(ctx, proto, target);
  ctx.click = (target) => reviewClick(ctx, proto, target);
  ctx.type = (target, lines, { perWord = 45 } = {}) => reviewType(ctx, target, { lines, perWord });
  return ctx;
}
