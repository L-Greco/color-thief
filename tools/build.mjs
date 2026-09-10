import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync, spawnSync } from "node:child_process";
import { runInNewContext } from "node:vm";
import { minify } from "terser";
import { Packer } from "roadroller";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BUILD_ROOT = join(ROOT, "build");
const LIMIT = 13 * 1024;
const SOURCE_FILES = [
  "src/constants.js",
  "src/collection.js",
  "src/audio/zzfx.js",
  "src/audio.js",
  "src/utils.js",
  "src/canvas.js",
  "src/game-info-modal.js",
  "src/player.js",
  "src/enemy.js",
  "src/minion-art.js",
  "src/card.js",
  "src/battle-state.js",
  "src/game.js",
  "src/starting-screen.js",
  "src/intro-screen.js",
  "src/deck-building-screen.js",
  "src/battle-screen.js",
  "src/game-over-screen.js",
  "src/input.js",
  "src/main.js",
];
const DEBUG_SOURCE_FILES = [
  ...SOURCE_FILES.slice(0, -1),
  "src/debug.js",
  SOURCE_FILES.at(-1),
];
const CARD_TYPES = ["minion", "spell"];
const EFFECT_TRIGGERS = ["onPlay", "onDeath"];
const EFFECT_TYPES = ["draw", "heal", "damage", "buff", "returnToHand"];
const EFFECT_TARGETS = [
  "friendlyMinion",
  "enemyMinion",
  "allFriendlyMinions",
  "allEnemyMinions",
];

// These fields are owned by the game. Browser, Canvas, Audio, DOM, and image
// API properties are intentionally absent from this list.
const MANGLED_PROPERTIES = [
  "accent",
  "amount",
  "attack",
  "attackDirectionX",
  "attackDirectionY",
  "attackEffectTime",
  "attackOffsetX",
  "attackOffsetY",
  "attackRotation",
  "attackScaleBoost",
  "battle",
  "board",
  "canAttack",
  "canLeave",
  "cardsPerPage",
  "closeRect",
  "cost",
  "deck",
  "deathEffectTime",
  "deathOverlayAlpha",
  "deathRise",
  "deathScale",
  "dragCard",
  "dragOffset",
  "drawAlpha",
  "drawEffectDelay",
  "drawEffectTime",
  "drawStartX",
  "drawStartY",
  "drawTargetX",
  "drawTargetY",
  "endTurnPressed",
  "endTurnRect",
  "effects",
  "ended",
  "enemy",
  "enemyBoard",
  "enemyDeckRect",
  "enemyHeroRect",
  "enemyStatus",
  "enemyPreviewCard",
  "enemyPreviewTimer",
  "enemyStepDelay",
  "enemyStepTimer",
  "game",
  "gameInfoModal",
  "hand",
  "health",
  "hitEffectTime",
  "hitOverlayAlpha",
  "hitRotation",
  "hoverDuration",
  "hoverProgress",
  "hovered",
  "isCloseHovered",
  "isDying",
  "isOpen",
  "isTargetSource",
  "key",
  "knownPlayerHandCards",
  "label",
  "lastStatusAt",
  "mana",
  "maxHealth",
  "maxMana",
  "mulliganActive",
  "mulliganCards",
  "mulliganKeepRect",
  "mulliganRedrawRect",
  "name",
  "nextPageRect",
  "ok",
  "outcome",
  "pendingMinionDeaths",
  "player",
  "playerBoard",
  "playerDeckConfig",
  "playerDeckRect",
  "playerHand",
  "playerHeroRect",
  "playerStatus",
  "prevPageRect",
  "promptTime",
  "reason",
  "screen",
  "selectedAction",
  "selectedDeck",
  "selectedSource",
  "sourceCardsPage",
  "sourceDeckButtons",
  "stars",
  "startBattleRect",
  "statusMessage",
  "storyTime",
  "suppressClick",
  "target",
  "targetType",
  "text",
  "thiefMusicStarted",
  "titleExitProgress",
  "theme",
  "trigger",
  "turn",
  "turnOwner",
  "turnPhase",
  "type",
  "unique",
  "victoryThemeStarted",
  "victoryTime",
];
const MANGLED_OBJECT_PROPERTIES = [
  "artBg",
  "background",
  "banner",
  "border",
  "card",
  "center",
  "color",
  "controller",
  "effectBg",
  "frame",
  "glow",
  "innerBorder",
  "kind",
  "message",
  "minion",
  "paper",
  "radius",
  "rect",
  "restorationProgress",
  "source",
  "sortedSourceCards",
  "transparentBackground",
  "value",
  "xVelocity",
  "yVelocity",
];
const RESERVED_PROPERTIES = [
  "addColorStop",
  "arc",
  "beginPath",
  "bezierCurveTo",
  "clientX",
  "clientY",
  "clearRect",
  "clip",
  "closePath",
  "code",
  "complete",
  "createBuffer",
  "createBufferSource",
  "createLinearGradient",
  "createRadialGradient",
  "destination",
  "drawImage",
  "fill",
  "fillRect",
  "fillStyle",
  "fillText",
  "font",
  "getBoundingClientRect",
  "getChannelData",
  "getContext",
  "globalAlpha",
  "height",
  "imageSmoothingEnabled",
  "innerHeight",
  "innerWidth",
  "lineCap",
  "lineJoin",
  "lineTo",
  "lineWidth",
  "measureText",
  "moveTo",
  "quadraticCurveTo",
  "requestAnimationFrame",
  "restore",
  "rotate",
  "roundRect",
  "save",
  "scale",
  "set",
  "shadowBlur",
  "shadowColor",
  "shadowOffsetY",
  "src",
  "state",
  "start",
  "stroke",
  "strokeRect",
  "strokeStyle",
  "style",
  "textAlign",
  "textBaseline",
  "translate",
  "width",
  "x",
  "y",
];

function compactEffect(effect) {
  return [
    effect.trigger ? EFFECT_TRIGGERS.indexOf(effect.trigger) : -1,
    EFFECT_TYPES.indexOf(effect.type),
    effect.target ? EFFECT_TARGETS.indexOf(effect.target) : -1,
    effect.amount || 0,
    effect.attack || 0,
    effect.health || 0,
  ];
}

function compactCards(cards) {
  return cards.map((card) => [
    card.name,
    CARD_TYPES.indexOf(card.type),
    card.cost,
    card.attack ?? 0,
    card.health ?? 0,
    card.text || 0,
    card.effects?.map(compactEffect) || 0,
    card.unique ? 1 : 0,
  ]);
}

function createCompactCollectionSource() {
  const source = readFileSync(join(ROOT, "src/collection.js"), "utf8");
  const collection = {};
  runInNewContext(source, collection);
  const unicorns = JSON.stringify(compactCards(collection.unicornCards));
  const rainbows = JSON.stringify(compactCards(collection.rainbowCards));
  const enemies = JSON.stringify(compactCards(collection.enemyStarterDeckConfig));

  return `DECK_SIZE=20;DEFAULT_DECK_COPIES=2;let _t=${JSON.stringify(CARD_TYPES)},_r=${JSON.stringify(EFFECT_TRIGGERS)},_e=${JSON.stringify(EFFECT_TYPES)},_g=${JSON.stringify(EFFECT_TARGETS)},_c=d=>d.map(c=>{let[n,t,o,a,h,x,e,u]=c,r={name:n,type:_t[t],cost:o};return t||(r.attack=a,r.health=h),x&&(r.text=x),u&&(r.unique=!0),e&&(r.effects=e.map(e=>{let[r,t,g,o,a,h]=e,c={type:_e[t]};return r>=0&&(c.trigger=_r[r]),g>=0&&(c.target=_g[g]),o&&(c.amount=o),a&&(c.attack=a),h&&(c.health=h),c})),r}),unicornCards=_c(${unicorns}),rainbowCards=_c(${rainbows}),unicornCollection={key:"unicorn",label:"Unicorns",accent:"#ff9ecf",cards:unicornCards},rainbowCollection={key:"rainbow",label:"Rainbow Fairies",accent:"#7fd7ff",cards:rainbowCards},playerDeckSources=[unicornCollection,rainbowCollection],getDeckCopiesLimit=c=>c.unique?1:DEFAULT_DECK_COPIES,inferCardTheme=c=>unicornCards.includes(c)?"unicorn":rainbowCards.includes(c)?"rainbow":enemyStarterDeckConfig.includes(c)?"enemy":"neutral",enemyStarterDeckConfig=_c(${enemies});`;
}

function readRuntimeSource({ compactData = false, debug = false } = {}) {
  return (debug ? DEBUG_SOURCE_FILES : SOURCE_FILES).map((file) => {
    if (compactData && file === "src/collection.js") {
      return createCompactCollectionSource();
    }

    return readFileSync(join(ROOT, file), "utf8");
  }).join("\n");
}

function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

function renderHtml(css, javascript) {
  return `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>Color Thief</title><style>${css}</style><canvas id=game width=1280 height=720></canvas><script>${javascript}</script>`;
}

function commandExists(command) {
  return spawnSync("sh", ["-c", `command -v ${command}`], {
    stdio: "ignore",
  }).status === 0;
}

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: ROOT,
    stdio: "pipe",
    ...options,
  });
}

function cleanDirectory(directory) {
  rmSync(directory, { recursive: true, force: true });
  mkdirSync(directory, { recursive: true });
}

function writeText(file, text) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, text);
}

function bytes(file) {
  return statSync(file).size;
}

function formatBytes(value) {
  return `${value.toLocaleString("en-US")} bytes`;
}

function reportSize(label, value) {
  console.log(`${label}: ${formatBytes(value)}`);
}

function wrapForTopLevelMangle(source) {
  const lexicalBindings = new Set(["zzfx", "zzfxV", "zzfxX"]);
  const names = [...source.matchAll(/^([A-Za-z_$][\w$]*)\s*=/gm)]
    .map(([, name]) => name)
    .filter((name) => !lexicalBindings.has(name));
  const declarations = [...new Set(names)].join(",");

  return `(()=>{let ${declarations};${source}})();`;
}

function createMangleOptions(nameCache, source) {
  const classMethods = [...source.matchAll(/^  ([A-Za-z_$][\w$]*)\(/gm)]
    .map(([, name]) => name)
    .filter((name) => name !== "constructor" && !RESERVED_PROPERTIES.includes(name));
  const properties = [...new Set([
    ...MANGLED_PROPERTIES,
    ...MANGLED_OBJECT_PROPERTIES,
    ...classMethods,
  ])];

  return {
    toplevel: true,
    properties: {
      builtins: true,
      regex: new RegExp(`^(?:${properties.join("|")})$`),
      reserved: RESERVED_PROPERTIES,
    },
  };
}

async function mangleSource(source, { compress }) {
  const nameCache = { vars: { props: {} }, props: { props: {} } };
  const result = await minify(wrapForTopLevelMangle(source), {
    ecma: 2020,
    compress: compress
      ? {
          booleans_as_integers: true,
          passes: 3,
          toplevel: true,
        }
      : false,
    mangle: createMangleOptions(nameCache, source),
    nameCache,
    format: { comments: false },
  });

  if (!result.code) throw new Error("Terser did not produce JavaScript.");

  return { code: result.code, nameCache };
}

async function packWithRoadroller(source, optimizeLevel) {
  const packer = new Packer(
    [{ data: source, type: "js", action: "eval" }],
    { allowFreeVars: true, dynamicModels: 1 },
  );

  await packer.optimize(optimizeLevel);
  const { firstLine, secondLine } = packer.makeDecoder();
  return `${firstLine}${secondLine}`;
}

function zipFiles(directory, archive, files) {
  rmSync(archive, { force: true });
  run("zip", ["-q", "-9", "-X", archive, ...files], { cwd: directory });
  run("unzip", ["-tqq", archive]);
  return bytes(archive);
}

function createSourceZip(outputDirectory, debug = false) {
  const archive = join(outputDirectory, "original-runtime.zip");
  const files = ["index.html", "styles.css", ...(debug ? DEBUG_SOURCE_FILES : SOURCE_FILES)];
  return zipFiles(ROOT, archive, files);
}

function writeCandidate(directory, html) {
  cleanDirectory(directory);
  writeText(join(directory, "index.html"), html);
  const archive = join(directory, "candidate.zip");
  return { archive, zipSize: zipFiles(directory, archive, ["index.html"]) };
}

function copyWinner(modeDirectory, winner) {
  copyFileSync(join(winner.directory, "index.html"), join(modeDirectory, "index.html"));
  const archive = join(modeDirectory, "color-thief.zip");
  const zipSize = zipFiles(modeDirectory, archive, ["index.html"]);
  return { archive, zipSize };
}

function optimizeZip(archive) {
  const result = { initial: bytes(archive), advzip: null, ect: null };

  if (commandExists("advzip")) {
    run("advzip", ["-z", "-4", archive]);
    run("unzip", ["-tqq", archive]);
    result.advzip = bytes(archive);
  }

  if (commandExists("ect")) {
    run("ect", ["-zip", "-9", "-strip", archive]);
    run("unzip", ["-tqq", archive]);
    result.ect = bytes(archive);
  }

  result.final = bytes(archive);
  return result;
}

function writeReport(directory, report) {
  writeText(join(directory, "size-report.json"), `${JSON.stringify(report, null, 2)}\n`);
}

async function buildDebug(mode) {
  const directory = join(BUILD_ROOT, mode);
  cleanDirectory(directory);
  const source = readRuntimeSource({ debug: true });
  const css = readFileSync(join(ROOT, "styles.css"), "utf8");
  const sourceZip = createSourceZip(directory, true);
  let javascript = source;
  let nameCache = null;

  if (mode === "mangled") {
    ({ code: javascript, nameCache } = await mangleSource(source, {
      compress: false,
    }));
    writeText(join(directory, "mangle-map.json"), `${JSON.stringify(nameCache, null, 2)}\n`);
  }

  writeText(join(directory, "index.html"), renderHtml(css, javascript));
  const archive = join(directory, "color-thief-debug.zip");
  const zipSize = zipFiles(directory, archive, ["index.html"]);
  const report = {
    mode,
    sourceJs: Buffer.byteLength(source),
    outputJs: Buffer.byteLength(javascript),
    originalRuntimeZip: sourceZip,
    zip: zipSize,
  };

  writeReport(directory, report);
  console.log(`\n${mode.toUpperCase()} BUILD`);
  reportSize("Source JS", report.sourceJs);
  reportSize("Output JS", report.outputJs);
  reportSize("Original runtime ZIP", report.originalRuntimeZip);
  reportSize("Build ZIP", report.zip);
}

async function buildProduction(mode) {
  const directory = join(BUILD_ROOT, mode);
  const candidatesDirectory = join(directory, "candidates");
  cleanDirectory(directory);
  mkdirSync(candidatesDirectory, { recursive: true });

  const source = readRuntimeSource();
  const css = minifyCss(readFileSync(join(ROOT, "styles.css"), "utf8"));
  const sourceZip = createSourceZip(directory);
  const optimizeLevel = mode === "prod" ? 2 : 1;
  const candidates = [];

  for (const dataMode of ["source", "compact"]) {
    const dataSource = dataMode === "compact"
      ? readRuntimeSource({ compactData: true })
      : source;

    {
      const terser = await mangleSource(dataSource, { compress: true });
      const terserDirectory = join(candidatesDirectory, `${dataMode}-terser`);
      const terserCandidate = writeCandidate(
        terserDirectory,
        renderHtml(css, terser.code),
      );

      candidates.push({
        name: `${dataMode}-terser`,
        directory: terserDirectory,
        javascript: terser.code,
        nameCache: terser.nameCache,
        ...terserCandidate,
      });

      const roadrollerCode = await packWithRoadroller(terser.code, optimizeLevel);
      const roadrollerDirectory = join(candidatesDirectory, `${dataMode}-roadroller`);
      const roadrollerCandidate = writeCandidate(
        roadrollerDirectory,
        renderHtml(css, roadrollerCode),
      );

      candidates.push({
        name: `${dataMode}-roadroller`,
        directory: roadrollerDirectory,
        javascript: roadrollerCode,
        nameCache: terser.nameCache,
        ...roadrollerCandidate,
      });
    }
  }

  const winner = candidates.reduce((smallest, candidate) =>
    candidate.zipSize < smallest.zipSize ? candidate : smallest,
  );
  const finalBuild = copyWinner(directory, winner);
  const zipOptimization = optimizeZip(finalBuild.archive);
  const report = {
    mode,
    sourceJs: Buffer.byteLength(source),
    sourceZip,
    css: Buffer.byteLength(css),
    candidates: candidates.map((candidate) => ({
      name: candidate.name,
      javascript: Buffer.byteLength(candidate.javascript),
      zip: candidate.zipSize,
    })),
    winner: winner.name,
    mangleMap: winner.nameCache,
    zip: zipOptimization,
    limit: LIMIT,
    remaining: LIMIT - zipOptimization.final,
    optionalTools: {
      advzip: commandExists("advzip"),
      ect: commandExists("ect"),
    },
  };

  writeText(join(directory, "mangle-map.json"), `${JSON.stringify(winner.nameCache, null, 2)}\n`);
  writeReport(directory, report);
  console.log(`\n${mode.toUpperCase()} BUILD`);
  reportSize("Source JS", report.sourceJs);
  reportSize("Original runtime ZIP", report.sourceZip);
  candidates.forEach((candidate) => {
    reportSize(`${candidate.name} JS`, Buffer.byteLength(candidate.javascript));
    reportSize(`${candidate.name} ZIP`, candidate.zipSize);
  });
  console.log(`Winner: ${winner.name}`);
  reportSize("Initial ZIP", report.zip.initial);
  console.log(`After advzip: ${report.zip.advzip === null ? "skipped (not installed)" : formatBytes(report.zip.advzip)}`);
  console.log(`After ECT: ${report.zip.ect === null ? "skipped (not installed)" : formatBytes(report.zip.ect)}`);
  reportSize("FINAL ZIP", report.zip.final);
  reportSize("LIMIT", LIMIT);
  console.log(`REMAINING: ${report.remaining.toLocaleString("en-US")} bytes`);
}

const mode = process.argv[2] || "prod";

if (!["debug", "mangled", "preprod", "prod"].includes(mode)) {
  throw new Error("Usage: node tools/build.mjs [debug|mangled|preprod|prod]");
}

if (mode === "debug" || mode === "mangled") {
  await buildDebug(mode);
} else {
  await buildProduction(mode);
}
