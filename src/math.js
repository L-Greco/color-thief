lerp = (start, end, t) => start + (end - start) * t;
easeIn = (x) => x * x;
easeOut = (x) => sin((x * PI) / 2);
const math = Math;
Object.getOwnPropertyNames(math).forEach(
  (n) => (window[n] = window[n] || math[n]),
);
