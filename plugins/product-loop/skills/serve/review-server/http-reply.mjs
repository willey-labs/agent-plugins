/** Writes HTTP replies and reads request bodies. */

import { extname } from 'node:path';

export const JSON_TYPE = 'application/json; charset=utf-8';
export const HTML_TYPE = 'text/html; charset=utf-8';
export const TEXT_TYPE = 'text/plain; charset=utf-8';

const TYPES = {
  '.html': HTML_TYPE,
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': JSON_TYPE,
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

export function typeOf(file) {
  return TYPES[extname(file)] ?? 'application/octet-stream';
}

export function send({ res, status, body, type = JSON_TYPE }) {
  res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store' });
  res.end(body);
}

export function sendJson({ res, status, value }) {
  return send({ res, status, body: JSON.stringify(value) });
}

export function sendNotFound(res) {
  return send({ res, status: 404, body: 'Not found', type: TEXT_TYPE });
}

export async function readBody(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  try {
    return JSON.parse(raw);
  } catch (failure) {
    console.error('Body is not JSON:', failure.message);
    return null;
  }
}
