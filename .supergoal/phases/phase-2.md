SUPERGOAL_PHASE_START
Phase: 2 of 4 — Scroll-Linked 3D Rotation
Task: Modify particles.js to scale and rotate the 3D sphere based on scroll depth.
Mandatory commands: git diff js/particles.js
Acceptance criteria: 2
Evidence required:
- Verify scroll scrollY listener exists and updates target parameters
- Verify lerp interpolation is used to transition rotation speed and radius smoothly
Depends on phases: 1

### Work Description
1. Update `js/particles.js` to dynamically scale the 3D rotating Fibonacci sphere based on scroll position.
2. The radius of the sphere should transition from a larger size at the top of the page (Hero) to a smaller size as the user scrolls down to make room for content.
3. Make the auto-rotation speed scale slightly with scroll velocity or depth to make the scroll experience feel responsive and alive.
4. Ensure smooth lerp interpolation is used in the `draw()` loop so changes are visually fluid.
