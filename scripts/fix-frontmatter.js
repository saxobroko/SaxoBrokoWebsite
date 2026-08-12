const fs = require("fs");
const path = require("path");

const meta = {
  index: {
    permalink: "/",
    layout: "base.njk",
    title: "Home",
    active: "home",
    scripts: "lean",
    preloadBanner: true,
    jsonLd: true,
    pwa: true,
    description: "Saxo_Broko's official website of doom, or whatever.",
  },
  games: { permalink: "/games.html", layout: "base.njk", title: "Games", active: "games", scripts: "dark" },
  tools: { permalink: "/tools.html", layout: "base.njk", title: "Tools", active: "tools", scripts: "dark" },
  search: { permalink: "/search.html", layout: "base.njk", title: "Search", active: "search", scripts: "dark" },
  privacy: { permalink: "/privacy.html", layout: "base.njk", title: "Privacy", active: "", scripts: "dark" },
  terms: { permalink: "/terms.html", layout: "base.njk", title: "Terms", active: "", scripts: "dark" },
  sponsors: { permalink: "/sponsors.html", layout: "base.njk", title: "Sponsors", active: "", scripts: "gallery" },
  eco: { permalink: "/eco.html", layout: "base.njk", title: "Sustainability", active: "eco", scripts: "shell" },
  oscar: {
    permalink: "/oscar.html",
    layout: "base.njk",
    title: "Oscar",
    active: "oscar",
    scripts: "gallery",
    pwa: true,
    description: "Rest In Peace, Oscar 2020-2022",
  },
  portfolio: { permalink: "/portfolio.html", layout: "base.njk", title: "Portfolio", active: "portfolio", scripts: "gallery" },
};

for (const [name, data] of Object.entries(meta)) {
  const p = path.join("src", name + ".njk");
  let s = fs.readFileSync(p, "utf8");
  const end = s.indexOf("---", 3);
  if (end < 0) throw new Error("no fm end " + name);
  let body = s.slice(end + 3).replace(/^\r?\n/, "\n");
  const lines = ["---"];
  for (const [k, v] of Object.entries(data)) {
    if (typeof v === "boolean") lines.push(`${k}: ${v}`);
    else if (typeof v === "number") lines.push(`${k}: ${v}`);
    else lines.push(`${k}: ${JSON.stringify(v)}`);
  }
  lines.push("---");
  fs.writeFileSync(p, lines.join("\n") + body);
  console.log("fixed", name);
}
