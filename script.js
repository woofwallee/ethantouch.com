// ===========================
// REGISTER GSAP PLUGINS
// ===========================
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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

      // Massive name — slides in from opposite sides
      tl.set('#heroName', { opacity: 1 }, 0);
      tl.fromTo('#heroNameLine1', { opacity: 0, x: -50 }, {
        opacity: 1, x: 0, duration: 0.8, ease: 'power3.out'
      }, 0.1);
      tl.fromTo('#heroNameLine2', { opacity: 0, x: 50 }, {
        opacity: 1, x: 0, duration: 0.8, ease: 'power3.out'
      }, 0.25);

      // Portrait scales in overlapping the name
      tl.fromTo('#portrait', { opacity: 0, scale: 0.88 }, {
        opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out'
      }, 0.4);

      tl.fromTo('#heroHeadline', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 }, 0.75);

      tl.fromTo('#heroSkillsRow', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.9);

      var skillOrder = ['#skill-tl', '#skill-tr', '#skill-ml', '#skill-mr', '#skill-bl', '#skill-br'];
      skillOrder.forEach(function(sel, i) {
        tl.fromTo(sel, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3 }, 0.95 + i * 0.08);
      });

      tl.fromTo('#heroCorner', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, 1.5);

    });
  });
})();

// (Horizontal scroll removed — work section now uses static grid layout)

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

function openMobileNav() {
  navLinks.classList.add('open');
  navBackdrop.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  navLinks.setAttribute('aria-hidden', 'false');
}

function closeMobileNav() {
  navLinks.classList.remove('open');
  navBackdrop.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navLinks.setAttribute('aria-hidden', 'true');
}

navToggle.addEventListener('click', () => {
  if (navLinks.classList.contains('open')) {
    closeMobileNav();
  } else {
    openMobileNav();
  }
});

navBackdrop.addEventListener('click', () => {
  closeMobileNav();
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    closeMobileNav();
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
  threshold: 0.05,
  rootMargin: '0px 0px 0px 0px'
});

fadeEls.forEach(el => fadeObserver.observe(el));

// Instantly reveal fade-in elements when nav links are clicked
navLinks.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    const targetId = link.getAttribute('href').slice(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.querySelectorAll('.fade-in').forEach(el => {
        el.classList.add('visible');
      });
    }
  });
});

// ===========================
// CONTACT FORM (Formspark)
// ===========================
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

// ===========================
// FOCUS TRAP UTILITY
// ===========================
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function trapFocus(modal) {
  function handleKeydown(e) {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(modal.querySelectorAll(FOCUSABLE_SELECTOR)).filter(el => el.offsetParent !== null);
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
  modal._trapFocusHandler = handleKeydown;
  document.addEventListener('keydown', handleKeydown);
}

function releaseFocusTrap(modal) {
  if (modal._trapFocusHandler) {
    document.removeEventListener('keydown', modal._trapFocusHandler);
    delete modal._trapFocusHandler;
  }
}

// ===========================
// CASE STUDY MODALS
// ===========================
let csModalTrigger = null;

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
        csModalTrigger = card;
        modal.classList.add('open');
        document.body.classList.add('modal-open');
        // Reset scroll position of modal content
        const content = modal.querySelector('.cs-modal__content') || modal.querySelector('.cs-fullpage');
        if (content) content.scrollTop = 0;
        // Focus management
        const closeBtn = modal.querySelector('.cs-modal__close');
        if (closeBtn) closeBtn.focus();
        trapFocus(modal);
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
      releaseFocusTrap(modal);
      // Return focus to trigger
      if (csModalTrigger) {
        csModalTrigger.focus();
        csModalTrigger = null;
      }
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

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
// CASE STUDY TOC — SCROLL TRACKING
// ===========================
(function initCSToc() {
  document.querySelectorAll('.cs-modal--fullpage').forEach(function(modal) {
    var toc = modal.querySelector('.cs-toc');
    if (!toc) return;

    var tocItems = toc.querySelectorAll('.cs-toc__item');
    var scrollContainer = modal.querySelector('.cs-fullpage');
    var sections = modal.querySelectorAll('[data-section]');

    // Click to scroll
    tocItems.forEach(function(item) {
      item.addEventListener('click', function() {
        var target = modal.querySelector('[data-section="' + item.dataset.toc + '"]');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Scroll tracking with IntersectionObserver
    if (sections.length && scrollContainer) {
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var sectionId = entry.target.dataset.section;
            tocItems.forEach(function(item) {
              item.classList.toggle('cs-toc__item--active', item.dataset.toc === sectionId);
            });
          }
        });
      }, {
        root: scrollContainer,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      });

      sections.forEach(function(section) { observer.observe(section); });
    }
  });
})();

// ===========================
// CREDENTIAL VIEWER MODAL
// ===========================
(function() {
  var modal = document.getElementById('credModal');
  var overlay = modal.querySelector('.cred-modal__overlay');
  var closeBtn = modal.querySelector('.cred-modal__close');
  var img = document.getElementById('credModalImg');
  var title = document.getElementById('credModalTitle');
  var credTrigger = null;

  function openCredModal(imgSrc, name, triggerEl) {
    credTrigger = triggerEl;
    title.textContent = name;
    img.src = imgSrc;
    img.alt = name + ' certificate';
    modal.classList.add('open');
    document.body.classList.add('modal-open');
    closeBtn.focus();
    trapFocus(modal);
  }

  function closeCredModal() {
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
    img.src = '';
    releaseFocusTrap(modal);
    if (credTrigger) {
      credTrigger.focus();
      credTrigger = null;
    }
  }

  document.querySelectorAll('[data-cred-img]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openCredModal(btn.getAttribute('data-cred-img'), btn.getAttribute('data-cred-title'), btn);
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

// Cursor-tracking glow removed — cards use clean flat surfaces

// ===========================
// CONTACT FORM (Netlify Forms)
// ===========================
// ===========================
// FORM VALIDATION — aria-invalid + error messages
// ===========================
function clearFieldError(field) {
  field.removeAttribute('aria-invalid');
  var errId = field.id + '-error';
  var existing = document.getElementById(errId);
  if (existing) existing.remove();
  field.removeAttribute('aria-describedby');
}

function setFieldError(field, message) {
  field.setAttribute('aria-invalid', 'true');
  var errId = field.id + '-error';
  var existing = document.getElementById(errId);
  if (!existing) {
    var errEl = document.createElement('span');
    errEl.id = errId;
    errEl.className = 'form__error';
    errEl.style.cssText = 'display:block;color:#FAE1C5;font-size:0.75rem;margin-top:0.35rem;opacity:0.85;';
    field.parentNode.appendChild(errEl);
  }
  document.getElementById(errId).textContent = message;
  field.setAttribute('aria-describedby', errId);
}

function validateContactForm() {
  var valid = true;
  var fields = contactForm.querySelectorAll('[required]');
  fields.forEach(function(field) {
    clearFieldError(field);
    if (!field.value.trim()) {
      setFieldError(field, 'This field is required.');
      valid = false;
    } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
      setFieldError(field, 'Please enter a valid email address.');
      valid = false;
    }
  });
  return valid;
}

// Clear errors on input
contactForm.querySelectorAll('[required]').forEach(function(field) {
  field.addEventListener('input', function() { clearFieldError(field); });
});

function playCelebration() {
  const overlay = document.getElementById('celebration-overlay');
  const video = document.getElementById('celebration-video');
  overlay.style.display = 'block';
  video.currentTime = 0;
  video.play();
  video.onended = () => { overlay.style.display = 'none'; };
}

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateContactForm()) return;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    const response = await fetch('https://submit-form.com/AtVPTbBQF', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      contactForm.style.display = 'none';
      formSuccess.style.display = 'block';
      playCelebration();
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Message';
    alert('Something went wrong. Please try again or email me directly at hello@ethantouch.com');
  }
});
