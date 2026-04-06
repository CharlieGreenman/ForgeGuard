---
name: forge-guard
description: AI application screening -- detect AI-generated resumes, verify claims, surface authenticity signals
user_invocable: true
args: mode
---

# forge-guard -- Router

## Mode Routing

Determine the mode from `{{mode}}`:

| Input | Mode |
|-------|------|
| (empty / no args) | `discovery` -- Show command menu |
| Resume text or file path | **`scan`** |
| `scan` | `scan` |
| `batch` | `batch` |
| `verify` | `verify` |
| `compare` | `compare` |
| `interview` | `interview` |
| `report` | `report` |
| `calibrate` | `calibrate` |
| `dashboard` | `dashboard` |

**Auto-scan detection:** If `{{mode}}` is not a known sub-command AND contains resume-like text (keywords: "experience", "education", "skills", "responsibilities", job titles, company names, date ranges), execute `scan`.

---

## Discovery Mode (no arguments)

Show this menu:

```
forge-guard -- Application Screening

Available commands:
  /forge-guard {resume}     --> SCAN: full AI detection on a single application
  /forge-guard batch {dir}  --> Batch screen a folder of applications
  /forge-guard verify {resume} --> Cross-reference claims against public sources
  /forge-guard compare      --> Compare resume vs LinkedIn vs cover letter
  /forge-guard interview {resume} --> Generate verification interview questions
  /forge-guard report       --> Screening report for hiring committee
  /forge-guard calibrate    --> Calibrate thresholds with known samples
  /forge-guard dashboard    --> View screening stats

Or paste a resume directly to run a full scan.
```

---

## Context Loading by Mode

After determining the mode, load:

### All modes load:
- `modes/_signals.md` (signal taxonomy)
- `config/thresholds.yml` (`score_ranges` for PASS/REVIEW/FLAG and per-signal weights; shipped in-repo — customize via `calibrate`, then run `npm run verify`)

### Then load the mode file:
- `modes/{mode}.md`

### `report` mode
Also load `templates/report-template.md` so committee output stays aligned with per-candidate report shape, headings, and PASS / REVIEW / FLAG semantics (see `modes/report.md` Step 1).

### `calibrate` mode
Also load `examples/authentic-resume.md` and `examples/ai-generated-resume.md` when the user needs checked-in practice samples (synthetic personas, not real candidates; see `modes/calibrate.md` Input).

Execute the instructions from the loaded mode file.

---

## Guardrails

- Screening output is **probabilistic**. Do not present detection as proof of AI use or dishonesty.
- **Never** auto-reject a candidate from score alone. Low scores mean prioritize human review.
- **PASS / REVIEW / FLAG** follow `score_ranges` in `config/thresholds.yml` exactly as in `modes/scan.md` Step 4. Qualitative authenticity bands in `CLAUDE.md` are narrative context only; they do not override those cutoffs.
- Every flag needs **concrete evidence** (quotes, counts). Do not fabricate verification results; use WebSearch or provided sources only.
- **Data hygiene:** Do not commit candidate PII or hiring artifacts upstream — `data/screenings.md` and `reports/` are gitignored by design (see repo `.gitignore` and **`CLAUDE.md`**).
- Full workflow, scoring bands, and report placeholders: see **`CLAUDE.md`** in the repo root.

## Repo changes (maintainers)

From the repo root, run **`npm run verify`** before committing upstream changes to modes, `config/thresholds.yml`, templates, examples, or this skill. The script checks that signals, thresholds, docs, and templates stay aligned.
