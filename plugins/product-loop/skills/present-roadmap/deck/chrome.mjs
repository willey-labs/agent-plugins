import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { delimiter, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const NAMES = ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'chrome'];
const APP_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
];

export function findChrome() {
  if (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const dirs = (process.env.PATH ?? '').split(delimiter).filter(Boolean);
  const onPath = NAMES.flatMap((name) => dirs.map((dir) => join(dir, name))).find((file) => existsSync(file));
  return onPath ?? APP_PATHS.find((file) => existsSync(file)) ?? null;
}

function run(chrome, args) {
  const sandbox = process.getuid?.() === 0 ? ['--no-sandbox'] : [];
  const result = spawnSync(chrome, ['--headless=new', '--disable-gpu', ...sandbox, ...args], {
    encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, timeout: 120_000,
  });
  if (result.status !== 0) throw new Error(`Chrome failed: ${(result.stderr ?? '').trim().split('\n').pop()}`);
  return result.stdout;
}

export function printPdf({ chrome, html, pdf }) {
  run(chrome, ['--no-pdf-header-footer', '--print-to-pdf-no-header', `--print-to-pdf=${pdf}`, pathToFileURL(html).href]);
}

export function layoutProblems({ chrome, html }) {
  const dom = run(chrome, ['--window-size=1280,720', '--virtual-time-budget=5000', '--dump-dom', pathToFileURL(html).href]);
  const found = dom.match(/data-overflow="([^"]*)"/);
  if (!found) return ['The layout check did not run, so no slide was checked for overflow.'];
  const named = (name) => name.charAt(0).toUpperCase() + name.slice(1);
  return found[1] ? found[1].split('|').map((name) => `${named(name)} runs past its edge; shorten its words.`) : [];
}
