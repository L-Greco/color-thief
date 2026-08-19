class Player {
  health = 20;
  maxHealth = 20;

  mana = 1;
  maxMana = 1;

  deck = [];
  hand = [];

  setDeck(deck) {
    this.deck = deck;
  }

  drawCard() {
    const card = this.deck.pop();

    if (!card) return;

    this.hand.push(card);
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
