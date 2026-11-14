# 🗝️ Mật Thất Ba Miền — Escape Room

An illustrated escape-room quiz game for the browser, set in three Vietnamese cities. You are
locked in a room. Every object that sparkles hides a puzzle about the city, and every solved
puzzle gives you one letter. Collect all the letters, arrange them into the city's name at the
door, and get out before the clock reaches 00:00.

Zero dependencies, no build step, no image files. Every room, the map of Việt Nam and every
object are drawn in SVG from code, and the sound is synthesised with WebAudio.

## The rooms

| City | Room | Quests | Clock | Final word |
|------|------|--------|-------|------------|
| 🏮 Hà Nội | Căn Gác Phố Cổ: an Old Quarter attic with green shutters open on Hồ Gươm, Tháp Rùa and the red Thê Húc bridge | 5 | 15 min | HANOI |
| 🐉 Đà Nẵng | Phòng 1013 Bên Sông Hàn: a hotel room at night facing the golden Dragon Bridge, which breathes fire when you escape | 6 | 18 min | DANANG |
| 🛵 TP. Hồ Chí Minh | Căn Hộ Chung Cư Cũ: gạch bông floor, phin coffee, a red plastic stool, a balcony on Landmark 81 and Bitexco, and a folding iron gate as the door | 6 | 18 min | SAIGON |

Six coming-soon pins (Sa Pa, Hạ Long, Huế, Hội An, Đà Lạt, Cần Thơ) are already on the map.
Adding a city takes two files, see [docs/06-ADD-A-CITY.md](docs/06-ADD-A-CITY.md).

## Features

- **Six puzzle types:** multiple choice, select-all, typed answer (accents optional), number
  lock with dials, put in order, and matching pairs. Each room uses at least five of them.
- **Real content:** history, landmarks and food of each city. Every solved puzzle shows a short
  "Có thể bạn chưa biết" fact.
- **Escape-room rules:**
  - Countdown clock.
  - A wrong answer costs 15 s, a hint 45 s, and a wrong word at the door 20 s.
  - Order and match puzzles tell you how many items are already in place ("2/4 đúng").
  - Stars: ★★★ if you escape with half the time left, ★★ with a quarter left, ★ if you just
    make it.
- **Made to be explored:**
  - Objects glow on hover and sparkle until solved, then show a green tick.
  - "Soi đèn" lights up every object you have not solved yet.
  - The notebook lists every object, so nothing has to be found by pixel-hunting.
  - Each room has its own escape scene: lanterns rise over Hồ Gươm, the dragon breathes fire,
    fireworks go up over Sài Gòn.
- **Home screen:**
  - A stylised map of Việt Nam with Hoàng Sa, Trường Sa and Phú Quốc.
  - Pulsing city pins that show your stars.
  - Titles from Khách Lạ up to Huyền Thoại Ba Miền.
- **Phones and keyboards:**
  - On a phone, the room sits on top with the notebook below, and puzzles open as bottom
    sheets.
  - Every object can be reached with Tab and opened with Enter.
  - You can type digits into a number lock and letters into the door lock.
- **Saving:** stars and best times are saved. Leaving or reloading mid-room saves the room, and
  the home screen offers "Chơi tiếp" with the clock paused while you were away.

## Run it

```bash
npm start    # http://127.0.0.1:5173
npm test     # 55 tests, under a second, no dependencies
```

## What the tests prove

- **Every city can be escaped with three stars**, and every puzzle can be solved by clicking
  through its widget whatever the shuffle.
- **The content validator** passes on every city and catches the usual mistakes:
  - Wrong answer index.
  - Order answer that is not a permutation of the items.
  - Non-digit codes.
  - Letters that do not spell the final word.
  - Missing hints.
  - Repeated ids.
  - A city placed outside Việt Nam.
- **Distractors are wrong:** no other option of a choice puzzle is accepted, and select-all
  puzzles have real decoys.
- **Rules:**
  - Penalties, hints (in order, paid once).
  - A door that opens only with every letter, and never shows the answer pre-arranged.
  - Clock stops on escape.
  - Timeout, including running out through penalties alone.
  - Stars and summary totals.
  - Runs are never mutated in place.
- **Artwork:**
  - Every room is well-formed SVG with unique, prefixed ids, and every `url(#…)` points to a
    real gradient.
  - Exactly one object per quest plus one door, all keyboard-reachable.
  - Every room has its escape scene.
  - Every map pin stands on the mainland, and the islands are offshore.
- **Safety:** typed answers are escaped in the markup.

## Docs

| | |
|---|---|
| [01-SPEC](docs/01-SPEC.md) | Goal, game loop, requirements |
| [02-DESIGN](docs/02-DESIGN.md) | Architecture, puzzle model, rooms, map, UX |
| [03-TASKS](docs/03-TASKS.md) | What was built, what comes next |
| [04-TESTING](docs/04-TESTING.md) | Test suites and the browser playthrough |
| [05-DEPLOY](docs/05-DEPLOY.md) | GitHub Pages, analytics |
| [06-ADD-A-CITY](docs/06-ADD-A-CITY.md) | How to add Huế, Hội An, … |

## Licence

MIT — see [LICENSE](LICENSE).
