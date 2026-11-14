# 04 · Testing

`npm test` runs `node --test`: 55 tests in under a second, no dependencies.

| Suite | What it proves |
|-------|----------------|
| `text.test.js` | Folding (accents, đ, case, punctuation), squash, seeded shuffle, scramble never returns the answer, mm:ss |
| `quests.test.js` | Each of the six types: right, wrong, junk input, partial counts; canonical solutions are right |
| `run.test.js` | Letters given once, wrong-answer and hint penalties, hints in order and paid once, door rules, folding at the door, clock stops at escape, timeout (including through penalties alone), stars, summary, no mutation, every city escapable with ★★★ |
| `content.test.js` | Validator passes on every city; 3 cities north to south; 5–6 quests that spell the city; at least 5 puzzle types per room and all 6 across the game; distractors really wrong; difficulty climbs; the validator catches 9 kinds of mistake |
| `puzzles.test.js` | Every puzzle in the game solved by clicking its widget for 3 shuffles; every card renders well-formed markup; no empty submits; order and match never open solved; dials wrap; arrows stop at the ends; match select and unpair behaviour; typed text escaped |
| `art.test.js` | Rooms ⇄ cities; every room is well-formed with unique, prefixed ids and no broken `url(#…)`; one object per quest plus one door, keyboard-reachable; escape scenes; rooms differ; map well-formed, every pin on land and on the map, islands offshore |
| `progress.test.js` | Escapes and timeouts recorded; stars and best time only improve; junk saves cleaned; titles |

## Browser playthrough

Headless Edge over the DevTools protocol, driven only through clicks on the real UI. The
`?debug` hook `window.__er` was used for the Đà Nẵng shortcut and the clock skip.

| Step | Result |
|------|--------|
| Home: map, pins, city cards; a coming-soon pin shows a toast | ✅ |
| Hà Nội: choice (one wrong answer, −15 s), order with arrows, text "ho hoan kiem" after a hint, code dials 8-2, match | ✅ letters N O H I A |
| Door: wrong word NIOAH (−20 s), then HANOI | ✅ escaped, ★★★, best time saved |
| "Tới Đà Nẵng" from the result card → room, select-all card, solve, DANANG → dragon fire | ✅ |
| TP. HCM: match card, pause and resume, clock forced to zero | ✅ timeout card, clock 00:00 |
| Phone 390 × 844: home, room with notebook below, puzzle as a bottom sheet | ✅ |
| Reload: stars kept, "Chơi tiếp" offered for the unfinished room | ✅ |
| Console errors | none |

## Bugs the playthrough found

| Bug | Fix |
|-----|-----|
| The first dish in a match puzzle starts selected; tapping it deselected it, so the pair silently failed | Tapping a dish always selects it (now covered by a unit test) |
| The resume banner showed as an empty bar (CSS `display:flex` beat `hidden`) | `.resume[hidden] { display: none }` |
| After a timeout the clock still showed the last second | The clock is redrawn before the timeout card opens |
| The Đà Nẵng dragon's fire was cut off by the window edge | Dragon moved and narrowed to sit inside the glass |
| Đà Nẵng and Hội An pins fell in the sea | Coastline points near Đà Nẵng corrected; a test now checks every pin is on land |
