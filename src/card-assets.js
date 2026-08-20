loadCardImage = (src) => {
  const image = new Image();
  image.src = src;
  return image;
};

cardArtImages = {
  unicorn: loadCardImage("./assets/cards/unicorn.png"),
  rainbow: loadCardImage("./assets/cards/rainbow.png"),
  enemy: loadCardImage("./assets/cards/void.png"),
};

spellIconSheet = loadCardImage("./assets/icons/spell-icons.png");

SPELL_ICON_SIZE = 96;

spellIconFrames = {
  damage: { x: 0, y: 0, width: SPELL_ICON_SIZE, height: SPELL_ICON_SIZE },
  support: {
    x: SPELL_ICON_SIZE,
    y: 0,
    width: SPELL_ICON_SIZE,
    height: SPELL_ICON_SIZE,
  },
  void: {
    x: SPELL_ICON_SIZE * 2,
    y: 0,
    width: SPELL_ICON_SIZE,
    height: SPELL_ICON_SIZE,
  },
};
