# Changelog

All notable changes to Mật Thất Ba Miền are listed here. Versions follow
[Semantic Versioning](https://semver.org/); `-beta.N` marks a pre-release.

## [1.1.0-beta.1] — 2026-11-24 (pre-release)

Pre-release for playtesting the new 2.5D rooms before 1.1.0 goes final.

### Added
- **2.5D rooms in real CSS 3D space:** each room is split into depth layers (window view,
  wall, furniture, near props with soft focus).
- **Parallax camera** that follows the mouse or the phone's tilt, glides in when a room
  opens, dollies toward an object before its puzzle, and swings the door open on escape.
- Camera and art tests (`tests/camera.test.js`, extended `tests/art.test.js`).

### Changed
- Redrawn Hà Nội, Đà Nẵng and TP. Hồ Chí Minh rooms for the layered layout.
- UI polish across menus and the room view.
- README and design/testing docs updated for the 3D rooms.

### Known issues / please test
- Phone tilt needs a real device (iOS asks for motion permission on first tap).
- Check performance of the 3D rooms on low-end phones.

## [1.0.0] — 2026-11-14

First public release: three city rooms (Hà Nội, Đà Nẵng, TP. Hồ Chí Minh), six puzzle
types, countdown clock, hints, letter collection and final word at the door, illustrated
map of Việt Nam, synthesised sound, GitHub Pages deploy.
