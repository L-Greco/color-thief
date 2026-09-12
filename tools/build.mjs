import { existsSync, promises as fs } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";
import {
  EVALUATE,
  NOMANGLE,
  assembleHtml,
  hardcodeConstants,
  macro,
  mangle,
} from "@remvst/js13k-tools";
import CleanCSS from "clean-css";
import { minify as minifyHtml } from "html-minifier";
import { Packer } from "roadroller";
import { minify } from "terser";
import yargs from "yargs/yargs";
import { SOURCE_FILES } from "./source-files.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CARD_TYPES = ["minion", "spell"];
const EFFECT_TRIGGERS = ["onDeath"];
const EFFECT_TYPES = ["draw", "heal", "damage", "buff", "returnToHand"];
const EFFECT_TARGETS = [
  "friendlyMinion",
  "enemyMinion",
  "allFriendlyMinions",
  "allEnemyMinions",
];
const LITERAL_CONSTANTS = {
  true: 1,
  false: 0,
  const: "let",
  null: 0,
  Infinity: 999,
};
const FORCED_NAMES = [
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
  "artBg",
  "background",
  "banner",
  "battle",
  "board",
  "border",
  "canAttack",
  "canLeave",
  "card",
  "cardScale",
  "cards",
  "cardsPerPage",
  "center",
  "closeRect",
  "color",
  "controller",
  "cost",
  "deathEffectTime",
  "deathOverlayAlpha",
  "deathRise",
  "deathScale",
  "deck",
  "dragCard",
  "dragOffset",
  "drawAlpha",
  "drawEffectDelay",
  "drawEffectTime",
  "drawStartX",
  "drawStartY",
  "drawTargetX",
  "drawTargetY",
  "effectBg",
  "effects",
  "ended",
  "enemy",
  "enemyBoard",
  "enemyDeckRect",
  "enemyHeroRect",
  "enemyPreviewCard",
  "enemyPreviewTimer",
  "enemyStatus",
  "enemyStepDelay",
  "enemyStepTimer",
  "frame",
  "game",
  "gameInfoModal",
  "glow",
  "hand",
  "health",
  "hitEffectTime",
  "hitOverlayAlpha",
  "hitRotation",
  "hoverDuration",
  "hoverProgress",
  "hovered",
  "innerBorder",
  "isCloseHovered",
  "isDying",
  "isOpen",
  "isTargetSource",
  "key",
  "knownPlayerHandCards",
  "kind",
  "label",
  "lastStatusAt",
  "mana",
  "maxHealth",
  "maxMana",
  "message",
  "minion",
  "mulliganActive",
  "mulliganCards",
  "mulliganKeepRect",
  "mulliganRedrawRect",
  "name",
  "nextPageRect",
  "ok",
  "opponent",
  "outcome",
  "paper",
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
  "radius",
  "reason",
  "rect",
  "restorationProgress",
  "screen",
  "selectedAction",
  "selectedDeck",
  "selectedSource",
  "sortedSourceCards",
  "source",
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
  "theme",
  "thiefMusicStarted",
  "titleExitProgress",
  "transparentBackground",
  "trigger",
  "turn",
  "turnOwner",
  "turnPhase",
  "type",
  "unique",
  "value",
  "victoryThemeStarted",
  "victoryTime",
  "xVelocity",
  "yVelocity",
];
const MANGLE_OPTIONS = {
  skip: ["constructor", "repeat", "zzfx", "zzfxV", "zzfxX"],
  force: FORCED_NAMES,
};
const argv = yargs(process.argv.slice(2)).options({
  debug: { type: "boolean", default: false },
  mangle: { type: "boolean", default: false },
  "roadroll-level": { type: "number" },
}).parseSync();
const mode = argv._[0] || (argv.debug ? "debug" : argv.mangle ? "mangled" : "prod");

if (!["debug", "mangled", "preprod", "prod"].includes(mode)) {
  throw new Error("Usage: node tools/build.mjs [debug|mangled|preprod|prod]");
}

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
    CARD_TYPES.indexOf(card.type || "minion"),
    card.cost,
    card.attack ?? 0,
    card.health ?? 0,
    card.effects?.map(compactEffect) || 0,
    card.unique ? 1 : 0,
  ]);
}

async function compactCollection() {
  const collection = {};
  runInNewContext(
    await fs.readFile(join(ROOT, "src/collection.js"), "utf8"),
    collection,
  );
  const unicorns = JSON.stringify(compactCards(collection.unicornCards));
  const rainbows = JSON.stringify(compactCards(collection.rainbowCards));
  const enemies = JSON.stringify(compactCards(collection.enemyStarterDeckConfig));

  return `let _t=${JSON.stringify(CARD_TYPES)},_r=${JSON.stringify(EFFECT_TRIGGERS)},_e=${JSON.stringify(EFFECT_TYPES)},_g=${JSON.stringify(EFFECT_TARGETS)},_c=d=>d.map(c=>{let[n,t,o,a,h,e,u]=c,r={name:n,type:_t[t],cost:o};return t||(r.attack=a,r.health=h),u&&(r.unique=!0),e&&(r.effects=e.map(e=>{let[r,t,g,o,a,h]=e,c={type:_e[t]};return r>=0&&(c.trigger=_r[r]),g>=0&&(c.target=_g[g]),o&&(c.amount=o),a&&(c.attack=a),h&&(c.health=h),c})),r}),unicornCards=_c(${unicorns}),rainbowCards=_c(${rainbows}),unicornCollection={key:"unicorn",label:"Unicorns",accent:"#ff9ecf",cards:unicornCards},rainbowCollection={key:"rainbow",label:"Rainbow Fairies",accent:"#7fd7ff",cards:rainbowCards},playerDeckSources=[unicornCollection,rainbowCollection],getDeckCopiesLimit=c=>c.unique?1:DEFAULT_DECK_COPIES,inferCardTheme=c=>unicornCards.includes(c)?"unicorn":rainbowCards.includes(c)?"rainbow":enemyStarterDeckConfig.includes(c)?"enemy":"neutral",enemyStarterDeckConfig=_c(${enemies});`;
}

async function readSource(debug) {
  const files = debug ? [...SOURCE_FILES, "src/debug.js"] : SOURCE_FILES;
  const parts = await Promise.all(files.map(async (file) => {
    if (!debug && file === "src/constants.js") return "";
    if (!debug && file === "src/collection.js") return compactCollection();
    const source = await fs.readFile(join(ROOT, file), "utf8");
    return !debug && file === "src/audio/zzfx.js"
      ? `/*nomangle*/${source}/*/nomangle*/`
      : source;
  }));
  return parts.join("\n");
}

async function readConstants() {
  const constants = {};
  const collection = {};
  runInNewContext(
    await fs.readFile(join(ROOT, "src/constants.js"), "utf8"),
    constants,
  );
  runInNewContext(
    await fs.readFile(join(ROOT, "src/collection.js"), "utf8"),
    collection,
  );
  return {
    ...LITERAL_CONSTANTS,
    ...Object.fromEntries([
    ...Object.entries(constants),
    ["DECK_SIZE", collection.DECK_SIZE],
    ["DEFAULT_DECK_COPIES", collection.DEFAULT_DECK_COPIES],
  ].map(([name, value]) => [
    name,
    value && typeof value === "object" ? JSON.stringify(value) : value,
    ])),
  };
}

function expandTemplates(source) {
  return source.replace(
    /`((?:\\[\s\S]|[^`])*)`/g,
    (_, content) => content.split(/(\$\{[^}]*\})/).map((part) =>
      part.startsWith("${") ? `(${part.slice(2, -1)})` : JSON.stringify(part),
    ).join("+"),
  );
}

function wrapSource(source) {
  const ignored = new Set(["zzfx", "zzfxV", "zzfxX"]);
  const names = [...source.matchAll(/^([A-Za-z_$][\w$]*)\s*=/gm)]
    .map(([, name]) => name)
    .filter((name) => !ignored.has(name));
  return `(()=>{let ${[...new Set(names)]};${source}})();`;
}

async function pack(source, level) {
  const packer = new Packer(
    [{ data: source, type: "js", action: "eval" }],
    {},
  );
  await packer.optimize(level);
  const { firstLine, secondLine } = packer.makeDecoder();
  return firstLine + secondLine;
}

async function build() {
  const debug = mode === "debug";
  const output = join(ROOT, "build", mode);
  let [html, css, javascript] = await Promise.all([
    fs.readFile(join(ROOT, "index.html"), "utf8"),
    fs.readFile(join(ROOT, "styles.css"), "utf8"),
    readSource(debug),
  ]);

  if (!debug) {
    javascript = hardcodeConstants(expandTemplates(javascript), await readConstants());
    javascript = macro(macro(javascript, NOMANGLE), EVALUATE);
    const methods = [...javascript.matchAll(/^  ([A-Za-z_$][\w$]*)\(/gm)]
      .map(([, name]) => name)
      .filter((name) => name !== "constructor");
    javascript = mangle(javascript, {
      ...MANGLE_OPTIONS,
      force: [...FORCED_NAMES, ...methods],
    });
    javascript = (await minify(wrapSource(javascript), {
      ecma: 2020,
      compress: { booleans_as_integers: true, passes: 3, toplevel: true },
      mangle: { properties: false, toplevel: true },
      format: { comments: false },
    })).code;
    css = new CleanCSS().minify(css).styles;
    html = minifyHtml(html, {
      collapseWhitespace: true,
      minifyCSS: false,
      minifyJS: false,
    });

    if (mode === "prod") {
      javascript = await pack(javascript, argv["roadroll-level"] || 3);
    }
  }

  await fs.rm(output, { recursive: true, force: true });
  await fs.mkdir(output, { recursive: true });
  await fs.writeFile(
    join(output, "index.html"),
    assembleHtml({ html, css, js: javascript }).trimEnd(),
  );
  const archive = join(output, "color-thief.zip");
  execFileSync("zip", ["-q", "-9", "-X", "color-thief.zip", "index.html"], {
    cwd: output,
  });
  console.log(`ZIP: ${(await fs.stat(archive)).size} bytes`);

  if (mode === "prod") {
    const ect = join(ROOT, "Efficient-Compression-Tool", "build", "ect");
    if (!existsSync(ect)) {
      throw new Error(`ECT binary is missing: ${ect}`);
    }
    const advzip = existsSync("/opt/homebrew/opt/advancecomp/bin/advzip")
      ? "/opt/homebrew/opt/advancecomp/bin/advzip"
      : "advzip";
    execFileSync(advzip, ["-z", archive, "--shrink-insane"]);
    console.log(`ADVZIP: ${(await fs.stat(archive)).size} bytes`);
    execFileSync(ect, ["-zip", archive, "-9", "-strip"]);
    console.log(`ECT: ${(await fs.stat(archive)).size} bytes`);
  }
}

await build();
