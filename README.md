# By Cherry

Cute illustrated personal homepage for `bycherry.me`, built with React, Vite, and Tailwind CSS.
The app uses custom inline illustrations and local React components instead of a generated component library.

## Features

- Warm illustrated creator homepage
- Portfolio cards for science, course design, and AI tools
- Interactive gene expression visualization
- Plant evolution timeline with classroom study cards
- Research prompt kit, concept explainer, and CRISPR teaching simulator
- Notes and research essay sections
- Mailto-based contact form

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

`npm run build` regenerates `public/sitemap.xml` and the static homepage fallback, then runs six verification steps before Vite builds:

- `verify:generated` checks that generated public metadata is committed and up to date.
- `verify:public` checks the custom domain, host fallbacks, robots file, manifest, favicon, app theme color, PWA app titles, social preview URLs, social preview image, and static index metadata fallback.
- `verify:links` checks static internal links and route strings, public routes, home anchors, static public asset links, and safe `target="_blank"` rel attributes.
- `verify:content` checks that every theme work route has detail content coverage in `WorkDetailPage`, every article route has enough detail-page content, visible shell copy keeps the theme-work naming, retired low-quality page copy cannot reappear, and work-card CTAs match their entry behavior.
- `verify:a11y` checks static `aria-labelledby`, `aria-describedby`, `aria-controls`, duplicate static ids, labeled nonsemantic containers, previous/next navigation labels, and fixed SVG definition ids in reusable illustration components.
- `verify:sitemap` compares public routes with `public/sitemap.xml`, including `lastmod`, `changefreq`, and `priority` metadata.

You can run the checks on their own:

```bash
npm run verify:public
npm run verify:generated
npm run verify:links
npm run verify:content
npm run verify:a11y
npm run verify:sitemap
npm run generate:index
npm run generate:sitemap
```

## Deployment

The app uses client-side routes such as `/works/gene-expression`.
Vercel rewrites are configured in `vercel.json`; Netlify fallback is in `public/_redirects`.
`public/404.html` also preserves direct deep links for static hosts such as GitHub Pages.
`public/CNAME` keeps the GitHub Pages custom domain set to `bycherry.me`.
Search crawler hints live in `public/robots.txt` and `public/sitemap.xml`.

## Content Maintenance

When adding or removing public content:

- Add the route to the matching data source in `src/app/components/Works.tsx`, `Notes.tsx`, or `ResearchEssays.tsx`.
- For work cards, make `action` describe opening, exploring, or starting the tool; reserve copy-oriented labels for real copy buttons inside detail pages.
- Run `npm run generate:sitemap`, `npm run generate:index`, or `npm run build` to update generated public metadata.
- For works, keep sitemap `lastmod` equal to the item `updated` in `Works.tsx`.
- For notes and research essays, keep sitemap `lastmod` equal to the item `date`.
- Make sure any new static links point to an existing route, home anchor, or public asset.
- Make sure any new static `aria-*` references point to an existing id.
- Add a semantic `role` when a `div` or `span` needs an `aria-label`.
- Give previous/next navigation card links an explicit `aria-label` with the target title.
- Make sure generated files are committed after changing content routes.
- Keep public page text product-facing; avoid restoring placeholder, demo, MVP, or design-idea copy.
- Keep dependencies aligned with actual imports; avoid committing unused generated UI component sets.
- Run `npm run build` before pushing.
