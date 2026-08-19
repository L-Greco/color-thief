// context state
//     ↓
//   save()
//     ↓
// Card αλλάζει styles
//     ↓
// Card ζωγραφίζεται
//     ↓
//  restore()
//     ↓
// context όπως ήταν πριν

class Card {
  hovered = false;
  hoverDuration = 0.3;
  hoverProgress = 0;
  scale = 1;
  constructor(
    x = 0,
    y = 0,
    width = 50,
    height = 100,
    name = "Unicorn",
    cost = 0,
    health = 2,
    attack = 1,
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.name = name;
    this.cost = cost;
    this.health = health;
    this.attack = attack;
  }
  setHover(bool) {
    this.hovered = bool;
  }
  update(delta) {
    const progressDir = this.hovered ? 1 : -1;

    this.hoverProgress += progressDir * (delta / this.hoverDuration);

    this.hoverProgress = Math.max(0, Math.min(1, this.hoverProgress));

    const easedProgress = this.hovered
      ? easeOut(this.hoverProgress)
      : easeIn(this.hoverProgress);

    this.scale = lerp(1, 1.2, easedProgress);
  }
  draw() {
    // Χωρις αυτο κάθε αλλαγη στο context θα επηρεαζε και τα υπολοιπα στοιχεια.
    context.save();

    // Hover state
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;

    context.translate(centerX, centerY);
    context.scale(this.scale, this.scale);
    context.translate(-centerX, -centerY);

    // εδώ πλέον το (0, 0) είναι το κέντρο της κάρτας
    // άρα βρες από ποιο x/y πρέπει να ξεκινήσει το fillRect
    // End of hover state

    // Το fillStyle οριζει το χρωμα
    context.fillStyle = "white";
    // Σημαντικο για το canvas, πρωτα οριζω το state του και μετα ζωγραφίζω.
    //  ρύθμισε state
    //  ↓
    //  ζωγράφισε
    context.fillRect(this.x, this.y, this.width, this.height);
    // Το παχος του περιγραμματος
    context.lineWidth = 2;
    // Το χρωμα του περιγραμματος σ
    context.strokeStyle = "black";
    //  Φτιαχνει το περιγραμμα
    context.strokeRect(this.x, this.y, this.width, this.height);

    // Κυκλος για μανα
    context.beginPath();
    context.arc(this.x + 15, this.y + 15, 10, 0, Math.PI * 2);
    context.fillStyle = "#00b4d8";
    context.fill();
    // Mana cost text
    context.font = "10px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "white";
    context.fillText(this.cost, this.x + 15, this.y + 15);
    // Κυκλος για health
    context.beginPath();
    context.arc(
      this.x + this.width - 15,
      this.y + this.height - 15,
      10,
      0,
      Math.PI * 2,
    );
    context.fillStyle = "#D53B2B";
    context.fill();
    // Health  text
    context.font = "10px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "white";
    context.fillText(
      this.health,
      this.x + this.width - 15,
      this.y + this.height - 15,
    );
    // Κυκλος για attack
    context.beginPath();
    context.arc(this.x + 15, this.y + this.height - 15, 10, 0, Math.PI * 2);
    context.fillStyle = "#EFF345";
    context.fill();
    // Attack text
    context.font = "10px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "black";
    context.fillText(this.attack, this.x + 15, this.y + this.height - 15);
    // Text ρυθμισεις απο εδω και περα
    context.font = "12px Arial";
    context.textAlign = "center";
    //  context.textBaseline = 'middle';
    context.fillStyle = "black";
    context.fillText(
      this.name,
      this.x + this.width / 2,
      this.y + this.height / 3,
    );
    // To restore επαναφερει το context state στην προηγουμενη κατασταση πριν το save αφηνοντας την καινουργια καρτα.
    context.restore();
  }
}
