const player = new Player();
const enemy = new Player();
const game = new Game(player, enemy);
if (game.state === states.test) {
  drawBox();
  drawPerson();
}

renderedCards = cardConfigs.map(
  (card) =>
    new Card(card.x, card.y, card.width, card.height, card.name, card.cost),
);
drawCards = () => renderedCards.forEach((card) => card.draw());
console.log(game, renderedCards);

let previousTimeStamp = 0;

function update(delta) {
  let directionX = 0;
  let directionY = 0;

  const deltaSeconds = delta / 1000;

  if (actions.moveUp) directionY -= 1;
  if (actions.moveDown) directionY += 1;
  if (actions.moveRight) directionX += 1;
  if (actions.moveLeft) directionX -= 1;

  // Το μηκος του vector ειναι το sqrt( x^2 + y^2 ) και το χρησιμοποιουμε για να κανονικοποιησουμε τον vector κινησης.
  const length = Math.sqrt(directionX * directionX + directionY * directionY);

  // Διαγωνιος κινηση.
  if (length > 0) {
    directionX /= length;
    directionY /= length;
  }
  const futurePositionX = person.x + directionX * person.speed * deltaSeconds;
  const futurePositionY = person.y + directionY * person.speed * deltaSeconds;

  if (
    !detectCollision(
      { x: 100, y: 150, width: 50, height: 50 },
      {
        x: futurePositionX,
        y: futurePositionY,
        width: person.width,
        height: person.height,
      },
    )
  ) {
    person.x += directionX * person.speed * deltaSeconds;
    person.y += directionY * person.speed * deltaSeconds;
  }
  renderedCards.forEach((card) => {
    const isMouseOver = pointCollision(
      {
        x: card.x,
        y: card.y,
        width: card.width,
        height: card.height,
      },
      mousePosition,
    );

    card.setHover(isMouseOver);
    card.update(deltaSeconds);
  });
}
function pointCollision(rect, point) {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}
function detectCollision(rect1, rect2) {
  return !(
    rect1.x + rect1.width < rect2.x ||
    rect1.x > rect2.x + rect2.width ||
    rect1.y + rect1.height < rect2.y ||
    rect1.y > rect2.y + rect2.height
  );
}
function normalizeDelta(delta) {
  if (delta < 0) return 0;
  if (delta > MAX_DELTA) return MAX_DELTA;
  return delta;
}

function gameLoop(timestamp) {
  // Το timestamp ειναι μεταβλητη που δινει το requestAnimationFrame τον συνολικο χρονο που περασε απο ενα συγκεκριμενο time origin.
  // delta ===  χρονος αναμεσα στα frames
  let delta = 0;

  if (previousTimeStamp !== 0) {
    delta = timestamp - previousTimeStamp;
  }
  previousTimeStamp = timestamp;

  // Πρωτα το update
  update(normalizeDelta(delta));
  // Τωρα το render
  // Σβηνω το υπαρχον
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (game.state === states.test) {
    drawBox();
    drawPerson();
  }
  drawBoard();
  drawCards();

  // Ζητάμε από τον browser να καλέσει το gameLoop ξανά στο επόμενο frame.
  // Αλλιώς θα τρεξει μονο μια φορά και θα σταματήσει.
  requestAnimationFrame(gameLoop);
}
// Τρεχει την callback στο επομενο frame που θα ζωγραφισει ο browser, παραλληλα γυρναει και εναν ακυρωσιμο identifier.
requestAnimationFrame(gameLoop);
