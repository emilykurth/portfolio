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

// ── Coverflow Carousel ──────────────────────────────────────────────
function initCarousel(wrapper) {
  const track = wrapper.querySelector('.carousel-track');
  if (!track) return;
  const items = Array.from(track.querySelectorAll('.carousel-item'));
  const count = items.length;
  if (count === 0) return;
  let current = 0;

  function positionItems() {
    const gap = Math.min(300, wrapper.offsetWidth * 0.22);
    items.forEach((item, i) => {
      let offset = i - current;
      if (offset > count / 2)  offset -= count;
      if (offset < -count / 2) offset += count;

      const abs     = Math.abs(offset);
      const scale   = Math.max(0.5, 1 - abs * 0.15);
      const opacity = abs > 3 ? 0 : Math.max(0.2, 1 - abs * 0.27);
      const tx      = offset * gap;

      item.style.transform = `translate(calc(-50% + ${tx}px), -50%) scale(${scale})`;
      item.style.opacity   = opacity;
      item.style.zIndex    = 10 - abs;
    });
  }

  const prevBtn = wrapper.querySelector('.carousel-btn--prev');
  const nextBtn = wrapper.querySelector('.carousel-btn--next');

  if (prevBtn) prevBtn.addEventListener('click', () => {
    current = (current - 1 + count) % count;
    positionItems();
  });

  if (nextBtn) nextBtn.addEventListener('click', () => {
    current = (current + 1) % count;
    positionItems();
  });

  positionItems();
  window.addEventListener('resize', positionItems);
}

document.querySelectorAll('.carousel-wrapper').forEach(initCarousel);
