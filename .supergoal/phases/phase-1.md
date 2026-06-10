SUPERGOAL_PHASE_START
Phase: 1 of 4 — Security Hardening
Task: Add security meta tags and fix reverse tabnabbing links.
Mandatory commands: git diff index.html
Acceptance criteria: 3
Evidence required:
- Verify CSP and Referrer Policy meta tags exist in index.html
- Verify rel="noopener noreferrer" added to all _blank links in index.html
- Verify rel="noopener noreferrer" added to all generated _blank links in js/terminal.js
Depends on phases: none

### Work Description
1. Add `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; media-src 'self'; frame-src 'none'; connect-src 'self' https://formsubmit.co;" />` to the head of `index.html`.
2. Add `<meta name="referrer" content="no-referrer-when-downgrade" />` to the head of `index.html`.
3. Add `rel="noopener noreferrer"` to any external links in `index.html` that are missing it.
4. Modify `js/terminal.js` to add `rel="noopener noreferrer"` to all social anchor tags generated dynamically.
