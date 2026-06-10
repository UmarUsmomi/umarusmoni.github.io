# Supergoal Protocol

This protocol outlines the execution instructions, error recovery steps, and final audit guidelines for the `/goal` runner.

## Phase Execution Loop
1. Read `.supergoal/STATE.md` to identify the `Current phase`.
2. Locate the matching spec file under `.supergoal/phases/phase-N.md`.
3. Perform the actions described in the work description.
4. Run the mandatory commands specified in the phase header.
5. Verify every acceptance criterion.
6. Update `.supergoal/STATE.md` by moving to the next phase.
7. Print `SUPERGOAL_PHASE_DONE` for the phase.
8. Repeat for subsequent phases.

## Final Audit
After completing all phases:
1. Re-read `.supergoal/ROADMAP.md`.
2. Run all aggregated mandatory commands.
3. Spot-check that all acceptance criteria are fully met.
4. Verify that no debug prints or temporary files are left.
5. Print `AUDIT_COMPLETE` and `SUPERGOAL_RUN_COMPLETE`.
