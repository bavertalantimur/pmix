# PMGIX — Frontend Architecture

Vanilla HTML, CSS, and JavaScript scaffold for a consulting company website. Placeholder structure only — no real content.

## Project structure

```
pmgix/
├── index.html
├── pages/
│   ├── about.html
│   ├── services.html
│   ├── industries.html
│   ├── issues.html
│   ├── academy.html
│   ├── careers.html
│   └── contact.html
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── css/
│   ├── variables.css      # Design tokens
│   ├── base.css           # Minimal defaults, typography, sections
│   ├── layout.css         # Containers, grids, flex
│   ├── components.css     # BEM UI components
│   └── responsive.css     # Breakpoints and media queries
├── js/
│   ├── main.js            # Component loading, bootstrap
│   └── navigation.js      # Mobile menu, routes, active states
├── components/
│   ├── header.html
│   └── footer.html
└── README.md
```

## Getting started

Component loading uses `fetch()` — run a local server from the `pmgix` folder:

```bash
python -m http.server 8080
# or: npx serve .
```

Open `http://localhost:8080`.

## CSS load order

1. `variables.css` — theme tokens
2. `base.css` — document defaults
3. `layout.css` — structure (mobile-first base)
4. `components.css` — UI blocks (BEM)
5. `responsive.css` — breakpoints (640 / 768 / 1024px)

## JavaScript

| File | Role |
|------|------|
| `main.js` | Loads `header` / `footer` partials, then calls `initNavigation()` |
| `navigation.js` | Route resolution, mobile menu, active nav state |

## HTML components

```html
<div data-component="header"></div>
<div data-component="footer"></div>
```

Set `data-page` on `<body>` for active navigation: `home`, `about`, `services`, `industries`, `issues`, `academy`, `careers`, `contact`.

## Adding content later

1. Fill meta tags, titles, and copy in HTML.
2. Update `ROUTES` in `js/navigation.js` and nav links in `components/header.html`.
3. Add assets under `assets/`.
4. Tune tokens in `css/variables.css`.

## Optional additions (when needed)

These were intentionally omitted to keep the scaffold lean:

- `reset.css` — base.css includes minimal normalization
- `utilities.css` — use BEM components or page-specific rules
- `loader.html` / page loader
- `animations.js` — scroll reveals
- `lazy-load.js` — image lazy loading
- `modal.js` / `accordion.js` — interactive widgets
- `css/pages/*.css` — page-specific overrides

## Browser support

Modern browsers with ES modules and `fetch`.
