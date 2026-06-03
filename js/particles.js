/**
 * particles.js — 3D Wireframe Sphere & Floating Particles Background
 * 
 * Renders a slowly rotating fibonacci-distributed sphere with perspective
 * projection, connected by proximity lines, plus ambient floating particles.
 * Includes parallax mouse interaction, mobile optimization, visibility-based
 * pausing, and HiDPI support.
 */

'use strict';

const initParticles = (() => {
  /* ── Configuration ─────────────────────────────────────── */
  const isMobile = () => window.innerWidth < 768;

  const CONFIG = {
    get spherePoints()   { return isMobile() ? 100 : 200; },
    get floatingCount()  { return isMobile() ? 25  : 50;  },
    sphereLineMax:   120,   // max dist between sphere pts to draw a line
    floatLineMax:    150,   // max dist between floating pts to draw a line
    rotSpeedY:       0.002, // auto-rotation speed (rad/frame)
    parallaxFactor:  0.0004,
    pointRadius:     2.5,
    floatRadiusMin:  1,
    floatRadiusMax:  2,
    perspective:     600,
  };

  /* ── State ─────────────────────────────────────────────── */
  let canvas, ctx, W, H, dpr;
  let spherePoints = [];
  let floatingParticles = [];
  let angleY = 0, angleX = 0;
  let mouseOffX = 0, mouseOffY = 0;
  let rafId = null;
  let sphereRadius = 150;

  // 3D Camera Translation Targets
  let targetX = 0;
  let targetY = 0;
  let targetZ = 0;
  let targetRadius = 150;

  // Current interpolated values
  let currentX = 0;
  let currentY = 0;
  let currentZ = 0;

  // Warp speed state
  let warpActive = false;
  let warpTimer = 0;
  let warpSpeedFactor = 1;

  /* ── Lerp helper ───────────────────────────────────────── */
  function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }

  /* ── Fibonacci Sphere Distribution ─────────────────────── */
  function generateSpherePoints(n) {
    const pts = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;           // y: 1 → -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      pts.push({
        x: Math.cos(theta) * radiusAtY,
        y: y,
        z: Math.sin(theta) * radiusAtY,
      });
    }
    return pts;
  }

  /* ── Floating Particles ────────────────────────────────── */
  function createFloating(n) {
    const arr = [];
    for (let i = 0; i < n; i++) {
      arr.push({
        x:  Math.random() * W,
        y:  Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r:  CONFIG.floatRadiusMin + Math.random() * (CONFIG.floatRadiusMax - CONFIG.floatRadiusMin),
        a:  0.1 + Math.random() * 0.4,
      });
    }
    return arr;
  }

  /* ── 3D → 2D Projection ───────────────────────────────── */
  function project(x, y, z) {
    // Apply 3D camera translation
    const tx = x + currentX;
    const ty = y + currentY;
    const tz = z + currentZ;
    const scale = CONFIG.perspective / (CONFIG.perspective + tz);
    return {
      sx: tx * scale + W / 2,
      sy: ty * scale + H / 2,
      scale,
      z: tz,
    };
  }

  /* ── Rotation Matrices (Y then X) ─────────────────────── */
  function rotateY(p, a) {
    const cos = Math.cos(a), sin = Math.sin(a);
    return { x: p.x * cos - p.z * sin, y: p.y, z: p.x * sin + p.z * cos };
  }
  function rotateX(p, a) {
    const cos = Math.cos(a), sin = Math.sin(a);
    return { x: p.x, y: p.y * cos - p.z * sin, z: p.y * sin + p.z * cos };
  }

  /* ── Distance² (2D) ───────────────────────────────────── */
  function dist2(a, b) {
    const dx = a.sx - b.sx, dy = a.sy - b.sy;
    return dx * dx + dy * dy;
  }

  /* ── Scroll 3D Parameters Calculator ───────────────────── */
  function update3DParams() {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    const pct = scrollY / maxScroll;

    const factorX = isMobile() ? 0.05 : 0.25;

    // Linearly interpolate targets based on scroll phase
    if (pct < 0.25) {
      // Hero (0%) -> About (25%)
      const t = pct / 0.25;
      targetX = lerp(0, W * factorX, t);
      targetY = lerp(0, -H * 0.05, t);
      targetZ = lerp(0, -100, t);
      targetRadius = lerp(Math.min(W, H) * 0.25, Math.min(W, H) * 0.22, t);
    } else if (pct < 0.50) {
      // About (25%) -> Projects (50%)
      const t = (pct - 0.25) / 0.25;
      targetX = lerp(W * factorX, -W * factorX, t);
      targetY = lerp(-H * 0.05, H * 0.05, t);
      targetZ = lerp(-100, 100, t);
      targetRadius = lerp(Math.min(W, H) * 0.22, Math.min(W, H) * 0.24, t);
    } else if (pct < 0.75) {
      // Projects (50%) -> Skills (75%)
      const t = (pct - 0.50) / 0.25;
      targetX = lerp(-W * factorX, 0, t);
      targetY = lerp(H * 0.05, -H * 0.1, t);
      targetZ = lerp(100, 200, t);
      targetRadius = lerp(Math.min(W, H) * 0.24, Math.min(W, H) * 0.18, t);
    } else {
      // Skills (75%) -> Contact (100%)
      const t = (pct - 0.75) / 0.25;
      targetX = lerp(0, W * 0.1, t);
      targetY = lerp(-H * 0.1, H * 0.1, t);
      targetZ = lerp(200, -200, t);
      targetRadius = lerp(Math.min(W, H) * 0.18, Math.min(W, H) * 0.20, t);
    }
  }

  /* ── Draw Frame ────────────────────────────────────────── */
  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Smoothly interpolate current camera coordinates
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;
    currentZ += (targetZ - currentZ) * 0.06;
    sphereRadius += (targetRadius - sphereRadius) * 0.06;

    // Handle warp speed dynamics
    if (warpActive) {
      warpSpeedFactor += (10 - warpSpeedFactor) * 0.12;
      warpTimer--;
      if (warpTimer <= 0) {
        warpActive = false;
      }
    } else {
      warpSpeedFactor += (1 - warpSpeedFactor) * 0.05;
    }

    /* — 1. Sphere — */
    angleY += CONFIG.rotSpeedY * warpSpeedFactor;
    const totalAngleY = angleY + mouseOffX * CONFIG.parallaxFactor;
    const totalAngleX = mouseOffY * CONFIG.parallaxFactor;

    const projected = [];
    for (let i = 0; i < spherePoints.length; i++) {
      let p = spherePoints[i];
      // Scale to sphere radius
      let pt = { x: p.x * sphereRadius, y: p.y * sphereRadius, z: p.z * sphereRadius };
      pt = rotateY(pt, totalAngleY);
      pt = rotateX(pt, totalAngleX);
      projected.push(project(pt.x, pt.y, pt.z));
    }

    // Lines between nearby sphere points
    const maxDist2 = CONFIG.sphereLineMax * CONFIG.sphereLineMax;
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const d2 = dist2(projected[i], projected[j]);
        if (d2 < maxDist2) {
          const alpha = 0.3 * (1 - d2 / maxDist2);
          ctx.beginPath();
          ctx.moveTo(projected[i].sx, projected[i].sy);
          ctx.lineTo(projected[j].sx, projected[j].sy);
          ctx.strokeStyle = `rgba(0, 255, 136, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Sphere dots
    for (const pt of projected) {
      const depthAlpha = 0.3 + 0.7 * ((pt.z + sphereRadius) / (2 * sphereRadius));
      ctx.beginPath();
      ctx.arc(pt.sx, pt.sy, CONFIG.pointRadius * pt.scale, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 255, 136, ${depthAlpha.toFixed(2)})`;
      ctx.fill();
    }

    /* — 2. Floating Particles — */
    const fMaxDist2 = CONFIG.floatLineMax * CONFIG.floatLineMax;
    for (const p of floatingParticles) {
      p.x += p.vx * warpSpeedFactor;
      p.y += p.vy * warpSpeedFactor;
      // Wrap around canvas edges
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 255, 136, ${p.a})`;
      ctx.fill();
    }

    // Lines between nearby floating particles
    for (let i = 0; i < floatingParticles.length; i++) {
      for (let j = i + 1; j < floatingParticles.length; j++) {
        const a = floatingParticles[i], b = floatingParticles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < fMaxDist2) {
          const alpha = 0.15 * (1 - d2 / fMaxDist2);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0, 255, 136, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  /* ── Animation Loop ────────────────────────────────────── */
  function loop() {
    if (document.hidden) {
      rafId = requestAnimationFrame(loop);
      return;                       // skip rendering while tab hidden
    }
    draw();
    rafId = requestAnimationFrame(loop);
  }

  /* ── Canvas Sizing ─────────────────────────────────────── */
  function resize() {
    dpr = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    sphereRadius = Math.min(W, H) * 0.25;

    // Regenerate points on resize (handles mobile ↔ desktop switch)
    spherePoints = generateSpherePoints(CONFIG.spherePoints);
    floatingParticles = createFloating(CONFIG.floatingCount);
  }

  /* ── Debounce Helper ───────────────────────────────────── */
  let resizeTimer;
  function debouncedResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  }

  /* ── Public Init ───────────────────────────────────────── */
  return function initParticles() {
    canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resize();

    // Mouse parallax
    window.addEventListener('mousemove', (e) => {
      mouseOffX = e.clientX - W / 2;
      mouseOffY = e.clientY - H / 2;
    });

    window.addEventListener('resize', debouncedResize);

    // Scroll listener to update 3D positions
    window.addEventListener('scroll', update3DParams);
    
    // Initial call to set parameters based on current scroll position
    update3DParams();

    // Warp speed effect on navigation links clicks
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => {
        warpActive = true;
        warpTimer = 45; // 45 frames of warp speed
      });
    });

    // Visibility API — will naturally skip draws
    document.addEventListener('visibilitychange', () => {});

    loop();
  };
})();
