// Reproducible 18-second brand film from approved architectural concepts.
// Each aspect ratio is composed independently, never stretched from a master.
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
const root = fileURLToPath(new URL('../../', import.meta.url));
const temp = mkdtempSync(path.join(tmpdir(), 'fad-reveal-'));
const shots = ['public/images/residential/fad-r-36-render.webp', 'public/images/workers-concept.jpg', 'public/images/school-concept.jpg'];
const ffmpeg = args => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...args], { cwd: root, stdio: 'inherit' });
try {
 for (const [stem, width, height] of [['fad-opening', 1280, 720], ['fad-opening-portrait', 720, 1280]]) {
  for (let i = 0; i < shots.length; i++) {
   // Oversampling keeps the slow subpixel dolly smooth.
   const zoom = i === 0 ? '1.22-0.18*on/155' : i === 1 ? '1.04+0.09*on/155' : '1.12-0.08*on/167';
   const filter = `scale=${width * 2}:${height * 2}:force_original_aspect_ratio=increase,crop=${width * 2}:${height * 2},zoompan=z='${zoom}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=${width}x${height}:fps=24,eq=brightness=-0.025:saturation=0.78:contrast=1.06,colorbalance=rs=-0.025:gs=0.008:bs=0.012:rh=0.025:bh=-0.025,setsar=1`;
   ffmpeg(['-loop', '1', '-i', shots[i], '-vf', filter, '-t', i === 2 ? '7' : '6.5', '-an', '-c:v', 'libx264', '-threads', '2', '-preset', 'fast', '-crf', '18', '-pix_fmt', 'yuv420p', `${temp}/${i}.mp4`]);
  }
  ffmpeg(['-i', `${temp}/0.mp4`, '-i', `${temp}/1.mp4`, '-i', `${temp}/2.mp4`, '-filter_complex_threads', '1', '-filter_complex', '[0:v][1:v]xfade=transition=fade:duration=1:offset=5.5[v1];[v1][2:v]xfade=transition=fade:duration=1:offset=11[v2];[v2]fade=t=in:st=0:d=1.2,fade=t=out:st=16:d=2,format=yuv420p[out]', '-map', '[out]', '-t', '18', '-an', '-c:v', 'libx264', '-threads', '2', '-preset', 'slow', '-crf', '23', '-movflags', '+faststart', `public/video/${stem}.mp4`]);
  ffmpeg(['-ss', '2', '-i', `public/video/${stem}.mp4`, '-frames:v', '1', '-update', '1', `public/video/${stem}-poster.jpg`]);
  console.log(`Rendered ${stem}: ${width} × ${height}, 18 seconds`);
 }
} finally { rmSync(temp, { recursive: true, force: true }); }
