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

const scanReviewUpper = passN - 1;
const scanFlagUpper = reviewN - 1;

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
must(
  signalsMdContent.includes("`npm run verify`"),
  "modes/_signals.md must cite `npm run verify` after taxonomy or threshold edits so maintainers run the quality gate"
);
must(
  signalsMdContent.includes("score_ranges") &&
    signalsMdContent.includes("config/thresholds.yml") &&
    signalsMdContent.includes("modes/scan.md") &&
    signalsMdContent.includes("Step 4"),
  "modes/_signals.md must tie PASS/REVIEW/FLAG to score_ranges in config/thresholds.yml and modes/scan.md Step 4"
);
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
const reportTplContent = readFileSync(reportTpl, "utf8");
must(
  reportTplContent.includes("config/thresholds.yml"),
  "templates/report-template.md must reference config/thresholds.yml for PASS/REVIEW/FLAG cutoffs"
);
must(
  reportTplContent.includes("modes/scan.md"),
  "templates/report-template.md must reference modes/scan.md Step 4 for recommendation tier semantics"
);

const reportModePath = join(root, "modes", "report.md");
must(existsSync(reportModePath), `missing ${reportModePath}`);
const reportMode = readFileSync(reportModePath, "utf8");
must(
  reportMode.includes("templates/report-template.md"),
  "modes/report.md must reference templates/report-template.md so committee reports align with per-candidate output"
);
must(
  reportMode.includes("modes/scan.md") && reportMode.includes("Step 4"),
  "modes/report.md must reference modes/scan.md Step 4 for recommendation tier semantics (align with templates/report-template.md)"
);
must(
  reportMode.includes("`npm run verify`"),
  "modes/report.md must cite `npm run verify` after template or threshold edits so maintainers run the quality gate"
);
must(
  reportMode.includes("config/thresholds.yml"),
  "modes/report.md must reference config/thresholds.yml so committee summaries use the same score_ranges as scan"
);
must(
  reportMode.includes(`(default: ${passN}+)`),
  `modes/report.md Step 2 must document PASS default matching config/thresholds.yml (pass=${passN})`
);
must(
  reportMode.includes(`(default: ${reviewN}–${scanReviewUpper})`),
  `modes/report.md Step 2 must document REVIEW default band matching config (review=${reviewN}, pass=${passN} → ${reviewN}–${scanReviewUpper})`
);
must(
  reportMode.includes(`(default: 0–${scanFlagUpper})`),
  `modes/report.md Step 2 must document FLAG default integer band matching config (review=${reviewN} → 0–${scanFlagUpper})`
);

const scanModePath = join(root, "modes", "scan.md");
must(existsSync(scanModePath), `missing ${scanModePath}`);
const scanMode = readFileSync(scanModePath, "utf8");
must(
  scanMode.includes("`npm run verify`"),
  "modes/scan.md must cite `npm run verify` after threshold or taxonomy edits so maintainers run the quality gate"
);

must(
  scanMode.includes(`(default: ${passN}+)`),
  `modes/scan.md Step 4 must document PASS default matching config/thresholds.yml (pass=${passN})`
);
must(
  scanMode.includes(`(default: ${reviewN}–${scanReviewUpper})`),
  `modes/scan.md Step 4 must document REVIEW default band matching config (review=${reviewN}, pass=${passN} → ${reviewN}–${scanReviewUpper})`
);
must(
  scanMode.includes(`(default: 0–${scanFlagUpper})`),
  `modes/scan.md Step 4 must document FLAG default integer band matching config (review=${reviewN} → 0–${scanFlagUpper} on integer scores)`
);

const calibrateModePath = join(root, "modes", "calibrate.md");
must(existsSync(calibrateModePath), `missing ${calibrateModePath}`);
const calibrateMode = readFileSync(calibrateModePath, "utf8");
must(
  calibrateMode.includes("`npm run verify`"),
  "modes/calibrate.md must cite `npm run verify` after threshold edits so maintainers run the quality gate"
);
must(
  calibrateMode.includes("`modes/scan.md` Step 4"),
  "modes/calibrate.md must reference `modes/scan.md` Step 4 so calibrated score_ranges stay aligned with scan tier semantics"
);

const interviewModePath = join(root, "modes", "interview.md");
must(existsSync(interviewModePath), `missing ${interviewModePath}`);
const interviewMode = readFileSync(interviewModePath, "utf8");
must(
  interviewMode.includes("config/thresholds.yml"),
  "modes/interview.md must reference config/thresholds.yml so PASS/REVIEW/FLAG context matches scan and calibrated score_ranges"
);
must(
  interviewMode.includes("`npm run verify`"),
  "modes/interview.md must cite `npm run verify` after threshold or taxonomy edits so maintainers run the quality gate"
);
must(
  interviewMode.includes(`(default: ${passN}+)`),
  `modes/interview.md Screening tier context must document PASS default matching config/thresholds.yml (pass=${passN})`
);
must(
  interviewMode.includes(`(default: ${reviewN}–${scanReviewUpper})`),
  `modes/interview.md Screening tier context must document REVIEW default band matching config (review=${reviewN}, pass=${passN} → ${reviewN}–${scanReviewUpper})`
);
must(
  interviewMode.includes(`(default: 0–${scanFlagUpper})`),
  `modes/interview.md Screening tier context must document FLAG default integer band matching config (review=${reviewN} → 0–${scanFlagUpper})`
);

const verifyModePath = join(root, "modes", "verify.md");
must(existsSync(verifyModePath), `missing ${verifyModePath}`);
const verifyMode = readFileSync(verifyModePath, "utf8");
must(
  verifyMode.includes("config/thresholds.yml"),
  "modes/verify.md must reference config/thresholds.yml so combined verify + scan/report output uses the same PASS/REVIEW/FLAG cutoffs"
);
must(
  verifyMode.includes("`npm run verify`"),
  "modes/verify.md must cite `npm run verify` after threshold or taxonomy edits so maintainers run the quality gate"
);
must(
  verifyMode.includes(`(default: ${passN}+)`),
  `modes/verify.md Step 4 must document PASS default matching config/thresholds.yml (pass=${passN})`
);
must(
  verifyMode.includes(`(default: ${reviewN}–${scanReviewUpper})`),
  `modes/verify.md Step 4 must document REVIEW default band matching config (review=${reviewN}, pass=${passN} → ${reviewN}–${scanReviewUpper})`
);
must(
  verifyMode.includes(`(default: 0–${scanFlagUpper})`),
  `modes/verify.md Step 4 must document FLAG default integer band matching config (review=${reviewN} → 0–${scanFlagUpper})`
);

const dashboardModePath = join(root, "modes", "dashboard.md");
must(existsSync(dashboardModePath), `missing ${dashboardModePath}`);
const dashboardMode = readFileSync(dashboardModePath, "utf8");
must(
  dashboardMode.includes("config/thresholds.yml"),
  "modes/dashboard.md must reference config/thresholds.yml so aggregate PASS/REVIEW/FLAG counts match calibrated score_ranges"
);
must(
  dashboardMode.includes("modes/scan.md") && dashboardMode.includes("Step 4"),
  "modes/dashboard.md must reference modes/scan.md Step 4 so dashboard tier semantics match scan"
);
must(
  dashboardMode.includes("`npm run verify`"),
  "modes/dashboard.md must cite `npm run verify` after threshold edits so maintainers run the quality gate"
);
must(
  dashboardMode.includes(`(default: ${passN}+)`),
  `modes/dashboard.md Step 2 must document PASS default matching config/thresholds.yml (pass=${passN})`
);
must(
  dashboardMode.includes(`(default: ${reviewN}–${scanReviewUpper})`),
  `modes/dashboard.md Step 2 must document REVIEW default band matching config (review=${reviewN}, pass=${passN} → ${reviewN}–${scanReviewUpper})`
);
must(
  dashboardMode.includes(`(default: 0–${scanFlagUpper})`),
  `modes/dashboard.md Step 2 must document FLAG default integer band matching config (review=${reviewN} → 0–${scanFlagUpper})`
);

const batchModePath = join(root, "modes", "batch.md");
must(existsSync(batchModePath), `missing ${batchModePath}`);
const batchMode = readFileSync(batchModePath, "utf8");
must(
  batchMode.includes("`npm run verify`"),
  "modes/batch.md must cite `npm run verify` after threshold or mode edits so maintainers run the quality gate"
);
must(
  batchMode.includes("modes/scan.md") && batchMode.includes("Step 4"),
  "modes/batch.md must reference modes/scan.md Step 4 so batch PASS/REVIEW/FLAG counts match scan tier semantics"
);
must(
  batchMode.includes(`(default: ${passN}+)`),
  `modes/batch.md Step 3 must document PASS default matching config/thresholds.yml (pass=${passN})`
);
must(
  batchMode.includes(`(default: ${reviewN}–${scanReviewUpper})`),
  `modes/batch.md Step 3 must document REVIEW default band matching config (review=${reviewN}, pass=${passN} → ${reviewN}–${scanReviewUpper})`
);
must(
  batchMode.includes(`(default: 0–${scanFlagUpper})`),
  `modes/batch.md Step 3 must document FLAG default integer band matching config (review=${reviewN} → 0–${scanFlagUpper})`
);

const compareModePath = join(root, "modes", "compare.md");
must(existsSync(compareModePath), `missing ${compareModePath}`);
const compareMode = readFileSync(compareModePath, "utf8");
must(
  compareMode.includes("config/thresholds.yml"),
  "modes/compare.md must reference config/thresholds.yml so cross-source output stays aligned with PASS/REVIEW/FLAG cutoffs and scan calibration"
);
must(
  compareMode.includes("`npm run verify`"),
  "modes/compare.md must cite `npm run verify` after threshold or mode edits so maintainers run the quality gate"
);
must(
  compareMode.includes("modes/scan.md") && compareMode.includes("Step 4"),
  "modes/compare.md must reference modes/scan.md Step 4 so compare output stays aligned with PASS/REVIEW/FLAG tier semantics when combined with scan"
);
must(
  compareMode.includes(`(default: ${passN}+)`),
  `modes/compare.md Notes must document PASS default matching config/thresholds.yml (pass=${passN})`
);
must(
  compareMode.includes(`(default: ${reviewN}–${scanReviewUpper})`),
  `modes/compare.md Notes must document REVIEW default band matching config (review=${reviewN}, pass=${passN} → ${reviewN}–${scanReviewUpper})`
);
must(
  compareMode.includes(`(default: 0–${scanFlagUpper})`),
  `modes/compare.md Notes must document FLAG default integer band matching config (review=${reviewN} → 0–${scanFlagUpper})`
);

const skill = join(root, ".claude", "skills", "forge-guard", "SKILL.md");
must(existsSync(skill), `missing ${skill}`);
const skillMd = readFileSync(skill, "utf8");
must(
  skillMd.includes("npm run verify"),
  ".claude/skills/forge-guard/SKILL.md must mention npm run verify so the skill stays aligned with package.json scripts.verify"
);
must(
  skillMd.includes("config/thresholds.yml") &&
    skillMd.includes("modes/scan.md") &&
    skillMd.includes("Step 4"),
  ".claude/skills/forge-guard/SKILL.md must reference config/thresholds.yml and modes/scan.md Step 4 for PASS/REVIEW/FLAG semantics"
);
must(
  skillMd.includes("data/screenings.md") && skillMd.includes("reports/"),
  ".claude/skills/forge-guard/SKILL.md must name data/screenings.md and reports/ so gitignored hiring data stays out of upstream commits"
);

for (const name of ["authentic-resume.md", "ai-generated-resume.md"]) {
  const p = join(root, "examples", name);
  must(existsSync(p), `missing ${p}`);
  const exampleMd = readFileSync(p, "utf8");
  must(
    exampleMd.includes("`npm run verify`"),
    `examples/${name} must cite \`npm run verify\` after edits so maintainers run the quality gate`
  );
  must(
    exampleMd.includes("score_ranges") &&
      exampleMd.includes("`config/thresholds.yml`") &&
      exampleMd.includes("`modes/scan.md`") &&
      exampleMd.includes("Step 4"),
    `examples/${name} must tie PASS/REVIEW/FLAG to score_ranges in config/thresholds.yml and modes/scan.md Step 4 (align with scan and README)`
  );
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
must(
  claudeMd.includes("CharlieGreenman@users.noreply.github.com"),
  "CLAUDE.md must document the upstream git author email (CharlieGreenman@users.noreply.github.com)"
);
must(
  claudeMd.includes("`scripts/cursor-agent-loop.sh`"),
  "CLAUDE.md Main Files must list scripts/cursor-agent-loop.sh so maintainers find the optional iteration driver"
);
must(
  claudeMd.includes("`scripts/cursor-agent-stream-format.py`"),
  "CLAUDE.md Main Files must list scripts/cursor-agent-stream-format.py alongside the loop script"
);
must(
  claudeMd.includes("`examples/`"),
  "CLAUDE.md Main Files must list examples/ (checked-in calibration resumes)"
);
const scoringStart = claudeMd.indexOf("### Scoring Model");
must(scoringStart !== -1, "CLAUDE.md missing ### Scoring Model section");
const rulesHeading = "\n### Rules";
const rulesStart = claudeMd.indexOf(rulesHeading, scoringStart);
must(
  rulesStart !== -1,
  "CLAUDE.md must keep ### Rules after ### Scoring Model so the scoring block stays machine-checkable"
);
const scoringSection = claudeMd.slice(scoringStart, rulesStart);
must(
  scoringSection.includes("score_ranges") &&
    scoringSection.includes("config/thresholds.yml"),
  "CLAUDE.md Scoring Model must tie PASS/REVIEW/FLAG to score_ranges in config/thresholds.yml (see modes/scan.md Step 4)"
);

const alwaysHeading = "\n**ALWAYS:**";
const alwaysStart = claudeMd.indexOf(alwaysHeading, rulesStart);
must(alwaysStart !== -1, "CLAUDE.md must keep **ALWAYS:** under ### Rules");
const alwaysEnd = claudeMd.indexOf("\n### ", alwaysStart + 1);
must(alwaysEnd !== -1, "CLAUDE.md must keep a ### heading after **ALWAYS:** rules");
const alwaysSection = claudeMd.slice(alwaysStart, alwaysEnd);
must(
  alwaysSection.includes("review <= score < pass") &&
    alwaysSection.includes("config/thresholds.yml"),
  "CLAUDE.md ALWAYS rules must tie human-review guidance to the REVIEW band in config/thresholds.yml (see modes/scan.md Step 4)"
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

const authStart = readme.indexOf("## Authenticity Score");
must(authStart !== -1, "README.md missing ## Authenticity Score section");
const exampleOutputStart = readme.indexOf("\n## Example Output", authStart);
must(
  exampleOutputStart !== -1,
  "README.md must keep ## Example Output after ## Authenticity Score"
);
const authSection = readme.slice(authStart, exampleOutputStart);
must(
  authSection.includes("`config/thresholds.yml`") &&
    authSection.includes("modes/scan.md") &&
    authSection.includes("Step 4"),
  "README.md Authenticity Score must tie PASS/REVIEW/FLAG to `config/thresholds.yml` and modes/scan.md Step 4"
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
