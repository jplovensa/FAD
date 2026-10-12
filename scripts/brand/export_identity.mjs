// Start npm run dev first. Playwright Chromium exports the vector originals.
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'/usr/bin/chromium'});
const page=await browser.newPage({deviceScaleFactor:1});
await mkdir('public/brand/exports',{recursive:true});
for(const name of ['fad-logo','fad-logo-reverse','fad-logo-mono','fad-mark','fad-mark-dark','fad-mark-mono','fad-identity-board']){
 await page.goto(`http://127.0.0.1:5173/public/brand/${name}.svg`);
 const box=await page.locator('svg').evaluate(s=>({width:s.viewBox.baseVal.width,height:s.viewBox.baseVal.height}));
 const width=name==='fad-identity-board'?2400:name.includes('logo')?3400:1920;
 const height=Math.round(width*box.height/box.width);
 await page.setViewportSize({width,height});
 await page.locator('svg').evaluate((s,{width,height})=>{s.style.width=`${width}px`;s.style.height=`${height}px`;document.documentElement.style.margin='0';},{width,height});
 await page.screenshot({path:`public/brand/exports/${name}.png`,omitBackground:true});
}
await browser.close();
