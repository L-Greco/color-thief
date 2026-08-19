class Audio {
  frequency = 440;
  duration = 0.2;
  volume = 0.1;
  constructor() {
    this.audioctx = new AudioContext();
  }

  play() {
    const oscillator = this.audioctx.createOscillator();
    const gain = this.audioctx.createGain();

    const now = this.audioctx.currentTime;

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(this.frequency, now);

    gain.gain.setValueAtTime(this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + this.duration);

    oscillator.connect(gain);
    gain.connect(this.audioctx.destination);

    oscillator.start(now);
    oscillator.stop(now + this.duration);
  }

  resume() {
    if (this.audioctx.state === "suspended") {
      this.audioctx.resume();
    }
  }
}

const CARD_DRAW_SOUND = [
  0.22,
  0.04,
  520,
  0.005,
  0.02,
  0.08,
  1,
  1,
  140,
  0,
  0,
  0,
  0,
  0.08,
];
