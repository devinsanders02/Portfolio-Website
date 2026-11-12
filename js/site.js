/* bysanders.com — site.js (redesign). No libraries. Every effect is optional:
   the page reads fine with JS off or with reduced motion turned on. */
(() => {
  const doc = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

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
      if (!reduce && !sessionStorageGet('topoDrawn')) { topo.classList.add('is-drawing'); sessionStorageSet('topoDrawn', '1'); }
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
  let lastY = scrollY;
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
    nav.classList.toggle('is-hidden', y > 400 && y > lastY + 4 && !nav.contains(document.activeElement));
    if (y < lastY - 4) nav.classList.remove('is-hidden');
    lastY = y;
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

  /* ------------------------------------------------------ scroll handler */
  let ticking = false;
  function onScroll() { if (ticking) return; ticking = true; requestAnimationFrame(() => { navTone(); navState(); stageProgress(); ticking = false; }); }
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
