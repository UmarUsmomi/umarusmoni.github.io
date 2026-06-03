/**
 * cursor.js — Custom Neon Cursor Trail Effect
 *
 * Creates an overlay canvas that renders a glowing green cursor dot
 * and a fading particle trail. Automatically disabled on touch devices.
 */

'use strict';

const initCursor = (() => {
  const TRAIL_MAX   = 20;     // max trail particles
  const FADE_RATE   = 0.03;   // alpha decrease per frame
  const SHRINK_RATE = 0.15;   // size decrease per frame
  const INIT_SIZE   = 4;
  const CURSOR_R    = 8;      // main cursor dot radius
  const GLOW_BLUR   = 18;     // glow shadow blur radius
  const COLOR        = '0, 255, 136';

  let canvas, ctx, W, H, dpr;
  let mx = -100, my = -100;   // offscreen initially
  let trail = [];
  let rafId = null;

  /* ── Touch Detection ───────────────────────────────────── */
  function isTouchDevice() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  }

  /* ── Canvas Setup ──────────────────────────────────────── */
  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.id = 'cursor-canvas';
    Object.assign(canvas.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '9999',
    });
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
  }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* ── Animation ─────────────────────────────────────────── */
  function loop() {
    ctx.clearRect(0, 0, W, H);

    // Update & draw trail particles
    for (let i = trail.length - 1; i >= 0; i--) {
      const p = trail[i];
      p.alpha -= FADE_RATE;
      p.size  -= SHRINK_RATE;
      // Slight upward drift for ethereal feel
      p.y -= 0.3;
      p.x += (Math.random() - 0.5) * 0.5;

      if (p.alpha <= 0 || p.size <= 0) {
        trail.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COLOR}, ${p.alpha.toFixed(2)})`;
      ctx.fill();
    }

    // Main cursor dot with glow
    ctx.save();
    ctx.shadowColor = `rgba(${COLOR}, 0.8)`;
    ctx.shadowBlur = GLOW_BLUR;
    ctx.beginPath();
    ctx.arc(mx, my, CURSOR_R, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${COLOR}, 0.9)`;
    ctx.fill();
    ctx.restore();

    rafId = requestAnimationFrame(loop);
  }

  /* ── Mouse Handler ─────────────────────────────────────── */
  function onMouseMove(e) {
    mx = e.clientX;
    my = e.clientY;

    // Add new trail particle
    if (trail.length < TRAIL_MAX) {
      trail.push({ x: mx, y: my, alpha: 1, size: INIT_SIZE });
    } else {
      // Reuse oldest particle
      const oldest = trail.shift();
      oldest.x = mx;
      oldest.y = my;
      oldest.alpha = 1;
      oldest.size = INIT_SIZE;
      trail.push(oldest);
    }
  }

  /* ── Public Init ───────────────────────────────────────── */
  return function initCursor() {
    // Bail on touch devices
    if (isTouchDevice()) return;

    // Hide default cursor
    document.body.style.cursor = 'none';

    createCanvas();
    resize();

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', () => resize());

    loop();
  };
})();
