/**
 * Threat Intelligence Backend — Node.js / Express
 * 
 * Setup:
 *   npm install express node-fetch cors
 *   node server.js
 *
 * Add your API keys below. The frontend calls /api/threats.
 */

const express = require('express');
const cors    = require('cors');
const path    = require('path');
// Use node-fetch v2 (CommonJS compatible)
// npm install node-fetch@2
const fetch   = require('node-fetch');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── API Keys (set via environment variables) ─────────────────
const ABUSEIPDB_KEY  = process.env.ABUSEIPDB_KEY  || 'YOUR_ABUSEIPDB_KEY';
const ALIENVAULT_KEY = process.env.ALIENVAULT_KEY || 'YOUR_ALIENVAULT_KEY';
// ThreatFox uses public API, no key needed for basic queries

app.use(cors());
app.use(express.static(path.join(__dirname)));

// ─── In-memory cache ─────────────────────────────────────────
let cache = { data: [], ts: 0 };
const CACHE_TTL = 7 * 60 * 1000; // 7 minutes

// ─── Fetch helpers ───────────────────────────────────────────

async function fetchAbuseIPDB() {
  try {
    const res = await fetch('https://api.abuseipdb.com/api/v2/blacklist?confidenceMinimum=85&limit=5', {
      headers: { 'Key': ABUSEIPDB_KEY, 'Accept': 'application/json' }
    });
    const json = await res.json();
    return (json.data || []).slice(0, 5).map(entry => ({
      type: 'ip',
      value: entry.ipAddress,
      context: getCategoryName(entry.abuseCategories?.[0]),
      severity: entry.abuseConfidenceScore >= 90 ? 'high' : 'medium',
      mitre: getMITREForCategory(entry.abuseCategories?.[0])
    }));
  } catch { return []; }
}

async function fetchThreatFox() {
  try {
    const res = await fetch('https://threatfox-api.abuse.ch/api/v1/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'get_iocs', days: 1, limit: 5 })
    });
    const json = await res.json();
    return (json.data || []).slice(0, 5).map(ioc => ({
      type: 'domain',
      value: (ioc.ioc_value || '').replace(/^https?:\/\//, '').replace(/\//g, ''),
      context: ioc.threat_type_desc || 'IOC',
      severity: ioc.confidence_level >= 75 ? 'high' : 'medium'
    }));
  } catch { return []; }
}

async function fetchAlienVault() {
  try {
    const res = await fetch('https://otx.alienvault.com/api/v1/pulses/subscribed?limit=5', {
      headers: { 'X-OTX-API-KEY': ALIENVAULT_KEY }
    });
    const json = await res.json();
    return (json.results || []).slice(0, 5).map(pulse => ({
      type: 'trend',
      value: pulse.name,
      context: (pulse.tags || []).slice(0, 2).join(', '),
      severity: pulse.adversary ? 'high' : 'medium'
    }));
  } catch { return []; }
}

function getCategoryName(code) {
  const map = {
    3: 'Fraud Orders', 4: 'DDoS Attack', 5: 'FTP Brute Force', 6: 'Ping of Death',
    7: 'Phishing', 9: 'Open Proxy', 10: 'Web Spam', 11: 'Email Spam',
    14: 'Port Scan', 18: 'Brute Force', 20: 'Exploited Host', 21: 'Web App Attack',
    22: 'SSH', 23: 'IoT Targeted'
  };
  return map[code] || 'Malicious Activity';
}

function getMITREForCategory(code) {
  const map = { 18: 'T1110', 14: 'T1046', 4: 'T1498', 7: 'T1566', 21: 'T1190' };
  return map[code] || null;
}

// ─── Fallback data ───────────────────────────────────────────
const FALLBACK = [
  { type: 'ip',     value: '185.234.219.47',           context: 'Brute Force',             severity: 'high',   mitre: 'T1110' },
  { type: 'domain', value: 'login-secure-update[.]com', context: 'Phishing Page',           severity: 'high'  },
  { type: 'trend',  value: 'Credential Stuffing Wave',  context: 'Banking Sector',          severity: 'high',   mitre: 'T1078' },
  { type: 'ip',     value: '194.165.16.72',             context: 'SSH Brute Force',         severity: 'high',   mitre: 'T1110.004' },
  { type: 'domain', value: 'cdn-update-check[.]xyz',    context: 'Malware Dropper',         severity: 'medium' },
  { type: 'trend',  value: 'BEC Campaign Active',       context: 'Finance Targets',         severity: 'medium', mitre: 'T1534' },
];

// ─── API Route ───────────────────────────────────────────────
app.get('/api/threats', async (req, res) => {
  // Serve cached if fresh
  if (Date.now() - cache.ts < CACHE_TTL && cache.data.length > 0) {
    return res.json(cache.data);
  }

  const [ips, domains, trends] = await Promise.all([
    fetchAbuseIPDB(),
    fetchThreatFox(),
    fetchAlienVault()
  ]);

  // Interleave: ip, domain, trend, ip, domain, trend ...
  const interleaved = [];
  const maxLen = Math.max(ips.length, domains.length, trends.length);
  for (let i = 0; i < maxLen; i++) {
    if (ips[i])     interleaved.push(ips[i]);
    if (domains[i]) interleaved.push(domains[i]);
    if (trends[i])  interleaved.push(trends[i]);
  }

  const result = interleaved.length > 0
    ? interleaved.slice(0, 10)
    : FALLBACK;

  cache = { data: result, ts: Date.now() };
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Threat intel backend running on http://localhost:${PORT}`);
  console.log('Serving portfolio at http://localhost:' + PORT + '/index.html');
});
