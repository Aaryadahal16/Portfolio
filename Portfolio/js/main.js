/* ============================================================
   MAIN JS — Theme, Navbar, Typewriter
   ============================================================ */

// ─── Typewriter ──────────────────────────────────────────────
(function () {
  const el = document.getElementById('typewriter-el');
  if (!el) return;

  const phrases = [
    'SOC Analyst',
    'Threat Hunter',
    'CTF Enthusiast',
    'Malware Analyst',
    'Penetration Tester',
    'Security Researcher',
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false;
  const TYPING_SPEED = 85;
  const DELETE_SPEED = 48;
  const PAUSE_AFTER = 2000;
  const PAUSE_BEFORE = 350;

  function tick() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, PAUSE_AFTER);
        return;
      }
      setTimeout(tick, TYPING_SPEED);
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, PAUSE_BEFORE);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }
  setTimeout(tick, 1200);
})();

// ─── Theme Toggle ────────────────────────────────────────────
(function () {
  const checkbox = document.getElementById('theme-checkbox');

  const saved = localStorage.getItem('theme') || 'light';
  applyTheme(saved);

  if (checkbox) {
    checkbox.checked = (saved === 'dark');
    checkbox.addEventListener('change', (e) => {
      const next = e.target.checked ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem('theme', next);
    });
  }

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
  }
})();

// ─── Navbar scroll + active links ───────────────────────────
(function () {
  const nav = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);

    let current = '';
    document.querySelectorAll('section[id]').forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });

  const ham = document.querySelector('.nav-hamburger');
  const menu = document.querySelector('.nav-links');
  ham && ham.addEventListener('click', () => menu.classList.toggle('open'));
  links.forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
})();

// ─── Scroll Reveal Animations ─────────────────────────────────
(function () {
  window.revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      } else {
        entry.target.classList.remove('active');
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });

  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(el => window.revealObserver.observe(el));
})();
