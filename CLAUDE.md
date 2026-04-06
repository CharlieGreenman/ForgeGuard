# ForgeGuard -- AI Application Screening Pipeline

## What is ForgeGuard

AI-powered application screening built on Claude Code. Detects AI-generated resumes, verifies candidate claims, and surfaces authenticity signals for hiring teams.

### Main Files

| File | Function |
|------|----------|
| `data/screenings.md` | Screening tracker |
| `config/thresholds.yml` | Detection thresholds |
| `modes/_signals.md` | Signal taxonomy (42 signals) |
| `templates/report-template.md` | Report output format |
| `reports/` | Generated screening reports |

### Skill Modes

| If the user... | Mode |
|----------------|------|
| Pastes a resume or points to a file | `scan` |
| Wants to screen a folder of applications | `batch` |
| Wants to verify claims against public sources | `verify` |
| Wants to compare resume vs LinkedIn vs cover letter | `compare` |
| Wants interview questions to test claims | `interview` |
| Wants a screening report for the hiring committee | `report` |
| Wants to calibrate thresholds | `calibrate` |
| Wants to see screening stats | `dashboard` |

### Screening Workflow

1. **Extract signals** -- Run 42 heuristic checks across 6 categories (lexical, structural, temporal, metric, voice, cross-source)
2. **Verify claims** -- WebSearch to cross-reference employer, education, publications, patents, GitHub activity
3. **Check consistency** -- Compare resume against LinkedIn, cover letter, and application answers
4. **Score** -- Compute authenticity score 0-100 with per-signal breakdown
5. **Generate report** -- Markdown report with flags, verified claims, and suggested interview questions
6. **Track** -- Log result in `data/screenings.md`

### Scoring Model

The authenticity score is computed from 42 signals across 6 categories. Each signal has a weight and a threshold. The score starts at 100 and deductions are applied for each triggered signal.

**Score ranges:**
- 90-100: Highly authentic
- 70-89: Likely authentic
- 40-69: Needs review
- 20-39: Likely AI-generated
- 0-19: Almost certainly AI

**Recommendation tiers (PASS / REVIEW / FLAG):** These follow `score_ranges` in `config/thresholds.yml` only (see `modes/scan.md` Step 4). The bands above are qualitative labels for interpreting the numeric score; they do not define the three recommendation tiers.

**Every deduction must cite the specific signal and evidence.** No black-box scoring.

### Rules

**NEVER:**
1. Auto-reject a candidate based on score alone
2. Present AI detection as certainty -- it's probabilistic
3. Ignore cultural/linguistic factors in lexical analysis
4. Fabricate evidence or claims about a candidate
5. Store or share candidate PII beyond what's in the application

**ALWAYS:**
1. Read the full application before scoring
2. Show per-signal evidence for every flag
3. Generate suggested interview questions for flagged areas
4. Note when a signal has low confidence
5. Recommend human review for scores between 40-69

### Report Format

Reports are saved to `reports/{###}-{candidate-slug}-{YYYY-MM-DD}.md`.

Per-candidate reports must follow `templates/report-template.md`. Placeholders below mirror that file.

```markdown
# Screening Report: {CANDIDATE} -- {ROLE}

**Date:** {DATE}
**Authenticity Score:** {SCORE}/100
**Recommendation:** {RECOMMENDATION} — PASS, REVIEW, or FLAG per `score_ranges` in `config/thresholds.yml` (see `modes/scan.md` Step 4).
**Signals triggered:** {TRIGGERED}/{TOTAL}

---

## Signal Summary

| Category | Signals Triggered | Deduction |
|----------|-------------------|-----------|
| Lexical | {N}/7 | -{X} |
| Structural | {N}/7 | -{X} |
| Temporal | {N}/7 | -{X} |
| Metric | {N}/7 | -{X} |
| Voice | {N}/7 | -{X} |
| Cross-source | {N}/7 | -{X} |

## Flags (detailed)

### [CATEGORY] Signal Name
**Evidence:** ...
**Deduction:** -X points
**Confidence:** High/Medium/Low

## Clean Signals (positive indicators)

Briefly list signals evaluated but not triggered, or human-authenticity cues, when helpful for reviewers.

## Verified Claims

| Claim | Source | Status |
|-------|--------|--------|
| ... | ... | Confirmed/Not Found/Mismatch |

## Suggested Interview Questions

1. ...
2. ...
3. ...

## Notes

Calibration limits, missing cross-source data, language context, or other caveats.
```

### Stack

- Claude Code (skill modes), Node.js (utilities), Markdown (data/reports)
- Configuration in YAML
- Reports in `reports/` (gitignored)
- Screening data in `data/` (gitignored)
- Quality gate: from the repo root run `npm run verify` (see `scripts/verify.mjs`) before committing upstream changes

### Git Commits

- **Never** add `Co-Authored-By` lines (or similar) attributing automated assistants.
- For upstream commits, set author explicitly: `Charlie Greenman <CharlieGreenman@users.noreply.github.com>` — for example `git commit --author="Charlie Greenman <CharlieGreenman@users.noreply.github.com>" -m "type: short description"`.
