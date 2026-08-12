const fs = require("fs");
const path = require("path");

const pages = ["index", "games", "tools", "portfolio", "eco", "oscar", "search", "privacy", "terms", "sponsors"];
const findings = [];

function add(sev, area, msg) {
  findings.push({ sev, area, msg });
}

const css = fs.readFileSync("assets/css/main.css", "utf8");
if (/#main\{|#main,|section#main/.test(css) || css.includes("#main{")) {
  // ok if #main exists as id selector
}
if (!css.includes("#main")) add("medium", "css", "#main styles may be missing or only via element selectors - check layout");
if (css.includes("url(https://cdn.statically.io") && css.includes("banner")) {
  add("high", "css", "Banner still points at Statically CDN");
}
if (css.includes("background-image:url(/images/banner.webp)") || css.includes("background-image:url(\"/images/banner.webp\")") || css.includes("url(/images/banner.webp)")) {
  // good
} else if (css.includes("banner.webp")) {
  add("low", "css", "banner.webp referenced but check path");
}

// defer + IIFE using $ — scripts.njk lists jquery before main.js with defer (order preserved)
const mainJs = fs.readFileSync("assets/js/main.js", "utf8");
const scriptsInc = fs.readFileSync("src/_includes/scripts.njk", "utf8");
if (
  (mainJs.trimStart().startsWith("(function($)") || mainJs.includes("(function($)")) &&
  !/jquery\.min\.js[\s\S]*main\.js/.test(scriptsInc)
) {
  add("high", "js", "main.js IIFE needs jQuery but scripts.njk may not load jquery before main.js");
}

for (const p of pages) {
  const file = p === "index" ? "_site/index.html" : `_site/${p}.html`;
  if (!fs.existsSync(file)) {
    add("high", p, "Built file missing: " + file);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  if (!/<main\b/.test(html)) add("high", p, "Missing <main> landmark");
  if ((html.match(/id="footer"/g) || []).length > 1) add("medium", p, "Duplicate #footer");
  if (html.includes('href="/#"')) add("low", p, "Home link uses /# instead of /");
  if (html.includes("document.write")) add("high", p, "Still uses document.write");
  if (html.includes("type=”") || html.includes("“@context”")) add("high", p, "Curly quotes in scripts");
  const emptyAlt = (html.match(/alt=""/g) || []).length;
  if (emptyAlt) add("medium", p, `${emptyAlt} images with empty alt=""`);
  if (html.includes("xlink:href=") && !html.includes('id="sbx-icon-search')) {
    // home search no longer uses xlink - ok
  }
  if (p === "index" && html.includes("sbx-custom2__submit") && html.includes(">Search</button>")) {
    add("medium", "index", "Home search buttons are text ('Search'/'Clear') but CSS expects icon-sized absolute buttons - likely ugly/broken UI vs original SVG icons");
  }
  if (p === "search" && html.includes("cse.google.com")) {
    const hdr = fs.readFileSync("_headers", "utf8");
    if (!hdr.includes("cse.google.com") || !hdr.includes("*.google.com")) {
      add("high", "search", "Google CSE present but CSP lacks cse.google.com / *.google.com");
    }
  }
  if (p === "eco" && html.includes("unpkg.com")) {
    add("low", "eco", "Loads unpkg carbon badge script (allowed in new CSP)");
  }
  if (html.includes('target="_blank"') && !html.includes('rel="noopener')) {
    const blanks = (html.match(/target="_blank"/g) || []).length;
    add("low", p, `${blanks} target=_blank without rel=noopener noreferrer`);
  }
}

// games list
const games = fs.readFileSync("src/games.njk", "utf8");
const tron = (games.match(/multitron\/index\.html/g) || []).length;
if (tron > 1) add("low", "games", "multitron listed twice under Multiplayer");
if (games.includes("./games/pacman/index\"") && !games.includes("pacman/index.html")) {
  add("medium", "games", "Pacman link is ./games/pacman/index (no .html) - may 404 depending on host");
}

// tools links missing extensions
const tools = fs.readFileSync("src/tools.njk", "utf8");
if (tools.includes("./tools/ginger\"") || tools.includes("./tools/color\"")) {
  add("medium", "tools", "Some tool links omit .html (ginger, color, mazegen) - relies on host rewrite");
}

// CSP vs google cse
const headers = fs.readFileSync("_headers", "utf8");
if (!headers.includes("cse.google.com") && !headers.includes("google.com")) {
  add("high", "headers", "CSP may block Google Custom Search on /search (cse.google.com / *.google.com not clearly allowed for script-src beyond cdnjs)");
}
if (headers.includes("script-src") && !headers.includes("*.google.com") && !headers.includes("cse.google.com")) {
  add("high", "headers", "script-src lacks Google CSE hosts");
}

// root stale HTML vs templates
add("info", "deploy", "Root index.html etc. still in repo; Cloudflare MUST build to _site or production will serve old buggy HTML");

// pwaupdate
if (fs.existsSync("assets/js/pwaupdate.js")) {
  const pwa = fs.readFileSync("assets/js/pwaupdate.js", "utf8");
  if (pwa.includes("statically") || pwa.length > 20000) {
    add("low", "pwa", "pwaupdate.js is large (~24KB) and loads as module on home/oscar");
  }
}

findings.sort((a, b) => {
  const order = { high: 0, medium: 1, low: 2, info: 3 };
  return order[a.sev] - order[b.sev];
});

for (const f of findings) {
  console.log(`[${f.sev.toUpperCase()}] (${f.area}) ${f.msg}`);
}
console.log("\nTOTAL", findings.length);
