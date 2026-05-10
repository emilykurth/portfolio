# Digital Portfolio Website — Design Spec
**Date:** 2026-05-10  
**Status:** Approved

---

## Overview

A single-page static portfolio website targeting future employers and freelance clients. The site showcases illustration, graphic design, and branding/logo work. Built with plain HTML/CSS/JS — no framework, no build step. Ocean-themed visual identity: minimal and clean with distinctive personality.

---

## Architecture

**Files:**
- `index.html` — single page, all sections
- `style.css` — all styles including theme, layout, animations
- `main.js` — filtering, lightbox, smooth scroll, nav highlight

**Deployment:** Any static host (GitHub Pages, Netlify, etc.). No server or build step required.

---

## Page Structure

Sections in scroll order:

1. **Hero** — Full-viewport-height. Name (large), tagline ("Illustrator & Graphic Designer"), animated ocean CSS gradient background, down-arrow scroll nudge.
2. **About/Bio** — Two-column: portrait placeholder left, bio paragraph right.
3. **Education** — Card or timeline list of degrees/courses/certifications (2–3 placeholder entries).
4. **Portfolio Grid** — Masonry-style grid of work samples with category filter buttons (All / Illustration / Graphic Design / Branding). Clicking a card opens a lightbox.
5. **Contact** — `mailto:` link + social/professional icon links (Behance, LinkedIn, Instagram).
6. **Footer** — Copyright, name.

**Navigation:** Sticky top nav with anchor links (`#about`, `#education`, `#portfolio`, `#contact`). Active section highlighted via IntersectionObserver. Collapses to hamburger on mobile.

---

## Visual Design

**Color palette:**
| Role | Value | Description |
|------|-------|-------------|
| Background | `#F8F5F0` | Warm off-white / sand |
| Primary | `#1B4F72` | Deep ocean navy |
| Accent | `#48C9B0` | Seafoam teal |
| Text | `#2C3E50` | Dark slate |
| Section bg (alt) | `#EAF4F4` | Pale aqua |

**Typography:**
- Headings: *Playfair Display* (Google Fonts, serif)
- Body: *Inter* (Google Fonts, sans-serif)

**Visual details:**
- SVG wave dividers between sections (CSS-generated)
- Hero: subtle animated CSS gradient simulating slow tide shift
- Portfolio cards: slight lift + teal shadow on hover
- Nav: frosted/semi-transparent on scroll
- Placeholder images: teal-toned, consistent style

**Responsive:** 3-column → 2-column → 1-column portfolio grid. Single-column layout on mobile. Hamburger nav on small screens.

---

## Interactions

**Portfolio filtering:**
- Buttons: All / Illustration / Graphic Design / Branding
- Each card has a `data-category` attribute
- JS toggles visibility with CSS transitions on filter click

**Lightbox:**
- Triggered by clicking any portfolio card
- Full-screen overlay: larger image, project title, short description
- Dismiss: click outside or press Escape
- ~30 lines of vanilla JS, no library

**Smooth scroll:** Native CSS `scroll-behavior: smooth` + JS for active nav highlight via IntersectionObserver.

---

## Placeholder Content

| Section | Placeholder |
|---------|-------------|
| Hero | Your name + tagline |
| Bio | Short placeholder paragraph with name as `<h2>` |
| Education | 2–3 entries: degree, institution, year |
| Portfolio | 9 images (3 per category) from a teal-toned placeholder service |
| Contact | `your@email.com` + 3 social icon links |

All placeholder text and images are clearly marked with comments in HTML for easy swap-out.

---

## Out of Scope

- Contact form with backend / email sending (use `mailto:` link instead)
- CMS or admin interface
- Blog or writing section
- Dark mode toggle
- Animations beyond CSS transitions and the hero gradient
