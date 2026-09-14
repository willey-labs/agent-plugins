import { readFileSync, writeFileSync, openSync, fstatSync, readSync, closeSync } from 'node:fs';

const WARN_AT = Number(process.env.CLAUDE_CONTEXT_WARN ?? 400_000);
const AGAIN_EVERY = Number(process.env.CLAUDE_CONTEXT_WARN_STEP ?? 100_000);
const TAIL_BYTES = 512 * 1024;

function stdin() {
  try {
    return JSON.parse(readFileSync(0, 'utf8'));
  } catch {
    return {};
  }
}

function tail(path) {
  const fd = openSync(path, 'r');
  try {
    const size = fstatSync(fd).size;
    const length = Math.min(size, TAIL_BYTES);
    const buffer = Buffer.alloc(length);
    readSync(fd, buffer, 0, length, size - length);
    return buffer.toString('utf8');
  } finally {
    closeSync(fd);
  }
}

function lastContextSize(path) {
  const lines = tail(path).split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    if (!lines[i].trim()) continue;
    let entry;
    try {
      entry = JSON.parse(lines[i]);
    } catch {
      continue;
    }
    const usage = entry?.message?.usage;
    if (!usage) continue;
    return (usage.input_tokens ?? 0) +
      (usage.cache_creation_input_tokens ?? 0) +
      (usage.cache_read_input_tokens ?? 0);
  }
  return 0;
}

function transcriptOf(input) {
  if (input.transcript_path) return input.transcript_path;
  if (!input.session_id) return null;
  const home = process.env.CLAUDE_CONFIG_DIR ?? `${process.env.HOME}/.claude`;
  const project = process.cwd().replace(/[/.]/g, '-');
  return `${home}/projects/${project}/${input.session_id}.jsonl`;
}

function band(tokens) {
  return Math.floor((tokens - WARN_AT) / AGAIN_EVERY);
}

try {
  const input = stdin();
  const path = transcriptOf(input);
  if (!path) process.exit(0);

  const tokens = lastContextSize(path);
  if (tokens < WARN_AT) process.exit(0);

  const marker = `/tmp/claude-context-warn-${input.session_id ?? 'x'}`;
  let seen = -1;
  try {
    seen = Number(readFileSync(marker, 'utf8'));
  } catch {
    seen = -1;
  }
  const now = band(tokens);
  if (now <= seen) process.exit(0);
  writeFileSync(marker, String(now));

  const k = Math.round(tokens / 1000);
  process.stdout.write(JSON.stringify({
    systemMessage: `This session is carrying ${k}k tokens of context. Consider /clear or a fresh session before the next big task.`,
  }));
} catch {
  process.exit(0);
}
