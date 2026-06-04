# By Cherry

Cute illustrated personal homepage for `bycherry.me`, built with React, Vite, and Tailwind CSS.

## Features

- Warm illustrated creator homepage
- Portfolio cards for science, course design, and AI tools
- Interactive gene expression visualization
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

`npm run build` runs `npm run verify:sitemap` before Vite builds. The sitemap check compares the public routes in `Works.tsx`, `Notes.tsx`, and `ResearchEssays.tsx` with `public/sitemap.xml`, including `lastmod` dates for notes and research essays.

You can run the check on its own:

```bash
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
- For notes and research essays, keep sitemap `lastmod` equal to the item `date`.
- Run `npm run verify:sitemap` before pushing.
