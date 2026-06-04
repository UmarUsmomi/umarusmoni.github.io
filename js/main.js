/**
 * main.js — Master Initialization & Utilities
 *
 * Orchestrates all modules (particles, cursor, typing) and provides:
 * scroll-reveal, smooth scrolling, active nav highlighting, mobile menu,
 * navbar scroll effect, contact form handling, counter animation, preloader.
 */

'use strict';

/* ════════════════════════════════════════════════════════════
   1. PRELOADER
   ════════════════════════════════════════════════════════════ */
(() => {
  // Build preloader element dynamically
  const loader = document.createElement('div');
  loader.id = 'preloader';
  Object.assign(loader.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '99999',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0a0f',
    transition: 'opacity 0.6s ease, visibility 0.6s ease',
  });

  // Spinner
  const spinner = document.createElement('div');
  Object.assign(spinner.style, {
    width: '48px',
    height: '48px',
    border: '3px solid rgba(0, 255, 136, 0.15)',
    borderTop: '3px solid #00ff88',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  });
  loader.appendChild(spinner);

  // Inject keyframes once
  const style = document.createElement('style');
  style.textContent = `@keyframes spin{to{transform:rotate(360deg)}}`;
  document.head.appendChild(style);

  // Insert preloader at top of body as soon as possible
  document.body.prepend(loader);

  window.addEventListener('load', () => {
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
    document.body.classList.add('loaded');
    setTimeout(() => loader.remove(), 600);
  });
})();


/* ════════════════════════════════════════════════════════════
   2. DOM CONTENT LOADED — Main Init
   ════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Module Init ─────────────────────────────────────── */
  if (typeof initParticles === 'function') initParticles();
  if (typeof initCursor    === 'function') initCursor();
  if (typeof initTyping    === 'function') initTyping();


  /* ══════════════════════════════════════════════════════
     3. SCROLL REVEAL
     ══════════════════════════════════════════════════════ */
  const revealElements = document.querySelectorAll('.scroll-reveal');

  if (revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            // Stagger delay from data attribute or fallback to index
            const delay = el.dataset.delay
              || Array.from(revealElements).indexOf(el) * 100;
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add('revealed');
            revealObserver.unobserve(el);    // reveal once
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }


  /* ══════════════════════════════════════════════════════
     4. SMOOTH SCROLL
     ══════════════════════════════════════════════════════ */
  const NAV_OFFSET = 70; // px — height of fixed navbar

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ══════════════════════════════════════════════════════
     5. ACTIVE NAVIGATION
     ══════════════════════════════════════════════════════ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              link.classList.toggle(
                'active',
                link.getAttribute('href') === `#${id}`
              );
            });
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    sections.forEach((sec) => navObserver.observe(sec));
  }


  /* ══════════════════════════════════════════════════════
     6. MOBILE MENU
     ══════════════════════════════════════════════════════ */
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    const toggleMenu = (open) => {
      const isOpen = typeof open === 'boolean'
        ? open
        : !mobileMenu.classList.contains('open');

      mobileMenu.classList.toggle('open', isOpen);
      hamburger.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    hamburger.addEventListener('click', () => toggleMenu());

    // Close on close button click
    const mobileCloseBtn = document.getElementById('mobile-close-btn');
    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener('click', () => toggleMenu(false));
    }

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        toggleMenu(false);
      }
    });
  }


  /* ══════════════════════════════════════════════════════
     7. NAVBAR SCROLL EFFECT
     ══════════════════════════════════════════════════════ */
  const navbar = document.querySelector('.navbar, nav');

  if (navbar) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          navbar.classList.toggle('nav-scrolled', window.scrollY > 100);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }


  /* ══════════════════════════════════════════════════════
     8. CONTACT FORM
     ══════════════════════════════════════════════════════ */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      // Let the form submit to FormSubmit.co via its action attribute.
      // Show a brief inline success message.
      const btn = contactForm.querySelector('button[type="submit"], input[type="submit"]');
      if (btn) {
        const originalText = btn.textContent || btn.value;
        btn.textContent = '✓ Sent!';
        btn.disabled = true;
        btn.style.background = 'rgba(0, 255, 136, 0.2)';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.background = '';
        }, 3000);
      }
    });
  }


  /* ══════════════════════════════════════════════════════
     9. COUNTER ANIMATION
     ══════════════════════════════════════════════════════ */
  const counters = document.querySelectorAll('.stat-number[data-count]');

  if (counters.length) {
    const COUNTER_DURATION = 2000; // ms

    function animateCounter(el) {
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) return;

      const start = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / COUNTER_DURATION, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(step);
    }

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => counterObserver.observe(el));
  }

  /* ══════════════════════════════════════════════════════
     10. MAC-STYLE SOCIAL DOCK MAGNIFIER ANIMATION
     ══════════════════════════════════════════════════════ */
  const dock = document.querySelector('.dock');
  if (dock) {
    dock.addEventListener('pointermove', (e) => {
      dock.querySelectorAll('.dock > *').forEach((el) => {
        const r = el.getBoundingClientRect();
        const t = Math.max(
          0,
          1 - Math.abs(e.clientX - (r.x + r.width / 2)) / 120
        );
        // Disable transitions temporarily during mouse move for instant, lag-free scaling
        el.style.transition = 'none';
        el.style.scale = 1 + t * 0.5;
      });
    });

    dock.addEventListener('pointerleave', () => {
      dock.querySelectorAll('.dock > *').forEach((el) => {
        // Restore transition so it scales back down smoothly
        el.style.transition = '';
        el.style.scale = '';
      });
    });
  }

}); // end DOMContentLoaded
