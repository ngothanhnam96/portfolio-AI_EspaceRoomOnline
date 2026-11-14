// Escape-room sounds without audio files: soft clicks, a bright chime for a
// solved puzzle, a dull buzz for a wrong one, a lock clunk, a door creak and a
// heartbeat tick in the last minute. Created on the first click (browser rule).

export function createAudio() {
  let ctx = null;
  let master = null;
  const state = { on: true };

  function ensure() {
    if (ctx) return ctx;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0.45;
    master.connect(ctx.destination);
    return ctx;
  }

  function tone(freq, { type = "sine", time = 0.15, gain = 0.2, slide = 0, delay = 0 } = {}) {
    if (!state.on || !ensure()) return;
    if (ctx.state === "suspended") ctx.resume();
    const at = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, at);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), at + time);
    env.gain.setValueAtTime(0.0001, at);
    env.gain.exponentialRampToValueAtTime(gain, at + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0001, at + time);
    osc.connect(env).connect(master);
    osc.start(at);
    osc.stop(at + time + 0.03);
  }

  function noise(time = 0.4, gain = 0.2, freq = 700) {
    if (!state.on || !ensure()) return;
    const frames = Math.floor(ctx.sampleRate * time);
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = freq;
    const env = ctx.createGain();
    env.gain.value = gain;
    source.connect(filter).connect(env).connect(master);
    source.start();
  }

  return {
    state,
    unlock() { ensure(); if (ctx?.state === "suspended") ctx.resume(); },
    set(on) { state.on = on; },
    click() { tone(720, { type: "triangle", time: 0.05, gain: 0.08 }); },
    open() { tone(440, { type: "sine", time: 0.12, gain: 0.1, slide: 200 }); },
    right() { [523, 659, 784, 1047].forEach((f, i) => tone(f, { type: "triangle", time: 0.22, gain: 0.16, delay: i * 0.08 })); },
    wrong() { tone(150, { type: "sawtooth", time: 0.28, gain: 0.12, slide: -40 }); tone(110, { type: "square", time: 0.2, gain: 0.06, delay: 0.08 }); },
    hint() { tone(880, { type: "sine", time: 0.3, gain: 0.08, slide: -300 }); },
    tile() { tone(980, { type: "square", time: 0.04, gain: 0.05 }); },
    lock() { noise(0.12, 0.25, 1600); tone(220, { type: "square", time: 0.08, gain: 0.08, delay: 0.05 }); },
    tick() { tone(1200, { type: "square", time: 0.03, gain: 0.05 }); },
    door() {
      noise(1.1, 0.18, 380);
      [392, 494, 587, 784, 988].forEach((f, i) => tone(f, { type: "triangle", time: 0.4, gain: 0.14, delay: 0.5 + i * 0.12 }));
    },
    lose() { [392, 330, 262, 196].forEach((f, i) => tone(f, { type: "sawtooth", time: 0.35, gain: 0.1, delay: i * 0.16 })); },
  };
}
