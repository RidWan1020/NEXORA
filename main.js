/**
 * NEXORA — Interactive Engine
 * Features:
 *  - Three.js 3D Hero Sculpture with mouse reactivity & smooth inertia
 *  - Three.js About Section Geometric Wireframe Core
 *  - Three.js CTA Warping Particle Halo
 *  - Custom Cursor & Magnetic Targets
 *  - 3D Tilt for Browser Preview Cards
 *  - Scroll-based Nav Glassmorphism
 *  - IntersectionObserver Animated Metric Counters
 *  - Scroll-triggered Reveal Animations
 *  - Interactive Project Modal & Live Previews
 *  - Validation & Feedback for Inquiry Form
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initStickyHeader();
  initMobileMenu();
  initScrollReveals();
  initMetricCounters();
  initCard3DTilt();
  initServicesInteraction();
  initModalPreview();
  initInquiryForm();

  // Admin & Portfolio Showcase Management System
  initAdminSystem();
  initPortfolioFilter();
  initServiceRowClickFilter();
  initAddProjectModal();
  loadSavedProjects();

  // 3D Canvas Visuals (Three.js)
  if (typeof THREE !== 'undefined') {
    initHero3D();
    initAbout3D();
    initCTA3D();
    initServiceMicroCanvases();
  }
});

/* ==========================================================================
   CUSTOM CURSOR & MAGNETIC BUTTONS
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring || window.innerWidth <= 1024) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Magnetic & Hover expansions
  const hoverables = document.querySelectorAll('a, button, .service-row, .industry-card, input, select, textarea');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active'));
  });

  // Magnetic effect on specific CTA buttons
  const magneticElements = document.querySelectorAll('.magnetic-target');
  magneticElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0px, 0px)';
    });
  });
}

/* ==========================================================================
   STICKY HEADER & GLASSMORPHISM
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('mainHeader');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   MOBILE MENU DRAWER
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.getElementById('mobileMenuToggle');
  const drawer = document.getElementById('mobileDrawer');
  if (!toggle || !drawer) return;

  let isOpen = false;

  const toggleMenu = () => {
    isOpen = !isOpen;
    drawer.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  toggle.addEventListener('click', toggleMenu);

  // Close when clicking link
  const drawerLinks = drawer.querySelectorAll('.drawer-link');
  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (isOpen) toggleMenu();
    });
  });
}

/* ==========================================================================
   SCROLL-TRIGGERED REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveals() {
  const elements = document.querySelectorAll('.reveal-on-scroll, .reveal-card, .reveal-step');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   ANIMATED METRIC COUNTERS
   ========================================================================== */
function initMetricCounters() {
  const cards = document.querySelectorAll('[data-counter-card]');
  if (!cards.length) return;

  const animateCount = (element) => {
    const numEl = element.querySelector('.metric-num');
    if (!numEl || numEl.dataset.counted) return;
    numEl.dataset.counted = 'true';

    const target = parseFloat(numEl.dataset.target) || 0;
    const suffix = numEl.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      numEl.textContent = (current < 10 && target < 10 ? `0${current}` : current) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        numEl.textContent = (target < 10 ? `0${target}` : target) + suffix;
      }
    };
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  cards.forEach((card) => observer.observe(card));
}

/* ==========================================================================
   3D PERSPECTIVE TILT ON BROWSER PREVIEW CARDS
   ========================================================================== */
function initCard3DTilt() {
  if (window.innerWidth <= 1024) return;
  const cards = document.querySelectorAll('.tilt-target');

  cards.forEach((card) => {
    const parent = card.closest('.project-viewport-wrapper');
    if (!parent) return;

    parent.addEventListener('mousemove', (e) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    parent.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ==========================================================================
   SERVICES SECTION ACCORDION & HIGHLIGHTS
   ========================================================================== */
function initServicesInteraction() {
  const rows = document.querySelectorAll('.service-row');
  rows.forEach((row) => {
    row.addEventListener('mouseenter', () => {
      rows.forEach((r) => r.classList.remove('active'));
      row.classList.add('active');
    });
  });
}

/* ==========================================================================
   MODAL PREVIEW FOR LIVE PROJECTS
   ========================================================================== */
const projectData = {
  luxecut: {
    name: 'LUXECUT — Premium Men\'s Grooming Studio',
    url: 'https://luxecut.vercel.app/',
    img: 'assets/images/luxecut.jpg',
    category: 'BARBERSHOP / BOOKING'
  },
  aura: {
    name: 'AURA — Quiet Luxury Beauty Studio',
    url: 'https://aura-xi-self.vercel.app/',
    img: 'assets/images/aura.jpg',
    category: 'SALON / BEAUTY'
  },
  elan: {
    name: 'ÉLAN HOUSE — Boutique Luxury Hotel & Suites',
    url: 'https://elanhouse-kappa.vercel.app/',
    img: 'assets/images/elan.jpg',
    category: 'HOTEL / HOSPITALITY'
  },
  burgr: {
    name: 'BURGR — Modern Smash Burger Restaurant',
    url: 'https://burgr-cyan.vercel.app/',
    img: 'assets/images/burgr.jpg',
    category: 'RESTAURANT / ORDERING'
  },
  noir: {
    name: 'NOIR — Contemporary Fine Dining',
    url: 'https://noir-xi-five.vercel.app/',
    img: 'assets/images/noir.jpg',
    category: 'FINE DINING / GASTRONOMY'
  }
};

function initModalPreview() {
  const modal = document.getElementById('previewModal');
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalCloseBtn');
  const modalName = document.getElementById('modalProjectName');
  const modalBadge = document.getElementById('modalBadge');
  const directLink = document.getElementById('modalDirectLink');
  const modalImg = document.getElementById('modalPreviewImage');
  const modalIframe = document.getElementById('modalPreviewIframe');
  const modalLoading = document.getElementById('modalLoading');

  if (!modal) return;

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (modalIframe) modalIframe.src = '';
  };

  const openModal = (projectId) => {
    const data = projectData[projectId];
    if (!data) return;

    modalName.textContent = data.name;
    modalBadge.textContent = data.category;
    directLink.href = data.url;
    modalImg.src = data.img;

    // Show high-res fallback immediately
    modalImg.style.display = 'block';
    if (modalLoading) modalLoading.style.display = 'flex';

    // Attempt live iframe load with fallback
    if (modalIframe) {
      modalIframe.src = data.url;
      modalIframe.onload = () => {
        if (modalLoading) modalLoading.style.display = 'none';
        modalImg.style.display = 'none';
      };
      // Fallback timeout in case frame embedding is restricted by CSP
      setTimeout(() => {
        if (modalLoading) modalLoading.style.display = 'none';
      }, 2500);
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.openModalPreview = openModal;

  document.querySelectorAll('.preview-modal-trigger').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const proj = btn.dataset.targetProject;
      openModal(proj);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   INQUIRY FORM HANDLING & VALIDATION
   ========================================================================== */
function initInquiryForm() {
  const form = document.getElementById('inquiryForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('btnSubmitForm');
  if (!form || !feedback || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    const requiredInputs = form.querySelectorAll('[required]');

    requiredInputs.forEach((input) => {
      const group = input.closest('.form-group');
      if (!input.value.trim() || (input.type === 'email' && !validateEmail(input.value))) {
        if (group) group.classList.add('has-error');
        isValid = false;
      } else {
        if (group) group.classList.remove('has-error');
      }
    });

    if (!isValid) return;

    submitBtn.disabled = true;
    const origText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>SENDING INQUIRY...</span>';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origText;
      form.reset();
      feedback.className = 'form-feedback success';
      feedback.innerHTML = `
        <strong>Thank you for reaching out!</strong><br>
        Your project inquiry has been received. Julian & the NEXORA team will review your specifications and reply with a creative deck within 24 business hours.
      `;
      feedback.style.display = 'block';

      // Hide message after 10s
      setTimeout(() => {
        feedback.style.display = 'none';
      }, 10000);
    }, 1200);
  });

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

/* ==========================================================================
   ADMIN AUTHENTICATION & POSTING PORTAL
   ========================================================================== */
let isAdminAuthenticated = localStorage.getItem('nexora_admin_authed') === 'true';
let currentFilter = 'all';

function initAdminSystem() {
  const openAdminBtn = document.getElementById('openAdminBtn');
  const drawerOpenAdminBtn = document.getElementById('drawerOpenAdminBtn');

  const authModal = document.getElementById('adminAuthModal');
  const authBackdrop = document.getElementById('adminAuthBackdrop');
  const authCloseBtn = document.getElementById('adminAuthCloseBtn');
  const authForm = document.getElementById('adminAuthForm');
  const authPasscode = document.getElementById('adminPasscode');
  const authErrorMsg = document.getElementById('authErrorMsg');
  const demoQuickBtn = document.getElementById('demoQuickAdminBtn');

  window.openAdminPortal = function() {
    if (isAdminAuthenticated) {
      const addModal = document.getElementById('addProjectModal');
      if (addModal) {
        addModal.classList.add('active');
        addModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    } else {
      openAuthModal();
    }
  };

  function openAuthModal() {
    if (!authModal) return;
    authModal.classList.add('active');
    authModal.setAttribute('aria-hidden', 'false');
    if (authPasscode) authPasscode.focus();
    if (authErrorMsg) authErrorMsg.classList.remove('active');
  }

  function closeAuthModal() {
    if (!authModal) return;
    authModal.classList.remove('active');
    authModal.setAttribute('aria-hidden', 'true');
    if (authForm) authForm.reset();
  }

  if (openAdminBtn) openAdminBtn.addEventListener('click', window.openAdminPortal);
  if (drawerOpenAdminBtn) drawerOpenAdminBtn.addEventListener('click', window.openAdminPortal);

  if (authCloseBtn) authCloseBtn.addEventListener('click', closeAuthModal);
  if (authBackdrop) authBackdrop.addEventListener('click', closeAuthModal);

  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = authPasscode.value.trim();
      if (code === '1234' || code.toLowerCase() === 'admin') {
        isAdminAuthenticated = true;
        localStorage.setItem('nexora_admin_authed', 'true');
        closeAuthModal();
        showToast('🛡️ Admin Authenticated. Opening post form...');
        setTimeout(() => {
          window.openAdminPortal();
        }, 300);
      } else {
        if (authErrorMsg) authErrorMsg.classList.add('active');
      }
    });
  }

  if (demoQuickBtn) {
    demoQuickBtn.addEventListener('click', () => {
      isAdminAuthenticated = true;
      localStorage.setItem('nexora_admin_authed', 'true');
      closeAuthModal();
      showToast('⚡ Quick Demo Access Granted.');
      setTimeout(() => {
        window.openAdminPortal();
      }, 300);
    });
  }
}

/* ==========================================================================
   PORTFOLIO SERVICE FILTERING & SHOWCASE SYSTEM
   ========================================================================== */
function initPortfolioFilter() {
  const filterPills = document.querySelectorAll('.filter-pill');
  if (!filterPills.length) return;

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const filterKey = pill.dataset.filter || 'all';
      currentFilter = filterKey;

      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      applyFilter(filterKey);
    });
  });

  updateFilterCounts();
}

function updateFilterCounts() {
  const projects = document.querySelectorAll('.project-showcase');
  const counts = {
    all: 0,
    'web-design': 0,
    'web-development': 0,
    'booking-experiences': 0,
    'restaurant-ordering': 0,
    'brand-digital-experience': 0,
    'responsive-mobile-design': 0
  };

  projects.forEach((proj) => {
    counts.all++;

    const servicesAttr = proj.dataset.services || '';
    const services = servicesAttr.split(' ');

    services.forEach((s) => {
      if (counts[s] !== undefined) {
        counts[s]++;
      }
    });
  });

  Object.keys(counts).forEach((key) => {
    const el = document.getElementById(`count-${key}`);
    if (el) el.textContent = counts[key];
  });
}

function applyFilter(filterKey) {
  const projects = document.querySelectorAll('.project-showcase');
  let visibleCount = 0;

  projects.forEach((proj) => {
    const servicesAttr = proj.dataset.services || '';
    const matchesFilter = filterKey === 'all' || servicesAttr.includes(filterKey);

    if (matchesFilter) {
      proj.classList.remove('filter-hidden');
      visibleCount++;
    } else {
      proj.classList.add('filter-hidden');
    }
  });

  let emptyState = document.getElementById('emptyShowcaseState');
  if (visibleCount === 0) {
    if (!emptyState) {
      emptyState = document.createElement('div');
      emptyState.id = 'emptyShowcaseState';
      emptyState.className = 'empty-showcase-state';
      const container = document.getElementById('projectsContainer');
      if (container) container.appendChild(emptyState);
    }
    emptyState.style.display = 'flex';
    emptyState.innerHTML = `
      <div class="empty-showcase-icon">⚡</div>
      <h3 class="empty-showcase-title">No Websites Found in This Category</h3>
      <p class="empty-showcase-desc">There are currently no live showcase projects tagged under this specific service discipline.</p>
      <button class="btn btn-primary btn-sm" onclick="document.querySelector('[data-filter=all]').click()">VIEW ALL WORK</button>
    `;
  } else if (emptyState) {
    emptyState.style.display = 'none';
  }
}

function initServiceRowClickFilter() {
  const serviceRows = document.querySelectorAll('.service-row[data-service-filter]');
  serviceRows.forEach((row) => {
    row.addEventListener('click', () => {
      const filterKey = row.dataset.serviceFilter;
      if (!filterKey) return;

      const targetPill = document.querySelector(`.filter-pill[data-filter="${filterKey}"]`);
      if (targetPill) {
        targetPill.click();
        const workSection = document.getElementById('work');
        if (workSection) {
          workSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/* ==========================================================================
   POST NEW SHOWCASE WEBSITE MODAL & STORAGE SYSTEM
   ========================================================================== */
function initAddProjectModal() {
  const modal = document.getElementById('addProjectModal');
  const openBtn = document.getElementById('openAddProjectModal');
  const closeBtn = document.getElementById('addModalCloseBtn');
  const cancelBtn = document.getElementById('cancelAddProject');
  const backdrop = document.getElementById('addModalBackdrop');
  const form = document.getElementById('addProjectForm');

  if (!modal) return;

  const openModal = () => {
    if (!isAdminAuthenticated) {
      if (window.openAdminPortal) window.openAdminPortal();
      return;
    }
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('newProjName').value.trim();
      const category = document.getElementById('newProjCategory').value.trim();
      const tagline = document.getElementById('newProjTagline').value.trim();
      const url = document.getElementById('newProjUrl').value.trim();
      const desc = document.getElementById('newProjDesc').value.trim();
      const deliverables = document.getElementById('newProjDeliverables').value.trim();
      let img = document.getElementById('newProjImg').value.trim();

      const serviceCheckboxes = form.querySelectorAll('input[name="services"]:checked');
      const selectedServices = Array.from(serviceCheckboxes).map((cb) => cb.value);

      if (!selectedServices.length) {
        alert('Please select at least one service category.');
        return;
      }

      if (!img) {
        img = createDynamicGradientPlaceholder(name, category);
      }

      const id = 'custom-' + Date.now();
      const projectObj = {
        id,
        name,
        category,
        tagline,
        url,
        description: desc,
        services: selectedServices.join(' '),
        deliverables: deliverables ? deliverables.split(',').map((d) => d.trim()) : selectedServices,
        img,
        custom: true,
        createdAt: new Date().toISOString()
      };

      const savedProjects = JSON.parse(localStorage.getItem('nexora_custom_projects') || '[]');
      savedProjects.unshift(projectObj);
      localStorage.setItem('nexora_custom_projects', JSON.stringify(savedProjects));

      projectData[id] = {
        name: `${name} — ${tagline}`,
        url: url,
        img: img,
        category: category
      };

      renderProjectCard(projectObj, true);

      updateFilterCounts();
      applyFilter('all');

      closeModal();
      form.reset();
      showToast(`✦ Website '${name}' successfully published to Portfolio!`);

      const newCard = document.getElementById(`project-${id}`);
      if (newCard) {
        newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
}

function renderProjectCard(p, isNew = false) {
  const container = document.getElementById('projectsContainer');
  if (!container) return;

  const card = document.createElement('article');
  card.className = `project-showcase ${isNew ? 'reveal-card is-revealed' : ''}`;
  card.id = `project-${p.id}`;
  card.dataset.project = p.id;
  card.dataset.services = p.services;

  const deliverablesHTML = (p.deliverables || [])
    .map((d) => `<span class="deliv-item">${d}</span>`)
    .join('');

  card.innerHTML = `
    <div class="project-inner">
      <div class="project-info">
        <div class="project-tag-wrap">
          <span class="project-badge-custom">⚡ SHOWCASE POST</span>
          <span class="project-category">${p.category.toUpperCase()}</span>
        </div>

        <h3 class="project-name">${p.name.toUpperCase()}</h3>
        <p class="project-tagline">${p.tagline}</p>

        <p class="project-description">${p.description}</p>

        <div class="project-deliverables">
          ${deliverablesHTML}
        </div>

        <div class="project-actions">
          <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary magnetic-target">
            <span>VIEW LIVE WEBSITE</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2.5 11.5L11.5 2.5M11.5 2.5H4.5M11.5 2.5V9.5" stroke="currentColor" stroke-width="1.8"
                stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
          <button class="btn btn-outline preview-modal-trigger" data-target-project="${p.id}" data-url="${p.url}">
            <span>EXPAND PREVIEW</span>
          </button>
        </div>
      </div>

      <div class="project-viewport-wrapper">
        <div class="browser-window tilt-target">
          <div class="browser-chrome">
            <div class="window-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <div class="browser-address-bar">
              <span class="lock-icon">🔒</span>
              <span class="browser-url">${p.url}</span>
            </div>
            <div class="browser-actions">
              <span class="action-icon">⟳</span>
            </div>
          </div>
          <div class="browser-body">
            <img src="${p.img}" alt="${p.name} Website Preview" class="project-image" loading="lazy">
            <div class="browser-hover-overlay">
              <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="overlay-cta">
                <span>LAUNCH DEMO ↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  if (isNew) {
    container.insertBefore(card, container.firstChild);
  } else {
    container.appendChild(card);
  }

  const triggerBtn = card.querySelector('.preview-modal-trigger');
  if (triggerBtn) {
    triggerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.openModalPreview) window.openModalPreview(p.id);
    });
  }
}

function loadSavedProjects() {
  const savedProjects = JSON.parse(localStorage.getItem('nexora_custom_projects') || '[]');
  savedProjects.forEach((p) => {
    projectData[p.id] = {
      name: `${p.name} — ${p.tagline}`,
      url: p.url,
      img: p.img,
      category: p.category
    };
    renderProjectCard(p, false);
  });
  updateFilterCounts();
}

window.deleteCustomProject = function(id) {
  if (!confirm('Are you sure you want to delete this showcase post?')) return;

  let savedProjects = JSON.parse(localStorage.getItem('nexora_custom_projects') || '[]');
  savedProjects = savedProjects.filter((p) => p.id !== id);
  localStorage.setItem('nexora_custom_projects', JSON.stringify(savedProjects));

  const card = document.getElementById(`project-${id}`);
  if (card) card.remove();

  delete projectData[id];
  updateFilterCounts();
  applyFilter(currentFilter);
  showToast('🗑 Showcase post deleted successfully.');
};

window.toggleProjectVisibility = function(id) {
  let savedProjects = JSON.parse(localStorage.getItem('nexora_custom_projects') || '[]');
  const index = savedProjects.findIndex((p) => p.id === id);

  if (index !== -1) {
    savedProjects[index].hidden = !savedProjects[index].hidden;
    localStorage.setItem('nexora_custom_projects', JSON.stringify(savedProjects));

    const card = document.getElementById(`project-${id}`);
    if (card) {
      if (savedProjects[index].hidden) {
        card.classList.add('is-hidden-draft');
        showToast('🔒 Post marked as Hidden Draft (invisible to public visitors).');
      } else {
        card.classList.remove('is-hidden-draft');
        showToast('👁 Post is now Publicly Visible to all visitors!');
      }
    }
    updateFilterCounts();
    applyFilter(currentFilter);
  }
};

function createDynamicGradientPlaceholder(title, sub) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 700;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 1200, 700);
  grad.addColorStop(0, '#0f140f');
  grad.addColorStop(0.5, '#192418');
  grad.addColorStop(1, '#070707');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 700);

  ctx.strokeStyle = 'rgba(200, 255, 61, 0.12)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 1200; i += 80) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 700);
    ctx.stroke();
  }
  for (let j = 0; j < 700; j += 80) {
    ctx.beginPath();
    ctx.moveTo(0, j);
    ctx.lineTo(1200, j);
    ctx.stroke();
  }

  ctx.strokeStyle = '#C8FF3D';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(600, 350, 140, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 54px Space Grotesk, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title.toUpperCase(), 600, 340);

  ctx.fillStyle = '#C8FF3D';
  ctx.font = '500 24px Space Grotesk, sans-serif';
  ctx.fillText(sub.toUpperCase(), 600, 390);

  return canvas.toDataURL('image/jpeg', 0.85);
}

function showToast(msg) {
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = msg;
  toast.classList.add('active');

  setTimeout(() => {
    toast.classList.remove('active');
  }, 4500);
}

/* ==========================================================================
   THREE.JS 3D HERO VISUAL
   - Architectural translucent glass structure + metallic core sphere
   - Dynamic lime spotlighting and reactive mouse follow
   ========================================================================== */
function initHero3D() {
  const container = document.getElementById('hero3dContainer');
  const canvas = document.getElementById('heroCanvas');
  if (!container || !canvas) return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x070707, 0.035);

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 7.5);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const limePointLight = new THREE.PointLight(0xC8FF3D, 2.5, 20);
  limePointLight.position.set(3, 3, 4);
  scene.add(limePointLight);

  const cyanLight = new THREE.PointLight(0x3dffc8, 1.2, 18);
  cyanLight.position.set(-4, -2, 3);
  scene.add(cyanLight);

  // Group to rotate
  const heroGroup = new THREE.Group();
  scene.add(heroGroup);

  // 1. Floating Torus Knot (Architectural glass ribbon)
  const knotGeo = new THREE.TorusKnotGeometry(1.6, 0.42, 120, 24, 2, 3);
  const knotMat = new THREE.MeshPhysicalMaterial({
    color: 0x1f2720,
    metalness: 0.2,
    roughness: 0.1,
    transmission: 0.85,
    ior: 1.5,
    thickness: 1.2,
    wireframe: false,
    reflectivity: 0.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });
  const knotMesh = new THREE.Mesh(knotGeo, knotMat);
  heroGroup.add(knotMesh);

  // 2. Translucent wireframe cage accent
  const wireGeo = new THREE.IcosahedronGeometry(2.35, 1);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xC8FF3D,
    wireframe: true,
    transparent: true,
    opacity: 0.18
  });
  const wireMesh = new THREE.Mesh(wireGeo, wireMat);
  heroGroup.add(wireMesh);

  // 3. Ambient Floating Particles
  const particleCount = window.innerWidth < 768 ? 40 : 120;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 14;
    positions[i + 1] = (Math.random() - 0.5) * 10;
    positions[i + 2] = (Math.random() - 0.5) * 8;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xC8FF3D,
    size: 0.04,
    transparent: true,
    opacity: 0.55
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // Mouse interactivity with smoothing
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;

  window.addEventListener('mousemove', (e) => {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = -(e.clientY / window.innerHeight) * 2 + 1;
    targetRotationY = normX * 0.45;
    targetRotationX = -normY * 0.35;
  });

  // Responsive position offset (shifted right on desktop to frame headline)
  function adjustHeroLayout() {
    if (window.innerWidth > 1024) {
      heroGroup.position.set(1.5, 0, 0);
    } else {
      heroGroup.position.set(0, 0.4, 0);
    }
  }
  adjustHeroLayout();

  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    // Constant slow majestic rotation
    knotMesh.rotation.x += 0.005;
    knotMesh.rotation.y += 0.008;

    wireMesh.rotation.x -= 0.003;
    wireMesh.rotation.y += 0.004;

    // Inertial follow of cursor
    heroGroup.rotation.x += (targetRotationX - heroGroup.rotation.x) * 0.05;
    heroGroup.rotation.y += (targetRotationY - heroGroup.rotation.y) * 0.05;

    // Floating bobbing
    heroGroup.position.y += Math.sin(time * 1.5) * 0.0012;

    // Dynamic light orbit
    limePointLight.position.x = Math.sin(time * 0.8) * 4;
    limePointLight.position.y = Math.cos(time * 0.8) * 3;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    adjustHeroLayout();
  });
}

/* ==========================================================================
   THREE.JS ABOUT SECTION VISUAL
   ========================================================================== */
function initAbout3D() {
  const canvas = document.getElementById('aboutCanvas');
  if (!canvas) return;

  const parent = canvas.parentElement;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
  camera.position.z = 4.8;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(parent.clientWidth, parent.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Solid Inner Dodecahedron
  const innerGeo = new THREE.DodecahedronGeometry(1.2, 0);
  const innerMat = new THREE.MeshStandardMaterial({
    color: 0x141812,
    metalness: 0.8,
    roughness: 0.2
  });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  scene.add(innerMesh);

  // Outer Neon Lime Cage
  const outerGeo = new THREE.IcosahedronGeometry(1.7, 1);
  const outerMat = new THREE.MeshBasicMaterial({
    color: 0xC8FF3D,
    wireframe: true,
    transparent: true,
    opacity: 0.35
  });
  const outerMesh = new THREE.Mesh(outerGeo, outerMat);
  scene.add(outerMesh);

  const light = new THREE.DirectionalLight(0xC8FF3D, 2.5);
  light.position.set(3, 4, 3);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  function animate() {
    requestAnimationFrame(animate);
    innerMesh.rotation.x += 0.007;
    innerMesh.rotation.y += 0.01;
    outerMesh.rotation.x -= 0.005;
    outerMesh.rotation.y -= 0.008;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    renderer.setSize(parent.clientWidth, parent.clientHeight);
  });
}

/* ==========================================================================
   THREE.JS FULL-SCREEN CTA BACKGROUND
   ========================================================================== */
function initCTA3D() {
  const canvas = document.getElementById('ctaCanvas');
  if (!canvas) return;

  const parent = canvas.parentElement;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, parent.clientWidth / parent.clientHeight, 0.1, 50);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(parent.clientWidth, parent.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  // Geometric particle sphere ring
  const count = 350;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i += 3) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 3.2 + Math.random() * 0.8;
    pos[i] = r * Math.sin(phi) * Math.cos(theta);
    pos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i + 2] = r * Math.cos(phi);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xC8FF3D,
    size: 0.035,
    transparent: true,
    opacity: 0.4
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  function animate() {
    requestAnimationFrame(animate);
    points.rotation.y += 0.002;
    points.rotation.x += 0.001;
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = parent.clientWidth / parent.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(parent.clientWidth, parent.clientHeight);
  });
}

/* ==========================================================================
   SERVICE MICRO 3D CANVASES
   ========================================================================== */
function initServiceMicroCanvases() {
  const microCanvases = document.querySelectorAll('.service-micro-canvas');
  microCanvases.forEach((c) => {
    const shape = c.dataset.shape || 'torus';
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 20);
    camera.position.z = 2.8;

    const renderer = new THREE.WebGLRenderer({ canvas: c, alpha: true, antialias: true });
    renderer.setSize(52, 52);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    let geo;
    switch (shape) {
      case 'icosahedron': geo = new THREE.IcosahedronGeometry(0.9, 0); break;
      case 'octahedron': geo = new THREE.OctahedronGeometry(0.9, 0); break;
      case 'cylinder': geo = new THREE.CylinderGeometry(0.6, 0.6, 1.2, 16); break;
      case 'dodecahedron': geo = new THREE.DodecahedronGeometry(0.9, 0); break;
      case 'ring': geo = new THREE.RingGeometry(0.5, 0.9, 16); break;
      default: geo = new THREE.TorusGeometry(0.7, 0.25, 12, 24);
    }

    const mat = new THREE.MeshBasicMaterial({ color: 0xC8FF3D, wireframe: true });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    function tick() {
      requestAnimationFrame(tick);
      mesh.rotation.x += 0.02;
      mesh.rotation.y += 0.03;
      renderer.render(scene, camera);
    }
    tick();
  });
}
