/** Everything served from inside one milestone folder: its pages, its answers, its picks. */

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { answersIn, withAnswer } from './decisions-markdown.mjs';
import { readBody, send, sendJson, sendNotFound, typeOf } from './http-reply.mjs';

export async function recordDecision({ req, res, folder }) {
  const markdown = join(folder, 'decisions.md');
  if (!existsSync(markdown)) {
    return sendJson({ res, status: 404, value: { error: 'no decisions.md in that milestone' } });
  }

  const body = await readBody(req);
  if (body === null) return sendJson({ res, status: 400, value: { error: 'body is not JSON' } });
  if (!body.id) return sendJson({ res, status: 400, value: { error: 'id is required' } });

  const written = withAnswer({
    text: await readFile(markdown, 'utf8'),
    id: body.id,
    choice: body.choice,
    note: body.note,
  });
  if (!written.touchedDecision) {
    return sendJson({ res, status: 404, value: { error: `no section for ${body.id}` } });
  }

  await writeFile(markdown, written.text);
  console.log(`${body.id} → ${body.choice ? body.choice.toUpperCase() : '—'} in ${markdown}`);
  return sendJson({ res, status: 200, value: { ok: true } });
}

export async function sendAnswers({ res, folder }) {
  const markdown = join(folder, 'decisions.md');
  if (!existsSync(markdown)) return sendJson({ res, status: 404, value: {} });
  return sendJson({ res, status: 200, value: answersIn(await readFile(markdown, 'utf8')) });
}

export async function sendFile({ res, docs, folder, name }) {
  const file = join(folder, name);
  if (!file.startsWith(docs) || !existsSync(file)) return sendNotFound(res);
  return send({ res, status: 200, body: await readFile(file), type: typeOf(file) });
}
