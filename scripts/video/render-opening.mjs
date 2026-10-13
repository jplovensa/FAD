// Golden-hour trailer: a worker-scale opening followed by a smooth 360-degree development reveal.
import{chromium}from'playwright';import{mkdir,writeFile}from'node:fs/promises';import{execFileSync}from'node:child_process';
const frames='/tmp/fad-orbit-frames';await mkdir(frames,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'/usr/bin/chromium',args:['--enable-unsafe-swiftshader']});const page=await browser.newPage({viewport:{width:1280,height:720}});await page.goto('http://127.0.0.1:5173/scripts/video/opening.html');await page.waitForFunction(()=>window.fadReady,{timeout:30000});
const count=360;
for(let i=0;i<count;i++){const data=await page.evaluate(async({i,count})=>{await window.fadScene.renderTrailer(i/(count-1));return document.querySelector('canvas').toDataURL('image/png').split(',')[1];},{i,count});await writeFile(`${frames}/${String(i).padStart(4,'0')}.png`,Buffer.from(data,'base64'));if(i%60===0)console.log(`Trailer: ${i}/${count} frames`);}
await browser.close();execFileSync('ffmpeg',['-y','-loglevel','error','-framerate','20','-i',`${frames}/%04d.png`,'-c:v','libx264','-crf','25','-preset','slow','-pix_fmt','yuv420p','-movflags','+faststart','public/video/fad-opening.mp4']);
// Crop a portrait framing from the landscape master without stretching it.
execFileSync('ffmpeg',['-y','-loglevel','error','-i','public/video/fad-opening.mp4','-vf',"scale=1280:720,crop=404:720:'if(lt(t,6),340,438)':0",'-c:v','libx264','-crf','21','-preset','medium','-movflags','+faststart','public/video/fad-opening-portrait.mp4']);
for(const stem of['fad-opening','fad-opening-portrait'])execFileSync('ffmpeg',['-y','-loglevel','error','-ss','0.5','-i',`public/video/${stem}.mp4`,'-frames:v','1',`public/video/${stem}-poster.jpg`]);
