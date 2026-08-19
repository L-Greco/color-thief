canvas = document.getElementById("game");

// To context επιστρέφει το 2D rendering context και ουσιαστικα αυτο σχεδιαζει.
context = canvas.getContext("2d");

// Στο Canvas το (0, 0) είναι πάνω αριστερά για αυτο το θετικό Υ πηγαίνει προς τα κάτω και το θετικο Χ στα δεξια.:
// (0,0) ────────────────→ x
//   │
//   │       (100,100)
//   │          ████
//   │          ████
//   │
//   ↓
//   y

drawBox = () => context.fillRect(100, 150, 50, 50);
drawPerson = () =>
  context.fillRect(person.x, person.y, person.width, person.height);
enemyStatus = [0, 0, 1280, 60];
enemyBoard = [0, 60, 1280, 190];
playerBoard = [0, 250, 1280, 190];
playerHand = [0, 440, 1280, 220];
playerStatus = [0, 660, 1280, 60];
drawBoard = () => {
  // Enemy Status
  context.strokeStyle = "black";
  context.lineWidth = 3;
  context.strokeRect(...enemyStatus);
  // Enemy Board
  context.strokeStyle = "black";
  context.lineWidth = 3;
  context.strokeRect(...enemyBoard);
  // Draw the text
  context.font = "24px Arial";
  context.fillStyle = "black";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("enemy board", 200, 100);

  // Player Board
  context.strokeStyle = "black";
  context.lineWidth = 3;
  context.strokeRect(...playerBoard);
  //   Draw the text
  context.font = "24px Arial";
  context.fillStyle = "black";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("enemy status", 200, 30);

  // Draw the text
  context.font = "24px Arial";
  context.fillStyle = "black";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("player board", 200, 345);

  // Player Hand
  context.strokeStyle = "black";
  context.lineWidth = 3;
  context.strokeRect(...playerHand);

  // Draw the text
  context.font = "24px Arial";
  context.fillStyle = "black";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("player hand", 200, 550);

  // Player Status
  context.strokeStyle = "black";
  context.lineWidth = 3;
  context.strokeRect(...playerStatus);

  // Draw the text
  context.font = "24px Arial";
  context.fillStyle = "black";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("player status", 200, 690);
};
