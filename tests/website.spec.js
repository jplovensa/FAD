import { test, expect } from '@playwright/test';

// Other flow checks bypass the optional introduction; dedicated tests cover it.
test.beforeEach(async ({ page }, testInfo) => { if (testInfo.title.startsWith('video intro')) return; await page.addInitScript(() => sessionStorage.setItem('fad-intro-seen', '1')); });

test('language switching translates the page, preserves input, and survives reload', async ({ page }) => {
  await page.goto('./');
  await page.locator('[name=name]').fill('Project Partner');
  await page.getByRole('button', { name: 'Bahasa Indonesia', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'id');
  await expect(page.locator('h1')).toContainText('Bangun lebih cerdas.');
  await expect(page.locator('.form-submit')).toContainText('Siapkan pertanyaan proyek');
  await expect(page.locator('[name=sector] option[value=sectorGov]')).toHaveText('Program pemerintah & sektor publik');
  await expect(page.locator('[name=name]')).toHaveValue('Project Partner');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'id');
});

test('government CTA qualifies the project and required fields prevent an empty enquiry', async ({ page }) => {
  await page.goto('./');
  await page.locator('[data-project=sectorGov]').click();
  await expect(page.locator('[name=sector]')).toHaveValue('sectorGov');
  await page.locator('.form-submit').click();
  await expect(page.locator('#review-dialog')).not.toBeVisible();
  expect(await page.locator('#lead-form').evaluate(form => form.checkValidity())).toBe(false);
});

test('programme planner carries its scale into the enquiry without a price', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: '500', exact: true }).click();
  await expect(page.locator('#budget-total')).toHaveText('500');
  await page.locator('#budget-enquiry').click();
  await expect(page.locator('[name=units]')).toHaveValue('500');
  await page.locator('#budget-units').fill('0');
  await page.locator('#budget-units').blur();
  await expect(page.locator('#budget-units')).toHaveValue('1');
  await expect(page.locator('#units-minus')).toBeDisabled();
});

test('a complete enquiry produces a review and an encoded WhatsApp brief without sending', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: 'Bahasa Indonesia', exact: true }).click();
  const fields = { name: 'Test Partner', org: 'Sample Housing Agency', email: 'partner@example.com', phone: '+628123456789', location: 'Bandung, Jawa Barat', units: '500', message: 'Need technical documents & site review <before> procurement.' };
  for (const [name, value] of Object.entries(fields)) await page.locator(`[name=${name}]`).fill(value);
  await page.locator('[name=sector]').selectOption('sectorGov');
  await page.locator('[name=timeline]').selectOption('timeline3');
  await page.locator('[name=consent]').check();
  await page.locator('.form-submit').click();
  await expect(page.locator('#review-dialog')).toBeVisible();
  await expect(page.locator('#project-brief')).toContainText('Program pemerintah & sektor publik');
  const destination = new URL(await page.locator('#send-whatsapp').getAttribute('href'));
  expect(destination.origin + destination.pathname).toBe('https://wa.me/6281237535508');
  expect(destination.searchParams.get('text')).toContain(fields.message);
  expect(destination.searchParams.get('text')).toContain('Bahasa pilihan: Bahasa Indonesia');
  expect(await page.locator('#project-brief script').count()).toBe(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('#review-dialog')).not.toBeVisible();
  await expect(page.locator('[name=name]')).toHaveValue('Test Partner');
});

test('exterior selection loads the matching image and the deck download is available', async ({ page, request }) => {
  await page.goto('./');
  for (const [name, image] of [['Earthy brown', 'brown'], ['Golden yellow', 'yellow'], ['Royal purple', 'purple'], ['Olive green', 'olive']]) {
    const button = page.getByRole('button', { name, exact: true });
    await button.click();
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#product-image')).toHaveAttribute('src', `./public/images/home-${image}.jpg`);
    await expect.poll(() => page.locator('#product-image').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  }
  const response = await request.get('./public/fjall-commercial-deck.pdf');
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('application/pdf');
});

for (const width of [320, 390, 768, 1440]) {
  test(`English and Indonesian layouts fit ${width}px screens`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('./');
    expect(await page.evaluate(async () => (await document.fonts.load('16px "Inter"')).length)).toBe(1);
    await page.evaluate(() => { document.querySelectorAll('img').forEach(img => img.loading = 'eager'); });
    await expect.poll(() => page.evaluate(() => [...document.images].every(img => img.complete && img.naturalWidth > 0))).toBe(true);
    for (const language of ['English', 'Bahasa Indonesia']) {
      await page.getByRole('button', { name: language, exact: true }).click();
      const overflow = await page.evaluate(() => [...document.querySelectorAll('.hero-visual,.hero-copy,.metrics,.product,.government,.calculator,.lead-form,.footer-top')].filter(el => {
        const rect = el.getBoundingClientRect(); return rect.left < 0 || rect.right > innerWidth + 1;
      }).map(el => el.className));
      expect(overflow).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    if (width <= 960) {
      await page.locator('.menu-toggle').click();
      await expect(page.locator('#mobile-nav')).toBeVisible();
      await page.locator('#mobile-nav a[href="#contact"]').click();
      await expect(page.locator('#mobile-nav')).not.toBeVisible();
    } else await expect(page.locator('.menu-toggle')).not.toBeVisible();
    expect(errors).toEqual([]);
  });
}

test('standard-home views show the plan and specification with keyboard and bilingual support', async ({ page }) => {
  await page.goto('./');
  await page.locator('#solution').getByRole('tab', { name: 'Floor plan', exact: true }).click();
  await expect(page.locator('#view-plan')).toBeVisible();
  await expect(page.locator('#view-exterior')).not.toBeVisible();
  await expect(page.locator('#view-plan')).toContainText('Illustrative zoning');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#solution').getByRole('tab', { name: 'Standard specification', exact: true })).toBeFocused();
  await expect(page.locator('#view-specification')).toBeVisible();
  await expect(page.locator('#view-specification')).toContainText('10 primary composite panels');
  await page.getByRole('button', { name: 'Bahasa Indonesia', exact: true }).click();
  await expect(page.locator('#solution').getByRole('tab', { name: 'Spesifikasi standar', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#view-specification')).toContainText('Fondasi');
  await page.locator('#solution').getByRole('tab', { name: 'Denah', exact: true }).click();
  await expect(page.locator('#view-plan')).toContainText('Kamar tidur 01');
  await page.keyboard.press('Home');
  await expect(page.locator('#solution').getByRole('tab', { name: 'Eksterior', exact: true })).toBeFocused();
  await expect(page.locator('#finish-controls')).toBeVisible();
});

test('the website leads with multiple solutions and uses Inter throughout', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('.hero')).not.toContainText('Type 36');
  await expect(page.locator('#applications')).toContainText('Housing & residential');
  await expect(page.locator('#applications')).toContainText('Education & learning');
  await expect(page.locator('#applications')).toContainText('Dormitories & accommodation');
  expect(await page.evaluate(() => Boolean(document.querySelector('#applications').compareDocumentPosition(document.querySelector('#solution')) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  expect(await page.evaluate(() => [...document.querySelectorAll('body *:not(source)')].map(el => getComputedStyle(el).fontFamily.split(',')[0].trim().replaceAll('"', '')).filter(font => font !== 'Inter'))).toEqual([]);
  await page.locator('#applications [data-project=sectorEdu]').click();
  await expect(page.locator('[name=sector]')).toHaveValue('sectorEdu');
  await expect(page.locator('#budget')).toContainText('there is no universal unit price');
  await page.getByRole('button', { name: 'Bahasa Indonesia', exact: true }).click();
  await expect(page.locator('.hero')).not.toContainText('Tipe 36');
  await expect(page.locator('#applications')).toContainText('Pendidikan & pembelajaran');
});

test('brand assets and video load, pricing is project specific', async ({page, request}) => {
 await page.goto('./');
 await expect(page.locator('.footer-group img')).toHaveAttribute('alt','Fjäll Group');
 await expect(page.locator('body')).not.toContainText('Rp 50');
 await expect(page.locator('#solution .price')).toContainText('PROJECT-SPECIFIC PROPOSAL');
 for (const path of ['public/brand/fad-mark.svg','public/brand/fjall-group.png','public/video/fad-opening.mp4']) expect((await request.get('./'+path)).ok()).toBe(true);
 await expect(page.locator('.brand-film video')).toHaveAttribute('controls','');
});
test('video intro is skippable and only shown once per session', async ({page}) => {
 await page.goto('./');
 await page.evaluate(()=>sessionStorage.removeItem('fad-intro-seen'));
 await page.addInitScript(() => { if (!sessionStorage.getItem('intro-test-started')) { sessionStorage.removeItem('fad-intro-seen'); sessionStorage.setItem('intro-test-started','1'); } });
 await page.reload();
 await expect(page.locator('.video-intro')).toBeVisible();
 await expect(page.locator('#app')).toHaveJSProperty('inert', true);
 await page.locator('.intro-skip').click();
 await expect(page.locator('.video-intro')).toHaveCount(0);
 await expect(page.locator('#app')).toHaveJSProperty('inert', false);
 await page.reload();
 await expect(page.locator('.video-intro')).toHaveCount(0);
});
test('reduced motion bypasses the intro', async ({page}) => {
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('./'); await page.evaluate(()=>sessionStorage.removeItem('fad-intro-seen')); await page.reload();
 await expect(page.locator('.video-intro')).toHaveCount(0);
});
test('video intro closes automatically if the visitor does not skip', async ({page}) => {
 await page.goto('./');
 await page.evaluate(()=>sessionStorage.removeItem('fad-intro-seen'));
 await page.reload();
 await expect(page.locator('.video-intro')).toBeVisible();
 await expect(page.locator('.video-intro')).toHaveCount(0, {timeout:6500});
 await expect(page.locator('#app')).toHaveJSProperty('inert', false);
});

for (const [key,sector,title] of [['workers','sectorCorp','Worker accommodation.'],['school','sectorEdu','Schools & learning campuses.'],['hospital','sectorHealth','Hospitals & healthcare campuses.']]) {
 test(`${key} presentation has independent views, keyboard navigation and an application enquiry`, async ({page}) => {
  await page.goto('./');const section=page.locator('#'+key);
  await expect(section.locator('h2')).toContainText(title);
  await section.getByRole('tab',{name:'Illustrative layout',exact:true}).click();
  await expect(section.locator('#'+key+'-view-layout')).toBeVisible();
  await expect(page.locator('#view-exterior')).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(section.locator('#'+key+'-view-spec')).toBeVisible();
  await expect(section.getByRole('tab',{name:'Project specification',exact:true})).toBeFocused();
  await expect(section.locator('.spec-table')).toContainText('Scope & approvals');
  await page.locator('[name=message]').fill('Existing site brief');
  await section.locator('[data-application]').click();
  await expect(page.locator('[name=sector]')).toHaveValue(sector);
  await expect(page.locator('[name=message]')).toHaveValue('Existing site brief\n'+title);
  await page.getByRole('button',{name:'Bahasa Indonesia',exact:true}).click();
  await expect(section.getByRole('tab',{name:'Spesifikasi proyek',exact:true})).toHaveAttribute('aria-selected','true');
  await expect(section.locator('.spec-table')).toContainText('Lingkup & persetujuan');
 });
}
test('new assets have sharp home images, transparent logo panels and a new opening film', async ({page,request})=>{
 await page.goto('./');
 for(const color of ['olive','brown','yellow','purple']){
  await page.locator(`[data-finish=${color}]`).click();
  await expect.poll(()=>page.locator('#product-image').evaluate(img=>img.complete?img.naturalWidth:0)).toBeGreaterThan(1400);
 }
 for(const logo of ['.hero-end .group-logo','.footer-group .group-logo'])expect(await page.locator(logo).evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
 expect((await request.get('./public/video/fad-opening.mp4')).ok()).toBe(true);
 await expect(page.locator('.brand-film source')).toHaveAttribute('src','./public/video/fad-opening.mp4');
});
test('architectural icons render through WebGL and retain a no-WebGL fallback', async ({page})=>{
 await page.goto('./');await page.locator('.metrics').scrollIntoViewIfNeeded();
 await expect.poll(()=>page.locator('.metrics [data-rendered=webgl]').count()).toBe(4);
 const canvas=page.locator('.metrics canvas').first();
 expect(await canvas.evaluate(c=>c.getContext('2d').getImageData(0,0,c.width,c.height).data.some((v,i)=>i%4===3&&v>0))).toBe(true);
 await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl'||type==='webgl2'?null:original.call(this,type,...args);};});
 await page.reload();await expect(page.locator('.metrics .spatial-fallback').first()).toBeVisible();
 await expect(page.locator('[data-rendered=webgl]')).toHaveCount(0);
});
