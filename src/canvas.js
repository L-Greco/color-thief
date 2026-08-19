canvas = document.getElementById("game");
ctx = canvas.getContext("2d");
enemyStatus = [0, 0, 1280, 60];
enemyBoard = [0, 60, 1280, 190];
playerBoard = [0, 250, 1280, 190];
playerHand = [0, 440, 1280, 220];
playerStatus = [0, 660, 1280, 60];
drawBoard = () => {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.font = "24px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.strokeRect(...enemyStatus);
  ctx.fillText("enemy status", 200, 30);

  ctx.strokeRect(...enemyBoard);
  ctx.fillText("enemy board", 200, 100);

  ctx.strokeRect(...playerBoard);
  ctx.fillText("player board", 200, 345);

  ctx.strokeRect(...playerHand);
  ctx.fillText("player hand", 200, 550);

  ctx.strokeRect(...playerStatus);
  ctx.fillText("player status", 200, 690);
};
