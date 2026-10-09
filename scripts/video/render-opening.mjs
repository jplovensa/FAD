// Authoring only: Node + FFmpeg. Architectural concept imagery becomes a full-screen film.
import{mkdir,writeFile}from'node:fs/promises';import{execFileSync}from'node:child_process';
const frames='/tmp/fad-real-film';await mkdir(frames,{recursive:true});const images=['home-olive','workers-concept','school-concept','hospital-concept'];
for(const[shape,w,h]of[['wide',1280,720],['portrait',720,1280]]){
 for(const[n,image]of images.entries()){
  const filter=`scale=${w*2}:${h*2}:force_original_aspect_ratio=increase,crop=${w*2}:${h*2},zoompan=z='1.04+on*0.0014':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=34:s=${w}x${h}:fps=24,setsar=1,fade=t=in:st=0:d=0.12,fade=t=out:st=1.29:d=0.12`;
  execFileSync('ffmpeg',['-y','-loglevel','error','-i',`public/images/${image}.jpg`,'-vf',filter,'-frames:v','34','-c:v','libx264','-preset','fast','-crf','22','-pix_fmt','yuv420p',`${frames}/${shape}-${n}.mp4`]);
 }
 const list=`${frames}/${shape}.txt`;await writeFile(list,images.map((_,n)=>`file '${frames}/${shape}-${n}.mp4'`).join('\n')+'\n');
 const stem=shape==='wide'?'fad-opening':'fad-opening-portrait';
 execFileSync('ffmpeg',['-y','-loglevel','error','-f','concat','-safe','0','-i',list,'-c','copy','-movflags','+faststart',`public/video/${stem}.mp4`]);
 execFileSync('ffmpeg',['-y','-loglevel','error','-ss','0.5','-i',`public/video/${stem}.mp4`,'-frames:v','1',`public/video/${stem}-poster.jpg`]);
}
