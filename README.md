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

The score is transparent -- every point deduction comes with a specific signal and evidence.

## Example Output

```
## ForgeGuard Screening Report

Candidate: [redacted]
Role: Senior AI Engineer
Authenticity Score: 34/100

### Flags
- [LEXICAL] 8/12 bullets start with past-tense action verb (p=0.02)
- [LEXICAL] "Leveraged" appears 3x, "orchestrated" 2x -- AI hallmark words
- [STRUCTURAL] All bullets are 18-22 words -- zero variance (human CVs: 8-35 word range)
- [METRIC] "Reduced latency by 47%" -- no context, no baseline, round-ish number
- [CROSS-SOURCE] LinkedIn shows 2 years at Company X, resume says 3.5 years
- [CROSS-SOURCE] GitHub has 12 commits total, resume claims "led open-source framework"
- [VOICE] Cover letter and resume have identical phrasing in 3 places -- copy-paste or same AI prompt

### Verified Claims
- Education: Confirmed (university records match)
- Current employer: Confirmed (LinkedIn)
- Patent listed: NOT FOUND in USPTO or Google Patents

### Recommendation: MANUAL REVIEW REQUIRED
### Suggested Interview Questions:
1. "Walk me through the latency reduction project -- what was the baseline before your changes?"
2. "Tell me about the open-source framework you led -- what's the repo name?"
3. "Your patent on [topic] -- what stage is it in?"
```

## Project Structure

```
ForgeGuard/
├── CLAUDE.md                    # Agent instructions
├── config/
│   └── thresholds.yml           # Detection thresholds (customizable)
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
├── templates/
│   └── report-template.md       # Report output format
├── examples/
│   ├── authentic-resume.md      # Example: human-written resume
│   └── ai-generated-resume.md   # Example: AI-generated resume
├── data/                        # Screening results (gitignored)
├── reports/                     # Generated reports (gitignored)
└── .claude/
    └── skills/forge-guard/
        └── SKILL.md             # Claude Code skill router
```

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
