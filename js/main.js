// =========================================================================
// 0. BULLETPROOF PRELOADER DISMISS
// =========================================================================
function dismissLoader() {
  const loader = document.getElementById('site-loader');
  if (loader) {
    loader.classList.add('hidden');
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
    loader.style.pointerEvents = 'none';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 400);
  }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(dismissLoader, 100);
} else {
  document.addEventListener('DOMContentLoaded', () => setTimeout(dismissLoader, 150));
}
window.addEventListener('load', dismissLoader);
setTimeout(dismissLoader, 900);

// =========================================================================
// MAIN APPLICATION RUNTIME
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  dismissLoader();

  // Dynamic Copyright Year
  const yearSpan = document.getElementById('copyright-year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Scroll to Contact Button Handlers
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };
  document.getElementById('top-contact-btn')?.addEventListener('click', scrollToContact);

  // Return to Top Handler
  document.getElementById('footer-scroll-top-btn')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Floating Nav & Index Overlay Handlers
  const floatBtn = document.getElementById('floating-nav-btn');
  const overlay = document.getElementById('index-overlay');
  const closeBtn = document.getElementById('close-overlay-btn');
  const overlayContact = document.getElementById('overlay-contact-link');

  // Unified Scroll Handler: Fade Hero Elements & Toggle Floating Button
  const handleScrollDynamics = () => {
    const scrollY = window.scrollY;
    const fadeThreshold = 360;

    const fadeProgress = Math.max(0, 1 - (scrollY / fadeThreshold));
    const translateY = -(scrollY * 0.14);

    const fadeElements = document.querySelectorAll('.js-fade-on-scroll');
    fadeElements.forEach(el => {
      el.style.opacity = fadeProgress;
      el.style.transform = `translateY(${translateY}px)`;
      el.style.pointerEvents = fadeProgress < 0.1 ? 'none' : 'auto';
    });

    if (floatBtn) {
      if (scrollY > 240) {
        floatBtn.classList.add('visible');
      } else {
        floatBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScrollDynamics, { passive: true });
  handleScrollDynamics();

  const openOverlay = () => {
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeOverlay = () => {
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
  };

  floatBtn?.addEventListener('click', openOverlay);
  closeBtn?.addEventListener('click', closeOverlay);

  overlayContact?.addEventListener('click', () => {
    closeOverlay();
    setTimeout(scrollToContact, 450);
  });

  // =========================================================================
  // RESPONSIVE COORDINATE DECRYPT & TELEMETRY ENGINE
  // =========================================================================
  const glyphs = '0123456789ABCDEF#%&*+=-_/';
  const scrambleElements = document.querySelectorAll('.js-scramble-text');
  const coordEl = document.querySelector('.meta-coords');

  const runScramble = (el, speed = 26) => {
    if (!el) return;
    const originalText = el.getAttribute('data-original') || el.textContent.trim();
    let iteration = 0;

    if (el._scrambleTimer) clearInterval(el._scrambleTimer);

    el._scrambleTimer = setInterval(() => {
      el.textContent = originalText
        .split('')
        .map((char, index) => {
          if (char === ' ' || char === '°') return char;
          if (index < iteration) return originalText[index];
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join('');

      if (iteration >= originalText.length) {
        clearInterval(el._scrambleTimer);
        el._scrambleTimer = null;
      }
      iteration += 1;
    }, speed);
  };

  // 1. Initial Arrival Decrypt
  setTimeout(() => {
    scrambleElements.forEach(el => runScramble(el, 26));
  }, 250);

  // 2. Hover Interaction: Re-scramble on direct cursor contact
  scrambleElements.forEach(el => {
    el.addEventListener('mouseenter', () => runScramble(el, 20));
  });

  // 3. Proactive Initial Scroll Trigger
  let hasScrolledOnce = false;
  window.addEventListener('scroll', () => {
    if (!hasScrolledOnce && window.scrollY > 20 && window.scrollY < 200) {
      hasScrolledOnce = true;
      runScramble(coordEl, 18);
    }
  }, { passive: true });

  // 4. Calm 4.5s Idle Pulse
  if (coordEl) {
    setInterval(() => {
      if (window.scrollY > 300) return;
      runScramble(coordEl, 22);
    }, 4500);
  }

  // =========================================================================
  // TOPOGRAPHIC VECTOR PARALLAX DRIFT
  // =========================================================================
  const topoCanvas = document.querySelector('.hero-topography-canvas svg');
  if (topoCanvas) {
    window.addEventListener('mousemove', (e) => {
      const xOffset = (e.clientX / window.innerWidth - 0.5) * 14;
      const yOffset = (e.clientY / window.innerHeight - 0.5) * 8;
      topoCanvas.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    }, { passive: true });
  }

  // =========================================================================
  // PRECISION SURVEY RETICLE CURSOR
  // =========================================================================
  const cursor = document.getElementById('survey-cursor');
  
  if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = -100;
    let mouseY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

      // Proximity detection for summit pocket (Upper-Right Quadrant: X 68%-85%, Y 22%-48%)
      const relX = mouseX / window.innerWidth;
      const relY = mouseY / window.innerHeight;
      const isNearPeak = window.scrollY < 300 && (relX > 0.68 && relX < 0.86) && (relY > 0.22 && relY < 0.48);

      if (isNearPeak) {
        cursor.classList.add('cursor-summit');
      } else {
        cursor.classList.remove('cursor-summit');
      }
    }, { passive: true });

    const interactiveTargets = 'a, button, .stage-bar-btn, .hero-nav-item, .view-all-btn, .duo-card';
    document.querySelectorAll(interactiveTargets).forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
    });
  }

  // Helper function to resolve dedicated project page URLs
  const getProjectUrl = (slug) => {
    if (slug === 'wandrd') return 'wandrd.html';
    if (slug === 'rexburg-rapids') return 'rexburg-rapids.html';
    if (slug === 'kindred-roots') return 'kindred-roots.html';
    if (slug === 'analog-reboot') return 'analog-reboot.html';
    if (slug === 'gerber-gear') return 'gerber-gear.html';
    if (slug === 'motion-reel') return 'motion-reel.html';
    if (slug === 'identity-system' || slug === 'jared' || slug === 'jared-christensen') return 'identity-system.html';
    if (slug === 'rustic-mountain' || slug === 'rustic-mountain-bistro') return 'rustic-mountain.html';
    if (slug === 'olly-packaging' || slug === 'olly') return 'olly-packaging.html';
    if (slug === 'about-face' || slug === 'aboutface') return 'about-face.html';
    if (slug === 'rippl' || slug === 'rippl-hoodie') return 'rippl.html';
    return `project.html?slug=${slug}`;
  };

  const getProjectCategory = (proj) => {
    const text = `${proj.services || ''} ${proj.title || ''} ${proj.slug || ''}`.toLowerCase();
    if (text.includes('packag') || text.includes('dieline') || text.includes('can') || text.includes('sleeve')) {
      return 'packaging';
    }
    if (text.includes('brand') || text.includes('identity') || text.includes('logo') || text.includes('visual system')) {
      return 'branding';
    }
    return 'other';
  };

  // 1. Render Featured Work Feed (index.html) - Wide Stage Single Canvas
  const container = document.getElementById('featured-work-container');
  if (container && typeof projects !== 'undefined') {
    const featuredProjects = projects.slice(0, 5);

    featuredProjects.forEach((project, index) => {
      const allImages = [project.heroImage, ...(project.galleryImages || [])].filter(Boolean);
      const projectUrl = getProjectUrl(project.slug);

      let mainTitle = project.title;
      let subTitle = '';
      if (project.title.includes('—')) {
        const parts = project.title.split('—');
        mainTitle = parts[0].trim();
        subTitle = parts.slice(1).join('—').trim();
      } else if (project.title.includes(' - ')) {
        const parts = project.title.split(' - ');
        mainTitle = parts[0].trim();
        subTitle = parts.slice(1).join(' - ').trim();
      }

      let barsHtml = '';
      if (allImages.length > 1) {
        barsHtml = `
          <div class="stage-indicator-bars" id="bars-${index}">
            ${allImages.map((_, i) => `
              <button class="stage-bar-btn" data-img-idx="${i}" style="width: ${i === 0 ? '2.5rem' : '0.85rem'}; background-color: ${i === 0 ? '#FFFFFF' : 'rgba(255, 255, 255, 0.35)'};" aria-label="Slide ${i + 1}"></button>
            `).join('')}
          </div>
        `;
      }

      const card = document.createElement('section');
      card.className = 'project-card-wrapper';

      card.innerHTML = `
        <div class="stage-canvas-box" id="gallery-box-${index}">
          <img id="img-display-${index}" class="stage-image" src="${allImages[0]}" alt="${project.title}">
          <div class="stage-scrim"></div>
          <div class="stage-content-overlay">
            <div class="stage-header-row">
              <div class="stage-title-group">
                <span class="stage-category-label">${project.services}</span>
                <h2 class="stage-title">
                  ${mainTitle}${subTitle ? ` <span class="stage-subtitle">— ${subTitle}</span>` : ''}
                </h2>
              </div>
              ${barsHtml}
            </div>
            <div class="stage-hover-drawer">
              <p class="stage-summary-text">${project.summary}</p>
              <a href="${projectUrl}" class="stage-action-btn">
                <span>View Project</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </a>
            </div>
          </div>
        </div>
      `;

      container.appendChild(card);

      let currentIdx = 0;
      const imgEl = document.getElementById(`img-display-${index}`);
      const boxEl = document.getElementById(`gallery-box-${index}`);
      const barsContainer = document.getElementById(`bars-${index}`);

      const updateGallery = (nextIdx) => {
        currentIdx = nextIdx;
        imgEl.style.opacity = '0.35';
        setTimeout(() => {
          imgEl.src = allImages[currentIdx];
          imgEl.style.opacity = '1';
        }, 150);

        if (barsContainer) {
          const btns = barsContainer.querySelectorAll('.stage-bar-btn');
          btns.forEach((btn, i) => {
            btn.style.width = i === currentIdx ? '2.5rem' : '0.85rem';
            btn.style.backgroundColor = i === currentIdx ? '#FFFFFF' : 'rgba(255, 255, 255, 0.35)';
          });
        }
      };

      boxEl?.addEventListener('click', (e) => {
        if (e.target.closest('.stage-action-btn')) return;
        const next = (currentIdx + 1) % allImages.length;
        updateGallery(next);
      });

      barsContainer?.querySelectorAll('.stage-bar-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetIdx = parseInt(btn.getAttribute('data-img-idx'), 10);
          updateGallery(targetIdx);
        });
      });
    });
  }

  // 2. Render 2-Column Wide Archive with Filter (work.html)
  const workGrid = document.getElementById('work-grid');
  if (workGrid && typeof projects !== 'undefined') {
    const workProjects = projects.filter(p => {
      const lower = `${p.services || ''} ${p.slug || ''}`.toLowerCase();
      return !lower.includes('ui/ux') && !lower.includes('app prototype') && !lower.includes('interface');
    });

    let brandingCount = 0;
    let packagingCount = 0;
    let otherCount = 0;

    workProjects.forEach(p => {
      const cat = getProjectCategory(p);
      if (cat === 'branding') brandingCount++;
      else if (cat === 'packaging') packagingCount++;
      else otherCount++;
    });

    const countAllEl = document.getElementById('count-all');
    const countBrandingEl = document.getElementById('count-branding');
    const countPackagingEl = document.getElementById('count-packaging');
    const countOtherEl = document.getElementById('count-other');

    if (countAllEl) countAllEl.textContent = workProjects.length;
    if (countBrandingEl) countBrandingEl.textContent = brandingCount;
    if (countPackagingEl) countPackagingEl.textContent = packagingCount;
    if (countOtherEl) countOtherEl.textContent = otherCount;

    const renderCards = (filter = 'all') => {
      workGrid.innerHTML = '';
      const visible = filter === 'all'
        ? workProjects
        : workProjects.filter(p => getProjectCategory(p) === filter);

      visible.forEach(p => {
        const card = document.createElement('a');
        card.href = getProjectUrl(p.slug);
        card.className = 'duo-card';
        card.setAttribute('data-category', getProjectCategory(p));

        card.innerHTML = `
          <img class="duo-card-img" src="${p.heroImage}" alt="${p.title}">
          <div class="duo-scrim"></div>
          <div class="duo-content-overlay">
            <div class="duo-meta-row">
              <span class="duo-tag">${p.services}</span>
              <span class="duo-year">${p.year || '2026'}</span>
            </div>
            <h2 class="duo-title">${p.title}</h2>
            <div class="duo-hover-drawer">
              <p class="duo-summary">${p.summary}</p>
              <span class="duo-arrow-btn">
                <span>View</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </span>
            </div>
          </div>
        `;
        workGrid.appendChild(card);
      });
    };

    renderCards('all');

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterVal = btn.getAttribute('data-filter');
        renderCards(filterVal);
      });
    });
  }
});
