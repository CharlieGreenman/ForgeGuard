# Mode: calibrate -- Threshold Calibration

Calibrate detection thresholds using known samples to optimize for your specific candidate pool and role type.

## Why Calibrate

Default thresholds are tuned for mid-to-senior tech roles with English-language applications. You should recalibrate if:
- Your candidate pool is predominantly non-native English speakers
- You're hiring for non-tech roles (different writing norms)
- You're seeing too many false positives or false negatives
- Your role attracts a specific writing style (academic, creative, etc.)

## Guardrails

- Recalibration changes how often signals fire and where scores fall relative to PASS / REVIEW / FLAG; it does **not** make outputs proof of AI use or dishonesty. Treat scores as probabilistic heuristics (see `CLAUDE.md`).
- **Never** auto-reject from a score alone. Use tiers from `score_ranges` in `config/thresholds.yml` exactly as in `modes/scan.md` Step 4 to decide what needs human follow-up, not a final hire / no-hire outcome.

## Input

The user provides labeled samples:
- Known human-written resumes (marked as authentic)
- Known AI-generated resumes (or have the user generate some with a general-purpose LLM)

Minimum: 3 authentic + 3 AI-generated. Recommended: 10+ of each.

**No private samples yet:** Use the checked-in references `examples/authentic-resume.md` and `examples/ai-generated-resume.md` (synthetic personas, not real candidates) to practice the workflow or sanity-check signal behavior. Swap in your own labeled pool before tuning thresholds for a live role.

## Workflow

### Step 1 -- Collect Samples

Ask the user for:
1. Authentic resumes from past hires (who they know wrote their own)
2. AI-generated resumes (e.g. paste a job description into an LLM and generate a resume), or use `examples/ai-generated-resume.md` alongside `examples/authentic-resume.md` for a first pass

### Step 2 -- Score All Samples

Run `scan` mode on each sample. Record per-signal results.

### Step 3 -- Analyze Signal Performance

For each signal, compute:
- **True positive rate**: % of AI-generated samples that triggered this signal
- **False positive rate**: % of authentic samples that triggered this signal
- **Discriminative power**: TPR - FPR

### Step 4 -- Adjust Thresholds

```
## Calibration Results

| Signal | TPR | FPR | Power | Current Weight | Suggested Weight |
|--------|-----|-----|-------|----------------|------------------|
| L1 AI hallmark vocab | 90% | 5% | 85% | -5 | -5 (keep) |
| S1 Bullet uniformity | 80% | 30% | 50% | -5 | -3 (reduce) |
| V5 Overly polished | 60% | 50% | 10% | -1 | 0 (disable) |
| ... | ... | ... | ... | ... | ... |

### Recommended Changes
- Reduce S1 weight: too many false positives on polished authentic resumes
- Disable V5: not discriminative for this candidate pool
- Increase L1 weight: highly reliable signal
```

### Step 5 -- Save Configuration

Write adjusted thresholds to `config/thresholds.yml`.

**Keep the full file shape:** `score_ranges` (PASS / REVIEW / FLAG cutoffs) must stay present; omitting it breaks repo checks and diverges from `modes/scan.md` and `templates/report-template.md`. Only change `pass` and `review` if you intentionally want different tier boundaries (defaults: PASS 70+, REVIEW 40–69, FLAG is every score strictly below `review`, e.g. 0–39 when `review` is 40).

**How `score_ranges` maps to tiers** (same semantics as `modes/scan.md` Step 4 and the header comment in `config/thresholds.yml`):

- **`pass`** — minimum score for PASS: `score >= pass`.
- **`review`** — minimum score for REVIEW: `review <= score < pass`. Every score **strictly below** `review` is FLAG.
- **`flag`** — structural floor so validators can assert `pass > review > flag`. It is **not** an upper bound for the FLAG band; FLAG is always `score < review`.

```yaml
# Calibrated {YYYY-MM-DD}
# Samples: {N} authentic, {N} AI-generated
# Role type: {role}

score_ranges:
  pass: 70          # minimum score for PASS
  review: 40        # minimum score for REVIEW; FLAG = score < review
  flag: 0           # ordering floor only (see Step 5 bullets above)

signals:
  L1: { weight: -5, enabled: true, name: "AI hallmark vocabulary" }
  L2: { weight: -3, enabled: true, name: "Passionate about pattern" }
  # ... all L1–L7, S1–S7, T1–T7, M1–M7, V1–V7, X1–X7 (42 entries)
  V5: { weight: 0, enabled: false, name: "Overly polished" }
```

When editing, merge your weight/`enabled` changes into the existing file rather than replacing it with a partial snippet.

From the repo root, run **`npm run verify`** so the edited YAML still has 42 signals, valid `score_ranges`, and aligned docs (see `scripts/verify.mjs`).
