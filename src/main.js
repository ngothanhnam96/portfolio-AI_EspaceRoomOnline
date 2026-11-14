// Mật Thất Ba Miền — screens, the clock, puzzles, the door, results.

import { CITIES, UPCOMING, cityById } from "./content/cities.js";
import { recordResult, restoreProgress, titleOf, totalStars } from "./core/progress.js";
import { solutionOf } from "./core/quests.js";
import {
  PENALTY, attempt, createRun, doorReady, doorTiles, hintsShown, isSolved, questById,
  remaining, solvedCount, summary, takeHint, tick, tryDoor,
} from "./core/run.js";
import { clock } from "./core/text.js";
import { initAnalytics, track } from "./ui/analytics.js";
import { createAudio } from "./ui/audio.js";
import { mapSVG } from "./ui/map.js";
import { PAIR_COLORS, TYPE_LABEL, act, draftAnswer, newDraft, puzzleHTML, ready } from "./ui/puzzles.js";
import { esc } from "./ui/rooms/kit.js";
import { roomSVG } from "./ui/rooms/index.js";
import { load, save } from "./ui/storage.js";

const $ = (id) => document.getElementById(id);
const audio = createAudio();
const ids = CITIES.map((c) => c.id);

let progress = restoreProgress(load("progress", null), ids);
let city = null;
let run = null;
let pausedAt = null;
let quest = null;          // the quest whose card is open
let draft = null;
let feedback = null;       // { kind: "wrong"|"close", text }
let tiles = null;          // door lock: { pool: [{ch, used}], slots: [index] }
let lastWholeSecond = null;

/* ----------------------------------------------------------------- helpers */

const now = () => Date.now();

function show(screen) {
  document.body.dataset.screen = screen;
}

function toast(text, ms = 2400) {
  const el = $("toast");
  el.textContent = text;
  el.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { el.hidden = true; }, ms);
}

function openModal(html, kind) {
  $("sheet").innerHTML = html;
  $("sheet").dataset.kind = kind;
  $("modal").hidden = false;
  const focus = $("sheet").querySelector("[autofocus], input, .btn.primary, button");
  focus?.focus({ preventScroll: true });
}

function closeModal() {
  $("modal").hidden = true;
  $("sheet").innerHTML = "";
  quest = null;
  draft = null;
  feedback = null;
  tiles = null;
}

function stars(n) {
  return [0, 1, 2].map((i) => `<span class="${i < n ? "on" : ""}">★</span>`).join("");
}

function persistRun() {
  if (run && city && run.status === "playing") save("current", { cityId: city.id, run, savedAt: now() });
  else save("current", null);
}

/* -------------------------------------------------------------------- home */

function renderHome() {
  const title = titleOf(progress, CITIES.length);
  $("title-strip").innerHTML = `<span class="title-icon">${title.icon}</span><b>${esc(title.name)}</b>
    <span class="dot">•</span><span>${totalStars(progress)}/${CITIES.length * 3} ★</span>
    <span class="dot">•</span><span>${progress.escapes} lần thoát</span>`;

  $("city-list").innerHTML = CITIES.map((c, i) => {
    const mine = progress.cities[c.id];
    return `<li><button class="city-card" data-city="${c.id}" style="--accent:${c.theme.accent}">
      <span class="city-no">0${i + 1}</span>
      <span class="city-main">
        <span class="city-region">${esc(c.region)}</span>
        <b>${esc(c.name)}</b>
        <span class="city-room">${esc(c.room)}</span>
      </span>
      <span class="city-meta">
        <span class="city-stars">${stars(mine?.stars ?? 0)}</span>
        <span>${c.quests.length} câu đố · ${Math.round(c.timeLimit / 60)} phút</span>
        <span>${mine?.best ? `Kỷ lục ${clock(mine.best)}` : "Chưa thoát"}</span>
      </span>
    </button></li>`;
  }).join("");

  $("map").innerHTML = mapSVG(CITIES, UPCOMING, progress);

  const saved = load("current", null);
  const savedCity = saved && cityById(saved.cityId);
  if (savedCity && saved.run?.status === "playing") {
    $("resume").hidden = false;
    $("resume").innerHTML = `<span>⏳ Bạn đang dở phòng <b>${esc(savedCity.room)}</b> (${esc(savedCity.name)}) — ${solvedCount(saved.run)}/${savedCity.quests.length} câu đố.</span>
      <button class="btn small primary" id="resume-btn">Chơi tiếp</button>`;
  } else {
    $("resume").hidden = true;
  }
}

function openBrief(c) {
  audio.open();
  const mine = progress.cities[c.id];
  openModal(`
    <div class="brief" style="--accent:${c.theme.accent}">
      <p class="eyebrow">${esc(c.region)} · ${esc(c.name)}</p>
      <h2>${esc(c.room)}</h2>
      <p class="story">${esc(c.story)}</p>
      <div class="rules">
        <span>🧩 ${c.quests.length} câu đố</span>
        <span>⏳ ${Math.round(c.timeLimit / 60)} phút</span>
        <span>💡 Gợi ý −${PENALTY.hint}s</span>
        <span>✖ Sai −${PENALTY.wrong}s</span>
      </div>
      ${mine?.best ? `<p class="best">Kỷ lục của bạn: <b>${clock(mine.best)}</b> ${stars(mine.stars)}</p>` : ""}
      <div class="row">
        <button class="btn ghost" data-close>Để sau</button>
        <button class="btn primary" data-enter="${c.id}" autofocus>🔑 Vào phòng</button>
      </div>
    </div>`, "brief");
}

/* -------------------------------------------------------------------- room */

function enterRoom(c, resumeFrom = null) {
  city = c;
  if (resumeFrom) {
    run = { ...resumeFrom.run, startedAt: resumeFrom.run.startedAt + Math.max(0, now() - resumeFrom.savedAt) };
  } else {
    run = createRun(c, now(), (Date.now() % 100000) + 1);
    track(`room/start-${c.id}`);
  }
  pausedAt = null;
  lastWholeSecond = null;
  closeModal();
  $("room-city").textContent = c.name;
  $("room-name").textContent = c.room;
  $("screen-room").style.setProperty("--accent", c.theme.accent);
  $("stage").innerHTML = roomSVG(c.id);
  $("stage").classList.remove("escaped", "torch");
  $("confetti").innerHTML = "";
  show("room");
  audio.unlock();
  renderRoom();
  persistRun();
}

function renderRoom() {
  if (!city || !run) return;
  const solved = solvedCount(run);
  $("progress-text").textContent = `${solved}/${city.quests.length}`;
  for (const node of $("stage").querySelectorAll(".hot[data-quest]")) {
    node.classList.toggle("solved", isSolved(run, node.dataset.quest));
  }
  $("stage").querySelector(".door")?.classList.toggle("ready", doorReady(run, city));

  $("clues").innerHTML = city.quests.map((q) => {
    const done = isSolved(run, q.id);
    return `<li><button class="clue${done ? " done" : ""}" data-open="${q.id}">
      <span class="clue-mark">${done ? "✓" : "?"}</span>
      <span class="clue-text"><b>${esc(done ? q.title : q.object)}</b><small>${done ? `Chữ «${q.reward}»` : TYPE_LABEL[q.type]}</small></span>
    </button></li>`;
  }).join("");

  const slots = city.final.word.length;
  $("letters").innerHTML = Array.from({ length: slots }, (_, i) => {
    const ch = run.letters[i];
    return `<span class="letter${ch ? " got" : ""}">${ch ?? ""}</span>`;
  }).join("");
  const readyNow = doorReady(run, city);
  $("door-btn").classList.toggle("ready", readyNow);
  $("door-btn").textContent = readyNow ? "🚪 Mở cửa!" : `🔒 Cửa khóa (${solved}/${city.quests.length})`;
  updateClock();
}

function updateClock() {
  if (!city || !run) return;
  const left = remaining(run, city, pausedAt ?? now());
  $("timer-text").textContent = clock(left);
  $("timer").classList.toggle("warn", left <= 120);
  $("timer").classList.toggle("danger", left <= 30);
  const whole = Math.ceil(left);
  if (left <= 30 && run.status === "playing" && pausedAt === null && whole !== lastWholeSecond) audio.tick();
  lastWholeSecond = whole;
}

function loop() {
  if (city && run && run.status === "playing" && pausedAt === null) {
    run = tick(run, city, now());
    updateClock();
    if (run.status === "timeout") timeUp();
  }
}

function pause() {
  if (!run || run.status !== "playing" || pausedAt !== null) return;
  pausedAt = now();
  persistRun();
  openModal(`
    <div class="pause">
      <h2>Tạm dừng</h2>
      <p>Đồng hồ đã dừng. Còn <b>${clock(remaining(run, city, pausedAt))}</b>, đã giải ${solvedCount(run)}/${city.quests.length} câu đố.</p>
      <div class="col">
        <button class="btn primary" data-resume autofocus>▶ Chơi tiếp</button>
        <button class="btn" data-restart>↻ Chơi lại từ đầu</button>
        <button class="btn ghost" data-home>🗺️ Về bản đồ (lưu tiến độ)</button>
      </div>
    </div>`, "pause");
}

function resume() {
  if (pausedAt !== null) {
    run = { ...run, startedAt: run.startedAt + (now() - pausedAt) };
    pausedAt = null;
  }
  closeModal();
  renderRoom();
}

/* ------------------------------------------------------------------ quests */

function openQuest(id) {
  if (!run || run.status !== "playing") return;
  const q = questById(city, id);
  audio.open();
  if (isSolved(run, id)) {
    openModal(solvedCard(q, false), "solved");
    return;
  }
  quest = q;
  draft = newDraft(q, run.seed + id.length * 31);
  feedback = null;
  drawQuest();
}

function drawQuest() {
  const q = quest;
  const hints = hintsShown(run, city, q.id);
  const more = hints.length < q.hints.length;
  const html = `
    <div class="quest" style="--accent:${city.theme.accent}">
      <header class="quest-head">
        <span class="type-badge">${TYPE_LABEL[q.type]}</span>
        <p class="eyebrow">${esc(q.object)}</p>
        <h2>${esc(q.title)}</h2>
      </header>
      <p class="prompt">${esc(q.prompt)}</p>
      <div class="puzzle" id="puzzle">${puzzleHTML(q, draft)}</div>
      ${hints.length ? `<ul class="hints">${hints.map((h, i) => `<li><b>Gợi ý ${i + 1}:</b> ${esc(h)}</li>`).join("")}</ul>` : ""}
      <p class="feedback ${feedback?.kind ?? ""}" role="status">${feedback ? esc(feedback.text) : ""}</p>
      <footer class="quest-foot">
        <button class="btn ghost" data-close>Đóng</button>
        <button class="btn hint" data-hint ${more ? "" : "disabled"}>💡 ${more ? `Gợi ý (−${PENALTY.hint}s)` : "Hết gợi ý"}</button>
        <button class="btn primary" data-submit ${ready(q, draft) ? "" : "disabled"}>Trả lời</button>
      </footer>
    </div>`;
  const keepFocus = document.activeElement?.id === "text-input";
  openModal(html, "quest");
  if (keepFocus || q.type === "text") {
    const input = $("text-input");
    if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
  }
}

function refreshPuzzle() {
  $("puzzle").innerHTML = puzzleHTML(quest, draft);
  const submit = $("sheet").querySelector("[data-submit]");
  if (submit) submit.disabled = !ready(quest, draft);
}

function submitQuest() {
  if (!quest || !ready(quest, draft)) return;
  const result = attempt(run, city, quest.id, draftAnswer(quest, draft), now());
  run = result.run;
  persistRun();
  if (run.status === "timeout") { timeUp(); return; }
  if (result.ok) {
    audio.right();
    const solvedQuest = quest;
    renderRoom();
    openModal(solvedCard(solvedQuest, true), "solved");
    quest = null;
    if (doorReady(run, city)) setTimeout(() => toast("🚪 Đủ chữ rồi! Hãy ra mở cửa."), 600);
    return;
  }
  audio.wrong();
  if (result.total) {
    feedback = { kind: "close", text: `Chưa đúng — ${result.right}/${result.total} ở đúng chỗ. (−${PENALTY.wrong}s)` };
  } else {
    feedback = { kind: "wrong", text: `Chưa đúng rồi. Thử lại nhé! (−${PENALTY.wrong}s)` };
  }
  drawQuest();
  $("sheet").classList.remove("shake");
  void $("sheet").offsetWidth;
  $("sheet").classList.add("shake");
  updateClock();
}

function solvedCard(q, fresh) {
  return `
    <div class="solved" style="--accent:${city.theme.accent}">
      <div class="reward-tile ${fresh ? "pop" : ""}">${q.reward}</div>
      <p class="eyebrow">${fresh ? "Giải được rồi!" : "Đã giải"}</p>
      <h2>${esc(q.title)}</h2>
      <p class="reward-text">Bạn nhận được chữ <b>«${q.reward}»</b> cho ổ khóa.</p>
      <div class="fact"><span>📜 Có thể bạn chưa biết</span><p>${esc(q.fact)}</p></div>
      <div class="row"><button class="btn primary" data-close autofocus>Tiếp tục</button></div>
    </div>`;
}

function useHint() {
  if (!quest) return;
  const out = takeHint(run, city, quest.id, now());
  run = out.run;
  persistRun();
  if (run.status === "timeout") { timeUp(); return; }
  if (out.hint) audio.hint();
  feedback = null;
  drawQuest();
  updateClock();
}

/* -------------------------------------------------------------------- door */

function openDoor() {
  if (!run || run.status !== "playing") return;
  if (!doorReady(run, city)) {
    audio.wrong();
    const left = city.quests.length - solvedCount(run);
    openModal(`
      <div class="locked">
        <div class="big-icon">🔒</div>
        <h2>Cửa vẫn khóa</h2>
        <p>Ổ khóa chữ có <b>${city.final.word.length}</b> ô. Bạn còn thiếu <b>${left}</b> chữ cái — hãy giải nốt ${left} câu đố trong phòng.</p>
        <div class="row"><button class="btn primary" data-close autofocus>Tìm tiếp</button></div>
      </div>`, "locked");
    return;
  }
  audio.lock();
  const pool = doorTiles(run, city).map((ch) => ({ ch, used: false }));
  tiles = { pool, slots: [] };
  drawDoor();
}

function drawDoor(message = "") {
  const word = city.final.word;
  const html = `
    <div class="door-lock" style="--accent:${city.theme.accent}">
      <p class="eyebrow">Ổ khóa cuối cùng</p>
      <h2>Mở cánh cửa</h2>
      <p class="prompt">${esc(city.final.prompt)}</p>
      <div class="slots" aria-label="Ô chữ">${Array.from({ length: word.length }, (_, i) => {
        const t = tiles.slots[i];
        return `<button class="slot${t !== undefined ? " filled" : ""}" data-slot="${i}" aria-label="Ô ${i + 1}">${t !== undefined ? tiles.pool[t].ch : ""}</button>`;
      }).join("")}</div>
      <div class="tiles">${tiles.pool.map((t, i) => `<button class="tile${t.used ? " used" : ""}" data-tile="${i}" ${t.used ? "disabled" : ""}>${t.ch}</button>`).join("")}</div>
      <p class="feedback ${message ? "wrong" : ""}" role="status">${esc(message)}</p>
      <footer class="quest-foot">
        <button class="btn ghost" data-close>Đóng</button>
        <button class="btn" data-clear>Xếp lại</button>
        <button class="btn primary" data-unlock ${tiles.slots.length === word.length ? "" : "disabled"}>🔑 Mở khóa</button>
      </footer>
    </div>`;
  openModal(html, "door");
}

function placeTile(i) {
  const t = tiles.pool[i];
  if (!t || t.used || tiles.slots.length >= city.final.word.length) return;
  t.used = true;
  tiles.slots.push(i);
  audio.tile();
  drawDoor();
}

function removeSlot(i) {
  const index = tiles.slots[i];
  if (index === undefined) return;
  tiles.pool[index].used = false;
  tiles.slots.splice(i, 1);
  audio.tile();
  drawDoor();
}

function unlock() {
  const word = tiles.slots.map((i) => tiles.pool[i].ch).join("");
  const out = tryDoor(run, city, word, now());
  run = out.run;
  if (run.status === "timeout") { timeUp(); return; }
  if (!out.ok) {
    audio.wrong();
    tiles.pool.forEach((t) => { t.used = false; });
    tiles.slots = [];
    drawDoor(`«${word}» không đúng. Ổ khóa kêu cạch… (−${PENALTY.door}s)`);
    $("sheet").classList.add("shake");
    updateClock();
    persistRun();
    return;
  }
  escape();
}

function escape() {
  closeModal();
  persistRun();
  audio.door();
  $("stage").classList.add("escaped");
  burstConfetti();
  const result = summary(run, city);
  const out = recordResult(progress, city.id, { escaped: true, seconds: result.seconds, stars: result.stars });
  progress = out.progress;
  save("progress", progress);
  track(`room/escape-${city.id}`);
  setTimeout(() => showResult(true, result, out.newBest), 2600);
}

function timeUp() {
  closeModal();
  audio.lose();
  const result = summary(run, city);
  progress = recordResult(progress, city.id, { escaped: false, seconds: result.seconds, stars: 0 }).progress;
  save("progress", progress);
  persistRun();
  track(`room/timeout-${city.id}`);
  showResult(false, result, false);
}

function showResult(escaped, result, newBest) {
  const others = CITIES.filter((c) => c.id !== city.id);
  const next = others.find((c) => !(progress.cities[c.id]?.escapes > 0)) ?? others[0];
  openModal(`
    <div class="result ${escaped ? "win" : "lose"}" style="--accent:${city.theme.accent}">
      <p class="eyebrow">${esc(city.name)} · ${esc(city.room)}</p>
      <h2>${escaped ? "Thoát thành công!" : "Hết giờ!"}</h2>
      ${escaped ? `<div class="result-stars">${stars(result.stars)}</div>` : `<div class="big-icon">⌛</div>`}
      <p class="story">${escaped ? esc(city.outro) : `Bạn đã giải ${result.solved}/${result.total} câu đố. Cánh cửa vẫn đóng im lìm… Thử lại nhé!`}</p>
      <dl class="tally">
        <dt>Thời gian</dt><dd>${clock(result.seconds)}${newBest ? ' <span class="badge-new">Kỷ lục!</span>' : ""}</dd>
        <dt>Câu đố đã giải</dt><dd>${result.solved}/${result.total}</dd>
        <dt>Gợi ý đã dùng</dt><dd>${result.hints}</dd>
        <dt>Lần trả lời sai</dt><dd>${result.wrong}</dd>
        <dt>Thời gian bị phạt</dt><dd>+${Math.round(result.penalty)}s</dd>
      </dl>
      <div class="row">
        <button class="btn" data-restart>↻ Chơi lại</button>
        ${escaped && next ? `<button class="btn primary" data-brief="${next.id}">✈️ Tới ${esc(next.name)}</button>` : ""}
        <button class="btn ${escaped ? "ghost" : "primary"}" data-home>🗺️ Bản đồ</button>
      </div>
    </div>`, "result");
}

function burstConfetti() {
  const colors = ["#ffd166", "#ff6b9a", "#6fd3ff", "#9be36b", city.theme.accent];
  $("confetti").innerHTML = Array.from({ length: 70 }, (_, i) => {
    const left = (i * 37) % 100;
    const delay = ((i * 13) % 20) / 20;
    const dur = 1.8 + ((i * 7) % 10) / 10;
    return `<i style="left:${left}%;background:${colors[i % colors.length]};animation-delay:${delay}s;animation-duration:${dur}s;transform:rotate(${i * 29}deg)"></i>`;
  }).join("");
}

function torch() {
  $("stage").classList.add("torch");
  clearTimeout(torch.timer);
  torch.timer = setTimeout(() => $("stage").classList.remove("torch"), 2600);
}

function goHome() {
  closeModal();
  if (run && run.status === "playing") {
    if (pausedAt !== null) run = { ...run, startedAt: run.startedAt + (now() - pausedAt) };
    persistRun();
  }
  city = null;
  run = null;
  pausedAt = null;
  show("home");
  renderHome();
}

function howTo() {
  openModal(`
    <div class="howto">
      <h2>Cách chơi</h2>
      <ol>
        <li><b>Soi phòng.</b> Đồ vật lấp lánh ✦ là nơi giấu câu đố. Chạm vào nó (hoặc chọn trong Sổ tay).</li>
        <li><b>Giải đố.</b> Có 6 kiểu: trắc nghiệm, chọn tất cả, điền đáp án, khóa số, sắp xếp và ghép cặp.</li>
        <li><b>Gom chữ.</b> Mỗi câu đố đúng cho bạn một chữ cái.</li>
        <li><b>Mở cửa.</b> Đủ chữ thì ra cửa, xếp chữ thành mật mã để thoát.</li>
      </ol>
      <p class="small-note">Trả lời sai: −${PENALTY.wrong}s · Mở gợi ý: −${PENALTY.hint}s · Sai mật mã cửa: −${PENALTY.door}s.<br>
      Thoát khi còn ≥ 50% thời gian: ★★★ · ≥ 25%: ★★ · kịp giờ: ★.</p>
      <div class="row"><button class="btn primary" data-close autofocus>Đã hiểu</button></div>
    </div>`, "help");
}

/* ------------------------------------------------------------------ events */

document.addEventListener("click", (event) => {
  const target = event.target.closest("button, [data-city], [data-soon], .hot");
  if (!target) {
    if (event.target === $("modal") && $("sheet").dataset.kind !== "result" && $("sheet").dataset.kind !== "pause") closeModal();
    return;
  }
  const d = target.dataset;

  if (d.city && !target.closest(".room")) { audio.unlock(); const c = cityById(d.city); if (c) openBrief(c); return; }
  if (d.soon) { audio.click(); toast(`🚧 ${target.getAttribute("aria-label")} — đang xây phòng!`); return; }
  if (d.enter) { enterRoom(cityById(d.enter)); return; }
  if (d.brief) { goHome(); openBrief(cityById(d.brief)); return; }
  if (d.quest && target.classList.contains("hot")) { openQuest(d.quest); return; }
  if (d.door && target.classList.contains("hot")) { openDoor(); return; }
  if (d.open) { openQuest(d.open); return; }
  if ("close" in d) { audio.click(); closeModal(); return; }
  if ("resume" in d) { resume(); return; }
  if ("restart" in d) { const c = city; closeModal(); enterRoom(c); return; }
  if ("home" in d) { goHome(); return; }
  if ("submit" in d) { submitQuest(); return; }
  if ("hint" in d) { useHint(); return; }
  if ("unlock" in d) { unlock(); return; }
  if ("clear" in d) { tiles.pool.forEach((t) => { t.used = false; }); tiles.slots = []; drawDoor(); return; }
  if (d.tile !== undefined) { placeTile(Number(d.tile)); return; }
  if (d.slot !== undefined) { removeSlot(Number(d.slot)); return; }
  if (d.act && quest) {
    audio.click();
    draft = act(quest, draft, { act: d.act, i: d.i });
    feedback = null;
    if (quest.type === "choice") { submitQuest(); return; }
    refreshPuzzle();
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "text-input" && quest) {
    draft = act(quest, draft, { act: "type", value: event.target.value });
    const submit = $("sheet").querySelector("[data-submit]");
    if (submit) submit.disabled = !ready(quest, draft);
  }
});

document.addEventListener("keydown", (event) => {
  const modalOpen = !$("modal").hidden;
  if (event.key === "Escape" && modalOpen) {
    const kind = $("sheet").dataset.kind;
    if (kind === "pause") resume();
    else if (kind !== "result") closeModal();
    return;
  }
  if (event.key === "Enter" && modalOpen && quest && event.target.id === "text-input") {
    event.preventDefault();
    submitQuest();
    return;
  }
  if ((event.key === "Enter" || event.key === " ") && event.target.classList?.contains("hot")) {
    event.preventDefault();
    event.target.click();
    return;
  }
  if ((event.key === "Enter" || event.key === " ") && event.target.closest?.(".pin")) {
    event.preventDefault();
    event.target.closest(".pin").dispatchEvent(new MouseEvent("click", { bubbles: true }));
    return;
  }
  if (modalOpen && quest?.type === "code" && /^\d$/.test(event.key)) {
    draft.cursor = ((draft.cursor ?? -1) + 1) % draft.digits.length;
    draft = { ...act(quest, draft, { act: "digit-set", i: draft.cursor, value: event.key }), cursor: draft.cursor };
    refreshPuzzle();
    return;
  }
  if (modalOpen && tiles && /^[a-z]$/i.test(event.key)) {
    const i = tiles.pool.findIndex((t) => !t.used && t.ch === event.key.toUpperCase());
    if (i !== -1) placeTile(i);
    return;
  }
  if (modalOpen && tiles && event.key === "Backspace") { removeSlot(tiles.slots.length - 1); return; }
  if (!modalOpen && document.body.dataset.screen === "room" && (event.key === "p" || event.key === "Escape")) pause();
});

$("leave-btn").addEventListener("click", pause);
$("door-btn").addEventListener("click", openDoor);
$("torch-btn").addEventListener("click", torch);
$("how-btn").addEventListener("click", howTo);
$("resume").addEventListener("click", (event) => {
  if (!event.target.closest("#resume-btn")) return;
  const saved = load("current", null);
  const c = saved && cityById(saved.cityId);
  if (c) enterRoom(c, saved);
});
$("sound-btn").addEventListener("click", () => {
  audio.set(!audio.state.on);
  $("sound-btn").setAttribute("aria-pressed", String(audio.state.on));
  $("sound-btn").textContent = audio.state.on ? "🔊 Âm thanh" : "🔇 Tắt tiếng";
  save("sound", audio.state.on);
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden && document.body.dataset.screen === "room" && run?.status === "playing" && pausedAt === null) pause();
});
window.addEventListener("pagehide", () => persistRun());

/* ------------------------------------------------------------------- start */

audio.set(load("sound", true) !== false);
$("sound-btn").setAttribute("aria-pressed", String(audio.state.on));
if (!audio.state.on) $("sound-btn").textContent = "🔇 Tắt tiếng";
renderHome();
show("home");
initAnalytics();
setInterval(loop, 250);

if (new URLSearchParams(location.search).has("debug")) {
  window.__er = {
    get run() { return run; },
    get city() { return city; },
    get progress() { return progress; },
    /** Solve one quest with its real answer, through the same path as a player. */
    solve(id) {
      openQuest(id);
      const q = questById(city, id);
      run = attempt(run, city, id, solutionOf(q), now()).run;
      closeModal();
      renderRoom();
      persistRun();
      return run.letters.join("");
    },
    skip(seconds) { run = { ...run, startedAt: run.startedAt - seconds * 1000 }; },
    PAIR_COLORS,
  };
}
