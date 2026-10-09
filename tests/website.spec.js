import { test, expect } from '@playwright/test';

test('language switching translates the page, preserves input, and survives reload', async ({ page }) => {
  await page.goto('./');
  await page.locator('[name=name]').fill('Project Partner');
  await page.getByRole('button', { name: 'Bahasa Indonesia', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'id');
  await expect(page.locator('h1')).toContainText('Hunian lebih baik.');
  await expect(page.locator('.form-submit')).toContainText('Siapkan pertanyaan proyek');
  await expect(page.locator('[name=sector] option[value=sectorGov]')).toHaveText('Program perumahan pemerintah');
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

test('budget calculation updates and carries the unit count into the enquiry', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: '500', exact: true }).click();
  await expect(page.locator('#budget-total')).toHaveText('Rp 25,000,000,000');
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
  await expect(page.locator('#project-brief')).toContainText('Program perumahan pemerintah');
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
    expect(await page.evaluate(async () => (await document.fonts.load('16px "Manrope Variable"')).length)).toBe(1);
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
    if (width <= 760) {
      await page.locator('.menu-toggle').click();
      await expect(page.locator('#mobile-nav')).toBeVisible();
      await page.locator('#mobile-nav a[href="#contact"]').click();
      await expect(page.locator('#mobile-nav')).not.toBeVisible();
    } else await expect(page.locator('.menu-toggle')).not.toBeVisible();
    expect(errors).toEqual([]);
  });
}
