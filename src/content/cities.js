// The city registry. To add a city: write src/content/<id>.js (copy hanoi.js),
// draw its room in src/ui/rooms/<id>.js, and list both here and in rooms/index.js.
// `npm test` runs the content validator over every city, so mistakes show up at once.

import danang from "./danang.js";
import hanoi from "./hanoi.js";
import hcm from "./hcm.js";

/** Playable cities, north to south. */
export const CITIES = [hanoi, danang, hcm];

/** Pins shown on the map as "coming soon". */
export const UPCOMING = [
  { id: "sapa", name: "Sa Pa", map: { lon: 103.84, lat: 22.34 } },
  { id: "halong", name: "Hạ Long", map: { lon: 107.08, lat: 20.95, dy: 10 } },
  { id: "hue", name: "Huế", map: { lon: 107.59, lat: 16.46, label: "left" } },
  { id: "hoian", name: "Hội An", map: { lon: 108.33, lat: 15.88, dy: 14 } },
  { id: "dalat", name: "Đà Lạt", map: { lon: 108.44, lat: 11.94 } },
  { id: "cantho", name: "Cần Thơ", map: { lon: 105.78, lat: 10.03 } },
];

export function cityById(id) {
  return CITIES.find((c) => c.id === id) ?? null;
}
