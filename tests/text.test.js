import test from "node:test";
import assert from "node:assert/strict";
import { clock, fold, scrambled, shuffled, squash } from "../src/core/text.js";

test("fold ignores diacritics, đ, case, punctuation and stray spaces", () => {
  assert.equal(fold("Hồ Hoàn Kiếm"), "ho hoan kiem");
  assert.equal(fold("  HỒ-HOÀN   KIẾM!! "), "ho hoan kiem");
  assert.equal(fold("Đà Nẵng"), "da nang");
  assert.equal(fold("Cà phê sữa đá"), "ca phe sua da");
  assert.equal(fold(null), "");
  assert.equal(fold(82), "82");
});

test("squash also removes the spaces", () => {
  assert.equal(squash("Cầu Vàng"), "cauvang");
  assert.equal(squash("cau vang"), squash("CẦUVÀNG"));
});

test("a seeded shuffle is repeatable and keeps every item", () => {
  const list = ["a", "b", "c", "d", "e", "f"];
  assert.deepEqual(shuffled(list, 7), shuffled(list, 7));
  assert.notDeepEqual(shuffled(list, 7), shuffled(list, 8));
  assert.deepEqual([...shuffled(list, 3)].sort(), list);
  assert.deepEqual(list, ["a", "b", "c", "d", "e", "f"], "the input is untouched");
});

test("scrambled never hands back the answer already in order", () => {
  for (let seed = 1; seed < 300; seed += 1) {
    const out = scrambled(["H", "A", "N", "O", "I"], seed);
    assert.notEqual(out.join(""), "HANOI", `seed ${seed}`);
    assert.equal([...out].sort().join(""), "AHINO");
  }
  assert.deepEqual(scrambled(["x"], 1), ["x"]);
  assert.notDeepEqual(scrambled(["a", "b"], 5), ["a", "b"]);
});

test("clock shows mm:ss and never goes negative", () => {
  assert.equal(clock(900), "15:00");
  assert.equal(clock(61.2), "01:02");
  assert.equal(clock(0), "00:00");
  assert.equal(clock(-30), "00:00");
});
