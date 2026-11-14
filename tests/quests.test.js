import test from "node:test";
import assert from "node:assert/strict";
import { QUEST_TYPES, checkAnswer, solutionOf } from "../src/core/quests.js";

const choice = { type: "choice", options: ["938", "1010", "1070"], answer: 1 };
const multi = { type: "multi", options: ["Kim", "Mộc", "Phong", "Thủy"], answers: [0, 1, 3] };
const text = { type: "text", accept: ["Hoàn Kiếm", "Hồ Gươm"] };
const code = { type: "code", answer: "082" };
const order = { type: "order", items: [{ key: "a" }, { key: "b" }, { key: "c" }], answer: ["a", "b", "c"] };
const match = { type: "match", pairs: [["Phở", "x"], ["Bún chả", "y"], ["Cà phê trứng", "z"]] };

test("there are exactly six puzzle types", () => {
  assert.deepEqual(QUEST_TYPES, ["choice", "multi", "text", "code", "order", "match"]);
});

test("choice: only the right index counts", () => {
  assert.ok(checkAnswer(choice, 1).ok);
  assert.ok(!checkAnswer(choice, 0).ok);
  assert.ok(!checkAnswer(choice, "1").ok, "a string is not an index");
});

test("multi: every right option and nothing else, in any order", () => {
  assert.ok(checkAnswer(multi, [3, 0, 1]).ok);
  assert.ok(!checkAnswer(multi, [0, 1]).ok, "one missing");
  assert.ok(!checkAnswer(multi, [0, 1, 2, 3]).ok, "one extra");
  assert.ok(!checkAnswer(multi, "0,1,3").ok);
});

test("text: any accepted spelling, with or without diacritics or spaces", () => {
  for (const guess of ["Hoàn Kiếm", "hoan kiem", "HOANKIEM", "  hồ   gươm ", "Ho-Guom"]) {
    assert.ok(checkAnswer(text, guess).ok, guess);
  }
  for (const guess of ["", "   ", "Hồ Tây", "kiem", null]) assert.ok(!checkAnswer(text, guess).ok, String(guess));
});

test("code: the exact digits, leading zeros included", () => {
  assert.ok(checkAnswer(code, "082").ok);
  assert.ok(!checkAnswer(code, "82").ok);
  assert.ok(!checkAnswer(code, 82).ok);
});

test("order: right or wrong, and how many are already in place", () => {
  assert.deepEqual(checkAnswer(order, ["a", "b", "c"]), { ok: true, right: 3, total: 3 });
  assert.deepEqual(checkAnswer(order, ["a", "c", "b"]), { ok: false, right: 1, total: 3 });
  assert.equal(checkAnswer(order, ["a"]).ok, false);
});

test("match: every pair, one-to-one, with a count of right pairs", () => {
  assert.equal(checkAnswer(match, { 0: 0, 1: 1, 2: 2 }).ok, true);
  assert.deepEqual(checkAnswer(match, { 0: 1, 1: 0, 2: 2 }), { ok: false, right: 1, total: 3 });
  assert.equal(checkAnswer(match, null).ok, false);
  assert.equal(checkAnswer(match, { 0: 0, 1: 1 }).ok, false, "incomplete");
});

test("the canonical solution of every type is marked right", () => {
  for (const q of [choice, multi, text, code, order, match]) {
    assert.ok(checkAnswer(q, solutionOf(q)).ok, q.type);
  }
  assert.equal(checkAnswer({ type: "riddle" }, "x").ok, false, "an unknown type is never right");
  assert.equal(solutionOf({ type: "riddle" }), null);
});
