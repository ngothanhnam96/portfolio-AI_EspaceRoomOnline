// The 2.5D camera. A room is a stack of flat layers placed at different depths
// in real CSS 3D space (see rooms/kit.js scene()). This moves one "camera"
// element in front of them:
//
//   • parallax  – the view turns a few degrees toward the mouse or the phone's tilt,
//                 so near furniture slides over the wall and the window view lags behind
//   • idle sway – a slow breathing drift, so the room never looks frozen
//   • intro     – a short glide into the room when you enter
//   • focus     – a dolly toward an object before its puzzle opens, back out after
//
// Everything eases toward a target every frame; nothing here touches game rules.

export const SCENE = { w: 1600, h: 900, perspective: 1500 };

const REST = { tx: 0, ty: 0, tz: 60, rx: 0, ry: 0 };
const PARALLAX = { yaw: 3.4, pitch: 2.2 };

/** Where the camera should be to frame a point (x, y) in scene units. Pure, for tests. */
export function focusPose(x, y, depth = 0, zoom = 300) {
  const pull = 0.5;
  return {
    tx: (SCENE.w / 2 - x) * pull,
    ty: (SCENE.h / 2 - y) * pull,
    tz: REST.tz + zoom - depth * 0.4,
    rx: ((y - SCENE.h / 2) / SCENE.h) * -3,
    ry: ((x - SCENE.w / 2) / SCENE.w) * 4,
  };
}

/** Scale that fits the 1600 x 900 scene inside a box without cropping. */
export function fitScale(width, height) {
  if (!(width > 0 && height > 0)) return 1;
  return Math.min(width / SCENE.w, height / SCENE.h);
}

const lerp = (a, b, t) => a + (b - a) * t;

export function createCamera() {
  const reduced = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  let stage = null;
  let viewport = null;
  let rig = null;
  let observer = null;
  let raf = 0;
  let pose = { ...REST };
  let focus = null;
  let pointer = { x: 0, y: 0 };
  let tilt = null;
  let started = 0;

  function frame(time) {
    raf = requestAnimationFrame(frame);
    if (!rig) return;
    const t = time / 1000;
    const target = focus ? { ...focus } : { ...REST };
    if (!focus && !reduced) {
      const source = tilt ?? pointer;
      target.ry += source.x * PARALLAX.yaw + Math.sin(t * 0.31) * 0.5;
      target.rx += -source.y * PARALLAX.pitch + Math.sin(t * 0.43) * 0.35;
      target.ty += Math.sin(t * 0.5) * 3;
    }
    const k = reduced ? 1 : focus ? 0.085 : t - started < 1.6 ? 0.045 : 0.07;
    for (const key of Object.keys(pose)) pose[key] = lerp(pose[key], target[key], k);
    rig.style.transform = `translate3d(${pose.tx.toFixed(2)}px, ${pose.ty.toFixed(2)}px, ${pose.tz.toFixed(2)}px) `
      + `rotateX(${pose.rx.toFixed(3)}deg) rotateY(${pose.ry.toFixed(3)}deg)`;
  }

  function fit() {
    if (!stage || !viewport) return;
    const box = stage.getBoundingClientRect();
    viewport.style.setProperty("--fit", String(fitScale(box.width, box.height)));
  }

  function onPointer(event) {
    if (!stage) return;
    const box = stage.getBoundingClientRect();
    pointer = {
      x: Math.max(-1, Math.min(1, ((event.clientX - box.left) / box.width) * 2 - 1)),
      y: Math.max(-1, Math.min(1, ((event.clientY - box.top) / box.height) * 2 - 1)),
    };
    stage.style.setProperty("--mx", `${((event.clientX - box.left) / box.width) * 100}%`);
    stage.style.setProperty("--my", `${((event.clientY - box.top) / box.height) * 100}%`);
  }

  function onLeave() { pointer = { x: 0, y: 0 }; }

  function onTilt(event) {
    if (event.gamma === null || event.beta === null) return;
    tilt = {
      x: Math.max(-1, Math.min(1, event.gamma / 25)),
      y: Math.max(-1, Math.min(1, (event.beta - 45) / 25)),
    };
  }

  return {
    /** Wrap the room markup in the 3D viewport and start the camera. */
    mount(stageEl, sceneHTML) {
      this.unmount();
      stage = stageEl;
      stage.innerHTML = `<div class="viewport"><div class="rig">${sceneHTML}</div></div><div class="torchlight" aria-hidden="true"></div>`;
      viewport = stage.querySelector(".viewport");
      rig = stage.querySelector(".rig");
      started = performance.now() / 1000;
      // The glide-in: start pulled back and turned, ease to rest.
      pose = reduced ? { ...REST } : { tx: 0, ty: 30, tz: -320, rx: 5, ry: -9 };
      focus = null;
      fit();
      if (typeof ResizeObserver === "function") {
        observer = new ResizeObserver(fit);
        observer.observe(stage);
      }
      stage.addEventListener("pointermove", onPointer);
      stage.addEventListener("pointerleave", onLeave);
      window.addEventListener("deviceorientation", onTilt);
      raf = requestAnimationFrame(frame);
    },

    unmount() {
      cancelAnimationFrame(raf);
      observer?.disconnect();
      observer = null;
      if (stage) {
        stage.removeEventListener("pointermove", onPointer);
        stage.removeEventListener("pointerleave", onLeave);
      }
      window.removeEventListener("deviceorientation", onTilt);
      stage = null;
      viewport = null;
      rig = null;
    },

    /** Dolly toward an element of the room (a hotspot or the door). */
    focusOn(element, zoom = 300) {
      if (!element || reduced) return;
      const box = element.getBBox?.();
      if (!box) return;
      const layer = element.closest(".layer");
      const depth = Number(layer?.dataset.z ?? 0);
      focus = focusPose(box.x + box.width / 2, box.y + box.height / 2, depth, zoom);
    },

    release() { focus = null; },

    /** iOS asks before sharing the tilt sensor; call this from a tap. */
    askForTilt() {
      const ask = window.DeviceOrientationEvent?.requestPermission;
      if (typeof ask === "function") ask.call(window.DeviceOrientationEvent).catch(() => {});
    },

    get reduced() { return reduced; },
    get pose() { return { ...pose }; },
  };
}
