# Mode: batch -- Batch Application Screening

Screen an entire applicant pool at once.

## Input

- Path to a directory containing application files (PDF, MD, DOCX, TXT)
- Or a list of file paths

## Workflow

### Step 1 -- Discover Files

Scan the provided directory for application files. Group by candidate if naming convention allows (e.g., `lastname-resume.pdf`, `lastname-cover.pdf`).

### Step 2 -- Process Each Application

For each file/group, run the full `scan` mode. Use Agent subprocesses for parallelism when processing 3+ applications.

### Step 3 -- Aggregate Results

After all scans complete, build a summary table sorted by score (lowest first -- most suspicious on top):

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

Individual reports saved to `reports/`. Summary saved to `reports/batch-{date}.md`.
