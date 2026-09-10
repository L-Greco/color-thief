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
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  G3: 196,
  A3: 220,
  A4: 440,
  B4: 493.88,
  C5: 523.25,
  Cs5: 554.37,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880,
};

COLOR_THIEF_MOTIF_STEP_MS = 150;
COLOR_THIEF_MOTIF_NOTES = [
  "A4", "Cs5", "D5", "F5", "E5", "Cs5", "A4", "D5",
].map((note) => COLOR_THIEF_PITCHES[note]);

VICTORY_THEME_STEP_MS = 250;
VICTORY_THEME_MELODY = [
  "E5", "B4", "C5", "D5", "C5", "B4", "A4", "A4",
  "C5", "E5", "D5", "C5", "B4", "C5", "D5", "E5",
  "C5", "A4", "A4", "D5", "F5", "A5", "G5", "F5",
  "E5", "C5", "E5", "D5", "C5", "B4", "B4", "C5",
  "D5", "E5", "C5", "A4", "A4",
].map((note) => COLOR_THIEF_PITCHES[note]);
VICTORY_THEME_BASS_STEP_MS = VICTORY_THEME_STEP_MS * 2;
VICTORY_THEME_BASS = [
  "A3", "E3", "A3", "E3", "A3", "E3", "A3", "E3",
  "D3", "A3", "D3", "A3", "G3", "D3", "C3", "G3",
  "A3", "E3", "A3",
].map((note) => COLOR_THIEF_PITCHES[note]);
VICTORY_THEME_LOOP_DURATION_MS =
  VICTORY_THEME_MELODY.length * VICTORY_THEME_STEP_MS + 120;

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
  zzfx(0.22, 0, frequency, 0.002, 0.035, 0.16, 1, 5, 0.5);
};

playVictoryThemeBass = (frequency) => {
  zzfx(0.16, 0, frequency, 0.004, 0.04, 0.22, 1, 1, 0);
};

victoryThemeLoopId = 0;

scheduleVictoryThemeLoop = (loopId) => {
  VICTORY_THEME_MELODY.forEach((frequency, index) => {
    setTimeout(() => {
      if (audioReady && victoryThemeLoopId === loopId) {
        playVictoryThemeNote(frequency);
      }
    }, index * VICTORY_THEME_STEP_MS);
  });

  VICTORY_THEME_BASS.forEach((frequency, index) => {
    setTimeout(() => {
      if (audioReady && victoryThemeLoopId === loopId) {
        playVictoryThemeBass(frequency);
      }
    }, index * VICTORY_THEME_BASS_STEP_MS);
  });

  setTimeout(() => {
    if (audioReady && victoryThemeLoopId === loopId) {
      scheduleVictoryThemeLoop(loopId);
    }
  }, VICTORY_THEME_LOOP_DURATION_MS);
};

playVictoryTheme = () => {
  ensureAudioReady();

  if (!audioReady) return false;

  victoryThemeLoopId += 1;
  scheduleVictoryThemeLoop(victoryThemeLoopId);

  return true;
};

stopVictoryTheme = () => {
  victoryThemeLoopId += 1;
};

audioReady = false;

ensureAudioReady = () => {
  if (audioReady) return;

  if (zzfxX.state === "suspended") {
    zzfxX.resume();
  }

  audioReady = zzfxX.state === "running";
};
