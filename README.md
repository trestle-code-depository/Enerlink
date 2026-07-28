# EnerLink Group — Website

Static HTML/CSS/JS. No build step and no dependencies — the site is served straight from `public/`.

## Repository layout

```
wrangler.toml        Cloudflare Worker config (static assets only)
public/              Everything that gets served
  index.html         Home
  about.html         About
  why-enerlink.html  Why EnerLink
  services.html      Services
  reach.html         Global Reach
  opportunities.html Opportunities
  news.html          News & Company Brochure
  contact.html       Contact
  404.html           Not found
  styles.css         Custom styles complementing Tailwind
  main.js            Dark mode, mobile menu, reveals, counters, contact form
  map.js             Corridor map — renders into any [data-corridor-map] element
  hero.jpg           Home hero background
  lng-kitimat.jpg    LNG opportunity card
  EnerLink-Brochure-EN.pdf
  robots.txt, sitemap.xml
```

Every nav tab is its own page — there are no home-page anchor links in the navigation.

## Deploying — Cloudflare Workers (current setup)

The `enerlinkgroup` Worker is already connected to this repo with:

- Build command: *none*
- Deploy command: `npx wrangler deploy`
- Root directory: `/`
- Production branch: `main`

`wrangler deploy` reads `wrangler.toml`, uploads everything in `public/` as static assets, and serves `404.html` for unknown paths. **This file must be at the repository root or the build fails.**

To publish: commit and push to `main`. Cloudflare builds automatically; watch progress under the Worker's **Deployments** tab.

```bash
git add .
git commit -m "Site content revision"
git push origin main
```

If the live site still shows old content after a green deployment, purge the Cloudflare cache (**Caching → Configuration → Purge Everything**) and hard-reload.

## Deploying — Cloudflare Pages (simpler alternative)

If you would rather use Pages: Workers & Pages → Create → **Pages** tab → Connect to Git. Framework preset **None**, build command **empty**, build output directory **`public`**. `wrangler.toml` is then ignored.

## External dependencies (CDN, loaded at runtime)

- Tailwind CSS (Play CDN) — `cdn.tailwindcss.com`
- Font Awesome 6.5.1 — `cdnjs.cloudflare.com`
- Google Fonts — Inter, Space Grotesk
- d3 7.9.0 + topojson-client 3.1.0 (map, subresource-integrity pinned) — `unpkg.com`
- Natural Earth country geometry — `cdn.jsdelivr.net/npm/world-atlas@2.0.2`

**Before public launch:** Tailwind's Play CDN is meant for prototyping. For production, compile the stylesheet with the Tailwind CLI and ship a single CSS file.

## Not yet wired

- **Contact form** — the markup carries `data-netlify` attributes, which do nothing on Cloudflare. Point the form at Formspree, a Cloudflare Worker endpoint, or your own handler before launch.
- **Analytics** — no tag installed. Cloudflare Web Analytics or GA4 in each `<head>`.
- **Cookie/consent banner** — required in Canada, Korea and the EU before analytics fire.
- **Social links** — the LinkedIn and X icons in the footer point at `#`.

## Content still needed

- Team photography for the About page
- Korea petroleum-product export-mix figures (the Global Reach chart from the revision deck)
- Confirmation of the Houston office address and phone line
