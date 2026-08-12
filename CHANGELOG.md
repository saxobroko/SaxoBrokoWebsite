# Changelog

All notable changes to this project are documented in this file.

## [2.0.0] — 2026-08-13

### Added

- Eleventy (`@11ty/eleventy`) build that compiles shell pages from `src/` into `_site/`
- Shared Nunjucks layout and includes (`nav`, `footer`, `head`, `scripts`)
- `assets/js/site.js` (footer year) and `assets/js/darkmode.js` (split out of `main.js`)
- `CLOUDFLARE.md` with Pages build settings (`npm run build` → `_site`, Node 20)
- GitHub Actions workflow for alternate GitHub Pages hosting
- Helper scripts under `scripts/` for migration, audits, and one-off fixes

### Changed

- Shell pages (home, games, tools, portfolio, eco, oscar, search, privacy, terms, sponsors) are templates with explicit `.html` permalinks so they do not collide with game/tool folders
- Lean script bundles on home (no unused jQuery/Magnific)
- Same-origin banner and eco backgrounds instead of third-party image CDN
- Accessibility: `<main id="main">`, icon-nav `aria-label`s, contrast tweaks
- Netlify and README updated for the Eleventy output directory

### Fixed

- Statically CDN image URLs returning 403 on portfolio, oscar, and eco CSS backgrounds
- Root archive `portfolio.html` / `oscar.html` lightbox and thumb links rewritten off discontinued Statically endpoints (Eleventy `src/` templates already used `/images/...`)
- Portfolio Magnific Popup restored so gallery images open in a lightbox again (`delegate: 'a'` on `.content`, matching pre-migration behavior)
- Replaced corrupted `assets/js/magnific.js` (syntax error from a bad pretty-print) with official Magnific Popup v1.1.0
- Restored jQuery 3.5.1 for gallery pages (jQuery 4.0-pre removed `$.isFunction`, which Magnific Popup still calls); kept the old build as `jquery-4.0.0-pre.min.js`
- Content-Security-Policy blocking Google Custom Search on `/search`
- Home search submit/clear controls restored to SVG sprite icons (CSS expects icon buttons)
- Nav/footer home links use `/` instead of `/#`
- Tools and Pacman links use explicit `.html` paths
- Duplicate Multitron entry on the games list
- Missing `rel="noopener noreferrer"` on external/`target="_blank"` game and tool links
- Oscar gallery alt text that incorrectly contained a textures URL

### Notes

- Root `.html` shell copies remain in the repo for sentimental/archive value; production must deploy the Eleventy `_site` output (see `CLOUDFLARE.md`).
- No production deploy in this release commit set — local only until you choose to ship.
