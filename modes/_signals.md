# ForgeGuard Signal Taxonomy — 42 Detection Signals

All signals are grouped into 6 categories. Each signal has a weight (max deduction) and a confidence level. The authenticity score starts at 100 and deductions are applied when signals trigger.

**Language and drafting context:** Fluent writers, non-native English speakers, and candidates who use grammar checkers, translation aids, or résumé templates may trigger individual lexical or voice signals without an AI-drafted application. Prefer lower confidence and explicit Notes when a pattern could plausibly reflect human style or tooling; combine lexical or voice findings with structural, temporal, metric, or cross-source signals before treating them as strong AI-generation indicators.

---

## Category 1: Lexical (7 signals, max -25 points)

| # | Signal | Weight | Trigger |
|---|--------|--------|---------|
| L1 | AI hallmark vocabulary | -5 | 2+ uses of: "leveraged", "utilized", "spearheaded", "orchestrated" (as metaphor), "cutting-edge", "synergy", "holistic", "drive innovation", "foster collaboration", "navigate complex" |
| L2 | "Passionate about" pattern | -3 | Any use of "passionate about", "I'm passionate", "deeply passionate" |
| L3 | Hedging language | -2 | Excessive use of "various", "multiple", "numerous", "several" without specifics |
| L4 | Uniform sentence openers | -4 | 60%+ of bullets start with the same word class (past-tense action verb) |
| L5 | Filler phrase density | -3 | High density of "in order to", "with a focus on", "aimed at", "committed to" |
| L6 | Superlative clustering | -3 | 3+ superlatives in close proximity: "best-in-class", "world-class", "industry-leading" |
| L7 | Corporate buzzword ratio | -5 | Buzzword-to-concrete-noun ratio above 0.4: "stakeholder alignment", "cross-functional synergy", "strategic initiatives" |

### How to check
Read the full text. Count occurrences of each pattern. Human CVs use 0-1 of these words. AI-generated CVs use 3-8.

---

## Category 2: Structural (7 signals, max -20 points)

| # | Signal | Weight | Trigger |
|---|--------|--------|---------|
| S1 | Bullet length uniformity | -5 | Standard deviation of bullet word count < 3 (human range: 5-15 SD) |
| S2 | Section symmetry | -3 | All experience entries have identical number of bullets (e.g., exactly 4 per role) |
| S3 | Perfect formatting | -2 | Zero formatting inconsistencies (humans always have minor asymmetries) |
| S4 | Identical structure across roles | -3 | Every role follows the exact same template: context sentence + 4 bullets + result |
| S5 | Summary length vs body ratio | -2 | Summary is 20%+ of total content (AI over-invests in summary) |
| S6 | Skills section inflation | -3 | 30+ skills listed with no evidence in experience section |
| S7 | Cover letter mirrors resume | -2 | 3+ identical phrases between cover letter and resume (same AI prompt) |

### How to check
Parse the document structure. Measure bullet lengths, count bullets per section, check for templated patterns.

---

## Category 3: Temporal (7 signals, max -15 points)

| # | Signal | Weight | Trigger |
|---|--------|--------|---------|
| T1 | Career gap inconsistency | -3 | Gaps present in resume but not on LinkedIn, or vice versa |
| T2 | Tenure rounding | -2 | All tenures rounded to full years (humans say "2 years 3 months") |
| T3 | Date format inconsistency | -2 | Mixed date formats within the same document (Jan 2024 vs 2024-01) |
| T4 | Impossible overlap | -3 | Two full-time roles overlapping in time |
| T5 | Recency bias | -2 | Recent role has 3x more detail than older roles of similar tenure |
| T6 | Graduation vs experience mismatch | -2 | Timeline doesn't add up (graduated 2020, claims 8 years experience) |
| T7 | Suspiciously current | -1 | End date is "Present" but LinkedIn shows they left months ago |

### How to check
Extract all dates. Build a timeline. Cross-reference with LinkedIn dates if available.

---

## Category 4: Metric (7 signals, max -15 points)

| # | Signal | Weight | Trigger |
|---|--------|--------|---------|
| M1 | Vague metrics | -3 | "Improved performance by X%" with no baseline, no context, no timeframe |
| M2 | Round number bias | -2 | All metrics are round numbers: 50%, 3x, 100K (humans report 47%, 2.8x, 94K) |
| M3 | Metric inflation | -2 | Metrics that are implausible for the role/level (IC claims "saved $50M") |
| M4 | Metric without ownership | -2 | "Revenue grew 200%" without explaining the candidate's specific contribution |
| M5 | Copy-paste metrics | -2 | Same metric structure repeated: "Reduced X by Y%, saving Z" |
| M6 | Missing metrics entirely | -2 | Senior role with zero quantified results (AI sometimes goes all qualitative) |
| M7 | Metric mismatch across sources | -2 | Resume says "10x improvement", LinkedIn says "significant improvement" |

### How to check
Extract all numbers and percentages. Check for patterns, plausibility, and consistency.

---

## Category 5: Voice (7 signals, max -10 points)

| # | Signal | Weight | Trigger |
|---|--------|--------|---------|
| V1 | Perspective shifts | -2 | Switches between first person and third person within the document |
| V2 | Tense inconsistency | -1 | Current role uses past tense, or past role uses present tense |
| V3 | Passive voice overuse | -2 | 40%+ of sentences use passive voice ("was implemented" vs "I built") |
| V4 | Uniform tone | -2 | Zero tonal variation -- every section reads the same (humans have natural voice shifts) |
| V5 | Overly polished | -1 | Zero colloquialisms, contractions, or informal language anywhere |
| V6 | Generic enthusiasm | -1 | Cover letter enthusiasm is non-specific: "excited about the opportunity" without why |
| V7 | Mismatched register | -1 | Resume is extremely formal but application answers are casual (or vice versa) |

### How to check
Read for voice consistency. Compare tone across sections and documents.

---

## Category 6: Cross-Source (7 signals, max -15 points)

| # | Signal | Weight | Trigger |
|---|--------|--------|---------|
| X1 | LinkedIn title mismatch | -3 | Job title on resume doesn't match LinkedIn (inflated title) |
| X2 | Tenure discrepancy | -3 | Dates differ by 6+ months between resume and LinkedIn |
| X3 | GitHub activity gap | -2 | Claims "built open-source X" but GitHub shows minimal activity |
| X4 | Publication not found | -2 | Listed publication doesn't exist in Google Scholar, arXiv, or publisher site |
| X5 | Patent not found | -2 | Listed patent not in USPTO, EPO, or Google Patents |
| X6 | Education mismatch | -2 | Degree or institution doesn't match public records |
| X7 | Company doesn't exist | -1 | Listed employer has no web presence, LinkedIn page, or business registration |

### How to check
Use WebSearch to verify each claim. Check LinkedIn, GitHub, Google Scholar, USPTO, company websites.

---

## Scoring Formula

```
authenticity_score = 100 - sum(triggered_signal_weights)
```

Minimum score: 0. Maximum score: 100.

**Recommendation tiers (PASS / REVIEW / FLAG):** Use `score_ranges` in `config/thresholds.yml` with the same rules as `modes/scan.md` Step 4 (`pass` and `review` are minimum scores on the 0–100 scale). Qualitative authenticity bands used elsewhere in the repo (for example 90–100 highly authentic) are narrative context only; they do not override those YAML cutoffs.

**Confidence adjustment:** If fewer than 3 cross-source signals could be checked (limited public info), add a note: "Score based on document analysis only -- cross-source verification limited."

## Calibration

Use `/forge-guard calibrate` with known samples (confirmed human-written and confirmed AI-generated) to tune thresholds for your specific candidate pool and role type. Default thresholds are calibrated for mid-to-senior tech roles.

## Maintainer note

From the repo root, run **`npm run verify`** after editing this file or `config/thresholds.yml` so taxonomy rows stay aligned with YAML `name:` labels, the signal count stays at 42, and related docs stay consistent (see `scripts/verify.mjs`). Same pattern as `modes/scan.md` and `modes/calibrate.md` after configuration changes.
