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
  /forge-guard verify       --> Cross-reference claims against public sources
  /forge-guard compare      --> Compare resume vs LinkedIn vs cover letter
  /forge-guard interview    --> Generate verification interview questions
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
- `config/thresholds.yml` (if exists, for custom thresholds)

### Then load the mode file:
- `modes/{mode}.md`

Execute the instructions from the loaded mode file.
