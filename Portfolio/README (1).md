# Aarya Dahal — Cybersecurity Portfolio

## File Structure

```
portfolio/
├── index.html          ← Main portfolio page
├── blogs.html          ← Blogs listing page
├── server.js           ← Node.js backend for threat intel APIs
├── package.json
├── css/
│   ├── style.css       ← Global styles, variables, earth tone palette
│   ├── navbar.css      ← Navbar styles
│   ├── hero.css        ← Hero section styles
│   └── sections.css    ← All other section styles
└── js/
    ├── main.js         ← Theme toggle, navbar, motion graph canvas
    ├── ticker.js       ← Threat intel ticker logic
    └── projects.js     ← GitHub API projects fetcher
```

## Quick Start (Static Only — no live threat data)

Just open `index.html` in a browser. The ticker will use realistic simulated fallback data.

## Full Setup (Live Threat Intel)

### 1. Get API Keys

| API | Where to get |
|-----|-------------|
| AbuseIPDB | https://www.abuseipdb.com/account/api |
| AlienVault OTX | https://otx.alienvault.com/settings |
| ThreatFox | Public API — no key needed |

### 2. Install & Run Backend

```bash
npm install
ABUSEIPDB_KEY=your_key ALIENVAULT_KEY=your_key node server.js
```

The server serves the static files AND the `/api/threats` endpoint.

Open: http://localhost:3000

### 3. Customize Your Content

Edit `index.html` to update:
- **Hero**: Your name, title, description
- **About**: Your personal bio and stats
- **Skills**: Your actual skill tags
- **Certificates**: Your real certificates
- **Experience**: Your real work history with company logos

### 4. Replace Motion Graph (Optional)

If you have your own motion graph HTML file, replace the `<canvas id="hero-canvas">` with an `<iframe>` pointing to your file:

```html
<iframe src="your-motion-graph.html" frameborder="0" style="width:100%;height:100%;border:none;"></iframe>
```

### 5. Blogs

Edit `blogs.html` to add your real Medium/blog post links.
Or fetch automatically from Medium RSS — replace the static cards with a fetch to:
`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@YOUR_USERNAME`

### 6. GitHub Projects

Projects auto-fetch from `https://api.github.com/users/Aaryadahal16/repos`
No changes needed — they update automatically when you push to GitHub.

## Deployment

- **Static hosting (Netlify/Vercel/GitHub Pages)**: Deploy `index.html`, `blogs.html`, `css/`, `js/`
  - Threat ticker will use fallback simulation data
- **Full stack (Railway/Render/VPS)**: Run `server.js`, it serves everything
  - Live threat intel from real APIs
