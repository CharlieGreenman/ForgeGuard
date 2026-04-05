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

const scoreStart = yml.indexOf("score_ranges:");
must(scoreStart !== -1, "config/thresholds.yml missing score_ranges:");
const signalsStart = yml.indexOf("\nsignals:");
must(signalsStart !== -1, "config/thresholds.yml missing signals block after score_ranges");
const scoreBlock = yml.slice(scoreStart, signalsStart);
must(/^\s+pass:/m.test(scoreBlock), "config/thresholds.yml score_ranges missing pass");
must(/^\s+review:/m.test(scoreBlock), "config/thresholds.yml score_ranges missing review");
must(/^\s+flag:/m.test(scoreBlock), "config/thresholds.yml score_ranges missing flag");

const sigBlock = yml.slice(signalsStart);
const sigLines = sigBlock.match(/^\s{2}[LSTMVX][1-7]:/gm);
must(sigLines && sigLines.length === 42, `expected 42 signal entries in thresholds.yml, found ${sigLines?.length ?? 0}`);
const prefixes = ["L", "S", "T", "M", "V", "X"];
for (const p of prefixes) {
  for (let i = 1; i <= 7; i++) {
    const id = `${p}${i}`;
    must(
      new RegExp(`^  ${id}:\\s`, "m").test(sigBlock),
      `config/thresholds.yml missing signal ${id}`
    );
  }
}

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
