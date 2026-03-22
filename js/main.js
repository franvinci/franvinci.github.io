(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth <= 900;

  // ========================================
  // LENIS SMOOTH SCROLL
  // ========================================
  let lenis;
  if (!reducedMotion && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // ========================================
  // CUSTOM CURSOR
  // ========================================
  const cursorDot = document.querySelector('.cursor-dot');
  if (cursorDot && !isMobile) {
    let cx = -100, cy = -100;

    document.addEventListener('mousemove', e => {
      cx = e.clientX;
      cy = e.clientY;
      cursorDot.style.left = cx + 'px';
      cursorDot.style.top = cy + 'px';
      if (!cursorDot.classList.contains('visible')) cursorDot.classList.add('visible');
    });

    document.addEventListener('mouseleave', () => cursorDot.classList.remove('visible'));

    // Hover detection
    const hoverables = 'a, button, .btn, .area-card, .pub-card, .software-card, .social-link, .cv-tab, .nav-toggle button, .tl-item';
    document.querySelectorAll(hoverables).forEach(el => {
      el.addEventListener('mouseenter', () => cursorDot.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursorDot.classList.remove('hovering'));
    });
  }

  // ========================================
  // HERO INTERACTIVE BLOB
  // ========================================
  const heroBlob = document.querySelector('.hero-blob');
  if (heroBlob && !isMobile && !reducedMotion) {
    let bx = 0, by = 0, tx = 0, ty = 0;

    document.addEventListener('mousemove', e => {
      tx = e.clientX;
      ty = e.clientY;
    });

    function animateBlob() {
      bx += (tx - bx) * 0.04;
      by += (ty - by) * 0.04;
      heroBlob.style.transform = `translate(${bx - 200}px, ${by - 200}px)`;
      requestAnimationFrame(animateBlob);
    }
    animateBlob();
  }

  // ========================================
  // NAVBAR
  // ========================================
  const navbar = document.querySelector('.navbar');

  function onScroll() {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    const btt = document.querySelector('.back-to-top');
    if (btt) btt.classList.toggle('visible', window.scrollY > 500);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ========================================
  // MOBILE MENU (declared early for toggle access)
  // ========================================
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  // ========================================
  // NAVBAR TOGGLE SWITCH (DevPunks signature)
  // ========================================
  const toggleBtns = document.querySelectorAll('.nav-toggle button');
  const toggleBgs = document.querySelectorAll('.nav-toggle-bg');
  const heroH1 = document.querySelector('.hero-text h1');
  const heroDesc = document.querySelector('.hero-desc');

  const heroBadges = document.querySelector('.hero-badges');

  const heroStates = {
    researcher: {
      h1: 'Data & Process Science <mark>Researcher</mark>',
      desc: 'I bridge <b>process mining</b>, <b>machine learning</b>, and <b>explainable AI</b> to enable transparent what-if and prescriptive analytics, with applications in healthcare and industry.',
      badges: [
        { text: 'Process Mining', accent: true },
        { text: 'Explainable AI' },
        { text: 'Data-Driven Simulation' },
        { text: 'Machine Learning' }
      ]
    },
    developer: {
      h1: 'Data & AI <mark>Developer</mark>',
      desc: 'I design and build <b>full-stack applications</b> and <b>ML pipelines</b> that turn research into production-ready tools, from <b>backend APIs</b> and <b>databases</b> to interactive <b>frontend</b> interfaces.',
      badges: [
        { text: 'Full Stack', accent: true },
        { text: 'Python' },
        { text: 'Neural Networks' },
        { text: 'MLOps' }
      ]
    }
  };

  function updateToggle(mode) {
    toggleBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });

    // Move background pill(s)
    toggleBgs.forEach(bg => {
      const parent = bg.parentElement;
      const activeBtn = parent.querySelector(`button[data-mode="${mode}"]`);
      if (activeBtn) {
        const parentRect = parent.getBoundingClientRect();
        const btnRect = activeBtn.getBoundingClientRect();
        bg.style.width = btnRect.width + 'px';
        bg.style.transform = `translateX(${btnRect.left - parentRect.left - 4}px)`;
      }
    });

    // Set body data-mode for CSS theme
    if (mode === 'developer') {
      document.body.setAttribute('data-mode', 'developer');
    } else {
      document.body.removeAttribute('data-mode');
    }

    // Update hero content
    const state = heroStates[mode];
    if (state && heroH1) heroH1.innerHTML = state.h1;
    if (state && heroDesc) heroDesc.innerHTML = state.desc;

    // Update badges
    if (state && heroBadges) {
      heroBadges.innerHTML = state.badges.map(b =>
        `<span class="badge${b.accent ? ' badge-carmine' : ''}">${b.text}</span>`
      ).join('');
    }

    // Reset CV tabs: activate first tab of the current mode
    const prefix = mode === 'developer' ? 'cv-d-' : 'cv-r-';
    const modeTabs = document.querySelectorAll(`.mode-${mode} .cv-tab`);
    const modePanels = document.querySelectorAll(`.cv-panel.mode-${mode}`);
    modeTabs.forEach((t, i) => t.classList.toggle('active', i === 0));
    modePanels.forEach((p, i) => p.classList.toggle('active', i === 0));

    // Update CV download link
    const cvLink = document.querySelector('.cv-download-link');
    if (cvLink) {
      cvLink.href = mode === 'developer' ? 'files/CV_industry.pdf' : 'files/CV.pdf';
    }

    // Update hero CTA button (Publications ↔ Software)
    const heroCta = document.querySelector('.hero-cta-main');
    const ctaLabel = document.querySelector('.hero-cta-label');
    const ctaIconPub = document.querySelector('.hero-cta-icon-pub');
    const ctaIconSw = document.querySelector('.hero-cta-icon-sw');
    if (heroCta && ctaLabel) {
      if (mode === 'developer') {
        heroCta.href = '#software-tools';
        ctaLabel.textContent = 'Software';
        if (ctaIconPub) ctaIconPub.style.display = 'none';
        if (ctaIconSw) ctaIconSw.style.display = '';
      } else {
        heroCta.href = '#publications';
        ctaLabel.textContent = 'Publications';
        if (ctaIconPub) ctaIconPub.style.display = '';
        if (ctaIconSw) ctaIconSw.style.display = 'none';
      }
    }

    // Swap hero photo with fade
    const heroImg = document.querySelector('.hero-photo img');
    if (heroImg) {
      heroImg.style.opacity = '0';
      setTimeout(() => {
        heroImg.src = mode === 'developer' ? 'img/frav_dev.png' : 'img/frav.png';
        heroImg.onload = () => { heroImg.style.opacity = '1'; };
      }, 120);
    }
  }

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      updateToggle(btn.dataset.mode);
      // Close mobile menu if open
      if (hamburger && mobileMenu && mobileMenu.classList.contains('open')) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Initialize toggle position after fonts load
  window.addEventListener('load', () => {
    const activeMode = document.querySelector('.nav-toggle button.active');
    if (activeMode) updateToggle(activeMode.dataset.mode);
  });

  // ========================================
  // MOBILE MENU (event listeners)
  // ========================================
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ========================================
  // SMOOTH SCROLL (links)
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.offsetTop - 80;
        if (lenis) {
          lenis.scrollTo(top);
        } else {
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  // ========================================
  // ACTIVE NAV
  // ========================================
  const sections = document.querySelectorAll('section[id], .hero[id], .timeline-wrap[id]');
  const navItems = document.querySelectorAll('.nav-links a[href^="#"]:not(.nav-cta)');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach(item => {
          item.classList.toggle('active', item.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.15, rootMargin: '-72px 0px -50% 0px' });

  sections.forEach(s => sectionObserver.observe(s));

  // ========================================
  // SCROLL REVEAL
  // ========================================
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');

  if (!reducedMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  // ========================================
  // TEXT SCRAMBLE on section titles
  // ========================================
  if (!reducedMotion) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const scrambleEls = document.querySelectorAll('[data-scramble]');

    const scrambleObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          scrambleText(entry.target);
          scrambleObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    scrambleEls.forEach(el => scrambleObserver.observe(el));

    function scrambleText(el) {
      const original = el.dataset.scramble;
      const duration = 600;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        let result = '';
        for (let i = 0; i < original.length; i++) {
          if (original[i] === ' ') {
            result += ' ';
          } else if (i < original.length * progress) {
            result += original[i];
          } else {
            result += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        el.textContent = result;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
  }

  // ========================================
  // 3D TILT CARDS
  // ========================================
  if (!isMobile && !reducedMotion) {
    document.querySelectorAll('.area-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -6;
        const rotateY = (x - centerX) / centerX * 6;
        card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(600px) rotateX(0) rotateY(0)';
        card.style.transition = 'transform 0.5s ease';
        setTimeout(() => card.style.transition = '', 500);
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
      });
    });
  }

  // ========================================
  // MAGNETIC BUTTONS
  // ========================================
  if (!isMobile && !reducedMotion) {
    document.querySelectorAll('.btn, .nav-cta').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(() => btn.style.transition = '', 400);
      });

      btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'transform 0.1s ease';
      });
    });
  }

  // ========================================
  // CV TABS
  // ========================================
  document.querySelectorAll('.cv-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      // Only toggle tabs within the same .cv-tabs group
      const group = tab.closest('.cv-tabs');
      if (group) {
        group.querySelectorAll('.cv-tab').forEach(t => t.classList.toggle('active', t === tab));
      }
      // Only toggle panels that share the same mode class
      const modeClass = group && group.classList.contains('mode-developer') ? 'mode-developer' : 'mode-researcher';
      document.querySelectorAll(`.cv-panel.${modeClass}`).forEach(p => p.classList.toggle('active', p.id === target));
    });
  });

  // ========================================
  // PUBLICATION YEAR COLLAPSE/EXPAND
  // ========================================
  document.querySelectorAll('.pub-year-label').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.pub-year-group').classList.toggle('open');
    });
  });

  // ========================================
  // TYPED EFFECT
  // ========================================
  const typedEl = document.querySelector('.typed-text');
  if (typedEl) {
    const roles = ['Data Scientist', 'AI Researcher', 'Computer Scientist', 'Process Miner', 'Mathematician'];
    let roleIdx = 0, charIdx = 0, isDeleting = false;

    function typeStep() {
      const current = roles[roleIdx];
      if (!isDeleting) {
        typedEl.textContent = current.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) { isDeleting = true; setTimeout(typeStep, 1800); return; }
        setTimeout(typeStep, 80);
      } else {
        typedEl.textContent = current.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) { isDeleting = false; roleIdx = (roleIdx + 1) % roles.length; setTimeout(typeStep, 300); return; }
        setTimeout(typeStep, 40);
      }
    }
    setTimeout(typeStep, 600);
  }

  // ========================================
  // BACK TO TOP
  // ========================================
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', e => {
      e.preventDefault();
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
