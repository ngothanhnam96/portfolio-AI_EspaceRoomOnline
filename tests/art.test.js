import test from "node:test";
import assert from "node:assert/strict";
import { CITIES, UPCOMING } from "../src/content/cities.js";
import { ISLANDS, MAP_VIEW, mapSVG, onMainland, project } from "../src/ui/map.js";
import { ROOMS, roomSVG } from "../src/ui/rooms/index.js";
import { assertWellFormed, idsIn } from "./support/svg.js";

test("every playable city has room artwork, and every room belongs to a city", () => {
  assert.deepEqual(Object.keys(ROOMS).sort(), CITIES.map((c) => c.id).sort());
  assert.throws(() => roomSVG("hue"), /no room artwork/);
});

test("every room is well-formed SVG with unique, prefixed ids", () => {
  const prefixes = new Set();
  for (const city of CITIES) {
    const svg = roomSVG(city.id);
    assert.match(svg, /^<svg class="room-svg" viewBox="0 0 1600 900"/);
    assertWellFormed(svg, assert, city.id);
    const ids = idsIn(svg);
    assert.equal(new Set(ids).size, ids.length, `${city.id}: an id repeats`);
    const prefix = ids[0].split("-")[0];
    assert.ok(ids.every((id) => id.startsWith(`${prefix}-`)), `${city.id}: ids must share one prefix`);
    assert.ok(!prefixes.has(prefix), `${city.id}: prefix ${prefix} is used by another room`);
    prefixes.add(prefix);
    for (const ref of svg.matchAll(/url\(#([^)]+)\)/g)) assert.ok(ids.includes(ref[1]), `${city.id}: url(#${ref[1]}) points nowhere`);
  }
});

test("each quest has exactly one object in its room, plus one door", () => {
  for (const city of CITIES) {
    const svg = roomSVG(city.id);
    const hot = [...svg.matchAll(/data-quest="([^"]+)"/g)].map((m) => m[1]);
    assert.deepEqual([...hot].sort(), city.quests.map((q) => q.id).sort(), city.id);
    assert.equal((svg.match(/data-door="1"/g) ?? []).length, 1, `${city.id}: one door`);
    assert.equal((svg.match(/class="badge"/g) ?? []).length, city.quests.length, `${city.id}: a tick for every quest`);
    assert.ok(svg.includes('role="button"') && svg.includes("tabindex=\"0\""), `${city.id}: objects must be keyboard reachable`);
  }
});

test("each room has its escape show and a door that opens", () => {
  for (const city of CITIES) {
    const svg = roomSVG(city.id);
    assert.ok(svg.includes('class="celebrate'), `${city.id}: no celebration layer`);
    assert.ok(svg.includes('class="door-leaf'), `${city.id}: no door leaf to swing`);
    assert.ok(svg.includes('class="door-light"'), `${city.id}: no light behind the door`);
  }
});

test("the three rooms look different from one another", () => {
  const svgs = CITIES.map((c) => roomSVG(c.id));
  for (let i = 0; i < svgs.length; i += 1) {
    for (let j = i + 1; j < svgs.length; j += 1) assert.notEqual(svgs[i], svgs[j]);
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
