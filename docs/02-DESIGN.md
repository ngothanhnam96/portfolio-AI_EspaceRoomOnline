# 02 · Design

## Architecture

```
src/content/        what the player reads: one file per city + the registry
  hanoi.js  danang.js  hcm.js  cities.js
src/core/           pure logic: no DOM, deterministic, fully tested
  quests.js     the six puzzle types: checkAnswer, solutionOf
  run.js        one attempt at a room: answers, hints, penalties, clock, door, stars
  validate.js   content validator used by the tests
  progress.js   saved stars, best times, titles
  text.js       Vietnamese-friendly matching (fold), seeded shuffles, mm:ss
src/ui/
  rooms/        one SVG room per city + shared kit (hotspots, defs, floors, books…)
  map.js        Việt Nam outline, islands, city pins, point-in-polygon check
  puzzles.js    puzzle widgets as pure "draft" state + HTML (testable in Node)
  audio.js      synthesised sounds
src/main.js     screens, clock loop, modals, door lock, saving
```

## The puzzle model

A quest is plain data:

```js
{ id, object, title, type, prompt, hints: [2], reward: "N", fact, ...type fields }
```

| Type | Data | What counts as right |
|------|------|----------------------|
| `choice` | `options`, `answer` (index) | That index |
| `multi` | `options`, `answers` (indexes) | Exactly that set, in any order |
| `text` | `accept` (aliases) | Any alias after folding (accents, đ, case, spaces and punctuation ignored) |
| `code` | `answer` (digit string) | Exact digits, leading zeros included |
| `order` | `items` [{key,label}], `answer` (keys) | Exact sequence; partial count returned |
| `match` | `pairs` [[left,right]] | Every left card paired with its own right card, one to one; partial count returned |

The widgets keep a **draft**: a picked option, toggled chips, typed text, dial digits, the
current order, or the pairs so far. Each click goes through `act()`, which returns a new draft.
`draftAnswer()` turns the draft into the shape `checkAnswer()` expects. Because no DOM is
involved, the tests can click through every puzzle in the game.

## A run

`createRun(city, now)` gives an immutable state. Each function takes the time explicitly, so
the clock can be replayed:

- **Time:** `elapsed = (now − startedAt) / 1000 + penalty`.
- **Pause:** pausing moves `startedAt` forward by the time spent paused. A saved run does the
  same with the time the player was away.
- **`attempt()`:** marks the answer. A right answer appends the quest's letter (once). A wrong
  answer adds a 15 s penalty.
- **`takeHint()`:** opens the next hint for 45 s. Hints already opened are shown again for free.
- **`tryDoor()`:** works only when every quest is solved. The word is folded, so `hà nội` opens
  `HANOI`. A wrong word adds 20 s.
- **Stars:** based on the share of the clock left after penalties: ≥ 50% gives ★★★, ≥ 25%
  gives ★★, anything else gives ★.

The door shows the letters scrambled, and never already in the right order.

## Rooms

Each room is one SVG in a 1600 × 900 box, built from strings:

- **Clickable objects:** `hot(id, label, art, badgeAt)` wraps an object that holds a quest. It
  makes the object focusable (`tabindex`, `role="button"`, `aria-label`), adds the sparkle
  that shows until it is solved, and adds the green tick shown once it is.
- **The door:** `door()` wraps the exit. It contains a `door-leaf` that swings or folds open, a
  `door-light` behind it, and a `celebrate` layer for the city's escape scene.
- **Unique ids:** all gradient and filter ids carry the room's prefix (`hn-`, `dn-`, `sg-`), so
  they never clash with each other or with the map.
- **Animation:** CSS animates the ambient details: twinkling stars, the ceiling fan, coffee
  steam, river ripples and a blinking aviation light.

| Room | Window | Details |
|------|--------|---------|
| Hà Nội | Dusk over Hồ Gươm: Tháp Rùa with reflection, red Thê Húc bridge, street lights | Ochre walls, louvred green shutters, Bát Tràng-red tiles, calligraphy scroll, chalk menu |
| Đà Nẵng | Night: golden Dragon Bridge over the Hàn, Sơn Trà ridge, coloured reflections | Hotel door 1013 with keypad and a do-not-disturb hanger, marble-mountain model, room-service cart |
| TP. HCM | Sunset: Landmark 81, Bitexco with helipad, Saigon River, iron balcony railing | Gạch bông tiles, radio, cork board, phin coffee, red plastic stool, folding iron gate |

## Map

The mainland outline is a ~70-point polygon in real longitude/latitude, projected at 34 px per
degree. The map also shows:

- The Hoàng Sa and Trường Sa archipelagos and Phú Quốc.
- A pin for each playable city, using its theme colour, pulsing and showing its stars.
- Coming-soon pins in grey.

`onMainland()` (ray casting) lets the tests check that every pin is on land.

## UX notes

- **Two ways to every puzzle:** click the object in the picture, or use its entry in the
  notebook. Small objects on a phone are never a blocker.
- **Feedback:**
  - The puzzle card shakes on a wrong answer.
  - Order and match puzzles show partial counts.
  - The clock turns amber under 2 minutes and red with a ticking sound under 30 seconds.
- **Helping the player along:**
  - "Soi đèn" highlights unsolved objects for 2.6 s.
  - The door button pulses once every letter is collected.
  - A toast says "Đủ chữ rồi!".
- **Accessibility:**
  - Full keyboard play: Tab and Enter, digits for number locks, letters and Backspace for the
    door, Esc to close.
  - Reduced-motion users get no animation.
