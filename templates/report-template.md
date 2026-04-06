# Screening Report: {CANDIDATE} -- {ROLE}

**Date:** {DATE}
**Authenticity Score:** {SCORE}/100
**Recommendation:** {RECOMMENDATION} — PASS, REVIEW, or FLAG per `score_ranges` in `config/thresholds.yml` (see `modes/scan.md` Step 4).
**Signals triggered:** {TRIGGERED}/{TOTAL}

<!-- {TOTAL} = count of signals with enabled: true in config/thresholds.yml (42 when all enabled). {TRIGGERED} counts only enabled ids that fired. Strip this comment from saved candidate reports. -->

---

## Signal Summary

| Category | Signals Triggered | Deduction |
|----------|-------------------|-----------|
| Lexical | {N}/7 | -{X} |
| Structural | {N}/7 | -{X} |
| Temporal | {N}/7 | -{X} |
| Metric | {N}/7 | -{X} |
| Voice | {N}/7 | -{X} |
| Cross-source | {N}/7 | -{X} |

## Flags (detailed)

{FLAGS}

<!-- FLAG ENTRY SHAPE (repeat per triggered signal; strip HTML comments from saved candidate reports):
### [LEXICAL | STRUCTURAL | TEMPORAL | METRIC | VOICE | CROSS-SOURCE] Signal label (align with `modes/_signals.md` / `config/thresholds.yml` `name:` when citing a weighted signal)
**Evidence:** concrete quote, count, or structural note — no fabricated checks
**Deduction:** -X points (use the weight from `config/thresholds.yml` for that signal id only when `enabled: true`; do not emit a scored flag row for disabled ids)
**Confidence:** High / Medium / Low
-->

## Clean Signals (positive indicators)

{CLEAN_SIGNALS}

## Verified Claims

| Claim | Source | Status |
|-------|--------|--------|
{CLAIMS}

## Suggested Interview Questions

{QUESTIONS}

## Notes

{NOTES}

<!-- NOTES: Treat the score as a heuristic, not proof of AI use or dishonesty. Mention limited cross-source data, drafting tools, or non-native English when those factors affect interpretation. List only claims you actually checked; use Confirmed / Partial / Not Found / Mismatch (same meanings as `modes/verify.md` Step 3) from WebSearch or provided sources -- never invent verification. Strip this comment from saved candidate reports. -->
