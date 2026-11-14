# 01 · Spec

## Goal

An escape-room quiz game for the web that looks like a real illustrated room rather than a
quiz form. It starts with three cities, Hà Nội, Đà Nẵng and TP. Hồ Chí Minh, each with about
five quests. It must be easy to add more cities in later versions.

## Game loop

1. On the home screen, pick a city on the map or from the list.
2. A briefing card tells the story, the number of puzzles, the time limit and the penalties.
3. In the room, find the sparkling objects. Each one opens a puzzle card.
4. A right answer gives one letter and a short fact. A wrong answer costs time.
5. Once every letter is collected, go to the door and arrange the letters into the city's name.
6. The door opens with the city's own escape scene, then the result card shows stars, time,
   hints, mistakes and penalties.

## Requirements

| # | Requirement |
|---|-------------|
| R1 | Hà Nội, Đà Nẵng and TP. Hồ Chí Minh are playable; other cities show as "coming soon" on the map |
| R2 | About 5 quests per room (5–6), with at least 5 different puzzle types in each room |
| R3 | Accurate content about each city, with a fact shown after each solve |
| R4 | A countdown clock; time penalties for wrong answers, hints and wrong door words; 1–3 stars |
| R5 | Every room is a drawn scene with clickable objects; there is also a notebook list for accessibility and phones |
| R6 | Works with mouse, touch and keyboard; layout adapts to phones |
| R7 | Progress and an unfinished room survive a reload |
| R8 | Adding a city needs only a content file and an artwork file, checked automatically by the tests |
| R9 | No dependencies, no build step; deployable as static files |
