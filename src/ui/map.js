// A stylised map of Việt Nam for the home screen: the mainland outline, the
// Hoàng Sa and Trường Sa archipelagos and Phú Quốc, with a pin per city.
// Coordinates are real longitude/latitude, projected onto a flat box.

import { esc } from "./rooms/kit.js";

export const BOUNDS = { west: 101.6, east: 117.2, north: 23.9, south: 7.4 };
const K = 34;
export const MAP_VIEW = {
  w: Math.round((BOUNDS.east - BOUNDS.west) * K),
  h: Math.round((BOUNDS.north - BOUNDS.south) * K),
};

export function project(lon, lat) {
  return { x: (lon - BOUNDS.west) * K, y: (BOUNDS.north - lat) * K };
}

/** Simplified mainland outline (lon, lat), clockwise from the north-west corner. */
export const MAINLAND = [
  [102.15, 22.4], [102.6, 22.75], [103.2, 22.65], [103.6, 22.8], [104.05, 22.75], [104.8, 23.15], [105.35, 23.35],
  [105.85, 22.95], [106.25, 22.95], [106.7, 22.85], [106.75, 22.45], [107.35, 21.85], [107.95, 21.55],
  [107.35, 21.05], [106.75, 20.75], [106.55, 20.3], [106.15, 20.0], [105.95, 19.6], [105.75, 19.05],
  [105.95, 18.55], [106.4, 18.05], [106.65, 17.45], [107.1, 16.95], [107.75, 16.4], [108.32, 16.1],
  [108.5, 15.65], [108.85, 15.25], [109.05, 14.6], [109.25, 13.8], [109.45, 12.9], [109.2, 12.2],
  [109.15, 11.65], [108.75, 11.15], [108.1, 10.85], [107.45, 10.5], [107.05, 10.35], [106.75, 10.05],
  [106.55, 9.65], [106.2, 9.35], [105.75, 8.95], [105.2, 8.6], [104.8, 8.65], [104.85, 9.25],
  [105.05, 9.7], [104.6, 10.1], [104.45, 10.4], [104.95, 10.75], [105.35, 10.9], [105.85, 11.0],
  [106.15, 11.35], [106.45, 11.7], [107.05, 11.9], [107.55, 12.3], [107.55, 13.0], [107.45, 13.6],
  [107.55, 14.4], [107.35, 15.0], [107.55, 15.5], [107.25, 15.85], [106.9, 16.2], [106.6, 16.55],
  [106.4, 17.05], [106.0, 17.45], [105.6, 18.05], [105.15, 18.45], [104.7, 18.85], [104.05, 19.2],
  [104.25, 19.65], [104.65, 20.1], [104.4, 20.4], [103.75, 20.7], [103.2, 20.85], [102.85, 21.4],
  [102.65, 21.75], [102.15, 22.4],
];

export const ISLANDS = [
  { name: "QĐ. Hoàng Sa", lon: 111.9, lat: 16.5, dots: [[0, 0], [0.4, 0.25], [-0.3, 0.3], [0.2, -0.35], [0.7, -0.1], [-0.5, -0.2]] },
  { name: "QĐ. Trường Sa", lon: 114.2, lat: 9.6, dots: [[0, 0], [0.6, 0.5], [-0.7, 0.4], [1.1, -0.3], [-0.2, -0.8], [0.4, 1.1], [-1.1, -0.6], [1.5, 0.6]] },
  { name: "Phú Quốc", lon: 103.97, lat: 10.25, dots: [] },
];

/** Ray-casting point-in-polygon on the lon/lat outline. */
export function onMainland(lon, lat) {
  let inside = false;
  for (let i = 0, j = MAINLAND.length - 1; i < MAINLAND.length; j = i, i += 1) {
    const [xi, yi] = MAINLAND[i];
    const [xj, yj] = MAINLAND[j];
    if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function outlinePath(points) {
  return `${points.map(([lon, lat], i) => {
    const { x, y } = project(lon, lat);
    return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ")} Z`;
}

/**
 * @param {object[]} cities playable cities ({id, name, map, theme})
 * @param {object[]} upcoming coming-soon pins ({id, name, map})
 * @param {object} progress per-city stars, to show on the pins
 */
export function mapSVG(cities, upcoming, progress = { cities: {} }) {
  const land = outlinePath(MAINLAND);
  const pq = project(103.97, 10.25);
  const islands = ISLANDS.filter((i) => i.dots.length).map((group) => {
    const dots = group.dots.map(([dx, dy]) => {
      const { x, y } = project(group.lon + dx, group.lat + dy);
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="#f1dfb0"/>`;
    }).join("");
    const label = project(group.lon, group.lat - 1.25);
    return `<g class="islands">${dots}<text x="${label.x.toFixed(1)}" y="${label.y.toFixed(1)}" text-anchor="middle" class="map-isl">${esc(group.name)}</text></g>`;
  }).join("");

  const soon = upcoming.map((c) => {
    const { x, y } = project(c.map.lon, c.map.lat);
    const left = c.map.label === "left";
    const dy = 4 + (c.map.dy ?? 0);
    return `<g class="pin soon" data-soon="${esc(c.id)}" tabindex="0" role="button" aria-label="${esc(c.name)} — sắp ra mắt" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})">
      <circle r="5"/><text x="${left ? -9 : 9}" y="${dy}" text-anchor="${left ? "end" : "start"}" class="map-soon">${esc(c.name)}</text></g>`;
  }).join("");

  const pins = cities.map((c) => {
    const { x, y } = project(c.map.lon, c.map.lat);
    const stars = progress.cities?.[c.id]?.stars ?? 0;
    const left = c.map.label === "left";
    return `<g class="pin city" data-city="${esc(c.id)}" tabindex="0" role="button" aria-label="${esc(c.name)} — ${esc(c.room)}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})" style="--pin:${c.theme.accent}">
      <circle class="pulse" r="12"/>
      <path class="drop" d="M0 0 C -12 -14 -12 -30 0 -32 C 12 -30 12 -14 0 0 Z"/>
      <circle cy="-21" r="5" fill="#fff"/>
      <g transform="translate(${left ? -16 : 16} -16)" text-anchor="${left ? "end" : "start"}">
        <text class="map-city" y="0">${esc(c.name)}</text>
        <text class="map-stars" y="20">${"★".repeat(stars)}${"☆".repeat(3 - stars)}</text>
      </g>
    </g>`;
  }).join("");

  return `<svg class="vn-map" viewBox="0 0 ${MAP_VIEW.w} ${MAP_VIEW.h}" role="img" aria-label="Bản đồ Việt Nam">
    <defs>
      <linearGradient id="map-land" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6e7bf"/><stop offset="1" stop-color="#e3c98c"/></linearGradient>
      <filter id="map-shadow" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000" flood-opacity="0.45"/></filter>
      <pattern id="map-waves" width="40" height="20" patternUnits="userSpaceOnUse"><path d="M0 10 q 10 -6 20 0 t 20 0" fill="none" stroke="#fff" stroke-width="1.2" opacity="0.08"/></pattern>
    </defs>
    <rect width="${MAP_VIEW.w}" height="${MAP_VIEW.h}" fill="url(#map-waves)"/>
    <text x="${project(111.5, 13).x.toFixed(1)}" y="${project(111.5, 13).y.toFixed(1)}" class="map-sea" text-anchor="middle">Biển Đông</text>
    <path d="${land}" fill="url(#map-land)" stroke="#b08a4a" stroke-width="2" stroke-linejoin="round" filter="url(#map-shadow)"/>
    <ellipse cx="${pq.x.toFixed(1)}" cy="${pq.y.toFixed(1)}" rx="5" ry="9" fill="url(#map-land)" stroke="#b08a4a" stroke-width="1.5"/>
    ${islands}
    ${soon}
    ${pins}
  </svg>`;
}
