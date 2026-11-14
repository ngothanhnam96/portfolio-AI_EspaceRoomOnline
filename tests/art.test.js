import test from "node:test";
import assert from "node:assert/strict";
import { CITIES, UPCOMING } from "../src/content/cities.js";
import { ISLANDS, MAP_VIEW, mapSVG, onMainland, project } from "../src/ui/map.js";
import { ROOMS, roomScene } from "../src/ui/rooms/index.js";
import { DEPTH } from "../src/ui/rooms/kit.js";
import { assertWellFormed, idsIn } from "./support/svg.js";

const rect = (attrs) => Object.fromEntries([...attrs.matchAll(/(x|y|width|height)="(-?[\d.]+)"/g)].map((m) => [m[1], Number(m[2])]));

test("every playable city has room artwork, and every room belongs to a city", () => {
  assert.deepEqual(Object.keys(ROOMS).sort(), CITIES.map((c) => c.id).sort());
  assert.throws(() => roomScene("hue"), /no room artwork/);
});

test("every room is four depth layers, far to front, each lined up with the wall at rest", () => {
  assert.ok(DEPTH.far < DEPTH.back && DEPTH.back < DEPTH.mid && DEPTH.mid < DEPTH.front);
  for (const city of CITIES) {
    const html = roomScene(city.id);
    assert.match(html, /^<div class="scene3d"/);
    const layers = [...html.matchAll(/<div class="layer (\w+)" data-z="(-?\d+)" style="transform: translateZ\((-?\d+)px\) scale\(([\d.]+)\)"/g)];
    assert.deepEqual(layers.map((m) => m[1]), ["far", "back", "mid", "front"], city.id);
    for (const [, name, z, tz, scale] of layers) {
      assert.equal(Number(z), DEPTH[name]);
      assert.equal(Number(tz), DEPTH[name]);
      // With a 1500px perspective, scale (1500 - z) / 1500 makes the layer look exactly wall-sized.
      assert.ok(Math.abs(Number(scale) - (1500 - Number(z)) / 1500) < 1e-3, `${city.id}/${name}`);
    }
  }
});

test("every room is well-formed, with unique prefixed ids and no broken references", () => {
  const prefixes = new Set();
  for (const city of CITIES) {
    const html = roomScene(city.id);
    assertWellFormed(html, assert, city.id);
    const ids = idsIn(html);
    assert.equal(new Set(ids).size, ids.length, `${city.id}: an id repeats`);
    const prefix = ids[0].split("-")[0];
    assert.ok(ids.every((id) => id.startsWith(`${prefix}-`)), `${city.id}: ids must share one prefix`);
    assert.ok(!prefixes.has(prefix), `${city.id}: prefix ${prefix} is used by another room`);
    prefixes.add(prefix);
    for (const ref of html.matchAll(/url\(#([^)]+)\)/g)) assert.ok(ids.includes(ref[1]), `${city.id}: url(#${ref[1]}) points nowhere`);
  }
});

test("the wall has a window-shaped hole, and the view behind it is painted well past the frame", () => {
  for (const city of CITIES) {
    const html = roomScene(city.id);
    const mask = html.match(/<mask id="(\w+)-hole"[^>]*>(.*?)<\/mask>/s);
    assert.ok(mask, `${city.id}: no hole in the wall`);
    const hole = rect([...mask[2].matchAll(/<rect([^>]*)\/>/g)][1][1]);
    const view = rect(html.match(new RegExp(`<clipPath id="${mask[1]}-view"><rect([^>]*)/>`))[1]);
    // The far layer slides behind the glass as the camera turns or glides; never show its edge.
    assert.ok(hole.x - view.x >= 150 && view.x + view.width - (hole.x + hole.width) >= 150, `${city.id}: view too narrow`);
    assert.ok(hole.y - view.y >= 50 && view.y + view.height - (hole.y + hole.height) >= 50, `${city.id}: view too short`);
    assert.ok(html.includes(`mask="url(#${mask[1]}-hole)"`), `${city.id}: the hole is never applied`);
  }
});

test("each quest has exactly one object, plus one door with its own swinging leaf", () => {
  for (const city of CITIES) {
    const html = roomScene(city.id);
    const hot = [...html.matchAll(/data-quest="([^"]+)"/g)].map((m) => m[1]);
    assert.deepEqual([...hot].sort(), city.quests.map((q) => q.id).sort(), city.id);
    assert.equal((html.match(/data-door="1"/g) ?? []).length, 1, `${city.id}: one door`);
    assert.equal((html.match(/class="badge"/g) ?? []).length, city.quests.length, `${city.id}: a tick for every quest`);
    assert.ok(html.includes('role="button"') && html.includes('tabindex="0"'), `${city.id}: objects must be keyboard reachable`);
    const leaves = [...html.matchAll(/<svg class="door3d (swing|fold) hinge-(left|right)" viewBox="(\d+) (\d+) (\d+) (\d+)" style="left:(\d+)px;top:(\d+)px;width:(\d+)px;height:(\d+)px">/g)];
    assert.equal(leaves.length, 1, `${city.id}: one door leaf`);
    const [, , , x, y, w, h, left, top, width, height] = leaves[0];
    assert.deepEqual([x, y, w, h], [left, top, width, height], `${city.id}: the leaf sits exactly over its frame`);
  }
});

test("each room has its escape show, and light behind the door", () => {
  for (const city of CITIES) {
    const html = roomScene(city.id);
    assert.ok(html.includes('class="celebrate'), `${city.id}: no celebration layer`);
    assert.ok(html.includes('class="door-light"'), `${city.id}: no light behind the door`);
  }
});

test("near props sit in the front layer, softly out of focus, and never take clicks", () => {
  for (const city of CITIES) {
    const html = roomScene(city.id);
    const front = html.slice(html.indexOf('class="layer front"'));
    assert.match(front, /filter="url\(#\w+-dof\)"/, `${city.id}: front layer is not blurred`);
    assert.ok(!/data-quest=/.test(front.slice(0, front.indexOf("layer-fx"))), `${city.id}: no puzzle should hide in the blurred foreground`);
  }
});

test("the three rooms look different from one another", () => {
  const scenes = CITIES.map((c) => roomScene(c.id));
  for (let i = 0; i < scenes.length; i += 1) {
    for (let j = i + 1; j < scenes.length; j += 1) assert.notEqual(scenes[i], scenes[j]);
  }
});

test("the map is well-formed and every pin stands on Vietnamese soil", () => {
  const svg = mapSVG(CITIES, UPCOMING, { cities: { hanoi: { stars: 2 } } });
  assertWellFormed(svg, assert, "map");
  for (const c of [...CITIES, ...UPCOMING]) {
    assert.ok(onMainland(c.map.lon, c.map.lat), `${c.name} is in the sea`);
    const { x, y } = project(c.map.lon, c.map.lat);
    assert.ok(x > 0 && x < MAP_VIEW.w && y > 0 && y < MAP_VIEW.h, `${c.name} is off the map`);
  }
  for (const c of CITIES) assert.ok(svg.includes(`data-city="${c.id}"`), c.id);
  for (const c of UPCOMING) assert.ok(svg.includes(`data-soon="${c.id}"`), c.id);
  assert.ok(svg.includes("★★☆"), "stars show on the pin");
});

test("the map shows Hoàng Sa, Trường Sa and Phú Quốc", () => {
  const svg = mapSVG(CITIES, UPCOMING);
  assert.ok(svg.includes("QĐ. Hoàng Sa"));
  assert.ok(svg.includes("QĐ. Trường Sa"));
  assert.ok(ISLANDS.some((i) => i.name === "Phú Quốc"));
  for (const group of ISLANDS) {
    assert.ok(!onMainland(group.lon, group.lat), `${group.name} should be offshore`);
    const { x, y } = project(group.lon, group.lat);
    assert.ok(x > 0 && x < MAP_VIEW.w && y > 0 && y < MAP_VIEW.h, `${group.name} is off the map`);
  }
});

test("the outline knows land from sea", () => {
  assert.ok(onMainland(105.85, 21.03), "Hà Nội");
  assert.ok(!onMainland(112, 12), "the middle of the sea");
  assert.ok(!onMainland(101.0, 15.0), "Laos");
});
