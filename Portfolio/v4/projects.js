/* ============================================================
   PROJECTS JS — Pinned projects first, then GitHub repos
   ============================================================ */

(function () {
  const GITHUB_USER = 'Aaryadahal16';
  const GITHUB_URL = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`;

  const MAX_CARDS = 8;        // 2 rows × 4 columns
  const PINNED_COUNT = 3;     // always the first 3 slots

  // ── Pinned projects (always shown first) ──────────────────
  const PINNED_PROJECTS = [
    {
      name: 'Web-Security-Labs',
      description: 'Hands-on web security lab environment covering OWASP Top 10 vulnerabilities — XSS, SQLi, IDOR, CSRF and more — with detailed exploitation and mitigation walkthroughs.',
      language: 'Python',
      updated_at: new Date().toISOString(),
      html_url: `https://github.com/${GITHUB_USER}/Web_Security_Testing_Lab`,
      pinned: true,
    },
    {
      name: 'VAPT-Reports',
      description: 'Professional Vulnerability Assessment and Penetration Testing reports for real-world engagements — including scope, findings, severity ratings, and actionable remediation steps.',
      language: 'HTML',
      updated_at: new Date().toISOString(),
      html_url: `https://github.com/${GITHUB_USER}/VAPT-reports`,
      pinned: true,
    },
    {
      name: 'Network-Design',
      description: 'Enterprise network architecture designs with security-in-depth — segmented VLANs, firewall policies, IDS/IPS placement, and detailed topology diagrams for secure deployments.',
      language: 'Shell',
      updated_at: new Date().toISOString(),
      html_url: `https://github.com/${GITHUB_USER}/Network-Design`,
      pinned: true,
    },
  ];

  const LANG_ICONS = {
    Python: '🐍', JavaScript: '🟨', TypeScript: '🔷', HTML: '🌐',
    CSS: '🎨', Shell: '💻', Go: '🔵', Rust: '🦀', Java: '☕',
    'C++': '⚡', C: '⚙️', Ruby: '💎', PHP: '🐘', Kotlin: '🎯',
    default: '📦'
  };

  function langIcon(lang) {
    return LANG_ICONS[lang] || LANG_ICONS.default;
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function formatRepoName(name) {
    return name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  async function fetchRepos() {
    const grid = document.getElementById('projects-grid');
    const loading = document.getElementById('projects-loading');
    if (!grid) return;

    // Always render pinned cards first
    PINNED_PROJECTS.forEach(repo => grid.appendChild(createCard(repo)));

    const remainingSlots = MAX_CARDS - PINNED_COUNT; // 5

    try {
      const res = await fetch(GITHUB_URL);
      if (!res.ok) throw new Error('GitHub API error');
      const repos = await res.json();

      // Exclude forks and pinned repos (matched by name, case-insensitive)
      const pinnedNames = PINNED_PROJECTS.map(p => p.name.toLowerCase());
      const filtered = repos
        .filter(r => !r.fork && !pinnedNames.includes(r.name.toLowerCase()))
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, remainingSlots);

      if (loading) loading.remove();
      filtered.forEach(repo => grid.appendChild(createCard(repo)));

    } catch (err) {
      if (loading) loading.textContent = '⚠ Unable to load projects. Check back soon.';
      renderPlaceholders(grid, remainingSlots);
    }
  }

  function renderPlaceholders(grid, count) {
    const all = [
      { name: 'Threat-Intelligence-Dashboard', description: 'Real-time threat intel aggregator pulling from AbuseIPDB, ThreatFox and AlienVault OTX.', language: 'Python', updated_at: '2024-11-01', html_url: `https://github.com/${GITHUB_USER}` },
      { name: 'Network-Anomaly-Detector', description: 'ML-powered network traffic analyzer for detecting anomalies and intrusion attempts.', language: 'Python', updated_at: '2024-10-15', html_url: `https://github.com/${GITHUB_USER}` },
      { name: 'OSINT-Recon-Tool', description: 'Automated open-source intelligence gathering and reconnaissance framework.', language: 'Python', updated_at: '2024-09-20', html_url: `https://github.com/${GITHUB_USER}` },
      { name: 'Log-Parser-Toolkit', description: 'Modular log parsing toolkit for SIEM ingestion and alert correlation.', language: 'Python', updated_at: '2024-08-10', html_url: `https://github.com/${GITHUB_USER}` },
      { name: 'CTF-Writeups', description: 'Collection of CTF challenge writeups from HackTheBox, TryHackMe, and national competitions.', language: 'Shell', updated_at: '2024-07-01', html_url: `https://github.com/${GITHUB_USER}` },
    ];
    all.slice(0, count).forEach(p => grid.appendChild(createCard(p)));
  }

  function createCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card' + (repo.pinned ? ' project-card--pinned' : '');
    card.innerHTML = `
      <div class="project-card-visual">
        ${repo.pinned ? '<span class="pin-badge">📌 Pinned</span>' : ''}
        <span class="proj-icon">${langIcon(repo.language)}</span>
      </div>
      <div class="project-card-body">
        <div class="project-card-title">${formatRepoName(repo.name)}</div>
        <div class="project-card-lang">${repo.language || 'Code'}</div>
      </div>
    `;
    card.addEventListener('click', () => openModal(repo));
    return card;
  }

  function openModal(repo) {
    const overlay = document.getElementById('project-modal');
    const body = document.getElementById('modal-body');
    if (!overlay || !body) return;

    body.innerHTML = `
      <span class="modal-lang-tag">${langIcon(repo.language)} ${repo.language || 'Project'}</span>
      ${repo.pinned ? '<span class="modal-pinned-badge">📌 Featured Project</span>' : ''}
      <h2 class="modal-title">${formatRepoName(repo.name)}</h2>
      <p class="modal-desc">${repo.description || 'No description provided. Visit the repository for more details.'}</p>
      <p class="modal-meta">Last updated: ${formatDate(repo.updated_at)}</p>
      <div class="modal-actions">
        <a href="${repo.html_url}" target="_blank" rel="noopener" class="btn btn-primary">
          View on GitHub ↗
        </a>
      </div>
    `;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // Modal close
  document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close-btn');

    closeBtn && closeBtn.addEventListener('click', closeModal);
    overlay && overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });

    function closeModal() {
      overlay && overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    fetchRepos();
  });

})();
