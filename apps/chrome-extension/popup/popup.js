/* ─── Digital Break — Popup Logic ─── */

document.addEventListener('DOMContentLoaded', init);

async function init() {
    await render();
    document.getElementById('addSiteBtn').addEventListener('click', handleAddSite);
    document.getElementById('newDomain').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleAddSite();
    });
    document.getElementById('settingsBtn').addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });
}

async function getState() {
    return new Promise(resolve => {
        chrome.runtime.sendMessage({ type: 'GET_STATE' }, resolve);
    });
}

async function render() {
    const state = await getState();
    if (!state) return;

    // Stats
    const activeSites = state.blockedSites.filter(s => s.enabled).length;
    document.getElementById('blockedCount').textContent = state.totalBlockedToday || 0;
    document.getElementById('sitesActive').textContent = activeSites;

    // Calculate time saved (rough estimate: 2min avg per block)
    const saved = (state.totalBlockedToday || 0) * 2;
    document.getElementById('timeToday').textContent = saved >= 60 ? `${Math.floor(saved / 60)}h ${saved % 60}m` : `${saved}m`;

    // Sites list
    renderSites(state.blockedSites);

    // Usage
    renderUsage(state.usageData);
}

function renderSites(sites) {
    const container = document.getElementById('sitesList');
    if (sites.length === 0) {
        container.innerHTML = '<div class="empty-state">No blocked sites yet. Add one above!</div>';
        return;
    }

    container.innerHTML = sites.map(site => `
    <div class="site-item ${site.enabled ? '' : 'disabled'}" data-id="${site.id}">
      <img
        class="site-favicon"
        src="https://www.google.com/s2/favicons?domain=${site.domain}&sz=64"
        alt=""
        onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22><rect width=%2220%22 height=%2220%22 rx=%224%22 fill=%22%231e293b%22/><text x=%2210%22 y=%2214%22 text-anchor=%22middle%22 fill=%22%2394a3b8%22 font-size=%2210%22>${site.domain[0]?.toUpperCase()}</text></svg>'"
      >
      <div class="site-info">
        <div class="site-domain">${site.domain}</div>
        <div class="site-mode">${getModeLabel(site)}</div>
      </div>
      <div class="site-actions">
        <label class="toggle">
          <input type="checkbox" ${site.enabled ? 'checked' : ''} data-toggle="${site.id}">
          <span class="toggle-track"></span>
          <span class="toggle-thumb"></span>
        </label>
        <button class="btn-remove" data-remove="${site.id}" title="Remove">✕</button>
      </div>
    </div>
  `).join('');

    // Toggle listeners
    container.querySelectorAll('[data-toggle]').forEach(el => {
        el.addEventListener('change', async () => {
            await chrome.runtime.sendMessage({ type: 'TOGGLE_SITE', id: el.dataset.toggle });
            await render();
        });
    });

    // Remove listeners
    container.querySelectorAll('[data-remove]').forEach(el => {
        el.addEventListener('click', async () => {
            await chrome.runtime.sendMessage({ type: 'REMOVE_SITE', id: el.dataset.remove });
            await render();
        });
    });
}

function getModeLabel(site) {
    switch (site.mode) {
        case 'timer': return `⏱ Timer · ${site.timerSeconds || 30}s wait`;
        case 'challenge': return `🧩 ${capitalize(site.challengeType || 'math')} challenge`;
        case 'friend2fa': return '🤝 Friend 2FA required';
        default: return site.mode;
    }
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function renderUsage(usageData) {
    const container = document.getElementById('usageList');
    const today = new Date().toISOString().slice(0, 10);
    const todayUsage = usageData?.[today] || {};

    const entries = Object.entries(todayUsage)
        .map(([domain, seconds]) => ({ domain, seconds }))
        .sort((a, b) => b.seconds - a.seconds)
        .slice(0, 8);

    if (entries.length === 0) {
        container.innerHTML = '<div class="empty-state">No browsing data yet today</div>';
        return;
    }

    const maxSeconds = entries[0]?.seconds || 1;

    container.innerHTML = entries.map(({ domain, seconds }) => `
    <div class="usage-item">
      <span class="usage-domain">${domain}</span>
      <div class="usage-bar-bg">
        <div class="usage-bar" style="width: ${Math.round((seconds / maxSeconds) * 100)}%"></div>
      </div>
      <span class="usage-time">${formatTime(seconds)}</span>
    </div>
  `).join('');
}

function formatTime(seconds) {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    return `${h}h ${m % 60}m`;
}

async function handleAddSite() {
    const input = document.getElementById('newDomain');
    const modeSelect = document.getElementById('newMode');
    const domain = input.value.trim();
    if (!domain) return;

    await chrome.runtime.sendMessage({
        type: 'ADD_SITE',
        site: {
            domain,
            mode: modeSelect.value,
            timerSeconds: 30,
            challengeType: 'math',
        },
    });

    input.value = '';
    await render();
}
