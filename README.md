# Fjäll Affordable Development

A responsive English / Bahasa Indonesia website for Fjäll Group's mass housing product. Built with plain HTML, CSS, browser-native JavaScript modules, and locally hosted fonts. No framework, bundler, compilation, API keys, or production npm packages are needed. Content and images come from the supplied commercial deck.

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

The source and build both use the same structure: `index.html`, `src/`, `public/`, and `.nojekyll`. The Manrope font and its licence are in `public/fonts/`.

## Lead enquiries

The form qualifies enquiries by organisation, location, project type, number of units, timeline, and additional requirements. It validates required fields and consent, then shows a project brief. Visitors continue to WhatsApp and send the prepared message to **+62 812 3753 5508**, the contact number in the deck. Messages are not automatically sent. No enquiry data is stored by this website. Only the language preference is stored in the browser.

This is a WhatsApp enquiry workflow, not a CRM/database integration. Contact routing is in `src/main.js`. Both language versions are in `src/content.js`. The bilingual privacy explanation is in the footer.

The calculator uses the deck's indicative Rp 50 million base unit value. Assembly time refers to superstructure assembly, not full project completion. Images are concepts, not completed projects. Final prices, scope, engineering suitability, certifications, procurement qualifications, and delivery commitments require project-specific confirmation. The commercial deck is available at `public/fjall-commercial-deck.pdf`.

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

The same functional tests run against the raw static source and the static build at `/FAD/`. They cover language switching, preference persistence, form input preservation, government enquiries, mandatory fields, the WhatsApp brief, calculator boundaries, all exterior images, PDF availability, and desktop/tablet/mobile layouts. Tests do not send enquiries.

Each cloud task is already isolated. Use this checkout; do not create a Git worktree unless explicitly requested.
