/** Reads and rewrites the answers held in a milestone's decisions.md. */

export function answersIn(text) {
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

export function progressOf(text) {
  const lines = text.split('\n').filter((line) => line.startsWith('Decision:'));
  const open = lines.filter((line) => /^Decision:\s*[—-]?\s*$/.test(line)).length;
  return { answered: lines.length - open, total: lines.length };
}

/** Rewrites the decision's own line and its row in the summary table; both hold the same letter. */
export function withAnswer({ text, id, choice, note }) {
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
