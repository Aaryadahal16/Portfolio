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
  const TYPING_SPEED  = 80;
  const DELETE_SPEED  = 45;
  const PAUSE_AFTER   = 1800;
  const PAUSE_BEFORE  = 320;

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
  setTimeout(tick, 1200); // start after hero text fades in
})();

// ─── Theme Toggle ────────────────────────────────────────────
(function () {
  const btn = document.getElementById('theme-toggle');
  const icon = btn && btn.querySelector('.toggle-icon');
  const label = btn && btn.querySelector('.toggle-label');

  const saved = localStorage.getItem('theme') ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(saved);

  btn && btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    if (icon) icon.textContent = t === 'dark' ? '☀️' : '🌙';
    if (label) label.textContent = t === 'dark' ? 'Light' : 'Dark';
  }
})();

// ─── Navbar scroll + active links ───────────────────────────
(function () {
  const nav = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);

    // Active section highlight
    let current = '';
    document.querySelectorAll('section[id]').forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });

  // Mobile hamburger
  const ham = document.querySelector('.nav-hamburger');
  const menu = document.querySelector('.nav-links');
  ham && ham.addEventListener('click', () => menu.classList.toggle('open'));
  links.forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
})();


