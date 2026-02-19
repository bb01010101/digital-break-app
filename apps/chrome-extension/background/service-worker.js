/* ─── Digital Break — Background Service Worker ─── */

const DEFAULT_STATE = {
    blockedSites: [
        { id: '1', domain: 'instagram.com', enabled: true, mode: 'challenge', challengeType: 'math' },
        { id: '2', domain: 'tiktok.com', enabled: true, mode: 'timer', timerSeconds: 30 },
        { id: '3', domain: 'twitter.com', enabled: true, mode: 'challenge', challengeType: 'typing' },
        { id: '4', domain: 'reddit.com', enabled: false, mode: 'timer', timerSeconds: 15 },
        { id: '5', domain: 'youtube.com', enabled: true, mode: 'friend2fa' },
        { id: '6', domain: 'facebook.com', enabled: false, mode: 'challenge', challengeType: 'math' },
    ],
    usageData: {},       // { 'YYYY-MM-DD': { domain: secondsSpent } }
    tempUnlocks: {},     // { domain: unlockUntilTimestamp }
    totalBlockedToday: 0,
    settings: {
        darkMode: true,
        challengeDifficulty: 'medium',
        dailyLimitMinutes: 60,
    },
};

/* ─── Init ─── */
chrome.runtime.onInstalled.addListener(async () => {
    const data = await chrome.storage.local.get('state');
    if (!data.state) {
        await chrome.storage.local.set({ state: DEFAULT_STATE });
    }
    await updateBlockingRules();
    setupDailyReset();
});

/* ─── Blocking Rules ─── */
async function getState() {
    const data = await chrome.storage.local.get('state');
    return data.state || DEFAULT_STATE;
}

async function setState(patch) {
    const state = await getState();
    const next = { ...state, ...patch };
    await chrome.storage.local.set({ state: next });
    return next;
}

async function updateBlockingRules() {
    const state = await getState();
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const removeIds = existingRules.map(r => r.id);

    const rules = [];
    let ruleId = 1;

    for (const site of state.blockedSites) {
        if (!site.enabled) continue;

        // Check if temporarily unlocked
        const unlock = state.tempUnlocks?.[site.domain];
        if (unlock && Date.now() < unlock) continue;

        rules.push({
            id: ruleId++,
            priority: 1,
            action: {
                type: 'redirect',
                redirect: {
                    extensionPath: `/blocked/blocked.html?domain=${encodeURIComponent(site.domain)}&mode=${site.mode}&challenge=${site.challengeType || ''}&timer=${site.timerSeconds || 30}`
                }
            },
            condition: {
                urlFilter: `||${site.domain}`,
                resourceTypes: ['main_frame']
            }
        });
    }

    await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: removeIds,
        addRules: rules,
    });
}

/* ─── Usage Tracking ─── */
const activeTabTimes = {};

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
    try {
        const tab = await chrome.tabs.get(tabId);
        trackTabChange(tab.url);
    } catch { /* tab might be gone */ }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
        trackTabChange(tab.url);
    }
});

function trackTabChange(url) {
    if (!url) return;
    const now = Date.now();

    // flush previous
    if (activeTabTimes._currentDomain && activeTabTimes._startTime) {
        const elapsed = Math.round((now - activeTabTimes._startTime) / 1000);
        if (elapsed > 0 && elapsed < 3600) {
            recordUsage(activeTabTimes._currentDomain, elapsed);
        }
    }

    try {
        const domain = new URL(url).hostname.replace('www.', '');
        activeTabTimes._currentDomain = domain;
        activeTabTimes._startTime = now;
    } catch {
        activeTabTimes._currentDomain = null;
        activeTabTimes._startTime = null;
    }
}

async function recordUsage(domain, seconds) {
    const state = await getState();
    const today = new Date().toISOString().slice(0, 10);
    const usage = { ...state.usageData };
    if (!usage[today]) usage[today] = {};
    usage[today][domain] = (usage[today][domain] || 0) + seconds;
    await setState({ usageData: usage });
}

/* ─── Temp Unlock ─── */
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'UNLOCK_SITE') {
        handleUnlock(msg.domain, msg.durationMinutes || 5).then(() => {
            sendResponse({ ok: true });
        });
        return true; // async
    }
    if (msg.type === 'GET_STATE') {
        getState().then(state => sendResponse(state));
        return true;
    }
    if (msg.type === 'UPDATE_SITES') {
        setState({ blockedSites: msg.sites }).then(async () => {
            await updateBlockingRules();
            sendResponse({ ok: true });
        });
        return true;
    }
    if (msg.type === 'TOGGLE_SITE') {
        toggleSite(msg.id).then(() => sendResponse({ ok: true }));
        return true;
    }
    if (msg.type === 'ADD_SITE') {
        addSite(msg.site).then(() => sendResponse({ ok: true }));
        return true;
    }
    if (msg.type === 'REMOVE_SITE') {
        removeSite(msg.id).then(() => sendResponse({ ok: true }));
        return true;
    }
    if (msg.type === 'INCREMENT_BLOCKED') {
        getState().then(async state => {
            await setState({ totalBlockedToday: (state.totalBlockedToday || 0) + 1 });
            sendResponse({ ok: true });
        });
        return true;
    }
});

async function handleUnlock(domain, durationMinutes) {
    const state = await getState();
    const unlocks = { ...state.tempUnlocks };
    unlocks[domain] = Date.now() + durationMinutes * 60 * 1000;
    await setState({ tempUnlocks: unlocks });
    await updateBlockingRules();

    // Re-block after duration
    setTimeout(async () => {
        const s = await getState();
        const u = { ...s.tempUnlocks };
        delete u[domain];
        await setState({ tempUnlocks: u });
        await updateBlockingRules();
    }, durationMinutes * 60 * 1000);
}

async function toggleSite(id) {
    const state = await getState();
    const sites = state.blockedSites.map(s =>
        s.id === id ? { ...s, enabled: !s.enabled } : s
    );
    await setState({ blockedSites: sites });
    await updateBlockingRules();
}

async function addSite(site) {
    const state = await getState();
    const newSite = {
        id: Date.now().toString(),
        domain: site.domain.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/.*$/, ''),
        enabled: true,
        mode: site.mode || 'timer',
        timerSeconds: site.timerSeconds || 30,
        challengeType: site.challengeType || 'math',
    };
    await setState({ blockedSites: [...state.blockedSites, newSite] });
    await updateBlockingRules();
}

async function removeSite(id) {
    const state = await getState();
    const sites = state.blockedSites.filter(s => s.id !== id);
    await setState({ blockedSites: sites });
    await updateBlockingRules();
}

/* ─── Daily Reset ─── */
function setupDailyReset() {
    chrome.alarms.create('daily-reset', {
        when: getNextMidnight(),
        periodInMinutes: 24 * 60,
    });
}

function getNextMidnight() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return midnight.getTime();
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'daily-reset') {
        await setState({ totalBlockedToday: 0, tempUnlocks: {} });
        await updateBlockingRules();
    }
});
