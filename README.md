# Fjäll Affordable Development

A responsive English / Bahasa Indonesia website for Fjäll Group's mass housing product, built with Vite and vanilla JavaScript. Content and local imagery are sourced from the supplied commercial deck.

## Run locally

Requires Node.js 20.19+ or 22.12+ and npm. The current environment uses Node.js 24.

```sh
cd /workspace/FAD
npm ci
npm run dev -- --port 5173
```

## Production

```sh
npm run build
npm run preview -- --port 4173
```

Deploy the `dist/` directory to any static host. The website uses no API keys, external font requests, or required backend services.

## Lead enquiries

The form qualifies enquiries by organisation, location, project type, number of units, timeline, and additional requirements. It validates required fields and consent, then shows an editable-through-the-form project brief. The visitor continues to WhatsApp and sends the prepared message to **+62 812 3753 5508**, the contact number provided in the deck. No message is automatically sent, and no enquiry data is stored by this website. Browser storage is used only for language preference.

This is a WhatsApp enquiry workflow, not a CRM/database integration. Contact and routing behaviour are in `src/main.js`. Both language versions are in `src/content.js`. The bilingual privacy explanation is available in the footer.

The calculator uses the deck's indicative Rp 50 million base unit value. Assembly time refers to superstructure assembly, not total project completion. Images are identified as concepts, not completed projects. All final prices, scope, engineering suitability, certifications, procurement qualifications, and delivery commitments require project-specific confirmation. The original deck is downloadable at `/fjall-commercial-deck.pdf`.

## Browser tests

```sh
# With the cloud environment's installed Chromium:
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm test

# On another machine:
npx playwright install chromium
npm test
```

Tests cover both languages, preference persistence, form input preservation, government project qualification, mandatory fields, the WhatsApp brief, calculator boundaries, exterior images, PDF availability, and desktop/tablet/mobile layouts. Tests never send enquiries.

Each cloud task is already isolated. Use this checkout; do not create a Git worktree unless explicitly requested.
