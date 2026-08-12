const fs = require("fs");
const path = "assets/css/main.css";
let c = fs.readFileSync(path, "utf8");
const before = c;
c = c.split("https://cdn.statically.io/img/saxobroko.com/f=auto,w=400,h=300/images/banner.webp").join("/images/banner.webp");
c = c.split("https://cdn.statically.io/img/saxobroko.com/images/banner.webp").join("/images/banner.webp");
fs.writeFileSync(path, c);
console.log("updated", before !== c);
console.log("remaining statically banner", (c.match(/statically[^)]*banner/g) || []).length);
