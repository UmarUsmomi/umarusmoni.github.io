SUPERGOAL_PHASE_START
Phase: 3 of 4 — Playwright Verification Testing
Task: Write and execute a Python Playwright script to verify security headers and page logic.
Mandatory commands: python tests/verify_site.py
Acceptance criteria: 2
Evidence required:
- verify_site.py script exists under tests/
- Test runs successfully and prints "All verification tests passed!"
Depends on phases: 2

### Work Description
1. Create a Python script `tests/verify_site.py` that utilizes `playwright` to load the local `index.html`.
2. The script should verify:
   - The page loads without console errors.
   - The CSP meta tag is present.
   - All `_blank` anchor tags on the page contain `rel="noopener noreferrer"`.
3. Run the script and print the test log output.
