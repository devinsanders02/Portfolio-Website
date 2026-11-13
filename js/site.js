/* bysanders.com — site.js (redesign). No libraries. Every effect is optional:
   the page reads fine with JS off or with reduced motion turned on. */
(() => {
  const doc = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* --------------------------------------------------------- project picker
     After the big "Next" link: every project, so nobody is forced down one path. */
  const PROJECTS = [
    ['wandrd.html', 'WANDRD', 'WANDRD-Hero.webp'], ['kleenbore.html', 'KleenBore', 'assets/kleenbore/hero-saf400.webp'],
    ['gerber-gear.html', 'Gerber Gear', 'GerberGear/GG-Hero.webp'], ['rexburg-rapids.html', 'Rexburg Rapids', 'RexburgRapids-Hero.webp'],
    ['about-face.html', 'AboutFace', 'AboutFace/AF-Hero2.webp'], ['motion-reel.html', 'Motion Reel', 'MotionReel/Motion-Thumbnail1.webp'],
    ['olly-packaging.html', 'Olly', 'Olly/Olly-Hero.webp'], ['identity-system.html', 'Jared Christensen', 'Jared/IS-Hero.webp'],
    ['analog-reboot.html', 'Analog Reboot', 'AnalogReboot/AR-Hero.webp'], ['kindred-roots.html', 'Kindred Roots', 'KindredRoots/KindredRoots-Hero.webp'],
    ['ui-ux.html', 'Interface concepts', 'UI-UX/iOS Thumbnail.webp'],
  ];
  const nextLink = $('main > a.next');
  if (nextLink) {
    const here = location.pathname.split('/').pop() || 'index.html';
    const nav = document.createElement('nav');
    nav.className = 'picker'; nav.setAttribute('aria-label', 'All projects');
    nav.innerHTML = '<div class="wrap"><div class="picker__head"><span class="label label--accent">Or pick any project</span><a class="label u-line" href="work.html">All work</a></div><ul>' +
      PROJECTS.map(([u, n, img]) => `<li><a href="${u}"${u === here ? ' aria-current="page"' : ''}><img src="${img}" alt="" loading="lazy" decoding="async"><b>${n}</b></a></li>`).join('') + '</ul></div>';
    nextLink.after(nav);
  }

  /* ------------------------------------------------------------- no widows
     Joins the last two words of every paragraph, caption and heading with a
     non-breaking space so no word sits alone on its own line (backs up the
     CSS text-wrap rules in browsers that don't support them yet). */
  $$('main p, main li, main dd, main figcaption, main blockquote, main h2, main h3, footer .label').forEach(el => {
    if (el.closest('.slot') || el.classList.contains('fit')) return;
    if (el.textContent.trim().split(/\s+/).length < 4) return;
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let last = null;
    while (w.nextNode()) if (w.currentNode.nodeValue.trim()) last = w.currentNode;
    if (last) last.nodeValue = last.nodeValue.replace(/\s+(\S+)\s*$/, '\u00A0$1');
  });

  /* ---------------------------------------------------------------- slots
     Fills every <div class="slot" data-asset="id"> from assets/manifest.js.
     A slot with a src shows the image; without one it shows a labelled
     placeholder that says exactly which file belongs there. */
  const A = window.ASSETS || {};
  function fillSlot(el) {
    const id = el.dataset.asset, a = A[id];
    if (!a) { el.classList.add('is-empty'); el.innerHTML = `<div class="slot__top"><span>Missing manifest entry</span></div><div class="slot__name">${id}</div>`; return; }
    const src = a.src || '';
    const free = a.free || el.hasAttribute('data-free'); // full-length screenshots keep their own height once real
    if (free && (src || a.interim)) el.style.aspectRatio = 'auto';
    else if (a.ratio && !el.hasAttribute('data-keep-ratio')) el.style.setProperty('--ar', a.ratio.replace(':', ' / '));
    if (src) {
      const img = new Image();
      img.src = src; img.alt = a.alt || a.name; img.decoding = 'async';
      if (!el.hasAttribute('data-eager')) img.loading = 'lazy';
      el.classList.remove('is-empty'); el.innerHTML = ''; el.appendChild(img);
      if (el.hasAttribute('data-zoom')) img.setAttribute('data-lightbox', '');
      return;
    }
    if (a.interim) { // an existing image stands in until the real asset arrives
      el.innerHTML = `<img src="${a.interim}" alt="${a.alt || a.name}" loading="lazy" decoding="async"><span class="slot__interim">Interim · replace with ${a.code || id}</span>`;
      return;
    }
    el.classList.add('is-empty');
    el.innerHTML = `
      <div class="slot__top"><span>${a.code || id}</span><span class="slot__pri ${a.priority === 'essential' ? 'is-essential' : ''}">${a.priority}</span></div>
      <div>
        <div class="slot__name">${a.name}</div>
        <p class="slot__what">${a.contains}</p>
        <div class="slot__spec">${[a.kind, a.ratio, a.size].filter(Boolean).join(' · ')}</div>
      </div>`;
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', `Placeholder: ${a.name}`);
  }
  $$('.slot[data-asset]').forEach(fillSlot);

  /* ------------------------------------------------------------- terrain */
  const topo = $('.topo[data-src]');
  if (topo) {
    fetch(topo.dataset.src).then(r => r.ok ? r.text() : Promise.reject()).then(svg => {
      topo.innerHTML = svg;
      const live = () => { if (!reduce) topo.classList.add('is-live'); };
      if (reduce || sessionStorageGet('topoDrawn')) { live(); return; }
      sessionStorageSet('topoDrawn', '1');
      // Measure each line on screen so the dash covers it end to end (pathLength is
      // unreliable with non-scaling strokes), then clear the dash once the draw is done.
      const el = topo.querySelector('svg'), m = el && el.getScreenCTM();
      const scale = m ? Math.hypot(m.a, m.b) : 1;
      let maxK = 0;
      topo.querySelectorAll('.tp-c').forEach(p => {
        p.removeAttribute('pathLength');
        p.style.setProperty('--len', (p.getTotalLength() * scale + 8).toFixed(1) + 'px');
        maxK = Math.max(maxK, parseFloat(p.style.getPropertyValue('--k')) || 0);
      });
      const dur = parseFloat(getComputedStyle(doc).getPropertyValue('--topo-draw')) || 2400;
      topo.classList.add('is-drawing');
      setTimeout(() => { topo.classList.remove('is-drawing'); live(); }, dur + maxK * 28 + 300);
    }).catch(() => {});
  }
  function sessionStorageGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function sessionStorageSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }

  /* ------------------------------------------------- coordinates scramble
     Runs once on load and on hover. No idle loop. */
  const glyphs = '0123456789°.NSEW';
  function scramble(el) {
    if (reduce || el._busy) return;
    const final = el.dataset.text || el.textContent; el.dataset.text = final; el._busy = true;
    let f = 0; const total = 18;
    const tick = () => {
      el.textContent = final.split('').map((c, i) => (c === ' ' || i < (f / total) * final.length) ? c : glyphs[(Math.random() * glyphs.length) | 0]).join('');
      if (++f <= total) requestAnimationFrame(tick); else { el.textContent = final; el._busy = false; }
    };
    tick();
  }
  $$('[data-scramble]').forEach(el => { setTimeout(() => scramble(el), 300); el.addEventListener('mouseenter', () => scramble(el)); });

  /* ----------------------------------------------------------------- nav */
  const nav = $('.nav');
  const toned = $$('[data-tone]');
  function navTone() {
    if (!nav) return;
    const probe = 30; let tone = 'light';
    for (const s of toned) { const r = s.getBoundingClientRect(); if (r.top <= probe && r.bottom > probe) { tone = s.dataset.tone; } }
    nav.dataset.tone = tone;
  }
  function navState() {
    if (!nav) return;
    const y = scrollY;
    nav.classList.toggle('is-solid', y > 40 && !nav.hasAttribute('data-transparent'));
    const bar = $('.nav__progress', nav);
    if (bar) bar.style.setProperty('--progress', Math.min(1, y / Math.max(1, doc.scrollHeight - innerHeight)).toFixed(4));
  }

  /* -------------------------------------------------------------- stages
     A stage is tall; its inner frame is sticky. Progress through the stage
     (0 → 1) is eased and written to --e, which CSS uses to open the frame. */
  const stages = $$('.stage');
  const smooth = t => t * t * (3 - 2 * t);
  function stageProgress() {
    if (reduce) return;
    for (const s of stages) {
      const r = s.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) continue;
      const run = Math.max(1, (s.offsetHeight - innerHeight) * 0.62); // frame is fully open ~60% of the way through
      const p = Math.min(1, Math.max(0, -r.top / run));
      s.style.setProperty('--e', smooth(p).toFixed(4));
    }
  }

  /* ------------------------------------------------- stacked chapters
     Each .chap is sticky; --p (0 → 1) tracks it sliding up into place, which
     holds its image still (a wipe). The chapter it covers gets --cover. */
  const chaps = $$('.chap');
  // Where a section sits in the page when nothing is stuck (sticky rects stop moving once stuck)
  function flowTop(el) {
    if (!el.classList.contains('chap')) return el.getBoundingClientRect().top + scrollY;
    const box = el.parentElement.getBoundingClientRect().top + scrollY;
    let y = box; for (const c of el.parentElement.children) { if (c === el) break; y += c.offsetHeight; }
    return y;
  }
  function chapProgress() {
    if (reduce || !chaps.length) return;
    chaps.forEach((c, i) => {
      const p = Math.min(1, Math.max(0, 1 - (flowTop(c) - scrollY) / innerHeight));
      c.style.setProperty('--p', p.toFixed(4));
      if (i) chaps[i - 1].style.setProperty('--cover', p.toFixed(4));
    });
  }

  /* ---------------------------------------------------------- chapter rail */
  const rail = $('.rail');
  const railLinks = rail ? $$('a', rail) : [];
  const railTargets = railLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);
  function railState() {
    if (!rail || !railTargets.length) return;
    const start = flowTop(railTargets[0]);
    const end = railTargets[railTargets.length - 1].parentElement.getBoundingClientRect().bottom + scrollY;
    const mid = scrollY + innerHeight * .5;
    rail.classList.toggle('is-on', mid > start + innerHeight * .1 && scrollY + innerHeight * .4 < end);
    let active = 0;
    railTargets.forEach((t, i) => { if (flowTop(t) <= mid) active = i; });
    railLinks.forEach((a, i) => a.classList.toggle('is-active', i === active));
  }

  /* --------------------------------------------------- story strip controls */
  $$('.story__row, .w-story__row').forEach(row => {
    const ctrl = document.createElement('div');
    ctrl.className = 'story__ctrl';
    ctrl.innerHTML = '<button type="button" aria-label="Scroll back">←</button><div class="story__bar" aria-hidden="true"><i></i></div><button type="button" aria-label="Scroll forward">→</button>';
    row.after(ctrl);
    const [prev, next] = $$('button', ctrl), bar = $('.story__bar i', ctrl);
    const step = () => row.clientWidth * .8;
    prev.addEventListener('click', () => row.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
    next.addEventListener('click', () => row.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }));
    const upd = () => {
      const max = row.scrollWidth - row.clientWidth, w = row.clientWidth / row.scrollWidth * 100;
      bar.style.setProperty('--w', w + '%');
      bar.style.setProperty('--l', (max > 0 ? row.scrollLeft / max * (100 - w) : 0) + '%');
      prev.disabled = row.scrollLeft < 4; next.disabled = row.scrollLeft > max - 4;
    };
    row.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); addEventListener('load', upd); upd();
  });

  /* ------------------------------------------------------ horizontal scroll */
  const hs = $$('.hscroll');
  const hsOn = () => !reduce && matchMedia('(hover: hover) and (min-width: 761px)').matches;
  function hsSize() {
    hs.forEach(sec => {
      const track = $('.hscroll__track', sec);
      sec._dist = Math.max(0, track.scrollWidth - innerWidth);
      sec.style.height = hsOn() ? (sec._dist + innerHeight) + 'px' : '';
    });
  }
  function hsProgress() {
    if (!hsOn()) return;
    hs.forEach(sec => {
      const p = Math.min(1, Math.max(0, -sec.getBoundingClientRect().top / Math.max(1, sec._dist)));
      $('.hscroll__track', sec).style.setProperty('--hx', (p * sec._dist).toFixed(1));
    });
  }
  if (hs.length) { hsSize(); addEventListener('resize', hsSize); addEventListener('load', () => { hsSize(); hsProgress(); }); $$('.hscroll img').forEach(i => i.addEventListener('load', hsSize)); }

  // Jump links to chapters land where the chapter is fully in place
  $$('a[href^="#ch-"]').forEach(a => a.addEventListener('click', e => {
    const t = $(a.getAttribute('href')); if (!t) return;
    e.preventDefault();
    const extra = t.classList.contains('stage') ? (t.offsetHeight - innerHeight) * .62 : 0;
    scrollTo({ top: flowTop(t) + extra, behavior: reduce ? 'auto' : 'smooth' });
  }));

  /* ------------------------------------------------------ scroll handler */
  let ticking = false;
  function onScroll() { if (ticking) return; ticking = true; requestAnimationFrame(() => { navTone(); navState(); stageProgress(); chapProgress(); railState(); hsProgress(); ticking = false; }); }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ------------------------------------------------------------- reveals */
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px', threshold: 0.01 });
    $$('.reveal, .reveal-img').forEach(el => io.observe(el));
  } else {
    $$('.reveal, .reveal-img').forEach(el => el.classList.add('is-in'));
  }

  /* -------------------------------------------- index list hover preview */
  const peek = $('.peek');
  if (peek && finePointer) {
    const img = $('img', peek);
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const follow = () => { x += (tx - x) * .18; y += (ty - y) * .18; peek.style.setProperty('--x', `${x}px`); peek.style.setProperty('--y', `${y}px`); raf = Math.abs(tx - x) + Math.abs(ty - y) > .5 ? requestAnimationFrame(follow) : 0; };
    $$('.index a[data-peek]').forEach(a => {
      a.addEventListener('mouseenter', () => { img.src = a.dataset.peek; peek.classList.add('is-on'); });
      a.addEventListener('mouseleave', () => peek.classList.remove('is-on'));
      a.addEventListener('mousemove', e => { tx = e.clientX + 28; ty = e.clientY - peek.offsetHeight / 2; if (!raf) raf = requestAnimationFrame(follow); });
    });
  }

  /* ---------------------------------------------------------- cursor ring */
  const ring = $('.ring');
  if (ring && finePointer && !reduce) {
    let tx = -100, ty = -100, x = -100, y = -100;
    addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; ring.classList.add('is-on'); ring.classList.toggle('is-link', !!e.target.closest('a, button, [data-lightbox]')); }, { passive: true });
    document.addEventListener('mouseleave', () => ring.classList.remove('is-on'));
    (function loop() { x += (tx - x) * .2; y += (ty - y) * .2; ring.style.transform = `translate3d(${x}px, ${y}px, 0)`; requestAnimationFrame(loop); })();
  }

  /* ------------------------------------------------------------- lightbox */
  const zoomables = () => $$('[data-lightbox]');
  if (zoomables().length) {
    const lb = document.createElement('div');
    lb.className = 'lightbox'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Image viewer');
    lb.innerHTML = '<button class="lightbox__close" type="button">Close ✕</button><img alt=""><div class="lightbox__ui"><button type="button" data-d="-1">← Prev</button><span class="lb-count"></span><button type="button" data-d="1">Next →</button></div>';
    document.body.appendChild(lb);
    const big = $('img', lb), count = $('.lb-count', lb);
    let list = [], i = 0, opener = null;
    const show = n => { i = (n + list.length) % list.length; const el = list[i]; big.src = el.currentSrc || el.src; big.alt = el.alt; count.textContent = `${i + 1} / ${list.length}`; };
    const open = el => { const group = el.closest('[data-gallery]'); list = (group ? $$('[data-lightbox]', group) : zoomables()).filter(x => x.tagName === 'IMG'); opener = el; show(list.indexOf(el)); lb.classList.add('is-open'); $('.lightbox__close', lb).focus(); };
    const close = () => { lb.classList.remove('is-open'); opener && opener.focus && opener.focus(); };
    document.addEventListener('click', e => { const el = e.target.closest('img[data-lightbox]'); if (el) { e.preventDefault(); open(el); } });
    lb.addEventListener('click', e => { const d = e.target.closest('[data-d]'); if (d) show(i + +d.dataset.d); else if (e.target === lb || e.target.closest('.lightbox__close')) close(); });
    document.addEventListener('keydown', e => { if (!lb.classList.contains('is-open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(i + 1); if (e.key === 'ArrowLeft') show(i - 1); });
  }

  /* ----------------------------------------------------------------- misc */
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  if (new URLSearchParams(location.search).has('clean')) doc.classList.add('hide-interim');
})();
