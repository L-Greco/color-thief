unicornCards = [
  {
    cost: 1,
    attack: 1,
    health: 1,
    text: "On Play: Give a friendly minion +0/+2",
    effects: [
      {
        trigger: "onPlay",
        type: "buff",
        target: "friendlyMinion",
        attack: 0,
        health: 2,
      },
    ],
  },
  {
    cost: 1,
    attack: 2,
    health: 1,
  },
  {
    cost: 2,
    attack: 2,
    health: 2,
    text: "On Play: Give a friendly minion +0/+2",
    effects: [
      {
        trigger: "onPlay",
        type: "buff",
        target: "friendlyMinion",
        attack: 0,
        health: 2,
      },
    ],
  },
  {
    cost: 2,
    attack: 2,
    health: 4,
  },
  {
    cost: 3,
    attack: 3,
    health: 4,
  },
  {
    cost: 3,
    attack: 4,
    health: 3,
  },
  {
    cost: 3,
    attack: 2,
    health: 4,
    text: "On Play: Heal a friendly minion for 2.",
    effects: [
      {
        trigger: "onPlay",
        type: "heal",
        target: "friendlyMinion",
        amount: 2,
      },
    ],
  },
  {
    cost: 4,
    attack: 4,
    health: 5,
  },
  {
    cost: 4,
    attack: 4,
    health: 4,
    text: "On Play: Deal 2 damage to an enemy minion.",
    effects: [
      {
        trigger: "onPlay",
        type: "damage",
        target: "enemyMinion",
        amount: 2,
      },
    ],
  },
  {
    name: "Crowned Unicorn",
    cost: 7,
    attack: 7,
    health: 8,
    unique: true,
    text: "On Play: Give all friendly minions +2/+2.",
    effects: [
      {
        trigger: "onPlay",
        type: "buff",
        target: "allFriendlyMinions",
        attack: 2,
        health: 2,
      },
    ],
  },
  {
    name: "Rally",
    type: "spell",
    cost: 1,
    text: "Give a friendly minion +2 Attack.",
    effects: [
      {
        type: "buff",
        target: "friendlyMinion",
        attack: 2,
        health: 0,
      },
    ],
  },
  {
    name: "Gleam",
    type: "spell",
    cost: 2,
    text: "Give a friendly minion +1/+3.",
    effects: [
      {
        type: "buff",
        target: "friendlyMinion",
        attack: 1,
        health: 3,
      },
    ],
  },
  {
    name: "Gore",
    type: "spell",
    cost: 2,
    text: "Deal 3 damage to an enemy minion.",
    effects: [
      {
        type: "damage",
        target: "enemyMinion",
        amount: 3,
      },
    ],
  },
  {
    name: "Crown",
    type: "spell",
    cost: 3,
    text: "Give a friendly minion +2/+4.",
    effects: [
      {
        type: "buff",
        target: "friendlyMinion",
        attack: 2,
        health: 4,
      },
    ],
  },
  {
    name: "For Chroma!",
    type: "spell",
    cost: 4,
    text: "Give all friendly minions +2/+2.",
    effects: [
      {
        type: "buff",
        target: "allFriendlyMinions",
        attack: 2,
        health: 2,
      },
    ],
  },
];

rainbowCards = [
  {
    cost: 1,
    attack: 1,
    health: 1,
    text: "On Play: Restore 2 Health to your Hero.",
    effects: [
      {
        type: "heal",
        amount: 2,
      },
    ],
  },
  {
    cost: 1,
    attack: 1,
    health: 1,
    text: "On Death: Draw 1 card.",
    effects: [
      {
        trigger: "onDeath",
        type: "draw",
        amount: 1,
      },
    ],
  },
  {
    cost: 2,
    attack: 1,
    health: 2,
    text: "On Play: Draw 1 card.",
    effects: [
      {
        trigger: "onPlay",
        type: "draw",
        amount: 1,
      },
    ],
  },
  {
    cost: 2,
    attack: 2,
    health: 2,
    text: "On Play: Deal 1 damage to an enemy minion.",
    effects: [
      {
        trigger: "onPlay",
        type: "damage",
        target: "enemyMinion",
        amount: 1,
      },
    ],
  },
  {
    cost: 3,
    attack: 2,
    health: 3,
    text: "On Play: Draw 1 card.",
    effects: [
      {
        trigger: "onPlay",
        type: "draw",
        amount: 1,
      },
    ],
  },
  {
    cost: 3,
    attack: 2,
    health: 3,
    text: "On Play: Deal 2 damage to an enemy minion.",
    effects: [
      {
        trigger: "onPlay",
        type: "damage",
        target: "enemyMinion",
        amount: 2,
      },
    ],
  },
  {
    cost: 5,
    attack: 4,
    health: 4,
    text: "On Play: Deal 2 damage to an enemy minion. Draw 1 card.",
    effects: [
      {
        trigger: "onPlay",
        type: "damage",
        target: "enemyMinion",
        amount: 2,
      },
      {
        type: "draw",
        amount: 1,
      },
    ],
  },
  {
    name: "Spark",
    type: "spell",
    cost: 1,
    text: "Draw 1 card.",
    effects: [
      {
        type: "draw",
        amount: 1,
      },
    ],
  },
  {
    name: "Splash",
    type: "spell",
    cost: 1,
    text: "Deal 2 damage to an enemy minion.",
    effects: [
      {
        type: "damage",
        target: "enemyMinion",
        amount: 2,
      },
    ],
  },
  {
    name: "Flash",
    type: "spell",
    cost: 2,
    text: "Deal 2 damage to an enemy minion. Draw 1 card.",
    effects: [
      {
        type: "damage",
        target: "enemyMinion",
        amount: 2,
      },
      {
        type: "draw",
        amount: 1,
      },
    ],
  },
  {
    name: "Ward",
    type: "spell",
    cost: 1,
    text: "Give a friendly minion +1/+2.",
    effects: [
      {
        type: "buff",
        target: "friendlyMinion",
        attack: 1,
        health: 2,
      },
    ],
  },
  {
    name: "Split",
    type: "spell",
    cost: 3,
    text: "Draw 2 cards.",
    effects: [
      {
        type: "draw",
        amount: 2,
      },
    ],
  },
  {
    name: "Beam",
    type: "spell",
    cost: 3,
    text: "Deal 4 damage to an enemy minion.",
    effects: [
      {
        type: "damage",
        target: "enemyMinion",
        amount: 4,
      },
    ],
  },
  {
    name: "Wave",
    type: "spell",
    cost: 4,
    text: "Deal 3 damage to all enemy minions.",
    effects: [
      {
        type: "damage",
        target: "allEnemyMinions",
        amount: 3,
      },
    ],
  },
  {
    name: "Last Light",
    type: "spell",
    cost: 7,
    unique: true,
    text: "Deal 4 damage to all enemy minions. Draw 2 cards.",
    effects: [
      {
        type: "damage",
        target: "allEnemyMinions",
        amount: 4,
      },
      {
        type: "draw",
        amount: 2,
      },
    ],
  },
];

unicornCollection = {
  key: "unicorn",
  label: "Unicorns",
  accent: "#ff9ecf",
  cards: unicornCards,
};

rainbowCollection = {
  key: "rainbow",
  label: "Rainbow Fairies",
  accent: "#7fd7ff",
  cards: rainbowCards,
};

playerDeckSources = [unicornCollection, rainbowCollection];

getDeckCopiesLimit = (cardConfig) =>
  cardConfig.unique ? 1 : DEFAULT_DECK_COPIES;

inferCardTheme = (cardConfig) => {
  if (unicornCards.includes(cardConfig)) return "unicorn";
  if (rainbowCards.includes(cardConfig)) return "rainbow";
  if (enemyStarterDeckConfig.includes(cardConfig)) return "enemy";
  return "neutral";
};

enemyDeckCards = [
  {
    cost: 1,
    attack: 2,
    health: 3,
  },
  {
    cost: 2,
    attack: 3,
    health: 3,
    text: "On Play: Deal 1 damage to the enemy hero.",
    effects: [
      {
        trigger: "onPlay",
        type: "damage",
        amount: 1,
      },
    ],
  },
  {
    cost: 2,
    attack: 2,
    health: 4,
    text: "On Play: Deal 1 damage to an enemy minion.",
    effects: [
      {
        trigger: "onPlay",
        type: "damage",
        target: "enemyMinion",
        amount: 1,
      },
    ],
  },
  {
    cost: 3,
    attack: 4,
    health: 4,
  },
  {
    cost: 4,
    attack: 5,
    health: 5,
  },
  {
    cost: 4,
    attack: 4,
    health: 6,
    text: "On Play: Deal 2 damage to an enemy minion.",
    effects: [
      {
        trigger: "onPlay",
        type: "damage",
        target: "enemyMinion",
        amount: 2,
      },
    ],
  },
  {
    cost: 6,
    attack: 7,
    health: 7,
  },
  {
    name: "Siphon",
    type: "spell",
    cost: 2,
    text: "Deal 3 damage to an enemy minion. Restore 2 Health.",
    effects: [
      {
        type: "damage",
        target: "enemyMinion",
        amount: 3,
      },
      {
        type: "heal",
        amount: 2,
      },
    ],
  },
  {
    name: "Fade",
    type: "spell",
    cost: 3,
    text: "Deal 4 damage to an enemy minion and 1 damage to the enemy hero.",
    effects: [
      {
        type: "damage",
        target: "enemyMinion",
        amount: 4,
      },
      {
        type: "damage",
        amount: 1,
      },
    ],
  },
  {
    name: "Color Bully",
    cost: 5,
    attack: 5,
    health: 6,
    unique: true,
    text: "On Play: Deal 4 damage to all enemy minions.",
    effects: [
      {
        trigger: "onPlay",
        type: "damage",
        target: "allEnemyMinions",
        amount: 4,
      },
    ],
  },
  {
    name: "Greyfall",
    type: "spell",
    cost: 7,
    unique: true,
    text: "Deal 5 damage to all enemy minions and 5 damage to the enemy hero.",
    effects: [
      {
        type: "damage",
        target: "allEnemyMinions",
        amount: 5,
      },
      {
        type: "damage",
        amount: 5,
      },
    ],
  },
];

latin = ["I", "II", "III", "IV", "V", "VI", "VII"];

setMinionNames = (cards, faction) => {
  cards.forEach((card) => {
    if (!card.name) {
      card.name = `${faction} ${latin[card.cost - 1]}${card.effects ? " *" : ""}`;
    }
  });
};

setMinionNames(unicornCards, "Unicorn");
setMinionNames(rainbowCards, "Fairy");
setMinionNames(enemyDeckCards, "Minion");

enemyStarterDeckConfig = [
  ...enemyDeckCards.slice(0, 9).flatMap((card) => [card, card]),
  ...enemyDeckCards.slice(9),
];
