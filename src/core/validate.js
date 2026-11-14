// Content validator: every city must be playable and solvable before it ships.
// Returns a list of human-readable problems (empty means the city is fine).

import { QUEST_TYPES, checkAnswer, solutionOf } from "./quests.js";
import { fold } from "./text.js";

const unique = (list) => new Set(list).size === list.length;

export function validateCity(city) {
  const problems = [];
  const say = (msg) => problems.push(`${city?.id ?? "?"}: ${msg}`);

  if (!city || typeof city !== "object") return ["city is not an object"];
  for (const key of ["id", "name", "region", "room", "tagline", "story", "outro"]) {
    if (typeof city[key] !== "string" || !city[key].trim()) say(`missing ${key}`);
  }
  if (!/^[a-z][a-z0-9-]*$/.test(city.id ?? "")) say("id must be lower-case letters/digits");
  if (!(city.timeLimit >= 300 && city.timeLimit <= 3600)) say("timeLimit should be 5–60 minutes");
  if (!(city.map && city.map.lon >= 102 && city.map.lon <= 110 && city.map.lat >= 8 && city.map.lat <= 23.5)) {
    say("map position is outside mainland Vietnam");
  }

  const quests = Array.isArray(city.quests) ? city.quests : [];
  if (quests.length < 4 || quests.length > 7) say(`has ${quests.length} quests; a room needs 4–7`);
  if (!unique(quests.map((q) => q.id))) say("quest ids repeat");

  for (const q of quests) {
    const where = `quest ${q.id}`;
    if (!QUEST_TYPES.includes(q.type)) { say(`${where}: unknown type ${q.type}`); continue; }
    for (const key of ["object", "title", "prompt", "fact"]) {
      if (typeof q[key] !== "string" || !q[key].trim()) say(`${where}: missing ${key}`);
    }
    if (!Array.isArray(q.hints) || q.hints.length !== 2 || q.hints.some((h) => !h?.trim())) say(`${where}: needs exactly 2 hints`);
    if (!/^[A-Z]$/.test(q.reward ?? "")) say(`${where}: reward must be one capital letter`);

    switch (q.type) {
      case "choice":
        if (!(q.options?.length >= 3) || !unique(q.options.map(fold))) say(`${where}: needs 3+ distinct options`);
        if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= (q.options?.length ?? 0)) say(`${where}: answer out of range`);
        break;
      case "multi":
        if (!(q.options?.length >= 4) || !unique(q.options.map(fold))) say(`${where}: needs 4+ distinct options`);
        if (!Array.isArray(q.answers) || q.answers.length < 2 || !unique(q.answers)
          || q.answers.some((i) => !Number.isInteger(i) || i < 0 || i >= q.options.length)) say(`${where}: bad answers`);
        else if (q.answers.length === q.options.length) say(`${where}: every option is right, nothing to think about`);
        break;
      case "text":
        if (!Array.isArray(q.accept) || q.accept.length === 0 || q.accept.some((a) => !fold(a))) say(`${where}: needs accepted answers`);
        break;
      case "code":
        if (!/^\d{1,6}$/.test(q.answer ?? "")) say(`${where}: code must be 1–6 digits`);
        break;
      case "order": {
        const keys = (q.items ?? []).map((i) => i.key);
        if (keys.length < 3 || !unique(keys)) say(`${where}: needs 3+ items with unique keys`);
        if (!Array.isArray(q.answer) || q.answer.length !== keys.length || !q.answer.every((k) => keys.includes(k)) || !unique(q.answer)) {
          say(`${where}: answer must be a permutation of the item keys`);
        }
        break;
      }
      case "match":
        if (!Array.isArray(q.pairs) || q.pairs.length < 3) say(`${where}: needs 3+ pairs`);
        else if (!unique(q.pairs.map((p) => fold(p[0]))) || !unique(q.pairs.map((p) => fold(p[1])))) say(`${where}: pair texts repeat`);
        break;
      default:
        break;
    }
    try {
      if (!checkAnswer(q, solutionOf(q)).ok) say(`${where}: its own solution is marked wrong`);
    } catch (error) {
      say(`${where}: checking the solution threw ${error.message}`);
    }
  }

  const word = city.final?.word ?? "";
  if (!/^[A-Z]{3,10}$/.test(word)) say("final word must be 3–10 capital letters");
  const letters = quests.map((q) => q.reward).sort().join("");
  if (letters !== [...word].sort().join("")) say(`quest letters ${letters} do not spell ${word}`);
  if (!city.final?.prompt?.trim()) say("final lock needs a prompt");
  return problems;
}

export function validateAll(cities) {
  const problems = cities.flatMap(validateCity);
  const ids = cities.map((c) => c.id);
  if (!unique(ids)) problems.push("city ids repeat");
  return problems;
}
