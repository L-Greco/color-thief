DECK_SIZE = 20;
DEFAULT_DECK_COPIES = 2;

unicornCollection = {
  key: "unicorn",
  label: "Unicorn",
  accent: "#ff9ecf",
  cards: [
    {
      name: "Sunbeam Unicorn",
      type: "minion",
      cost: 2,
      attack: 2,
      health: 3,
    },
    {
      name: "Cloud Mane",
      type: "minion",
      cost: 3,
      attack: 3,
      health: 4,
    },
    {
      name: "Moonhorn Charger",
      type: "minion",
      cost: 4,
      attack: 4,
      health: 4,
    },
    {
      name: "Starlight Blessing",
      type: "spell",
      cost: 2,
      effects: [
        {
          type: "heal",
          amount: 3,
        },
      ],
    },
    {
      name: "Aurora Matriarch",
      type: "minion",
      cost: 6,
      attack: 6,
      health: 7,
      unique: true,
    },
  ],
};

rainbowCards = [
  {
    name: "Rainbow Goblin",
    type: "minion",
    cost: 1,
    attack: 1,
    health: 2,
  },
  {
    name: "Color Sprite",
    type: "minion",
    cost: 1,
    attack: 1,
    health: 1,
    effects: [
      {
        trigger: "onDeath",
        type: "draw",
        amount: 1,
      },
    ],
  },
  {
    name: "Prism Pixie",
    type: "minion",
    cost: 2,
    attack: 1,
    health: 2,
    effects: [
      {
        trigger: "onPlay",
        type: "draw",
        amount: 1,
      },
    ],
  },
  {
    name: "Paintling",
    type: "minion",
    cost: 2,
    attack: 2,
    health: 2,
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
    name: "Spectrum Mage",
    type: "minion",
    cost: 3,
    attack: 2,
    health: 3,
    effects: [
      {
        trigger: "onPlay",
        type: "draw",
        amount: 1,
      },
    ],
  },
  {
    name: "Aurora Witch",
    type: "minion",
    cost: 3,
    attack: 2,
    health: 3,
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
    name: "Rainbow Alchemist",
    type: "minion",
    cost: 4,
    attack: 3,
    health: 3,
    effects: [
      {
        trigger: "onPlay",
        type: "draw",
        amount: 1,
      },
    ],
  },
  {
    name: "Prism Dragon",
    type: "minion",
    cost: 5,
    attack: 4,
    health: 4,
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
    name: "Rainbow Phoenix",
    type: "minion",
    cost: 5,
    attack: 3,
    health: 4,
    effects: [
      {
        trigger: "onDeath",
        type: "draw",
        amount: 2,
      },
    ],
  },
  {
    name: "Spectrum Giant",
    type: "minion",
    cost: 6,
    attack: 5,
    health: 5,
    unique: true,
    effects: [
      {
        trigger: "onPlay",
        type: "draw",
        amount: 1,
      },
    ],
  },
  {
    name: "Rainbow Spark",
    type: "spell",
    cost: 1,
    effects: [
      {
        type: "draw",
        amount: 1,
      },
    ],
  },
  {
    name: "Color Splash",
    type: "spell",
    cost: 1,
    effects: [
      {
        type: "damage",
        target: "enemyMinion",
        amount: 2,
      },
    ],
  },
  {
    name: "Prism Bolt",
    type: "spell",
    cost: 2,
    effects: [
      {
        type: "damage",
        target: "enemyMinion",
        amount: 3,
      },
    ],
  },
  {
    name: "Chromatic Shield",
    type: "spell",
    cost: 2,
    effects: [
      {
        type: "buff",
        target: "friendlyMinion",
        attack: 0,
        health: 3,
      },
    ],
  },
  {
    name: "Refraction",
    type: "spell",
    cost: 3,
    effects: [
      {
        type: "draw",
        amount: 2,
      },
    ],
  },
  {
    name: "Rainbow Beam",
    type: "spell",
    cost: 3,
    effects: [
      {
        type: "damage",
        target: "enemyMinion",
        amount: 4,
      },
    ],
  },
  {
    name: "Color Wave",
    type: "spell",
    cost: 4,
    effects: [
      {
        type: "damage",
        target: "allEnemyMinions",
        amount: 2,
      },
    ],
  },
  {
    name: "Refract",
    type: "spell",
    cost: 4,
    effects: [
      {
        type: "returnToHand",
        target: "enemyMinion",
      },
    ],
  },
  {
    name: "Double Rainbow",
    type: "spell",
    cost: 5,
    unique: true,
    effects: [
      {
        type: "draw",
        amount: 3,
      },
    ],
  },
  {
    name: "Spectrum Burst",
    type: "spell",
    cost: 6,
    unique: true,
    effects: [
      {
        type: "damage",
        target: "allEnemyMinions",
        amount: 3,
      },
    ],
  },
];

rainbowCollection = {
  key: "rainbow",
  label: "Rainbow",
  accent: "#7fd7ff",
  cards: rainbowCards,
};

playerDeckSources = [unicornCollection, rainbowCollection];

createCardConfig = (cardConfig) => ({
  name: cardConfig.name,
  type: cardConfig.type || "minion",
  cost: cardConfig.cost || 0,
  attack: cardConfig.attack ?? 0,
  health: cardConfig.health ?? 0,
  unique: !!cardConfig.unique,
  effects: (cardConfig.effects || []).map((effect) => ({ ...effect })),
});

getDeckCopiesLimit = (cardConfig) =>
  cardConfig.unique ? 1 : DEFAULT_DECK_COPIES;

enemyStarterDeckConfig = [
  createCardConfig(unicornCollection.cards[0]),
  createCardConfig(unicornCollection.cards[0]),
  createCardConfig(unicornCollection.cards[1]),
  createCardConfig(unicornCollection.cards[1]),
  createCardConfig(unicornCollection.cards[2]),
  createCardConfig(unicornCollection.cards[2]),
  createCardConfig(unicornCollection.cards[3]),
  createCardConfig(unicornCollection.cards[3]),
  createCardConfig(unicornCollection.cards[4]),
  createCardConfig(rainbowCollection.cards[0]),
  createCardConfig(rainbowCollection.cards[0]),
  createCardConfig(rainbowCollection.cards[1]),
  createCardConfig(rainbowCollection.cards[1]),
  createCardConfig(rainbowCollection.cards[2]),
  createCardConfig(rainbowCollection.cards[2]),
  createCardConfig(rainbowCollection.cards[3]),
  createCardConfig(rainbowCollection.cards[3]),
  createCardConfig(rainbowCollection.cards[10]),
  createCardConfig(rainbowCollection.cards[14]),
  createCardConfig(rainbowCollection.cards[19]),
];
