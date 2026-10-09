# Fjäll Affordable Development

A responsive English / Bahasa Indonesia website for Fjäll Group's mass-scale development product. Built with plain HTML, CSS, browser-native JavaScript modules, and locally hosted fonts. No framework, bundler, compilation, API keys, or production npm packages are needed. Content and images come from the supplied commercial deck.

## GitHub Pages

The repository itself is the deployable website. All asset paths are relative, including images, fonts, the favicon, and the downloadable commercial deck, so both a custom domain and the `/FAD/` project path work.

For **https://jplovensa.github.io/FAD/**:

1. Open the repository's **Settings → Pages**.
2. Set **Source** to **Deploy from a branch**.
3. Choose **main** and **/ (root)**, then save.

If these settings already match, pushing to `main` is sufficient. GitHub's Pages deployment will publish the update. `.nojekyll` keeps the site as plain static files. There is no application build step to configure. GitHub repository file-view URLs do not run the website; use the Pages URL above.

If the repository currently uses **GitHub Actions** as its Pages source, switch it to the branch settings above. No custom deployment workflow is required.

## Run locally

With Node.js 20+:

```sh
cd /workspace/FAD
npm run dev -- --port 5173
```

No `npm install` is needed to run or build the website. You can also serve the repository with any standard static HTTP server. Use an HTTP server rather than opening `index.html` through `file://`, because native JavaScript modules require HTTP/HTTPS.

## Portable static build

```sh
npm run build
npm run preview -- --port 4173
```

`build` copies the website into `dist/`; it does not compile or transform the files. Deploy `dist/` to any static host. To reproduce the GitHub Pages repository path locally:

```sh
npm run preview -- --port 4174 --base /FAD
```

The source and build both use the same structure: `index.html`, `src/`, `public/`, and `.nojekyll`. All typography uses locally hosted Inter.

## Typography and design

All typography is locally hosted **Inter**, including headings, body text, controls, diagrams, and enquiry dialogs. Inter's open-source licence is in `public/fonts/`. No serif font or licensed font file is required.

FAD is presented as a scalable building solution for residential housing, educational facilities, and accommodation. The site follows Amoda's solution-first structure, broad architectural hero, consultation calls to action, rounded cards, and project process. Photography and specifications come from the supplied Fjäll deck, not from Amoda.

Type 36 is a documented reference example, not the entire FAD offering. Its exterior choices, illustrative room-zoning diagram, and material specification remain available further down the page. The programme planner captures quantities without publishing a unit price. Every configuration requires its own project specification and proposal. The floor plan is a discussion illustration, not an approved construction drawing.

Design reference: https://www.amoda.id/. Its page content was reviewed; external media asset access in the cloud environment is restricted. No third-party project claims, customer counts, or proprietary reference assets are copied.

## Lead enquiries

The form qualifies enquiries by organisation, location, project type, number of units, timeline, and additional requirements. It validates required fields and consent, then shows a project brief. Visitors continue to WhatsApp and send the prepared message to **+62 812 3753 5508**, the contact number in the deck. Messages are not automatically sent. No enquiry data is stored by this website. Only the language preference is stored in the browser.

This is a WhatsApp enquiry workflow, not a CRM/database integration. Contact routing is in `src/main.js`. Both language versions are in `src/content.js`. The bilingual privacy explanation is in the footer.

Website prices and monetary estimates have been removed; proposals are project-specific. The source PDF remains available in its original form. Assembly time refers to superstructure assembly, not full project completion. Images are concepts, not completed projects. Final prices, scope, engineering suitability, certifications, procurement qualifications, and delivery commitments require project-specific confirmation. The commercial deck is available at `public/fjall-commercial-deck.pdf`.

## Browser tests

npm packages are used only for browser testing:

```sh
npm ci
# Cloud environment:
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm test

# Another machine:
npx playwright install chromium
npm test
```

The same functional tests run against the raw static source and the static build at `/FAD/`. They cover language switching, preference persistence, form input preservation, government enquiries, mandatory fields, the WhatsApp brief, calculator boundaries, all exterior images, keyboard-accessible design-view tabs, bilingual specifications, font loading, PDF availability, and desktop/tablet/mobile layouts. Tests do not send enquiries.

Each cloud task is already isolated. Use this checkout; do not create a Git worktree unless explicitly requested.


### FAD identity and film

The complete logo is `public/brand/fad-logo.svg`, with embedded Inter for consistent export. FAD’s modular symbol is supplied as `public/brand/fad-mark.svg` and the group logo as `public/brand/fjall-group.png` (the matching asset from the group website). The palette follows Fjäll Group forest green `#193a32`, teal `#398780`, and GreenShift mint `#a1e5cf`, with `#f5f4ed` paper. Typography remains locally hosted Inter.

The group website’s FAD concept trailer is hosted locally at `public/video/fad-system.mp4`. The optional muted introduction lasts at most 4.5 seconds, supports immediate skip / Escape, restores focus, and runs once per tab session. Reduced motion, data saving, autoplay rejection, and video failure bypass it. The page never depends on loading the video. The complete concept film has playback controls within the page.

Copy describes project-specific planning, build coordination, and phased programmes. Applications are reviewed around the brief; no completed projects, certifications, or fixed delivery commitments are implied.
