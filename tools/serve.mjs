import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, normalize, resolve, sep } from "node:path";
import { runtimeConstantsSource } from "./build-constants.mjs";
import { SOURCE_FILES } from "./source-files.mjs";

const root = resolve(process.argv[2] || ".");
const port = Number(process.argv[3]) || 4173;
const state = process.argv.slice(4).at(-1);
const debugFile = resolve(root, "src/debug.js");
const cssMarker = "{{{ CSS_INJECTION_SITE }}}";
const jsMarker = "{{{ JS_INJECTION_SITE }}}";
const types = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".png": "image/png",
  ".webp": "image/webp"
};

createServer((request, response) => {
  if (state && request.url === "/") {
    response.writeHead(302, { Location: `/?state=${encodeURIComponent(state)}` }).end();
    return;
  }

  const path = normalize(resolve(root, `.${decodeURIComponent(request.url).split("?")[0]}`));
  const file = path === root || !path.startsWith(root + sep) ? resolve(root, "index.html") : path;

  try {
    const target = statSync(file).isDirectory() ? resolve(file, "index.html") : file;

    const html = target === resolve(root, "index.html") && readFileSync(target, "utf8");
    if (html?.includes(cssMarker)) {
      const files = state && existsSync(debugFile)
        ? [...SOURCE_FILES, "src/debug.js"]
        : SOURCE_FILES;
      const javascript = files
        .map((file) => readFileSync(resolve(root, file), "utf8"))
        .join("\n");
      const page = html
        .replace(cssMarker, readFileSync(resolve(root, "styles.css"), "utf8"))
        .replace(jsMarker, `${runtimeConstantsSource()}\n${javascript}`);
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }).end(page);
      return;
    }

    response.writeHead(200, { "Content-Type": `${types[extname(target)] || "application/octet-stream"}; charset=utf-8` });
    createReadStream(target).pipe(response);
  } catch {
    response.writeHead(404).end("Not found");
  }
}).listen(port, () => console.log(`Color Thief: http://localhost:${port}`));
