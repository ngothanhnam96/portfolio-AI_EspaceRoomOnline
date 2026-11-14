// One attempt at one room. Pure functions in, new state out: the clock is
// passed in as `now` (milliseconds), so a whole escape can be replayed in tests.
//
// Every solved quest hands over a letter. Collect them all and the door's
// word lock appears; arrange the letters into the city's name to get out.

import { checkAnswer } from "./quests.js";
import { fold, scrambled } from "./text.js";

export const PENALTY = {
  /** Seconds added to the clock for a wrong answer. */
  wrong: 15,
  /** Seconds added for each hint you open. */
  hint: 45,
  /** Seconds added for a wrong word at the door. */
  door: 20,
};

export function createRun(city, now = 0, seed = 1) {
  return {
    cityId: city.id,
    seed,
    startedAt: now,
    finishedAt: null,
    penalty: 0,
    solved: {},          // questId -> seconds on the clock when it was solved
    hints: {},           // questId -> number of hints opened
    wrong: {},           // questId -> number of wrong tries
    doorTries: 0,
    letters: [],         // in the order they were found
    status: /** @type {"playing"|"escaped"|"timeout"} */ ("playing"),
  };
}

/** Seconds used so far, penalties included. */
export function elapsed(run, now) {
  const end = run.finishedAt ?? now;
  return Math.max(0, (end - run.startedAt) / 1000) + run.penalty;
}

export function remaining(run, city, now) {
  return Math.max(0, city.timeLimit - elapsed(run, now));
}

export function questById(city, id) {
  const quest = city.quests.find((q) => q.id === id);
  if (!quest) throw new Error(`no quest ${id} in ${city.id}`);
  return quest;
}

export function isSolved(run, questId) {
  return run.solved[questId] !== undefined;
}

export function solvedCount(run) {
  return Object.keys(run.solved).length;
}

/** Stop the run if the clock has run out. */
export function tick(run, city, now) {
  if (run.status !== "playing") return run;
  if (remaining(run, city, now) > 0) return run;
  return { ...run, status: "timeout", finishedAt: now };
}

/**
 * Try an answer on a quest.
 * @returns {{run: object, ok: boolean, right?: number, total?: number, reward?: string}}
 */
export function attempt(run, city, questId, answer, now) {
  const current = tick(run, city, now);
  if (current.status !== "playing") return { run: current, ok: false };
  const quest = questById(city, questId);
  if (isSolved(current, questId)) return { run: current, ok: true, already: true };

  const verdict = checkAnswer(quest, answer);
  if (!verdict.ok) {
    const next = {
      ...current,
      penalty: current.penalty + PENALTY.wrong,
      wrong: { ...current.wrong, [questId]: (current.wrong[questId] ?? 0) + 1 },
    };
    return { run: tick(next, city, now), ok: false, right: verdict.right, total: verdict.total };
  }

  const next = {
    ...current,
    solved: { ...current.solved, [questId]: elapsed(current, now) },
    letters: [...current.letters, quest.reward],
  };
  return { run: next, ok: true, reward: quest.reward };
}

/** Open the next hint for a quest (costs time). Returns null when none are left. */
export function takeHint(run, city, questId, now) {
  const quest = questById(city, questId);
  const used = run.hints[questId] ?? 0;
  if (run.status !== "playing" || isSolved(run, questId) || used >= quest.hints.length) {
    return { run, hint: null };
  }
  const next = {
    ...run,
    penalty: run.penalty + PENALTY.hint,
    hints: { ...run.hints, [questId]: used + 1 },
  };
  return { run: tick(next, city, now), hint: quest.hints[used] };
}

/** The hints already paid for, so reopening a puzzle shows them again for free. */
export function hintsShown(run, city, questId) {
  return questById(city, questId).hints.slice(0, run.hints[questId] ?? 0);
}

export function doorReady(run, city) {
  return solvedCount(run) === city.quests.length;
}

/** The letters as the lock shows them: shuffled, but never already spelling the word. */
export function doorTiles(run, city) {
  return scrambled(run.letters, run.seed);
}

/**
 * Try the word on the door.
 * @returns {{run: object, ok: boolean}}
 */
export function tryDoor(run, city, word, now) {
  const current = tick(run, city, now);
  if (current.status !== "playing" || !doorReady(current, city)) return { run: current, ok: false };
  if (fold(word).replace(/ /g, "") === fold(city.final.word).replace(/ /g, "")) {
    return { run: { ...current, status: "escaped", finishedAt: now, doorTries: current.doorTries + 1 }, ok: true };
  }
  const next = { ...current, penalty: current.penalty + PENALTY.door, doorTries: current.doorTries + 1 };
  return { run: tick(next, city, now), ok: false };
}

/** 3 stars with half the clock left, 2 with a quarter, 1 for any escape. */
export function starsFor(run, city) {
  if (run.status !== "escaped") return 0;
  const left = (city.timeLimit - elapsed(run, run.finishedAt)) / city.timeLimit;
  if (left >= 0.5) return 3;
  if (left >= 0.25) return 2;
  return 1;
}

/** Totals for the result card. */
export function summary(run, city) {
  const hints = Object.values(run.hints).reduce((a, b) => a + b, 0);
  const wrong = Object.values(run.wrong).reduce((a, b) => a + b, 0);
  return {
    seconds: elapsed(run, run.finishedAt ?? run.startedAt),
    penalty: run.penalty,
    hints,
    wrong,
    solved: solvedCount(run),
    total: city.quests.length,
    stars: starsFor(run, city),
  };
}
