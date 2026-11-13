// Lightweight synthesized SFX via Web Audio — no asset files.
// Honors a persisted on/off flag.

const KEY = "tailender.sound";
let enabled = localStorage.getItem(KEY) !== "off";
let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(
  c: AudioContext,
  freq: number,
  startAt: number,
  dur: number,
  type: OscillatorType = "triangle",
  peak = 0.18
) {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startAt);
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(peak, startAt + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(startAt);
  osc.stop(startAt + dur + 0.02);
}

function sequence(notes: number[], step = 0.09, dur = 0.14, type: OscillatorType = "triangle") {
  if (!enabled) return;
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime;
  notes.forEach((f, i) => tone(c, f, t0 + i * step, dur, type));
}

export function isSoundOn() {
  return enabled;
}

export function setSound(on: boolean) {
  enabled = on;
  localStorage.setItem(KEY, on ? "on" : "off");
  if (on) sequence([660, 880], 0.08, 0.12); // little confirmation blip
}

/** A scored (non-century) answer — short rising arpeggio. */
export function playScore() {
  sequence([523, 659, 784]);
}

/** Century / big moment — a cheerier fanfare. */
export function playCentury() {
  sequence([523, 659, 784, 1046, 1318], 0.1, 0.18);
}

/** Duck / no runs — a sad descending trio. */
export function playDuck() {
  sequence([392, 330, 262], 0.12, 0.2, "sawtooth");
}

/** Generic UI click. */
export function playClick() {
  sequence([740], 0.0, 0.07, "square");
}
