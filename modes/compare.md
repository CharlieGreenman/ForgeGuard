# Mode: compare -- Cross-Source Consistency Analysis

Compares a candidate's resume against their LinkedIn profile, cover letter, and application answers to surface inconsistencies.

## Input

At least 2 of the following:
- Resume (text or file)
- LinkedIn URL or profile text
- Cover letter
- Application form answers

## Workflow

### Step 1 -- Extract Structured Data from Each Source

For each source, extract:
- Job titles and dates
- Company names
- Key achievements and metrics
- Skills mentioned
- Education details
- Tone and writing style

### Step 2 -- Cross-Reference

Build a comparison matrix:

| Field | Resume | LinkedIn | Cover Letter | Answers |
|-------|--------|----------|-------------|---------|
| Current title | Staff Eng | Senior Eng | Staff Eng | Staff Eng |
| Tenure at X | 3 years | 2.5 years | -- | 3 years |
| Key metric | "reduced latency 47%" | "improved performance" | "cut response time in half" | "47% latency reduction" |

### Step 3 -- Flag Inconsistencies

| Type | Severity | Example |
|------|----------|---------|
| Title inflation | High | Resume says "Staff", LinkedIn says "Senior" |
| Tenure discrepancy | High | 6+ month difference between sources |
| Metric inconsistency | Medium | Different numbers for the same achievement |
| Skill mismatch | Medium | Resume lists skill not mentioned anywhere else |
| Tone mismatch | Low | Resume is highly formal, answers are casual |
| Phrasing duplication | Medium | Exact same sentence in resume and cover letter (AI generated both) |

### Step 4 -- Output

```
## Consistency Analysis: {Candidate}

Sources compared: {list}
Inconsistencies found: {N}
Duplicated phrases: {N}

### Discrepancies
| # | Field | Source A | Source B | Severity |
|---|-------|---------|---------|----------|

### Duplicated Phrases
- "{exact phrase}" appears in resume AND cover letter
- ...

### Consistency Score: {X}/100
```
