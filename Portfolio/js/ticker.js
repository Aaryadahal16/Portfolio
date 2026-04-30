/* ============================================================
   THREAT TICKER JS
   Fetches from backend /api/threats; falls back to simulation
   ============================================================ */

(function () {
  const FALLBACK = [
    { type: 'ip',     value: '185.234.219.47',          context: 'Brute Force',            severity: 'high',   mitre: 'T1110' },
    { type: 'ip',     value: '45.155.205.233',           context: 'Port Scanning',          severity: 'medium', mitre: 'T1046' },
    { type: 'domain', value: 'login-secure-update[.]com',context: 'Phishing Page',          severity: 'high'   },
    { type: 'domain', value: 'verify-account-info[.]net', context: 'Credential Harvesting', severity: 'high'   },
    { type: 'trend',  value: 'Credential Stuffing Campaign', context: 'Banking Sector',     severity: 'high',   mitre: 'T1078' },
    { type: 'ip',     value: '194.165.16.72',            context: 'SSH Brute Force',        severity: 'high',   mitre: 'T1110.004' },
    { type: 'domain', value: 'cdn-update-check[.]xyz',   context: 'Malware Dropper',        severity: 'medium' },
    { type: 'trend',  value: 'Ransomware-as-a-Service Surge', context: 'LockBit Variant',  severity: 'high',   mitre: 'T1486' },
    { type: 'ip',     value: '89.248.167.131',           context: 'DDoS Botnet Node',       severity: 'medium', mitre: 'T1498' },
    { type: 'trend',  value: 'Business Email Compromise Wave', context: 'Finance Targets',  severity: 'medium', mitre: 'T1534' },
  ];

  function formatItem(item) {
    if (item.type === 'ip')     return `Malicious IP → ${item.value} (${item.context})${item.mitre ? ' [' + item.mitre + ']' : ''}`;
    if (item.type === 'domain') return `Suspicious Domain → ${item.value}${item.context ? ' · ' + item.context : ''}`;
    if (item.type === 'trend')  return `Attack Trend → ${item.value}${item.context ? ' · ' + item.context : ''}${item.mitre ? ' [' + item.mitre + ']' : ''}`;
    return item.value;
  }

  let cachedItems = [...FALLBACK];
  let currentIndex = 0;
  let intervalHandle = null;
  let fetchHandle = null;

  async function fetchThreats() {
    try {
      const res = await fetch('/api/threats', { signal: AbortSignal.timeout(4000) });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // Gradually replace — don't swap all at once
        data.forEach((item, i) => {
          const idx = i % cachedItems.length;
          cachedItems[idx] = item;
        });
      }
    } catch {
      // Keep using fallback / previously cached
    }
  }

  function getSeverityClass(sev) {
    if (sev === 'high')   return 'high';
    if (sev === 'medium') return 'medium';
    return 'low';
  }

  function buildTickerDOM() {
    const track = document.getElementById('ticker-track');
    if (!track) return;
    track.innerHTML = '';

    // Render all items into the track (duplicated for seamless loop)
    const items = [...cachedItems, ...cachedItems];
    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'ticker-item';
      const dot = document.createElement('span');
      dot.className = `severity-dot ${getSeverityClass(item.severity)}`;
      const text = document.createElement('span');
      text.textContent = formatItem(item);
      el.appendChild(dot);
      el.appendChild(text);
      track.appendChild(el);
    });

    animateTicker(track);
  }

  function animateTicker(track) {
    let pos = 0;
    const speed = 0.55; // px per frame
    let raf;
    let paused = false;

    track.parentElement.addEventListener('mouseenter', () => paused = true);
    track.parentElement.addEventListener('mouseleave', () => paused = false);

    function step() {
      if (!paused) {
        pos += speed;
        const half = track.scrollWidth / 2;
        if (pos >= half) pos = 0;
        track.style.transform = `translateX(-${pos}px)`;
      }
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }

  // Init
  fetchThreats();
  buildTickerDOM();

  // Refresh every 7 minutes
  fetchHandle = setInterval(() => {
    fetchThreats();
  }, 7 * 60 * 1000);

})();
