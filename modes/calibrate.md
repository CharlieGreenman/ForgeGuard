# Mode: calibrate -- Threshold Calibration

Calibrate detection thresholds using known samples to optimize for your specific candidate pool and role type.

## Why Calibrate

Default thresholds are tuned for mid-to-senior tech roles with English-language applications. You should recalibrate if:
- Your candidate pool is predominantly non-native English speakers
- You're hiring for non-tech roles (different writing norms)
- You're seeing too many false positives or false negatives
- Your role attracts a specific writing style (academic, creative, etc.)

## Input

The user provides labeled samples:
- Known human-written resumes (marked as authentic)
- Known AI-generated resumes (or have the user generate some with ChatGPT/Claude)

Minimum: 3 authentic + 3 AI-generated. Recommended: 10+ of each.

## Workflow

### Step 1 -- Collect Samples

Ask the user for:
1. Authentic resumes from past hires (who they know wrote their own)
2. AI-generated resumes (user can paste a job description into ChatGPT and get one)

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

**Keep the full file shape:** `score_ranges` (PASS / REVIEW / FLAG cutoffs) must stay present; omitting it breaks repo checks and diverges from `modes/scan.md` and `templates/report-template.md`. Only change cutoffs if you intentionally want different tier boundaries (defaults: PASS 70+, REVIEW 40–69, FLAG 0–39).

```yaml
# Calibrated {YYYY-MM-DD}
# Samples: {N} authentic, {N} AI-generated
# Role type: {role}

score_ranges:
  pass: 70          # minimum score for PASS
  review: 40        # minimum score for REVIEW (below pass)
  flag: 0           # scores below review tier map to FLAG

signals:
  L1: { weight: -5, enabled: true, name: "AI hallmark vocabulary" }
  L2: { weight: -3, enabled: true, name: "Passionate about pattern" }
  # ... all L1–L7, S1–S7, T1–T7, M1–M7, V1–V7, X1–X7 (42 entries)
  V5: { weight: 0, enabled: false, name: "Overly polished" }
```

When editing, merge your weight/`enabled` changes into the existing file rather than replacing it with a partial snippet.
