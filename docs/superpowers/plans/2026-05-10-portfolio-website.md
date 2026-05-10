# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page static portfolio website with ocean theme for an illustrator/graphic designer, using placeholder content ready for real content swap-in.

**Architecture:** Three files — `index.html` (all HTML), `style.css` (all styles + CSS variables), `main.js` (filter, lightbox, nav interactions). No build step; open `index.html` directly in browser or serve with `python3 -m http.server 8080`.

**Tech Stack:** HTML5, CSS3 (custom properties, CSS Grid, Flexbox, CSS animations), vanilla ES6 JS, Google Fonts (Playfair Display + Inter), placehold.co for placeholder images, inline SVG icons.

---

## File Map

| File | Responsibility |
|------|----------------|
| `index.html` | All page structure: nav, hero, about, education, portfolio (9 cards), contact, footer, lightbox overlay |
| `style.css` | CSS custom properties, reset, layout, ocean theme, animations, responsive breakpoints |
| `main.js` | Nav scroll frosting + hamburger toggle, portfolio category filter, lightbox open/close, IntersectionObserver for active nav |
| `.gitignore` | Excludes `.DS_Store` and `.superpowers/` |

---

### Task 1: Scaffold — base files, CSS variables, git init

**Files:**
- Create: `index.html`
- Create: `style.css`
- Create: `main.js`
- Create: `.gitignore`

- [ ] **Step 1: Initialize git repository**

```bash
cd /Users/emily/Development/Demo
git init
```

Expected: `Initialized empty Git repository in /Users/emily/Development/Demo/.git/`

- [ ] **Step 2: Create `.gitignore`**

```
.DS_Store
.superpowers/
```

- [ ] **Step 3: Create `main.js`**

```js
'use strict';
```

- [ ] **Step 4: Create `style.css`**

```css
/* === Fonts === */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500&display=swap');

/* === Custom Properties === */
:root {
  --color-bg: #F8F5F0;
  --color-primary: #1B4F72;
  --color-accent: #48C9B0;
  --color-text: #2C3E50;
  --color-section-alt: #EAF4F4;
  --color-contact-bg: #1B4F72;
  --color-footer-bg: #0d2233;
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
  --nav-height: 64px;
  --max-width: 1200px;
  --wave-height: 60px;
}

/* === Reset === */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--font-body);
  color: var(--color-text);
  background: var(--color-bg);
  line-height: 1.6;
  overflow-x: hidden;
}
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; }
button { cursor: pointer; }

/* === Shared layout === */
.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 2rem;
}
.section-title {
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}
.section-subtitle {
  color: var(--color-text);
  opacity: 0.7;
  margin-bottom: 3rem;
}
.section-label {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-accent);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

/* === Wave divider (positioned inside each section) === */
.section-wave {
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  overflow: hidden;
  line-height: 0;
  z-index: 1;
}
.section-wave svg {
  display: block;
  width: 100%;
  height: var(--wave-height);
}
```

- [ ] **Step 5: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- REPLACE: Update with your name -->
  <title>Your Name — Portfolio</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <nav class="nav" id="nav"></nav>

  <main>
    <section class="hero" id="hero"></section>
    <section class="about" id="about"></section>
    <section class="education" id="education"></section>
    <section class="portfolio" id="portfolio"></section>
    <section class="contact" id="contact"></section>
  </main>

  <footer class="footer" id="footer"></footer>
  <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Project details"></div>

  <script src="main.js"></script>
</body>
</html>
```

- [ ] **Step 6: Open in browser and verify**

```bash
open /Users/emily/Development/Demo/index.html
```

Expected: blank page, no console errors. In DevTools → Network tab, `style.css` and `main.js` both return 200. Google Fonts request appears (may fail offline — that's fine for now).

- [ ] **Step 7: Commit**

```bash
git add index.html style.css main.js .gitignore
git commit -m "feat: scaffold project with CSS variables, reset, and base layout"
```

---

### Task 2: Navigation

**Files:**
- Modify: `index.html` — replace `<nav class="nav" id="nav"></nav>` with full nav HTML
- Modify: `style.css` — append nav styles
- Modify: `main.js` — replace contents with nav JS

- [ ] **Step 1: Replace the nav element in `index.html`**

Replace:
```html
  <nav class="nav" id="nav"></nav>
```
With:
```html
  <nav class="nav" id="nav">
    <div class="nav-container">
      <!-- REPLACE: Your actual name -->
      <a href="#hero" class="nav-logo">Your Name</a>
      <button class="nav-hamburger" id="navHamburger" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links" id="navLinks">
        <li><a href="#about" class="nav-link">About</a></li>
        <li><a href="#education" class="nav-link">Education</a></li>
        <li><a href="#portfolio" class="nav-link">Portfolio</a></li>
        <li><a href="#contact" class="nav-link">Contact</a></li>
      </ul>
    </div>
  </nav>
```

- [ ] **Step 2: Append nav styles to `style.css`**

```css
/* === Navigation === */
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: var(--nav-height);
  z-index: 100;
  transition: background 0.3s, box-shadow 0.3s;
}
.nav.scrolled {
  background: rgba(248, 245, 240, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 1px 12px rgba(27, 79, 114, 0.10);
}
.nav-container {
  max-width: var(--max-width);
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
}
.nav-logo {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  color: var(--color-primary);
  font-weight: 700;
}
.nav-links { display: flex; gap: 2.5rem; }
.nav-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: color 0.2s;
  position: relative;
  padding-bottom: 2px;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px; left: 0;
  width: 0; height: 2px;
  background: var(--color-accent);
  transition: width 0.25s;
}
.nav-link:hover::after,
.nav-link.active::after { width: 100%; }
.nav-link:hover,
.nav-link.active { color: var(--color-primary); }

.nav-hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  padding: 4px;
}
.nav-hamburger span {
  display: block;
  width: 24px; height: 2px;
  background: var(--color-primary);
  transition: transform 0.25s, opacity 0.25s;
}
.nav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav-hamburger.open span:nth-child(2) { opacity: 0; }
.nav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

@media (max-width: 768px) {
  .nav-hamburger { display: flex; }
  .nav-links {
    display: none;
    position: absolute;
    top: var(--nav-height);
    left: 0; right: 0;
    flex-direction: column;
    gap: 0;
    background: rgba(248, 245, 240, 0.97);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    box-shadow: 0 4px 12px rgba(27, 79, 114, 0.1);
  }
  .nav-links.open { display: flex; }
  .nav-link {
    padding: 1rem 2rem;
    border-bottom: 1px solid rgba(27, 79, 114, 0.08);
  }
}
```

- [ ] **Step 3: Replace `main.js` contents with nav JS**

```js
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
```

- [ ] **Step 4: Reload browser and verify**

- Nav links visible at the top of the page
- Scroll down 30px → nav gets frosted background + shadow
- In DevTools, set viewport to 375px → hamburger icon appears, links are hidden
- Click hamburger → links drop down; click a link → menu closes

- [ ] **Step 5: Commit**

```bash
git add index.html style.css main.js
git commit -m "feat: add sticky nav with frosted scroll effect and mobile hamburger"
```

---

### Task 3: Hero section

**Files:**
- Modify: `index.html` — replace `<section class="hero" id="hero"></section>`
- Modify: `style.css` — append hero styles and animation

- [ ] **Step 1: Replace hero section in `index.html`**

Replace:
```html
    <section class="hero" id="hero"></section>
```
With:
```html
    <section class="hero" id="hero">
      <div class="hero-content">
        <p class="hero-eyebrow">Welcome to my portfolio</p>
        <!-- REPLACE: Your actual name -->
        <h1 class="hero-name">Your Name</h1>
        <!-- REPLACE: Your actual specialties -->
        <p class="hero-tagline">Illustrator &amp; Graphic Designer</p>
        <a href="#about" class="hero-arrow" aria-label="Scroll to About">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <polyline points="19 12 12 19 5 12"/>
          </svg>
        </a>
      </div>
      <div class="section-wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#F8F5F0"/>
        </svg>
      </div>
    </section>
```

- [ ] **Step 2: Append hero styles to `style.css`**

```css
/* === Hero === */
@keyframes oceanTide {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(10px); }
}

.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: linear-gradient(135deg, #0d3349, #1B4F72, #2980b9, #48C9B0, #1B4F72, #0d3349);
  background-size: 400% 400%;
  animation: oceanTide 14s ease infinite;
  padding: var(--nav-height) 2rem calc(var(--wave-height) + 3rem);
  overflow: hidden;
}
.hero-content { color: #fff; max-width: 720px; }
.hero-eyebrow {
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  opacity: 0.75;
  margin-bottom: 1.25rem;
}
.hero-name {
  font-family: var(--font-heading);
  font-size: clamp(3rem, 9vw, 6.5rem);
  font-weight: 700;
  line-height: 1.05;
  margin-bottom: 1rem;
}
.hero-tagline {
  font-size: clamp(1rem, 2.5vw, 1.375rem);
  font-weight: 300;
  opacity: 0.88;
  letter-spacing: 0.06em;
  margin-bottom: 3.5rem;
}
.hero-arrow {
  display: inline-flex;
  color: rgba(255, 255, 255, 0.65);
  animation: bounce 2.5s ease-in-out infinite;
  transition: color 0.2s;
}
.hero-arrow:hover { color: #fff; }
```

- [ ] **Step 3: Reload browser and verify**

- Hero fills the full viewport height with a dark navy-to-teal gradient that slowly animates
- Name and tagline are centered over the gradient in white
- Down-arrow bounces gently at the bottom
- A sand-colored wave curve appears at the very bottom of the hero

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "feat: add hero section with animated ocean gradient and wave divider"
```

---

### Task 4: About/Bio section

**Files:**
- Modify: `index.html` — replace `<section class="about" id="about"></section>`
- Modify: `style.css` — append about styles

- [ ] **Step 1: Replace about section in `index.html`**

Replace:
```html
    <section class="about" id="about"></section>
```
With:
```html
    <section class="about" id="about">
      <div class="container">
        <div class="about-grid">
          <div class="about-portrait">
            <!-- REPLACE: Swap src with your actual photo path -->
            <img
              src="https://placehold.co/400x500/48C9B0/1B4F72?text=Photo"
              alt="Portrait photo"
              width="400" height="500">
          </div>
          <div class="about-text">
            <p class="section-label">About Me</p>
            <!-- REPLACE: Your actual name -->
            <h2 class="section-title">Your Name</h2>
            <!-- REPLACE: Your actual bio -->
            <p class="about-bio">
              I'm a creative professional specializing in illustration, graphic design, and brand identity.
              With a passion for ocean-inspired aesthetics and clean visual storytelling, I craft work that
              resonates with audiences and elevates brands. Based in [Your City], I collaborate with clients
              worldwide on projects ranging from editorial illustration to full brand systems.
            </p>
            <p class="about-bio">
              When I'm not at the drawing board, you'll find me exploring tide pools, collecting sea glass,
              and finding new ways that nature's patterns translate to design.
            </p>
            <a href="#contact" class="btn-primary">Get in Touch</a>
          </div>
        </div>
      </div>
      <div class="section-wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,30 C360,0 1080,60 1440,30 L1440,60 L0,60 Z" fill="#EAF4F4"/>
        </svg>
      </div>
    </section>
```

- [ ] **Step 2: Append about styles to `style.css`**

```css
/* === About === */
.about {
  position: relative;
  background: var(--color-bg);
  padding: 6rem 0 calc(var(--wave-height) + 4rem);
}
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 4rem;
  align-items: center;
}
.about-portrait img {
  border-radius: 4px;
  width: 100%;
  object-fit: cover;
  box-shadow: 0 12px 40px rgba(27, 79, 114, 0.15);
}
.about-bio {
  color: var(--color-text);
  line-height: 1.8;
  margin-bottom: 1.25rem;
  opacity: 0.9;
}
.btn-primary {
  display: inline-block;
  margin-top: 0.75rem;
  padding: 0.75rem 2rem;
  background: var(--color-primary);
  color: #fff;
  border-radius: 3px;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  transition: background 0.2s, transform 0.15s;
}
.btn-primary:hover {
  background: var(--color-accent);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .about-grid { grid-template-columns: 1fr; gap: 2rem; }
  .about-portrait img { max-width: 280px; margin: 0 auto; }
}
```

- [ ] **Step 3: Reload browser and verify**

- About section has sand (#F8F5F0) background directly below the hero
- Two-column layout: placeholder portrait left, bio text right
- "Get in Touch" button links to the contact section
- At 375px viewport: single column, portrait centered
- Wave at bottom transitions to pale aqua (#EAF4F4)

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "feat: add about/bio section with two-column layout"
```

---

### Task 5: Education section

**Files:**
- Modify: `index.html` — replace `<section class="education" id="education"></section>`
- Modify: `style.css` — append education styles

- [ ] **Step 1: Replace education section in `index.html`**

Replace:
```html
    <section class="education" id="education"></section>
```
With:
```html
    <section class="education" id="education">
      <div class="container">
        <p class="section-label">Background</p>
        <h2 class="section-title">Education &amp; Training</h2>
        <p class="section-subtitle">Degrees, certifications, and professional development</p>
        <div class="education-grid">
          <!-- REPLACE: Update all three entries with your actual education -->
          <div class="edu-card">
            <span class="edu-year">2022</span>
            <h3 class="edu-degree">Bachelor of Fine Arts — Illustration</h3>
            <p class="edu-institution">Example Art Institute</p>
            <p class="edu-detail">Focused on digital and traditional illustration with a minor in visual communication.</p>
          </div>
          <div class="edu-card">
            <span class="edu-year">2020</span>
            <h3 class="edu-degree">Certificate in Graphic Design</h3>
            <p class="edu-institution">Example Community College</p>
            <p class="edu-detail">Coursework in typography, layout design, and Adobe Creative Suite.</p>
          </div>
          <div class="edu-card">
            <span class="edu-year">2023</span>
            <h3 class="edu-degree">Branding &amp; Identity Workshop</h3>
            <p class="edu-institution">Online Professional Development</p>
            <p class="edu-detail">Intensive 8-week program covering brand strategy, logo design, and identity systems.</p>
          </div>
        </div>
      </div>
      <div class="section-wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,20 C480,60 960,0 1440,40 L1440,60 L0,60 Z" fill="#F8F5F0"/>
        </svg>
      </div>
    </section>
```

- [ ] **Step 2: Append education styles to `style.css`**

```css
/* === Education === */
.education {
  position: relative;
  background: var(--color-section-alt);
  padding: 6rem 0 calc(var(--wave-height) + 4rem);
}
.education-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
.edu-card {
  background: #fff;
  border-radius: 6px;
  padding: 2rem;
  box-shadow: 0 2px 16px rgba(27, 79, 114, 0.07);
  border-top: 3px solid var(--color-accent);
  transition: transform 0.2s, box-shadow 0.2s;
}
.edu-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(27, 79, 114, 0.12);
}
.edu-year {
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: var(--color-accent);
  text-transform: uppercase;
}
.edu-degree {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  color: var(--color-primary);
  margin: 0.5rem 0 0.25rem;
  line-height: 1.3;
}
.edu-institution {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 0.75rem;
}
.edu-detail {
  font-size: 0.875rem;
  color: var(--color-text);
  opacity: 0.75;
  line-height: 1.6;
}

@media (max-width: 900px) {
  .education-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 540px) {
  .education-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Reload browser and verify**

- Education section has pale aqua (#EAF4F4) background
- Three cards display side by side on desktop
- Each card has a teal top border; hover lifts the card with a subtle shadow
- At 900px: two cards per row; at 540px: one card per row
- Wave at bottom transitions to sand (#F8F5F0) for the portfolio section

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "feat: add education section with responsive card grid"
```

---

### Task 6: Portfolio grid and category filter

**Files:**
- Modify: `index.html` — replace `<section class="portfolio" id="portfolio"></section>` with 9 cards + filter buttons
- Modify: `style.css` — append portfolio styles
- Modify: `main.js` — append filter logic

- [ ] **Step 1: Replace portfolio section in `index.html`**

Replace:
```html
    <section class="portfolio" id="portfolio"></section>
```
With:
```html
    <section class="portfolio" id="portfolio">
      <div class="container">
        <p class="section-label">My Work</p>
        <h2 class="section-title">Portfolio</h2>
        <p class="section-subtitle">A selection of recent projects</p>

        <div class="portfolio-filters">
          <button class="filter-btn active" data-filter="all">All</button>
          <button class="filter-btn" data-filter="illustration">Illustration</button>
          <button class="filter-btn" data-filter="graphic-design">Graphic Design</button>
          <button class="filter-btn" data-filter="branding">Branding</button>
        </div>

        <div class="portfolio-grid">
          <!-- REPLACE: Swap src, data-title, data-description for real work -->
          <div class="portfolio-card" data-category="illustration"
               data-title="Ocean Depths"
               data-description="A digital illustration exploring the luminous world beneath the ocean surface."
               onclick="openLightbox(this)">
            <img src="https://placehold.co/600x450/48C9B0/1B4F72?text=Illustration+1" alt="Ocean Depths">
            <div class="card-overlay">
              <span class="card-tag">Illustration</span>
              <h3 class="card-title">Ocean Depths</h3>
            </div>
          </div>

          <div class="portfolio-card" data-category="illustration"
               data-title="Tide Pool"
               data-description="Gouache-style illustration of a Pacific coast tide pool with anemones and starfish."
               onclick="openLightbox(this)">
            <img src="https://placehold.co/600x450/5dade2/1B4F72?text=Illustration+2" alt="Tide Pool">
            <div class="card-overlay">
              <span class="card-tag">Illustration</span>
              <h3 class="card-title">Tide Pool</h3>
            </div>
          </div>

          <div class="portfolio-card" data-category="illustration"
               data-title="Storm at Sea"
               data-description="Editorial illustration depicting a dramatic sea storm in muted ink and wash tones."
               onclick="openLightbox(this)">
            <img src="https://placehold.co/600x450/1B4F72/48C9B0?text=Illustration+3" alt="Storm at Sea">
            <div class="card-overlay">
              <span class="card-tag">Illustration</span>
              <h3 class="card-title">Storm at Sea</h3>
            </div>
          </div>

          <div class="portfolio-card" data-category="graphic-design"
               data-title="Wave Brand System"
               data-description="Typography-driven brand system built around fluid wave forms for a coastal lifestyle brand."
               onclick="openLightbox(this)">
            <img src="https://placehold.co/600x450/48C9B0/0d2233?text=Graphic+Design+1" alt="Wave Brand System">
            <div class="card-overlay">
              <span class="card-tag">Graphic Design</span>
              <h3 class="card-title">Wave Brand System</h3>
            </div>
          </div>

          <div class="portfolio-card" data-category="graphic-design"
               data-title="Coastal Magazine Layout"
               data-description="Editorial layout design for a travel magazine feature on coastal communities."
               onclick="openLightbox(this)">
            <img src="https://placehold.co/600x450/5dade2/0d2233?text=Graphic+Design+2" alt="Coastal Magazine Layout">
            <div class="card-overlay">
              <span class="card-tag">Graphic Design</span>
              <h3 class="card-title">Coastal Magazine Layout</h3>
            </div>
          </div>

          <div class="portfolio-card" data-category="graphic-design"
               data-title="Sea Glass Poster"
               data-description="Hand-lettered event poster with sea glass color palette for an ocean conservation fundraiser."
               onclick="openLightbox(this)">
            <img src="https://placehold.co/600x450/1B4F72/EAF4F4?text=Graphic+Design+3" alt="Sea Glass Poster">
            <div class="card-overlay">
              <span class="card-tag">Graphic Design</span>
              <h3 class="card-title">Sea Glass Poster</h3>
            </div>
          </div>

          <div class="portfolio-card" data-category="branding"
               data-title="Harbor Coffee Co."
               data-description="Full brand identity for an independent coffee roaster with a maritime heritage theme."
               onclick="openLightbox(this)">
            <img src="https://placehold.co/600x450/48C9B0/1B4F72?text=Branding+1" alt="Harbor Coffee Co.">
            <div class="card-overlay">
              <span class="card-tag">Branding</span>
              <h3 class="card-title">Harbor Coffee Co.</h3>
            </div>
          </div>

          <div class="portfolio-card" data-category="branding"
               data-title="Blue Pearl Spa"
               data-description="Luxury spa brand identity including logo, color system, and packaging design."
               onclick="openLightbox(this)">
            <img src="https://placehold.co/600x450/5dade2/1B4F72?text=Branding+2" alt="Blue Pearl Spa">
            <div class="card-overlay">
              <span class="card-tag">Branding</span>
              <h3 class="card-title">Blue Pearl Spa</h3>
            </div>
          </div>

          <div class="portfolio-card" data-category="branding"
               data-title="Maritime Goods"
               data-description="Rugged coastal lifestyle brand identity for an outdoor and marine goods retailer."
               onclick="openLightbox(this)">
            <img src="https://placehold.co/600x450/1B4F72/48C9B0?text=Branding+3" alt="Maritime Goods">
            <div class="card-overlay">
              <span class="card-tag">Branding</span>
              <h3 class="card-title">Maritime Goods</h3>
            </div>
          </div>
        </div>
      </div>
      <div class="section-wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C360,0 1080,60 1440,20 L1440,60 L0,60 Z" fill="#1B4F72"/>
        </svg>
      </div>
    </section>
```

- [ ] **Step 2: Append portfolio styles to `style.css`**

```css
/* === Portfolio === */
.portfolio {
  position: relative;
  background: var(--color-bg);
  padding: 6rem 0 calc(var(--wave-height) + 4rem);
}
.portfolio-filters {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
}
.filter-btn {
  padding: 0.5rem 1.25rem;
  border: 2px solid var(--color-primary);
  background: transparent;
  color: var(--color-primary);
  border-radius: 2rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  transition: background 0.2s, color 0.2s;
}
.filter-btn:hover,
.filter-btn.active {
  background: var(--color-primary);
  color: #fff;
}
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}
.portfolio-card {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(27, 79, 114, 0.08);
  transition: transform 0.25s, box-shadow 0.25s;
}
.portfolio-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(72, 201, 176, 0.25);
}
.portfolio-card img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  transition: transform 0.35s;
}
.portfolio-card:hover img { transform: scale(1.04); }
.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(27, 79, 114, 0.85) 0%, transparent 60%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.25rem;
  opacity: 0;
  transition: opacity 0.25s;
}
.portfolio-card:hover .card-overlay { opacity: 1; }
.card-tag {
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-accent);
  font-weight: 500;
  margin-bottom: 0.25rem;
}
.card-title {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  color: #fff;
  line-height: 1.25;
}

@media (max-width: 900px) {
  .portfolio-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 540px) {
  .portfolio-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Append filter JS to `main.js`**

```js
// --- Portfolio filter ---
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    portfolioCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.style.display = match ? '' : 'none';
    });
  });
});
```

- [ ] **Step 4: Reload browser and verify**

- 9 cards display in a 3-column grid on desktop
- Hover a card: image scales slightly, title overlay fades in, card lifts with teal shadow
- Click "Illustration" → only the 3 illustration cards remain; "Illustration" button fills navy
- Click "All" → all 9 cards reappear
- At 900px viewport: 2-column grid; at 540px: 1-column grid
- Wave at bottom of portfolio section is dark navy (#1B4F72), flowing into the contact section

- [ ] **Step 5: Commit**

```bash
git add index.html style.css main.js
git commit -m "feat: add portfolio grid with 9 placeholder cards and category filter"
```

---

### Task 7: Lightbox

**Files:**
- Modify: `index.html` — replace `<div class="lightbox" ...></div>` with full lightbox HTML
- Modify: `style.css` — append lightbox styles
- Modify: `main.js` — append lightbox JS

- [ ] **Step 1: Replace lightbox div in `index.html`**

Replace:
```html
  <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Project details"></div>
```
With:
```html
  <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Project details">
    <div class="lightbox-inner">
      <button class="lightbox-close" id="lightboxClose" aria-label="Close lightbox">&times;</button>
      <img src="" alt="" id="lightboxImg" class="lightbox-img">
      <div class="lightbox-info">
        <span class="card-tag" id="lightboxTag"></span>
        <h3 class="lightbox-title" id="lightboxTitle"></h3>
        <p class="lightbox-desc" id="lightboxDesc"></p>
      </div>
    </div>
  </div>
```

- [ ] **Step 2: Append lightbox styles to `style.css`**

```css
/* === Lightbox === */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(13, 34, 51, 0.92);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 2rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s;
}
.lightbox.open {
  opacity: 1;
  pointer-events: all;
}
.lightbox-inner {
  position: relative;
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
}
.lightbox-close {
  position: absolute;
  top: 0.75rem; right: 0.75rem;
  width: 36px; height: 36px;
  background: rgba(13, 34, 51, 0.7);
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 1.25rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: background 0.2s;
}
.lightbox-close:hover { background: var(--color-primary); }
.lightbox-img {
  width: 100%;
  max-height: 60vh;
  object-fit: cover;
}
.lightbox-info { padding: 1.5rem 2rem; }
.lightbox-title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--color-primary);
  margin: 0.25rem 0 0.75rem;
}
.lightbox-desc {
  color: var(--color-text);
  opacity: 0.8;
  line-height: 1.7;
  font-size: 0.95rem;
}
```

- [ ] **Step 3: Append lightbox JS to `main.js`**

```js
// --- Lightbox ---
function openLightbox(card) {
  const lightbox = document.getElementById('lightbox');
  document.getElementById('lightboxImg').src = card.querySelector('img').src;
  document.getElementById('lightboxImg').alt = card.dataset.title;
  document.getElementById('lightboxTag').textContent = card.querySelector('.card-tag').textContent;
  document.getElementById('lightboxTitle').textContent = card.dataset.title;
  document.getElementById('lightboxDesc').textContent = card.dataset.description;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('lightbox').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeLightbox();
});
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});
```

- [ ] **Step 4: Reload browser and verify**

- Click any portfolio card → lightbox opens with that card's image, category tag, title, and description
- Click the × button → lightbox closes
- Click the dark overlay area outside the white box → lightbox closes
- Press Escape → lightbox closes
- While lightbox is open, the page behind cannot be scrolled

- [ ] **Step 5: Commit**

```bash
git add index.html style.css main.js
git commit -m "feat: add lightbox with keyboard dismiss and scroll lock"
```

---

### Task 8: Contact section and footer

**Files:**
- Modify: `index.html` — replace contact section and footer
- Modify: `style.css` — append contact and footer styles

- [ ] **Step 1: Replace contact section in `index.html`**

Replace:
```html
    <section class="contact" id="contact"></section>
```
With:
```html
    <section class="contact" id="contact">
      <div class="container">
        <p class="section-label">Say Hello</p>
        <h2 class="contact-heading">Let's Work Together</h2>
        <p class="contact-subtitle">
          Open to illustration commissions, design projects, and brand collaborations.
        </p>
        <!-- REPLACE: Your actual email address -->
        <a href="mailto:your@email.com" class="contact-email">your@email.com</a>
        <div class="contact-socials">
          <!-- REPLACE: Update href values with your actual profile URLs -->
          <a href="https://behance.net/yourprofile" target="_blank" rel="noopener" aria-label="Behance" class="social-link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
            </svg>
          </a>
          <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener" aria-label="LinkedIn" class="social-link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          <a href="https://instagram.com/yourhandle" target="_blank" rel="noopener" aria-label="Instagram" class="social-link">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Replace footer in `index.html`**

Replace:
```html
  <footer class="footer" id="footer"></footer>
```
With:
```html
  <footer class="footer" id="footer">
    <div class="container">
      <!-- REPLACE: Your actual name and update year -->
      <p class="footer-copy">&copy; 2026 Your Name. All rights reserved.</p>
    </div>
  </footer>
```

- [ ] **Step 3: Append contact and footer styles to `style.css`**

```css
/* === Contact === */
.contact {
  background: var(--color-contact-bg);
  padding: 6rem 0;
  text-align: center;
}
.contact-heading {
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  color: #fff;
  margin-bottom: 0.75rem;
}
.contact-subtitle {
  color: rgba(255, 255, 255, 0.7);
  max-width: 480px;
  margin: 0 auto 2.5rem;
  line-height: 1.7;
}
.contact-email {
  display: inline-block;
  font-family: var(--font-heading);
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  color: var(--color-accent);
  border-bottom: 2px solid var(--color-accent);
  padding-bottom: 2px;
  margin-bottom: 2.5rem;
  transition: color 0.2s, border-color 0.2s;
}
.contact-email:hover { color: #fff; border-color: #fff; }
.contact-socials {
  display: flex;
  gap: 1.25rem;
  justify-content: center;
}
.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px; height: 44px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}
.social-link:hover {
  color: #fff;
  border-color: var(--color-accent);
  background: rgba(72, 201, 176, 0.15);
}

/* === Footer === */
.footer {
  background: var(--color-footer-bg);
  padding: 1.5rem 0;
  text-align: center;
}
.footer-copy {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.05em;
}
```

- [ ] **Step 4: Reload browser and verify**

- Contact section has deep navy (#1B4F72) background — wave from portfolio flows seamlessly into it
- "Let's Work Together" heading in white
- Email address in teal; hover turns it white
- Three social icon circles with border; hover adds teal accent glow
- Footer appears below in a darker navy (#0d2233)

- [ ] **Step 5: Commit**

```bash
git add index.html style.css
git commit -m "feat: add contact section and footer"
```

---

### Task 9: Active nav highlight via IntersectionObserver

**Files:**
- Modify: `main.js` — append IntersectionObserver

- [ ] **Step 1: Append IntersectionObserver to `main.js`**

```js
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
```

- [ ] **Step 2: Reload browser and verify**

- Scroll slowly through the page
- When the About section is ~40% in view, the "About" nav link shows a teal underline
- Scrolling into Education clears "About" and activates "Education"
- Same pattern for Portfolio and Contact
- Hero section doesn't have a nav link so nothing is active at top of page (expected)

- [ ] **Step 3: Commit**

```bash
git add main.js
git commit -m "feat: add IntersectionObserver for active nav section highlight"
```

---

### Task 10: Responsive polish and final review

**Files:**
- Modify: `style.css` — append mobile padding adjustments

- [ ] **Step 1: Test at 375px viewport in DevTools**

Open DevTools → set viewport width to 375px. Check each section:
- Hero: name text doesn't overflow (`clamp` prevents this — confirm no horizontal scroll)
- About: single-column, portrait centered at max-width 280px
- Education: single-column cards
- Portfolio: single-column cards, filter buttons wrap to two rows gracefully
- Contact: email text wraps cleanly, social icons centered
- Nav hamburger: opens and closes, all links work

- [ ] **Step 2: Append mobile padding adjustments to `style.css`**

```css
/* === Mobile adjustments === */
@media (max-width: 768px) {
  .about    { padding: 4rem 0 calc(var(--wave-height) + 3rem); }
  .education { padding: 4rem 0 calc(var(--wave-height) + 3rem); }
  .portfolio { padding: 4rem 0 calc(var(--wave-height) + 3rem); }
  .contact  { padding: 4rem 0; }
}
```

- [ ] **Step 3: Test at 900px viewport (tablet)**

- About: still two-column (breakpoint is 768px)
- Education: 2-column grid
- Portfolio: 2-column grid
- Nav: full links visible, no hamburger

- [ ] **Step 4: Do a full end-to-end pass**

Scroll from top to bottom at desktop width (1280px). Verify:
- [ ] Hero gradient is animating
- [ ] All 4 wave transitions between sections are seamless
- [ ] Portfolio filter works (try each category)
- [ ] Lightbox opens and closes (click outside, Escape, × button)
- [ ] Nav highlight updates on scroll
- [ ] "Get in Touch" button in About scrolls to Contact section

- [ ] **Step 5: Commit**

```bash
git add style.css
git commit -m "fix: mobile padding adjustments and responsive polish"
```

---

### Task 11: Wrap up — placeholder inventory

**Files:** None — documentation only

- [ ] **Step 1: Note all placeholders before publishing**

All items marked `<!-- REPLACE: ... -->` in `index.html`:

| Location | What to replace |
|----------|----------------|
| `<title>` | "Your Name — Portfolio" |
| `.nav-logo` text | "Your Name" |
| `.hero-name` | "Your Name" |
| `.hero-tagline` | "Illustrator & Graphic Designer" |
| `.about-portrait img` src | Path to your actual photo |
| About `<h2>` text | Your actual name |
| About bio paragraphs | Your actual bio |
| 3 edu-card entries | Your actual degrees/courses |
| 9 portfolio card `src` | Your actual work images |
| 9 portfolio card `data-title` + `data-description` | Your actual project info |
| `contact-email` href + text | your@email.com |
| 3 social `href` values | Your actual profile URLs |
| Footer copyright name | Your actual name |

- [ ] **Step 2: Final commit**

```bash
git add -A
git commit -m "feat: complete portfolio website — ready for content swap-in"
```

- [ ] **Step 3: Preview locally**

```bash
cd /Users/emily/Development/Demo
python3 -m http.server 8080
```

Open `http://localhost:8080` in browser. This serves the site over HTTP (Google Fonts will load correctly, unlike `file://`).
