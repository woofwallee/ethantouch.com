/* ===========================
   JOURNAL — Cinematic scroll behavior
   Lenis smooth scroll + custom cursor + parallax + scroll reveals
   Self-contained. Loaded only on /journal/ pages.
   =========================== */

(function() {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  // ===========================
  // Lenis smooth scroll
  // ===========================
  function initLenis() {
    if (typeof Lenis === 'undefined') return null;
    if (prefersReducedMotion) return null;

    const lenis = new Lenis({
      duration: 1.4,
      easing: function(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return lenis;
  }

  // ===========================
  // Custom cursor (desktop only)
  // ===========================
  function initCursor() {
    if (isCoarsePointer || prefersReducedMotion) return;

    const cursor = document.querySelector('.journal-cursor');
    if (!cursor) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;
      cursor.style.transform = 'translate(' + cursorX + 'px, ' + cursorY + 'px) translate(-50%, -50%)';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor grows on interactive elements
    const hoverables = document.querySelectorAll('a, button, .journal-entry');
    hoverables.forEach(function(el) {
      el.addEventListener('mouseenter', function() { cursor.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function() { cursor.classList.remove('is-hover'); });
    });
  }

  // ===========================
  // Parallax on hero image
  // ===========================
  function initParallax() {
    if (prefersReducedMotion) return;

    const containers = document.querySelectorAll('[data-parallax]');
    if (!containers.length) return;

    function updateParallax() {
      containers.forEach(function(container) {
        const img = container.querySelector('img');
        if (!img) return;

        const rect = container.getBoundingClientRect();
        const containerHeight = rect.height;
        const visibleProgress = (window.innerHeight - rect.top) / (window.innerHeight + containerHeight);

        if (visibleProgress < 0 || visibleProgress > 1) return;

        const offset = (visibleProgress - 0.5) * 80;
        img.style.transform = 'translate3d(0, ' + offset + 'px, 0)';
      });
      requestAnimationFrame(updateParallax);
    }
    requestAnimationFrame(updateParallax);
  }

  // ===========================
  // Scroll reveals via IntersectionObserver
  // ===========================
  function initReveals() {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(function(el) { el.classList.add('is-visible'); });
      return;
    }

    // Auto-tag elements that should fade in on scroll
    const targets = document.querySelectorAll([
      '.journal-post__header',
      '.journal-post__body > p',
      '.journal-post__body > h2',
      '.journal-post__body > h3',
      '.journal-post__body > blockquote',
      '.journal-post__body > ul',
      '.journal-post__body > ol',
      '.journal-post__body > img',
      '.journal-post__body > hr',
      '.journal-entry',
      '.journal-index__header'
    ].join(','));

    targets.forEach(function(el) { el.classList.add('reveal'); });

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.05
    });

    targets.forEach(function(el) { observer.observe(el); });
  }

  // ===========================
  // Init
  // ===========================
  function init() {
    initLenis();
    initCursor();
    initParallax();
    initReveals();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
