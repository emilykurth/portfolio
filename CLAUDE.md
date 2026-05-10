# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Site

No build step. Open `index.html` directly in a browser, or serve locally:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Use the HTTP server (not `file://`) so Google Fonts loads correctly.

## Architecture

Three files, no framework, no dependencies:

- **`index.html`** — all page structure. One section per feature: `#hero`, `#about`, `#education`, `#portfolio`, `#contact`. The lightbox overlay and nav are also here.
- **`style.css`** — all styles. Organized in section order matching the HTML. CSS custom properties in `:root` define the entire design system (colors, fonts, spacing). Wave dividers are inline SVGs inside each section, absolutely positioned at the bottom with `fill` matching the next section's background color.
- **`main.js`** — four independent features appended in order: nav scroll/hamburger, portfolio filter, lightbox, IntersectionObserver active-nav highlight. `openLightbox` and `closeLightbox` are intentionally global (required by `onclick` attributes on portfolio cards).

## Key Design Decisions

**CSS variables:** All colors and dimensions live in `:root`. Never use raw hex values for theme colors — reference the variable. The contact section background intentionally uses `--color-contact-bg` (same value as `--color-primary`) to allow independent updates.

**Portfolio cards:** Each card stores its own display data in `data-title` and `data-description` attributes. The lightbox reads these via `dataset` and writes them with `textContent` only — never `innerHTML`.

**Filter:** Cards are shown/hidden by toggling the `.hidden` CSS class (not inline `style.display`), keeping visibility logic in CSS.

**Section waves:** Each section (except contact) has a `div.section-wave` at the bottom containing an inline SVG. The `fill` color must match the background of the section that follows it. Changing a section's background color requires updating the wave `fill` of the section above it.

## Replacing Placeholder Content

All placeholders are marked with `<!-- REPLACE: ... -->` comments in `index.html`. Items to swap before publishing: name (in `<title>`, `.nav-logo`, `.hero-name`), hero tagline, portrait `src`, bio text, 3 education entries, 9 portfolio card `src`/`data-title`/`data-description`, email `href`, social link `href` values, footer copyright name.

## Deployment

The site is hosted on GitHub Pages from `main` at `https://emilykurth.github.io/portfolio`. Push to `main` to deploy.
