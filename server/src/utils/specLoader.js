import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../../..");

export function readSpec(relativePath) {
  const fullPath = path.join(rootDir, "specs", relativePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(raw);
}

export function getHiringSpec(specId = "frontend-developer") {
  return readSpec(`hiring/${specId}.json`);
}

export function getWorkflowSpec(specId = "default-hiring-workflow") {
  return readSpec(`workflow/${specId}.json`);
}

export function getRetryPolicy() {
  return readSpec("system/retry-policy.json");
}

export function getShortlistingSpec() {
  return readSpec("evaluation/shortlisting.json");
}

export function getEmailTemplates() {
  return readSpec("email/templates.json");
}
