
let windowCount = 0;
let closeAttempts = 0;
let crashTriggered = false;

const tokens = [
    "LIGHT-98WIN-2024-7G2K",
    "LIGHT-98WIN-2024-3M9P",
    "LIGHT-98WIN-2024-5R8Q",
    "LIGHT-98WIN-2024-1T4L",
    "LIGHT-98WIN-2024-9W6X",
    "LIGHT-98WIN-2024-2F7C",
    "LIGHT-98WIN-2024-8H3V",
    "LIGHT-98WIN-2024-4D1B",
    "LIGHT-98WIN-2024-6J0Z",
    "LIGHT-98WIN-2024-0U9Y"
];

let currentToken = tokens[Math.floor(Math.random() * tokens.length)];
let rickrollStarted = false;

function beep() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.value = 880;

        gainNode.gain.value = 0.2;

        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.2);
        oscillator.stop(audioCtx.currentTime + 0.2);

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    } catch(e) {}

    if (navigator.vibrate) navigator.vibrate(50);
}

function createWindow(x, y) {
    windowCount++;
    const container = document.getElementById('windowsContainer');
    const win = document.createElement('div');
    win.className = 'window';
    win.style.left = (x || Math.random() * (window.innerWidth - 400)) + 'px';
    win.style.top = (y || Math.random() * (window.innerHeight - 300)) + 'px';
    win.style.zIndex = windowCount;

    win.innerHTML = `
        <div class="title-bar">
            <div class="title-bar-text">
                <i class="fa-solid fa-biohazard"></i> SYSTEM ALERT #${windowCount}
            </div>
            <div class="title-bar-controls">
                <button class="close-btn"><i class="fa-solid fa-times"></i></button>
            </div>
        </div>
        <div class="window-body">
            <div class="error-text blinking">YOU ARE AN IDIOT!</div>
            <div class="error-message">
                <span id="msg-${windowCount}">Your system has been infected!</span><br>
                <span id="submsg-${windowCount}" style="font-size: 9px;">Do not close this window or the virus will spread!</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" id="progress-${windowCount}"></div>
            </div>
            <button class="close-attempt">OK</button>
            <div class="counter">
                <i class="fa-solid fa-skull"></i> Windows open: <span id="counter">${windowCount}</span>
            </div>
        </div>
    `;

    container.appendChild(win);

    let progress = 0;
    const progressBar = win.querySelector(`#progress-${windowCount}`);
    const msgElement = win.querySelector(`#msg-${windowCount}`);
    const subMsgElement = win.querySelector(`#submsg-${windowCount}`);

    const interval = setInterval(() => {
        if (!win.parentNode || crashTriggered) {
            clearInterval(interval);
            return;
        }
        progress += Math.random() * 3;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            msgElement.innerHTML = '<span class="warning">INFECTION COMPLETE! CANNOT CLOSE!</span>';
            subMsgElement.innerHTML = 'The virus has spread through the entire system...';
            beep();

            if (!crashTriggered && windowCount >= 15) {
                triggerBlueScreen();
            }
        }
        progressBar.style.width = progress + '%';
    }, 800);

    const okBtn = win.querySelector('.close-attempt');
    okBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (crashTriggered) return;
        closeAttempts++;
        beep();

        if (progress >= 100) {
            msgElement.innerHTML = '<span class="warning">YOU CANNOT CLOSE THIS! ACCEPT YOUR FATE!</span>';
            return;
        }

        if (closeAttempts < 3) {
            progress = Math.min(100, progress + 25);
            progressBar.style.width = progress + '%';
            msgElement.innerHTML = `YOU TRIED TO CLOSE ${closeAttempts} TIMES! IT GOT WORSE!`;
            subMsgElement.innerHTML = 'The more you try to close, the faster the virus spreads...';

            setTimeout(() => {
                if (windowCount < 12 && !crashTriggered) createWindow();
            }, 300);
        } else {
            msgElement.innerHTML = 'YOU NEVER LEARN! MORE WINDOWS!';
            subMsgElement.innerHTML = 'MASS INFECTION ACTIVATED!';
            for (let i = 0; i < 3 && windowCount < 15 && !crashTriggered; i++) {
                setTimeout(() => createWindow(), i * 150);
            }
        }
    });

    const closeBtn = win.querySelector('.close-btn');
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (crashTriggered) return;
        closeAttempts++;
        beep();

        if (progress >= 100) return;

        progress = Math.min(100, progress + 40);
        progressBar.style.width = progress + '%';
        msgElement.innerHTML = 'CLOSING ONLY MAKES IT WORSE!';
        subMsgElement.innerHTML = 'You are spreading the virus faster!';

        for (let i = 0; i < 2 && windowCount < 15 && !crashTriggered; i++) {
            setTimeout(() => createWindow(), i * 200);
        }
    });

    makeDraggable(win);
    updateCounter();
    beep();

    return win;
}

function makeDraggable(win) {
    const titleBar = win.querySelector('.title-bar');
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    titleBar.addEventListener('mousedown', (e) => {
        if (e.target.closest('.title-bar-controls')) return;
        e.preventDefault();
        const rect = win.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        startLeft = rect.left;
        startTop = rect.top;
        isDragging = true;
        win.style.position = 'absolute';
        win.style.left = startLeft + 'px';
        win.style.top = startTop + 'px';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        win.style.left = (e.clientX - startX) + 'px';
        win.style.top = (e.clientY - startY) + 'px';
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    titleBar.addEventListener('touchstart', (e) => {
        if (e.target.closest('.title-bar-controls')) return;
        e.preventDefault();
        const touch = e.touches[0];
        const rect = win.getBoundingClientRect();
        startX = touch.clientX - rect.left;
        startY = touch.clientY - rect.top;
        startLeft = rect.left;
        startTop = rect.top;
        isDragging = true;
        win.style.position = 'absolute';
        win.style.left = startLeft + 'px';
        win.style.top = startTop + 'px';
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const touch = e.touches[0];
        win.style.left = (touch.clientX - startX) + 'px';
        win.style.top = (touch.clientY - startY) + 'px';
    });

    window.addEventListener('touchend', () => { isDragging = false; });
}

function updateCounter() {
    const windows = document.querySelectorAll('.window');
    const counters = document.querySelectorAll('#counter');
    counters.forEach(c => { if(c) c.innerText = windows.length; });
}

function triggerBlueScreen() {
    if (crashTriggered) return;
    crashTriggered = true;

    const container = document.getElementById('windowsContainer');
    container.innerHTML = '';

    const bsod = document.getElementById('bsodOverlay');
    bsod.classList.add('show');

    let progress = 0;
    const progressFill = document.getElementById('bsodProgress');
    const bsodMessage = document.getElementById('bsodMessage');

    const progressInterval = setInterval(() => {
        progress += Math.random() * 4;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            bsodMessage.innerHTML = 'Dumping physical memory to disk: 100%<br>System recovered! Press any key to continue...';

            const keyHandler = (e) => {
                bsod.classList.remove('show');
                showRescueBox();
                document.removeEventListener('keydown', keyHandler);
                document.removeEventListener('click', keyHandler);
            };

            document.addEventListener('keydown', keyHandler);
            document.addEventListener('click', keyHandler);

        } else {
            bsodMessage.innerHTML = `Dumping physical memory to disk: ${Math.floor(progress)}%`;
        }
        progressFill.style.width = progress + '%';
    }, 80);
}

function showRescueBox() {
    const rescueBox = document.getElementById('rescueBox');
    const tokenDisplay = document.getElementById('tokenDisplay');
    tokenDisplay.innerText = currentToken;
    rescueBox.classList.remove('hidden');

    const rickrollAudio = document.getElementById('rickrollAudio');
    if (rickrollAudio && !rickrollStarted) {
        rickrollStarted = true;
        rickrollAudio.volume = 0.5;
        rickrollAudio.loop = true;
        rickrollAudio.play().catch(e => console.log('Audio play failed:', e));
    }

    document.getElementById('closeRescue').addEventListener('click', () => {
        rescueBox.classList.add('hidden');
        if (rickrollAudio) {
            rickrollAudio.pause();
        }

        window.location.href = '/';
    });

    document.getElementById('closeRescueBtn').addEventListener('click', () => {
        rescueBox.classList.add('hidden');
        if (rickrollAudio) {
            rickrollAudio.pause();
        }
        window.location.href = '/';
    });

    document.getElementById('sendEmailBtn').addEventListener('click', () => {
        const email = document.getElementById('userEmail').value;
        if (email && email.includes('@')) {
            window.location.href = `mailto:contatosadberry@gmail.com?subject=LIGHT%20FREE%20KEY%20REQUEST&body=Hello!%0D%0A%0D%0AI survived the YOU ARE AN IDIOT virus!%0D%0A%0D%0AMy token: ${currentToken}%0D%0AMy email: ${email}%0D%0A%0D%0AThank you!`;
            alert(`Email prepared!\n\nSend to: contatosadberry@gmail.com\nToken: ${currentToken}\n\nWe'll send your free LIGHT key soon!`);
        } else {
            alert('Please enter a valid email address.');
        }
    });
}

setTimeout(() => {
    createWindow(100, 100);
    createWindow(350, 180);
    createWindow(600, 120);
}, 500);

let spawnTimer = 0;
const spawnInterval = setInterval(() => {
    if (!crashTriggered) {
        const windows = document.querySelectorAll('.window');
        if (windows.length < 16 && Math.random() > 0.6) {
            createWindow();
        }
        if (!crashTriggered && document.querySelectorAll('.window').length >= 17) {
            triggerBlueScreen();
        }
    }
}, 4000);

window.addEventListener('keydown', (e) => {
    if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        e.preventDefault();
        if (!crashTriggered) {
            alert('HAHAHA! RELOAD WON\'T SAVE YOU!');
            for(let i = 0; i < 3 && !crashTriggered; i++) {
                setTimeout(() => createWindow(), i * 200);
            }
        }
    }
});

let originalTitle = document.title;
setInterval(() => {
    if (!crashTriggered) {
        document.title = document.title === originalTitle ? '!!! VIRUS DETECTED !!!' : originalTitle;
    } else {
        document.title = 'LIGHT';
    }
}, 1000);

console.log('%c⚠️ IT WAS JUST A JOKE! ⚠️', 'color: #2f498c; font-size: 16px; font-weight: bold;');
console.log('%cYou survived! Check the screen for your LIGHT game token!', 'color: #2f498c; font-size: 12px;');


function makeRescueBoxDraggable() {
    const rescueBox = document.getElementById('rescueBox');
    const titleBar = rescueBox.querySelector('.title-bar');
    if (!titleBar) return;

    let isDragging = false;
    let startX, startY;
    let startLeft, startTop;

    titleBar.addEventListener('mousedown', (e) => {
        if (e.target.closest('.title-bar-controls')) return;
        if (e.target.tagName === 'BUTTON') return;

        e.preventDefault();

        const rect = rescueBox.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        startLeft = rect.left;
        startTop = rect.top;

        isDragging = true;

        rescueBox.style.position = 'fixed';
        rescueBox.style.left = startLeft + 'px';
        rescueBox.style.top = startTop + 'px';
        rescueBox.style.transform = 'none';
        rescueBox.style.zIndex = '30001';
        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const newLeft = e.clientX - startX;
        const newTop = e.clientY - startY;

        const maxLeft = window.innerWidth - rescueBox.offsetWidth;
        const maxTop = window.innerHeight - rescueBox.offsetHeight;

        rescueBox.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
        rescueBox.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    });

    titleBar.addEventListener('touchstart', (e) => {
        if (e.target.closest('.title-bar-controls')) return;
        if (e.target.tagName === 'BUTTON') return;

        e.preventDefault();
        const touch = e.touches[0];
        const rect = rescueBox.getBoundingClientRect();

        startX = touch.clientX - rect.left;
        startY = touch.clientY - rect.top;
        startLeft = rect.left;
        startTop = rect.top;

        isDragging = true;

        rescueBox.style.position = 'fixed';
        rescueBox.style.left = startLeft + 'px';
        rescueBox.style.top = startTop + 'px';
        rescueBox.style.transform = 'none';
        rescueBox.style.zIndex = '30001';

        document.body.style.userSelect = 'none';
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const touch = e.touches[0];
        const newLeft = touch.clientX - startX;
        const newTop = touch.clientY - startY;

        const maxLeft = window.innerWidth - rescueBox.offsetWidth;
        const maxTop = window.innerHeight - rescueBox.offsetHeight;

        rescueBox.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
        rescueBox.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
    });

    window.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        document.body.style.userSelect = '';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    makeRescueBoxDraggable();
});