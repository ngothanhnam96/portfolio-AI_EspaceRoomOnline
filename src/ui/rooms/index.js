// Room artwork by city id. Add a new city's drawing here as well as in content/cities.js.

import danangRoom from "./danang.js";
import hanoiRoom from "./hanoi.js";
import hcmRoom from "./hcm.js";

export const ROOMS = { hanoi: hanoiRoom, danang: danangRoom, hcm: hcmRoom };

/** The room as stacked 3D layers (HTML), ready for the camera to mount. */
export function roomScene(cityId) {
  const draw = ROOMS[cityId];
  if (!draw) throw new Error(`no room artwork for ${cityId}`);
  return draw();
}
