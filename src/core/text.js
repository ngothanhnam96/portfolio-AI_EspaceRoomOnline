// Vietnamese-friendly text matching. Players type with or without diacritics,
// in any case, with stray spaces or punctuation: "Hồ Hoàn Kiếm", "ho hoan kiem"
// and "HO-HOAN KIEM!" must all count as the same answer.

/** Strip diacritics (đ → d too), lower-case, and squeeze everything else to single spaces. */
export function fold(text) {
  return String(text ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** fold() with the spaces removed too: "Cau Vang" and "cauvang" match. */
export function squash(text) {
  return fold(text).replace(/ /g, "");
}

/** Seeded shuffle (mulberry32) so a run always shows the same order. */
export function shuffled(list, seed = 1) {
  let a = (seed >>> 0) || 0x9e3779b9;
  const rng = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...list];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Like shuffled(), but never hands back the original order when there is another. */
export function scrambled(list, seed = 1) {
  if (list.length < 2) return [...list];
  for (let tries = 0; tries < 12; tries += 1) {
    const out = shuffled(list, seed + tries * 7919);
    if (out.some((item, i) => item !== list[i])) return out;
  }
  return [...list.slice(1), list[0]];
}

/** "mm:ss" for a number of seconds (never negative). */
export function clock(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
