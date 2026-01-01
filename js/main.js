// Simple, accessible carousel
document.addEventListener('DOMContentLoaded', () => {
  // Year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Navigation: mobile toggle, smooth scroll, active link highlighting, and scrolled background
  const nav = document.querySelector('.site-nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = Array.from(document.querySelectorAll('.nav-menu a'));

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('open');
    });
  }

  // smooth scrolling for internal links
  navLinks.forEach(l => {
    l.addEventListener('click', (e) => {
      const href = l.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({behavior:'smooth', block:'start'});
        // close mobile menu
        if (navMenu && navMenu.classList.contains('open')) navMenu.classList.remove('open');
        if (navToggle) navToggle.setAttribute('aria-expanded','false');
      }
    });
  });

  // active link highlighting using IntersectionObserver
  const sectionIds = navLinks.map(a => a.getAttribute('href')).filter(Boolean).filter(h => h.startsWith('#'));
  const sections = sectionIds.map(id => document.querySelector(id)).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const navIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = '#' + entry.target.id;
        const link = document.querySelector(`.nav-menu a[href="${id}"]`);
        if (link) link.classList.toggle('active', entry.isIntersecting);
      });
    }, {threshold: 0.5});
    sections.forEach(s => navIO.observe(s));
  }

  // change nav bg on scroll
  window.addEventListener('scroll', () => {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
  });

  const carousel = document.querySelector('.carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const prevBtn = carousel.querySelector('.carousel-btn.prev');
  const nextBtn = carousel.querySelector('.carousel-btn.next');
  const indicators = carousel.querySelector('.carousel-indicators');

  let current = 0;
  let timer = null;
  const interval = 4000; // autoplay

  // Build indicators
  slides.forEach((s, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', `Show slide ${i + 1}`);
    btn.dataset.index = i;
    if (i === 0) btn.setAttribute('aria-current', 'true');
    indicators.appendChild(btn);

    btn.addEventListener('click', () => goTo(i));
  });

  const live = carousel.querySelector('.carousel-live');

  function update() {
    track.style.transform = `translateX(-${current * 100}%)`;
    // update indicators
    Array.from(indicators.children).forEach((b, i) => {
      if (i === current) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    // announce slide change for screen readers
    if (live) live.textContent = `Slide ${current + 1} of ${slides.length}`;
  }

  function goTo(i) {
    current = (i + slides.length) % slides.length;
    update();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Keyboard support
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });
  carousel.tabIndex = 0; // make focusable

  // Autoplay
  function start() {
    stop();
    timer = setInterval(() => goTo(current + 1), interval);
  }
  function stop() { if (timer) clearInterval(timer); }

  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);

  // Contact form handling
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();
      if (!name || !email || !message) {
        // simple validation feedback
        alert('Please fill in all required fields.');
        return;
      }
      // Simulate send
      form.reset();
      if (success) {
        success.classList.remove('sr-only');
        success.textContent = 'Message sent. Thank you!';
        setTimeout(() => {
          success.classList.add('sr-only');
        }, 5000);
      } else {
        alert('Message sent. Thank you!');
      }
    });
  }

  // Reveal on scroll (subtle animations)
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${i * 60}ms`;
      io.observe(el);
    });
  } else {
    reveals.forEach(el => el.classList.add('reveal-active'));
  }

  // Start autoplay
  start();
});