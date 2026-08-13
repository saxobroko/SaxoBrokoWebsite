const fs = require("fs");
const http = require("http");

function get(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve({ status: res.statusCode, data }));
      })
      .on("error", reject);
  });
}

(async () => {
  const built = fs.readFileSync("_site/assets/css/main.css", "utf8");
  const src = fs.readFileSync("assets/css/main.css", "utf8");
  const html = fs.readFileSync("_site/index.html", "utf8");
  console.log("src has radial vignette", src.includes("radial-gradient(ellipse at center"));
  console.log("built has radial vignette", built.includes("radial-gradient(ellipse at center"));
  console.log("built has js-ux", built.includes("js-ux"));
  console.log("html css href", (html.match(/main\.css[^"]*/)||[])[0]);
  console.log("html data-hero", html.includes("data-hero"));
  console.log("src mtime", fs.statSync("assets/css/main.css").mtime.toISOString());
  console.log("built mtime", fs.statSync("_site/assets/css/main.css").mtime.toISOString());

  const css = await get("http://localhost:8082/assets/css/main.css?v=2.0.1");
  console.log("http status", css.status, "len", css.data.length);
  console.log("http vignette", css.data.includes("radial-gradient(ellipse at center"));
  console.log("http tagline border", css.data.includes("border-bottom:2px solid"));

  const page = await get("http://localhost:8082/");
  console.log("page css link", (page.data.match(/main\.css[^"]*/)||[])[0]);
  console.log("page data-tagline", page.data.includes("data-tagline"));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
