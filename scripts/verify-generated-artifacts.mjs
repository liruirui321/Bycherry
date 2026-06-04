import { spawnSync } from "node:child_process";

const generatedFiles = ["index.html", "public/sitemap.xml"];
const diff = spawnSync("git", ["diff", "--exit-code", "--", ...generatedFiles], {
  encoding: "utf8",
});

if (diff.status === 0) {
  console.log(`Generated artifacts verified: ${generatedFiles.join(", ")} are up to date.`);
  process.exit(0);
}

if (diff.status === 1) {
  console.error("Generated artifacts are out of date. Run npm run build and commit the generated changes.");
  if (diff.stdout) console.error(diff.stdout);
  process.exit(1);
}

console.error("Generated artifact verification failed.");
if (diff.stderr) console.error(diff.stderr);
process.exit(diff.status ?? 1);
