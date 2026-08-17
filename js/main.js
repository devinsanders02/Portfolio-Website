document.addEventListener('DOMContentLoaded', () => {
  // Set Dynamic Copyright Year
  const yearSpan = document.getElementById('copyright-year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Scroll to Contact Button Handlers
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };
  document.getElementById('top-contact-btn')?.addEventListener('click', scrollToContact);

  // Floating Nav & Index Overlay Handlers
  const floatBtn = document.getElementById('floating-nav-btn');
  const overlay = document.getElementById('index-overlay');
  const closeBtn = document.getElementById('close-overlay-btn');
  const overlayContact = document.getElementById('overlay-contact-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight * 0.5) {
      floatBtn?.classList.add('visible');
    } else {
      floatBtn?.classList.remove('visible');
    }
  }, { passive: true });

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

  // 1. Render Featured Work Feed (index.html)
  const container = document.getElementById('featured-work-container');
  if (container && typeof projects !== 'undefined') {
    const featuredProjects = projects.slice(0, 5);

    featuredProjects.forEach((project, index) => {
      const isAccentBg = index % 2 === 1;
      const allImages = [project.heroImage, ...(project.galleryImages || [])].filter(Boolean);
      const secondaryImages = (project.galleryImages || []).filter(Boolean).slice(0, 2);

      // Smart Title Split: handles "Name - Subtitle", "Name — Subtitle", or single first word
      let coloredPart = '';
      let restPart = '';

      if (project.title.includes('—')) {
        const parts = project.title.split('—');
        coloredPart = parts[0].trim();
        restPart = parts.slice(1).join('—').trim();
      } else if (project.title.includes(' - ')) {
        const parts = project.title.split(' - ');
        coloredPart = parts[0].trim();
        restPart = parts.slice(1).join(' - ').trim();
      } else if (project.title.includes('-')) {
        const parts = project.title.split('-');
        coloredPart = parts[0].trim();
        restPart = parts.slice(1).join('-').trim();
      } else {
        const titleWords = project.title.split(' ');
        coloredPart = titleWords[0];
        restPart = titleWords.slice(1).join(' ');
      }

      const bgColor = isAccentBg ? (project.accentColor || '#2C3E50') : '#F4F5F7';
      const textColor = isAccentBg ? '#FFFFFF' : '#2C3E50';
      const metaColor = isAccentBg ? 'rgba(255,255,255,0.55)' : '#2C3E5070';
      const summaryColor = isAccentBg ? 'rgba(255,255,255,0.8)' : '#2C3E50CC';
      const firstWordColor = isAccentBg ? 'rgba(255,255,255,0.75)' : (project.accentColor || '#F15B22');

      const card = document.createElement('section');
      card.className = 'project-card-wrapper';
      card.style.backgroundColor = bgColor;

      let barsHtml = '';
      if (allImages.length > 1) {
        barsHtml = `
          <div class="indicator-bars" id="bars-${index}">
            ${allImages.map((_, i) => `
              <button class="indicator-bar-btn" data-img-idx="${i}" style="width: ${i === 0 ? '2.25rem' : '0.85rem'}; background-color: ${i === 0 ? (isAccentBg ? '#fff' : (project.accentColor || '#F15B22')) : (isAccentBg ? 'rgba(255,255,255,0.25)' : '#2C3E5020')};" aria-label="Slide ${i + 1}"></button>
            `).join('')}
          </div>
        `;
      }

      let secondaryHtml = '';
      if (secondaryImages.length >= 2) {
        secondaryHtml = `
          <div class="secondary-images-row">
            <div class="secondary-images-grid">
              ${secondaryImages.map((img, i) => `
                <div class="secondary-img-wrapper">
                  <img src="${img}" alt="${project.title} detail ${i + 1}">
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="gallery-container">
          <div class="gallery-image-box" id="gallery-box-${index}">
            <img id="img-display-${index}" src="${allImages[0]}" alt="${project.title}">
          </div>
          ${barsHtml}
        </div>

        <div class="project-info-grid">
          <div>
            <h2 class="project-title" style="color: ${textColor};">
              <span style="color: ${firstWordColor};">${coloredPart}</span>
              ${restPart ? ` — ${restPart}` : ''}
            </h2>
            <p class="project-services" style="color: ${metaColor};">${project.services}</p>
          </div>
          <div>
            <p class="project-summary" style="color: ${summaryColor};">${project.summary}</p>
            <a href="project.html?slug=${project.slug}" class="project-link-btn" style="color: ${textColor};">
              View Project Details
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>

        ${secondaryHtml}
      `;

      container.appendChild(card);

      let currentIdx = 0;
      const imgEl = document.getElementById(`img-display-${index}`);
      const boxEl = document.getElementById(`gallery-box-${index}`);
      const barsContainer = document.getElementById(`bars-${index}`);

      const updateGallery = (nextIdx) => {
        currentIdx = nextIdx;
        imgEl.style.opacity = '0.3';
        setTimeout(() => {
          imgEl.src = allImages[currentIdx];
          imgEl.style.opacity = '1';
        }, 150);

        if (barsContainer) {
          const btns = barsContainer.querySelectorAll('.indicator-bar-btn');
          btns.forEach((btn, i) => {
            btn.style.width = i === currentIdx ? '2.25rem' : '0.85rem';
            btn.style.backgroundColor = i === currentIdx
              ? (isAccentBg ? '#fff' : (project.accentColor || '#F15B22'))
              : (isAccentBg ? 'rgba(255,255,255,0.25)' : '#2C3E5020');
          });
        }
      };

      boxEl?.addEventListener('click', () => {
        const next = (currentIdx + 1) % allImages.length;
        updateGallery(next);
      });

      barsContainer?.querySelectorAll('.indicator-bar-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetIdx = parseInt(btn.getAttribute('data-img-idx'), 10);
          updateGallery(targetIdx);
        });
      });
    });
  }

  // 2. Render Full Archive Grid (work.html)
  const workGrid = document.getElementById('work-grid');
  if (workGrid && typeof projects !== 'undefined') {
    projects.forEach((proj) => {
      const item = document.createElement('a');
      item.href = `project.html?slug=${proj.slug}`;
      item.className = 'archive-card';
      item.innerHTML = `
        <div class="archive-thumb-box">
          <img src="${proj.heroImage}" alt="${proj.title}">
        </div>
        <div class="archive-card-title">${proj.title}</div>
        <div class="archive-card-meta">${proj.services} · ${proj.year}</div>
      `;
      workGrid.appendChild(item);
    });
  }

  // 3. Render Dynamic Project Case Study (project.html)
  const detailContainer = document.getElementById('project-detail-content');
  if (detailContainer && typeof projects !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const currentSlug = urlParams.get('slug');
    const project = projects.find(p => p.slug === currentSlug) || projects[0];

    if (project) {
      document.title = `${project.title} | Devin Sanders`;

      detailContainer.innerHTML = `
        <section class="proj-hero-banner">
          <img src="${project.heroImage}" alt="${project.title}">
          <div class="proj-hero-title-overlay">
            <h1 class="proj-big-title">${project.title}</h1>
          </div>
        </section>

        <section class="proj-meta-grid">
          <div>
            <span class="uppercase-label" style="margin-bottom: 0.75rem;">${project.industry || 'Case Study'}</span>
            <p class="proj-summary-text">${project.summary}</p>
          </div>
          <div>
            <div class="meta-item">
              <div class="meta-label">Client</div>
              <div class="meta-val">${project.title}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Services</div>
              <div class="meta-val">${project.services}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Year</div>
              <div class="meta-val">${project.year}</div>
            </div>
          </div>
        </section>

        <section class="case-narrative">
          <div>
            <h3>The Challenge</h3>
            <p>${project.challenge || 'No challenge description provided.'}</p>
          </div>
          <div>
            <h3>The Strategy</h3>
            <p>${project.strategy || 'No strategy description provided.'}</p>
          </div>
          <div>
            <h3>The Process</h3>
            <p>${project.process || 'No process description provided.'}</p>
          </div>
          <div>
            <h3>The Outcome</h3>
            <p>${project.outcome || 'No outcome description provided.'}</p>
          </div>
        </section>

        <section class="case-gallery-feed">
          ${(project.galleryImages || []).map(img => `
            <img src="${img}" alt="${project.title} image showcase">
          `).join('')}
        </section>
      `;
    }
  }
});
