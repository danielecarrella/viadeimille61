/* =========================================================
   Via dei Mille 61 — interazioni
   ========================================================= */
(function () {
  // email dell'agenzia (usata dai form)
  const AGENCY_EMAIL = 'viadeimille61@gmail.com';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = typeof window.gsap !== 'undefined';

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Scroll fluido (Lenis) ---------- */
  let lenis = null;
  if (!reduceMotion && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    if (hasGsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  function scrollToEl(el) {
    if (lenis) lenis.scrollTo(el, { offset: -70 });
    else el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  // ancore interne
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      closeMenu();
      scrollToEl(el);
    });
  });

  /* ---------- Navbar ---------- */
  const nav = document.getElementById('nav');
  let lastY = 0;
  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > 400 && y > lastY && !document.body.classList.contains('menu-open'));
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const burger = document.getElementById('burger');
  function closeMenu() {
    document.body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    if (lenis) lenis.start();
  }
  burger.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', String(open));
    if (lenis) open ? lenis.stop() : lenis.start();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Tab Privati / Imprese ---------- */
  const tabs = [...document.querySelectorAll('.tabs [role=tab]')];
  const pill = document.querySelector('.tabs__pill');
  function movePill(btn) {
    pill.style.width = btn.offsetWidth + 'px';
    pill.style.transform = `translateX(${btn.offsetLeft - 5}px)`;
  }
  function selectTab(btn) {
    tabs.forEach((b) => {
      const on = b === btn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(b.getAttribute('aria-controls'));
      panel.hidden = !on;
      if (on && hasGsap && !reduceMotion) {
        gsap.fromTo(panel.children,
          { opacity: 0, y: 24, rotateX: -8, transformPerspective: 1000 },
          { opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: 'expo.out', stagger: 0.05 });
      }
    });
    movePill(btn);
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  tabs.forEach((btn, i) => {
    btn.addEventListener('click', () => selectTab(btn));
    btn.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      next.focus();
      selectTab(next);
    });
  });
  movePill(tabs[0]);
  window.addEventListener('resize', () => movePill(tabs.find((b) => b.classList.contains('is-active'))));
  document.fonts && document.fonts.ready.then(() => movePill(tabs.find((b) => b.classList.contains('is-active'))));

  /* ---------- Pannello hero: Privati / Imprese ---------- */
  const quickTabs = [...document.querySelectorAll('[data-quick]')];
  quickTabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      quickTabs.forEach((b) => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
        const grid = document.getElementById(b.dataset.quick);
        grid.hidden = !on;
        if (on && hasGsap && !reduceMotion) {
          gsap.fromTo(grid.children, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out', stagger: 0.03 });
        }
      });
    });
  });

  /* ---------- Card soluzioni e scorciatoie hero -> form precompilato ---------- */
  const areaSelect = document.getElementById('area');
  document.querySelectorAll('button[data-area]').forEach((card) => {
    card.addEventListener('click', () => {
      areaSelect.value = card.dataset.area;
      scrollToEl(document.getElementById('contatti'));
      areaSelect.classList.remove('is-flash');
      void areaSelect.offsetWidth;
      areaSelect.classList.add('is-flash');
    });
  });

  /* ---------- Animazioni d'ingresso ---------- */
  function start() {
    if (document.body.classList.contains('is-loaded')) return;
    document.body.classList.add('is-loaded');
    if (!hasGsap || reduceMotion) {
      document.querySelectorAll('.reveal, .reveal-hero').forEach((el) => { el.style.opacity = 1; });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // hero
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 });
    tl.fromTo('.hero__title .reveal-hero', { opacity: 1, yPercent: 105 }, { yPercent: 0, duration: 1.3, stagger: 0.1 })
      .fromTo(['.hero__lead', '.hero__actions', '.hero .quick', '.hero__stats'], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.1 }, '-=0.95');

    // il testo della hero sfuma verso l'alto allo scroll
    gsap.to('.hero__content', {
      yPercent: -15, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });

    // comparsa morbida dei contenuti
    ScrollTrigger.batch('.reveal', {
      start: 'top 90%',
      once: true,
      onEnter: (els) => gsap.fromTo(els,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.07, overwrite: 'auto' }),
    });

    // step sinistri: ingresso in prospettiva
    gsap.fromTo('.claims__steps .step', { rotateX: 14, transformPerspective: 1000, transformOrigin: '50% 100%' }, {
      rotateX: 0, ease: 'none', stagger: 0.08,
      scrollTrigger: { trigger: '.claims__steps', start: 'top bottom', end: 'top 60%', scrub: true },
    });
  }

  // parte appena i font sono pronti (al massimo dopo 900 ms)
  Promise.race([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((r) => setTimeout(r, 900)),
  ]).then(() => requestAnimationFrame(start));
  setTimeout(start, 2500); // sicurezza

  /* ---------- Tilt 3D leggero sulle card ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.tilt').forEach((el) => {
      let raf = null;
      const k = parseFloat(el.dataset.tilt || '1'); // intensità (il pannello hero è più leggero)
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.transition = 'transform .2s ease-out';
          el.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * 6 * k}deg) rotateY(${(px - 0.5) * 7 * k}deg)`;
          el.style.setProperty('--mx', px * 100 + '%');
          el.style.setProperty('--my', py * 100 + '%');
        });
      });
      el.addEventListener('pointerleave', () => {
        cancelAnimationFrame(raf);
        el.style.transition = 'transform .8s cubic-bezier(.22,1,.36,1)';
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
      });
    });
  }

  /* ---------- Lavora con noi: i bottoni scelgono il percorso nel form ---------- */
  const jobsForm = document.getElementById('jobs-form');
  const jobsRole = document.getElementById('jobs-role');
  document.querySelectorAll('[data-role]').forEach((btn) => {
    btn.addEventListener('click', () => {
      jobsRole.value = btn.dataset.role;
      scrollToEl(jobsForm);
      jobsRole.classList.remove('is-flash');
      void jobsRole.offsetWidth;
      jobsRole.classList.add('is-flash');
    });
  });
  jobsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(jobsForm);
    const subject = `Candidatura dal sito – ${d.get('ruolo')}`;
    const body =
      `Mi propongo come: ${d.get('ruolo')}\nNome: ${d.get('nome')}\nTelefono: ${d.get('telefono') || '-'}\nEmail: ${d.get('email')}\n\n` +
      `${d.get('messaggio') || ''}\n\n(Allego il mio curriculum)`;
    window.location.href = `mailto:${AGENCY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  /* ---------- Form contatti (apre il client email) ---------- */
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const subject = `Richiesta dal sito – ${d.get('area')}`;
    const body =
      `Nome: ${d.get('nome')}\nTelefono: ${d.get('telefono') || '-'}\nEmail: ${d.get('email')}\n` +
      `Interesse: ${d.get('area')}\n\n${d.get('messaggio') || ''}`;
    window.location.href = `mailto:${AGENCY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
