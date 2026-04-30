/* ============================================================
   PROJECTS JS — Fetches from GitHub public API
   ============================================================ */

(function () {
  const GITHUB_USER = 'Aaryadahal16';
  const GITHUB_URL = `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`;

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

    try {
      const res = await fetch(GITHUB_URL);
      if (!res.ok) throw new Error('GitHub API error');
      const repos = await res.json();

      const filtered = repos
        .filter(r => !r.fork)
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

      if (loading) loading.remove();
      filtered.forEach(repo => grid.appendChild(createCard(repo)));

    } catch (err) {
      if (loading) loading.textContent = '⚠ Unable to load projects. Check back soon.';
      // Render placeholder cards
      renderPlaceholders(grid);
    }
  }

  function renderPlaceholders(grid) {
    const placeholders = [
      { name: 'Threat-Intelligence-Dashboard', description: 'Real-time threat intel aggregator pulling from AbuseIPDB, ThreatFox and AlienVault OTX.', language: 'Python', updated_at: '2024-11-01', html_url: `https://github.com/${GITHUB_USER}` },
      { name: 'Network-Anomaly-Detector', description: 'ML-powered network traffic analyzer for detecting anomalies and intrusion attempts.', language: 'Python', updated_at: '2024-10-15', html_url: `https://github.com/${GITHUB_USER}` },
      { name: 'OSINT-Recon-Tool', description: 'Automated open-source intelligence gathering and reconnaissance framework.', language: 'Python', updated_at: '2024-09-20', html_url: `https://github.com/${GITHUB_USER}` },
    ];
    placeholders.forEach(p => grid.appendChild(createCard(p)));
  }

  function createCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="project-card-visual">
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
