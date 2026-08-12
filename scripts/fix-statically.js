const fs = require("fs");
const path = require("path");

function rewriteStatically(content) {
  // https://cdn.statically.io/img/saxobroko.com/f=auto,.../images/... → /images/...
  return content.replace(
    /https:\/\/cdn\.statically\.io\/img\/saxobroko\.com\/f=auto[^/]*\//g,
    "/"
  );
}

const files = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p);
    else if (/\.(njk|html|css|js|md)$/i.test(name)) files.push(p);
  }
}

walk("src");
files.push("assets/css/main.css");
// Root shell HTML kept for sentiment/archive; keep image URLs in sync with templates.
for (const name of [
  "portfolio.html",
  "oscar.html",
  "index.html",
  "eco.html",
  "games.html",
  "tools.html",
  "search.html",
  "privacy.html",
  "terms.html",
  "sponsors.html",
]) {
  if (fs.existsSync(name)) files.push(name);
}

let changed = 0;
for (const file of files) {
  const before = fs.readFileSync(file, "utf8");
  const after = rewriteStatically(before);
  if (after !== before) {
    fs.writeFileSync(file, after);
    changed++;
    console.log("updated", file);
  }
}
console.log("files changed:", changed);
