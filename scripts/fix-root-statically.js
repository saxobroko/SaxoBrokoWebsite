const fs = require("fs");

function rewrite(content) {
  return content.replace(
    /https:\/\/cdn\.statically\.io\/img\/saxobroko\.com\/f=auto[^/]*\//g,
    "/"
  );
}

const targets = process.argv.slice(2);
if (!targets.length) {
  console.error("Usage: node scripts/fix-root-statically.js <file>...");
  process.exit(1);
}

for (const file of targets) {
  const before = fs.readFileSync(file, "utf8");
  const after = rewrite(before);
  const b = (before.match(/cdn\.statically\.io\/img\//g) || []).length;
  const a = (after.match(/cdn\.statically\.io\/img\//g) || []).length;
  if (after !== before) {
    fs.writeFileSync(file, after);
    console.log(`updated ${file}: img CDN ${b} → ${a}`);
  } else {
    console.log(`unchanged ${file} (img CDN refs: ${b})`);
  }
}
