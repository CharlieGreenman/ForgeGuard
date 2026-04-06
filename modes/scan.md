# Mode: scan -- Single Application Screening

Full AI detection scan on a single resume, cover letter, or application.

## Input

The user provides one or more of:
- Pasted resume text
- File path to a PDF/MD/DOCX resume
- URL to an online application or profile
- Pasted cover letter
- Application form answers

## Workflow

### Step 1 -- Extract Content

If the input is a file, read it. If it's a URL, use WebFetch or Playwright to extract content. If it's pasted text, use it directly.

Identify what was provided:
- Resume only
- Resume + cover letter
- Resume + application answers
- Full package (resume + cover letter + answers)

### Step 2 -- Run Signal Extraction

Load `modes/_signals.md`. Run all 42 signals across the 6 categories against the provided content.

For each signal:
1. Check if the signal triggers
2. Record the specific evidence (exact quotes, counts, patterns)
3. Apply the weight deduction
4. Assign confidence: High (clear evidence), Medium (probable), Low (ambiguous)

**Only trigger a signal if you have concrete evidence.** Do not guess.

### Step 3 -- Compute Authenticity Score

```
score = 100 - sum(triggered_weights)
score = max(0, score)
```

### Step 4 -- Determine Recommendation

Read `score_ranges` from `config/thresholds.yml` (`pass`, `review`, `flag`). Those values are **minimum scores** on the 0–100 authenticity scale:

- **PASS** if `score >= pass` (default: 70+)
- **REVIEW** if `review <= score < pass` (default: 40–69)
- **FLAG** if `score < review` (default: 0–39)

You may describe the numeric score using the authenticity bands in `CLAUDE.md` (e.g. 90–100 highly authentic, 20–39 likely AI-generated) as narrative context — but **PASS / REVIEW / FLAG** must always follow the YAML cutoffs so calibration changes stay consistent.

Scores are probabilistic. Never auto-reject from score alone.

### Step 5 -- Generate Interview Questions

For each triggered signal with Medium or High confidence, generate a verification question:

- **Metric flags** -> "Walk me through the baseline and methodology for [specific metric]"
- **Experience flags** -> "Describe your day-to-day in [role] -- who did you report to?"
- **Claim flags** -> "Tell me about [specific project/publication] -- what was your exact contribution?"
- **Timeline flags** -> "Help me understand the transition from [Company A] to [Company B]"

Generate 3-5 questions, ordered by flag severity.

### Step 6 -- Output Report

Display a concise summary inline for the user. **Always save** a full report to `reports/{###}-{candidate-slug}-{YYYY-MM-DD}.md` using `templates/report-template.md` (same heading levels, section order, and placeholders: `{CANDIDATE}`, `{ROLE}`, `{DATE}`, `{SCORE}`, `{RECOMMENDATION}`, `{TRIGGERED}`, `{TOTAL}`, per-category counts and deductions, `{FLAGS}`, `{CLEAN_SIGNALS}`, `{CLAIMS}`, `{QUESTIONS}`, `{NOTES}`). Strip HTML comments from the template when writing the file.

For inline display only, a shorter block is fine:

```
## ForgeGuard Screening: {Candidate or "Anonymous"} -- {Role}

**Authenticity Score:** {X}/100
**Recommendation:** {PASS / REVIEW / FLAG}
**Signals triggered:** {N}/42

### Flags
- [{CATEGORY}] {Signal name}: {evidence} (-{weight} pts)
- ...

### Clean Signals (notable)
- {Signals that specifically indicate authenticity}

### Suggested Interview Questions
1. ...
2. ...

### Notes
{Any caveats about limited data, non-native English considerations, etc.}
```

### Step 7 -- Log to Tracker

Append one row per screened candidate to `data/screenings.md`. Use this column layout so `modes/dashboard.md` can parse aggregates (`modes/dashboard.md` Step 1):

```
| # | Date | Candidate | Role | Score | Recommendation | Report |
|---|------|-----------|------|-------|----------------|--------|
| 1 | 2026-04-06 | candidate-slug | Staff Engineer | 72 | PASS | reports/001-candidate-slug-2026-04-06.md |
```

Use the next sequence number in `#`, the report filename from Step 6, and PASS / REVIEW / FLAG from Step 4 (driven by `score_ranges` in `config/thresholds.yml`).

## Maintainer note

From the repo root, run **`npm run verify`** after editing `config/thresholds.yml` or `modes/_signals.md` so signal definitions, tier cutoffs, and docs stay aligned (see `scripts/verify.mjs`). Same check as `modes/calibrate.md` and `modes/dashboard.md` after configuration changes.
