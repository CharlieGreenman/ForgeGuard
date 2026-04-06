# Mode: dashboard -- Screening Statistics

Displays aggregate screening statistics across all processed candidates.

## Workflow

### Step 1 -- Read Data

Parse `data/screenings.md` for all screening results.

- If the file is **missing**, unreadable, or has **no completed rows** (header only, blank file, or no parseable scores), output a short notice instead of the dashboard template: explain that aggregates need entries from `modes/scan.md` Step 7 and/or batch summaries, and suggest running `scan` or `batch` first. **Do not invent** counts, averages, or flag frequencies.
- Otherwise, use the same tracker columns as `modes/scan.md` Step 7 (`#`, Date, Candidate, Role, Score, Recommendation, Report) to drive Steps 2–4.

### Step 2 -- Display Dashboard

Read `score_ranges` from `config/thresholds.yml` (`pass`, `review`). Count PASS / REVIEW / FLAG the same way as `modes/scan.md` Step 4 and `modes/batch.md` Step 3 (defaults when using shipped YAML: pass ≥ 70, review band 40–69, flag < 40). The “Score Distribution” histogram uses fixed buckets aligned with `CLAUDE.md` authenticity bands; it describes pool shape only and does not change when you recalibrate `score_ranges`.

```
## ForgeGuard Dashboard -- {date}

### Overview
- Total screened: {N}
- Passed: {N} ({%}) — score ≥ `pass`
- Review: {N} ({%}) — `review` ≤ score < `pass`
- Flagged: {N} ({%}) — score < `review`
- Average score: {X}/100

### Score Distribution
90-100 ████████████ {N}
70-89  ████████████████ {N}
40-69  ██████████ {N}
20-39  ████ {N}
0-19   ██ {N}

### Most Common Flags
1. {Signal}: triggered in {N}/{total} applications ({%})
2. {Signal}: triggered in {N}/{total} applications ({%})
3. {Signal}: triggered in {N}/{total} applications ({%})
4. {Signal}: triggered in {N}/{total} applications ({%})
5. {Signal}: triggered in {N}/{total} applications ({%})

### By Role
| Role | Screened | Avg Score | Flag Rate |
|------|----------|-----------|-----------|

### Trend (if enough data)
- This week: {N} screened, avg {X}/100
- Last week: {N} screened, avg {X}/100
- Flag rate trending: up/down/stable
```

## Maintainer note

Dashboard PASS / REVIEW / FLAG counts use the same `score_ranges` semantics as `modes/scan.md` Step 4. After editing `config/thresholds.yml`, run **`npm run verify`** from the repo root so signal definitions, tier cutoffs, and docs stay aligned (see `scripts/verify.mjs`).
