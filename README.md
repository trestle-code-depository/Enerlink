# EnerLink Group — Website

Static HTML/CSS/JS. No build step, no dependencies, no package.json. Every file sits at the repository root so it deploys with no configuration.

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `about.html` | About |
| `why-enerlink.html` | Why EnerLink |
| `services.html` | Services |
| `reach.html` | Global Reach |
| `opportunities.html` | Opportunities |
| `news.html` | News & Company Brochure |
| `contact.html` | Contact |
| `404.html` | Not found |

Each nav tab is a separate page — there are no home-page anchor links in the navigation.

## Assets

| File | Purpose |
|---|---|
| `styles.css` | Custom styles that complement Tailwind |
| `main.js` | Dark mode, mobile menu, scroll reveals, counters, back-to-top, contact form |
| `map.js` | Corridor map — renders into any `[data-corridor-map]` element |
| `hero.jpg` | Home hero background |
| `lng-kitimat.jpg` | LNG opportunity card |
| `EnerLink-Brochure-EN.pdf` | Company brochure, linked from News and the footer |
| `robots.txt`, `sitemap.xml` | SEO |
| `.nojekyll` | Required for GitHub Pages to serve files normally |

## Deploying

### GitHub Pages
1. Create a repository and push these files to the root of the `main` branch.
2. Repository → **Settings** → **Pages**.
3. **Source:** Deploy from a branch. **Branch:** `main`, folder `/ (root)`. Save.
4. The site publishes at `https://<user>.github.io/<repo>/`.
5. Custom domain: **Settings → Pages → Custom domain**, enter `www.enerlinkgroup.com`, then add a `CNAME` DNS record pointing at `<user>.github.io`.

`.nojekyll` is included so GitHub Pages serves every file as-is.

### Cloudflare Pages (alternative)
Workers & Pages → Create → **Pages** tab → Connect to Git → pick the repo.
Framework preset **None**, build command **empty**, build output directory **empty**.

## External dependencies (CDN, loaded at runtime)

- Tailwind CSS (Play CDN) — `cdn.tailwindcss.com`
- Font Awesome 6.5.1 — `cdnjs.cloudflare.com`
- Google Fonts — Inter, Space Grotesk
- d3 7.9.0 + topojson-client 3.1.0 (map, subresource-integrity pinned) — `unpkg.com`
- Natural Earth country geometry — `cdn.jsdelivr.net/npm/world-atlas@2.0.2`

**Before public launch:** Tailwind's Play CDN is intended for prototyping. For production, either compile the stylesheet with the Tailwind CLI and ship a single CSS file, or accept the CDN's runtime cost.

## Not yet wired

- **Contact form** — markup carries `data-netlify` attributes. On GitHub Pages that does nothing; point the form at Formspree, Netlify Forms, or your own endpoint before launch.
- **Analytics** — no tag installed. Add a GA4 or Plausible snippet to each `<head>`.
- **Cookie/consent banner** — required in Canada, Korea and the EU before analytics fire.
- **Social links** — the LinkedIn and X icons in the footer point at `#`.

## Content still needed

- Team photography for the About page
- Korea petroleum-product export-mix figures (the Global Reach chart from the revision deck)
- Confirmation of the Houston office address and phone line
