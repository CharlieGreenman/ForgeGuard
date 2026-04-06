# ForgeGuard

> AI application screening tool built on Claude Code. Detect AI-generated resumes, verify candidate claims, and surface authenticity signals -- before you waste an interview slot.

![Claude Code](https://img.shields.io/badge/Claude_Code-000?style=flat&logo=anthropic&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Made in USA](https://img.shields.io/badge/Made_in-USA_%F0%9F%87%BA%F0%9F%87%B8-red?style=flat)

<p align="center">
  <img src="demo/demo.gif" alt="ForgeGuard Demo" width="800">
</p>

<p align="center"><em>42-signal detection. Claim verification. Interview questions generated. In seconds.</em></p>

---

## The Problem

AI tools can now generate tailored resumes, craft perfect cover letters, and fill application forms in seconds. A single candidate can blast 100+ polished applications overnight. Hiring teams are drowning in high-quality-looking applications with no way to tell what's real.

**ForgeGuard is the other side of the coin.** It uses the same AI to detect what AI produced.

## What It Does

| Feature | Description |
|---------|-------------|
| **AI Writing Detection** | 42-signal heuristic model that catches AI-generated text patterns ATS tools miss |
| **Claim Verification** | Cross-references resume claims against LinkedIn, GitHub, publications, and company records |
| **Consistency Analysis** | Detects mismatches between resume, cover letter, LinkedIn, and application answers |
| **Batch Screening** | Process an entire applicant pool in parallel -- flag before humans review |
| **Interview Question Gen** | Generates verification questions that expose fabricated experience |
| **Authenticity Scoring** | 0-100 score with per-signal breakdown -- transparent, not a black box |

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/CharlieGreenman/ForgeGuard.git
cd ForgeGuard && npm install

# 2. Open Claude Code
claude

# 3. Screen an application
# Paste a resume, or point to a file:
/forge-guard scan resume.pdf

# 4. Batch screen
/forge-guard batch applications/
```

## Usage

```
/forge-guard                  --> Show all commands
/forge-guard scan {resume}    --> Full AI detection scan on a single application
/forge-guard batch {dir}      --> Batch screen a folder of applications
/forge-guard verify {resume}  --> Cross-reference claims against public sources
/forge-guard compare          --> Compare resume vs LinkedIn vs cover letter
/forge-guard interview {resume} --> Generate verification interview questions
/forge-guard report           --> Generate screening report for hiring committee
/forge-guard calibrate        --> Calibrate detection thresholds with known samples
/forge-guard dashboard        --> View screening stats across all candidates
```

## How It Works

```
Resume / Application drops in
         |
         v
+-------------------+
|  Signal Extraction |  42 heuristic signals across 6 categories
|  (AI patterns)     |
+--------+----------+
         |
+--------v----------+
|  Claim Verification|  LinkedIn, GitHub, publications, company records
|  (WebSearch)       |
+--------+----------+
         |
+--------v----------+
|  Consistency Check |  Resume vs Cover Letter vs LinkedIn vs Answers
|  (cross-reference) |
+--------+----------+
         |
    +----+----+
    v    v    v
  Score  Flag  Report
  0-100  Y/N   .md

         |
    +----+----+
    v    v    v
  Pass  Review  Flag
  70+   40-69   <40
```

PASS / REVIEW / FLAG use the `pass` and `review` values under `score_ranges` in `config/thresholds.yml` (see `modes/scan.md` Step 4). The diagram above shows the shipped defaults on the 0–100 authenticity scale.

The same YAML block includes a `flag` value (usually `0`) so tooling can assert `pass > review > flag`. That field is **not** the upper bound of the FLAG tier: FLAG means **score strictly below `review`**, as described in the header comments of `config/thresholds.yml`.

Recommendations follow the report template (PASS / REVIEW / FLAG). Low scores mean prioritize human review; do not auto-reject from a score alone.

## Detection Signal Categories

| Category | Signals | What It Catches |
|----------|---------|-----------------|
| **Lexical** | Banned word frequency, sentence uniformity, hedging patterns | "Leveraged", "spearheaded", "orchestrated" -- AI hallmark vocabulary |
| **Structural** | Bullet length variance, section symmetry, formatting consistency | AI makes every bullet the same length, every section equally detailed |
| **Temporal** | Career gap logic, date consistency, tenure patterns | Fabricated timelines that don't add up |
| **Metric** | Specificity of numbers, round number bias, metric plausibility | AI invents impressive-sounding but vague metrics |
| **Voice** | Perspective consistency, tense shifts, passive voice ratio | AI shifts voice mid-document in ways humans don't |
| **Cross-source** | LinkedIn match, GitHub activity, publication verification | Claims that don't exist anywhere else online |

## Authenticity Score

```
90-100  Highly authentic    -- Strong human signals, verified claims
70-89   Likely authentic    -- Minor flags, mostly consistent
40-69   Needs review        -- Multiple AI signals OR unverified claims
20-39   Likely AI-generated -- Strong AI patterns, inconsistencies
0-19    Almost certainly AI -- Overwhelming AI signals, fabricated claims
```

**PASS / REVIEW / FLAG** use only the numeric cutoffs in `config/thresholds.yml` (see [How It Works](#how-it-works) and `modes/scan.md` Step 4). The bands above are qualitative labels for reading the score; they are not separate rules for those recommendation tiers.

The score is transparent -- every point deduction comes with a specific signal and evidence.

## Example Output

Shape matches `templates/report-template.md` (saved reports omit HTML comments from that file). After changing that template, `modes/_signals.md`, `config/thresholds.yml`, or files under `examples/`, run **`npm run verify`** from the repo root so reports, signals, and thresholds stay aligned.

```
# Screening Report: [redacted] -- Senior AI Engineer

**Date:** {DATE}
**Authenticity Score:** 34/100
**Recommendation:** FLAG — PASS, REVIEW, or FLAG per `score_ranges` in `config/thresholds.yml` (see `modes/scan.md` Step 4).
**Signals triggered:** 6/42

---

## Signal Summary

| Category | Signals Triggered | Deduction |
|----------|-------------------|-----------|
| Lexical | 2/7 | -10 |
| Structural | 1/7 | -5 |
| Temporal | 0/7 | 0 |
| Metric | 1/7 | -5 |
| Voice | 1/7 | -5 |
| Cross-source | 2/7 | -15 |

## Flags (detailed)

### [LEXICAL] AI hallmark vocabulary
**Evidence:** "Leveraged" appears 3x, "orchestrated" 2x in a one-page resume.
**Deduction:** -5 points (use the enabled weight from `config/thresholds.yml` when this maps to a specific signal id)
**Confidence:** Medium

### [STRUCTURAL] Bullet length uniformity
**Evidence:** All bullets are 18–22 words — near-zero variance (human CVs often span a wider range).
**Deduction:** -5 points
**Confidence:** High

### [CROSS-SOURCE] Tenure mismatch
**Evidence:** LinkedIn shows 2 years at Company X; resume states 3.5 years in the same role.
**Deduction:** -8 points
**Confidence:** High

## Verified Claims

| Claim | Source | Status |
|-------|--------|--------|
| Education | University / registrar | Confirmed |
| Current employer | LinkedIn | Confirmed |
| Prior title at Acme | LinkedIn | Partial |
| Patent listed | USPTO / Google Patents | Not Found |

## Suggested Interview Questions

1. "Walk me through the latency reduction you cite — what was the baseline before your changes?"
2. "Tell me about the open-source framework you led — what's the repo name and your main commits?"
3. "Your patent on [topic] — what stage is it in, and where is it published?"
```

The **Recommendation** line uses the same **PASS / REVIEW / FLAG** cutoffs as the rest of the repo: read `score_ranges` in `config/thresholds.yml` (see [How It Works](#how-it-works)). The score and flags are heuristics for human review, not proof of AI-generated text or dishonesty.

## Project Structure

```
ForgeGuard/
├── CLAUDE.md                    # Agent instructions
├── LICENSE
├── package.json                 # npm scripts (`npm run verify`)
├── config/
│   └── thresholds.yml           # Detection thresholds (customizable)
├── demo/
│   └── demo.tape                # VHS source for README demo GIF
├── modes/
│   ├── _signals.md              # Signal taxonomy (42 signals)
│   ├── scan.md                  # Single application scan
│   ├── batch.md                 # Batch screening
│   ├── verify.md                # Claim verification
│   ├── compare.md               # Cross-source consistency
│   ├── interview.md             # Verification question generation
│   ├── report.md                # Screening report for hiring committee
│   ├── calibrate.md             # Threshold calibration
│   └── dashboard.md             # Screening stats
├── scripts/
│   ├── verify.mjs                   # Repo checks invoked by `npm run verify`
│   ├── cursor-agent-loop.sh         # Optional Cursor driver for batch iterations
│   └── cursor-agent-stream-format.py # JSON stream helper for verbose loop output (Python 3)
├── templates/
│   └── report-template.md       # Report output format
├── examples/
│   ├── authentic-resume.md      # Calibration sample: human-written resume
│   └── ai-generated-resume.md   # Calibration sample: AI-generated resume
├── data/                        # Screening results (gitignored)
├── reports/                     # Generated reports (gitignored)
└── .claude/
    └── skills/forge-guard/
        └── SKILL.md             # Claude Code skill router
```

## Development

From the repo root, run `npm run verify` before opening a pull request or committing upstream changes. The script checks that `config/thresholds.yml`, `modes/_signals.md`, mode files, the report template, examples, and docs stay aligned (no extra npm dependencies). For optional non-interactive passes that run verify and commit in a loop, use `scripts/cursor-agent-loop.sh` (see the script header for prerequisites, environment variables, and the companion `scripts/cursor-agent-stream-format.py` stream helper).

## Ethical Use

**ForgeGuard is a screening aid, not a judge.** It flags signals for human reviewers to investigate.

- **NEVER auto-reject based on score alone.** Some authentic candidates write well. Some use AI for grammar. The score surfaces what to investigate, not who to reject.
- **Always allow candidates to explain flags.** A LinkedIn mismatch might be an outdated profile, not a lie.
- **Bias awareness.** Non-native English speakers may trigger lexical signals differently. Calibrate thresholds for your candidate pool.
- **Transparency.** If you use ForgeGuard, consider disclosing that applications are screened for AI-generated content.

## Credits

Built by [Charlie Greenman](https://github.com/CharlieGreenman)

## License

MIT
