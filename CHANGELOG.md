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
- Private `/ux-demos.html` lab with Path A–D polish demos (hero, page feel, gallery, tagline) — not linked from nav; pick winners before porting to the live site
- Live UX polish from all four demo paths: home hero entrance + tilt, main fade-in + nav hover/focus, gallery thumb hover + snappier filters, rotating home taglines (`prefers-reduced-motion` respected); `/ux-demos.html` kept as a lab
- Visual tune pass: progressive-enhancement so hero/main never stay invisible, stronger banner text shadow + search contrast, clearer nav active state, portfolio filter/heading contrast, gallery hover lift, tighter games button list, taller mobile home banner
- Cool visual system (`cool.css`): Syne + Manrope, cinematic full-viewport home hero, ice accent nav, editorial portfolio grid, refined games/tools buttons and footer; removed temporary local proof banner/`look.html`
- Replaced darkmode-js mix-blend inversion with a real `data-theme` system (CSS variables, FOUC-safe boot, accessible toggle, photo-safe gallery/banner, preference persistence + OS fallback)
- Project rule: always update `CHANGELOG.md` and commit after completing a change (`.cursor/rules/commit-with-changelog.mdc`)

### Changed

- Shell pages (home, games, tools, portfolio, eco, oscar, search, privacy, terms, sponsors) are templates with explicit `.html` permalinks so they do not collide with game/tool folders
- Lean script bundles on home (no unused jQuery/Magnific)
- Same-origin banner and eco backgrounds instead of third-party image CDN
- Accessibility: `<main id="main">`, icon-nav `aria-label`s, contrast tweaks
- Netlify and README updated for the Eleventy output directory
- Sidebar no longer a hard black slab: fixed floating icon rail with a soft scrim; on home/eco it rides the photo edge with light icons
- Replaced the icon sidebar with an editorial top nav (wordmark + text links); theme toggle sits in the nav; secondary links live in the footer
- Nav search icon expands into an animated inline field (Escape / empty outside-click closes; submits to `/search`)
- Slowed nav search open animation (~1.45s) and switched off non-interpolating `width: min()` so the expand is actually visible
- Nav search expand now uses the Web Animations API (~420ms) so it still plays when Windows “reduce motion” disables CSS transitions

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
