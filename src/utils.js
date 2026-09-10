lerp = (start, end, t) => start + (end - start) * t;
easeIn = (x) => x * x;
easeOut = (x) => sin((x * PI) / 2);
pointCollision = (rect, point) => {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
};
compareCardsByCost = (a, b) => a.cost - b.cost || a.name.localeCompare(b.name);

drawWrappedText = (text, x, y, maxWidth, lineHeight, maxLines = 2) => {
  const lines = [];
  let line = "";

  text.split(" ").forEach((word) => {
    const nextLine = line ? `${line} ${word}` : word;

    if (ctx.measureText(nextLine).width <= maxWidth || !line) {
      line = nextLine;
      return;
    }

    lines.push(line);
    line = word;
  });

  if (line) lines.push(line);
  lines.slice(0, maxLines).forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
};

shuffle = (cards) => {
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = floor(random() * (i + 1));
    const temp = cards[i];
    cards[i] = cards[j];
    cards[j] = temp;
  }
};

const math = Math;
Object.getOwnPropertyNames(math).forEach(
  (n) => (window[n] = window[n] || math[n]),
);
