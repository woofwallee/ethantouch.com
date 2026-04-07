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

      tl.fromTo('#heroHeadline', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 }, 0.70);

      tl.fromTo('#heroSkillsRow', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.85);

      var skillOrder = ['#skill-tl', '#skill-tr', '#skill-ml', '#skill-mr', '#skill-bl', '#skill-br'];
      skillOrder.forEach(function(sel, i) {
        tl.fromTo(sel, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3 }, 0.90 + i * 0.08);
      });

      tl.fromTo('#heroCorner', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, 1.4);

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

// ===========================
// CREDENTIAL VIEWER MODAL
// ===========================
(function() {
  var modal = document.getElementById('credModal');
  var overlay = modal.querySelector('.cred-modal__overlay');
  var closeBtn = modal.querySelector('.cred-modal__close');
  var img = document.getElementById('credModalImg');
  var title = document.getElementById('credModalTitle');

  function openCredModal(imgSrc, name) {
    title.textContent = name;
    img.src = imgSrc;
    img.alt = name + ' certificate';
    modal.classList.add('open');
    document.body.classList.add('modal-open');
  }

  function closeCredModal() {
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
    img.src = '';
  }

  document.querySelectorAll('[data-cred-img]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openCredModal(btn.getAttribute('data-cred-img'), btn.getAttribute('data-cred-title'));
    });
  });

  closeBtn.addEventListener('click', closeCredModal);
  overlay.addEventListener('click', closeCredModal);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeCredModal();
    }
  });
})();

// ===========================
// LIQUID GLASS v2 — INTERNAL ILLUMINATION TRACKING
// Smoothed cursor-following glow with edge-aware specular
// ===========================
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.work__card, .testimonial-card').forEach(function(card) {
    var currentX = 50, currentY = 50;
    var targetX = 50, targetY = 50;
    var rafId = null;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function animate() {
      currentX = lerp(currentX, targetX, 0.12);
      currentY = lerp(currentY, targetY, 0.12);
      card.style.setProperty('--glow-x', currentX + '%');
      card.style.setProperty('--glow-y', currentY + '%');

      if (Math.abs(currentX - targetX) > 0.1 || Math.abs(currentY - targetY) > 0.1) {
        rafId = requestAnimationFrame(animate);
      } else {
        rafId = null;
      }
    }

    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width) * 100;
      targetY = ((e.clientY - rect.top) / rect.height) * 100;
      if (!rafId) rafId = requestAnimationFrame(animate);
    });

    card.addEventListener('mouseleave', function() {
      targetX = 50;
      targetY = 50;
      if (!rafId) rafId = requestAnimationFrame(animate);
    });
  });
})();

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
