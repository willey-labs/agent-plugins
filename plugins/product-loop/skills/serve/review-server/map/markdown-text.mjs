/** Reads the pipe tables, sections and labelled lines product-loop keeps its Markdown files in. */

const HEADING = /^(#{1,6})\s+(.*?)\s*$/;

const isTableLine = (line) => line.trim().startsWith('|');
const isSeparator = (line) => line.includes('-') && /^\|?[\s:|-]+\|?$/.test(line.trim());

function cellsOf(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
}

function tableOf(block) {
  const columns = cellsOf(block[0]).map((cell) => cell.toLowerCase());
  const rows = block.slice(2).map((line) => Object.fromEntries(cellsOf(line).map((cell, i) => [columns[i], cell])));
  return { columns, rows };
}

export function tablesIn(lines) {
  const tables = [];
  let block = [];
  for (const line of [...lines, '']) {
    if (isTableLine(line)) {
      block.push(line);
      continue;
    }
    if (block.length >= 2 && isSeparator(block[1])) tables.push(tableOf(block));
    block = [];
  }
  return tables;
}

export function tableWith(lines, columns) {
  return tablesIn(lines).find((table) => columns.every((column) => table.columns.includes(column))) ?? null;
}

export function sectionLines(lines, title) {
  const start = lines.findIndex((line) => HEADING.exec(line)?.[2].toLowerCase() === title);
  if (start === -1) return [];
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => HEADING.test(line));
  return end === -1 ? rest : rest.slice(0, end);
}

export function labelled(lines, label) {
  const prefix = `${label}:`;
  const line = lines.find((candidate) => candidate.startsWith(prefix));
  return line ? line.slice(prefix.length).trim() : null;
}
