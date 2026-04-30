/* ============================================================
   PROJECTS JS — Pinned first, GitHub fills the rest (no dupes)
   ============================================================ */

(function () {
  const GITHUB_USER = 'Aaryadahal16';
  const GITHUB_URL = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`;

  const MAX_CARDS = 8;  // 2 rows × 4 columns
  const PINNED_COUNT = 3;

  const CARD_IMAGES = [
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80',
    'https://plus.unsplash.com/premium_vector-1682309080127-19d3a6214a17?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=600&q=80',
    'https://plus.unsplash.com/premium_vector-1734615271258-83ca0b4cca39?q=80&w=725&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_vector-1734608029824-0dc756e0d64d?q=80&w=725&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80'
  ];

  /* ── Custom card visuals (inline SVG) ──────────────────────
     Add a `cardSvg` to any PINNED_PROJECT to override the icon.
     For GitHub repos the LANG_SVG map is used as fallback.
  ─────────────────────────────────────────────────────────── */

  const PINNED_PROJECTS = [
    {
      name: 'Web_Security_Testing_Lab',
      description: 'Created a practice Hands-on web security lab covering XSS, IDOR etc. Is a work in progress',
      language: 'JavaScript',
      updated_at: new Date().toISOString(),
      html_url: `https://github.com/${GITHUB_USER}/Web_Security_Testing_Lab`,
      cardSvg: `
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8" y="14" width="48" height="34" rx="3" stroke="currentColor" stroke-width="2.2"/>
          <path d="M8 20h48" stroke="currentColor" stroke-width="2"/>
          <circle cx="14" cy="17" r="1.5" fill="currentColor"/>
          <circle cx="20" cy="17" r="1.5" fill="currentColor"/>
          <circle cx="26" cy="17" r="1.5" fill="currentColor"/>
          <path d="M22 32l-6 4 6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M42 32l6 4-6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M35 28l-6 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M20 52h24M32 48v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>`,
    },
    {
      name: 'VAPT-reports',
      description: 'Vulnerability Assessment and Penetration Testing reports — scope, findings, severity ratings, and actionable remediation steps.',
      language: 'VAPT',
      updated_at: new Date().toISOString(),
      html_url: `https://github.com/${GITHUB_USER}/VAPT-reports`,
      cardSvg: `
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="12" y="8" width="40" height="48" rx="3" stroke="currentColor" stroke-width="2.2"/>
          <path d="M20 20h24M20 27h24M20 34h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <circle cx="44" cy="44" r="10" fill="var(--bg-alt)" stroke="currentColor" stroke-width="2"/>
          <path d="M40 44l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
    },
    {
      name: 'Network-Design',
      description: 'Enterprise network architecture with security-in-depth, segmented VLANs, firewalls and topology diagrams.',
      language: 'Packet Tracer',
      updated_at: new Date().toISOString(),
      html_url: `https://github.com/${GITHUB_USER}/Network-Design`,
      cardSvg: `
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="14" r="6" stroke="currentColor" stroke-width="2"/>
          <circle cx="12" cy="46" r="6" stroke="currentColor" stroke-width="2"/>
          <circle cx="52" cy="46" r="6" stroke="currentColor" stroke-width="2"/>
          <circle cx="32" cy="46" r="6" stroke="currentColor" stroke-width="2"/>
          <path d="M32 20v6M32 26l-14 14M32 26l14 14M32 26v14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>`,
    },
  ];

  /* Exact repo names to exclude from GitHub results (case-insensitive) */
  const PINNED_NAMES = new Set(PINNED_PROJECTS.map(p => p.name.toLowerCase()));
  const EXCLUDED_NAMES = new Set(['portfolio']);

  /* Fallback language SVGs for GitHub cards */
  const LANG_SVG = {
    Python: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32 10c-8 0-13 3-13 8v6h13v2H16c-5 0-9 3-9 10s4 10 9 10h4v-7c0-5 4-8 9-8h14c4 0 7-3 7-7V18c0-5-5-8-12-8h-6zm-2 5a2 2 0 110 4 2 2 0 010-4z" fill="currentColor" opacity=".7"/><path d="M48 26h-4v7c0 5-4 8-9 8H21c-4 0-7 3-7 7v8c0 5 5 8 12 8h6c8 0 13-3 13-8v-6H32v-2h16c5 0 9-3 9-10s-4-10-9-10zm-14 28a2 2 0 110-4 2 2 0 010 4z" fill="currentColor" opacity=".4"/></svg>`,
    JavaScript: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="48" height="48" rx="4" fill="currentColor" opacity=".15"/><path d="M22 44c0 4-2 6-5 6l-1-3c2 0 3-1 3-3V28h3v16zm10-1c1 2 2 3 4 3s3-1 3-2c0-2-1-2-4-4-3-1-5-3-5-6 0-4 3-6 7-6 3 0 5 1 6 4l-3 2c-1-2-2-3-3-3-2 0-3 1-3 2s1 2 4 3c3 2 5 3 5 6 0 4-3 7-7 7-4 0-6-2-7-5l3-1z" fill="currentColor"/></svg>`,
    TypeScript: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="48" height="48" rx="4" fill="currentColor" opacity=".15"/><path d="M14 31h14v3h-5v17h-4V34h-5v-3zm22 0h4l5 8 5-8h4l-7 10 8 10h-4l-6-8-6 8h-4l8-10-7-10z" fill="currentColor"/></svg>`,
    Shell: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="12" width="48" height="40" rx="4" stroke="currentColor" stroke-width="2.2"/><path d="M8 22h48" stroke="currentColor" stroke-width="2"/><path d="M18 32l6 4-6 4M28 40h10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    HTML: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 8l4 44 16 4 16-4 4-44H12z" stroke="currentColor" stroke-width="2"/><path d="M22 28h20l-2 14-8 2-8-2-1-8h4l.5 5 4.5 1 4.5-1 .5-7H21l-1-10h22l-.5 5H22l-.5-4 .5 4z" fill="currentColor" opacity=".7"/></svg>`,
    default: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="8" width="40" height="48" rx="3" stroke="currentColor" stroke-width="2.2"/><path d="M20 22h24M20 30h24M20 38h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  };

  function cardVisual(repo) {
    return repo.cardSvg || LANG_SVG[repo.language] || LANG_SVG.default;
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function formatRepoName(name) {
    return name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  function createCard(repo, index) {
    const card = document.createElement('div');
    card.className = 'project-card reveal';
    card.innerHTML = `
      <div class="project-card-img" style="background-image: url('${CARD_IMAGES[index % CARD_IMAGES.length]}'); background-size: cover; background-position: center; height: 140px; width: 100%; border-top-left-radius: 6px; border-top-right-radius: 6px; position: relative;">
        <div class="project-card-visual" style="position: absolute; bottom: -20px; right: 15px; width: 40px; height: 40px; background: var(--bg-alt); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow);">
          <span class="proj-icon" style="width: 24px; height: 24px;">${cardVisual(repo)}</span>
        </div>
      </div>
      <div class="project-card-body">
        <div class="project-card-title">${formatRepoName(repo.name)}</div>
        <div class="project-card-lang">${repo.language || 'Code'}</div>
      </div>
    `;
    card.addEventListener('click', () => openModal(repo));
    if (window.revealObserver) window.revealObserver.observe(card);
    return card;
  }

  function openModal(repo) {
    const overlay = document.getElementById('project-modal');
    const body = document.getElementById('modal-body');
    if (!overlay || !body) return;

    body.innerHTML = `
      <span class="modal-lang-tag">${repo.language || 'Project'}</span>
      <h2 class="modal-title">${formatRepoName(repo.name)}</h2>
      <p class="modal-desc">${repo.description || 'No description provided. Visit the repository for more details.'}</p>
      <p class="modal-meta">Last updated: ${formatDate(repo.updated_at)}</p>
      <div class="modal-actions">
        <a href="${repo.html_url}" target="_blank" rel="noopener" class="btn btn-primary">View on GitHub ↗</a>
      </div>
    `;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  async function fetchRepos() {
    const grid = document.getElementById('projects-grid');
    const loading = document.getElementById('projects-loading');
    if (!grid) return;

    // Render pinned cards first — always
    PINNED_PROJECTS.forEach((repo, i) => grid.appendChild(createCard(repo, i)));

    const remaining = MAX_CARDS - PINNED_COUNT; // 5

    try {
      const res = await fetch(GITHUB_URL);
      if (!res.ok) throw new Error('GitHub API error');
      const repos = await res.json();

      const filtered = repos
        .filter(r => !r.fork && !PINNED_NAMES.has(r.name.toLowerCase()) && !EXCLUDED_NAMES.has(r.name.toLowerCase()))
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, remaining);

      if (loading) loading.remove();
      filtered.forEach((repo, i) => grid.appendChild(createCard(repo, PINNED_COUNT + i)));

    } catch (_) {
      if (loading) loading.remove();
      // Fallback placeholders for the remaining 5 slots
      [
        { name: 'Threat-Intelligence-Dashboard', description: 'Real-time threat intel aggregator pulling from AbuseIPDB, ThreatFox and AlienVault OTX.', language: 'Python', updated_at: '2024-11-01', html_url: `https://github.com/${GITHUB_USER}` },
        { name: 'Network-Anomaly-Detector', description: 'ML-powered network traffic analyzer for detecting anomalies and intrusion attempts.', language: 'Python', updated_at: '2024-10-15', html_url: `https://github.com/${GITHUB_USER}` },
        { name: 'OSINT-Recon-Tool', description: 'Automated open-source intelligence gathering and reconnaissance framework.', language: 'Python', updated_at: '2024-09-20', html_url: `https://github.com/${GITHUB_USER}` },
        { name: 'Log-Parser-Toolkit', description: 'Modular log parsing toolkit for SIEM ingestion and alert correlation.', language: 'Python', updated_at: '2024-08-10', html_url: `https://github.com/${GITHUB_USER}` },
        { name: 'CTF-Writeups', description: 'CTF challenge writeups from HackTheBox, TryHackMe, and national competitions.', language: 'Shell', updated_at: '2024-07-01', html_url: `https://github.com/${GITHUB_USER}` },
      ].slice(0, remaining).forEach((p, i) => grid.appendChild(createCard(p, PINNED_COUNT + i)));
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close-btn');

    const closeModal = () => {
      overlay && overlay.classList.remove('open');
      document.body.style.overflow = '';
    };

    closeBtn && closeBtn.addEventListener('click', closeModal);
    overlay && overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    fetchRepos();
  });

})();
