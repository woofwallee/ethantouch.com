// ===========================
// HERO ANIMATION — COORDINATED GSAP TIMELINE
// ===========================
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function buildConnectors() {
    const svg = document.getElementById('connectorSvg');
    const portrait = document.getElementById('portrait');
    if (!svg || !portrait || window.innerWidth < 968) { svg.innerHTML = ''; return []; }

    const hero = document.querySelector('.hero');
    const hRect = hero.getBoundingClientRect();
    const pRect = portrait.getBoundingClientRect();
    const pCx = pRect.left + pRect.width / 2 - hRect.left;
    const pCy = pRect.top + pRect.height / 2 - hRect.top;
    const pW = pRect.width / 2;
    const pH = pRect.height / 2;

    const dots = {
      tl: { x: pCx - pW - 12, y: pCy - pH * 0.3 },
      bl: { x: pCx - pW - 10, y: pCy + pH * 0.35 },
      tr: { x: pCx + pW + 12, y: pCy - pH * 0.25 },
      br: { x: pCx + pW + 10, y: pCy + pH * 0.2 },
    };
    const anns = {
      tl: document.getElementById('ann-tl'),
      bl: document.getElementById('ann-bl'),
      tr: document.getElementById('ann-tr'),
      br: document.getElementById('ann-br'),
    };

    let svgContent = '';
    // Top-left
    {
      const r = anns.tl.getBoundingClientRect();
      const sx = r.right - hRect.left + 15, sy = r.top + r.height * 0.5 - hRect.top;
      const d = dots.tl, mx = sx + (d.x - sx) * 0.4, my = d.y;
      svgContent += '<polyline class="connector-line" points="' + sx + ',' + sy + ' ' + mx + ',' + my + ' ' + d.x + ',' + d.y + '" />';
      svgContent += '<circle class="connector-dot" cx="' + d.x + '" cy="' + d.y + '" r="3.5" />';
    }
    // Bottom-left
    {
      const r = anns.bl.getBoundingClientRect();
      const sx = r.right - hRect.left + 15, sy = r.top + r.height * 0.5 - hRect.top;
      const d = dots.bl, mx = sx + (d.x - sx) * 0.5, my = sy;
      svgContent += '<polyline class="connector-line" points="' + sx + ',' + sy + ' ' + mx + ',' + my + ' ' + d.x + ',' + d.y + '" />';
      svgContent += '<circle class="connector-dot" cx="' + d.x + '" cy="' + d.y + '" r="3.5" />';
    }
    // Top-right
    {
      const r = anns.tr.getBoundingClientRect();
      const sx = r.left - hRect.left - 15, sy = r.top + r.height * 0.5 - hRect.top;
      const d = dots.tr, mx = sx - (sx - d.x) * 0.4, my = d.y;
      svgContent += '<polyline class="connector-line" points="' + sx + ',' + sy + ' ' + mx + ',' + my + ' ' + d.x + ',' + d.y + '" />';
      svgContent += '<circle class="connector-dot" cx="' + d.x + '" cy="' + d.y + '" r="3.5" />';
    }
    // Bottom-right
    {
      const r = anns.br.getBoundingClientRect();
      const sx = r.left - hRect.left - 15, sy = r.top + r.height * 0.5 - hRect.top;
      const d = dots.br;
      svgContent += '<polyline class="connector-line" points="' + sx + ',' + sy + ' ' + d.x + ',' + d.y + '" />';
      svgContent += '<circle class="connector-dot" cx="' + d.x + '" cy="' + d.y + '" r="3.5" />';
    }

    svg.innerHTML = svgContent;
    const lines = svg.querySelectorAll('.connector-line');
    lines.forEach(function(line) {
      var len = line.getTotalLength();
      line.style.strokeDasharray = '5 5';
      line.style.strokeDashoffset = len;
    });
    svg.querySelectorAll('.connector-dot').forEach(function(dot) { dot.style.opacity = '0'; });
    return { lines: lines, dots: svg.querySelectorAll('.connector-dot') };
  }

  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      document.body.classList.add('is-ready');
      var connectorEls = buildConnectors();

      var tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.fromTo('#nav', { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.26 }, 0);
      tl.fromTo('#heroParticles', { opacity: 0 }, { opacity: 1, duration: 1.2 }, 0);
      tl.fromTo('#bgEthan', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.48 }, 0.14);
      tl.fromTo('#bgTouch', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.48 }, 0.28);

      if (connectorEls.lines && connectorEls.lines.length) {
        tl.to('#connectors', { opacity: 1, duration: 0.01 }, 0.34);
        connectorEls.lines.forEach(function(line, i) {
          tl.to(line, { strokeDashoffset: 0, duration: 0.42, ease: 'power2.out' }, 0.34 + i * 0.04);
        });
        tl.to(connectorEls.dots, { opacity: 1, stagger: 0.05, duration: 0.18, ease: 'power2.out' }, 0.68);
      }

      tl.fromTo('#portrait', { opacity: 0, scale: 0.94 }, {
        opacity: 1, scale: 1, duration: 0.5,
        onComplete: function() {
          document.getElementById('portrait').classList.add('float-active', 'glow-active');
        }
      }, 0.50);

      var descOrder = ['#ann-tl', '#ann-tr', '#ann-br', '#ann-bl'];
      var descStart = 0.70, descGap = 0.09, bodyDelay = 0.08;
      descOrder.forEach(function(sel, i) {
        var t = descStart + i * descGap;
        tl.fromTo(sel + ' .annotation__icon', { opacity: 0, y: 8 }, { opacity: 1, visibility: 'visible', y: 0, duration: 0.2 }, t);
        tl.fromTo(sel + ' .annotation__title', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.24 }, t + 0.05);
        tl.fromTo(sel + ' .annotation__text', { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.28 }, t + bodyDelay);
      });

      tl.fromTo('#heroCorner', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.26 }, 1.10);

      gsap.to('#bgEthan', { y: -4, duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2 });
      gsap.to('#bgTouch', { y: 4, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.5 });
    });
  });

  // Rebuild connectors on resize (static, no re-animation)
  window.addEventListener('resize', function() {
    var svg = document.getElementById('connectorSvg');
    var portrait = document.getElementById('portrait');
    if (!svg || !portrait || window.innerWidth < 968) { svg.innerHTML = ''; return; }
    var hero = document.querySelector('.hero');
    var hRect = hero.getBoundingClientRect();
    var pRect = portrait.getBoundingClientRect();
    var pCx = pRect.left + pRect.width / 2 - hRect.left;
    var pCy = pRect.top + pRect.height / 2 - hRect.top;
    var pW = pRect.width / 2, pH = pRect.height / 2;
    var dots = {
      tl: { x: pCx - pW - 12, y: pCy - pH * 0.3 },
      bl: { x: pCx - pW - 10, y: pCy + pH * 0.35 },
      tr: { x: pCx + pW + 12, y: pCy - pH * 0.25 },
      br: { x: pCx + pW + 10, y: pCy + pH * 0.2 },
    };
    var anns = { tl: document.getElementById('ann-tl'), bl: document.getElementById('ann-bl'), tr: document.getElementById('ann-tr'), br: document.getElementById('ann-br') };
    var s = '';
    [['tl','right'], ['bl','right'], ['tr','left'], ['br','left']].forEach(function(pair) {
      var key = pair[0], side = pair[1];
      var el = anns[key], r = el.getBoundingClientRect(), d = dots[key];
      var sx = side === 'right' ? r.right - hRect.left + 15 : r.left - hRect.left - 15;
      var sy = r.top + r.height * 0.5 - hRect.top;
      if (key === 'br') {
        s += '<polyline class="connector-line" points="' + sx + ',' + sy + ' ' + d.x + ',' + d.y + '" style="stroke-dashoffset:0"/>';
      } else {
        var mx = side === 'right' ? sx + (d.x - sx) * 0.4 : sx - (sx - d.x) * 0.4;
        var my = key.startsWith('b') ? sy : d.y;
        s += '<polyline class="connector-line" points="' + sx + ',' + sy + ' ' + mx + ',' + my + ' ' + d.x + ',' + d.y + '" style="stroke-dashoffset:0"/>';
      }
      s += '<circle class="connector-dot" cx="' + d.x + '" cy="' + d.y + '" r="3.5"/>';
    });
    svg.innerHTML = s;
    svg.querySelectorAll('.connector-line').forEach(function(l) { l.style.strokeDasharray = '5 5'; });
    document.getElementById('connectors').style.opacity = '1';
  });
})();

// ===========================
// HERO PARTICLE SYSTEM
// ===========================
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var canvas = document.getElementById('heroParticles');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var hero = document.querySelector('.hero');
  var COLORS = [
    { r: 183, g: 201, b: 195 }, { r: 220, g: 202, b: 190 },
    { r: 215, g: 221, b: 201 }, { r: 220, g: 210, b: 228 },
    { r: 245, g: 228, b: 210 },
  ];
  var particles = [], isVisible = true;
  function resize() { canvas.width = hero.offsetWidth; canvas.height = hero.offsetHeight; }
  function create() {
    var n = window.innerWidth < 768 ? 20 : 40;
    particles = [];
    for (var i = 0; i < n; i++) {
      var c = COLORS[Math.floor(Math.random() * COLORS.length)];
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.15,
        o: Math.random() * 0.2 + 0.03, od: Math.random() > 0.5 ? 1 : -1, c: c,
      });
    }
  }
  function loop() {
    if (!isVisible) { requestAnimationFrame(loop); return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx; p.y += p.vy;
      p.o += p.od * 0.0008;
      if (p.o > 0.25) p.od = -1;
      if (p.o < 0.02) p.od = 1;
      if (p.x < -5) p.x = canvas.width + 5;
      if (p.x > canvas.width + 5) p.x = -5;
      if (p.y < -5) p.y = canvas.height + 5;
      if (p.y > canvas.height + 5) p.y = -5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + p.c.r + ',' + p.c.g + ',' + p.c.b + ',' + p.o + ')';
      ctx.fill();
    }
    requestAnimationFrame(loop);
  }
  new IntersectionObserver(function(e) { isVisible = e[0].isIntersecting; }, { threshold: 0.1 }).observe(hero);
  resize(); create(); loop();
  window.addEventListener('resize', function() { resize(); create(); });
})();

// ===========================
// NAV SCROLL EFFECT
// ===========================
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle with backdrop
const navBackdrop = document.createElement('div');
navBackdrop.className = 'nav__backdrop';
document.body.appendChild(navBackdrop);

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navBackdrop.classList.toggle('open');
});

navBackdrop.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navBackdrop.classList.remove('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navBackdrop.classList.remove('open');
  });
});

// ===========================
// ACTIVE NAV LINK ON SCROLL
// ===========================
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a');

function updateActiveNav() {
  const scrollY = window.scrollY + 200;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

// ===========================
// SCROLL-TRIGGERED FADE-IN
// ===========================
const fadeEls = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

fadeEls.forEach(el => fadeObserver.observe(el));

// ===========================
// CONTACT FORM (Netlify Forms)
// ===========================
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

// ===========================
// CASE STUDY MODALS
// ===========================
function initCaseStudyModals() {
  // Open modal when clicking or pressing Enter/Space on a work card
  document.querySelectorAll('[data-case-study]').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
    card.addEventListener('click', () => {
      const id = card.dataset.caseStudy;
      const modal = document.getElementById('csModal-' + id);
      if (modal) {
        modal.classList.add('open');
        document.body.classList.add('modal-open');
        // Reset scroll position of modal content
        const content = modal.querySelector('.cs-modal__content');
        if (content) content.scrollTop = 0;
      }
    });
  });

  // Close modal — close button, overlay click, or Escape key
  document.querySelectorAll('.cs-modal').forEach(modal => {
    const closeBtn = modal.querySelector('.cs-modal__close');
    const overlay = modal.querySelector('.cs-modal__overlay');

    function closeModal() {
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');
      // Reset any active tag filters
      resetTagFilter(modal);
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  });

  // Tag filtering system
  document.querySelectorAll('.cs-modal').forEach(modal => {
    const tags = modal.querySelectorAll('.cs-tag');
    const tagsContainer = modal.querySelector('.cs-tags');
    const body = modal.querySelector('.cs-body');
    const filterHint = modal.querySelector('.cs-filter-hint');
    const allHighlightable = modal.querySelectorAll('[data-tags]');
    let activeTag = null;

    function resetTagFilter() {
      activeTag = null;
      tags.forEach(t => t.classList.remove('active'));
      if (tagsContainer) tagsContainer.classList.remove('filtering');
      if (body) body.classList.remove('filtering');
      if (filterHint) filterHint.classList.remove('visible');
      allHighlightable.forEach(el => el.classList.remove('highlighted'));
    }

    // Store reset function on modal for external access
    modal._resetTagFilter = resetTagFilter;

    tags.forEach(tag => {
      tag.addEventListener('click', () => {
        const tagKey = tag.dataset.tag;

        // Toggle off if clicking same tag
        if (activeTag === tagKey) {
          resetTagFilter();
          return;
        }

        // Clear previous
        tags.forEach(t => t.classList.remove('active'));
        allHighlightable.forEach(el => el.classList.remove('highlighted'));

        // Set new active
        activeTag = tagKey;
        tag.classList.add('active');
        tagsContainer.classList.add('filtering');
        body.classList.add('filtering');
        if (filterHint) filterHint.classList.add('visible');

        // Highlight matching elements
        const modalContent = modal.querySelector('.cs-modal__content');
        let firstMatch = null;
        allHighlightable.forEach(el => {
          const elTags = el.dataset.tags.split(' ');
          if (elTags.includes(tagKey)) {
            el.classList.add('highlighted');
            if (!firstMatch) firstMatch = el;
          }
        });

        // Scroll to first match within modal content
        if (firstMatch && modalContent) {
          firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });

    // Click highlighted element to reset
    allHighlightable.forEach(el => {
      el.addEventListener('click', () => {
        if (el.classList.contains('highlighted')) {
          resetTagFilter();
        }
      });
    });
  });
}

// Helper for external close calls
function resetTagFilter(modal) {
  if (modal._resetTagFilter) modal._resetTagFilter();
}

initCaseStudyModals();

// ===========================
// TESTIMONIALS CAROUSEL
// ===========================
(function() {
  const carousel = document.getElementById('testimonialCarousel');
  const track = document.getElementById('testimonialTrack');
  if (!carousel || !track) return;

  let autoScrollSpeed = 0.5;
  let isUserInteracting = false;
  let isVisible = true;
  let resumeTimeout = null;

  // Pause when off-screen
  const visObserver = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0 });
  visObserver.observe(carousel);

  function autoScroll() {
    if (!isUserInteracting && isVisible) {
      carousel.scrollLeft += autoScrollSpeed;
      const halfWidth = track.scrollWidth / 2;
      if (carousel.scrollLeft >= halfWidth) {
        carousel.scrollLeft -= halfWidth;
      }
    }
    requestAnimationFrame(autoScroll);
  }
  requestAnimationFrame(autoScroll);

  function pauseAutoScroll() {
    isUserInteracting = true;
    clearTimeout(resumeTimeout);
  }

  function scheduleResume() {
    clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => { isUserInteracting = false; }, 3000);
  }

  // Mouse drag
  let isDragging = false, startX = 0, scrollStart = 0;
  carousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX;
    scrollStart = carousel.scrollLeft;
    pauseAutoScroll();
    e.preventDefault();
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    carousel.scrollLeft = scrollStart - (e.pageX - startX);
  });
  window.addEventListener('mouseup', () => {
    if (isDragging) { isDragging = false; scheduleResume(); }
  });

  // Touch
  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
    scrollStart = carousel.scrollLeft;
    pauseAutoScroll();
  }, { passive: true });
  carousel.addEventListener('touchmove', (e) => {
    carousel.scrollLeft = scrollStart - (e.touches[0].pageX - startX);
  }, { passive: true });
  carousel.addEventListener('touchend', () => { scheduleResume(); });

  // Wheel
  carousel.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) > 0 || Math.abs(e.deltaY) > 0) {
      e.preventDefault();
      carousel.scrollLeft += e.deltaY || e.deltaX;
      pauseAutoScroll();
      scheduleResume();
    }
  }, { passive: false });

  // Seamless loop on manual scroll
  carousel.addEventListener('scroll', () => {
    const halfWidth = track.scrollWidth / 2;
    if (carousel.scrollLeft >= halfWidth) carousel.scrollLeft -= halfWidth;
    else if (carousel.scrollLeft <= 0) carousel.scrollLeft += halfWidth;
  });

})();

// ===========================
// CONTACT FORM (Netlify Forms)
// ===========================
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    const formData = new FormData(contactForm);
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    });

    if (response.ok) {
      contactForm.style.display = 'none';
      formSuccess.style.display = 'block';
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
    alert('Something went wrong. Please try again or email me directly at hello@ethantouch.com');
  }
});
