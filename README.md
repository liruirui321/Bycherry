# By Cherry

Cute illustrated personal homepage for `bycherry.me`, built with React, Vite, and Tailwind CSS.

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

`npm run build` runs four verification steps before Vite builds:

- `verify:public` checks the custom domain, robots file, manifest, favicon, and social preview image.
- `verify:links` checks static internal links, public routes, home anchors, and static public asset links.
- `verify:a11y` checks static `aria-labelledby`, `aria-describedby`, `aria-controls`, and duplicate static ids.
- `verify:sitemap` compares public routes with `public/sitemap.xml`, including `lastmod` dates.

You can run the checks on their own:

```bash
npm run verify:public
npm run verify:links
npm run verify:a11y
npm run verify:sitemap
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
- Update `public/sitemap.xml` with the same route.
- For works, keep sitemap `lastmod` equal to the item `updated` in `Works.tsx`.
- For notes and research essays, keep sitemap `lastmod` equal to the item `date`.
- Make sure any new static links point to an existing route, home anchor, or public asset.
- Make sure any new static `aria-*` references point to an existing id.
- Run `npm run build` before pushing.
