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

// Portfolio sub-sections all map to the #portfolio nav link
const portfolioIds = new Set(['social-media', 'graphic-design', 'brand-work']);

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      allNavLinks.forEach(link => link.classList.remove('active'));
      const id = portfolioIds.has(entry.target.id) ? 'portfolio' : entry.target.id;
      const active = document.querySelector(`.nav-link[href="#${id}"]`);
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

    // Wheel scroll intentionally removed — navigate with arrow buttons only.

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
    let ready = false, initTimer;
    const tryInit = () => {
      fixWidths();
      clearTimeout(initTimer);
      initTimer = setTimeout(() => {
        if (sw() > 0) { goTo(n, false); ready = true; }
      }, 60);
    };
    all.forEach(el => {
      const img = el.querySelector('img');
      if (img) { if (img.complete) tryInit(); else img.addEventListener('load', tryInit); }
    });
    tryInit();

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
  const grid = document.querySelector('.brand-grid');
  if (!grid) return;
  const panels = Array.from(grid.querySelectorAll('.brand-panel'));
  const DUR = '0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

  // FLIP the entire panel from its old screen position to its new one,
  // while also animating its width. Each panel's starting position in the
  // grid (top-left, top-right, bottom-left, bottom-right) determines the
  // direction of the slide automatically.
  function flipPanel(panel, applyChanges) {
    const r0 = panel.getBoundingClientRect();
    const w0 = panel.offsetWidth;

    applyChanges();

    const r1 = panel.getBoundingClientRect();
    const dx = r0.left - r1.left;
    const dy = r0.top  - r1.top;

    panel.style.transition = 'none';
    panel.style.transform  = `translate(${dx}px, ${dy}px)`;
    panel.style.maxWidth   = w0 + 'px';
    panel.getBoundingClientRect(); // force reflow

    panel.style.transition = `transform ${DUR}, max-width ${DUR}`;
    panel.style.transform  = '';
    panel.style.maxWidth   = '100%';

    const onEnd = (e) => {
      if (e.propertyName !== 'transform') return;
      panel.removeEventListener('transitionend', onEnd);
      panel.style.transform  = '';
      panel.style.transition = '';
      panel.style.maxWidth   = '';
    };
    panel.addEventListener('transitionend', onEnd);
  }

  function activatePanel(panel) {
    flipPanel(panel, () => {
      panels.forEach(p => p.classList.remove('expanded', 'hidden'));
      grid.classList.remove('has-expanded');
      panel.classList.add('expanded');
      grid.classList.add('has-expanded');
      panels.forEach(p => { if (p !== panel) p.classList.add('hidden'); });
    });
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function collapseAll() {
    const expanded = panels.find(p => p.classList.contains('expanded'));
    if (!expanded) {
      panels.forEach(p => p.classList.remove('expanded', 'hidden'));
      grid.classList.remove('has-expanded');
      return;
    }

    const r0     = expanded.getBoundingClientRect();
    const w0     = expanded.offsetWidth;
    const others = panels.filter(p => p !== expanded);

    // Pre-set other panels to invisible before un-hiding them so they don't pop
    others.forEach(p => { p.style.transition = 'none'; p.style.opacity = '0'; });

    // Apply all class changes so the grid reflows to its final state
    expanded.classList.remove('expanded');
    panels.forEach(p => p.classList.remove('hidden'));
    grid.classList.remove('has-expanded');

    // Measure where the panel landed and its true column width after reflow
    const r1          = expanded.getBoundingClientRect();
    const targetWidth = expanded.offsetWidth; // actual 1fr column width in px
    const dx          = r0.left - r1.left;
    const dy          = r0.top  - r1.top;

    // FLIP: push the expanded panel back to its old (full-width) position
    expanded.style.zIndex     = '10';
    expanded.style.transition = 'none';
    expanded.style.transform  = `translate(${dx}px, ${dy}px)`;
    expanded.style.maxWidth   = w0 + 'px';

    expanded.getBoundingClientRect(); // single reflow commits all pending states

    // Mirror the open: slide position AND shrink width together
    expanded.style.transition = `transform ${DUR}, max-width ${DUR}`;
    expanded.style.transform  = '';
    expanded.style.maxWidth   = targetWidth + 'px';

    others.forEach(p => {
      p.style.transition = `opacity ${DUR}`;
      p.style.opacity    = '1';
    });

    const onEnd = (e) => {
      if (e.target !== expanded || e.propertyName !== 'transform') return;
      expanded.removeEventListener('transitionend', onEnd);
      expanded.style.transform  = '';
      expanded.style.transition = '';
      expanded.style.maxWidth   = '';
      expanded.style.zIndex     = '';
      others.forEach(p => { p.style.opacity = ''; p.style.transition = ''; });
    };
    expanded.addEventListener('transitionend', onEnd);
  }

  panels.forEach(panel => {
    panel.addEventListener('click', (e) => {
      if (e.target.closest('.brand-back-btn')) {
        e.stopPropagation();
        collapseAll();
        return;
      }
      if (!panel.classList.contains('expanded')) activatePanel(panel);
    });
    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!panel.classList.contains('expanded')) activatePanel(panel);
      }
    });
  });
}

initBrandPanels();

// ── Color2Me PDF slide viewer ────────────────────────────────────────
(function () {
  const panel    = document.querySelector('.brand-panel--c2m');
  const canvas   = document.getElementById('c2m-canvas');
  if (!panel || !canvas || typeof pdfjsLib === 'undefined') return;

  const ctx      = canvas.getContext('2d');
  const track    = canvas.parentElement; // .c2m-slide-track
  const prevBtn  = panel.querySelector('.c2m-prev');
  const nextBtn  = panel.querySelector('.c2m-next');
  const pageInfo = panel.querySelector('.c2m-page-info');
  let pdfDoc = null, pageNum = 1, animating = false;
  const SLIDE_DUR = 380; // ms

  function renderFirst(n) {
    pdfDoc.getPage(n).then(page => {
      const vp = page.getViewport({ scale: 2 });
      canvas.width = vp.width; canvas.height = vp.height;
      page.render({ canvasContext: ctx, viewport: vp }).promise.then(() => {
        pageInfo.textContent = `${n} / ${pdfDoc.numPages}`;
      });
    });
  }

  function slideTo(n, dir) {
    if (!pdfDoc || animating || n < 1 || n > pdfDoc.numPages) return;
    animating = true;

    const ease = `${SLIDE_DUR}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;

    // Render incoming slide first, then start both animations simultaneously — no gap
    pdfDoc.getPage(n).then(page => {
      const vp = page.getViewport({ scale: 2 });
      const inc = document.createElement('canvas');
      inc.width = vp.width; inc.height = vp.height;

      page.render({ canvasContext: inc.getContext('2d'), viewport: vp }).promise.then(() => {
        // Lock track height and absolutely position both canvases
        track.style.height = canvas.offsetHeight + 'px';
        canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:auto;';
        inc.style.cssText    = `position:absolute;top:0;left:0;width:100%;height:auto;transform:translateX(${dir==='next'?'100%':'-100%'});`;
        track.appendChild(inc);

        // Two rAFs: first registers initial state, second triggers transition
        requestAnimationFrame(() => requestAnimationFrame(() => {
          canvas.style.transition = `transform ${ease}`;
          canvas.style.transform  = dir === 'next' ? 'translateX(-100%)' : 'translateX(100%)';
          inc.style.transition    = `transform ${ease}`;
          inc.style.transform     = 'translateX(0)';

          setTimeout(() => {
            // Blit incoming onto main canvas, restore normal flow
            canvas.width = vp.width; canvas.height = vp.height;
            canvas.getContext('2d').drawImage(inc, 0, 0);
            canvas.removeAttribute('style');
            track.style.height = '';
            inc.remove();
            pageNum = n;
            pageInfo.textContent = `${n} / ${pdfDoc.numPages}`;
            animating = false;
          }, SLIDE_DUR + 20);
        }));
      });
    });
  }

  // Load PDF on first expand
  let loaded = false;
  new MutationObserver(() => {
    if (panel.classList.contains('expanded') && !loaded) {
      loaded = true;
      pdfjsLib.getDocument('Portfolio Docs/Situation Analysis-C2M.pdf').promise.then(doc => {
        pdfDoc = doc;
        renderFirst(1);
      });
    }
  }).observe(panel, { attributes: true, attributeFilter: ['class'] });

  prevBtn.addEventListener('click', e => { e.stopPropagation(); slideTo(pageNum - 1, 'prev'); });
  nextBtn.addEventListener('click', e => { e.stopPropagation(); slideTo(pageNum + 1, 'next'); });
})();
