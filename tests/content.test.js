import test from "node:test";
import assert from "node:assert/strict";
import { CITIES, UPCOMING, cityById } from "../src/content/cities.js";
import { checkAnswer } from "../src/core/quests.js";
import { validateAll, validateCity } from "../src/core/validate.js";

test("every city passes the content validator", () => {
  assert.deepEqual(validateAll(CITIES), []);
});

test("the three launch cities are there, north to south", () => {
  assert.deepEqual(CITIES.map((c) => c.id), ["hanoi", "danang", "hcm"]);
  assert.deepEqual(CITIES.map((c) => c.region), ["Miền Bắc", "Miền Trung", "Miền Nam"]);
  assert.ok(CITIES[0].map.lat > CITIES[1].map.lat && CITIES[1].map.lat > CITIES[2].map.lat);
  assert.equal(cityById("hue"), null, "upcoming cities are not playable yet");
  assert.ok(UPCOMING.length >= 3);
  for (const c of UPCOMING) assert.ok(!CITIES.some((p) => p.id === c.id), `${c.id} is listed twice`);
});

test("each room has about five quests and its letters spell the city", () => {
  for (const city of CITIES) {
    assert.ok(city.quests.length >= 5 && city.quests.length <= 6, `${city.id}: ${city.quests.length} quests`);
    assert.equal([...city.quests.map((q) => q.reward)].sort().join(""), [...city.final.word].sort().join(""));
  }
  assert.deepEqual(CITIES.map((c) => c.final.word), ["HANOI", "DANANG", "SAIGON"]);
});

test("each room mixes puzzle types instead of repeating one", () => {
  for (const city of CITIES) {
    const types = new Set(city.quests.map((q) => q.type));
    assert.ok(types.size >= 5, `${city.id}: only ${types.size} kinds of puzzle`);
  }
  const all = new Set(CITIES.flatMap((c) => c.quests.map((q) => q.type)));
  assert.equal(all.size, 6, "the game uses all six puzzle types");
});

test("distractors are really wrong: no other option of a choice puzzle is accepted", () => {
  for (const city of CITIES) {
    for (const q of city.quests.filter((x) => x.type === "choice")) {
      q.options.forEach((_, i) => assert.equal(checkAnswer(q, i).ok, i === q.answer, `${city.id}/${q.id} option ${i}`));
    }
    for (const q of city.quests.filter((x) => x.type === "multi")) {
      const wrongOnes = q.options.map((_, i) => i).filter((i) => !q.answers.includes(i));
      assert.ok(wrongOnes.length >= 2, `${city.id}/${q.id}: needs real distractors`);
      assert.ok(!checkAnswer(q, [...q.answers, wrongOnes[0]]).ok);
    }
  }
});

test("a later city is a little harder and a little longer", () => {
  assert.ok(cityById("hanoi").timeLimit <= cityById("danang").timeLimit);
  assert.ok(cityById("hanoi").difficulty < cityById("hcm").difficulty);
});

test("hints never just print the answer word for word", () => {
  for (const city of CITIES) {
    for (const q of city.quests.filter((x) => x.type === "text")) {
      for (const hint of q.hints) {
        assert.ok(!q.accept.some((a) => hint.toLowerCase() === a.toLowerCase()), `${city.id}/${q.id}`);
      }
    }
  }
});

test("the validator catches the mistakes a content writer is likely to make", () => {
  const base = cityById("hanoi");
  const broken = (patch) => validateCity({ ...base, ...patch(structuredClone(base)) });
  assert.match(broken((c) => ({ quests: c.quests.slice(0, 2) })).join(), /quests; a room needs 4–7/);
  assert.match(broken((c) => { c.quests[0].answer = 9; return { quests: c.quests }; }).join(), /answer out of range/);
  assert.match(broken((c) => { c.quests[1].answer = ["motcot", "motcot", "longbien", "nhahat"]; return { quests: c.quests }; }).join(), /permutation/);
  assert.match(broken((c) => { c.quests[3].answer = "8x"; return { quests: c.quests }; }).join(), /digits/);
  assert.match(broken((c) => { c.quests[0].reward = "Z"; return { quests: c.quests }; }).join(), /do not spell/);
  assert.match(broken((c) => { c.quests[0].hints = ["one"]; return { quests: c.quests }; }).join(), /2 hints/);
  assert.match(broken(() => ({ map: { lon: 120, lat: 30 } })).join(), /outside/);
  assert.match(broken((c) => { c.quests[1].id = c.quests[0].id; return { quests: c.quests }; }).join(), /ids repeat/);
  assert.match(validateAll([base, base]).join(), /city ids repeat/);
});
