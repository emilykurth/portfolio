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

  function addControls(prev, next) {
    const prevBtn = wrapper.querySelector('.carousel-btn--prev');
    const nextBtn = wrapper.querySelector('.carousel-btn--next');
    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    wrapper.setAttribute('tabindex', '0');
    wrapper.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    });

    let wheelCooldown = false;
    wrapper.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (wheelCooldown) return;
      wheelCooldown = true;
      setTimeout(() => { wheelCooldown = false; }, 400);
      (e.deltaX > 0 || e.deltaY > 0) ? next() : prev();
    }, { passive: false });
  }

  if (perView > 0) {
    // ── Grid / sliding-track mode ──
    function slideWidth() { return items[0] ? items[0].offsetWidth + 16 : 0; }
    function positionTrack() {
      track.style.transform = `translateX(-${current * slideWidth()}px)`;
    }
    function prev() {
      if (current > 0) { current--; positionTrack(); }
    }
    function next() {
      if (current < count - perView) { current++; positionTrack(); }
    }
    addControls(prev, next);
    positionTrack();
    window.addEventListener('resize', positionTrack);
    return;
  }

  // ── Coverflow mode ──
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
  addControls(prev, next);
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
