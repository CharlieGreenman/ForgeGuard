# Mode: compare -- Cross-Source Consistency Analysis

Compares a candidate's resume against their LinkedIn profile, cover letter, and application answers to surface inconsistencies.

## Input

At least 2 of the following:
- Resume (text or file)
- LinkedIn URL or profile text
- Cover letter
- Application form answers

If the user supplies **fewer than two** usable sources (missing files, empty paste, or only one document type), stop with a short notice: list what was received, state that compare needs at least two sources to cross-check, and suggest providing a second source or running `scan` on a single resume instead. **Do not invent** a comparison matrix, discrepancies, or scores.

## Workflow

### Step 1 -- Extract Structured Data from Each Source

For each source, extract:
- Job titles and dates
- Company names
- Key achievements and metrics
- Skills mentioned
- Education details
- Tone and writing style

### Step 2 -- Cross-Reference

Build a comparison matrix:

| Field | Resume | LinkedIn | Cover Letter | Answers |
|-------|--------|----------|-------------|---------|
| Current title | Staff Eng | Senior Eng | Staff Eng | Staff Eng |
| Tenure at X | 3 years | 2.5 years | -- | 3 years |
| Key metric | "reduced latency 47%" | "improved performance" | "cut response time in half" | "47% latency reduction" |

### Step 3 -- Flag Inconsistencies

| Type | Severity | Example |
|------|----------|---------|
| Title inflation | High | Resume says "Staff", LinkedIn says "Senior" |
| Tenure discrepancy | High | 6+ month difference between sources |
| Metric inconsistency | Medium | Different numbers for the same achievement |
| Skill mismatch | Medium | Resume lists skill not mentioned anywhere else |
| Tone mismatch | Low | Resume is highly formal, answers are casual |
| Phrasing duplication | Medium | Exact same sentence in resume and cover letter (AI generated both) |

### Step 4 -- Output

Include **2–4 short verification prompts** that stress-test **High** and **Medium** severity discrepancies (and duplicated phrases when they look like copy-paste across sources). Keep questions conversational and open-ended so the candidate can explain benign causes (stale LinkedIn, rounding, internal titles). If the hiring team wants a longer, signal-aware list, point them to **`modes/interview.md`** on the same materials.

```
## Consistency Analysis: {Candidate}

Sources compared: {list}
Inconsistencies found: {N}
Duplicated phrases: {N}

### Discrepancies
| # | Field | Source A | Source B | Severity |
|---|-------|---------|---------|----------|

### Duplicated Phrases
- "{exact phrase}" appears in resume AND cover letter
- ...

### Suggested verification prompts
1. ...
2. ...
3. ...

(Fuller behavioral prompts tied to scan signals: run `modes/interview.md` on the resume.)

### Consistency Score: {X}/100
```

### Notes

- Treat discrepancies as hypotheses to explore, not proof of misrepresentation. LinkedIn often lags title changes; resumes may round dates or use internal job levels.
- The **Consistency Score** above summarizes how well sources agree in this pass. It is not the same field as the ForgeGuard authenticity score from `scan` unless you explicitly map or recompute it using the same signal model and `config/thresholds.yml` cutoffs.
- When you combine this analysis with a `scan` report or cite PASS / REVIEW / FLAG, read `pass` and `review` from `score_ranges` in `config/thresholds.yml` exactly as in `modes/scan.md` Step 4 — not the qualitative authenticity bands in `CLAUDE.md` alone. Shipped integer-score defaults match that step: **PASS** if `score >= pass` (default: 70+), **REVIEW** if `review <= score < pass` (default: 40–69), **FLAG** if `score < review` (default: 0–39). After calibration, restate tiers using the YAML values, not these defaults.
- Scores and pattern matches are probabilistic. Use them to decide what to ask in conversation, not to auto-reject (see `CLAUDE.md`).
- Use **`modes/interview.md`** when you want a dedicated pass that generates more interview questions from the application text and screening context, not only from this cross-source matrix.

## Maintainer note

From the repo root, run **`npm run verify`** after editing `config/thresholds.yml`, `modes/_signals.md`, or this mode file so cross-source signal labels, tier cutoffs, and docs stay aligned (see `scripts/verify.mjs`). PASS / REVIEW / FLAG semantics match `modes/scan.md` Step 4 and `modes/dashboard.md` / `modes/batch.md` aggregation rules.
