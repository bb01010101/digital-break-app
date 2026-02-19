/* ─── Digital Break — Blocked Page Logic ─── */

const params = new URLSearchParams(window.location.search);
const domain = params.get('domain') || 'unknown';
const mode = params.get('mode') || 'timer';
const challengeType = params.get('challenge') || 'math';
const timerSeconds = parseInt(params.get('timer') || '30', 10);

let unlockCode = '';

document.addEventListener('DOMContentLoaded', () => {
    // Inject SVG gradient for timer ring
    injectSvgGradient();

    document.getElementById('domainText').textContent = domain;

    // Increment blocked counter
    chrome.runtime.sendMessage({ type: 'INCREMENT_BLOCKED' });

    // Show correct mode
    if (mode === 'timer') startTimer();
    else if (mode === 'challenge') startChallenge();
    else if (mode === 'friend2fa') startFriend2FA();

    document.getElementById('goBackBtn').addEventListener('click', () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.close();
        }
    });
});

/* ─── Timer Mode ─── */
function startTimer() {
    document.getElementById('timerMode').style.display = 'block';

    const ring = document.getElementById('timerRing');
    const text = document.getElementById('timerText');
    const btn = document.getElementById('timerUnlockBtn');
    const circumference = 2 * Math.PI * 54; // r=54
    ring.style.strokeDasharray = circumference;

    let remaining = timerSeconds;
    text.textContent = remaining;

    const interval = setInterval(() => {
        remaining--;
        text.textContent = remaining;
        const offset = circumference * (1 - remaining / timerSeconds);
        ring.style.strokeDashoffset = offset;

        if (remaining <= 0) {
            clearInterval(interval);
            text.textContent = '✓';
            btn.disabled = false;
            btn.textContent = '🔓 Continue to site';
            btn.addEventListener('click', () => unlockAndRedirect());
        }
    }, 1000);
}

/* ─── Challenge Mode ─── */
function startChallenge() {
    document.getElementById('challengeMode').style.display = 'block';

    if (challengeType === 'math') setupMathChallenge();
    else if (challengeType === 'typing') setupTypingChallenge();
    else setupMathChallenge(); // default
}

function setupMathChallenge() {
    document.getElementById('challengeLabel').textContent = '🧮 Solve to unlock';

    // Generate a multi-step math problem
    const a = randInt(12, 99);
    const b = randInt(12, 99);
    const c = randInt(2, 9);
    const ops = ['+', '-', '×'];
    const op = ops[randInt(0, ops.length - 1)];

    let question, answer;
    switch (op) {
        case '+':
            question = `${a} + ${b} × ${c}`;
            answer = a + b * c;
            break;
        case '-':
            question = `${a * c} - ${b}`;
            answer = a * c - b;
            break;
        case '×':
            question = `${a} × ${c} + ${b}`;
            answer = a * c + b;
            break;
    }

    document.getElementById('challengeQuestion').textContent = `${question} = ?`;

    const input = document.getElementById('challengeInput');
    const feedback = document.getElementById('challengeFeedback');
    input.setAttribute('type', 'number');
    input.setAttribute('placeholder', 'Your answer');

    const submit = document.getElementById('challengeSubmit');
    submit.addEventListener('click', () => checkAnswer(input, feedback, answer));
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') checkAnswer(input, feedback, answer);
    });
}

function setupTypingChallenge() {
    document.getElementById('challengeLabel').textContent = '⌨️ Type to unlock';

    const phrases = [
        'I choose focus over distraction',
        'My time is valuable and I spend it wisely',
        'Deep work creates deep results',
        'I am in control of my attention',
        'Every minute counts toward my goals',
        'I will not let algorithms steal my time',
        'Focus is a superpower I choose to activate',
    ];
    const phrase = phrases[randInt(0, phrases.length - 1)];

    document.getElementById('challengeQuestion').textContent = `"${phrase}"`;
    document.getElementById('challengeQuestion').style.fontSize = '18px';

    const input = document.getElementById('challengeInput');
    const feedback = document.getElementById('challengeFeedback');
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', 'Type the phrase above exactly');

    const submit = document.getElementById('challengeSubmit');
    submit.addEventListener('click', () => checkTyping(input, feedback, phrase));
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') checkTyping(input, feedback, phrase);
    });
}

function checkAnswer(input, feedback, answer) {
    const val = parseInt(input.value, 10);
    if (val === answer) {
        feedback.textContent = '✅ Correct!';
        feedback.className = 'challenge-feedback success';
        setTimeout(() => unlockAndRedirect(), 800);
    } else {
        feedback.textContent = '❌ Wrong answer, try again';
        feedback.className = 'challenge-feedback error';
        input.value = '';
        input.focus();
    }
}

function checkTyping(input, feedback, phrase) {
    if (input.value.trim().toLowerCase() === phrase.toLowerCase()) {
        feedback.textContent = '✅ Well said!';
        feedback.className = 'challenge-feedback success';
        setTimeout(() => unlockAndRedirect(), 800);
    } else {
        feedback.textContent = '❌ Doesn\'t match. Try again!';
        feedback.className = 'challenge-feedback error';
        input.focus();
    }
}

/* ─── Friend 2FA Mode ─── */
function startFriend2FA() {
    document.getElementById('friend2faMode').style.display = 'block';

    // Generate a 6-digit code
    unlockCode = String(randInt(100000, 999999));
    const formatted = unlockCode.slice(0, 3) + ' ' + unlockCode.slice(3);

    document.getElementById('revealCodeBtn').addEventListener('click', () => {
        const el = document.getElementById('revealedCode');
        el.textContent = formatted;
        el.style.display = 'block';
    });

    const input = document.getElementById('friend2faInput');
    const feedback = document.getElementById('friend2faFeedback');

    document.getElementById('friend2faSubmit').addEventListener('click', () => {
        const entered = input.value.replace(/\s/g, '');
        if (entered === unlockCode) {
            feedback.textContent = '✅ Verified!';
            feedback.className = 'challenge-feedback success';
            setTimeout(() => unlockAndRedirect(), 800);
        } else {
            feedback.textContent = '❌ Wrong code';
            feedback.className = 'challenge-feedback error';
            input.value = '';
            input.focus();
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') document.getElementById('friend2faSubmit').click();
    });
}

/* ─── Unlock & Redirect ─── */
function unlockAndRedirect() {
    chrome.runtime.sendMessage(
        { type: 'UNLOCK_SITE', domain, durationMinutes: 5 },
        () => {
            window.location.href = `https://${domain}`;
        }
    );
}

/* ─── Helpers ─── */
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function injectSvgGradient() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.innerHTML = `
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#60a5fa"/>
        <stop offset="100%" style="stop-color:#a78bfa"/>
      </linearGradient>
    </defs>
  `;
    document.body.insertBefore(svg, document.body.firstChild);
}
