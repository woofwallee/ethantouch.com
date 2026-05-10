/* ===========================
   JOURNAL — Side-panel reader + scroll reveals + GA4
   Self-contained. Loaded on all /journal/ pages.
   =========================== */

(function () {
  'use strict';

  var isIndexPage = !!document.querySelector('.journal-page');
  var isPostPage  = !!document.querySelector('.journal-post');

  // ===========================
  // Scroll reveals
  // ===========================
  function initReveals() {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var selectors = isIndexPage
      ? ['.journal-header', '.year-group', '.journal-entry']
      : [
          '.journal-post__header',
          '.journal-post__body > p',
          '.journal-post__body > h2',
          '.journal-post__body > h3',
          '.journal-post__body > blockquote',
          '.journal-post__body > ul',
          '.journal-post__body > ol',
          '.journal-post__body > hr',
          '.journal-post__body > img',
        ];

    var targets = document.querySelectorAll(selectors.join(','));

    if (prefersReduced || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    targets.forEach(function (el) { el.classList.add('reveal'); });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0.05 });

    targets.forEach(function (el) { observer.observe(el); });
  }

  // ===========================
  // Side panel (index only)
  // ===========================
  function initPanel() {
    if (!isIndexPage) return;

    var panel     = document.getElementById('journalPanel');
    var overlay   = document.getElementById('panelOverlay');
    var closeBtn  = document.getElementById('panelClose');
    var panelInner = document.getElementById('panelInner');
    if (!panel || !overlay || !closeBtn || !panelInner) return;

    var loadId = 0;

    function openPanel(url, titleHint) {
      var id = ++loadId;

      panel.classList.add('is-open');
      overlay.classList.add('is-visible');
      panel.setAttribute('aria-hidden', 'false');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      panel.scrollTop = 0;

      history.pushState({ panelOpen: true, url: url }, titleHint || '', url);

      // Loading state
      panelInner.innerHTML =
        '<div class="panel-loading">' +
          '<span class="panel-loading-dot"></span>' +
          '<span class="panel-loading-dot"></span>' +
          '<span class="panel-loading-dot"></span>' +
        '</div>';

      closeBtn.focus();

      fetch(url)
        .then(function (res) { return res.text(); })
        .then(function (html) {
          if (id !== loadId) return; // stale — another entry was clicked

          var doc   = new DOMParser().parseFromString(html, 'text/html');
          var meta  = doc.querySelector('.journal-post__meta');
          var title = doc.querySelector('.journal-post__title');
          var body  = doc.querySelector('.journal-post__body');

          var frag = document.createDocumentFragment();

          if (meta) {
            var metaEl = document.createElement('div');
            metaEl.className = 'panel-meta';
            metaEl.innerHTML = meta.innerHTML;
            frag.appendChild(metaEl);
          }

          if (title) {
            var titleEl = document.createElement('h1');
            titleEl.className = 'panel-title';
            titleEl.textContent = title.textContent.trim();
            frag.appendChild(titleEl);
          }

          if (body) {
            var bodyEl = document.createElement('div');
            bodyEl.className = 'journal-post__body';
            bodyEl.innerHTML = body.innerHTML;
            frag.appendChild(bodyEl);
          }

          var fullLink = document.createElement('a');
          fullLink.href = url;
          fullLink.className = 'panel-full-link';
          fullLink.textContent = 'Open full page →';
          frag.appendChild(fullLink);

          panelInner.innerHTML = '';
          panelInner.appendChild(frag);

          // GA4 panel view
          if (typeof gtag === 'function') {
            gtag('event', 'panel_view', {
              content_group: 'Journal Post',
              page_location: url
            });
          }
        })
        .catch(function () {
          if (id !== loadId) return;
          panelInner.innerHTML =
            '<p style="font-style:italic;color:#999;padding:0.5rem 0">' +
              'Couldn’t load this post. ' +
              '<a href="' + url + '" style="color:#B84A1F;border-bottom:1px solid currentColor">' +
                'Open it directly →' +
              '</a>' +
            '</p>';
        });
    }

    function closePanel(pushHistory) {
      panel.classList.remove('is-open');
      overlay.classList.remove('is-visible');
      panel.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      loadId++; // cancel any in-flight fetch
      if (pushHistory !== false && history.state && history.state.panelOpen) {
        history.back();
      }
    }

    // Entry clicks
    document.querySelectorAll('.journal-entry').forEach(function (entry) {
      entry.addEventListener('click', function (e) {
        e.preventDefault();
        var url   = entry.getAttribute('href') || entry.dataset.url;
        var title = entry.dataset.title || '';
        if (url) openPanel(url, title);
      });
    });

    // Close button
    closeBtn.addEventListener('click', function () { closePanel(true); });

    // Overlay click
    overlay.addEventListener('click', function () { closePanel(true); });

    // Keyboard — Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-open')) {
        closePanel(true);
      }
    });

    // Browser back/forward
    window.addEventListener('popstate', function (e) {
      if (panel.classList.contains('is-open')) {
        closePanel(false); // don't call history.back() — browser already did
      }
    });
  }

  // ===========================
  // GA4 article engagement
  // Fires on direct post pages; also fires inside the panel via panel_view above.
  // ===========================
  function initArticleTracking() {
    var body = document.querySelector('.journal-post__body');
    if (!body) return;

    function fire(name, params) {
      if (typeof gtag === 'function') gtag('event', name, params);
    }

    var milestones = { 25: false, 50: false, 75: false, 100: false };

    function checkDepth() {
      var rect   = body.getBoundingClientRect();
      var height = body.offsetHeight;
      if (!height) return;
      var pct = Math.round(((window.innerHeight - rect.top) / height) * 100);
      [25, 50, 75, 100].forEach(function (m) {
        if (!milestones[m] && pct >= m) {
          milestones[m] = true;
          fire('scroll_depth', { depth_threshold: m, content_group: 'Journal Post' });
        }
      });
    }

    window.addEventListener('scroll', checkDepth, { passive: true });

    var footer = document.querySelector('.journal-post__footer');
    if (footer && 'IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          fire('article_complete', { content_group: 'Journal Post' });
          obs.disconnect();
        }
      }, { threshold: 0.5 });
      obs.observe(footer);
    }
  }

  // ===========================
  // Lenis smooth scroll (direct post pages only)
  // ===========================
  function initLenis() {
    if (!isPostPage) return;
    if (typeof Lenis === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var lenis = new Lenis({
      duration: 1.4,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      smoothTouch: false,
    });

    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  // ===========================
  // Init
  // ===========================
  function init() {
    initReveals();
    initPanel();
    initArticleTracking();
    initLenis();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
