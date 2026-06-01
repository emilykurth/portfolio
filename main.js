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
const portfolioIds = new Set(['social-media', 'graphic-design', 'brand-work', 'projects']);

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

// ── Brand Work — panel replaces grid with fade+scale ────────────────
function initBrandPanels() {
  const grid = document.querySelector('.brand-grid');
  if (!grid) return;
  const view = grid.parentElement; // .brand-view

  const display     = document.getElementById('brand-display');
  const displayBody = display.querySelector('.brand-display__body');
  let activePanel   = null;

  function openDisplay(panel) {
    panel._nextSibling = panel.nextElementSibling;
    const gridH = grid.offsetHeight;

    // Fade grid out first, force reflow so all 4 panels are visible at fade start
    grid.classList.add('faded');
    grid.getBoundingClientRect();

    // Now move panel to display and set expanded state
    displayBody.appendChild(panel);
    panel.classList.add('expanded');

    display.style.display = 'block';
    const displayH = display.scrollHeight;
    view.style.minHeight = Math.max(gridH, displayH) + 'px';

    requestAnimationFrame(() => requestAnimationFrame(() => {
      display.classList.add('open');
    }));
    activePanel = panel;
  }

  function closeDisplay() {
    if (!activePanel) return;
    const panel = activePanel;
    activePanel = null;

    // Restore panel to grid while display is still fully visible
    panel.classList.remove('expanded');
    if (panel._nextSibling) grid.insertBefore(panel, panel._nextSibling);
    else grid.appendChild(panel);
    panel._nextSibling = null;

    // Cross-fade: display fades out, grid fades in together
    display.classList.remove('open');
    grid.classList.remove('faded');

    setTimeout(() => {
      display.style.display = 'none';
      view.style.minHeight = '';
    }, 320);
  }

  grid.querySelectorAll('.brand-panel').forEach(panel => {
    panel.addEventListener('click', (e) => {
      if (e.target.closest('.brand-back-btn')) { e.stopPropagation(); closeDisplay(); return; }
      if (panel.classList.contains('expanded')) { closeDisplay(); return; }
      openDisplay(panel);
    });
    panel.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDisplay(panel); }
    });
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDisplay(); });
}

initBrandPanels();

// ── Class Projects — panel replaces grid with fade+scale ─────────────
function initProjectCards() {
  const grid = document.querySelector('.projects-grid');
  if (!grid) return;
  const view = grid.parentElement; // .project-view

  const panel      = document.getElementById('project-panel');
  const panelTitle = panel.querySelector('.project-panel__title');
  const panelTag   = panel.querySelector('.project-panel__tag');
  const panelBody  = panel.querySelector('.project-panel__body');
  let activeCard   = null;

  function openPanel(card) {
    const detail = card.querySelector('.project-card__detail');
    panelTitle.textContent = card.querySelector('.project-card__title').textContent;
    panelTag.textContent   = card.querySelector('.project-card__tag').textContent;
    panelBody.appendChild(detail);

    grid.classList.add('faded');
    panel.style.display = 'block';

    // Measure panel height while still transparent, then size the wrapper
    const panelH = panel.scrollHeight;
    view.style.minHeight = Math.max(grid.offsetHeight, panelH) + 'px';

    requestAnimationFrame(() => requestAnimationFrame(() => {
      panel.classList.add('open');
    }));
    activeCard = card;
  }

  function closePanel() {
    if (!activeCard) return;
    const card = activeCard;
    const detail = panelBody.querySelector('.project-card__detail');
    activeCard = null;

    // Cross-fade: panel fades out, grid fades in together
    panel.classList.remove('open');
    grid.classList.remove('faded');

    setTimeout(() => {
      if (detail) card.appendChild(detail);
      panel.style.display = 'none';
      view.style.minHeight = '';
    }, 320);
  }

  grid.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => openPanel(card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPanel(card); }
    });
  });

  panel.addEventListener('click', () => { if (activeCard) closePanel(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });
}

initProjectCards();

// ── Education box tap-to-expand (touch devices) ──────────────────────
if (window.matchMedia('(pointer: coarse)').matches) {
  document.querySelectorAll('.edu-box').forEach(box => {
    box.addEventListener('click', () => {
      const wasOpen = box.classList.contains('open');
      document.querySelectorAll('.edu-box').forEach(b => b.classList.remove('open'));
      if (!wasOpen) box.classList.add('open');
    });
  });
}

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

// ── Campus Library Redesign image slideshow ──────────────────────────
(function () {
  const card = document.querySelector('.project-card--library');
  if (!card) return;

  const slides = [
    'Portfolio Docs/OpS-Pro1.jpg',
    'Portfolio Docs/OpS-pro2.jpg',
    'Portfolio Docs/OpS-pro3.jpg',
    'Portfolio Docs/OpS-pro4.jpg',
    'Portfolio Docs/OpS-pro5.jpg'
  ];

  const track    = card.querySelector('.ops-slide-track');
  const img      = card.querySelector('#ops-slide-img');
  const prevBtn  = card.querySelector('.ops-prev');
  const nextBtn  = card.querySelector('.ops-next');
  const pageInfo = card.querySelector('.ops-page-info');
  let current = 0, animating = false;
  const SLIDE_DUR = 380;

  function slideTo(n, dir) {
    if (animating || n < 0 || n >= slides.length) return;
    animating = true;

    const ease = `${SLIDE_DUR}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    const inc  = document.createElement('img');

    inc.onload = () => {
      track.style.height = img.offsetHeight + 'px';
      img.style.cssText  = 'position:absolute;top:0;left:0;width:100%;height:auto;';
      inc.style.cssText  = `position:absolute;top:0;left:0;width:100%;height:auto;transform:translateX(${dir === 'next' ? '100%' : '-100%'});`;
      track.appendChild(inc);

      requestAnimationFrame(() => requestAnimationFrame(() => {
        img.style.transition = `transform ${ease}`;
        img.style.transform  = dir === 'next' ? 'translateX(-100%)' : 'translateX(100%)';
        inc.style.transition = `transform ${ease}`;
        inc.style.transform  = 'translateX(0)';

        setTimeout(() => {
          img.src = slides[n];
          img.removeAttribute('style');
          track.style.height = '';
          inc.remove();
          current = n;
          pageInfo.textContent = `${n + 1} / ${slides.length}`;
          animating = false;
        }, SLIDE_DUR + 20);
      }));
    };

    inc.src = slides[n];
  }

  prevBtn.addEventListener('click', e => { e.stopPropagation(); slideTo(current - 1, 'prev'); });
  nextBtn.addEventListener('click', e => { e.stopPropagation(); slideTo(current + 1, 'next'); });
})();

// ── I Heart Jane PDF viewers (report + slides) ───────────────────────
(function () {
  const card = document.querySelector('.project-card--ihj');
  if (!card || typeof pdfjsLib === 'undefined') return;

  const SLIDE_DUR = 380;

  function initPdfViewer(canvasId, pdfPath, prevBtn, nextBtn, infoEl) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx   = canvas.getContext('2d');
    const track = canvas.parentElement;
    let pdfDoc = null, pageNum = 1, animating = false;

    function renderFirst(n) {
      pdfDoc.getPage(n).then(page => {
        const vp = page.getViewport({ scale: 2 });
        canvas.width = vp.width; canvas.height = vp.height;
        page.render({ canvasContext: ctx, viewport: vp }).promise.then(() => {
          infoEl.textContent = `${n} / ${pdfDoc.numPages}`;
        });
      });
    }

    function slideTo(n, dir) {
      if (!pdfDoc || animating || n < 1 || n > pdfDoc.numPages) return;
      animating = true;
      const ease = `${SLIDE_DUR}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      pdfDoc.getPage(n).then(page => {
        const vp  = page.getViewport({ scale: 2 });
        const inc = document.createElement('canvas');
        inc.width = vp.width; inc.height = vp.height;
        page.render({ canvasContext: inc.getContext('2d'), viewport: vp }).promise.then(() => {
          track.style.height = canvas.offsetHeight + 'px';
          canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:auto;';
          inc.style.cssText    = `position:absolute;top:0;left:0;width:100%;height:auto;transform:translateX(${dir==='next'?'100%':'-100%'});`;
          track.appendChild(inc);
          requestAnimationFrame(() => requestAnimationFrame(() => {
            canvas.style.transition = `transform ${ease}`;
            canvas.style.transform  = dir === 'next' ? 'translateX(-100%)' : 'translateX(100%)';
            inc.style.transition    = `transform ${ease}`;
            inc.style.transform     = 'translateX(0)';
            setTimeout(() => {
              canvas.width = vp.width; canvas.height = vp.height;
              canvas.getContext('2d').drawImage(inc, 0, 0);
              canvas.removeAttribute('style');
              track.style.height = '';
              inc.remove();
              pageNum = n;
              infoEl.textContent = `${n} / ${pdfDoc.numPages}`;
              animating = false;
            }, SLIDE_DUR + 20);
          }));
        });
      });
    }

    pdfjsLib.getDocument(pdfPath).promise.then(doc => { pdfDoc = doc; renderFirst(1); });
    prevBtn.addEventListener('click', e => { e.stopPropagation(); slideTo(pageNum - 1, 'prev'); });
    nextBtn.addEventListener('click', e => { e.stopPropagation(); slideTo(pageNum + 1, 'next'); });
  }

  const reportEl = card.querySelector('#ihj-report');
  const slidesEl = card.querySelector('#ihj-slides');

  initPdfViewer('ihj-report-canvas', 'Portfolio Docs/IHJ-report.pdf',
    reportEl.querySelector('.ihj-prev'), reportEl.querySelector('.ihj-next'), reportEl.querySelector('.ihj-info'));

  initPdfViewer('ihj-slides-canvas', 'Portfolio Docs/IHJ-slides.pdf',
    slidesEl.querySelector('.ihj-prev'), slidesEl.querySelector('.ihj-next'), slidesEl.querySelector('.ihj-info'));
})();

// ── Define image lightbox ─────────────────────────────────────────────
(function () {
  const overlay  = document.createElement('div');
  overlay.className = 'define-lightbox';
  overlay.innerHTML = '<img class="define-lightbox__img" src="" alt=""><button class="define-lightbox__close" aria-label="Close">&times;</button>';
  document.body.appendChild(overlay);

  const lbImg    = overlay.querySelector('.define-lightbox__img');
  const closeBtn = overlay.querySelector('.define-lightbox__close');

  function open(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.ops-define-images img').forEach(img => {
    img.addEventListener('click', e => { e.stopPropagation(); open(img.src, img.alt); });
  });

  overlay.addEventListener('click', close);
  closeBtn.addEventListener('click', e => { e.stopPropagation(); close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
