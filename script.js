// ===========================
// HERO ANIMATION — COORDINATED GSAP TIMELINE
// ===========================
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      document.body.classList.add('is-ready');

      var tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.fromTo('#nav', { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.26 }, 0);
      tl.fromTo('#heroParticles', { opacity: 0 }, { opacity: 1, duration: 1.2 }, 0);

      tl.fromTo('#portrait', { opacity: 0, scale: 0.94 }, {
        opacity: 1, scale: 1, duration: 0.5,
        onComplete: function() {
          document.getElementById('portrait').classList.add('float-active', 'glow-active');
        }
      }, 0.50);

      var descOrder = ['#ann-tl', '#ann-tr', '#ann-br', '#ann-bl'];
      var descStart = 0.70, descGap = 0.12, bodyDelay = 0.10;
      descOrder.forEach(function(sel, i) {
        var t = descStart + i * descGap;
        tl.fromTo(sel, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35 }, t);
        tl.fromTo(sel + ' .annotation__text', { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.28 }, t + bodyDelay);
      });

      tl.fromTo('#heroCorner', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.26 }, 1.20);

    });
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
    var n = window.innerWidth < 768 ? 30 : 60;
    particles = [];
    for (var i = 0; i < n; i++) {
      var c = COLORS[Math.floor(Math.random() * COLORS.length)];
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        r: Math.random() * 2.2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.2,
        o: Math.random() * 0.3 + 0.05, od: Math.random() > 0.5 ? 1 : -1, c: c,
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
      if (p.o > 0.35) p.od = -1;
      if (p.o < 0.03) p.od = 1;
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

// Testimonials: static staggered grid — no JS needed

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
