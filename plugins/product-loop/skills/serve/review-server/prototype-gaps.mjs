/** Finds what a milestone's review pages leave unplayable: options without a prototype, and answers or exit steps the final look never marks. */

import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { answersIn } from './decisions-markdown.mjs';
import { sectionLines } from './map/markdown-text.mjs';

const DECISION_HEADING = /^###\s+(D-\d+)\b/;
const OPTION = /^\s*[-*]\s+\*\*([A-Z])\*\*/;
const NUMBERED_STEP = /^\d+\.\s+/;

export const NO_GAPS = { unplayable: [], unshown: [], unguided: [] };

async function textOf(file) {
  return existsSync(file) ? readFile(file, 'utf8') : null;
}

function marksIn(html, attribute) {
  const pattern = new RegExp(`data-${attribute}=["']([^"']+)["']`, 'g');
  return [...html.matchAll(pattern)].map((match) => match[1].trim().replace(/\s+/g, ' '));
}

export function optionsIn(markdown) {
  const options = [];
  let id = null;
  for (const line of markdown.split('\n')) {
    const heading = DECISION_HEADING.exec(line);
    if (heading) id = heading[1];
    else if (line.startsWith('#')) id = null;
    const option = id ? OPTION.exec(line) : null;
    if (option) options.push(`${id} ${option[1]}`);
  }
  return options;
}

function unplayable({ markdown, html }) {
  const marked = new Set(marksIn(html, 'prototype'));
  return optionsIn(markdown).filter((option) => !marked.has(option));
}

function unshown({ markdown, html }) {
  const marked = new Set(marksIn(html, 'shows').flatMap((value) => value.split(/[\s,]+/)));
  const answered = Object.keys(answersIn(markdown)).map((key) => key.toUpperCase().replace(/^D(\d+)$/, 'D-$1'));
  return answered.filter((id) => !marked.has(id));
}

function unguided({ milestonePage, html }) {
  const marked = new Set(marksIn(html, 'exit-step'));
  const steps = sectionLines(milestonePage.split('\n'), 'exit check').filter((line) => NUMBERED_STEP.test(line.trim()));
  return steps.map((_, index) => String(index + 1)).filter((step) => !marked.has(step));
}

export async function prototypeGaps(folder) {
  const [markdown, decisionsHtml, lookHtml, milestonePage] = await Promise.all(
    ['decisions.md', 'decisions.html', 'final-look.html', '_milestone.md'].map((name) => textOf(join(folder, name))),
  );
  return {
    unplayable: markdown && decisionsHtml ? unplayable({ markdown, html: decisionsHtml }) : [],
    unshown: markdown && lookHtml ? unshown({ markdown, html: lookHtml }) : [],
    unguided: milestonePage && lookHtml ? unguided({ milestonePage, html: lookHtml }) : [],
  };
}
