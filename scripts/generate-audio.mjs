import fs from "node:fs";
import path from "node:path";

const SAMPLE_RATE = 44100;
const OUT_DIR = path.resolve(process.cwd(), "public/audio");
fs.mkdirSync(OUT_DIR, { recursive: true });

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function writeWavStereo(filename, left, right) {
  const numSamples = left.length;
  let peak = 0;
  for (let i = 0; i < numSamples; i++) {
    const a = Math.abs(left[i]);
    const b = Math.abs(right[i]);
    if (a > peak) peak = a;
    if (b > peak) peak = b;
  }
  const scale = peak > 0.95 ? 0.95 / peak : 1.0;

  const byteRate = SAMPLE_RATE * 4;
  const dataSize = numSamples * 4;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(2, 22); // Stereo
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(4, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const l = Math.max(-1, Math.min(1, left[i] * scale));
    const r = Math.max(-1, Math.min(1, right[i] * scale));
    buffer.writeInt16LE(Math.round(l * 32767), offset);
    buffer.writeInt16LE(Math.round(r * 32767), offset + 2);
    offset += 4;
  }

  fs.writeFileSync(path.join(OUT_DIR, filename), buffer);
  console.log(`Generated ${filename} (${(numSamples / SAMPLE_RATE).toFixed(2)}s, peak=${(peak * scale).toFixed(3)})`);
}

// 1. BGM Ambient (100 seconds)
function generateBgm() {
  const duration = 100;
  const n = duration * SAMPLE_RATE;
  const left = new Float64Array(n);
  const right = new Float64Array(n);
  const chords = [
    [261.63, 329.63, 392.0, 493.88], // Cmaj7
    [220.0, 261.63, 329.63, 392.0],  // Am7
    [174.61, 220.0, 261.63, 329.63], // Fmaj7
    [196.0, 246.94, 293.66, 392.0],  // G6
  ];
  const chordLen = 4.0;
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const chordIdx = Math.floor(t / chordLen) % chords.length;
    const localT = t % chordLen;
    const notes = chords[chordIdx];

    let pad = 0;
    for (let k = 0; k < notes.length; k++) {
      const f = notes[k];
      pad += Math.sin(2 * Math.PI * f * t) * 0.08;
      pad += Math.sin(2 * Math.PI * (f * 0.5) * t) * 0.04;
    }

    const pianoEnv = Math.exp(-localT * 1.9) * (1 - Math.exp(-localT * 80));
    const piano = Math.sin(2 * Math.PI * notes[chordIdx % notes.length] * 2 * t) * 0.12 * pianoEnv;

    let fade = 1.0;
    if (t < 0.8) fade = t / 0.8;
    if (t > duration - 2.2) fade = Math.max(0, (duration - t) / 2.2);

    left[i] = (pad + piano * 0.9) * fade;
    right[i] = (pad * 0.96 + piano * 1.05) * fade;
  }
  writeWavStereo("bgm-ios-ambient.wav", left, right);
}

// 2. Notification crystal-marimba
function generateNotif() {
  const n = Math.floor(0.75 * SAMPLE_RATE);
  const left = new Float64Array(n);
  const right = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const env1 = Math.exp(-t * 10);
    const env2 = t > 0.11 ? Math.exp(-(t - 0.11) * 9) : 0;
    const s1 = Math.sin(2 * Math.PI * 1046.5 * t) * 0.35 * env1;
    const s2 = t > 0.11 ? Math.sin(2 * Math.PI * 1318.5 * (t - 0.11)) * 0.38 * env2 : 0;
    left[i] = s1 + s2;
    right[i] = s1 * 0.92 + s2 * 1.05;
  }
  writeWavStereo("sfx-ios-notif.wav", left, right);
}

// 3. Glass whoosh
function generateWhoosh() {
  const n = Math.floor(0.45 * SAMPLE_RATE);
  const left = new Float64Array(n);
  const right = new Float64Array(n);
  const rand = mulberry32(20261122);
  let lp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.sin((t / 0.45) * Math.PI);
    const noise = rand() * 2 - 1;
    lp = lp * 0.92 + noise * 0.08;
    const tone = Math.sin(2 * Math.PI * (340 + t * 520) * t) * 0.08;
    const val = (lp * 0.55 + tone) * env;
    left[i] = val;
    right[i] = val * 0.95;
  }
  writeWavStereo("sfx-glass-whoosh.wav", left, right);
}

// 4. Droplet check
function generateDroplet() {
  const n = Math.floor(0.35 * SAMPLE_RATE);
  const left = new Float64Array(n);
  const right = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 16);
    const freq = 620 + t * 1400;
    const val = Math.sin(2 * Math.PI * freq * t) * 0.35 * env;
    left[i] = val;
    right[i] = val;
  }
  writeWavStereo("sfx-droplet-check.wav", left, right);
}

// 5. Haptic tap
function generateTap() {
  const n = Math.floor(0.12 * SAMPLE_RATE);
  const left = new Float64Array(n);
  const right = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 48);
    const val = Math.sin(2 * Math.PI * 190 * t) * 0.42 * env;
    left[i] = val;
    right[i] = val;
  }
  writeWavStereo("sfx-haptic-tap.wav", left, right);
}

// 6. Resolve warm maj9 chord
function generateResolve() {
  const n = Math.floor(2.4 * SAMPLE_RATE);
  const left = new Float64Array(n);
  const right = new Float64Array(n);
  const freqs = [261.63, 329.63, 392.0, 493.88, 587.33];
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const env = (1 - Math.exp(-t * 18)) * Math.exp(-t * 1.45);
    let sum = 0;
    for (let k = 0; k < freqs.length; k++) {
      sum += Math.sin(2 * Math.PI * freqs[k] * t) * 0.14;
    }
    left[i] = sum * env;
    right[i] = sum * env * 0.96;
  }
  writeWavStereo("sfx-resolve-chord.wav", left, right);
}

generateBgm();
generateNotif();
generateWhoosh();
generateDroplet();
generateTap();
generateResolve();
