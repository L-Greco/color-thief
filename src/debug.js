// Development-only configuration, loaded by `npm run debug` and debug builds.
const debugState = new URLSearchParams(location.search).get("state");

const debugConfig = globalThis.debugConfig = {
  enabled: false,
  startState: "deckBuilding",
  get allowManualDeckDraw() {
    return this.enabled;
  },
  playerDeckConfig: [
    unicornCards[0], // Tiny Hoof
    unicornCards[0],
    unicornCards[1], // Sparkhorn Foal
    unicornCards[1],
    unicornCards[3], // Cloudmane Charger
    unicornCards[3],
    unicornCards[5], // Silverhorn Knight
    unicornCards[5],
    unicornCards[7], // Healing Mare
    unicornCards[7],
    unicornCards[9], // Crowned Unicorn
    unicornCards[10], // Battle Cry
    unicornCards[10],
    unicornCards[14], // Charge of the Herd
    rainbowCards[1], // Color Sprite
    rainbowCards[1],
    rainbowCards[3], // Paint Sprite
    rainbowCards[3],
    rainbowCards[11], // Refraction
    rainbowCards[12], // Rainbow Beam
  ],
  startBattle(game) {
    this.enabled = true;
    game.startBattle(this.playerDeckConfig);
  },
  start(game) {
    if (!this.enabled) {
      game.startBeginning();
      return;
    }

    switch (this.startState) {
      case "intro":
        game.startIntro();
        return;
      case "battle":
        this.startBattle(game);
        return;
      case "victory":
      case "defeat":
        game.showGameOver(this.startState);
        return;
      case "deckBuilding":
      default:
        game.startDeckBuilding();
    }
  },
};

if (["intro", "deckBuilding", "battle", "victory", "defeat"].includes(debugState)) {
  debugConfig.enabled = true;
  debugConfig.startState = debugState;
}
