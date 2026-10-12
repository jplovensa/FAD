export function mountResidential({t,text,onChange}) {
 const section=document.querySelector('#solution');
 const plan=section.querySelector('#view-plan'),spec=section.querySelector('#view-specification');
 const baseline={plan:plan.innerHTML,spec:spec.innerHTML};
 let size=36;
 function translate(){section.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));section.querySelectorAll('[data-aria]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.aria)));section.querySelectorAll('[data-alt]').forEach(el=>el.alt=t(el.dataset.alt));}
 function drawPlan(){
  const x=size===18?180:150, w=size===18?180:240, h=size===18?360:480;
  const zones=size===18?[[x,80,w,240,'rPlanLiving'],[x,320,w,120,'rPlanService']]:[[x,80,120,120,'rPlanBedroom'],[x+120,80,120,120,'rPlanBedroom'],[x,200,120,120,'rPlanBedroom'],[x+120,200,120,120,'rPlanShared'],[x,320,w,120,'rPlanShared'],[x,440,w,120,'rPlanService']];
  return `<svg class="floor-plan r-floor-plan" viewBox="0 0 540 640" role="img" aria-labelledby="r-plan-title"><title id="r-plan-title">FAD R ${size}</title><rect x="${x}" y="80" width="${w}" height="${h}" fill="#f5f4ed" stroke="#193a32" stroke-width="7"/>${zones.map(([zx,y,zw,zh,key],i)=>`<rect x="${zx}" y="${y}" width="${zw}" height="${zh}" fill="${key==='rPlanService'?'#a1e5cf':'#e6ede3'}" stroke="#398780" stroke-width="2"/><text x="${zx+zw/2}" y="${y+zh/2}" text-anchor="middle" data-i18n="${key}">${t(key)}</text>${key==='rPlanBedroom'?`<text x="${zx+zw/2}" y="${y+zh/2+22}" text-anchor="middle" class="area-text">0${i+1}</text>`:''}`).join('')}<path d="M${x} 53h${w}M${x-22} 80v${h}" stroke="#398780"/><text x="${x+w/2}" y="43" text-anchor="middle">${size===18?'3':'6'} m</text><text x="${x-45}" y="${80+h/2}" text-anchor="middle" transform="rotate(-90 ${x-45} ${80+h/2})">${size===18?'6':'12'} m</text><text x="270" y="615" text-anchor="middle" class="plan-title">FAD R ${size} / ${size} m²</text></svg><p class="fine-print">${text('rPlanNote')}</p>`;
 }
 function choose(value){
  size=value;
  section.querySelectorAll('[data-residential]').forEach(button=>{button.setAttribute('aria-pressed',String(Number(button.dataset.residential)===size));});
  section.querySelector('.residential-code').textContent=`FAD R / ${size}`;
  section.querySelector('[data-residential-area]').textContent=`${size} m²`;
  const layout=section.querySelector('[data-residential-layout]');layout.dataset.i18n=`r${size}Layout`;
  section.querySelector('[data-residential-footprint]').textContent=({18:'3 × 6 m',36:'6 × 6 m',72:'6 × 12 m'})[size];
  section.querySelector('.residential-current').textContent=String(size);
  section.querySelector('.product-tag').innerHTML=size===36?text('type'):`FAD R ${size} / ${text('rConcept')}`;
  section.querySelector('#finish-controls').dataset.concept=String(size!==36);
  plan.innerHTML=size===36?baseline.plan:drawPlan();
  spec.innerHTML=size===36?baseline.spec:`<p class="eyebrow">FAD R ${size}</p><h3>${text('rSpecTitle')}</h3><p>${text('rSpecText')}</p><table class="spec-table"><tbody>${[['rConfig',`r${size}Config`],['rSystem','rSystemText'],['rSite','rSiteText'],['rServices','rServicesText'],['rFinishes','rFinishesText'],['rDelivery','rDeliveryText']].map(([key,value])=>`<tr><th scope="row">${text(key)}</th><td>${text(value)}</td></tr>`).join('')}</tbody></table>`;
  translate();onChange(size);
 }
 const buttons=[...section.querySelectorAll('[data-residential]')];
 buttons.forEach((button,index)=>{
  button.addEventListener('click',()=>choose(Number(button.dataset.residential)));
  button.addEventListener('keydown',e=>{let next=index;if(e.key==='ArrowRight'||e.key==='ArrowDown')next=(index+1)%buttons.length;else if(e.key==='ArrowLeft'||e.key==='ArrowUp')next=(index+buttons.length-1)%buttons.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=buttons.length-1;else return;e.preventDefault();buttons[next].focus();choose(Number(buttons[next].dataset.residential));});
 });
 section.querySelector('.residential-enquiry').addEventListener('click',()=>{
  const input=document.querySelector('[name=message]');
  const line=`${t('rSelectedBrief')}: FAD R ${size} — ${size} m²`;
  // Keep the current selection in the brief while preserving the user's own text.
  input.value=[input.value.replace(/^.*: FAD R (18|36|72) — .*m²\n?/gm,'').trim(),line].filter(Boolean).join('\n');
 });
 document.addEventListener('fad-language-change',translate);
 choose(36);
}
