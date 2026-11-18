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
  var mapNav = document.getElementById('map-nav');
  var msNav = document.getElementById('ms');
  var viewNav = document.getElementById('views');
  var strip = document.getElementById('strip');
  var current = { id: null, view: 'decisions' };

  function milestone(id) {
    return MILESTONES.filter(function (m) { return m.id === id; })[0];
  }

  function fromHash() {
    var parts = decodeURIComponent(location.hash.slice(1)).split('/');
    if (parts[0] === 'map' && MAP.exists) return { id: null, view: 'map' };
    if (parts[0] === 'presentation' && PRESENTATION) return { id: null, view: 'presentation' };
    var found = milestone(parts[0]);
    if (!found) return null;
    return { id: found.id, view: parts[1] === 'final-look' ? 'final-look' : 'decisions' };
  }

  function firstOpen() {
    if (MAP.exists && MAP.status === 'proposed') return { id: null, view: 'map' };
    var unanswered = MILESTONES.filter(function (m) {
      return m.decisions && m.progress && m.progress.answered < m.progress.total;
    })[0];
    var pick = unanswered || MILESTONES[MILESTONES.length - 1];
    if (!pick) return MAP.exists ? { id: null, view: 'map' } : null;
    return { id: pick.id, view: pick.decisions ? 'decisions' : 'final-look' };
  }

  function mapFlag() {
    if (MAP.status === 'proposed') return ' <span class="flag">proposed</span>';
    if (MAP.problems) return ' <span class="flag">' + MAP.problems + ' to fix</span>';
    return '';
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

  function gapsOf(m) {
    return m.gaps || { unplayable: [], unshown: [], unguided: [] };
  }

  function decisionsFlag(m) {
    var count = gapsOf(m).unplayable.length;
    return count ? ' <span class="flag">' + count + ' not playable</span>' : '';
  }

  function lookFlag(m) {
    var state = m.look ? m.look.state : 'none';
    if (state === 'stale') return ' <span class="flag">stale</span>';
    if (state === 'unstamped') return ' <span class="flag">unstamped</span>';
    var count = gapsOf(m).unshown.length + gapsOf(m).unguided.length;
    return count ? ' <span class="flag">' + count + ' unmarked</span>' : '';
  }

  function stripLines(m) {
    var look = m.look || { state: 'none', drifted: [] };
    var gaps = gapsOf(m);
    var lines = [];
    if (look.state === 'stale') {
      lines.push('The final look of this milestone is behind its answers: <b>' + look.drifted.join(', ') +
        '</b> changed since it was built.');
    }
    if (look.state === 'unstamped') {
      lines.push('The final look of this milestone carries no stamp, so nothing can tell whether it matches the answers.');
    }
    if (gaps.unplayable.length) lines.push('Options with no playable prototype: <b>' + gaps.unplayable.join(', ') + '</b>.');
    if (gaps.unshown.length) lines.push('Answers the final look never marks: <b>' + gaps.unshown.join(', ') + '</b>.');
    if (gaps.unguided.length) lines.push('Exit check steps with no guide on the final look: <b>' + gaps.unguided.join(', ') + '</b>.');
    return lines;
  }

  function renderStrip(m) {
    var lines = stripLines(m);
    strip.hidden = !lines.length;
    if (lines.length) strip.innerHTML = lines.join('<br>') + ' Run <code>/next</code> to fix it.';
  }

  function show(next) {
    if (ROOT_VIEWS[next.view]) {
      current = next;
      location.hash = next.view;
      frame.src = ROOT_VIEWS[next.view];
      render();
      return;
    }
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
    var onMap = Boolean(ROOT_VIEWS[current.view]);
    mapNav.innerHTML = '';
    mapNav.appendChild(button('Map' + mapFlag(), current.view === 'map', function () {
      show({ id: null, view: 'map' });
    }, !MAP.exists));
    mapNav.appendChild(button('Presentation', current.view === 'presentation', function () {
      show({ id: null, view: 'presentation' });
    }, !PRESENTATION));

    msNav.innerHTML = '';
    MILESTONES.forEach(function (m) {
      msNav.appendChild(button(m.title + countLabel(m), !onMap && m.id === current.id, function () {
        show({ id: m.id, view: onMap ? 'decisions' : current.view });
      }));
    });

    viewNav.innerHTML = '';
    if (onMap) {
      strip.hidden = true;
      return;
    }
    var m = milestone(current.id);
    [['decisions', 'Decisions' + decisionsFlag(m), m.decisions], ['final-look', 'Final look' + lookFlag(m), m.finalLook]]
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
  else document.body.innerHTML = '<p style="padding:24px">No capability map and no milestone folders under docs/.</p>';
  `;
}

export function shellPage({ list, map, presentation }) {
  return `<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Product review</title>
<style>${styles()}</style>
<header>
  <nav id="map-nav"></nav>
  <span class="sep"></span>
  <nav id="ms"></nav>
  <span class="sep"></span>
  <nav id="views"></nav>
  <button id="stop" type="button">Stop server</button>
</header>
<div id="strip" hidden></div>
<iframe id="frame" title="Review page"></iframe>
<script>
  var MILESTONES = ${JSON.stringify(list)};
  var MAP = ${JSON.stringify(map)};
  var PRESENTATION = ${JSON.stringify(Boolean(presentation))};
  var ROOT_VIEWS = { map: 'map.html', presentation: 'presentation/deck.pdf' };
  ${script()}
</script>
`;
}
