import test from "node:test";
import assert from "node:assert/strict";
import { SCENE, fitScale, focusPose } from "../src/ui/camera.js";

test("the scene fits inside any box without cropping", () => {
  assert.equal(fitScale(1600, 900), 1);
  assert.equal(fitScale(800, 900), 0.5, "narrow box: width decides");
  assert.equal(fitScale(1600, 450), 0.5, "short box: height decides");
  assert.equal(fitScale(390, 219.375), 390 / 1600, "a 16:9 phone strip");
  assert.equal(fitScale(0, 500), 1, "no size yet: leave it alone");
});

test("focusing on an object pulls it toward the middle and moves closer", () => {
  const left = focusPose(200, 450);
  const right = focusPose(1400, 450);
  assert.ok(left.tx > 0 && right.tx < 0, "the scene shifts so the object comes to the centre");
  assert.ok(left.ry < 0 && right.ry > 0, "and the camera turns toward it");
  const top = focusPose(800, 100);
  const bottom = focusPose(800, 800);
  assert.ok(top.ty > 0 && bottom.ty < 0);
  const centre = focusPose(SCENE.w / 2, SCENE.h / 2);
  assert.equal(centre.tx, 0);
  assert.equal(centre.ty, 0);
  assert.ok(centre.tz > 0, "it dollies in");
});

test("a deeper zoom gets closer, and the glide never swings the view wildly", () => {
  assert.ok(focusPose(800, 450, 0, 400).tz > focusPose(800, 450, 0, 150).tz);
  for (const [x, y] of [[0, 0], [1600, 900], [100, 800], [1500, 120]]) {
    const pose = focusPose(x, y);
    assert.ok(Math.abs(pose.rx) <= 3 && Math.abs(pose.ry) <= 4, `${x},${y}`);
    assert.ok(Math.abs(pose.tx) <= SCENE.w * 0.25 && Math.abs(pose.ty) <= SCENE.h * 0.25, `${x},${y}`);
  }
});
