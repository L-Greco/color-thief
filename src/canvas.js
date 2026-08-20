canvas = document.getElementById("game");
ctx = canvas.getContext("2d");
ctx.wrap = (callback) => {
  ctx.save();
  callback();
  ctx.restore();
};

drawZoneBorder = (zone, label, textY) => {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.font = "24px Arial";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeRect(...zone);
  ctx.fillText(label, 200, textY);
};

drawBattleDebugBorders = () => {
  drawZoneBorder(BATTLE_LAYOUT.enemyStatus, "enemy status", 30);
  drawZoneBorder(BATTLE_LAYOUT.enemyBoard, "enemy board", 100);
  drawZoneBorder(BATTLE_LAYOUT.playerBoard, "player board", 345);
  drawZoneBorder(BATTLE_LAYOUT.playerHand, "player hand", 550);
  drawZoneBorder(BATTLE_LAYOUT.playerStatus, "player status", 690);
};
