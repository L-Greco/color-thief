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

const SPELL_DAMAGE_SOUND = [
  2,
  ,
  465,
  ,
  0.36,
  0.42,
  4,
  2.2,
  ,
  ,
  -15,
  0.53,
  0.13,
  ,
  99,
  1,
  0.08,
  0.71,
  0.08,
];

const BUFF_SOUND = [
  1.6,
  ,
  253,
  0.04,
  0.18,
  0.36,
  1,
  3.3,
  ,
  ,
  351,
  0.1,
  ,
  0.3,
  5.3,
  ,
  0.1,
  0.72,
  0.15,
  ,
  -1247,
];

const MINION_ATTACK_SOUND = [
  2.1,
  ,
  416,
  0.01,
  0.03,
  0.17,
  3,
  2.2,
  ,
  -10,
  ,
  ,
  ,
  1.3,
  ,
  0.5,
  0.07,
  0.76,
];

const DEFEAT_SOUND = [
  ,
  0,
  260.63,
  0.16,
  0.32,
  0.47,
  5,
  1.643657853591983,
  -0.2,
  0.1,
  ,
  -0.01,
  ,
  -0.1,
  ,
  0.1,
  0.01,
  1.08,
  0.06,
  0.02,
];

audioReady = false;

ensureAudioReady = () => {
  if (audioReady) return;

  if (zzfxX.state === "suspended") {
    zzfxX.resume();
  }

  audioReady = zzfxX.state === "running";
};
