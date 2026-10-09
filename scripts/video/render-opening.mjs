// Authoring only: run the dev server, then node scripts/video/render-opening.mjs.
import{chromium}from'playwright';import{mkdir,writeFile}from'node:fs/promises';import{execFileSync}from'node:child_process';
const frames='/tmp/fad-opening-frames';await mkdir(frames,{recursive:true});const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'/usr/bin/chromium',args:['--enable-unsafe-swiftshader']});const page=await browser.newPage({viewport:{width:1280,height:720}});await page.goto('http://127.0.0.1:5173/scripts/video/opening.html');await page.waitForFunction(()=>window.fadReady);
for(let i=0;i<108;i++){const data=await page.evaluate(p=>window.renderFAD(p),i/107);await writeFile(`${frames}/${String(i).padStart(4,'0')}.png`,Buffer.from(data,'base64'));}await browser.close();
execFileSync('ffmpeg',['-y','-framerate','26','-i',`${frames}/%04d.png`,'-c:v','libx264','-crf','20','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart','public/video/fad-opening.mp4'],{stdio:'inherit'});
execFileSync('ffmpeg',['-y','-i',`${frames}/0075.png`,'-frames:v','1','public/video/fad-opening-poster.jpg'],{stdio:'inherit'});
