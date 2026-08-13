/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("jsonld", (value) => JSON.stringify(value));

  // Keep sentimental / legacy assets; deploy everything that isn't a shell template.
  // robots.txt + sitemap.xml are generated from src/ templates.
  const passthrough = [
    "games",
    "tools",
    "images",
    "assets",
    "js",
    "lang",
    "docs.html",
    "mintme.html",
    "STBR.html",
    "toolsold.html",
    "links.html",
    "disclaimer.html",
    "offline.html",
    "404.html",
    "ads.txt",
    "browserconfig.xml",
    "CNAME",
    "favicon.ico",
    "favicon-16x16.png",
    "favicon-32x32.png",
    "faviconold.png",
    "apple-touch-icon.png",
    "android-chrome-192x192.png",
    "android-chrome-384x384.png",
    "mstile-150x150.png",
    "safari-pinned-tab.svg",
    "manifest.json",
    "manifest1.json",
    "site.webmanifest",
    "pwabuilder-sw.js",
    "w3.css",
    "LICENSE",
    "SECURITY.md",
    "README.md",
    "_headers",
    "_redirects",
  ];

  for (const path of passthrough) {
    eleventyConfig.addPassthroughCopy(path);
  }

  // Root shell HTML stays in git for history/sentiment but must not collide with templates.
  eleventyConfig.ignores.add("index.html");
  eleventyConfig.ignores.add("games.html");
  eleventyConfig.ignores.add("tools.html");
  eleventyConfig.ignores.add("portfolio.html");
  eleventyConfig.ignores.add("eco.html");
  eleventyConfig.ignores.add("oscar.html");
  eleventyConfig.ignores.add("search.html");
  eleventyConfig.ignores.add("privacy.html");
  eleventyConfig.ignores.add("terms.html");
  eleventyConfig.ignores.add("sponsors.html");
  eleventyConfig.ignores.add("offline.html");
  eleventyConfig.ignores.add("404.html");
  eleventyConfig.ignores.add("links.html");
  eleventyConfig.ignores.add("disclaimer.html");

  eleventyConfig.setServerOptions({
    port: 8080,
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_layouts",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html", "liquid"],
  };
};
