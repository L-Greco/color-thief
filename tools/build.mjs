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
const MANGLE_OPTIONS = {
  skip: ["constructor", "repeat", "roundRect", "zzfx", "zzfxV", "zzfxX"],
  force: [],
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
  const type = EFFECT_TYPES.indexOf(effect.type);
  const compact = [
    type + (effect.trigger === "onDeath" ? 8 : 0),
    effect.target ? EFFECT_TARGETS.indexOf(effect.target) + 1 : 0,
  ];
  if (type === 3) {
    compact.push(effect.attack || 0, effect.health || 0);
  } else if (type < 3) {
    compact.push(effect.amount || 0);
  }
  return compact;
}

function compactCards(cards) {
  return cards.map((card) => {
    const compact = [
      card.name,
      card.cost,
      card.attack ?? 0,
      card.health ?? 0,
    ];
    if (card.text || card.effects || card.unique) compact.push(card.text || "");
    if (card.effects || card.unique) {
      compact.push(card.effects?.map(compactEffect) || 0);
    }
    if (card.unique) compact.push(1);
    return compact;
  });
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

  return `let _c=d=>d.map(c=>{let[n,o,a,h,t,e,u]=c,r={name:n,cost:o};return a?(r.attack=a,r.health=h):r.type="spell",t&&(r.text=t),u&&(r.unique=!0),e&&(r.effects=e),r}),unicornCards=_c(${unicorns}),rainbowCards=_c(${rainbows}),unicornCollection={key:"unicorn",label:"Unicorns",accent:"#ff9ecf",cards:unicornCards},rainbowCollection={key:"rainbow",label:"Rainbow Fairies",accent:"#7fd7ff",cards:rainbowCards},playerDeckSources=[unicornCollection,rainbowCollection],getDeckCopiesLimit=c=>c.unique?1:DEFAULT_DECK_COPIES,inferCardTheme=c=>unicornCards.includes(c)?"unicorn":rainbowCards.includes(c)?"rainbow":enemyStarterDeckConfig.includes(c)?"enemy":"neutral",enemyStarterDeckConfig=_c(${enemies});`;
}

function compactEffectAccess(source) {
  const targetCodes = Object.fromEntries(
    EFFECT_TARGETS.map((target, index) => [target, index + 1]),
  );
  const typeCodes = Object.fromEntries(
    EFFECT_TYPES.map((type, index) => [type, index]),
  );

  source = source.replace(
    /!effect\.trigger \|\| effect\.trigger === trigger/g,
    "effect[0]<8||trigger",
  );
  source = source.replace(
    /effect\.type === "(draw|heal|damage|buff|returnToHand)"/g,
    (_, type) => `effect[0]%8===${typeCodes[type]}`,
  );
  source = source.replace(/effects\[i\]\.target/g, "effects[i][1]");
  source = source.replace(
    /effect\.(target|amount|attack|health)/g,
    (_, field) => `effect[${{ target: 1, amount: 2, attack: 2, health: 3 }[field]}]`,
  );
  source = source.replace(
    /"(friendlyMinion|enemyMinion|allFriendlyMinions|allEnemyMinions)"/g,
    (_, target) => `${targetCodes[target]}`,
  );
  return source.replace(/"onPlay"/g, "0").replace(/"onDeath"/g, "1");
}

async function readSource(debug) {
  const files = debug ? [...SOURCE_FILES, "src/debug.js"] : SOURCE_FILES;
  const parts = await Promise.all(files.map(async (file) => {
    if (!debug && file === "src/constants.js") return "";
    if (!debug && file === "src/collection.js") return compactCollection();
    const source = await fs.readFile(join(ROOT, file), "utf8");
    return source;
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

function protectLiterals(source) {
  return source.replace(
    /"(?:\\.|[^"\\\r\n])*"|'(?:\\.|[^'\\\r\n])*'/g,
    (literal) => `/*nomangle*/${literal}/*/nomangle*/`,
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
  const canvas = !debug && html.match(/<canvas\b[^>]*><\/canvas>/i)?.[0];

  if (!debug) {
    if (canvas) {
      html = html.replace(canvas, "CANVAS_INJECTION_SITE");
    }
    javascript = compactEffectAccess(javascript);
    javascript = hardcodeConstants(expandTemplates(javascript), await readConstants());
    javascript = macro(macro(javascript, NOMANGLE), EVALUATE);
    javascript = mangle(protectLiterals(javascript), MANGLE_OPTIONS);
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
    assembleHtml({ html, css, js: javascript })
      .replace("CANVAS_INJECTION_SITE", canvas || "")
      .trimEnd(),
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
