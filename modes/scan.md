# Mode: scan -- Single Application Screening

Full AI detection scan on a single resume, cover letter, or application.

## Input

The user provides one or more of:
- Pasted resume text
- File path to a PDF/MD/DOCX resume
- URL to an online application or profile
- Pasted cover letter
- Application form answers

## Workflow

### Step 1 -- Extract Content

If the input is a file, read it. If it's a URL, use WebFetch or Playwright to extract content. If it's pasted text, use it directly.

Identify what was provided:
- Resume only
- Resume + cover letter
- Resume + application answers
- Full package (resume + cover letter + answers)

### Step 2 -- Run Signal Extraction

Load `modes/_signals.md`. Run all 42 signals across the 6 categories against the provided content.

For each signal:
1. Check if the signal triggers
2. Record the specific evidence (exact quotes, counts, patterns)
3. Apply the weight deduction
4. Assign confidence: High (clear evidence), Medium (probable), Low (ambiguous)

**Only trigger a signal if you have concrete evidence.** Do not guess.

### Step 3 -- Compute Authenticity Score

```
score = 100 - sum(triggered_weights)
score = max(0, score)
```

### Step 4 -- Determine Recommendation

| Score | Recommendation |
|-------|----------------|
| 90-100 | PASS -- Highly authentic, proceed to interview |
| 70-89 | PASS -- Likely authentic, minor flags noted |
| 40-69 | REVIEW -- Multiple signals, needs human investigation |
| 20-39 | FLAG -- Likely AI-generated, investigate before proceeding |
| 0-19 | FLAG -- Almost certainly AI-generated |

### Step 5 -- Generate Interview Questions

For each triggered signal with Medium or High confidence, generate a verification question:

- **Metric flags** -> "Walk me through the baseline and methodology for [specific metric]"
- **Experience flags** -> "Describe your day-to-day in [role] -- who did you report to?"
- **Claim flags** -> "Tell me about [specific project/publication] -- what was your exact contribution?"
- **Timeline flags** -> "Help me understand the transition from [Company A] to [Company B]"

Generate 3-5 questions, ordered by flag severity.

### Step 6 -- Output Report

Display the screening report inline. Save to `reports/{###}-{candidate-slug}-{YYYY-MM-DD}.md`.

```
## ForgeGuard Screening: {Candidate or "Anonymous"} -- {Role}

**Score:** {X}/100
**Recommendation:** {PASS / REVIEW / FLAG}
**Signals triggered:** {N}/42

### Flags
- [{CATEGORY}] {Signal name}: {evidence} (-{weight} pts)
- ...

### Clean Signals (notable)
- {Signals that specifically indicate authenticity}

### Suggested Interview Questions
1. ...
2. ...

### Notes
{Any caveats about limited data, non-native English considerations, etc.}
```

### Step 7 -- Log to Tracker

Append to `data/screenings.md`:

```
| # | Date | Candidate | Role | Score | Recommendation | Report |
```
