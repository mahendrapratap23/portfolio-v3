/**
 * MAHENDRA PRATAP — PORTFOLIO V3
 * Transparent Typography & Stationary Studio Canvas Engine
 */

(function () {
  'use strict';

  // --- Projects Data ---
  const PROJECTS = [
    {
      indexStr: '№ 01 / 04',
      name: 'MEMORA',
      lang: 'Python',
      domain: 'Autonomous Agents',
      arch: 'Custom LLM Loop',
      desc: 'MEMORA is an open-source personal AI assistant and autonomous agent engineered from scratch. Features proactive task execution, custom orchestration, and contextual local memory.',
      github: 'https://github.com/mahendrapratap23/MEMORA'
    },
    {
      indexStr: '№ 02 / 04',
      name: 'droidbridge',
      lang: 'Rust',
      domain: 'Systems Engineering',
      arch: 'USB Raw Streaming',
      desc: 'Universal Android-to-macOS file transfer over USB. High-speed raw byte streaming without bulky client software or MTP driver headaches.',
      github: 'https://github.com/mahendrapratap23/droidbridge'
    },
    {
      indexStr: '№ 03 / 04',
      name: 'ghumo-ai',
      lang: 'TypeScript',
      domain: 'Full-Stack Web',
      arch: 'Next.js & Mapbox',
      desc: 'All-in-one AI travel tracker and intelligent itinerary planner with interactive maps, automated checklists, dynamic budgets, and flight timelines.',
      github: 'https://github.com/mahendrapratap23/ghumo-ai'
    },
    {
      indexStr: '№ 04 / 04',
      name: 'trackly',
      lang: 'TypeScript',
      domain: 'Data Visualization',
      arch: 'React & Recharts',
      desc: 'An intelligent personal telemetry engine that tracks habits, metrics, and workflows with rich interactive graph visuals and predictive trends.',
      github: 'https://github.com/mahendrapratap23/trackly'
    }
  ];

  let currentSectionIndex = 0;
  let currentProjectIndex = 0;
  const sections = document.querySelectorAll('.text-section');
  const sideNavBtns = document.querySelectorAll('.side-nav-btn');
  const totalSections = sections.length;

  // Project DOM Elements
  const projCounter = document.getElementById('proj-current-counter');
  const projLang = document.getElementById('proj-lang');
  const projDomain = document.getElementById('proj-domain');
  const projArch = document.getElementById('proj-arch');
  const projTitle = document.getElementById('proj-title');
  const projDesc = document.getElementById('proj-desc');
  const projRepoLink = document.getElementById('proj-repo-link');
  const pillBtns = document.querySelectorAll('.pill-btn');
  const btnPrevProj = document.getElementById('btn-prev-proj');
  const btnNextProj = document.getElementById('btn-next-proj');
  const toastEl = document.getElementById('pure-toast');

  let isTransitioning = false;
  const TRANSITION_COOLDOWN = 550; // ms

  /**
   * Switch Active Section (Only pure text transitions)
   */
  function goToSection(index) {
    if (index < 0 || index >= totalSections) return;
    if (index === currentSectionIndex && !isTransitioning) return;

    currentSectionIndex = index;

    // Update section classes
    sections.forEach((sec, idx) => {
      sec.classList.toggle('active', idx === currentSectionIndex);
    });

    // Update Side Nav Buttons
    sideNavBtns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === currentSectionIndex);
    });

    // Set cooldown
    isTransitioning = true;
    setTimeout(() => {
      isTransitioning = false;
    }, TRANSITION_COOLDOWN);
  }

  /**
   * Next / Prev Section
   */
  function nextSection() {
    if (currentSectionIndex < totalSections - 1) {
      goToSection(currentSectionIndex + 1);
    }
  }

  function prevSection() {
    if (currentSectionIndex > 0) {
      goToSection(currentSectionIndex - 1);
    }
  }

  /**
   * Update Project Display
   */
  function setProject(index) {
    if (index < 0) index = PROJECTS.length - 1;
    if (index >= PROJECTS.length) index = 0;
    currentProjectIndex = index;

    const p = PROJECTS[currentProjectIndex];

    if (projCounter) projCounter.textContent = p.indexStr;
    if (projLang) projLang.textContent = p.lang;
    if (projDomain) projDomain.textContent = p.domain;
    if (projArch) projArch.textContent = p.arch;
    if (projTitle) projTitle.textContent = p.name;
    if (projDesc) projDesc.textContent = p.desc;
    if (projRepoLink) {
      projRepoLink.href = p.github;
      projRepoLink.setAttribute('aria-label', `View ${p.name} on GitHub`);
    }

    pillBtns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === currentProjectIndex);
    });
  }

  /**
   * Toast helper
   */
  let toastTimer = null;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2200);
  }

  /**
   * Scroll listener: Wheel / Trackpad
   * When someone scrolls, the background picture stays fixed in place,
   * only the text smoothly transitions to the next/prev section.
   */
  window.addEventListener('wheel', (e) => {
    // Prevent browser default scroll behavior
    e.preventDefault();

    if (isTransitioning) return;

    // Threshold to prevent micro-jitters
    if (Math.abs(e.deltaY) < 20) return;

    if (e.deltaY > 0) {
      nextSection();
    } else {
      prevSection();
    }
  }, { passive: false });

  /**
   * Touch Swipe Listener (Mobile / Touch devices)
   */
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (isTransitioning) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diffY = touchStartY - touchEndY;

    // If swipe distance > 40px
    if (Math.abs(diffY) > 40) {
      if (diffY > 0) {
        nextSection(); // swiped up -> go down/next
      } else {
        prevSection(); // swiped down -> go up/prev
      }
    }
  }, { passive: true });

  /**
   * Keyboard Navigation
   */
  window.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
      e.preventDefault();
      nextSection();
    } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      prevSection();
    } else if (e.key >= '1' && e.key <= '5') {
      const targetIdx = parseInt(e.key, 10) - 1;
      goToSection(targetIdx);
    } else if (currentSectionIndex === 1) {
      // In projects section, left/right arrows switch projects
      if (e.key === 'ArrowRight') {
        setProject(currentProjectIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        setProject(currentProjectIndex - 1);
      }
    }
  });

  /**
   * Side Nav Button Clicks
   */
  sideNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      goToSection(idx);
    });
  });

  /**
   * In-Text Action Triggers (data-goto)
   */
  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-goto'), 10);
      goToSection(idx);
    });
  });

  /**
   * Project Pill Clicks & Stepper
   */
  pillBtns.forEach(pill => {
    pill.addEventListener('click', () => {
      const idx = parseInt(pill.getAttribute('data-pindex'), 10);
      setProject(idx);
    });
  });

  if (btnPrevProj) {
    btnPrevProj.addEventListener('click', () => setProject(currentProjectIndex - 1));
  }
  if (btnNextProj) {
    btnNextProj.addEventListener('click', () => setProject(currentProjectIndex + 1));
  }

  /**
   * Copy Email Buttons
   */
  document.querySelectorAll('.copy-email-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'mp498343@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Email copied: ${email}`);
      }).catch(() => {
        showToast(`Email: ${email}`);
      });
    });
  });

  // Init
  setProject(0);
  goToSection(0);

})();
