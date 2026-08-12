const fs = require("fs");
const path = require("path");

function addNoopener(html) {
  return html.replace(/target="_blank"(?![^>]*rel=)/g, 'target="_blank" rel="noopener noreferrer"');
}

function fixGames(content) {
  let c = addNoopener(content);
  // Deduplicate multitron: keep one Multiplayer entry
  const lines = c.split("\n");
  let seenMultitron = 0;
  const out = [];
  for (const line of lines) {
    if (line.includes("games/multitron/index.html")) {
      seenMultitron++;
      if (seenMultitron > 1) continue;
      // Prefer the non-w3-gray button label clarity
    }
    out.push(line);
  }
  return out.join("\n");
}

function fixOscar(content) {
  let c = addNoopener(content);
  c = c.replace(
    'alt="https://www.textures4photoshop.com/"',
    'alt="Madi\'s House!"'
  );
  return c;
}

const map = {
  "src/games.njk": fixGames,
  "src/oscar.njk": fixOscar,
  "src/portfolio.njk": addNoopener,
  "src/eco.njk": addNoopener,
};

for (const [file, fn] of Object.entries(map)) {
  const before = fs.readFileSync(file, "utf8");
  const after = fn(before);
  fs.writeFileSync(file, after);
  console.log(file, before === after ? "unchanged" : "updated");
}

// Ensure search active class spacing consistency in nav
const navPath = "src/_includes/nav.njk";
let nav = fs.readFileSync(navPath, "utf8");
nav = nav.replace(
  '{% if active == "search" %}class="active"{% endif %} aria-label="Search"',
  '{% if active == "search" %}class="active" {% endif %}aria-label="Search"'
);
fs.writeFileSync(navPath, nav);
console.log("nav search active class normalized");
