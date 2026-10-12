import * as THREE from 'three';
const renderer=new THREE.WebGLRenderer({canvas:document.querySelector('canvas'),antialias:true,preserveDrawingBuffer:true});renderer.setSize(1600,1000);renderer.setPixelRatio(1);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
const scene=new THREE.Scene();scene.background=new THREE.Color('#eeeae0');
const camera=new THREE.OrthographicCamera(-15,15,9.375,-9.375,.1,200);
scene.add(new THREE.HemisphereLight('#fff9ed','#829586',2));const sun=new THREE.DirectionalLight('#fff2da',3);sun.position.set(-15,28,20);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-45,right:45,top:45,bottom:-45,near:1,far:100});sun.shadow.normalBias=.04;scene.add(sun);
const mat={wall:new THREE.MeshStandardMaterial({color:'#f5f1e7',roughness:.85}),green:new THREE.MeshStandardMaterial({color:'#648373',roughness:.8}),roof:new THREE.MeshStandardMaterial({color:'#34443d',roughness:.65}),frame:new THREE.MeshStandardMaterial({color:'#25463b',roughness:.5,metalness:.15}),glass:new THREE.MeshStandardMaterial({color:'#83a7a5',roughness:.18,metalness:.35}),wood:new THREE.MeshStandardMaterial({color:'#b59b70',roughness:.78}),slab:new THREE.MeshStandardMaterial({color:'#c9c5b8',roughness:1}),floor:new THREE.MeshStandardMaterial({color:'#e1dcd0',roughness:1}),land:new THREE.MeshStandardMaterial({color:'#dbe2d3',roughness:1})};
const geo=new THREE.BoxGeometry(1,1,1);let model;
function box(g,x,y,z,w,h,d,m){const o=new THREE.Mesh(geo,mat[m]);o.position.set(x,y,z);o.scale.set(w,h,d);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;}
const ground=new THREE.Mesh(new THREE.PlaneGeometry(160,160),new THREE.MeshStandardMaterial({color:'#eeeae0',roughness:1}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
function building(w,d,{mode='exterior',finish='olive',type='home'}={}){
 const g=new THREE.Group();box(g,0,.16,0,w+.5,.32,d+.5,'slab');box(g,0,.34,0,w,.1,d,'floor');
 const h=mode==='interior'?1.05:2.8;const bays=Math.max(1,Math.round(w/3));
 // Real openings formed from wall segments; the cutaway retains an uncluttered shell.
 for(let i=0;i<bays;i++){const cx=-w/2+(i+.5)*w/bays,span=w/bays;
  for(const side of[-1,1]){const z=side*d/2;box(g,cx,.72,z,span,mode==='interior'?.7:.7,.14,'wall');if(mode!=='interior'){box(g,cx,2.65,z,span,.6,.14,'wall');box(g,cx-span/2+.2,1.65,z,.4,1.2,.14,'green');box(g,cx+span/2-.2,1.65,z,.4,1.2,.14,'wall');if(mode!=='shell'){box(g,cx,1.65,z,span-.9,1.15,.08,'glass');box(g,cx,1.65,z,.05,1.2,.12,'frame');}}}
 }
 for(const side of[-1,1]){const x=side*w/2;box(g,x,.35+h/2,0,.14,h,d,'wall');if(mode!=='interior')for(let z=-d/2+1.5;z<d/2;z+=3){box(g,x+side*.09,1.6,z,.07,1.4,1.25,mode==='shell'?'frame':'glass');box(g,x+side*.14,1.6,z,.03,1.5,.055,'frame');}}
 if(mode==='shell'){for(let z=-d/2;z<=d/2;z+=3)for(const x of[-w/2,w/2])box(g,x,1.75,z,.12,3,.12,'frame');for(let z=-d/2;z<=d/2;z+=3)box(g,0,3.2,z,w+.3,.13,.13,'frame');}
 if(mode==='interior'){
  if(type==='home'){const n=w<=3?0:d>7?3:2;for(let i=0;i<n;i++){const z=-d/2+1.5+i*3;box(g,-w/2+1.5,.88,z,3,.95,2.95,'floor');box(g,-w/2+3,.9,z,.12,1.1,2.25,'wall');box(g,-w/2+1.5,.9,z+1.5,3,1.1,.12,'wall');}box(g,w/2-.75,.9,-d/2+1,1.4,1.1,.12,'wall');box(g,w/2-1.5,.9,-d/2+.6,.12,1.1,1.2,'wall');box(g,w/2-1.4,.6,-d/2+2.2,2.6,.5,.55,'slab');}
  else{const n=type==='workers'?6:type==='school'?3:4;for(let i=1;i<n;i++)box(g,-w/2+i*w/n,.9,-.75,.12,1.1,d-1.7,'wall');box(g,0,.9,d/2-1.5,w,1.1,.12,'wall');}
 }else if(mode!=='shell'){
  const gable=new THREE.Shape();gable.moveTo(-w/2,3);gable.lineTo(w/2,3);gable.lineTo(0,3.2+w*.25/2);gable.closePath();const gableGeo=new THREE.ShapeGeometry(gable);for(const side of[-1,1]){const cap=new THREE.Mesh(gableGeo,new THREE.MeshStandardMaterial({color:'#f5f1e7',roughness:.85,side:THREE.DoubleSide}));cap.position.z=side*d/2;cap.castShadow=cap.receiveShadow=true;g.add(cap);}
  const pitch=.25,roofLength=Math.sqrt((w/2+.4)**2+(w/2*pitch)**2);for(const side of[-1,1]){const r=box(g,side*w/4,3.2+w*pitch/4,0,roofLength,.15,d+.9,'roof');r.rotation.z=-side*Math.atan(pitch);}
  for(let z=-d/2-.3;z<d/2+.4;z+=.4)for(const side of[-1,1]){const r=box(g,side*w/4,3.29+w*pitch/4,z,roofLength,.018,.035,'frame');r.rotation.z=-side*Math.atan(pitch);}
  box(g,w*.12,1.5,d/2+.13,.9,2.2,.1,'wood');box(g,w*.12,.37,d/2+.9,2.4,.12,1.7,'slab');box(g,w*.12,2.65,d/2+.9,2.8,.12,1.8,'wall');box(g,w*.12+1.15,1.45,d/2+1.6,.1,2.3,.1,'green');
 }
 return g;
}
function place(g,o,x,z,angle=0){o.position.set(x,0,z);o.rotation.y=angle;g.add(o);}
// Programme-specific assemblies match the published brief without assigning unverified capacity.
function facilityProgramme(kind,mode='shell',form='default'){
 const g=new THREE.Group();const add=(w,d,x,z,angle=0,type=kind)=>place(g,building(w,d,{mode,type}),x,z,angle);
 if(kind==='workers'){
  // Narrow room wings, central shared amenities and an independent wet-service block.
  add(18,5,-9,-5,Math.PI/2);add(18,5,9,-5,Math.PI/2);add(9,6,0,8,0,'shared');add(6,4,0,-15,0,'service');box(g,0,.03,-3,12,.06,17,'land');
  for(const side of[-1,1]){box(g,side*5.7,.15,-5,1.8,.15,18,'slab');if(mode!=='interior'){box(g,side*5.7,2.9,-5,1.9,.12,18,'wall');for(let z=-13;z<=3;z+=4)box(g,side*4.9,1.55,z,.12,2.8,.12,'frame');}}
 }else if(kind==='school'){
  // Two teaching wings frame the supervised courtyard; support and sanitation are separate.
  add(18,7,0,-8);add(12,7,-12,3,Math.PI/2);add(7,5,11,3,0,'admin');add(5,4,11,-8,0,'service');box(g,0,.03,4,14,.06,13,'land');box(g,0,.1,-3.3,18,.1,2,'slab');box(g,-7.3,.1,3,2,.1,12,'slab');
  if(mode!=='interior'){box(g,0,2.9,-3.3,18,.12,2,'wall');box(g,-7.3,2.9,3,2,.12,12,'wall');}
 }else{
  // Civic arrival/reception, distinct staff/support wing and a rear service pavilion.
  add(12,8,0,6,0,'admin');add(14,6,-11,-4,Math.PI/2);add(10,6,10,-6,Math.PI/2);add(6,5,1,-12,0,'service');box(g,0,.03,-3,11,.06,10,'land');box(g,0,.1,12,8,.12,5,'slab');box(g,18,.03,-2,4,.06,27,'slab');
  if(mode!=='interior'){box(g,0,3,12,8,.18,5,'wall');for(const x of[-3.6,3.6])box(g,x,1.6,13.8,.16,3,.16,'frame');}
 }
 // Alternate arrangements retain application-specific modules rather than repeating one generic hall.
 if(form==='linear'){for(let i=0;i<g.children.length;i++){const o=g.children[i];if(o.isGroup)o.position.set((i-1.5)*15,0,0);else o.visible=false;}}
 if(form==='compact'){g.scale.setScalar(.8);for(const o of g.children)if(o.isGroup)o.position.z*=.7;}
 return g;
}
window.renderMockup=async({kind='r36',mode='exterior',finish='olive'}={})=>{
 if(model)scene.remove(model);model=new THREE.Group();scene.add(model);
 mat.green.color.set(({olive:'#648373',brown:'#967553',yellow:'#c7aa58',purple:'#8a799c'})[finish]);
 const sizes={r18:[3,6],r36:[6,6],r72:[6,12],workers:[18,8],school:[18,9],hospital:[18,10]};
 if(kind==='campus'||kind==='family'){
  if(kind==='family'){for(const [i,k]of ['r18','r36','r72'].entries())place(model,building(...sizes[k]),(i-1)*11,0);}
  else{for(let r=0;r<2;r++)for(let c=0;c<4;c++)place(model,building(6,6),c*8-12,r*11-7);place(model,building(18,8,{type:'school'}),0,-19);box(model,0,.025,0,36,.05,3,'slab');}
 }else if(!kind.startsWith('r')){
  if(mode==='variations'){
   for(const [i,form]of ['linear','compact','default'].entries()){const campus=facilityProgramme(kind,'shell',form);campus.scale.multiplyScalar(.55);place(model,campus,(i-1)*30,0);}
  }else model.add(facilityProgramme(kind,mode));
 }else if(mode==='variations'){
  const [w,d]=sizes[kind];const scale=kind.startsWith('r')?.55:.45;
  const straight=building(w,d,{mode:'shell',type:kind.startsWith('r')?'home':kind});straight.scale.setScalar(scale);place(model,straight,-w*.8,0);
  const elbow=new THREE.Group();place(elbow,building(w,d,{mode:'shell'}),0,0);place(elbow,building(d*.6,w*.5,{mode:'shell'}),w*.65,-d*.2);elbow.scale.setScalar(scale);place(model,elbow,0,0);
  const courtyard=new THREE.Group();place(courtyard,building(w,d*.55,{mode:'shell'}),0,-d*.5);for(const side of[-1,1])place(courtyard,building(w*.28,d*.7,{mode:'shell'}),side*w*.5,d*.12);courtyard.scale.setScalar(scale);place(model,courtyard,w*.95,0);
 }else place(model,building(...sizes[kind],{mode,type:kind.startsWith('r')?'home':kind}),0,0);
 // Deterministic planted volumes reinforce the scale model character, no photo textures.
 const bounds=new THREE.Box3().setFromObject(model),center=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3());const span=Math.max(size.x,size.z)*1.2+5;camera.left=-span/2;camera.right=span/2;camera.top=span/3.2;camera.bottom=-span/3.2;camera.updateProjectionMatrix();camera.position.set(center.x+span*.65,span*.6,center.z+span*.82);camera.lookAt(center.x,1,center.z);
 renderer.render(scene,camera);await new Promise(r=>requestAnimationFrame(r));renderer.render(scene,camera);return true;
};
window.mockupReady=true;
