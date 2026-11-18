import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { HTML_TYPE, send, sendJson, sendNotFound } from './http-reply.mjs';
import { mapState, mapSummary } from './map/map-state.mjs';
import { isMilestoneId, listMilestones } from './milestones.mjs';
import { recordDecision, sendAnswers, sendFile } from './milestone-routes.mjs';
import { shellPage } from './shell-page.mjs';

const MAP_PAGE = new URL('./map/map-page.html', import.meta.url);
const PRESENTATION = 'presentation';

function splitPath(pathname) {
  const parts = pathname.split('/').filter(Boolean).map(decodeURIComponent);
  if (parts.length < 2) return { milestone: null, name: parts[0] ?? '' };
  return { milestone: parts[0], name: parts.slice(1).join('/') };
}

function sendHealth({ res, context }) {
  return sendJson({
    res,
    status: 200,
    value: { signature: context.signature, docs: context.docs, port: context.port },
  });
}

async function routeRoot({ res, name, context }) {
  if (name === 'health') return sendHealth({ res, context });
  if (name === 'milestones.json') {
    return sendJson({ res, status: 200, value: await listMilestones(context.docs) });
  }
  if (name === 'map.json') return sendJson({ res, status: 200, value: await mapState(context.docs) });
  if (name === 'map.html') return send({ res, status: 200, body: await readFile(MAP_PAGE), type: HTML_TYPE });
  if (name === '') {
    const list = await listMilestones(context.docs);
    const map = mapSummary(await mapState(context.docs));
    const presentation = existsSync(join(context.docs, PRESENTATION, 'deck.pdf'));
    return send({ res, status: 200, body: shellPage({ list, map, presentation }), type: HTML_TYPE });
  }
  return sendNotFound(res);
}

export async function route({ req, res, url, context }) {
  const { milestone, name } = splitPath(url.pathname);

  if (req.method === 'POST' && name === 'stop') return context.stop(res);
  if (name === 'health') return sendHealth({ res, context });
  if (milestone === PRESENTATION) {
    return sendFile({ res, folder: join(context.docs, PRESENTATION), name });
  }
  if (!milestone || !isMilestoneId(milestone)) return routeRoot({ res, name, context });

  const folder = join(context.docs, milestone);
  if (req.method === 'POST' && name === 'decision') return recordDecision({ req, res, folder });
  if (name === 'decisions.json') return sendAnswers({ res, folder });
  return sendFile({ res, folder, name });
}
