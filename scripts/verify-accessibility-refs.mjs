import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const sourceRoot = resolve(root, "src/app");

function walkFiles(directory, extensions, files = []) {
  for (const entry of readdirSync(directory)) {
    const fullPath = resolve(directory, entry);
    if (statSync(fullPath).isDirectory()) {
      walkFiles(fullPath, extensions, files);
      continue;
    }

    if (extensions.some((extension) => fullPath.endsWith(extension))) {
      files.push(fullPath);
    }
  }

  return files;
}

function sourceLabel(filePath) {
  return filePath.replace(`${root}/`, "");
}

function extractStringConstants(source) {
  return new Map(
    Array.from(source.matchAll(/\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*"([^"]+)"/g), (match) => [match[1], match[2]])
  );
}

function resolveToken(token, stringConstants) {
  if (token.startsWith('"') && token.endsWith('"')) return token.slice(1, -1);
  return stringConstants.get(token) ?? null;
}

function collectIds(source, stringConstants) {
  const ids = new Set();
  const counts = new Map();

  function addId(id) {
    ids.add(id);
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }

  for (const match of source.matchAll(/\bid="([^"]+)"/g)) {
    addId(match[1]);
  }

  for (const match of source.matchAll(/\bid=\{([A-Za-z_$][\w$]*)\}/g)) {
    const resolved = stringConstants.get(match[1]);
    if (resolved) addId(resolved);
  }

  return { ids, counts };
}

function collectAriaReferences(source, stringConstants) {
  const references = [];
  const attributeNames = ["aria-labelledby", "aria-describedby", "aria-controls"];

  for (const attribute of attributeNames) {
    const literalPattern = new RegExp(`\\b${attribute}="([^"]+)"`, "g");
    for (const match of source.matchAll(literalPattern)) {
      for (const id of match[1].split(/\s+/).filter(Boolean)) {
        references.push({ attribute, id });
      }
    }

    const expressionPattern = new RegExp(`\\b${attribute}=\\{([^}]+)\\}`, "g");
    for (const match of source.matchAll(expressionPattern)) {
      const value = resolveToken(match[1].trim(), stringConstants);
      if (!value) continue;

      for (const id of value.split(/\s+/).filter(Boolean)) {
        references.push({ attribute, id });
      }
    }
  }

  return references;
}

function isIllustrationComponentFile(source) {
  return /\b(?:export\s+)?function\s+[A-Za-z_$][\w$]*Illustration\b/.test(source);
}

function collectStaticSvgDefinitionIds(source) {
  return Array.from(
    source.matchAll(/<(linearGradient|radialGradient|clipPath|filter|mask|marker)\b[^>]*\bid="([^"]+)"/g),
    (match) => ({ tag: match[1], id: match[2] })
  );
}

function collectLabeledNonsemanticContainers(source) {
  return Array.from(
    source.matchAll(/<(div|span)\b(?=[^>]*\baria-label=)(?![^>]*\brole=)[^>]*>/g),
    (match) => ({ tag: match[1], snippet: match[0].replace(/\s+/g, " ").slice(0, 160) })
  );
}

const failures = [];
const duplicateIdAllowlist = new Set(["main-content"]);
let checkedReferences = 0;
let checkedIds = 0;
let checkedReusableSvgDefinitions = 0;
let checkedLabeledContainers = 0;

for (const filePath of walkFiles(sourceRoot, [".tsx", ".ts"])) {
  const source = readFileSync(filePath, "utf8");
  const stringConstants = extractStringConstants(source);
  const { ids, counts } = collectIds(source, stringConstants);
  const references = collectAriaReferences(source, stringConstants);
  const staticSvgDefinitionIds = isIllustrationComponentFile(source) ? collectStaticSvgDefinitionIds(source) : [];
  const labeledNonsemanticContainers = collectLabeledNonsemanticContainers(source);
  checkedIds += ids.size;
  checkedReferences += references.length;
  checkedReusableSvgDefinitions += staticSvgDefinitionIds.length;
  checkedLabeledContainers += labeledNonsemanticContainers.length;

  for (const [id, count] of counts) {
    if (count > 1 && !duplicateIdAllowlist.has(id)) {
      failures.push(`${sourceLabel(filePath)} declares static id="${id}" ${count} times.`);
    }
  }

  for (const definition of staticSvgDefinitionIds) {
    failures.push(`${sourceLabel(filePath)} declares reusable SVG <${definition.tag}> id="${definition.id}". Use an instance-scoped id such as React useId().`);
  }

  for (const reference of references) {
    if (!ids.has(reference.id)) {
      failures.push(`${sourceLabel(filePath)} has ${reference.attribute}="${reference.id}" without a matching static id.`);
    }
  }

  for (const container of labeledNonsemanticContainers) {
    failures.push(`${sourceLabel(filePath)} has <${container.tag}> with aria-label but no role: ${container.snippet}`);
  }
}

if (failures.length) {
  console.error("Accessibility reference verification failed.");
  console.error(failures.map((failure) => `  - ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Accessibility refs verified: ${checkedReferences} static aria references, ${checkedIds} static ids, ${checkedReusableSvgDefinitions} reusable SVG definition ids, and ${checkedLabeledContainers} labeled nonsemantic containers without roles.`);
