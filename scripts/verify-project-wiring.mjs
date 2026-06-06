import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

function read(relativePath) {
  return readFileSync(resolve(root, relativePath), "utf8");
}

const packageJson = JSON.parse(read("package.json"));
const packageLock = JSON.parse(read("package-lock.json"));
const mainSource = read("src/main.tsx");
const appSource = read("src/app/App.tsx");
const routePrefetchSource = read("src/app/routePrefetch.ts");
const workCardsSource = read("src/app/components/Works.tsx");
const heroSource = read("src/app/components/Hero.tsx");
const noteCardsSource = read("src/app/components/Notes.tsx");
const researchCardsSource = read("src/app/components/ResearchEssays.tsx");
const navSource = read("src/app/components/Nav.tsx");
const indexCss = read("src/styles/index.css");
const tailwindCss = read("src/styles/tailwind.css");
const viteConfig = read("vite.config.ts");
const failures = [];
const expectedDependencies = ["react", "react-dom", "tw-animate-css"];
const expectedDevDependencies = ["@tailwindcss/vite", "@vitejs/plugin-react", "tailwindcss", "vite"];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function expectExactKeys(object, expectedKeys, label) {
  const actualKeys = Object.keys(object ?? {}).sort();
  const sortedExpectedKeys = [...expectedKeys].sort();
  expect(
    JSON.stringify(actualKeys) === JSON.stringify(sortedExpectedKeys),
    `${label} must contain exactly ${sortedExpectedKeys.join(", ")}. Current: ${actualKeys.join(", ")}`
  );
}

function expectExactObject(actual, expected, label) {
  const sortedActual = Object.fromEntries(Object.entries(actual ?? {}).sort(([left], [right]) => left.localeCompare(right)));
  const sortedExpected = Object.fromEntries(Object.entries(expected ?? {}).sort(([left], [right]) => left.localeCompare(right)));
  expect(
    JSON.stringify(sortedActual) === JSON.stringify(sortedExpected),
    `${label} must match package.json exactly.`
  );
}

function packagePath(packageName) {
  return `node_modules/${packageName}`;
}

expectExactKeys(packageJson.dependencies, expectedDependencies, "dependencies");
expectExactKeys(packageJson.devDependencies, expectedDevDependencies, "devDependencies");

expect(packageLock.name === packageJson.name, "package-lock.json name must match package.json.");
expect(packageLock.version === packageJson.version, "package-lock.json version must match package.json.");
expect(packageLock.lockfileVersion === 3, "package-lock.json must use lockfileVersion 3.");
expect(packageLock.requires === true, "package-lock.json must keep requires set to true.");
expect(Boolean(packageLock.packages?.[""]), "package-lock.json must include a root packages entry.");

const packageLockRoot = packageLock.packages?.[""];
expect(packageLockRoot?.name === packageJson.name, "package-lock.json root package name must match package.json.");
expect(packageLockRoot?.version === packageJson.version, "package-lock.json root package version must match package.json.");
expectExactObject(packageLockRoot?.dependencies, packageJson.dependencies, "package-lock.json root dependencies");
expectExactObject(packageLockRoot?.devDependencies, packageJson.devDependencies, "package-lock.json root devDependencies");

[...expectedDependencies, ...expectedDevDependencies].forEach((dependencyName) => {
  expect(Boolean(packageLock.packages?.[packagePath(dependencyName)]), `package-lock.json must include ${packagePath(dependencyName)}.`);
});

expect(mainSource.includes('import { createRoot } from "react-dom/client";'), "src/main.tsx must mount React through react-dom/client.");
expect(mainSource.includes('import App from "./app/App.tsx";'), "src/main.tsx must import the app root component.");
expect(mainSource.includes('import "./styles/index.css";'), "src/main.tsx must import the central stylesheet.");

expect(appSource.includes("lazy, Suspense"), "src/app/App.tsx must import lazy and Suspense for route-level code splitting.");
expect(appSource.includes('lazy(() => import("./components/WorkDetailPage")'), "Work detail pages must be loaded lazily.");
expect(appSource.includes('lazy(() => import("./components/ArticleDetailPage")'), "Article detail pages must be loaded lazily.");
expect(!appSource.includes('import { WorkDetailPage } from "./components/WorkDetailPage";'), "WorkDetailPage must not be statically imported into the home bundle.");
expect(!appSource.includes('import { ArticleDetailPage } from "./components/ArticleDetailPage";'), "ArticleDetailPage must not be statically imported into the home bundle.");
expect(routePrefetchSource.includes('import("./components/WorkDetailPage")'), "Route prefetch must warm the work detail chunk.");
expect(routePrefetchSource.includes('import("./components/ArticleDetailPage")'), "Route prefetch must warm the article detail chunk.");
expect(routePrefetchSource.includes('import("./components/ArticleLibraryPage")') && routePrefetchSource.includes('href === "/reading"'), "Route prefetch must warm the compact reading-library route.");
expect(routePrefetchSource.includes("prefetchedRouteKinds"), "Route prefetch must dedupe repeated hover/focus requests.");
expect(!appSource.includes("<Works") && !workCardsSource.includes("export function Works"), "Homepage work entries must live in the hero, with Works.tsx kept data-only.");
expect(heroSource.includes("preloadRouteForHref(getWorkToolHref(work.href))"), "Hero work cards must prefetch direct-to-tool detail routes on hover or focus.");
expect(heroSource.includes('import { notes } from "./Notes"') && heroSource.includes('import { essays } from "./ResearchEssays"'), "Hero directory must import article data directly without restoring article card sections.");
expect(heroSource.includes('href="/reading"') && heroSource.includes('preloadRouteForHref("/reading")'), "Hero reading-library entry must stay as one compact /reading route with prefetch, not a repeated article list.");
expect(!noteCardsSource.includes("export function Notes") && !noteCardsSource.includes("note-card"), "Notes.tsx must stay data-only so old homepage card code is not bundled.");
expect(!researchCardsSource.includes("export function ResearchEssays") && !researchCardsSource.includes("research-essay-card"), "ResearchEssays.tsx must stay data-only so old homepage card code is not bundled.");
expect(!navSource.includes("preloadRouteForHref") && !navSource.includes("nav-link"), "Navigation must not keep prefetch wiring for removed repeated homepage entries.");
expect(heroSource.includes("onPointerDown"), "Homepage content-directory entries must prefetch on pointer down for touch devices.");

expect(indexCss.includes("@import './fonts.css';"), "src/styles/index.css must import fonts.css.");
expect(indexCss.includes("@import './tailwind.css';"), "src/styles/index.css must import tailwind.css.");
expect(indexCss.includes("@import './theme.css';"), "src/styles/index.css must import theme.css.");

expect(tailwindCss.includes("@import 'tailwindcss' source(none);"), "src/styles/tailwind.css must import Tailwind with explicit source control.");
expect(tailwindCss.includes("@source '../**/*.{js,ts,jsx,tsx}';"), "src/styles/tailwind.css must include the app source glob.");
expect(tailwindCss.includes("@import 'tw-animate-css';"), "src/styles/tailwind.css must import tw-animate-css when the dependency is installed.");

expect(viteConfig.includes("import tailwindcss from '@tailwindcss/vite'"), "vite.config.ts must import the Tailwind Vite plugin.");
expect(viteConfig.includes("import react from '@vitejs/plugin-react'"), "vite.config.ts must import the React Vite plugin.");
expect(viteConfig.includes("react()"), "vite.config.ts must enable the React plugin.");
expect(viteConfig.includes("tailwindcss()"), "vite.config.ts must enable the Tailwind plugin.");

if (failures.length) {
  console.error("Project wiring verification failed.");
  console.error(failures.map((failure) => `  - ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Project wiring verified: dependencies, package lock, Vite plugins, React entrypoint, and stylesheet imports are aligned.");
