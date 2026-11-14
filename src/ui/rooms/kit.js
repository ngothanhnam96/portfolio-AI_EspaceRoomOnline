// Shared building blocks for the illustrated rooms. A room is drawn in a
// 1600 x 900 box as SVG strings, split into depth layers that scene() stacks in
// real CSS 3D space (the 2.5D look). Objects that hold a quest are wrapped in
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
  <filter id="${p}-dof" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="3.2"/>
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

/** How far each layer sits from the wall, in scene pixels (negative is behind it). */
export const DEPTH = { far: -560, back: 0, mid: 90, front: 230 };
const PERSPECTIVE = 1500;

/** A layer at depth z, scaled so that at rest it lines up exactly with the wall. */
function layer(name, z, inner) {
  const scale = ((PERSPECTIVE - z) / PERSPECTIVE).toFixed(4);
  return `<div class="layer ${name}" data-z="${z}" style="transform: translateZ(${z}px) scale(${scale})">${inner}</div>`;
}

function sheet(body) {
  return `<svg class="layer-svg" viewBox="0 0 ${VIEW.w} ${VIEW.h}" preserveAspectRatio="none">${body}</svg>`;
}

/**
 * Stack a room in depth.
 * @param {string} p      id prefix for this room
 * @param {string} title  accessible name
 * @param {string} defs   extra gradients/filters
 * @param {object} parts
 *   hole  {x, y, w, h}  the window glass, cut out of the wall so the far view shows through
 *   far   the view outside the window (drawn larger than the hole: it slides as you look around)
 *   wall  wall and floor, masked by the hole
 *   back  everything on the wall plane (frames, shelves, the door frame…)
 *   mid   free-standing furniture in the room
 *   front props close to the camera, softly out of focus
 *   door  {x, y, w, h, motion: "swing"|"fold", hinge: "left"|"right", art} — the leaf, in its
 *         own little 3D plane so it can really turn on its hinge
 */
export function scene(p, title, defs, { hole, far, wall, back, mid = "", front = "", door }) {
  const mask = `<mask id="${p}-hole" maskUnits="userSpaceOnUse" x="-700" y="-600" width="${VIEW.w + 1400}" height="${VIEW.h + 1200}">`
    + `<rect x="-700" y="-600" width="${VIEW.w + 1400}" height="${VIEW.h + 1200}" fill="#fff"/><rect x="${hole.x}" y="${hole.y}" width="${hole.w}" height="${hole.h}" fill="#000"/></mask>`;
  const leaf = `<svg class="door3d ${door.motion} hinge-${door.hinge}" viewBox="${door.x} ${door.y} ${door.w} ${door.h}" `
    + `style="left:${door.x}px;top:${door.y}px;width:${door.w}px;height:${door.h}px">${door.art}</svg>`;
  return `<div class="scene3d" data-room="${esc(p)}" role="group" aria-label="${esc(title)}">`
    + layer("far", DEPTH.far, sheet(`<defs>${baseDefs(p)}${defs}${mask}</defs>${far}`))
    + layer("back", DEPTH.back, sheet(`<g mask="url(#${p}-hole)">${wall}</g>${back}`) + leaf)
    + layer("mid", DEPTH.mid, sheet(mid))
    + layer("front", DEPTH.front, sheet(`<g filter="url(#${p}-dof)">${front}</g>`))
    + `<svg class="layer-fx" viewBox="0 0 ${VIEW.w} ${VIEW.h}" preserveAspectRatio="none" aria-hidden="true"><rect class="vignette" width="${VIEW.w}" height="${VIEW.h}" fill="url(#${p}-vignette)"/></svg>`
    + "</div>";
}

/* ---------------------------------------------------- foreground props */

/** A leafy potted plant, drawn big for the near foreground. */
export function plant(x, y, s = 1, { pot = "#8a4b2a", leaf = "#2f6b3a", vein = "#4f9a58" } = {}) {
  const blades = [[-70, -260, -0.5], [-30, -330, -0.2], [10, -360, 0.05], [50, -320, 0.3], [90, -250, 0.55], [-100, -180, -0.8], [120, -170, 0.85]];
  return `<g transform="translate(${x} ${y}) scale(${s})">`
    + blades.map(([dx, h, r]) => `<path d="M0 -60 Q ${dx * 0.4} ${h * 0.5} ${dx} ${h} Q ${dx * 0.9 + 26 * Math.sign(r || 1)} ${h * 0.55} 0 -60 Z" fill="${leaf}"/>`
      + `<path d="M0 -60 Q ${dx * 0.45} ${h * 0.5} ${dx} ${h}" fill="none" stroke="${vein}" stroke-width="3"/>`).join("")
    + `<path d="M-70 -70 L70 -70 L56 40 L-56 40 Z" fill="${pot}"/><rect x="-78" y="-84" width="156" height="18" rx="6" fill="${pot}"/>`
    + "</g>";
}

/** A Vietnamese silk lantern hanging from the ceiling. */
export function lantern(x, y, s = 1, color = "#d9342b") {
  return `<g transform="translate(${x} ${y}) scale(${s})">`
    + `<line x1="0" y1="-${y / s}" x2="0" y2="-40" stroke="#3b2414" stroke-width="3"/>`
    + `<rect x="-22" y="-44" width="44" height="12" rx="3" fill="#c9973f"/>`
    + `<path d="M-22 -32 C -70 0 -70 70 -22 100 L22 100 C 70 70 70 0 22 -32 Z" fill="${color}"/>`
    + `<path d="M-8 -32 C -34 0 -34 70 -8 100 M8 -32 C 34 0 34 70 8 100" fill="none" stroke="#fff" stroke-width="2" opacity="0.25"/>`
    + `<rect x="-22" y="98" width="44" height="12" rx="3" fill="#c9973f"/>`
    + `<g stroke="#ffcf5a" stroke-width="2">${[-14, -6, 2, 10, 18].map((dx) => `<line x1="${dx - 2}" y1="110" x2="${dx - 2}" y2="150"/>`).join("")}</g>`
    + `<circle cx="0" cy="34" r="70" fill="#ffb347" opacity="0.18"/>`
    + "</g>";
}
