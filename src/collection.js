DECK_SIZE = 20;
DEFAULT_DECK_COPIES = 2;

unicornCards = [
  {
    name: "Tiny Hoof",
    type: "minion",
    cost: 1,
    attack: 1,
    health: 2,
  },
  {
    name: "Sparkhorn Foal",
    type: "minion",
    cost: 1,
    attack: 2,
    health: 1,
  },
  {
    name: "Sunbeam Unicorn",
    type: "minion",
    cost: 2,
    attack: 2,
    health: 3,
  },
  {
    name: "Cloudmane Charger",
    type: "minion",
    cost: 2,
    attack: 3,
    health: 2,
  },
  {
    name: "Stable Guardian",
    type: "minion",
    cost: 2,
    attack: 2,
    health: 4,
  },
  {
    name: "Silverhorn Knight",
    type: "minion",
    cost: 3,
    attack: 3,
    health: 4,
  },
  {
    name: "Battle Unicorn",
    type: "minion",
    cost: 3,
    attack: 4,
    health: 3,
  },
  {
    name: "Healing Mare",
    type: "minion",
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
    name: "Hornbreaker",
    type: "minion",
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
    type: "minion",
    cost: 7,
    attack: 7,
    health: 8,
    unique: true,
    text: "On Play: Give all friendly minions +1/+1.",
    effects: [
      {
        trigger: "onPlay",
        type: "buff",
        target: "allFriendlyMinions",
        attack: 1,
        health: 1,
      },
    ],
  },
  {
    name: "Battle Cry",
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
    name: "Golden Mane",
    type: "spell",
    cost: 2,
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
    name: "Horn Strike",
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
    name: "Royal Blessing",
    type: "spell",
    cost: 3,
    text: "Give a friendly minion +2/+2.",
    effects: [
      {
        type: "buff",
        target: "friendlyMinion",
        attack: 2,
        health: 2,
      },
    ],
  },
  {
    name: "Charge of the Herd",
    type: "spell",
    cost: 4,
    text: "Give all friendly minions +1/+1.",
    effects: [
      {
        type: "buff",
        target: "allFriendlyMinions",
        attack: 1,
        health: 1,
      },
    ],
  },
];

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
    name: "Prism Pixie",
    type: "minion",
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
    name: "Paintling",
    type: "minion",
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
    name: "Spectrum Mage",
    type: "minion",
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
    name: "Aurora Witch",
    type: "minion",
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
    name: "Prism Dragon",
    type: "minion",
    cost: 5,
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
    name: "Rainbow Spark",
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
    name: "Color Splash",
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
    name: "Prism Bolt",
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
    name: "Chromatic Shield",
    type: "spell",
    cost: 2,
    text: "Give a friendly minion +0/+3.",
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
    text: "Draw 2 cards.",
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
    name: "Color Wave",
    type: "spell",
    cost: 4,
    text: "Deal 2 damage to all enemy minions.",
    effects: [
      {
        type: "damage",
        target: "allEnemyMinions",
        amount: 2,
      },
    ],
  },
  {
    name: "The Last Rainbow",
    type: "spell",
    cost: 7,
    unique: true,
    text: "Deal 3 damage to all enemy minions. Draw 2 cards.",
    effects: [
      {
        type: "damage",
        target: "allEnemyMinions",
        amount: 3,
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
  label: "Unicorn",
  accent: "#ff9ecf",
  cards: unicornCards,
};

rainbowCollection = {
  key: "rainbow",
  label: "Rainbow",
  accent: "#7fd7ff",
  cards: rainbowCards,
};

playerDeckSources = [unicornCollection, rainbowCollection];

getDeckCopiesLimit = (cardConfig) =>
  cardConfig.unique ? 1 : DEFAULT_DECK_COPIES;

enemyStarterDeckConfig = [
  {
    name: "Grey Grunt",
    type: "minion",
    cost: 1,
    attack: 2,
    health: 3,
  },
  {
    name: "Grey Grunt",
    type: "minion",
    cost: 1,
    attack: 2,
    health: 3,
  },
  {
    name: "Shade Snatcher",
    type: "minion",
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
    name: "Shade Snatcher",
    type: "minion",
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
    name: "Pigment Parasite",
    type: "minion",
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
    name: "Pigment Parasite",
    type: "minion",
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
    name: "Hue Hunter",
    type: "minion",
    cost: 3,
    attack: 4,
    health: 4,
  },
  {
    name: "Hue Hunter",
    type: "minion",
    cost: 3,
    attack: 4,
    health: 4,
  },
  {
    name: "Color Crusher",
    type: "minion",
    cost: 4,
    attack: 5,
    health: 5,
  },
  {
    name: "Color Crusher",
    type: "minion",
    cost: 4,
    attack: 5,
    health: 5,
  },
  {
    name: "Prism Breaker",
    type: "minion",
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
    name: "Prism Breaker",
    type: "minion",
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
    name: "Void Beast",
    type: "minion",
    cost: 6,
    attack: 7,
    health: 7,
  },
  {
    name: "Void Beast",
    type: "minion",
    cost: 6,
    attack: 7,
    health: 7,
  },
  {
    name: "Drain Color",
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
    name: "Drain Color",
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
    name: "Fade Away",
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
    name: "Fade Away",
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
    type: "minion",
    cost: 5,
    attack: 5,
    health: 6,
    unique: true,
    text: "On Play: Deal 4 damage to all enemy minions and 4 damage to the enemy hero.",
    effects: [
      {
        trigger: "onPlay",
        type: "damage",
        target: "allEnemyMinions",
        amount: 4,
      },
      {
        trigger: "onPlay",
        type: "damage",
        amount: 4,
      },
    ],
  },
  {
    name: "Total Desaturation",
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
