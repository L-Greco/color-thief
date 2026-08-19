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
  0.22, // volume
  0.04, // randomness
  520, // frequency
  0.005, // attack
  0.02, // sustain
  0.08, // release
  1, // shape: triangle
  1, // shapeCurve
  140, // slide
  0, // deltaSlide
  0, // pitchJump
  0, // pitchJumpTime
  0, // repeatTime
  0.08, // noise
];
