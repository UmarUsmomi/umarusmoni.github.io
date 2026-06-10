# Deep Thinking - Security & 3D Scroll Integration

## Goals
1. Hardened static site security: Add Content Security Policy (CSP), Referrer-Policy, and fix reverse tabnabbing.
2. Implement Scroll-Linked 3D Rotation for the Fibonacci sphere background.
3. Set up automated Playwright security and UI verification testing in Python.

## Constraints
- Do not break existing animations, layout structure, or terminal commands.
- Keep the site compatible with static hosting (GitHub Pages).
- Playwright tests must run headlessly.

## Top 3 Risks & Mitigations
1. **Reverse Tabnabbing on Terminal Links**
   - *Risk*: Links in `terminal.js` open in a new tab without `noopener noreferrer`, allowing a destination site to redirect the parent page.
   - *Mitigation*: Edit `terminal.js` to ensure all generated `<a>` tags targeting `_blank` include `rel="noopener noreferrer"`.
2. **Frame Rate Stutter (Jank) on Scroll-Linked 3D Sphere**
   - *Risk*: Listening directly to the scroll event and updating 3D camera properties instantly causes visual stutter.
   - *Mitigation*: Throttle the scroll handler and use linear interpolation (lerping) in the animation loop to transition sphere parameters smoothly.
3. **Email Harvesting Spam**
   - *Risk*: Exposing `zunur007@gmail.com` directly in the HTML form action leads to spam bots crawling the site.
   - *Mitigation*: Recommend the user to generate a FormSubmit.co random string token/hash to hide their email address, and include this recommendation in the final report.

## Best Practices Applied
- Use meta CSP to block unauthorized script execution and mixed content.
- Smooth lerp interpolation for 3D physics changes.
- Automated browser testing to verify DOM cleanliness and styling integrity.
