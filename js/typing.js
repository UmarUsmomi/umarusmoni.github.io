/**
 * typing.js — Terminal Typing Animation
 *
 * Cycles through an array of role strings, typing and deleting
 * each one character by character with realistic delays.
 * The blinking cursor `|` is handled by CSS.
 */

'use strict';

const initTyping = (() => {
  const STRINGS = [
    'Cybersecurity Student',
    'AI & Automation Engineer',
    'Linux Enthusiast',
    'Future Pentester',
    'Vibe Coder',
  ];

  const TYPE_SPEED   = 80;    // ms per character typed
  const DELETE_SPEED = 40;    // ms per character deleted
  const PAUSE_AFTER  = 2000;  // pause after full string
  const PAUSE_EMPTY  = 500;   // pause after deletion

  let el = null;
  let strIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  /* ── Tick ───────────────────────────────────────────────── */
  function tick() {
    const current = STRINGS[strIdx];

    if (!isDeleting) {
      // Typing forward
      charIdx++;
      el.textContent = current.substring(0, charIdx);

      if (charIdx === current.length) {
        // Finished typing — pause, then start deleting
        isDeleting = true;
        setTimeout(tick, PAUSE_AFTER);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      // Deleting backward
      charIdx--;
      el.textContent = current.substring(0, charIdx);

      if (charIdx === 0) {
        // Move to next string
        isDeleting = false;
        strIdx = (strIdx + 1) % STRINGS.length;
        setTimeout(tick, PAUSE_EMPTY);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  /* ── Public Init ───────────────────────────────────────── */
  return function initTyping() {
    el = document.getElementById('typing-text');
    if (!el) return;

    // Clear any static placeholder
    el.textContent = '';
    tick();
  };
})();
