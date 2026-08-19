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
rectFromZone = (zone) => {
  return {
    x: zone[0],
    y: zone[1],
    width: zone[2],
    height: zone[3],
  };
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
