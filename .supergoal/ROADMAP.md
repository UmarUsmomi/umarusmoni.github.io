# Supergoal Roadmap

This roadmap details the phases to implement security hardening, visual 3D scroll integration, automated testing, and final deployment.

## Phases

### Phase 1 — Security Hardening
- **Why**: Protects the site from XSS and tabnabbing.
- **Deliverables**: Security meta tags in `index.html`, `rel="noopener noreferrer"` attributes.
- **Acceptance criteria**:
  - CSP and Referrer Policy meta tags exist.
  - Dynamic and static `_blank` links contain `rel="noopener noreferrer"`.
- **Dependencies**: none

### Phase 2 — Scroll-Linked 3D Rotation
- **Why**: Provides the visual 3D scroll animation selected by the user.
- **Deliverables**: Scroll-linked 3D physics inside `js/particles.js`.
- **Acceptance criteria**:
  - Scroll position modifies the rotating sphere's scale and speed.
  - Motion is smoothly interpolated.
- **Dependencies**: Phase 1

### Phase 3 — Playwright Verification Testing
- **Why**: Automates browser checks to guarantee visual and security specs.
- **Deliverables**: Test script `tests/verify_site.py`.
- **Acceptance criteria**:
  - Script successfully verifies HTML structure and headers.
  - Test run passes.
- **Dependencies**: Phase 2

### Phase 4 — Polish & Harden
- **Why**: Final validation, code cleanup, and repository sync.
- **Deliverables**: Clean git status and pushed branch.
- **Acceptance criteria**:
  - Git status has no untracked files.
  - Changes pushed to GitHub Pages.
- **Dependencies**: Phase 3
