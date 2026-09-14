import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const folder = resolve(process.argv[2] ?? '.');
const port = Number(process.argv[3] ?? 4321);
const markdown = join(folder, 'decisions.md');
const page = join(folder, 'decisions.html');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

const JSON_TYPE = 'application/json; charset=utf-8';

/** The open page pings while it lives, so this only fires once nobody is looking at it. */
const IDLE_EXIT_MS = 15 * 60 * 1000;
let lastSeen = Date.now();

function answersIn(text) {
  const answers = {};
  let id = null;
  for (const line of text.split('\n')) {
    const heading = line.match(/^###\s+(D-\d+)\s/);
    if (heading) id = heading[1];
    const decision = line.match(/^Decision:\s*(.*)$/);
    if (decision && id) {
      const value = decision[1].trim();
      if (value && value !== '—' && value !== '-') {
        const [, letter, note] = value.match(/^([A-Za-z])\s*(?:—\s*)?(.*)$/) ?? [];
        answers[id.toLowerCase().replace('-', '')] = {
          choice: (letter ?? '').toLowerCase(),
          note: (note ?? '').trim(),
        };
      }
      id = null;
    }
  }
  return answers;
}

/** Rewrites the decision's own line and its row in the summary table; both hold the same letter. */
function withAnswer({ text, id, choice, note }) {
  const upper = id.toUpperCase().replace(/^D(\d+)$/, 'D-$1');
  const letter = choice ? choice.toUpperCase() : '';
  const written = letter ? (note ? `${letter} — ${note}` : letter) : '—';

  const lines = text.split('\n');
  let inSection = false;
  let touchedDecision = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('### ')) inSection = lines[i].startsWith(`### ${upper} `);
    if (inSection && /^Decision:/.test(lines[i])) {
      lines[i] = `Decision: ${written}`;
      touchedDecision = true;
      inSection = false;
    }
    if (lines[i].startsWith(`| ${upper} |`)) {
      const cells = lines[i].split('|');
      cells[cells.length - 2] = ` ${written} `;
      lines[i] = cells.join('|');
    }
  }

  return { text: lines.join('\n'), touchedDecision };
}

function send({ res, status, body, type = JSON_TYPE }) {
  res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store' });
  res.end(body);
}

async function readBody(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function recordDecision({ req, res }) {
  const body = await readBody(req);
  if (body === null) return send({ res, status: 400, body: '{"error":"body is not JSON"}' });
  if (!body.id) return send({ res, status: 400, body: '{"error":"id is required"}' });

  const text = await readFile(markdown, 'utf8');
  const written = withAnswer({ text, id: body.id, choice: body.choice, note: body.note });
  if (!written.touchedDecision) {
    return send({ res, status: 404, body: JSON.stringify({ error: `no section for ${body.id}` }) });
  }

  await writeFile(markdown, written.text);
  console.log(`${body.id} → ${body.choice ? body.choice.toUpperCase() : '—'}`);
  return send({ res, status: 200, body: '{"ok":true}' });
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  lastSeen = Date.now();

  if (req.method === 'POST' && url.pathname === '/decision') return recordDecision({ req, res });

  if (req.method === 'POST' && url.pathname === '/stop') {
    send({ res, status: 200, body: '{"ok":true}' });
    console.log('Stopped from the page.');
    server.close();
    setTimeout(() => process.exit(0), 100);
    return undefined;
  }

  if (url.pathname === '/decisions.json') {
    const text = await readFile(markdown, 'utf8');
    return send({ res, status: 200, body: JSON.stringify(answersIn(text)) });
  }

  const file = url.pathname === '/' ? page : join(folder, url.pathname.slice(1));
  if (!file.startsWith(folder) || !existsSync(file)) {
    return send({ res, status: 404, body: 'Not found', type: 'text/plain' });
  }

  const body = await readFile(file);
  return send({ res, status: 200, body, type: TYPES[extname(file)] ?? 'application/octet-stream' });
});

if (!existsSync(markdown) || !existsSync(page)) {
  console.error(`Need decisions.md and decisions.html in ${folder}`);
  process.exit(1);
}

server.listen(port, () => {
  console.log(`Decision review: http://localhost:${port}`);
  console.log(`Answers are written into ${markdown}`);
  console.log('Stops from the button on the page, with ctrl-c, or after 15 idle minutes.');
});

setInterval(() => {
  if (Date.now() - lastSeen < IDLE_EXIT_MS) return;
  console.log('Nobody here for 15 minutes. Stopping.');
  server.close();
  process.exit(0);
}, 60_000);
