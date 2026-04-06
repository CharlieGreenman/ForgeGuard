# Mode: interview -- Verification Interview Question Generation

Generates targeted interview questions designed to verify claims that triggered detection signals.

## Input

- A screening report from `scan` mode, OR
- A resume to scan fresh and generate questions from

## Workflow

### Step 1 -- Identify Verification Targets

From the screening report (or a fresh scan), identify:
1. All flagged signals with evidence
2. Unverified claims from `verify` mode
3. Inconsistencies from `compare` mode

### Step 2 -- Generate Questions by Category

#### For Metric Flags
Questions that require the candidate to explain the context behind numbers:
- "You mentioned reducing latency by 47%. What was the baseline before your work?"
- "Walk me through how you measured that result."
- "What was the team size on that project? What was your specific contribution vs the team's?"

#### For Experience Flags
Questions that require lived experience to answer:
- "Describe a typical day in your role at {company}."
- "Who did you report to? What was the team structure?"
- "What was the most frustrating part of working on {project}?"
- "What tools did you use daily? Walk me through your workflow."

#### For Technical Claim Flags
Questions that go one level deeper than the resume:
- "You listed {technology}. Can you describe a specific problem you solved with it?"
- "What trade-offs did you consider when choosing {approach}?"
- "If you had to rebuild {project} from scratch, what would you do differently?"

#### For Publication/Patent Flags
Direct verification:
- "Tell me about the key finding in your {paper title} paper."
- "What was the review process like? How many rounds of revision?"
- "What's the current status of your patent on {topic}?"

#### For Timeline Flags
Chronological probing:
- "Help me understand the transition from {Company A} to {Company B}."
- "What were you working on between {date} and {date}?"
- "You were at {company} for {N} years. What changed in your role over that time?"

### Step 3 -- Prioritize and Format

Generate 5-8 questions. Order by:
1. Highest-weight signals first
2. Cross-source mismatches second
3. Unverified claims third

### Step 4 -- Output

```
## Verification Interview Questions: {Candidate} -- {Role}

Based on screening score: {X}/100

### Priority Questions (address these first)
1. {question} -- tests: [{signal code}]
2. {question} -- tests: [{signal code}]
3. {question} -- tests: [{signal code}]

### Follow-Up Questions (if time permits)
4. {question}
5. {question}

### What to Listen For
- **Rich, specific answers** often include: names, dates, frustrations, mistakes, and hedges like "I don't remember exactly but..."
- **Shallow or generic answers** warrant follow-up — they are **not** proof of fabrication, AI use, or dishonesty; anxiety, NDAs, or interview style can look the same. Probe with neutral "how" and "why" before updating your assessment.
- **Depth check**: Can they explain mechanism and trade-offs, not only outcomes? Smooth surface-level replies sometimes reflect memorized bullets; sometimes they reflect a nervous day. Treat the difference as a clue, not a verdict.
```

### Screening tier context

When you build on a prior `scan` report, its **Recommendation** (PASS / REVIEW / FLAG) was derived from `score_ranges` in `config/thresholds.yml`, same rules as `modes/scan.md` Step 4. Use those cutoffs if you restate the tier; qualitative authenticity bands in `CLAUDE.md` are narrative context only. After calibration, describe bands using the current YAML values, not assumed defaults.

### Interviewer Notes

- These questions are designed to be conversational, not adversarial
- The goal is to let authentic candidates shine, not to trap anyone
- If a candidate gives a strong, specific answer to a flagged area, that's a positive signal -- update your assessment
- Combine interview behavior with document signals and verified claims; no single answer or "tell" is dispositive
