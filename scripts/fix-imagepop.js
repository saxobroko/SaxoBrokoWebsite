const fs = require("fs");

const files = ["src/portfolio.njk", "portfolio.html"];
for (const file of files) {
  let c = fs.readFileSync(file, "utf8");
  const next = c.replace(
    /<a href="(\/images\/fulls\/[^"]+)"(?![^>]*\bimagepop\b)/g,
    '<a href="$1" class="imagepop"'
  );
  if (next !== c) {
    fs.writeFileSync(file, next);
    console.log("updated", file);
  } else {
    console.log("no change", file);
  }
}
