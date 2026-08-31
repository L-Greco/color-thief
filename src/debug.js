// Development-only configuration. Remove this script from index.html before shipping.
debugConfig = {
  allowManualDeckDraw: true,
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
    rainbowCards[3], // Paintling
    rainbowCards[3],
    rainbowCards[11], // Refraction
    rainbowCards[12], // Rainbow Beam
  ],
  startBattle(game) {
    game.startBattle(this.playerDeckConfig);
  },
};
