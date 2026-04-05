# Mode: verify -- Claim Verification

Cross-references resume claims against public sources.

## Input

- Resume (text or file)
- Candidate name (for public record searches)
- Optional: LinkedIn URL, GitHub URL

## Workflow

### Step 1 -- Extract Claims

Parse the resume and extract verifiable claims:

| Claim Type | What to Extract |
|------------|-----------------|
| Employment | Company, title, dates, team/department |
| Education | Institution, degree, graduation date, honors |
| Publications | Title, venue, co-authors, year |
| Patents | Title, patent number, filing date |
| Open source | Project name, repo, role (creator/contributor) |
| Certifications | Name, issuing body, date |
| Awards | Name, granting organization, year |
| Speaking | Conference, talk title, year |

### Step 2 -- Verify Each Claim

Use WebSearch and WebFetch to check:

1. **Employment**: LinkedIn profile, company website team page, press releases
2. **Education**: University alumni directories, degree verification services
3. **Publications**: Google Scholar, arXiv, Semantic Scholar, publisher sites
4. **Patents**: USPTO, Google Patents, EPO
5. **Open source**: GitHub/GitLab profile, npm/PyPI packages, commit history
6. **Certifications**: Issuing body verification pages (AWS, Google Cloud, etc.)
7. **Awards**: Organization websites, press releases
8. **Speaking**: Conference agendas, YouTube/SlideShare

### Step 3 -- Classify Results

For each claim:

| Status | Meaning |
|--------|---------|
| **Confirmed** | Found matching evidence in public source |
| **Partial** | Found related evidence but details differ (title mismatch, date off by months) |
| **Not Found** | No evidence found (may be legitimate -- not everything is public) |
| **Mismatch** | Found contradicting evidence (different dates, different title, different company) |

### Step 4 -- Output

```
## Claim Verification: {Candidate}

Verified: {N}/{total} claims
Mismatches: {N}
Not found: {N}

| # | Claim | Type | Status | Source | Notes |
|---|-------|------|--------|--------|-------|
| 1 | "Senior Eng at Stripe, 2022-2024" | Employment | Confirmed | LinkedIn | Title matches |
| 2 | "Published in NeurIPS 2023" | Publication | Not Found | Google Scholar | No matching paper |
| ... | ... | ... | ... | ... | ... |
```

**Important:** "Not Found" does not mean "fabricated." Many legitimate claims aren't indexed publicly. Flag it, but don't accuse.
