class Player {
  name = "Player";
  health = 20;
  maxHealth = 20;

  mana = 1;
  maxMana = 1;

  deck = [];
  hand = [];
  board = [];

  constructor(name = "Player") {
    this.name = name;
  }

  setDeck(deck) {
    this.deck = deck;
  }

  drawCard() {
    if (this.hand.length >= HAND_LIMIT) return null;

    const card = this.deck.pop();

    if (!card) return null;

    this.hand.push(card);
    return card;
  }

  drawCards(count) {
    for (let i = 0; i < count; i += 1) {
      if (!this.drawCard()) break;
    }
  }

  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  spendMana(amount) {
    if (amount > this.mana) return false;

    this.mana -= amount;
    return true;
  }
  addMana(amount) {
    this.maxMana += amount;
  }
  refillMana() {
    this.mana = this.maxMana;
  }
}
