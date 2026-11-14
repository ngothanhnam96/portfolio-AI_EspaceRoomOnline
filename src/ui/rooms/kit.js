// Shared building blocks for the illustrated rooms. Every room is one SVG in a
// 1600 x 900 box, written as a string; objects that hold a quest are wrapped in
// hot() so the page can make them glow, focus and show a tick once solved.

export const VIEW = { w: 1600, h: 900 };

export function esc(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const STAR = "M0 -13 L3 -3 L13 0 L3 3 L0 13 L-3 3 L-13 0 L-3 -3 Z";

/**
 * An object that holds a quest.
 * @param {string} id     quest id (matches content)
 * @param {string} label  spoken/tooltip name
 * @param {string} inner  the object's artwork
 * @param {[number, number]} at where the tick badge and the sparkle sit
 */
export function hot(id, label, inner, [bx, by]) {
  return `<g class="hot" data-quest="${esc(id)}" tabindex="0" role="button" aria-label="${esc(label)}">`
    + `<title>${esc(label)}</title>${inner}`
    + `<g class="spark" transform="translate(${bx} ${by})"><path d="${STAR}"/></g>`
    + `<g class="badge" transform="translate(${bx} ${by})"><circle r="21"/><path d="M-10 0 L-3 8 L11 -8"/></g>`
    + "</g>";
}

/** The exit. It holds no quest; it opens the word lock. */
export function door(label, inner, [bx, by]) {
  return `<g class="hot door" data-door="1" tabindex="0" role="button" aria-label="${esc(label)}">`
    + `<title>${esc(label)}</title>${inner}`
    + `<g class="spark" transform="translate(${bx} ${by})"><path d="${STAR}"/></g>`
    + "</g>";
}

/** Gradients and filters every room uses, prefixed so two SVGs never clash. */
export function baseDefs(p) {
  return `
  <filter id="${p}-shadow" x="-20%" y="-20%" width="140%" height="160%">
    <feDropShadow dx="0" dy="10" stdDeviation="9" flood-color="#000" flood-opacity="0.35"/>
  </filter>
  <filter id="${p}-soft" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="18"/>
  </filter>
  <filter id="${p}-blur2" x="-10%" y="-10%" width="120%" height="120%">
    <feGaussianBlur stdDeviation="2"/>
  </filter>
  <radialGradient id="${p}-vignette" cx="50%" cy="45%" r="75%">
    <stop offset="0.55" stop-color="#000" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity="0.55"/>
  </radialGradient>
  <linearGradient id="${p}-wood" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#7a4a2b"/><stop offset="1" stop-color="#4f2e1a"/>
  </linearGradient>
  <linearGradient id="${p}-woodlight" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#b07a4f"/><stop offset="1" stop-color="#875632"/>
  </linearGradient>
  <linearGradient id="${p}-brass" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#ffe29a"/><stop offset="0.5" stop-color="#c9973f"/><stop offset="1" stop-color="#7e5a1e"/>
  </linearGradient>
  <linearGradient id="${p}-paper" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fbf3dc"/><stop offset="1" stop-color="#e9dcb7"/>
  </linearGradient>`;
}

/** A warm pool of light, e.g. under a lamp. */
export function glow(p, x, y, r, color, opacity = 0.5) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${opacity}" filter="url(#${p}-soft)"/>`;
}

/** Floor tiles in simple perspective, receding to a vanishing point. */
export function perspectiveFloor({ top = 700, colors = ["#a5462f", "#8f3b27"], lines = "#5e2516", rows = 5, cols = 16 }) {
  const out = [];
  const vx = VIEW.w / 2;
  const depth = VIEW.h - top;
  for (let r = 0; r < rows; r += 1) {
    const y0 = top + depth * ((r / rows) ** 1.6);
    const y1 = top + depth * (((r + 1) / rows) ** 1.6);
    out.push(`<rect x="0" y="${y0.toFixed(1)}" width="${VIEW.w}" height="${(y1 - y0 + 0.5).toFixed(1)}" fill="${colors[r % 2]}"/>`);
  }
  for (let c = -cols; c <= cols * 2; c += 1) {
    const xb = (c / cols) * VIEW.w;
    const xt = vx + (xb - vx) * 0.55;
    out.push(`<line x1="${xt.toFixed(1)}" y1="${top}" x2="${xb.toFixed(1)}" y2="${VIEW.h}" stroke="${lines}" stroke-width="2" opacity="0.55"/>`);
  }
  for (let r = 1; r < rows; r += 1) {
    const y = top + depth * ((r / rows) ** 1.6);
    out.push(`<line x1="0" y1="${y.toFixed(1)}" x2="${VIEW.w}" y2="${y.toFixed(1)}" stroke="${lines}" stroke-width="2" opacity="0.55"/>`);
  }
  return out.join("");
}

/** A small scatter of stars for night skies, seeded so it never changes. */
export function stars(x, y, w, h, count, seed = 3) {
  let s = seed;
  const rand = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const out = [];
  for (let i = 0; i < count; i += 1) {
    const r = 0.8 + rand() * 1.8;
    out.push(`<circle class="twinkle" style="animation-delay:${(rand() * 4).toFixed(2)}s" cx="${(x + rand() * w).toFixed(1)}" cy="${(y + rand() * h).toFixed(1)}" r="${r.toFixed(1)}" fill="#fff"/>`);
  }
  return out.join("");
}

/** Books on a shelf: a row of spines between x0 and x1 standing on y. */
export function books(x0, x1, y, palette, seed = 5) {
  let s = seed;
  const rand = () => { s = (s * 48271) % 2147483647; return s / 2147483647; };
  const out = [];
  let x = x0;
  let i = 0;
  while (x < x1 - 12) {
    const w = 12 + rand() * 14;
    const h = 52 + rand() * 30;
    const tilt = rand() < 0.12 ? -8 : 0;
    const color = palette[i % palette.length];
    out.push(`<g transform="rotate(${tilt} ${(x + w / 2).toFixed(1)} ${y})"><rect x="${x.toFixed(1)}" y="${(y - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="${color}"/><rect x="${x.toFixed(1)}" y="${(y - h + 10).toFixed(1)}" width="${w.toFixed(1)}" height="4" fill="#fff" opacity="0.35"/></g>`);
    x += w + 2;
    i += 1;
  }
  return out.join("");
}

/** Wrap a room: defs, artwork, a vignette and the celebration layer. */
export function svgRoom(p, title, defs, body) {
  return `<svg class="room-svg" viewBox="0 0 ${VIEW.w} ${VIEW.h}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(title)}">`
    + `<defs>${baseDefs(p)}${defs}</defs>${body}`
    + `<rect class="vignette" width="${VIEW.w}" height="${VIEW.h}" fill="url(#${p}-vignette)" pointer-events="none"/>`
    + "</svg>";
}
