'use strict';

// --- Navigation: scroll frosting + hamburger ---
const nav = document.getElementById('nav');
const hamburger = document.getElementById('navHamburger');
const navMenu = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navMenu.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// --- Active nav highlight ---
const pageSections = document.querySelectorAll('main section[id]');
const allNavLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      allNavLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

pageSections.forEach(section => sectionObserver.observe(section));

// ── Carousel (coverflow + 4-per-view grid) ──────────────────────────
function initCarousel(wrapper) {
  const track = wrapper.querySelector('.carousel-track');
  if (!track) return;
  const items = Array.from(track.querySelectorAll('.carousel-item'));
  const count = items.length;
  if (count === 0) return;
  let current = 0;

  const perView = parseInt(wrapper.dataset.perView) || 0;

  function bindButtonsAndKeys(prevFn, nextFn) {
    const prevBtn = wrapper.querySelector('.carousel-btn--prev');
    const nextBtn = wrapper.querySelector('.carousel-btn--next');
    if (prevBtn) prevBtn.addEventListener('click', prevFn);
    if (nextBtn) nextBtn.addEventListener('click', nextFn);
    wrapper.setAttribute('tabindex', '0');
    wrapper.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prevFn(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); nextFn(); }
    });
  }

  if (perView > 0) {
    // ── Infinite sliding track — [pre-clones][originals][post-clones] ──
    const n = count;

    // Build clone sets: prepend one copy before, append one copy after
    items.forEach(el => track.appendChild(el.cloneNode(true)));
    [...items].reverse().forEach(el => track.insertBefore(el.cloneNode(true), track.firstChild));

    const all = Array.from(track.querySelectorAll('.carousel-item'));
    // all[0..n-1] = pre-clones, all[n..2n-1] = originals, all[2n..3n-1] = post-clones

    let px = 0, curIdx = n;
    let normTimer;

    const gp  = () => parseFloat(getComputedStyle(track).gap) || 16;
    const xOf = i => { const g = gp(); let x = 0; for (let j = 0; j < i; j++) x += all[j].offsetWidth + g; return x; };
    const sw  = () => xOf(n); // width of one full set of items

    const setTr = anim => {
      track.style.transition = anim ? 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)' : 'none';
      track.style.transform  = `translateX(${px}px)`;
    };

    // After snap, silently teleport into the real-items zone if in clone zone
    const norm = () => {
      const s = sw();
      if (!s) return;
      while (px > -s)      { px -= s; curIdx += n; }
      while (px <= -2 * s) { px += s; curIdx -= n; }
      setTr(false);
    };

    const goTo = (i, anim = true) => {
      clearTimeout(normTimer);
      curIdx = i; px = -xOf(i);
      setTr(anim);
      if (anim) normTimer = setTimeout(norm, 450);
    };

    // Find the nearest item-boundary pixel offset across all 3n items
    const nearSnap = () => {
      const g = gp();
      let bestPx = px, bestD = Infinity, bestI = curIdx, x = 0;
      for (let i = 0; i < all.length; i++) {
        const d = Math.abs(px + x);
        if (d < bestD) { bestD = d; bestPx = -x; bestI = i; }
        x += all[i].offsetWidth + g;
      }
      return [bestPx, bestI];
    };

    const snap = () => {
      const [p, i] = nearSnap();
      clearTimeout(normTimer);
      curIdx = i; px = p;
      setTr(true);
      normTimer = setTimeout(norm, 450);
    };

    const prev = () => { if (curIdx > 0) goTo(curIdx - 1); };
    const next = () => { if (curIdx < all.length - 1) goTo(curIdx + 1); };
    bindButtonsAndKeys(prev, next);

    let snapTimer;
    wrapper.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const s = sw() || 1;
      px = Math.max(-3 * s, Math.min(0, px - delta));
      setTr(false);
      clearTimeout(snapTimer);
      snapTimer = setTimeout(snap, 150);
    }, { passive: false });

    // Init after images have loaded (widths depend on loaded images)
    // Click-to-expand: track active real index so all three copies stay in sync
    let activeRealIdx = -1;
    const syncActive = () => {
      all.forEach((el, i) => el.classList.toggle('active', (i % n) === activeRealIdx));
    };
    wrapper.addEventListener('click', (e) => {
      const item = e.target.closest('.carousel-item');
      if (!item) return;
      const i = all.indexOf(item);
      if (i === -1) return;
      const realIdx = i % n;
      activeRealIdx = activeRealIdx === realIdx ? -1 : realIdx;
      syncActive();
    });

    // Pin each item's width to match its image's natural aspect ratio at 420px height.
    // Using naturalWidth/naturalHeight avoids layout-timing issues with offsetWidth.
    const IMG_HEIGHT = 420;
    const fixWidths = () => {
      all.forEach(el => {
        const img = el.querySelector('img');
        if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
          el.style.width = Math.round(img.naturalWidth * (IMG_HEIGHT / img.naturalHeight)) + 'px';
        }
      });
    };

    // Debounce init: goTo fires once after all image-load events settle so
    // xOf(n) is fully computed before positioning (avoids starting off-center).
    let ready = false, userScrolled = false, initTimer;
    const tryInit = () => {
      fixWidths();
      clearTimeout(initTimer);
      initTimer = setTimeout(() => {
        if (sw() > 0 && !userScrolled) { goTo(n, false); ready = true; }
      }, 60);
    };
    all.forEach(el => {
      const img = el.querySelector('img');
      if (img) { if (img.complete) tryInit(); else img.addEventListener('load', tryInit); }
    });
    tryInit();

    wrapper.addEventListener('wheel', () => { userScrolled = true; }, { passive: true, once: true });
    window.addEventListener('resize', () => { if (ready) { fixWidths(); goTo(n, false); } });
    return;
  }

  // ── Coverflow mode — delta accumulation, ~60px per item step ──
  function positionItems() {
    const gap = Math.min(300, wrapper.offsetWidth * 0.22);
    items.forEach((item, i) => {
      let offset = i - current;
      if (offset > count / 2)  offset -= count;
      if (offset < -count / 2) offset += count;

      const abs     = Math.abs(offset);
      const scale   = abs === 0 ? 1 : 0.85;
      const opacity = abs === 0 ? 1 : (abs === 1 ? 0.65 : 0);
      const tx      = offset * gap;

      item.style.transform = `translate(calc(-50% + ${tx}px), -50%) scale(${scale})`;
      item.style.opacity   = opacity;
      item.style.zIndex    = 10 - abs;
    });
  }

  function prev() { current = (current - 1 + count) % count; positionItems(); }
  function next() { current = (current + 1) % count; positionItems(); }

  bindButtonsAndKeys(prev, next);

  let scrollAccum = 0;
  const STEP = 60;
  wrapper.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    scrollAccum += delta;
    while (scrollAccum >= STEP)  { current = (current + 1) % count; scrollAccum -= STEP; positionItems(); }
    while (scrollAccum <= -STEP) { current = (current - 1 + count) % count; scrollAccum += STEP; positionItems(); }
  }, { passive: false });

  positionItems();
  window.addEventListener('resize', positionItems);
}

document.querySelectorAll('.carousel-wrapper').forEach(initCarousel);

// ── Brand Work Expandable Panels ────────────────────────────────────
function initBrandPanels() {
  const grid   = document.querySelector('.brand-grid');
  if (!grid) return;
  const panels = Array.from(grid.querySelectorAll('.brand-panel'));

  function activatePanel(panel) {
    panels.forEach(p => p.classList.remove('expanded', 'hidden'));
    grid.classList.remove('has-expanded');

    panel.classList.add('expanded');
    grid.classList.add('has-expanded');
    panels.forEach(p => {
      if (p !== panel) p.classList.add('hidden');
    });
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function collapseAll() {
    panels.forEach(p => p.classList.remove('expanded', 'hidden'));
    grid.classList.remove('has-expanded');
  }

  panels.forEach(panel => {
    panel.addEventListener('click', () => {
      if (panel.classList.contains('expanded')) {
        collapseAll();
      } else {
        activatePanel(panel);
      }
    });

    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (panel.classList.contains('expanded')) {
          collapseAll();
        } else {
          activatePanel(panel);
        }
      }
    });
  });
}

initBrandPanels();
