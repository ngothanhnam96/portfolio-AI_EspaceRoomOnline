# 06 · Adding a city

Example: Huế, already on the map as a coming-soon pin.

## 1. Content: `src/content/hue.js`

Copy `hanoi.js` and change:

- `id` (lower-case, e.g. `"hue"`), `name`, `region`, `room`, `tagline`, `story`, `outro`.
- `timeLimit` in seconds. About 3 minutes per quest works well.
- `map: { lon, lat, label }`. `label` is `"left"` or `"right"` to keep the pin's name clear
  of neighbouring pins.
- `theme: { accent, glow }` — the city's colour for pins, cards and buttons.
- `final.word`: 3–10 capital letters without diacritics, e.g. `"HUONG"` for sông Hương
  (a 3-letter `"HUE"` would only allow 3 quests). Each quest's `reward` is one letter of it;
  together the rewards must use every letter exactly once.
- `quests`: 5–6 entries, mixing at least five puzzle types. Each quest needs exactly 2 hints,
  going from gentle to almost the answer, and a `fact` shown after it is solved.

Check facts carefully: the game teaches them.

## 2. Artwork: `src/ui/rooms/hue.js`

Copy one of the existing rooms and pick a new id prefix, e.g. `const P = "hu";`:

- Wrap each object that holds a quest in `hot("<quest id>", "<label>", art, [badgeX, badgeY])`.
- Wrap the exit in `door(label, art, [sparkX, sparkY])`. Inside it you need:
  - A `door-light` rect behind the door.
  - A `door-leaf` group that will swing open.
  - Optionally a `door-dark` rect that fades out.
- Put the city's escape scene in a group with `class="celebrate"`. It is hidden until the
  door opens.
- Every `id=` must start with the prefix.

## 3. Register it

- `src/content/cities.js`: import the city, add it to `CITIES` (north to south) and remove it
  from `UPCOMING`.
- `src/ui/rooms/index.js`: add the artwork to `ROOMS`.

## 4. Run the tests

`npm test` checks that:

- The content is valid: answers are in range, orders are permutations, codes are digits,
  there are 2 hints each, the letters spell the word, and the pin is on land.
- Every puzzle can be solved by clicking and the room can be escaped with ★★★.
- The artwork has exactly one object per quest plus a door, unique prefixed ids, no broken
  gradient references, and an escape scene.

Then run `npm start` and play the room once in the browser.
