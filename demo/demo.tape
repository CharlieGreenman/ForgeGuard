# ForgeGuard Demo — AI Application Screening
# Record with: cd demo && vhs demo.tape

Output demo.gif
Output demo.webm

Set Shell "bash"
Set FontSize 14
Set Width 1200
Set Height 700
Set Theme "Catppuccin Mocha"
Set Padding 20
Set TypingSpeed 40ms
Set PlaybackSpeed 0.5

# Title card
Type "# ForgeGuard — AI Application Screening"
Enter
Sleep 1.5s

Type "# Detect AI-generated resumes. Verify claims. Surface authenticity signals."
Enter
Sleep 1.5s

Type "clear"
Enter
Sleep 500ms

# Show command menu
Type "claude '/forge-guard'"
Sleep 500ms
Enter
Sleep 500ms

Type@0ms "forge-guard -- Application Screening"
Enter
Type@0ms ""
Enter
Type@0ms "Available commands:"
Enter
Type@0ms "  /forge-guard {resume}     --> SCAN: full AI detection on a single application"
Enter
Type@0ms "  /forge-guard batch {dir}  --> Batch screen a folder of applications"
Enter
Type@0ms "  /forge-guard verify {resume} --> Cross-reference claims against public sources"
Enter
Type@0ms "  /forge-guard compare      --> Compare resume vs LinkedIn vs cover letter"
Enter
Type@0ms "  /forge-guard interview {resume} --> Generate verification interview questions"
Enter
Type@0ms "  /forge-guard report       --> Screening report for hiring committee"
Enter
Type@0ms "  /forge-guard calibrate    --> Calibrate thresholds with known samples"
Enter
Type@0ms "  /forge-guard dashboard    --> View screening stats"
Enter
Type@0ms ""
Enter
Type@0ms "Or paste a resume directly to run a full scan."
Enter
Sleep 3s

Type "clear"
Enter
Sleep 500ms

# Demo: scan a suspicious resume
Type "# Scan a suspicious resume"
Enter
Sleep 1s

Type "claude '/forge-guard scan resume-john-smith.pdf'"
Sleep 500ms
Enter
Sleep 1s

Type@0ms ""
Enter
Type@0ms ">> Extracting signals across 6 categories (42 signals)..."
Enter
Sleep 1s
Type@0ms ""
Enter
Type@0ms "## ForgeGuard Screening: John Smith -- Senior Software Engineer"
Enter
Type@0ms ""
Enter
Type@0ms "  Authenticity Score: 34/100"
Enter
Type@0ms "  Recommendation: FLAG"
Enter
Type@0ms "  Signals triggered: 14/42"
Enter
Type@0ms ""
Enter
Sleep 1s

Type@0ms "### Flags"
Enter
Type@0ms '  [LEXICAL]  "leveraged" 3x, "orchestrated" 2x, "spearheaded" 3x  (-5 pts)'
Enter
Sleep 300ms
Type@0ms '  [LEXICAL]  "passionate about building scalable solutions"          (-3 pts)'
Enter
Sleep 300ms
Type@0ms "  [STRUCT]   All 12 bullets are 18-22 words. Zero variance.          (-5 pts)"
Enter
Sleep 300ms
Type@0ms "  [STRUCT]   Every role has exactly 4 bullets.                        (-3 pts)"
Enter
Sleep 300ms
Type@0ms '  [METRIC]   "reduced latency by 50%" -- no baseline, no context     (-3 pts)'
Enter
Sleep 300ms
Type@0ms "  [METRIC]   All metrics are round numbers: 50%, 60%, 40%, 35%, 3x   (-2 pts)"
Enter
Sleep 300ms
Type@0ms "  [CROSS]    LinkedIn: 2 yrs at TechCorp. Resume: 4 years.           (-3 pts)"
Enter
Sleep 300ms
Type@0ms "  [CROSS]    GitHub: 12 commits total. Claims 'led open-source'.     (-2 pts)"
Enter
Sleep 2s

Type@0ms ""
Enter
Type@0ms "### Suggested Interview Questions"
Enter
Type@0ms '  1. "Walk through the latency reduction -- what was the baseline?"'
Enter
Type@0ms '  2. "What is the open-source repo name you led?"'
Enter
Type@0ms '  3. "Describe a typical day at TechCorp. Who do you report to?"'
Enter
Sleep 3s

Type "clear"
Enter
Sleep 500ms

# Demo: scan an authentic resume
Type "# Now scan an authentic resume"
Enter
Sleep 1s

Type "claude '/forge-guard scan resume-jane-chen.pdf'"
Sleep 500ms
Enter
Sleep 1s

Type@0ms ""
Enter
Type@0ms "## ForgeGuard Screening: Jane Chen -- Senior Backend Engineer"
Enter
Type@0ms ""
Enter
Type@0ms "  Authenticity Score: 92/100"
Enter
Type@0ms "  Recommendation: PASS"
Enter
Type@0ms "  Signals triggered: 1/42"
Enter
Type@0ms ""
Enter
Type@0ms "### Clean Signals (positive indicators)"
Enter
Type@0ms '  + Bullet lengths vary naturally: 8-32 words (SD=11)'
Enter
Type@0ms '  + Contains self-deprecating humor ("ugly but it worked")'
Enter
Type@0ms '  + Metrics include context: "~800ms p99 to 120ms"'
Enter
Type@0ms '  + Admits estimation failures: "8 months, not the 3 we estimated"'
Enter
Type@0ms '  + Asymmetric detail: recent role has 3 bullets, oldest has 2'
Enter
Type@0ms '  + Zero AI hallmark words'
Enter
Sleep 3s

Type "clear"
Enter
Sleep 500ms

# Demo: batch screening
Type "# Batch screen an entire applicant pool"
Enter
Sleep 1s

Type "claude '/forge-guard batch applications/'"
Sleep 500ms
Enter
Sleep 1s

Type@0ms ""
Enter
Type@0ms "## Batch Screening Summary -- 2026-04-05"
Enter
Type@0ms ""
Enter
Type@0ms "  Processed: 24 applications"
Enter
Type@0ms "  Flagged:   5 (score < 40)"
Enter
Type@0ms "  Review:    7 (score 40-69)"
Enter
Type@0ms "  Passed:   12 (score 70+)"
Enter
Type@0ms ""
Enter
Type@0ms "  | # | Candidate    | Score | Rec    | Top Flag                    |"
Enter
Type@0ms "  |---|-------------|-------|--------|------------------------------|"
Enter
Type@0ms '  | 1 | J. Smith    |  23   | FLAG   | 8 AI hallmark words          |'
Enter
Type@0ms '  | 2 | R. Kumar    |  31   | FLAG   | LinkedIn tenure mismatch     |'
Enter
Type@0ms '  | 3 | A. Johnson  |  38   | FLAG   | All metrics round numbers    |'
Enter
Type@0ms "  | ..| ...         |  ...  | ...    | ...                          |"
Enter
Type@0ms '  |22 | M. Torres   |  88   | PASS   | --                           |'
Enter
Type@0ms '  |23 | J. Chen     |  92   | PASS   | --                           |'
Enter
Type@0ms '  |24 | S. Park     |  95   | PASS   | --                           |'
Enter
Sleep 3s

Type "clear"
Enter
Sleep 500ms

# Closing
Type "# ForgeGuard: Screen. Verify. Hire with confidence."
Enter
Sleep 1s
Type "# github.com/CharlieGreenman/ForgeGuard"
Enter
Sleep 3s
