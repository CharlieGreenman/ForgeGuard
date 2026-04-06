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

const passM = scoreBlock.match(/^\s+pass:\s*(\d+)/m);
const reviewM = scoreBlock.match(/^\s+review:\s*(\d+)/m);
const flagM = scoreBlock.match(/^\s+flag:\s*(\d+)/m);
must(passM && reviewM && flagM, "config/thresholds.yml score_ranges pass/review/flag must be integers");
const passN = Number(passM[1]);
const reviewN = Number(reviewM[1]);
const flagN = Number(flagM[1]);
must(
  passN > reviewN && reviewN > flagN,
  `config/thresholds.yml score_ranges must satisfy pass > review > flag (got pass=${passN}, review=${reviewN}, flag=${flagN})`
);

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

const signalsMd = join(root, "modes", "_signals.md");
must(existsSync(signalsMd), `missing ${signalsMd}`);
const signalsMdContent = readFileSync(signalsMd, "utf8");
for (const p of prefixes) {
  for (let i = 1; i <= 7; i++) {
    const id = `${p}${i}`;
    must(
      signalsMdContent.includes(`| ${id} |`),
      `modes/_signals.md missing taxonomy row for signal ${id}`
    );
  }
}

function normalizeSignalLabel(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

for (const line of sigBlock.split("\n")) {
  const m = line.match(
    /^\s*(L[1-7]|S[1-7]|T[1-7]|M[1-7]|V[1-7]|X[1-7]):\s*\{[^}]*\bname:\s*"([^"]+)"\s*\}\s*$/
  );
  if (!m) continue;
  const id = m[1];
  const yamlName = m[2];
  const rowM = signalsMdContent.match(new RegExp(`\\| ${id} \\|[^\\n]*`));
  must(rowM, `modes/_signals.md missing table row for signal ${id} (expected | ${id} | ...)`);
  const normYaml = normalizeSignalLabel(yamlName);
  const normRow = normalizeSignalLabel(rowM[0]);
  must(
    normRow.includes(normYaml),
    `modes/_signals.md row for ${id} must include the same label as config/thresholds.yml name: "${yamlName}"`
  );
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

const reportModePath = join(root, "modes", "report.md");
must(existsSync(reportModePath), `missing ${reportModePath}`);
const reportMode = readFileSync(reportModePath, "utf8");
must(
  reportMode.includes("templates/report-template.md"),
  "modes/report.md must reference templates/report-template.md so committee reports align with per-candidate output"
);

const calibrateModePath = join(root, "modes", "calibrate.md");
must(existsSync(calibrateModePath), `missing ${calibrateModePath}`);
const calibrateMode = readFileSync(calibrateModePath, "utf8");
must(
  calibrateMode.includes("`npm run verify`"),
  "modes/calibrate.md must cite `npm run verify` after threshold edits so maintainers run the quality gate"
);

const interviewModePath = join(root, "modes", "interview.md");
must(existsSync(interviewModePath), `missing ${interviewModePath}`);
const interviewMode = readFileSync(interviewModePath, "utf8");
must(
  interviewMode.includes("config/thresholds.yml"),
  "modes/interview.md must reference config/thresholds.yml so PASS/REVIEW/FLAG context matches scan and calibrated score_ranges"
);

const skill = join(root, ".claude", "skills", "forge-guard", "SKILL.md");
must(existsSync(skill), `missing ${skill}`);
const skillMd = readFileSync(skill, "utf8");
must(
  skillMd.includes("npm run verify"),
  ".claude/skills/forge-guard/SKILL.md must mention npm run verify so the skill stays aligned with package.json scripts.verify"
);

for (const name of ["authentic-resume.md", "ai-generated-resume.md"]) {
  const p = join(root, "examples", name);
  must(existsSync(p), `missing ${p}`);
}

const pkgPath = join(root, "package.json");
must(existsSync(pkgPath), "missing package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
must(
  pkg.scripts?.verify === "node scripts/verify.mjs",
  'package.json scripts.verify must be "node scripts/verify.mjs"'
);

const claude = join(root, "CLAUDE.md");
must(existsSync(claude), "missing CLAUDE.md");
const claudeMd = readFileSync(claude, "utf8");
must(
  claudeMd.includes("npm run verify"),
  "CLAUDE.md must mention npm run verify so agent instructions stay aligned with package.json scripts.verify"
);

const readmePath = join(root, "README.md");
must(existsSync(readmePath), "missing README.md");
const readme = readFileSync(readmePath, "utf8");
const howStart = readme.indexOf("## How It Works");
must(howStart !== -1, "README.md missing ## How It Works section");
const detectStart = readme.indexOf("\n## Detection Signal Categories");
must(detectStart !== -1, "README.md missing ## Detection Signal Categories section");
const howSection = readme.slice(howStart, detectStart);
must(
  howSection.includes("`config/thresholds.yml`"),
  "README.md How It Works must cite `config/thresholds.yml` for PASS/REVIEW/FLAG cutoffs"
);
const reviewUpper = passN - 1;
must(
  howSection.includes(`${passN}+`) &&
    howSection.includes(`${reviewN}-${reviewUpper}`) &&
    howSection.includes(`<${reviewN}`),
  `README.md How It Works diagram must match config/thresholds.yml score_ranges (pass=${passN}, review=${reviewN}; REVIEW band ${reviewN}-${reviewUpper}, FLAG <${reviewN})`
);

const devStart = readme.indexOf("## Development");
must(devStart !== -1, "README.md missing ## Development section");
const ethicalStart = readme.indexOf("\n## Ethical Use", devStart);
must(
  ethicalStart !== -1,
  "README.md must keep ## Ethical Use after ## Development so the Development section can be validated"
);
const devSection = readme.slice(devStart, ethicalStart);
must(
  devSection.includes("`npm run verify`"),
  "README.md Development must cite `npm run verify` (see package.json scripts.verify)"
);

console.log("verify: ok");
