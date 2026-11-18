const ICON_PATHS = {
  person: '<circle cx="24" cy="15" r="8"/><path d="M8 42c0-9 7-15 16-15s16 6 16 15"/>',
  ai: '<rect x="7" y="9" width="34" height="26" rx="8"/><path d="M17 35l-4 7 10-7"/><circle cx="18" cy="22" r="2.5" fill="currentColor"/><circle cx="30" cy="22" r="2.5" fill="currentColor"/>',
  agent: '<circle cx="24" cy="16" r="8"/><path d="M8 42c0-9 7-15 16-15s16 6 16 15"/><path d="M13 17c0-7 5-11 11-11s11 4 11 11"/><rect x="33" y="15" width="4" height="7" rx="2"/>',
  owner: '<circle cx="24" cy="17" r="8"/><path d="M8 42c0-9 7-15 16-15s16 6 16 15"/><path d="M15 8l4 4 5-6 5 6 4-4-2 7H17z"/>',
  team: '<circle cx="16" cy="17" r="6"/><circle cx="32" cy="17" r="6"/><path d="M4 40c0-7 5-12 12-12s12 5 12 12"/><path d="M24 40c0-7 4-12 8-12 7 0 12 5 12 12"/>',
  platform: '<rect x="6" y="8" width="36" height="12" rx="3"/><rect x="6" y="26" width="36" height="12" rx="3"/><circle cx="13" cy="14" r="1.8" fill="currentColor"/><circle cx="13" cy="32" r="1.8" fill="currentColor"/>',
  website: '<rect x="5" y="8" width="38" height="30" rx="4"/><path d="M5 16h38"/><circle cx="10" cy="12" r="1.3" fill="currentColor"/><circle cx="14" cy="12" r="1.3" fill="currentColor"/>',
  phone: '<rect x="14" y="5" width="20" height="38" rx="4"/><path d="M21 37h6"/>',
  money: '<rect x="5" y="12" width="38" height="24" rx="4"/><circle cx="24" cy="24" r="6"/>',
  document: '<path d="M13 5h15l9 9v29H13z"/><path d="M28 5v9h9M18 24h14M18 31h14"/>',
};

export const ICON_NAMES = Object.keys(ICON_PATHS);

export const counted = (count, noun) => `${count} ${noun}${count === 1 ? '' : 's'}`;

export const esc = (text) => String(text ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function icon(name, color, size = 48) {
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" style="color:${color}">${ICON_PATHS[name] ?? ICON_PATHS.person}</svg>`;
}

export function slide({ body, label = '', dark = false, number = null, cls = '', footer = '', name = '' }) {
  const foot = number ? `<footer><span>${esc(footer)}</span><span>${number}</span></footer>` : '';
  const eyebrow = label ? `<p class="eyebrow">${esc(label)}</p>` : '';
  const called = name || (number ? `slide ${number}` : 'title slide');
  return `<section class="page slide${dark ? ' dark' : ''} ${cls}" data-name="${esc(called)}">${eyebrow}${body}${foot}</section>`;
}
