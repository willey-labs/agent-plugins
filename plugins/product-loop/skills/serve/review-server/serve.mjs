/** Serves every milestone review page in docs/ on one port. */

import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { send, sendJson } from './http-reply.mjs';
import { route } from './router.mjs';

const docs = resolve(process.argv[2] ?? 'docs');
const port = Number(process.argv[3] ?? 4399);

/** /serve probes this to tell our server from anything else holding the port. */
const SIGNATURE = 'product-loop/review';

/** Every open page pings, so this only runs down once nobody is looking. */
const IDLE_EXIT_MS = 15 * 60 * 1000;
const IDLE_CHECK_MS = 60_000;

let lastSeen = Date.now();

function closeDown(reason) {
  console.log(reason);
  server.close();
  setTimeout(() => process.exit(0), 100);
}

function stopFromPage(res) {
  sendJson({ res, status: 200, value: { ok: true } });
  closeDown('Stopped from the page.');
}

const context = { docs, port, signature: SIGNATURE, stop: stopFromPage };

const server = createServer(async (req, res) => {
  lastSeen = Date.now();
  const url = new URL(req.url, 'http://localhost');
  try {
    await route({ req, res, url, context });
  } catch (failure) {
    console.error(`${url.pathname} failed:`, failure.message);
    if (!res.headersSent) send({ res, status: 500, body: '{"error":"server failed"}' });
  }
});

if (!existsSync(docs)) {
  console.error(`No folder at ${docs}`);
  process.exit(1);
}

server.listen(port, () => {
  console.log(`Product review: http://localhost:${port}`);
  console.log(`Every milestone under ${docs}, picked from the tabs at the top.`);
  console.log("Answers are written into each milestone's decisions.md.");
  console.log('Stops from the button on the page, with ctrl-c, or after 15 idle minutes.');
});

setInterval(() => {
  if (Date.now() - lastSeen < IDLE_EXIT_MS) return;
  closeDown('Nobody here for 15 minutes. Stopping.');
}, IDLE_CHECK_MS);
