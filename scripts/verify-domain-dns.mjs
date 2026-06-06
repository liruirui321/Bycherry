import { resolve4, resolveCname } from "node:dns/promises";
import { expectedDomain } from "./site-metadata.mjs";

const expectedARecords = new Set([
  "185.199.108.153",
  "185.199.109.153",
  "185.199.110.153",
  "185.199.111.153",
]);
const expectedWwwCname = "liruirui321.github.io";
const wwwDomain = `www.${expectedDomain}`;

async function readARecords(domain) {
  try {
    return await resolve4(domain);
  } catch (error) {
    if (error?.code === "ENODATA" || error?.code === "ENOTFOUND") return [];
    throw error;
  }
}

async function readCnameRecords(domain) {
  try {
    return (await resolveCname(domain)).map((value) => value.replace(/\.$/, ""));
  } catch (error) {
    if (error?.code === "ENODATA" || error?.code === "ENOTFOUND") return [];
    throw error;
  }
}

function allRecordsExpected(records, expectedRecords) {
  return records.length > 0 && records.every((record) => expectedRecords.has(record));
}

function formatList(records) {
  return records.length ? records.join(", ") : "none";
}

const apexARecords = await readARecords(expectedDomain);
const wwwARecords = await readARecords(wwwDomain);
const wwwCnameRecords = await readCnameRecords(wwwDomain);

const apexOk = allRecordsExpected(apexARecords, expectedARecords);
const wwwOk = wwwCnameRecords.includes(expectedWwwCname) || allRecordsExpected(wwwARecords, expectedARecords);

if (!apexOk || !wwwOk) {
  console.error("Domain DNS verification failed.");
  console.error("");
  console.error("Current DNS:");
  console.error(`  ${expectedDomain} A: ${formatList(apexARecords)}`);
  console.error(`  ${wwwDomain} CNAME: ${formatList(wwwCnameRecords)}`);
  console.error(`  ${wwwDomain} A: ${formatList(wwwARecords)}`);
  console.error("");
  console.error("Expected for GitHub Pages:");
  console.error(`  ${expectedDomain} A: ${Array.from(expectedARecords).join(", ")}`);
  console.error(`  ${wwwDomain} CNAME: ${expectedWwwCname}`);
  console.error("");
  console.error("Update the DNS records at the domain provider, then run npm run verify:domain again.");
  process.exit(1);
}

console.log(`Domain DNS verified: ${expectedDomain} and ${wwwDomain} point to GitHub Pages.`);
