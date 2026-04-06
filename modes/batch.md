# Mode: batch -- Batch Application Screening

Screen an entire applicant pool at once.

## Input

- Path to a directory containing application files (PDF, MD, DOCX, TXT)
- Or a list of file paths

## Workflow

### Step 1 -- Discover Files

Scan the provided directory for application files. Group by candidate if naming convention allows (e.g., `lastname-resume.pdf`, `lastname-cover.pdf`).

- If the path is **missing**, not a directory, **empty**, or contains **no supported application files** (PDF, MD, DOCX, TXT), stop with a short notice: explain that batch needs at least one readable application file, list what was searched, and suggest checking the path or file extensions. **Do not invent** a summary table, scores, or PASS / REVIEW / FLAG counts.

### Step 2 -- Process Each Application

For each file/group, run the full `scan` mode. Use Agent subprocesses for parallelism when processing 3+ applications.

### Step 3 -- Aggregate Results

After all scans complete, build a summary table sorted by score (lowest first -- most suspicious on top).

PASS / REVIEW / FLAG counts use the same rules as `modes/scan.md` Step 4: read `pass` and `review` from `score_ranges` in `config/thresholds.yml` (not the qualitative authenticity bands in `CLAUDE.md`). Shipped integer-score defaults match that step: **PASS** if `score >= pass` (default: 70+), **REVIEW** if `review <= score < pass` (default: 40–69), **FLAG** if `score < review` (default: 0–39). After calibration, describe bands using the YAML values in the summary notes instead of these defaults.

The table below is for the batch markdown artifact (`reports/batch-{date}.md` in Step 4). Rows in `data/screenings.md` follow **`modes/scan.md` Step 7** instead: include **Date**, omit **Top Flag**, and match the report path from each scan. Each run in Step 2 should still perform scan Step 7 so the dashboard can read the tracker.

```
## Batch Screening Summary -- {date}

Processed: {N} applications
(Use `score_ranges` from `config/thresholds.yml` for the next three lines: pass = minimum score for PASS, review = minimum for REVIEW.)
Passed: {N} (score ≥ pass)
Review: {N} (review ≤ score < pass)
Flagged: {N} (score < review)

| # | Candidate | Role | Score | Recommendation | Top Flag | Report |
|---|-----------|------|-------|----------------|----------|--------|
| 1 | ... | ... | 23 | FLAG | 8 AI hallmark words | [link] |
| 2 | ... | ... | 45 | REVIEW | LinkedIn tenure mismatch | [link] |
| ... | ... | ... | ... | ... | ... | ... |

### Distribution

Fixed score buckets below match the authenticity bands in `CLAUDE.md` (pool-level texture). They do **not** re-derive from `score_ranges`; the Passed / Review / Flagged counts above always follow `config/thresholds.yml` only.

- 0-19 (Almost certainly AI): N candidates
- 20-39 (Likely AI): N candidates
- 40-69 (Needs review): N candidates
- 70-89 (Likely authentic): N candidates
- 90-100 (Highly authentic): N candidates

### Common Patterns
- Most triggered signal: {signal} ({N} candidates)
- ...
```

### Step 4 -- Save Reports

Individual per-candidate reports go to `reports/` with the same structure as a standalone scan: use `templates/report-template.md` per **`modes/scan.md` Step 6** (strip template HTML comments; tracker rows per Step 7). Batch summary artifact: `reports/batch-{date}.md` from Step 3.

## Maintainer note

From the repo root, run **`npm run verify`** after editing `config/thresholds.yml`, `modes/_signals.md`, or this mode file so tier cutoffs, signal taxonomy, and docs stay aligned (see `scripts/verify.mjs`). Same pattern as `modes/scan.md`, `modes/calibrate.md`, and `modes/dashboard.md`.
