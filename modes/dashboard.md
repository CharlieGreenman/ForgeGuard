# Mode: dashboard -- Screening Statistics

Displays aggregate screening statistics across all processed candidates.

## Workflow

### Step 1 -- Read Data

Parse `data/screenings.md` for all screening results.

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
