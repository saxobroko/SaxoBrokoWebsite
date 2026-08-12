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
