# Mode: report -- Screening Report for Hiring Committee

Generates a polished, shareable screening report suitable for sending to a hiring manager or hiring committee.

## Input

- One or more completed screening reports from `scan` mode
- Or specify candidates to include

## Workflow

### Step 1 -- Gather Data

Read completed reports from `reports/` and `data/screenings.md`. Files produced by `scan` or `batch` should match `templates/report-template.md` (headings, section order, PASS/REVIEW/FLAG semantics from `config/thresholds.yml`); use that shape when parsing scores and flags into this summary.

### Step 2 -- Generate Committee Report

Read `score_ranges` from `config/thresholds.yml` (PASS / REVIEW / FLAG semantics: see `modes/scan.md` Step 4). The FLAG tier is every candidate with `score < review` (default: 0–39 when `review` is 40). If thresholds were calibrated, describe bands using those values in the Summary or Notes, not hardcoded numbers.

```markdown
# Application Screening Report

**Date:** {YYYY-MM-DD}
**Role:** {role}
**Screened by:** ForgeGuard v1.0
**Total applications:** {N}

---

## Summary

| Tier | Count | Action |
|------|-------|--------|
| Proceed to interview | {N} | Score ≥ `pass` from `config/thresholds.yml`, claims verified where checked |
| Needs investigation | {N} | Score in REVIEW band (`review` ≤ score < `pass`), specific flags noted |
| Deep human review | {N} | Score below `review` threshold, strong AI signals -- no auto-reject; decide after review |

## Proceed to Interview

| # | Candidate | Score | Strengths | Notes |
|---|-----------|-------|-----------|-------|

## Needs Investigation

| # | Candidate | Score | Key Flags | Suggested Action |
|---|-----------|-------|-----------|------------------|

## Deep Human Review (FLAG)

| # | Candidate | Score | Primary Flags | Detail |
|---|-----------|-------|---------------|--------|

---

## Methodology

Applications were screened using ForgeGuard's 42-signal detection model across 6 categories: lexical analysis, structural patterns, temporal consistency, metric plausibility, voice analysis, and cross-source verification.

Scores are probabilistic, not definitive. The lowest tier lists strong AI-generation signals; hiring decisions always require human judgment -- never reject from a score alone.

## Appendix

Individual screening reports are available in the `reports/` directory.
```

### Step 3 -- Save

Save to `reports/committee-{role-slug}-{date}.md`.

### Maintainers

After editing this file, `templates/report-template.md`, `config/thresholds.yml`, or `modes/_signals.md`, run `npm run verify` from the repo root so committee-report instructions stay aligned with thresholds and the per-candidate template.
