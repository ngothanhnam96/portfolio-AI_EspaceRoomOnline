// The interactive part of each puzzle card. A "draft" holds what the player has
// set up so far; act() turns a click into a new draft, puzzleHTML() draws it.
// Kept free of DOM calls so it can be tested in Node.

import { scrambled } from "../core/text.js";
import { esc } from "./rooms/kit.js";

export const PAIR_COLORS = ["#ffb347", "#6fd3ff", "#ff7aa8", "#9be36b", "#c59bff"];

export const TYPE_LABEL = {
  choice: "Trắc nghiệm",
  multi: "Chọn tất cả",
  text: "Điền đáp án",
  code: "Khóa số",
  order: "Sắp xếp",
  match: "Ghép cặp",
};

export function newDraft(quest, seed = 1) {
  switch (quest.type) {
    case "choice": return { pick: null };
    case "multi": return { picked: [] };
    case "text": return { value: "" };
    case "code": return { digits: Array.from(quest.answer, () => 0) };
    case "order": return { keys: scrambled(quest.items.map((i) => i.key), seed) };
    case "match": return { rights: scrambled(quest.pairs.map((_, i) => i), seed), pairs: {}, active: 0 };
    default: return {};
  }
}

export function draftAnswer(quest, draft) {
  switch (quest.type) {
    case "choice": return draft.pick;
    case "multi": return [...draft.picked].sort((a, b) => a - b);
    case "text": return draft.value;
    case "code": return draft.digits.join("");
    case "order": return [...draft.keys];
    case "match": return { ...draft.pairs };
    default: return null;
  }
}

/** Can the player press "Trả lời" yet? */
export function ready(quest, draft) {
  switch (quest.type) {
    case "choice": return draft.pick !== null;
    case "multi": return draft.picked.length > 0;
    case "text": return draft.value.trim().length > 0;
    case "match": return Object.keys(draft.pairs).length === quest.pairs.length;
    default: return true;
  }
}

/**
 * Apply one click.
 * @param {{act: string, i?: number, value?: string}} action
 */
export function act(quest, draft, action) {
  const i = Number(action.i);
  switch (action.act) {
    case "pick":
      return { ...draft, pick: i };
    case "toggle": {
      const picked = draft.picked.includes(i) ? draft.picked.filter((x) => x !== i) : [...draft.picked, i];
      return { ...draft, picked };
    }
    case "type":
      return { ...draft, value: String(action.value ?? "").slice(0, 60) };
    case "digit-up":
    case "digit-down": {
      const digits = [...draft.digits];
      digits[i] = (digits[i] + (action.act === "digit-up" ? 1 : 9)) % 10;
      return { ...draft, digits };
    }
    case "digit-set": {
      const digits = [...draft.digits];
      digits[i] = Number(action.value) % 10;
      return { ...draft, digits };
    }
    case "up":
    case "down": {
      const keys = [...draft.keys];
      const j = action.act === "up" ? i - 1 : i + 1;
      if (j < 0 || j >= keys.length) return draft;
      [keys[i], keys[j]] = [keys[j], keys[i]];
      return { ...draft, keys };
    }
    case "left": {
      if (draft.pairs[i] !== undefined) {
        const pairs = { ...draft.pairs };
        delete pairs[i];
        return { ...draft, pairs, active: i };
      }
      return { ...draft, active: i };
    }
    case "right": {
      // i is the pair index of the right-hand card (not its shuffled position)
      const pairs = { ...draft.pairs };
      const owner = Object.keys(pairs).find((k) => pairs[k] === i);
      if (owner !== undefined) {
        delete pairs[owner];
        return { ...draft, pairs };
      }
      if (draft.active === null) return draft;
      pairs[draft.active] = i;
      const next = quest.pairs.findIndex((_, k) => pairs[k] === undefined);
      return { ...draft, pairs, active: next === -1 ? null : next };
    }
    default:
      return draft;
  }
}

/** Colour index of a left card's pair, so both cards wear the same colour. */
function pairSlot(draft, left) {
  return Object.keys(draft.pairs).map(Number).sort((a, b) => a - b).indexOf(left);
}

export function puzzleHTML(quest, draft) {
  switch (quest.type) {
    case "choice":
      return `<div class="options">${quest.options.map((o, i) => `
        <button class="option${draft.pick === i ? " on" : ""}" data-act="pick" data-i="${i}">
          <span class="opt-key">${"ABCDEFGH"[i]}</span><span>${esc(o)}</span>
        </button>`).join("")}</div>`;

    case "multi":
      return `<p class="small-note">Chọn tất cả đáp án đúng rồi bấm Trả lời.</p>
        <div class="chips">${quest.options.map((o, i) => `
          <button class="pick-chip${draft.picked.includes(i) ? " on" : ""}" data-act="toggle" data-i="${i}" aria-pressed="${draft.picked.includes(i)}">${esc(o)}</button>`).join("")}</div>`;

    case "text":
      return `<label class="text-answer">
        <input id="text-input" type="text" autocomplete="off" spellcheck="false" maxlength="60"
          placeholder="${esc(quest.placeholder ?? "Câu trả lời…")}" value="${esc(draft.value)}">
        <small>Có dấu hay không dấu đều được.</small>
      </label>`;

    case "code":
      return `<div class="wheels" role="group" aria-label="Khóa số">${draft.digits.map((d, i) => `
        <div class="wheel">
          <button class="wheel-btn" data-act="digit-up" data-i="${i}" aria-label="Tăng chữ số ${i + 1}">▲</button>
          <div class="wheel-face" aria-live="polite"><span class="ghost">${(d + 9) % 10}</span><b>${d}</b><span class="ghost">${(d + 1) % 10}</span></div>
          <button class="wheel-btn" data-act="digit-down" data-i="${i}" aria-label="Giảm chữ số ${i + 1}">▼</button>
        </div>`).join("")}</div>
        <p class="small-note">Bấm ▲▼ hoặc gõ số trên bàn phím.</p>`;

    case "order": {
      const label = (key) => quest.items.find((it) => it.key === key).label;
      return `<p class="small-note">Trên cùng là xưa nhất.</p><ol class="order-list">${draft.keys.map((key, i) => `
        <li class="order-item"><span class="order-n">${i + 1}</span><span class="order-label">${esc(label(key))}</span>
          <span class="order-btns">
            <button data-act="up" data-i="${i}" ${i === 0 ? "disabled" : ""} aria-label="Đưa lên">▲</button>
            <button data-act="down" data-i="${i}" ${i === draft.keys.length - 1 ? "disabled" : ""} aria-label="Đưa xuống">▼</button>
          </span></li>`).join("")}</ol>`;
    }

    case "match": {
      const lefts = quest.pairs.map((p, i) => {
        const paired = draft.pairs[i] !== undefined;
        const slot = paired ? pairSlot(draft, i) : -1;
        const style = paired ? ` style="--pair:${PAIR_COLORS[slot % PAIR_COLORS.length]}"` : "";
        return `<button class="match-card left${paired ? " paired" : ""}${draft.active === i ? " active" : ""}" data-act="left" data-i="${i}"${style}>${paired ? `<span class="pair-dot">${slot + 1}</span>` : ""}${esc(p[0])}</button>`;
      }).join("");
      const rights = draft.rights.map((pairIndex) => {
        const owner = Object.keys(draft.pairs).find((k) => draft.pairs[k] === pairIndex);
        const paired = owner !== undefined;
        const slot = paired ? pairSlot(draft, Number(owner)) : -1;
        const style = paired ? ` style="--pair:${PAIR_COLORS[slot % PAIR_COLORS.length]}"` : "";
        return `<button class="match-card right${paired ? " paired" : ""}" data-act="right" data-i="${pairIndex}"${style}>${paired ? `<span class="pair-dot">${slot + 1}</span>` : ""}${esc(quest.pairs[pairIndex][1])}</button>`;
      }).join("");
      return `<p class="small-note">Chọn một món bên trái, rồi chọn mô tả bên phải. Chạm lại để gỡ.</p>
        <div class="match"><div class="match-col">${lefts}</div><div class="match-col">${rights}</div></div>`;
    }
    default:
      return "";
  }
}
