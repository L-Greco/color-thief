class IntroScreen {
  constructor(game) {
    this.game = game;
    this.titleExitProgress = 0;
    this.storyTime = 0;
    this.thiefMusicStarted = false;
  }

  update(delta) {
    if (this.titleExitProgress < 1) {
      this.titleExitProgress = min(
        1,
        this.titleExitProgress + delta / INTRO_TITLE_EXIT_DURATION,
      );
      return;
    }

    this.storyTime += delta;

    if (
      !this.thiefMusicStarted &&
      this.storyTime >= this.getThiefStartTime()
    ) {
      this.thiefMusicStarted = this.startColorThiefMusic();
    }
  }

  draw() {
    const background = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    background.addColorStop(0, "#05070f");
    background.addColorStop(0.55, "#0c1024");
    background.addColorStop(1, "#15112a");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawStarfield(this.game.stars);
    this.drawPlanet();

    if (this.titleExitProgress < 1) {
      this.drawTitle();
      return;
    }

    this.drawColorEssence();
    this.drawThief();
    this.drawStoryText();
  }

  drawPlanet() {
    drawStoryPlanet(
      canvas.width * 0.72,
      canvas.height * 0.58,
      210,
      this.getDrainProgress(),
    );
  }

  drawTitle() {
    const exitProgress = easeIn(this.titleExitProgress);
    const x = 105 - exitProgress * (canvas.width + 420);

    ctx.shadowColor = "rgba(230, 241, 255, 0.55)";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#f8f6e9";
    ctx.font = "900 92px Georgia";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("Color", x, 302);
    ctx.fillText("Thief", x, 390);
    ctx.shadowColor = "transparent";
  }

  getThiefEnterProgress() {
    return min(
      1,
      max(
        0,
        (this.storyTime - this.getThiefStartTime()) / INTRO_THIEF_ENTER_DURATION,
      ),
    );
  }

  getThiefStartTime() {
    return (
      INTRO_FIRST_LINE_DURATION +
      INTRO_SECOND_LINE_DURATION +
      INTRO_THIEF_WAIT_DURATION
    );
  }

  getDrainProgress() {
    return min(
      1,
      max(
        0,
        (this.storyTime - this.getThiefStartTime() - INTRO_THIEF_ENTER_DURATION) /
          INTRO_DRAIN_DURATION,
      ),
    );
  }

  getStoryFadeProgress() {
    const drainEnd =
      this.getThiefStartTime() + INTRO_THIEF_ENTER_DURATION + INTRO_DRAIN_DURATION;

    return min(
      1,
      max(0, (this.storyTime - drainEnd) / INTRO_STORY_FADE_DURATION),
    );
  }

  getFinalMessageProgress() {
    const finalMessageStart =
      this.getThiefStartTime() +
      INTRO_THIEF_ENTER_DURATION +
      INTRO_DRAIN_DURATION +
      INTRO_STORY_FADE_DURATION;

    return min(
      1,
      max(
        0,
        (this.storyTime - finalMessageStart) / INTRO_FINAL_MESSAGE_FADE_DURATION,
      ),
    );
  }

  drawThief() {
    const enterProgress = easeOut(this.getThiefEnterProgress());
    const x = lerp(canvas.width + 80, 300, enterProgress);
    drawColorThief(x, 100, 5.2, this.getDrainProgress());
  }

  drawColorEssence() {
    const drainProgress = this.getDrainProgress();
    if (drainProgress <= 0) return;

    const planetX = canvas.width * 0.72;
    const planetY = canvas.height * 0.58;
    const colors = ["#f85b9d", "#f58b04", "#fbe201", "#1af6fb", "#0260fb", "#a500f7"];

    for (let index = 0; index < INTRO_ESSENCE_PARTICLE_COUNT; index += 1) {
      const color = colors[index % colors.length];
      const progress = max(0, min(1, drainProgress * 2 - index * 0.055));
      const sourceX = planetX + cos(index * 1.3) * 130;
      const sourceY = planetY + sin(index * 1.3) * 130;
      const targetX = 480;
      const targetY = 410;
      const absorbOpacity = min(1, (1 - progress) * 4);

      ctx.fillStyle = color;
      ctx.globalAlpha = absorbOpacity;
      ctx.beginPath();
      ctx.arc(
        lerp(sourceX, targetX, easeIn(progress)),
        lerp(sourceY, targetY, easeIn(progress)),
        10 - progress * 4,
        0,
        PI * 2,
      );
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  drawStoryText() {
    const storyFadeProgress = this.getStoryFadeProgress();
    const finalMessageProgress = this.getFinalMessageProgress();
    const secondLineStart = INTRO_FIRST_LINE_DURATION;
    const secondLineEnd = secondLineStart + INTRO_SECOND_LINE_DURATION;

    ctx.shadowColor = "rgba(230, 241, 255, 0.55)";
    ctx.shadowBlur = 14;
    ctx.fillStyle = "#f8f6e9";
    ctx.font = "bold 28px Georgia";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.globalAlpha = 1 - storyFadeProgress;

    if (this.storyTime < INTRO_FIRST_LINE_DURATION) {
      ctx.fillText(
        "On the planet Chroma, unicorns and rainbows lived happily and peacefully.",
        canvas.width / 2,
        110,
      );
    }

    if (this.storyTime >= secondLineStart && this.storyTime < secondLineEnd) {
      ctx.fillText(
        "Until the Color Thief appeared and stole their color essence!",
        canvas.width / 2,
        110,
      );
    }

    if (finalMessageProgress > 0) {
      ctx.globalAlpha = finalMessageProgress;
      ctx.fillText(
        "Now unicorns and rainbow fairies must unite to defeat the Color Thief!",
        canvas.width / 2,
        110,
      );
    }

    if (finalMessageProgress === 1) {
      const promptOpacity = 0.65 + sin(this.storyTime / 240) * 0.25;
      ctx.globalAlpha = promptOpacity;
      ctx.font = "bold 20px Georgia";
      ctx.fillText("Press Enter or Space to continue", canvas.width / 2, 164);
      ctx.font = "16px Georgia";
      ctx.fillText("Press I for game info", canvas.width / 2, 194);
    }

    ctx.globalAlpha = 1;
    ctx.shadowColor = "transparent";
  }

  canShowGameInfo() {
    return this.getFinalMessageProgress() === 1;
  }

  startColorThiefMusic() {
    return playColorThiefMotif();
  }

  handleKeyDown(event) {
    if (
      this.getFinalMessageProgress() < 1 ||
      (event.code !== "Enter" && event.code !== "Space")
    ) {
      return false;
    }

    this.game.startDeckBuilding();
    return true;
  }

  handlePointerDown() {}

  handlePointerMove() {}

  handlePointerUp() {
    return false;
  }

  handleClick() {
    return false;
  }
}
