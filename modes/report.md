# Mode: report -- Screening Report for Hiring Committee

Generates a polished, shareable screening report suitable for sending to a hiring manager or hiring committee.

## Input

- One or more completed screening reports from `scan` mode
- Or specify candidates to include

## Workflow

### Step 1 -- Gather Data

Read completed reports from `reports/` and `data/screenings.md`.

### Step 2 -- Generate Committee Report

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
| Proceed to interview | {N} | Score 70+, claims verified |
| Needs investigation | {N} | Score 40-69, specific flags noted |
| Do not proceed | {N} | Score <40, strong AI signals |

## Proceed to Interview

| # | Candidate | Score | Strengths | Notes |
|---|-----------|-------|-----------|-------|

## Needs Investigation

| # | Candidate | Score | Key Flags | Suggested Action |
|---|-----------|-------|-----------|------------------|

## Do Not Proceed

| # | Candidate | Score | Primary Flags | Detail |
|---|-----------|-------|---------------|--------|

---

## Methodology

Applications were screened using ForgeGuard's 42-signal detection model across 6 categories: lexical analysis, structural patterns, temporal consistency, metric plausibility, voice analysis, and cross-source verification.

Scores are probabilistic, not definitive. "Do not proceed" candidates showed strong AI-generation signals but should be reviewed by a human before final rejection.

## Appendix

Individual screening reports are available in the `reports/` directory.
```

### Step 3 -- Save

Save to `reports/committee-{role-slug}-{date}.md`.
