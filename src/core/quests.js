// The six kinds of puzzle a room can hold, and how each one is marked.
//
//   choice  pick one of several options           answer: option index
//   multi   pick every option that applies        answer: array of option indexes
//   text    type a word or name                   answer: string (diacritics optional)
//   code    turn number wheels                    answer: string of digits
//   order   put items in the right sequence       answer: array of item keys
//   match   pair each left card with a right card answer: { [leftIndex]: rightIndex }
//
// checkAnswer never throws on junk input — a malformed answer is simply wrong.

import { squash } from "./text.js";

export const QUEST_TYPES = ["choice", "multi", "text", "code", "order", "match"];

/**
 * @returns {{ok: boolean, right?: number, total?: number}}
 *   For order and match puzzles `right` says how many are already in place,
 *   so the room can tell the player "2/4 đúng" — the warm/cold feedback real
 *   escape rooms give.
 */
export function checkAnswer(quest, answer) {
  switch (quest.type) {
    case "choice":
      return { ok: Number.isInteger(answer) && answer === quest.answer };

    case "multi": {
      if (!Array.isArray(answer)) return { ok: false };
      const picked = new Set(answer);
      const wanted = new Set(quest.answers);
      const ok = picked.size === wanted.size && [...wanted].every((i) => picked.has(i));
      return { ok };
    }

    case "text": {
      const given = squash(answer);
      if (!given) return { ok: false };
      return { ok: quest.accept.some((alias) => squash(alias) === given) };
    }

    case "code":
      return { ok: typeof answer === "string" && answer === quest.answer };

    case "order": {
      if (!Array.isArray(answer) || answer.length !== quest.answer.length) return { ok: false, right: 0, total: quest.answer.length };
      const right = quest.answer.filter((key, i) => answer[i] === key).length;
      return { ok: right === quest.answer.length, right, total: quest.answer.length };
    }

    case "match": {
      const total = quest.pairs.length;
      if (!answer || typeof answer !== "object") return { ok: false, right: 0, total };
      let right = 0;
      for (let i = 0; i < total; i += 1) if (answer[i] === i) right += 1;
      const used = Object.values(answer);
      const oneToOne = new Set(used).size === used.length;
      return { ok: right === total && oneToOne, right, total };
    }

    default:
      return { ok: false };
  }
}

/** The canonical right answer — used by the tests and the debug auto-solver. */
export function solutionOf(quest) {
  switch (quest.type) {
    case "choice": return quest.answer;
    case "multi": return [...quest.answers];
    case "text": return quest.accept[0];
    case "code": return quest.answer;
    case "order": return [...quest.answer];
    case "match": return Object.fromEntries(quest.pairs.map((_, i) => [i, i]));
    default: return null;
  }
}
