#!/usr/bin/env node
/**
 * Lightweight repo sanity checks (no npm dependencies).
 * Run from repo root: node scripts/verify.mjs
 */
import { existsSync, readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function must(cond, msg) {
  if (!cond) {
    console.error(`verify: ${msg}`);
    process.exit(1);
  }
}

const thresholds = join(root, "config", "thresholds.yml");
must(existsSync(thresholds), `missing ${thresholds}`);
const yml = readFileSync(thresholds, "utf8");
must(yml.includes("score_ranges:"), "config/thresholds.yml missing score_ranges:");
must(yml.includes("signals:"), "config/thresholds.yml missing signals:");

const modesDir = join(root, "modes");
must(existsSync(modesDir), "missing modes/");
const modes = readdirSync(modesDir).filter((f) => f.endsWith(".md"));
const requiredModes = [
  "_signals.md",
  "scan.md",
  "batch.md",
  "verify.md",
  "compare.md",
  "interview.md",
  "report.md",
  "calibrate.md",
  "dashboard.md",
];
for (const name of requiredModes) {
  must(modes.includes(name), `missing modes/${name}`);
}

const reportTpl = join(root, "templates", "report-template.md");
must(existsSync(reportTpl), `missing ${reportTpl}`);

const claude = join(root, "CLAUDE.md");
must(existsSync(claude), "missing CLAUDE.md");

console.log("verify: ok");
