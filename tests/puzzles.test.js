// The puzzle widgets, driven the way a player drives them: one click at a time.

import test from "node:test";
import assert from "node:assert/strict";
import { CITIES } from "../src/content/cities.js";
import { checkAnswer } from "../src/core/quests.js";
import { TYPE_LABEL, act, draftAnswer, newDraft, puzzleHTML, ready } from "../src/ui/puzzles.js";
import { assertWellFormed } from "./support/svg.js";

const all = CITIES.flatMap((c) => c.quests.map((q) => ({ city: c.id, q })));
const ofType = (type) => all.find((x) => x.q.type === type).q;

/** Click through a puzzle exactly as the player would, to its right answer. */
function clickToSolve(q, seed) {
  let d = newDraft(q, seed);
  switch (q.type) {
    case "choice": d = act(q, d, { act: "pick", i: q.answer }); break;
    case "multi": for (const i of q.answers) d = act(q, d, { act: "toggle", i }); break;
    case "text": d = act(q, d, { act: "type", value: q.accept[0].toUpperCase() }); break;
    case "code":
      [...q.answer].forEach((digit, i) => { for (let k = 0; k < Number(digit); k += 1) d = act(q, d, { act: "digit-up", i }); });
      break;
    case "order":
      q.answer.forEach((key, t) => {
        for (let pos = d.keys.indexOf(key); pos > t; pos -= 1) d = act(q, d, { act: "up", i: pos });
      });
      break;
    case "match":
      q.pairs.forEach((_, i) => { d = act(q, d, { act: "left", i }); d = act(q, d, { act: "right", i }); });
      break;
    default: break;
  }
  return d;
}

test("every puzzle in the game can be solved by clicking, whatever the shuffle", () => {
  for (const { city, q } of all) {
    for (const seed of [1, 7, 99]) {
      const d = clickToSolve(q, seed);
      assert.ok(ready(q, d), `${city}/${q.id}: not ready after solving`);
      assert.ok(checkAnswer(q, draftAnswer(q, d)).ok, `${city}/${q.id} seed ${seed}`);
    }
  }
});

test("every puzzle card renders well-formed markup in every state", () => {
  for (const { city, q } of all) {
    assert.ok(TYPE_LABEL[q.type], q.type);
    const fresh = newDraft(q, 3);
    for (const d of [fresh, clickToSolve(q, 3)]) {
      const html = puzzleHTML(q, d);
      assert.ok(html.length > 20, `${city}/${q.id}`);
      assertWellFormed(`<div>${html}</div>`, assert, `${city}/${q.id}`);
    }
  }
});

test("you cannot press Trả lời on an empty answer", () => {
  assert.equal(ready(ofType("choice"), newDraft(ofType("choice"))), false);
  assert.equal(ready(ofType("multi"), newDraft(ofType("multi"))), false);
  assert.equal(ready(ofType("text"), act(ofType("text"), newDraft(ofType("text")), { act: "type", value: "   " })), false);
  assert.equal(ready(ofType("match"), newDraft(ofType("match"))), false);
});

test("order and match puzzles never open already solved", () => {
  for (const { q } of all.filter((x) => x.q.type === "order" || x.q.type === "match")) {
    for (let seed = 1; seed < 40; seed += 1) {
      const d = newDraft(q, seed);
      if (q.type === "order") assert.notDeepEqual(d.keys, q.answer);
      else assert.notDeepEqual(d.rights, q.pairs.map((_, i) => i));
    }
  }
});

test("code wheels wrap around both ways", () => {
  const q = ofType("code");
  let d = newDraft(q);
  d = act(q, d, { act: "digit-down", i: 0 });
  assert.equal(d.digits[0], 9);
  d = act(q, d, { act: "digit-up", i: 0 });
  assert.equal(d.digits[0], 0);
  d = act(q, d, { act: "digit-set", i: 1 % d.digits.length, value: "7" });
  assert.equal(d.digits[1 % d.digits.length], 7);
});

test("the order arrows stop at the ends", () => {
  const q = ofType("order");
  const d = newDraft(q, 5);
  assert.deepEqual(act(q, d, { act: "up", i: 0 }).keys, d.keys);
  assert.deepEqual(act(q, d, { act: "down", i: d.keys.length - 1 }).keys, d.keys);
});

test("match: the first dish starts selected, tapping it again keeps it, a paired card can be undone", () => {
  const q = ofType("match");
  let d = newDraft(q, 2);
  assert.equal(d.active, 0);
  d = act(q, d, { act: "left", i: 0 });
  assert.equal(d.active, 0, "tapping the selected dish does not deselect it");
  d = act(q, d, { act: "right", i: 2 });
  assert.equal(d.pairs[0], 2);
  assert.equal(d.active, 1, "moves on to the next unpaired dish");
  d = act(q, d, { act: "right", i: 2 });
  assert.equal(d.pairs[0], undefined, "tapping a paired description unpairs it");
  d = act(q, d, { act: "left", i: 1 });
  d = act(q, d, { act: "right", i: 1 });
  d = act(q, d, { act: "left", i: 1 });
  assert.equal(d.pairs[1], undefined, "tapping a paired dish unpairs it");
  assert.equal(d.active, 1);
});

test("multi: toggling twice leaves the option unpicked", () => {
  const q = ofType("multi");
  let d = act(q, newDraft(q), { act: "toggle", i: 2 });
  d = act(q, d, { act: "toggle", i: 2 });
  assert.deepEqual(d.picked, []);
});

test("typed answers are capped and escaped in the markup", () => {
  const q = ofType("text");
  const d = act(q, newDraft(q), { act: "type", value: `"><script>${"x".repeat(200)}` });
  assert.ok(d.value.length <= 60);
  const html = puzzleHTML(q, d);
  assert.ok(!html.includes("<script>"));
  assert.ok(html.includes("&quot;&gt;&lt;script&gt;"));
});
