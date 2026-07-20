# Riverside Rebuild — Deploy Prep: Cloudflare Pages, Cost-Protected

Paste into Claude Code once round23 is confirmed done. This prepares the
repo for deployment — the actual Cloudflare dashboard steps happen
separately afterward, outside of what Claude Code can do.

## 1. Confirm the app is genuinely 100% static — this is the actual cost protection

Check the codebase for any backend/API routes, serverless functions, or
live third-party fetches happening at request time (not build time). There
shouldn't be any — no database, no API, nothing that runs server-side per
visitor. This is what makes cost structurally incapable of scaling with
traffic; confirm it's actually true rather than assuming it, given this
matters a lot given expected viral traffic.

## 2. Confirm all third-party assets are self-hosted, not live-fetched

The hero photo (round16) and the lion icon (round15) should both be baked
into the build as local files, not fetched from Wikimedia Commons or
game-icons.net at request time. Verify this — a live fetch to an external
host on every visit would be both slower and a dependency on someone
else's uptime/rate limits, neither of which matters at low traffic but
both of which matter at real viral scale. Google Fonts can stay
CDN-loaded as-is; that's Google's infrastructure and cost, not ours,
regardless of traffic.

## 3. Compress the hero image specifically — it's almost certainly the heaviest asset

Check its current file size. If it's a JPEG, consider converting to WebP
(meaningfully smaller at equivalent visual quality, and well-supported —
this app doesn't need to support browsers old enough to lack WebP
support). This is the single highest-leverage bandwidth reduction
available, given a duotone photo is likely the largest thing on the page
by far and every visitor loads it.

## 4. Add a `_headers` file for long cache lifetimes on static assets

Cloudflare Pages reads a `_headers` file in the build output directory
for custom cache control. Add one setting long cache lifetimes (e.g. a
year, with immutable where filenames are content-hashed by the build) for
fonts, icons, images, and hashed JS/CSS bundles. This means repeat
visitors — and anyone opening a link shared within the same viral moment
who already has it cached from a friend's link — don't re-download the
full page weight every time. Example pattern:

```
/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

Adjust the path pattern to match wherever the build actually outputs
hashed assets.

## 5. Verify the build command and output directory match Cloudflare Pages' expectations

Standard Vite setup: build command `npm run build`, output directory
`dist`. Confirm this is actually what's configured (check `vite.config.js`
and `package.json`) so connecting the repo to Cloudflare Pages works
without extra configuration on the dashboard side.

## Definition of done

- Confirmed no backend/API/serverless code exists anywhere in the app
- Confirmed hero image and lion icon are local build assets, not live
  fetches
- Hero image compressed/converted, file size reported before and after
- `_headers` file in place with long cache lifetimes on static assets
- Build command and output directory confirmed to match Cloudflare Pages
  defaults
