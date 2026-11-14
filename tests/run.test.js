import test from "node:test";
import assert from "node:assert/strict";
import { CITIES, cityById } from "../src/content/cities.js";
import { solutionOf } from "../src/core/quests.js";
import {
  PENALTY, attempt, createRun, doorReady, doorTiles, elapsed, hintsShown, remaining, solvedCount,
  starsFor, summary, takeHint, tick, tryDoor,
} from "../src/core/run.js";

const hanoi = cityById("hanoi");
const T0 = 1_000_000;
const at = (seconds) => T0 + seconds * 1000;

function solveAll(city, run, seconds = 10) {
  let r = run;
  city.quests.forEach((q, i) => { r = attempt(r, city, q.id, solutionOf(q), at(seconds + i)).run; });
  return r;
}

test("a new run is playing, with the full clock and nothing solved", () => {
  const run = createRun(hanoi, T0);
  assert.equal(run.status, "playing");
  assert.equal(remaining(run, hanoi, T0), hanoi.timeLimit);
  assert.equal(solvedCount(run), 0);
  assert.equal(doorReady(run, hanoi), false);
});

test("a right answer hands over the quest's letter, once", () => {
  const q = hanoi.quests[0];
  const first = attempt(createRun(hanoi, T0), hanoi, q.id, solutionOf(q), at(5));
  assert.equal(first.ok, true);
  assert.equal(first.reward, q.reward);
  assert.deepEqual(first.run.letters, [q.reward]);
  const again = attempt(first.run, hanoi, q.id, solutionOf(q), at(6));
  assert.equal(again.already, true);
  assert.deepEqual(again.run.letters, [q.reward], "no second letter for the same puzzle");
});

test("a wrong answer costs time, counts, and gives no letter", () => {
  const q = hanoi.quests.find((x) => x.type === "choice");
  const out = attempt(createRun(hanoi, T0), hanoi, q.id, (q.answer + 1) % q.options.length, at(5));
  assert.equal(out.ok, false);
  assert.equal(out.run.penalty, PENALTY.wrong);
  assert.equal(out.run.wrong[q.id], 1);
  assert.deepEqual(out.run.letters, []);
  assert.equal(remaining(out.run, hanoi, at(5)), hanoi.timeLimit - 5 - PENALTY.wrong);
});

test("order and match puzzles say how close you are", () => {
  const q = hanoi.quests.find((x) => x.type === "order");
  const swapped = [...q.answer];
  [swapped[0], swapped[1]] = [swapped[1], swapped[0]];
  const out = attempt(createRun(hanoi, T0), hanoi, q.id, swapped, at(3));
  assert.equal(out.ok, false);
  assert.equal(out.right, q.answer.length - 2);
  assert.equal(out.total, q.answer.length);
});

test("hints cost time, come in order, stop when used up and stay paid for", () => {
  const q = hanoi.quests[2];
  let run = createRun(hanoi, T0);
  let out = takeHint(run, hanoi, q.id, at(1));
  assert.equal(out.hint, q.hints[0]);
  run = out.run;
  out = takeHint(run, hanoi, q.id, at(2));
  assert.equal(out.hint, q.hints[1]);
  run = out.run;
  out = takeHint(run, hanoi, q.id, at(3));
  assert.equal(out.hint, null, "no third hint");
  assert.equal(out.run.penalty, PENALTY.hint * 2, "the empty request was free");
  assert.deepEqual(hintsShown(out.run, hanoi, q.id), q.hints, "reopening shows them again for free");
});

test("the door only listens once every puzzle is solved", () => {
  let run = createRun(hanoi, T0);
  assert.equal(tryDoor(run, hanoi, "HANOI", at(1)).ok, false, "not with zero letters");
  run = solveAll(hanoi, run);
  assert.equal(doorReady(run, hanoi), true);
  const tiles = doorTiles(run, hanoi);
  assert.equal([...tiles].sort().join(""), [..."HANOI"].sort().join(""));
  assert.notEqual(tiles.join(""), "HANOI", "the lock never shows the answer pre-arranged");
});

test("a wrong word costs time; the right one (any case, any accents) escapes", () => {
  let run = solveAll(hanoi, createRun(hanoi, T0));
  const wrong = tryDoor(run, hanoi, "NOHIA", at(60));
  assert.equal(wrong.ok, false);
  assert.equal(wrong.run.penalty, PENALTY.door);
  run = tryDoor(wrong.run, hanoi, "hà nội", at(70)).run;
  assert.equal(run.status, "escaped");
  assert.equal(run.finishedAt, at(70));
  assert.equal(elapsed(run, at(999)), 70 + PENALTY.door, "the clock stops at the escape");
});

test("running out of time ends the run, and nothing works afterwards", () => {
  let run = createRun(hanoi, T0);
  run = tick(run, hanoi, at(hanoi.timeLimit - 1));
  assert.equal(run.status, "playing");
  run = tick(run, hanoi, at(hanoi.timeLimit));
  assert.equal(run.status, "timeout");
  const q = hanoi.quests[0];
  assert.equal(attempt(run, hanoi, q.id, solutionOf(q), at(hanoi.timeLimit + 1)).ok, false);
  assert.equal(takeHint(run, hanoi, q.id, at(hanoi.timeLimit + 1)).hint, null);
  assert.equal(starsFor(run, hanoi), 0);
});

test("penalties alone can run the clock out", () => {
  const q = hanoi.quests.find((x) => x.type === "code");
  let run = createRun(hanoi, T0);
  const tries = Math.ceil(hanoi.timeLimit / PENALTY.wrong) + 1;
  for (let i = 0; i < tries && run.status === "playing"; i += 1) run = attempt(run, hanoi, q.id, "00", at(1)).run;
  assert.equal(run.status, "timeout");
});

test("stars: 3 with half the clock left, 2 with a quarter, 1 just in time", () => {
  const escapeAt = (seconds) => tryDoor(solveAll(hanoi, createRun(hanoi, T0), 1), hanoi, "HANOI", at(seconds)).run;
  assert.equal(starsFor(escapeAt(hanoi.timeLimit * 0.3), hanoi), 3);
  assert.equal(starsFor(escapeAt(hanoi.timeLimit * 0.6), hanoi), 2);
  assert.equal(starsFor(escapeAt(hanoi.timeLimit * 0.9), hanoi), 1);
});

test("the summary adds up hints, mistakes and penalties", () => {
  let run = createRun(hanoi, T0);
  const q = hanoi.quests[0];
  run = takeHint(run, hanoi, q.id, at(1)).run;
  run = attempt(run, hanoi, q.id, (q.answer + 1) % q.options.length, at(2)).run;
  run = solveAll(hanoi, run, 3);
  run = tryDoor(run, hanoi, hanoi.final.word, at(100)).run;
  const s = summary(run, hanoi);
  assert.equal(s.hints, 1);
  assert.equal(s.wrong, 1);
  assert.equal(s.penalty, PENALTY.hint + PENALTY.wrong);
  assert.equal(s.solved, s.total);
  assert.equal(s.seconds, 100 + PENALTY.hint + PENALTY.wrong);
  assert.equal(s.stars, 3);
});

test("runs are never mutated in place", () => {
  const run = createRun(hanoi, T0);
  const frozen = JSON.stringify(run);
  const q = hanoi.quests[0];
  attempt(run, hanoi, q.id, solutionOf(q), at(1));
  attempt(run, hanoi, q.id, 99, at(1));
  takeHint(run, hanoi, q.id, at(1));
  tick(run, hanoi, at(99999));
  assert.equal(JSON.stringify(run), frozen);
});

test("every city can be escaped with three stars by someone who knows the answers", () => {
  for (const city of CITIES) {
    let run = solveAll(city, createRun(city, T0, 42), 20);
    run = tryDoor(run, city, city.final.word, at(120)).run;
    assert.equal(run.status, "escaped", city.id);
    assert.equal(starsFor(run, city), 3, city.id);
    assert.equal(run.letters.length, city.final.word.length, city.id);
  }
});
