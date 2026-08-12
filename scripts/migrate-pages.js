const fs = require("fs");
const path = require("path");

function extractMainInner(html) {
  let m = html.match(/<section[^>]*id=["']main["'][^>]*>([\s\S]*)<\/section>\s*<\/div>/i);
  if (!m) m = html.match(/<section[^>]*id=["']main["'][^>]*>([\s\S]*)/i);
  let body = m ? m[1] : "";
  body = body.replace(/<!--\s*Footer\s*-->[\s\S]*$/i, "");
  body = body.replace(/<footer[\s\S]*<\/footer>\s*$/i, "");
  // Drop leftover ES lang link if present inside nav residue (shouldn't be in main)
  body = body.replace("Comitted", "Committed");
  return body.trim();
}

const pages = [
  { file: "games.html", out: "games.njk", title: "Games", active: "games", scripts: "dark" },
  { file: "tools.html", out: "tools.njk", title: "Tools", active: "tools", scripts: "dark" },
  { file: "search.html", out: "search.njk", title: "Search", active: "search", scripts: "dark" },
  { file: "privacy.html", out: "privacy.njk", title: "Privacy", active: "", scripts: "dark" },
  { file: "terms.html", out: "terms.njk", title: "Terms", active: "", scripts: "dark" },
  { file: "sponsors.html", out: "sponsors.njk", title: "Sponsors", active: "", scripts: "gallery" },
  { file: "links.html", out: "links.njk", title: "Links", active: "", scripts: "lean" },
  { file: "disclaimer.html", out: "disclaimer.njk", title: "Disclaimer", active: "", scripts: "lean" },
  { file: "offline.html", out: "offline.njk", title: "Offline", active: "", scripts: "lean" },
  { file: "404.html", out: "404.njk", title: "Not Found", active: "", scripts: "lean", permalink: "/404.html" },
  { file: "eco.html", out: "eco.njk", title: "Sustainability", active: "eco", scripts: "shell" },
  {
    file: "oscar.html",
    out: "oscar.njk",
    title: "Oscar",
    active: "oscar",
    scripts: "gallery",
    pwa: true,
    description: "Rest In Peace, Oscar 2020-2022",
  },
  { file: "portfolio.html", out: "portfolio.njk", title: "Portfolio", active: "portfolio", scripts: "gallery" },
];

for (const p of pages) {
  if (!fs.existsSync(p.file)) {
    console.log("missing", p.file);
    continue;
  }
  const html = fs.readFileSync(p.file, "utf8");
  let body = extractMainInner(html);
  // Fix empty img alts when title exists
  body = body.replace(/<img([^>]*?)alt=""([^>]*?)title="([^"]+)"/g, '<img$1alt="$3"$2title="$3"');
  body = body.replace(/<img([^>]*?)title="([^"]+)"([^>]*?)alt=""/g, '<img$1title="$2"$3alt="$2"');
  // Eco images without alt
  body = body.replace(/<img src="\.\/images\/eco\/([^"]+)"([^>]*)>/g, (match, src, rest) => {
    if (/alt=/.test(rest)) return match;
    const name = src.replace(/\.[^.]+$/, "").replace(/%20/g, " ");
    return `<img src="./images/eco/${src}" alt="${name}"${rest}>`;
  });

  const lines = [
    "---",
    "layout: base.njk",
    `title: ${JSON.stringify(p.title)}`,
    `active: ${JSON.stringify(p.active || "")}`,
    `scripts: ${JSON.stringify(p.scripts)}`,
  ];
  if (p.pwa) lines.push("pwa: true");
  if (p.description) lines.push(`description: ${JSON.stringify(p.description)}`);
  if (p.permalink) lines.push(`permalink: ${p.permalink}`);
  lines.push("---", "", body);

  const outPath = path.join("src", p.out);
  fs.writeFileSync(outPath, lines.join("\n"));
  console.log("wrote", p.out, fs.statSync(outPath).size);
}
