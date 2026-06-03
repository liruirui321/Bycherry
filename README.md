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

## Deployment

The app uses client-side routes such as `/works/gene-expression`.
Vercel rewrites are configured in `vercel.json`; Netlify fallback is in `public/_redirects`.
`public/404.html` also preserves direct deep links for static hosts such as GitHub Pages with a custom domain.
