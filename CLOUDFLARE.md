# Cloudflare Pages (`saxobrokowebsite`)

Dashboard: https://dash.cloudflare.com/818dcafda491e5476972ed17cdf425ab/pages/view/saxobrokowebsite

## Build settings (required)

| Setting | Value |
|---------|-------|
| Framework preset | Eleventy |
| Build command | `npm run build` |
| Build output directory | `_site` |
| Root directory | `/` (repo root) |
| Environment variable | `NODE_VERSION=20` |

After saving, trigger a new deployment from `main`.

## Local

```bash
npm install
npm run start   # http://localhost:8080
npm run build   # writes _site/
```

Shell pages are templates under `src/`. Games, tools, and images are passthrough-copied unchanged.
