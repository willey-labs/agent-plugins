/** Sends each request to the milestone it names, or to the frame and health checks at the root. */

import { join } from 'node:path';

import { HTML_TYPE, send, sendJson, sendNotFound } from './http-reply.mjs';
import { isMilestoneId, listMilestones } from './milestones.mjs';
import { recordDecision, sendAnswers, sendFile } from './milestone-routes.mjs';
import { shellPage } from './shell-page.mjs';

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
  if (name === '') {
    const list = await listMilestones(context.docs);
    return send({ res, status: 200, body: shellPage(list), type: HTML_TYPE });
  }
  return sendNotFound(res);
}

export async function route({ req, res, url, context }) {
  const { milestone, name } = splitPath(url.pathname);

  if (req.method === 'POST' && name === 'stop') return context.stop(res);
  if (name === 'health') return sendHealth({ res, context });
  if (!milestone || !isMilestoneId(milestone)) return routeRoot({ res, name, context });

  const folder = join(context.docs, milestone);
  if (req.method === 'POST' && name === 'decision') return recordDecision({ req, res, folder });
  if (name === 'decisions.json') return sendAnswers({ res, folder });
  return sendFile({ res, docs: context.docs, folder, name });
}
