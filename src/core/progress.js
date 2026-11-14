// What a player keeps between visits: per city, the best stars and fastest
// escape. Junk in storage is cleaned up, never trusted.

export function newProgress() {
  return { version: 1, cities: {}, escapes: 0, attempts: 0 };
}

export function restoreProgress(raw, cityIds) {
  const fresh = newProgress();
  if (!raw || typeof raw !== "object") return fresh;
  for (const id of cityIds) {
    const entry = raw.cities?.[id];
    if (!entry || typeof entry !== "object") continue;
    const stars = Math.floor(Number(entry.stars));
    const best = Number(entry.best);
    fresh.cities[id] = {
      stars: Number.isFinite(stars) ? Math.max(0, Math.min(3, stars)) : 0,
      best: Number.isFinite(best) && best > 0 ? Math.round(best) : null,
      escapes: Math.max(0, Math.floor(Number(entry.escapes) || 0)),
    };
  }
  fresh.escapes = Math.max(0, Math.floor(Number(raw.escapes) || 0));
  fresh.attempts = Math.max(0, Math.floor(Number(raw.attempts) || 0));
  return fresh;
}

/**
 * Fold a finished run in. Stars and best time only ever improve.
 * @param {{escaped: boolean, seconds: number, stars: number}} result
 * @returns {{progress: object, newBest: boolean}}
 */
export function recordResult(progress, cityId, result) {
  const before = progress.cities[cityId] ?? { stars: 0, best: null, escapes: 0 };
  const entry = { ...before };
  let newBest = false;
  if (result.escaped) {
    entry.escapes += 1;
    entry.stars = Math.max(entry.stars, result.stars);
    const seconds = Math.round(result.seconds);
    if (entry.best === null || seconds < entry.best) {
      entry.best = seconds;
      newBest = true;
    }
  }
  return {
    progress: {
      ...progress,
      cities: { ...progress.cities, [cityId]: entry },
      escapes: progress.escapes + (result.escaped ? 1 : 0),
      attempts: progress.attempts + 1,
    },
    newBest,
  };
}

export function totalStars(progress) {
  return Object.values(progress.cities).reduce((sum, c) => sum + (c.stars ?? 0), 0);
}

/** Title earned from stars across all cities. */
export function titleOf(progress, cityCount) {
  const stars = totalStars(progress);
  const max = cityCount * 3;
  if (stars >= max && max > 0) return { name: "Huyền Thoại Ba Miền", icon: "🏆" };
  if (stars >= Math.ceil(max * 0.66)) return { name: "Thám Tử Lão Luyện", icon: "🕵️" };
  if (stars >= Math.ceil(max * 0.33)) return { name: "Người Phá Khóa", icon: "🗝️" };
  if (stars > 0) return { name: "Tân Binh Mật Thất", icon: "🔦" };
  return { name: "Khách Lạ", icon: "🧳" };
}
