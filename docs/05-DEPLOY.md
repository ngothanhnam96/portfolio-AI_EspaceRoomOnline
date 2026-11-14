# 05 · Deploy

- **GitHub Pages:** `.github/workflows/pages.yml` runs the tests on every push to `main`, then
  publishes `index.html`, `styles.css`, `favicon.svg` and `src/`.
- **CI:** `.github/workflows/ci.yml` syntax-checks every file and runs the tests on Node 20,
  22 and 24.
- **Local:** `npm start` serves on http://127.0.0.1:5173 (set `PORT` to change it). ES modules
  do not load from `file://`.
- **Debug:** add `?debug` to the URL to get `window.__er` (`run`, `city`, `progress`,
  `solve(id)`, `skip(seconds)`).
- **Analytics:** `src/ui/analytics.js` uses GoatCounter (no cookies). It stays off until
  `GOATCOUNTER_CODE` is set. Events recorded: `room/start-<city>`, `room/escape-<city>`,
  `room/timeout-<city>`.
