import { content } from './content.js';

const icons = {
 arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>', diagonal: '<path d="M6 18 18 6M6 6h12v12"/>', download: '<path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5"/>',
 home: '<path d="m3 11 9-8 9 8M5 9v12h14V9M9 21v-8h6v8"/>', speed: '<path d="m14 2-9 12h7l-2 8 9-12h-7l2-8"/>', layers: '<path d="m12 3 10 5-10 5L2 8l10-5Zm-10 10 10 5 10-5M2 18l10 5 10-5"/>', grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>', check: '<path d="m5 12 4 4L19 6"/>', plus: '<path d="M12 5v14M5 12h14"/>', close: '<path d="m6 6 12 12M18 6 6 18"/>', menu: '<path d="M4 7h16M4 12h16M4 17h16"/>', whatsapp: '<path d="M20.5 11.7a8.5 8.5 0 0 1-12.8 7.5L3 21l1.6-4.8A8.5 8.5 0 1 1 20.5 11.7Z"/><path d="M8 7c-2 4 2 8 6 9l2-2-3-2-1 1c-1-1-2-2-2-3l1-1-2-2H8Z"/>', chevron: '<path d="m6 9 6 6 6-6"/>', building: '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 8h1m4 0h1M9 12h1m4 0h1M10 21v-5h4v5"/>', globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18"/>',
};
const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
const logo = `<svg class="brand-icon" viewBox="0 0 50 50" fill="none" aria-hidden="true"><path d="m5 25 20-18 20 18" stroke="currentColor" stroke-width="4"/><path d="M13 23v19h10V30h10v12h5V23" stroke="currentColor" stroke-width="3"/><path d="M32 8c1-5 8-5 8-5s1 7-6 9" stroke="currentColor" stroke-width="2"/></svg>`;
let lang = 'en';
try { lang = localStorage.getItem('fjall-language') === 'id' ? 'id' : 'en'; } catch {}
let finish = 'olive';
let budgetUnits = 100;
let brief = '';
let lastFocus;
const t = key => content[lang][key] || key;
const text = key => `<span data-i18n="${key}">${t(key)}</span>`;
const arrow = icon('arrow');
const field = (key, type, placeholderKey, extra = '') => `<label class="field">${text(key)} <span class="required-mark" aria-hidden="true">*</span><input name="${key}" type="${type}" ${placeholderKey ? `placeholder="${t(placeholderKey)}" data-placeholder="${placeholderKey}"` : ''} required ${extra}></label>`;
const select = (key, options) => `<label class="field">${text(key)} <span class="required-mark" aria-hidden="true">*</span><span class="select-wrap"><select name="${key}" required><option value="" data-i18n="select">${t('select')}</option>${options.map(k => `<option value="${k}" data-i18n="${k}">${t(k)}</option>`).join('')}</select>${icon('chevron')}</span></label>`;

const app = document.querySelector('#app');
app.innerHTML = `
<a class="skip-link" href="#main">${text('skip')}</a>
<header class="header"><div class="nav-wrap">
 <a href="#" class="brand" aria-label="Fjäll Affordable Development home">${logo}<span class="brand-name">FAD<span class="brand-sub">${text('brandSub')}</span></span></a>
 <nav class="desktop-nav" aria-label="Main navigation"><a href="#applications">${text('navSolution')}</a><a href="#technology">${text('navTech')}</a><a href="#applications">${text('navProjects')}</a></nav>
 <div class="nav-actions"><div class="language-switch" role="group" aria-label="Language"><button data-lang="en" aria-label="English" aria-pressed="${lang === 'en'}">EN</button><span>/</span><button data-lang="id" aria-label="Bahasa Indonesia" aria-pressed="${lang === 'id'}">ID</button></div><a class="button nav-cta" href="#contact">${text('navContact')}${icon('diagonal')}</a><button class="menu-toggle icon-button" aria-expanded="false" aria-controls="mobile-nav" data-aria="menu" aria-label="${t('menu')}">${icon('menu')}</button></div>
</div><nav id="mobile-nav" class="mobile-nav" hidden><a href="#applications">${text('navSolution')}</a><a href="#technology">${text('navTech')}</a><a href="#applications">${text('navProjects')}</a><a href="#contact">${text('navContact')}${arrow}</a></nav></header>
<main id="main">
<section class="hero container">
 <div class="hero-copy"><p class="eyebrow"><span class="status-dot"></span>${text('heroEyebrow')}</p><h1>${text('heroTitle')}<em>${text('heroAccent')}</em></h1><p class="hero-description">${text('heroDescription')}</p><div class="hero-buttons"><a class="button" href="#contact">${text('heroCta')}${icon('diagonal')}</a><a class="text-link" href="#applications">${text('heroSecondary')}${arrow}</a></div><div class="hero-end"><span class="mini-emblem">${icon('home')}</span><span>${text('heroTag')}</span><span class="hero-line"></span></div></div>
 <div class="hero-visual"><img class="hero-image" src="./public/images/campus.jpg" alt="${t('heroImageAlt')}" data-alt="heroImageAlt" fetchpriority="high"><span class="hero-concept">${text('heroCaption')}</span></div>
</section>
<section class="metrics container" aria-label="Development solutions">${['home','building','grid','layers'].map((i,n)=>`<div class="metric"><span class="metric-icon">${icon(i)}</span><strong>${text('capability'+(n+1))}</strong><p>${text('capability'+(n+1)+'Text')}</p></div>`).join('')}</section>
<section class="applications section container" id="applications"><div class="section-intro"><div><p class="eyebrow">${text('appLabel')}</p><h2>${text('appTitle')}<em>${text('appAccent')}</em></h2></div><p class="application-intro">${text('appText')}</p></div><div class="application-grid">${['residential','campus','dormitory'].map((img,n)=>`<article class="application-card"><div class="application-image"><img src="./public/images/${img}.jpg" alt="${t('app'+(n+1))} — ${t('concept')}" data-app-alt="${n+1}" loading="lazy"><span>0${n+1}</span></div><div class="application-content"><p class="eyebrow">${text('app'+(n+1)+'Tag')}</p><h3>${text('app'+(n+1))}</h3><p>${text('app'+(n+1)+'Text')}</p><a class="text-link" href="#contact" data-project="${['sectorDev','sectorEdu','sectorCorp'][n]}">${text('appCta')}${icon('diagonal')}</a></div></article>`).join('')}</div><p class="fine-print">${text('appNote')}</p></section>
<section class="intro section container"><div class="section-intro"><div><p class="eyebrow">${text('introLabel')}</p><h2>${text('introTitle')}<em>${text('introAccent')}</em></h2></div><div class="intro-description"><p>${text('introText')}</p><a class="text-link" href="#technology">${text('introLink')}${arrow}</a></div></div><div class="benefits">${['speed','layers','grid'].map((i,n)=>`<article class="benefit"><div class="benefit-top"><span class="benefit-icon">${icon(i)}</span><span class="number">0${n+1}</span></div><h3>${text('benefit'+(n+1))}</h3><p>${text('benefit'+(n+1)+'Text')}</p></article>`).join('')}</div></section>
<section class="technology section container" id="technology"><div class="technology-main"><p class="eyebrow">${text('techLabel')}</p><h2>${text('techTitle')}<em>${text('techAccent')}</em></h2><p class="section-description">${text('techText')}</p><div class="process">${[1,2,3].map(n=>`<div class="process-step"><span>0${n}</span><div><h3>${text('tech'+n)}</h3><p>${text('tech'+n+'Text')}</p></div></div>`).join('')}</div><p class="fine-print">${text('techNote')}</p></div><div class="technology-visual"><span class="diagram-title">FAD COMPOSITE SYSTEM <span>${icon('diagonal')}</span></span><div class="panel-diagram" role="img" aria-label="${t('panelAlt')}" data-aria="panelAlt"><div class="panel-layer layer-back"></div><div class="panel-layer layer-core"></div><div class="panel-layer layer-front"></div><span class="diagram-dot dot-one"></span><span class="diagram-dot dot-two"></span><span class="diagram-dot dot-three"></span></div><div class="layer-labels"><span><b>01</b>${text('techLayer1')}</span><span><b>02</b>${text('techLayer2')}</span><span><b>03</b>${text('techLayer3')}</span></div><div class="tech-stat"><strong>${text('techStat')}</strong><p>${text('techStatText')}</p>${icon('layers')}</div><span class="diagram-note">${text('techDiagram')}</span></div></section>
<section class="government container" id="government"><div class="government-mark">${icon('building')}</div><div class="government-copy"><p class="eyebrow">${text('governmentLabel')}</p><h2>${text('governmentTitle')} <em>${text('governmentAccent')}</em></h2><p>${text('governmentText')}</p><a href="#contact" class="button button-light" data-project="sectorGov">${text('governmentCta')}${icon('diagonal')}</a></div><div class="government-features">${[1,2,3].map(n=>`<div>${icon('check')}${text('government'+n)}</div>`).join('')}</div></section>
<section class="journey section container" id="process"><div class="section-intro"><div><p class="eyebrow">${text('journeyLabel')}</p><h2>${text('journeyTitle')}<em>${text('journeyAccent')}</em></h2></div><p class="section-description">${text('journeyDescription')}</p></div><div class="journey-grid">${[1,2,3,4].map(n=>`<article><span class="journey-number">0${n}</span><h3>${text('journey'+n)}</h3><p>${text('journey'+n+'Text')}</p></article>`).join('')}</div><a href="#contact" class="button">${text('journeyCta')}${icon('diagonal')}</a></section>
<section class="solution section" id="solution"><div class="container"><div class="section-heading centered"><p class="eyebrow">${text('solutionLabel')}</p><h2>${text('solutionTitle')} <em>${text('solutionAccent')}</em></h2><p>${text('solutionText')}</p></div><div class="product"><div class="product-gallery">
 <div class="product-view-nav"><span class="eyebrow">FAD / 36</span><div class="view-tabs" role="tablist" aria-label="Type 36 design views">${[['exterior','homeExterior'],['plan','homePlan'],['specification','homeSpec']].map(([view,key])=>`<button id="tab-${view}" role="tab" data-view="${view}" aria-controls="view-${view}" aria-selected="${view==='exterior'}" tabindex="${view==='exterior'?0:-1}">${text(key)}</button>`).join('')}</div></div>
 <div id="view-exterior" role="tabpanel" aria-labelledby="tab-exterior" class="product-view product-image-wrap"><img id="product-image" src="./public/images/home-olive.jpg" alt="${t('imageAlt')} — ${t('olive')}" loading="lazy"><span class="product-tag">${text('type')}</span><span class="product-caption">${text('concept')}</span></div>
 <div id="view-plan" role="tabpanel" aria-labelledby="tab-plan" class="product-view plan-view" hidden>
 <svg class="floor-plan" viewBox="0 0 600 540" role="img" aria-labelledby="plan-title"><title id="plan-title" data-i18n="planCaption">${t('planCaption')}</title>
 <defs><pattern id="floor-tiles" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#dcded0" stroke-width=".5"/></pattern></defs>
 <path d="M110 52H470M110 45v14M470 45v14" stroke="#838b76"/><text x="290" y="39" text-anchor="middle" class="dimension-text">6.0 m</text>
 <path d="M505 85v360M498 85h14M498 445h14" stroke="#838b76"/><text x="530" y="270" text-anchor="middle" transform="rotate(90 530 270)" class="dimension-text">6.0 m</text>
 <rect x="110" y="85" width="360" height="360" fill="url(#floor-tiles)" stroke="#343c30" stroke-width="7"/>
 <rect x="117" y="92" width="168" height="168" fill="#eceddf"/><rect x="297" y="92" width="166" height="168" fill="#eceddf"/>
 <rect x="357" y="277" width="106" height="161" fill="#e0e5d7"/>
 <path d="M290 89v176M114 265h70m55 0h103m54 0h70M350 268v173" stroke="#343c30" stroke-width="6"/>
 <path d="M183 265v-54a54 54 0 0 1 54 54M342 265v-54a54 54 0 0 1 54 54M241 442v-55a55 55 0 0 1 55 55" stroke="#9ca58e" fill="none"/>
 <path d="M242 445h54" stroke="#f6f5ef" stroke-width="8"/>
 <path d="M150 85h95M336 85h95M110 335v67" stroke="#f6f5ef" stroke-width="9"/><path d="M150 85h95M336 85h95M110 335v67" stroke="#aabc93" stroke-width="3"/>
 <rect x="137" y="111" width="64" height="78" rx="1" fill="#fafaf4" stroke="#a4ac96"/><path d="M140 128h58M169 112v16" stroke="#a4ac96"/>
 <rect x="317" y="111" width="64" height="78" rx="1" fill="#fafaf4" stroke="#a4ac96"/><path d="M320 128h58M349 112v16" stroke="#a4ac96"/>
 <path d="M133 317h63v40h-63zM135 359h22v22h-22zM133 310h63M125 317v40" stroke="#a4ac96" fill="#fafaf4"/><rect x="217" y="326" width="48" height="31" rx="2" fill="#fafaf4" stroke="#a4ac96"/>
 <path d="M369 291h77v31h-77zM395 291v31M357 356h106" stroke="#a4ac96" fill="#fafaf4"/>
 <text x="201" y="218" text-anchor="middle" data-i18n="planMaster">${t('planMaster')}</text><text x="201" y="239" text-anchor="middle" class="area-text">3 × 3 m / 9 m²</text>
 <text x="381" y="218" text-anchor="middle" data-i18n="planSecond">${t('planSecond')}</text><text x="381" y="239" text-anchor="middle" class="area-text">3 × 3 m / 9 m²</text>
 <text x="243" y="392" text-anchor="middle" data-i18n="planLiving">${t('planLiving')}</text><text x="243" y="415" text-anchor="middle" class="area-text">3 × 4 m / 12 m²</text>
 <text x="410" y="378" text-anchor="middle" class="wet-label" data-i18n="planWet">${t('planWet')}</text><text x="410" y="400" text-anchor="middle" class="area-text">6 m²</text>
 <text x="290" y="492" text-anchor="middle" class="plan-title" data-i18n="planCaption">${t('planCaption')}</text>
 </svg><p class="fine-print">${text('planNote')}</p></div>
 <div id="view-specification" role="tabpanel" aria-labelledby="tab-specification" class="product-view specification-view" hidden><p class="eyebrow">${text('specEyebrow')}</p><h3>${text('specTitle')}</h3><p>${text('specDescription')}</p><table class="spec-table"><thead><tr><th scope="col">${text('specItem')}</th><th scope="col">${text('specValue')}</th></tr></thead><tbody>${[1,2,3,4,5,6].map(n=>`<tr><th scope="row">${text('spec'+n)}</th><td>${text('spec'+n+'Value')}</td></tr>`).join('')}</tbody></table></div>
 <div class="product-colors" id="finish-controls"><div class="finish-heading"><span class="eyebrow">${text('colorLabel')}</span><span id="finish-name">${t(finish)}</span></div><div class="swatches" role="group" aria-label="Exterior finish">${['olive','brown','yellow','purple'].map(color=>`<button class="swatch ${color===finish?'selected':''}" data-finish="${color}" aria-pressed="${color===finish}" aria-label="${t(color)}"><span class="swatch-check">${color===finish?icon('check'):''}</span><img src="./public/images/home-${color}.jpg" alt="" loading="lazy"><strong>${text(color)}</strong></button>`).join('')}</div><span class="finish-note">${text('finishNote')}</span></div>
 </div><div class="product-info"><div class="product-name"><p class="eyebrow">${text('homeOverview')}</p><h3>FAD <span>36</span></h3><span class="product-stamp">${icon('home')}</span></div><div class="product-specs"><div><strong>36 m²</strong><span>${text('area')}</span></div><div><strong>02</strong><span>${text('rooms')}</span></div><div><strong>10</strong><span>${text('panels')}</span></div></div><div class="price"><p class="eyebrow">${text('priceLabel')}</p><p class="price-number">Rp 50.000.000</p><p>${text('priceNote')}</p></div><a class="button" href="#contact" data-project="sectorDev">${text('specLink')}${icon('diagonal')}</a><a class="text-link deck-link" href="./public/fjall-commercial-deck.pdf" download="Fjall-Affordable-Development-Commercial-Deck.pdf">${icon('download')}${text('download')}<span class="file-type">PDF</span></a></div></div></div></section>
<section class="scope container" aria-label="Commercial scope"><div><span class="scope-icon">${icon('check')}</span><div><h3>${text('scopeIncluded')}</h3><p>${text('scopeIncludedText')}</p></div></div><div><span class="scope-icon">${icon('arrow')}</span><div><h3>${text('scopeDeveloper')}</h3><p>${text('scopeDeveloperText')}</p></div></div></section>
<section class="budget section container" id="budget"><div><p class="eyebrow">${text('budgetLabel')}</p><h2>${text('budgetTitle')}<em>${text('budgetAccent')}</em></h2><p class="section-description">${text('budgetText')}</p></div><div class="calculator"><div class="unit-control"><label for="budget-units">${text('budgetUnits')}</label><div class="stepper"><button id="units-minus" aria-label="Decrease units">−</button><input id="budget-units" type="number" min="1" max="100000" value="100" step="1" inputmode="numeric"><button id="units-plus" aria-label="Increase units">+</button></div></div><div class="budget-presets" role="group" aria-label="Unit count"><button data-units="50">50</button><button data-units="100" class="active">100</button><button data-units="500">500</button><button data-units="1000">1,000</button></div><div class="budget-total" aria-live="polite"><p class="eyebrow">${text('budgetResult')}</p><strong id="budget-total">Rp 5.000.000.000</strong><p><span id="budget-count">100</span> ${text('budgetRate')}</p></div><p class="fine-print">${text('budgetNote')}</p><a href="#contact" class="text-link" id="budget-enquiry">${text('budgetCta')}${arrow}</a></div></section>
<section class="faq section container"><div><p class="eyebrow">${text('faqLabel')}</p><h2>${text('faqTitle')}</h2></div><div class="faq-items">${[1,2,3,4].map(n=>`<details><summary>${text('faq'+n)}${icon('plus')}</summary><p>${text('faq'+n+'Text')}</p></details>`).join('')}</div></section>
<section class="contact section" id="contact"><div class="container contact-grid"><div class="contact-copy"><p class="eyebrow">${text('contactLabel')}</p><h2>${text('contactTitle')}<em>${text('contactAccent')}</em></h2><p>${text('contactText')}</p><div class="contact-illustration" aria-hidden="true"><svg viewBox="0 0 400 200" fill="none"><path d="M0 180h400M20 180V95l75-35 75 35v85M25 95h140M85 180v-55h30v55M40 110h25v35H40zM130 110h25v35h-25zM170 180v-75l60-30 60 30v75M180 105h100M215 180v-45h25v45M290 180v-85l60-30 40 30v85M300 95h80M320 115h22v30h-22z" stroke="currentColor" stroke-width="1.5"/><path d="M8 175V80M8 105C-12 80 0 57 8 48c17 20 22 40 0 57ZM370 175v-22m0-15v-20m-6 38h12M195 55V22m-9 20 9-20 9 20" stroke="currentColor" stroke-width="1.5"/><circle cx="322" cy="30" r="17" stroke="currentColor"/><path d="M50 190h280" stroke="currentColor" stroke-dasharray="4 5"/></svg></div><div class="direct-contact"><p>${text('contactDirect')}</p><a href="https://wa.me/6281237535508" target="_blank" rel="noopener noreferrer">${icon('whatsapp')}${text('contactWhatsApp')}${icon('diagonal')}</a><span>+62 812 3753 5508</span></div></div><form id="lead-form" class="lead-form"><h3>${text('formTitle')}</h3><p class="form-subtitle">${text('formSubtitle')}</p><div class="form-grid">${field('name','text','namePlaceholder','autocomplete="name" maxlength="100"')}${field('org','text','orgPlaceholder','autocomplete="organization" maxlength="150"')}${field('email','email',null,'autocomplete="email" maxlength="150" placeholder="you@organisation.com"')}${field('phone','tel',null,'autocomplete="tel" maxlength="30" minlength="7" placeholder="+62 …"')}${field('location','text','locationPlaceholder','maxlength="150"')}${select('sector',['sectorGov','sectorDev','sectorEdu','sectorCorp','sectorOther'])}${field('units','number',null,'min="1" max="100000" step="1" placeholder="100"')}${select('timeline',['timeline1','timeline2','timeline3','timeline4','timeline5'])}<label class="field field-full">${text('message')} <span class="optional">(${text('optional')})</span><textarea name="message" rows="3" maxlength="1500" data-placeholder="messagePlaceholder" placeholder="${t('messagePlaceholder')}"></textarea></label></div><label class="consent"><input type="checkbox" name="consent" required><span>${text('consent')}</span></label><button type="submit" class="button form-submit">${text('submit')}${arrow}</button><p class="form-note">${icon('whatsapp')}${text('formNote')}</p></form></div></section>
</main>
<footer class="footer"><div class="container"><div class="footer-top"><div><a href="#" class="brand">${logo}<span class="brand-name">FAD<span class="brand-sub">${text('brandSub')}</span></span></a><p class="footer-statement">${text('footerText')}</p><p class="footer-about">${text('footerAbout')}</p></div><div class="footer-column"><p class="eyebrow">${text('footerLinks')}</p><a href="#applications">${text('navSolution')}</a><a href="#technology">${text('navTech')}</a><a href="#applications">${text('navProjects')}</a></div><div class="footer-column"><p class="eyebrow">${text('footerContact')}</p><a href="#contact">${text('navContact')}${icon('diagonal')}</a><a href="./public/fjall-commercial-deck.pdf" download>${text('download')}</a><button class="privacy-trigger">${text('footerPrivacy')}</button></div><div class="footer-group"><span class="group-symbol">◈</span><strong>FJÄLL<br><span>GROUP</span></strong><p>${text('group')}</p></div></div><div class="footer-bottom"><span data-copyright></span><span>${text('footerMission')}${icon('globe')}</span></div></div></footer>
<dialog id="review-dialog"><div class="dialog-top"><span class="dialog-emblem">${icon('check')}</span><button class="icon-button dialog-close" data-aria="close" aria-label="${t('close')}">${icon('close')}</button></div><h2>${text('reviewTitle')}</h2><p>${text('reviewText')}</p><pre id="project-brief"></pre><a id="send-whatsapp" class="button" target="_blank" rel="noopener noreferrer">${icon('whatsapp')}${text('reviewSend')}${icon('diagonal')}</a><p class="fine-print">${text('reviewNote')}</p><div class="dialog-secondary"><button id="copy-brief">${text('reviewCopy')}</button><button class="dialog-close">${text('reviewEdit')}</button></div><span id="copy-status" role="status"></span></dialog>
<dialog id="privacy-dialog"><div class="dialog-top"><span class="dialog-emblem">${icon('home')}</span><button class="icon-button dialog-close" data-aria="close" aria-label="${t('close')}">${icon('close')}</button></div><h2>${text('privacyTitle')}</h2><p>${text('privacyText')}</p><button class="button dialog-close">${text('privacyClose')}${icon('check')}</button></dialog>
`;

function updateLanguage() {
 document.documentElement.lang = lang;
 document.title = lang === 'en' ? 'Fjäll Affordable Development — Modular development at scale' : 'Fjäll Affordable Development — Pengembangan modular skala besar';
 document.querySelector('meta[name="description"]').content = lang === 'en' ? 'Repeatable building solutions by Fjäll Group for housing, education, and accommodation projects across Indonesia.' : 'Solusi bangunan yang dapat direplikasi dari Fjäll Group untuk proyek perumahan, pendidikan, dan akomodasi di seluruh Indonesia.';
 document.querySelectorAll('[data-i18n]').forEach(el => el.textContent = t(el.dataset.i18n));
 document.querySelectorAll('[data-placeholder]').forEach(el => el.placeholder = t(el.dataset.placeholder));
 document.querySelectorAll('[data-alt]').forEach(el => el.alt = t(el.dataset.alt));
 document.querySelectorAll('[data-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.aria)));
 document.querySelectorAll('[data-app-alt]').forEach(el => el.alt = t('app'+el.dataset.appAlt) + ' — ' + t('concept'));
 document.querySelectorAll('[data-lang]').forEach(el => el.setAttribute('aria-pressed', el.dataset.lang === lang));
 document.querySelector('[data-copyright]').textContent = t('footerCopyright').replace('{year}', new Date().getFullYear());
 document.querySelector('#units-minus').setAttribute('aria-label', lang === 'en' ? 'Decrease units' : 'Kurangi jumlah unit');
 document.querySelector('#units-plus').setAttribute('aria-label', lang === 'en' ? 'Increase units' : 'Tambah jumlah unit');
 document.querySelector('.desktop-nav').setAttribute('aria-label', lang === 'en' ? 'Main navigation' : 'Navigasi utama');
 document.querySelector('.swatches').setAttribute('aria-label', lang === 'en' ? 'Exterior finish' : 'Warna eksterior');
 updateFinish(); updateBudget(); validatePhone();
}
function updateFinish() {
 document.querySelector('#product-image').src = `./public/images/home-${finish}.jpg`;
 document.querySelector('#product-image').alt = `${t('imageAlt')} — ${t(finish)}`;
 document.querySelector('#finish-name').textContent = t(finish);
 document.querySelectorAll('[data-finish]').forEach(el => {
  const selected = el.dataset.finish === finish;
  el.classList.toggle('selected', selected); el.setAttribute('aria-pressed', selected); el.setAttribute('aria-label', t(el.dataset.finish));
  el.firstElementChild.innerHTML = selected ? icon('check') : '';
 });
}
const numberFormat = () => new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'id-ID');
function updateBudget() {
 document.querySelector('#budget-total').textContent = 'Rp ' + numberFormat().format(budgetUnits * 50000000);
 document.querySelector('#budget-count').textContent = numberFormat().format(budgetUnits);
 document.querySelectorAll('[data-units]').forEach(el => { el.classList.toggle('active', Number(el.dataset.units) === budgetUnits); el.setAttribute('aria-pressed', Number(el.dataset.units) === budgetUnits); });
 document.querySelector('#units-minus').disabled = budgetUnits <= 1;
 document.querySelector('#units-plus').disabled = budgetUnits >= 100000;
}
function setUnits(value) {
 budgetUnits = Math.min(100000, Math.max(1, Math.round(Number(value) || 1)));
 document.querySelector('#budget-units').value = budgetUnits; updateBudget();
}
function closeMenu() { document.querySelector('#mobile-nav').hidden = true; document.querySelector('.menu-toggle').setAttribute('aria-expanded', 'false'); }
document.querySelectorAll('[data-lang]').forEach(el => el.addEventListener('click', () => {
 lang = el.dataset.lang; try { localStorage.setItem('fjall-language', lang); } catch {} updateLanguage();
}));
function setView(view) {
 document.querySelectorAll('[data-view]').forEach(tab => { const selected = tab.dataset.view === view; tab.setAttribute('aria-selected', selected); tab.tabIndex = selected ? 0 : -1; });
 document.querySelectorAll('.product-view').forEach(panel => { panel.hidden = panel.id !== 'view-' + view; });
 document.querySelector('#finish-controls').hidden = view !== 'exterior';
}
document.querySelectorAll('[data-view]').forEach(tab => {
 tab.addEventListener('click', () => setView(tab.dataset.view));
 tab.addEventListener('keydown', e => {
  const tabs = [...document.querySelectorAll('[data-view]')]; let next = tabs.indexOf(tab);
  if (e.key === 'ArrowRight') next = (next + 1) % tabs.length;
  else if (e.key === 'ArrowLeft') next = (next + tabs.length - 1) % tabs.length;
  else if (e.key === 'Home') next = 0;
  else if (e.key === 'End') next = tabs.length - 1;
  else return;
  e.preventDefault(); setView(tabs[next].dataset.view); tabs[next].focus();
 });
});
document.querySelectorAll('[data-finish]').forEach(el => el.addEventListener('click', () => { finish = el.dataset.finish; updateFinish(); }));
document.querySelector('.menu-toggle').addEventListener('click', () => {
 const nav = document.querySelector('#mobile-nav'); nav.hidden = !nav.hidden; document.querySelector('.menu-toggle').setAttribute('aria-expanded', String(!nav.hidden));
});
document.querySelectorAll('#mobile-nav a').forEach(el => el.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
document.querySelectorAll('[data-project]').forEach(el => el.addEventListener('click', () => { document.querySelector('[name="sector"]').value = el.dataset.project; }));
document.querySelectorAll('[data-units]').forEach(el => el.addEventListener('click', () => setUnits(el.dataset.units)));
document.querySelector('#budget-units').addEventListener('input', e => { if (e.target.validity.valid && e.target.value) { budgetUnits = Number(e.target.value); updateBudget(); } });
document.querySelector('#budget-units').addEventListener('change', e => setUnits(e.target.value));
document.querySelector('#units-minus').addEventListener('click', () => setUnits(budgetUnits - 1));
document.querySelector('#units-plus').addEventListener('click', () => setUnits(budgetUnits + 1));
document.querySelector('#budget-enquiry').addEventListener('click', () => { setUnits(document.querySelector('#budget-units').value); document.querySelector('[name="units"]').value = budgetUnits; if (!document.querySelector('[name="sector"]').value) document.querySelector('[name="sector"]').value = 'sectorDev'; });

function openDialog(id) { lastFocus = document.activeElement; document.querySelector(id).showModal(); document.body.classList.add('dialog-open'); }
document.querySelectorAll('.dialog-close').forEach(el => el.addEventListener('click', () => el.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(el => {
 el.addEventListener('close', () => { document.body.classList.remove('dialog-open'); lastFocus?.focus(); });
 el.addEventListener('click', e => { if (e.target === el) { const r = el.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) el.close(); } });
});
document.querySelector('.privacy-trigger').addEventListener('click', () => openDialog('#privacy-dialog'));
function validatePhone() {
 const phone = document.querySelector('[name=phone]');
 phone.setCustomValidity(phone.value && (!/^[+0-9() .-]+$/.test(phone.value) || phone.value.replace(/\D/g, '').length < 7) ? (lang === 'en' ? 'Please enter a phone number with at least 7 digits.' : 'Masukkan nomor telepon dengan minimal 7 digit.') : '');
}
document.querySelector('[name=phone]').addEventListener('input', validatePhone);
document.querySelector('#lead-form').addEventListener('submit', e => {
 e.preventDefault();
 const form = e.currentTarget;
 for (const input of form.querySelectorAll('input[type="text"]')) { input.value = input.value.trim(); }
 if (!form.reportValidity()) return;
 validatePhone();
 if (!form.reportValidity()) return;
 const data = new FormData(form);
 const keys = ['name','org','email','phone','location','sector','units','timeline','message'];
 brief = t('briefHeading') + '\n\n' + keys.filter(k => String(data.get(k) || '').trim()).map(k => `${t(k)}: ${k==='sector' || k==='timeline' ? t(data.get(k)) : data.get(k)}`).join('\n') + '\n\n' + t('preferredLang');
 document.querySelector('#project-brief').textContent = brief;
 document.querySelector('#send-whatsapp').href = 'https://wa.me/6281237535508?text=' + encodeURIComponent(brief);
 document.querySelector('#copy-status').textContent = '';
 openDialog('#review-dialog');
});
document.querySelector('#copy-brief').addEventListener('click', async () => {
 try { await navigator.clipboard.writeText(brief); document.querySelector('#copy-status').textContent = t('copied'); }
 catch { document.querySelector('#copy-status').textContent = t('copyError'); }
});
updateLanguage();
