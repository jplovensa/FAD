// Offline Three.js motion-graphics render; no photographic stills or image pans.
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
const temp=await mkdtemp(path.join(tmpdir(),'fad-three-film-'));
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'/usr/bin/chromium',args:['--enable-unsafe-swiftshader']});
const ffmpeg=args=>execFileSync('ffmpeg',['-y','-loglevel','error',...args],{stdio:'inherit'});
try {
 for(const [stem,width,height] of [['fad-opening',1280,720],['fad-opening-portrait',720,1280]]){
  const page=await browser.newPage({viewport:{width,height}});
  page.on('pageerror',error=>console.error(error));
  await page.goto(`http://127.0.0.1:5173/scripts/video/opening.html${width<height?'?portrait':''}`);
  await page.waitForFunction(()=>window.fadReady,{timeout:60000});
  const count=432;
  for(let i=0;i<count;i++){
   const data=await page.evaluate(async p=>{await window.fadScene.renderTrailer(p);return document.querySelector('canvas').toDataURL('image/png').split(',')[1];},i/(count-1));
   await writeFile(`${temp}/${String(i).padStart(4,'0')}.png`,Buffer.from(data,'base64'));
   if(i%72===0)console.log(`${stem}: ${i}/${count}`);
  }
  await page.close();
  ffmpeg(['-framerate','24','-i',`${temp}/%04d.png`,'-vf','fade=t=in:st=0:d=1,fade=t=out:st=16:d=2','-c:v','libx264','-threads','2','-preset','slow','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',`public/video/${stem}.mp4`]);
  ffmpeg(['-ss','2','-i',`public/video/${stem}.mp4`,'-frames:v','1','-update','1',`public/video/${stem}-poster.jpg`]);
  console.log(`Rendered ${stem}`);
 }
} finally {await browser.close();await rm(temp,{recursive:true,force:true});}
