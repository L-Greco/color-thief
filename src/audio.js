const CARD_DRAW_SOUND = [
  0.22,
  0.04,
  520,
  0.005,
  0.02,
  0.08,
  1,
  1,
  140,
  0,
  0,
  0,
  0,
  0.08,
];

audioReady = false;

ensureAudioReady = () => {
  if (audioReady) return;

  if (zzfxX.state === "suspended") {
    zzfxX.resume();
  }

  audioReady = zzfxX.state === "running";
};
