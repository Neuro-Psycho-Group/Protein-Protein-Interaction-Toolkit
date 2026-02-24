# PPI Guidebook

An interactive, beginner-friendly guidebook to Protein–Protein Interactions for neuroscience undergraduates.

## Deployment

This site is designed for **GitHub Pages** — no build step, no dependencies, no server required.

### How to deploy

1. Create a new GitHub repository
2. Upload all files maintaining the folder structure
3. Go to **Settings → Pages → Source → Deploy from branch → main → / (root)**
4. Your site will be live at `https://yourusername.github.io/repo-name/`

### File structure

```
├── index.html                  # Landing page
├── 01-ppi-basics.html          # Chapter 1: PPI Fundamentals
├── 02-databases.html           # Chapter 2: PPI Databases
├── 03-enrichment.html          # Chapter 3: GO & Enrichment
├── 04-network-analysis.html    # Chapter 4: Network Analysis
├── 05-worked-examples.html     # Chapter 5: Worked Examples
├── 06-best-practices.html      # Chapter 6: Best Practices
├── 07-references.html          # Annotated References
└── assets/
    ├── css/
    │   ├── main.css            # Design system
    │   └── animations.css      # Animation utilities
    └── js/
        ├── nav.js              # Navigation, scroll, accordion
        ├── network-viz.js      # D3.js network visualisation
        └── interactive.js      # Tabs, tooltips, sliders
```

### External dependencies (CDN, no install needed)

- **D3.js v7** (via cdnjs) — network visualisation on landing page and chapter 1
- **Google Fonts** — Syne, DM Sans, DM Mono

Both are loaded from CDN in the HTML files. The site works without them but looks degraded.

## Content

All biological content is reviewed against primary literature. References with DOIs are in `07-references.html`.

## Licence

Educational use. Cite primary sources as listed in Chapter 7.
