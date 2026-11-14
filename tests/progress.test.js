import test from "node:test";
import assert from "node:assert/strict";
import { newProgress, recordResult, restoreProgress, titleOf, totalStars } from "../src/core/progress.js";

const IDS = ["hanoi", "danang", "hcm"];

test("an escape records stars and the time; a timeout only counts the attempt", () => {
  let p = recordResult(newProgress(), "hanoi", { escaped: true, seconds: 412.4, stars: 2 }).progress;
  assert.deepEqual(p.cities.hanoi, { stars: 2, best: 412, escapes: 1 });
  p = recordResult(p, "danang", { escaped: false, seconds: 1080, stars: 0 }).progress;
  assert.deepEqual(p.cities.danang, { stars: 0, best: null, escapes: 0 });
  assert.equal(p.attempts, 2);
  assert.equal(p.escapes, 1);
});

test("stars and best time only ever improve", () => {
  let out = recordResult(newProgress(), "hcm", { escaped: true, seconds: 300, stars: 3 });
  assert.equal(out.newBest, true);
  out = recordResult(out.progress, "hcm", { escaped: true, seconds: 600, stars: 1 });
  assert.equal(out.newBest, false);
  assert.deepEqual(out.progress.cities.hcm, { stars: 3, best: 300, escapes: 2 });
  out = recordResult(out.progress, "hcm", { escaped: true, seconds: 250, stars: 3 });
  assert.equal(out.newBest, true);
  assert.equal(out.progress.cities.hcm.best, 250);
});

test("junk in storage is cleaned, unknown cities are dropped", () => {
  for (const junk of [null, 7, "x", [], { cities: "nope" }]) {
    assert.deepEqual(restoreProgress(junk, IDS), newProgress());
  }
  const p = restoreProgress({ cities: { hanoi: { stars: 9, best: -5, escapes: "2" }, atlantis: { stars: 3 } }, escapes: -1 }, IDS);
  assert.deepEqual(p.cities.hanoi, { stars: 3, best: null, escapes: 2 });
  assert.equal(p.cities.atlantis, undefined);
  assert.equal(p.escapes, 0);
});

test("titles climb with stars up to a full house", () => {
  const with_ = (stars) => ({ ...newProgress(), cities: Object.fromEntries(IDS.map((id, i) => [id, { stars: Math.max(0, Math.min(3, stars - i * 3)), best: null, escapes: 0 }])) });
  assert.equal(titleOf(newProgress(), 3).name, "Khách Lạ");
  assert.equal(titleOf(with_(1), 3).name, "Tân Binh Mật Thất");
  assert.equal(totalStars(with_(9)), 9);
  assert.equal(titleOf(with_(9), 3).name, "Huyền Thoại Ba Miền");
  const names = [0, 1, 3, 6, 9].map((n) => titleOf(with_(n), 3).name);
  assert.equal(new Set(names).size, 5, "each tier has its own title");
});
