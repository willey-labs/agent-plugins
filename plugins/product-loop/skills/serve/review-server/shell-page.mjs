/** The frame at / that holds the milestone tabs and shows one review page at a time. */

function styles() {
  return `
  :root { color-scheme: light dark; --line: #d9dedb; --ink: #12100e; --dim: #6b7280; --sel: #12100e;
    --warn: #9a5b00; --warn-bg: #fff4e5; --warn-line: #ffd9b8; }
  @media (prefers-color-scheme: dark) {
    :root { --line: #2b2f2d; --ink: #f2f4f3; --dim: #9aa3a0; --sel: #f2f4f3;
      --warn: #ffc98a; --warn-bg: #2e2415; --warn-line: #4a3a1f; }
  }
  * { box-sizing: border-box; }
  body { margin: 0; height: 100vh; display: flex; flex-direction: column;
    font: 14px/1.45 ui-sans-serif, system-ui, sans-serif; color: var(--ink); }
  header { border-bottom: 1px solid var(--line); padding: 10px 16px; display: flex;
    flex-wrap: wrap; gap: 10px 18px; align-items: center; }
  nav { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
  .sep { width: 1px; align-self: stretch; background: var(--line); }
  button { font: inherit; color: var(--dim); background: none; border: 1px solid transparent;
    border-radius: 7px; padding: 5px 10px; cursor: pointer; }
  button:hover:not(:disabled) { border-color: var(--line); }
  button[aria-pressed="true"] { color: var(--sel); border-color: var(--line); font-weight: 600; }
  button:disabled { opacity: .35; cursor: default; }
  .count { font-variant-numeric: tabular-nums; font-size: 12px; color: var(--dim); }
  .flag { font-size: 11px; padding: 1px 5px; border-radius: 4px; margin-left: 5px;
    background: var(--warn-bg); color: var(--warn); border: 1px solid var(--warn-line); }
  #stop { margin-left: auto; }
  #strip { padding: 8px 16px; font-size: 12.5px; background: var(--warn-bg); color: var(--warn);
    border-bottom: 1px solid var(--warn-line); }
  #strip code { font-family: ui-monospace, monospace; font-size: 12px; }
  iframe { flex: 1; width: 100%; border: 0; }
  @media (max-width: 560px) { .sep { display: none; } #stop { margin-left: 0; } }
  `;
}

function script() {
  return `
  var frame = document.getElementById('frame');
  var msNav = document.getElementById('ms');
  var viewNav = document.getElementById('views');
  var strip = document.getElementById('strip');
  var current = { id: null, view: 'decisions' };

  function milestone(id) {
    return MILESTONES.filter(function (m) { return m.id === id; })[0];
  }

  function fromHash() {
    var parts = decodeURIComponent(location.hash.slice(1)).split('/');
    var found = milestone(parts[0]);
    if (!found) return null;
    return { id: found.id, view: parts[1] === 'final-look' ? 'final-look' : 'decisions' };
  }

  function firstOpen() {
    var unanswered = MILESTONES.filter(function (m) {
      return m.decisions && m.progress && m.progress.answered < m.progress.total;
    })[0];
    var pick = unanswered || MILESTONES[MILESTONES.length - 1];
    if (!pick) return null;
    return { id: pick.id, view: pick.decisions ? 'decisions' : 'final-look' };
  }

  function button(label, pressed, onPick, disabled) {
    var el = document.createElement('button');
    el.type = 'button';
    el.innerHTML = label;
    el.setAttribute('aria-pressed', String(pressed));
    el.disabled = Boolean(disabled);
    el.addEventListener('click', onPick);
    return el;
  }

  function countLabel(m) {
    if (!m.progress || !m.progress.total) return '';
    return ' <span class="count">' + m.progress.answered + '/' + m.progress.total + '</span>';
  }

  function lookFlag(m) {
    var state = m.look ? m.look.state : 'none';
    if (state === 'stale') return ' <span class="flag">stale</span>';
    if (state === 'unstamped') return ' <span class="flag">unstamped</span>';
    return '';
  }

  function renderStrip(m) {
    var look = m.look || { state: 'none', drifted: [] };
    if (look.state === 'stale') {
      strip.innerHTML = 'The drawing of this milestone is behind its answers: <b>' +
        look.drifted.join(', ') + '</b> changed since it was drawn. Run <code>/next</code> to redraw it.';
      strip.hidden = false;
      return;
    }
    if (look.state === 'unstamped') {
      strip.innerHTML = 'The drawing of this milestone carries no stamp, so nothing can tell whether ' +
        'it matches the answers. Run <code>/next</code> to redraw it.';
      strip.hidden = false;
      return;
    }
    strip.hidden = true;
  }

  function show(next) {
    var m = milestone(next.id);
    if (!m) return;
    if (next.view === 'final-look' && !m.finalLook) next.view = 'decisions';
    if (next.view === 'decisions' && !m.decisions) next.view = 'final-look';
    current = next;
    location.hash = next.id + '/' + next.view;
    frame.src = next.id + '/' + next.view + '.html';
    render();
  }

  function render() {
    msNav.innerHTML = '';
    MILESTONES.forEach(function (m) {
      msNav.appendChild(button(m.title + countLabel(m), m.id === current.id, function () {
        show({ id: m.id, view: current.view });
      }));
    });

    var m = milestone(current.id);
    viewNav.innerHTML = '';
    [['decisions', 'Decisions', m.decisions], ['final-look', 'Final look' + lookFlag(m), m.finalLook]]
      .forEach(function (row) {
        viewNav.appendChild(button(row[1], current.view === row[0], function () {
          show({ id: current.id, view: row[0] });
        }, !row[2]));
      });

    renderStrip(m);
  }

  document.getElementById('stop').addEventListener('click', function (event) {
    var btn = event.target;
    btn.disabled = true;
    fetch('stop', { method: 'POST' })
      .catch(function (failure) {
        console.warn('The server closed before replying, which is the usual case.', failure.message);
      })
      .then(function () { btn.textContent = 'Server stopped'; });
  });

  window.addEventListener('hashchange', function () {
    var next = fromHash();
    if (next && (next.id !== current.id || next.view !== current.view)) show(next);
  });

  setInterval(function () { fetch('health', { cache: 'no-store' }); }, 240000);

  var start = fromHash() || firstOpen();
  if (start) show(start);
  else document.body.innerHTML = '<p style="padding:24px">No milestone folders under docs/.</p>';
  `;
}

export function shellPage(list) {
  return `<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Product review</title>
<style>${styles()}</style>
<header>
  <nav id="ms"></nav>
  <span class="sep"></span>
  <nav id="views"></nav>
  <button id="stop" type="button">Stop server</button>
</header>
<div id="strip" hidden></div>
<iframe id="frame" title="Review page"></iframe>
<script>
  var MILESTONES = ${JSON.stringify(list)};
  ${script()}
</script>
`;
}
