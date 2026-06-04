import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

function read(relativePath) {
  return readFileSync(resolve(root, relativePath), "utf8");
}

const packageJson = JSON.parse(read("package.json"));
const mainSource = read("src/main.tsx");
const indexCss = read("src/styles/index.css");
const tailwindCss = read("src/styles/tailwind.css");
const viteConfig = read("vite.config.ts");
const failures = [];

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

expectExactKeys(packageJson.dependencies, ["react", "react-dom", "tw-animate-css"], "dependencies");
expectExactKeys(packageJson.devDependencies, ["@tailwindcss/vite", "@vitejs/plugin-react", "tailwindcss", "vite"], "devDependencies");

expect(mainSource.includes('import { createRoot } from "react-dom/client";'), "src/main.tsx must mount React through react-dom/client.");
expect(mainSource.includes('import App from "./app/App.tsx";'), "src/main.tsx must import the app root component.");
expect(mainSource.includes('import "./styles/index.css";'), "src/main.tsx must import the central stylesheet.");

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

console.log("Project wiring verified: dependencies, Vite plugins, React entrypoint, and stylesheet imports are aligned.");
