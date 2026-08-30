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

COLOR_THIEF_PITCHES = {
  D3: 146.83,
  A4: 440,
  C5: 523.25,
  Cs5: 554.37,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880,
  C6: 1046.5,
};

COLOR_THIEF_MOTIF_STEP_MS = 150;
COLOR_THIEF_MOTIF_NOTES = [
  "A4", "Cs5", "D5", "F5", "E5", "Cs5", "A4", "D5",
].map((note) => COLOR_THIEF_PITCHES[note]);

VICTORY_THEME_STEP_MS = 120;
VICTORY_THEME_NOTES = ["C5", "E5", "G5", "C6", "G5", "C6"].map(
  (note) => COLOR_THIEF_PITCHES[note],
);

playColorThiefMotifDrone = () => {
  zzfx(0.24, 0, COLOR_THIEF_PITCHES.D3, 0.01, 0.1, 0.72, 1, 1, -1);
};

playColorThiefMotifNote = (frequency) => {
  zzfx(0.36, 0, frequency, 0.002, 0.012, 0.18, 2, 1.2, -2);
};

playColorThiefMotif = () => {
  ensureAudioReady();

  if (!audioReady) return false;

  playColorThiefMotifDrone();

  COLOR_THIEF_MOTIF_NOTES.forEach((frequency, index) => {
    setTimeout(() => {
      if (audioReady) {
        playColorThiefMotifNote(frequency);
      }
    }, index * COLOR_THIEF_MOTIF_STEP_MS);
  });

  return true;
};

playVictoryThemeNote = (frequency) => {
  zzfx(0.32, 0, frequency, 0.002, 0.025, 0.18, 1, 1.25, 2);
};

playVictoryTheme = () => {
  ensureAudioReady();

  if (!audioReady) return false;

  VICTORY_THEME_NOTES.forEach((frequency, index) => {
    setTimeout(() => {
      if (audioReady) {
        playVictoryThemeNote(frequency);
      }
    }, index * VICTORY_THEME_STEP_MS);
  });

  return true;
};

audioReady = false;

ensureAudioReady = () => {
  if (audioReady) return;

  if (zzfxX.state === "suspended") {
    zzfxX.resume();
  }

  audioReady = zzfxX.state === "running";
};
