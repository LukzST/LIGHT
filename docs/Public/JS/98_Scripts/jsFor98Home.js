
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const clock = document.getElementById('clock');
    if (clock) clock.innerHTML = `${hours}:${minutes}`;
}
updateClock();
setInterval(updateClock, 1000);

const startButton = document.getElementById('startButton');
const startMenu = document.getElementById('startMenu');

if (startButton && startMenu) {
    startButton.addEventListener('click', (e) => {
        e.stopPropagation();
        startMenu.classList.toggle('open');
    });
    
    document.addEventListener('click', (e) => {
        if (!startMenu.contains(e.target) && !startButton.contains(e.target)) {
            startMenu.classList.remove('open');
        }
    });
}

function support() {
    window.open('mailto:contatosadberry@gmail.com', '_blank');
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

function makeWindowDraggable(windowElement) {
    const titleBar = windowElement.querySelector('.title-bar');
    if (!titleBar) return;
    
    let isDragging = false;
    let startX, startY;
    let startLeft, startTop;
    
    function initAbsolutePosition() {
        if (windowElement.style.position === 'absolute') return;
        
        const rect = windowElement.getBoundingClientRect();
        const parentRect = windowElement.parentElement.getBoundingClientRect();
        
        windowElement.style.position = 'absolute';
        windowElement.style.left = (rect.left - parentRect.left) + 'px';
        windowElement.style.top = (rect.top - parentRect.top) + 'px';
        windowElement.style.width = rect.width + 'px';
        windowElement.style.margin = '0';
    }
    
    function getClientCoords(e) {
        if (e.touches) {
            return {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        }
        return {
            x: e.clientX,
            y: e.clientY
        };
    }
    
    function startDrag(e) {
        if (e.target.closest('.title-bar-controls')) return;
        if (e.target.tagName === 'BUTTON') return;
        
        e.preventDefault();
        e.stopPropagation();
        
        initAbsolutePosition();
        
        const coords = getClientCoords(e);
        startX = coords.x;
        startY = coords.y;
        
        startLeft = parseFloat(windowElement.style.left);
        startTop = parseFloat(windowElement.style.top);
        
        isDragging = true;
        windowElement.classList.add('dragging');
        
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'grabbing';
    }
    
    function onDrag(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        
        const coords = getClientCoords(e);
        const dx = coords.x - startX;
        const dy = coords.y - startY;
        
        const newLeft = startLeft + dx;
        const newTop = startTop + dy;
        
        windowElement.style.left = newLeft + 'px';
        windowElement.style.top = newTop + 'px';
    }
    
    function stopDrag() {
        if (!isDragging) return;
        
        isDragging = false;
        windowElement.classList.remove('dragging');
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    }
    
    titleBar.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
    
    titleBar.addEventListener('touchstart', startDrag, { passive: false });
    window.addEventListener('touchmove', onDrag, { passive: false });
    window.addEventListener('touchend', stopDrag);
}

function setupWindowControls(windowElement) {
    const controls = windowElement.querySelector('.title-bar-controls');
    if (!controls) return;
    
    const buttons = controls.querySelectorAll('button');
    const closeBtn = buttons[buttons.length - 1];
    
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            windowElement.style.transition = 'opacity 0.2s ease';
            windowElement.style.opacity = '0';
            
            setTimeout(() => {
                windowElement.style.display = 'none';
                windowElement.style.opacity = '';
                
                setTimeout(() => {
                    windowElement.style.display = 'block';
                    windowElement.style.opacity = '0';
                    windowElement.style.transition = 'opacity 0.2s ease';
                    windowElement.offsetHeight;
                    windowElement.style.opacity = '1';
                    
                    setTimeout(() => {
                        windowElement.style.transition = '';
                    }, 200);
                }, 2000);
            }, 200);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const windows = document.querySelectorAll('.window');
    windows.forEach(windowElement => {
        makeWindowDraggable(windowElement);
        setupWindowControls(windowElement);
    });
});

function modernModeShutdown() {
    const startMenu = document.getElementById('startMenu');
    if (startMenu && startMenu.classList.contains('open')) {
        startMenu.classList.remove('open');
    }
    
    let shutdownOverlay = document.getElementById('shutdownOverlayModern');
    if (!shutdownOverlay) {
        shutdownOverlay = document.createElement('div');
        shutdownOverlay.id = 'shutdownOverlayModern';
        shutdownOverlay.className = 'shutdown-overlay';
        shutdownOverlay.innerHTML = `<div class="shutdown-message"><p>Returning to Modern Mode...</p></div>`;
        document.body.appendChild(shutdownOverlay);
        
        const style = document.createElement('style');
        style.textContent = `
            #shutdownOverlayModern {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #000000;
                z-index: 99999999;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-family: "Pixelated MS Sans Serif", Arial;
                color: #ffffff;
                text-align: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease;
            }
            #shutdownOverlayModern.show {
                opacity: 1;
                visibility: visible;
            }
            #shutdownOverlayModern .shutdown-message {
                animation: shutdownPulse 1s infinite;
            }
            #shutdownOverlayModern .shutdown-message p {
                font-size: 18px;
                letter-spacing: 2px;
                margin-top: 20px;
            }
        `;
        document.head.appendChild(style);
    }
    
    shutdownOverlay.classList.add('show');
    
    let dotCount = 0;
    const dotInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
    }, 500);
    
    setTimeout(() => {
        clearInterval(dotInterval);
        const msg = shutdownOverlay.querySelector('.shutdown-message p');
        if (msg) msg.innerHTML = 'It is now safe to switch to Modern Mode.';
    }, 2000);
    
    setTimeout(() => {
        window.location.href = '/';
    }, 3000);
}

const shutdownBtn = document.getElementById('shutdownBtn');
const shutdownOverlay = document.getElementById('shutdownOverlay');
const shutdownDots = document.getElementById('shutdownDots');
const shutdownMessage = document.querySelector('.shutdown-message p');

let dotCountShutdown = 0;
let isShuttingDown = false;

function animateShutdownDots() {
    const interval = setInterval(() => {
        if (!isShuttingDown) {
            clearInterval(interval);
            return;
        }
        dotCountShutdown = (dotCountShutdown + 1) % 4;
        const dots = '.'.repeat(dotCountShutdown);
        if (shutdownDots) shutdownDots.innerHTML = dots;
    }, 500);
    return interval;
}

function showSafeToTurnOff() {
    if (shutdownMessage) shutdownMessage.innerHTML = 'It is now safe to turn off your computer.';
    if (shutdownDots) shutdownDots.innerHTML = '';
}

function performShutdown() {
    if (isShuttingDown) return;
    isShuttingDown = true;
    
    if (!shutdownOverlay) return;
    
    shutdownOverlay.classList.add('show');
    
    if (startMenu && startMenu.classList.contains('open')) {
        startMenu.classList.remove('open');
    }
    
    const dotInterval = animateShutdownDots();
    
    setTimeout(() => {
        clearInterval(dotInterval);
        showSafeToTurnOff();
    }, 2000);
    
    setTimeout(() => {
        window.location.href = '/';
    }, 3500);
}

if (shutdownBtn) {
    shutdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        performShutdown();
    });
}

let closedWindowCount = 0;
let notificationShown = false;
const promoPopup = document.getElementById('promoPopup');
const closeNotificationBtn = document.getElementById('closeNotificationBtn');
const dismissNotificationBtn = document.getElementById('dismissNotificationBtn');
const claimOfferBtn = document.getElementById('claimOfferBtn');

function showPromoNotification() {
    if (notificationShown || !promoPopup) return;
    notificationShown = true;
    promoPopup.classList.add('show');
    
    setTimeout(() => {
        if (promoPopup.classList.contains('show')) {
            promoPopup.classList.remove('show');
        }
    }, 15000);
}

function trackWindowClosure() {
    closedWindowCount++;
    console.log(`Windows closed: ${closedWindowCount}`);
    
    if (closedWindowCount >= 5 && !notificationShown) {
        showPromoNotification();
    }
}

function setupWindowControlsWithTracking(windowElement) {
    const controls = windowElement.querySelector('.title-bar-controls');
    if (!controls) return;
    
    const buttons = controls.querySelectorAll('button');
    const closeBtn = buttons[buttons.length - 1];
    
    if (closeBtn) {
        const newCloseBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
        
        newCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            trackWindowClosure();
            
            windowElement.style.transition = 'opacity 0.2s ease';
            windowElement.style.opacity = '0';
            
            setTimeout(() => {
                windowElement.style.display = 'none';
                windowElement.style.opacity = '';
                
                setTimeout(() => {
                    windowElement.style.display = 'block';
                    windowElement.style.opacity = '0';
                    windowElement.style.transition = 'opacity 0.2s ease';
                    windowElement.offsetHeight;
                    windowElement.style.opacity = '1';
                    
                    setTimeout(() => {
                        windowElement.style.transition = '';
                    }, 200);
                }, 5000);
            }, 200);
        });
    }
}

window.setupWindowControls = setupWindowControlsWithTracking;

function addTrackingToOkButtons() {
    const okButtons = document.querySelectorAll('.close-attempt');
    okButtons.forEach(btn => {
        if (!btn.hasAttribute('data-tracked')) {
            btn.setAttribute('data-tracked', 'true');
            btn.addEventListener('click', () => trackWindowClosure());
        }
    });
}

const observer = new MutationObserver(() => addTrackingToOkButtons());
observer.observe(document.body, { childList: true, subtree: true });

if (closeNotificationBtn) {
    closeNotificationBtn.addEventListener('click', () => {
        if (promoPopup) promoPopup.classList.remove('show');
    });
}

if (dismissNotificationBtn) {
    dismissNotificationBtn.addEventListener('click', () => {
        if (promoPopup) promoPopup.classList.remove('show');
    });
}

if (claimOfferBtn) {
    claimOfferBtn.addEventListener('click', () => {
        window.location.href = '/98/yaai/';
    });
}

function makeNotificationDraggable() {
    const titleBar = document.getElementById('notificationTitleBar');
    const popup = document.getElementById('promoPopup');
    if (!titleBar || !popup) return;
    
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    
    titleBar.addEventListener('mousedown', (e) => {
        if (e.target.closest('button')) return;
        e.preventDefault();
        
        const rect = popup.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        startLeft = rect.left;
        startTop = rect.top;
        
        isDragging = true;
        popup.style.position = 'fixed';
        popup.style.left = startLeft + 'px';
        popup.style.top = startTop + 'px';
        popup.style.right = 'auto';
        popup.style.bottom = 'auto';
    });
    
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        popup.style.left = (e.clientX - startX) + 'px';
        popup.style.top = (e.clientY - startY) + 'px';
    });
    
    window.addEventListener('mouseup', () => { isDragging = false; });
}

makeNotificationDraggable();

setTimeout(() => addTrackingToOkButtons(), 1000);

const retroPopup = document.getElementById('retroPopup');
const closePopupBtn98 = document.getElementById('closePopupBtn');
const gotItBtn = document.getElementById('gotItBtn');
const goModernBtn = document.getElementById('goModernBtn');

if (!sessionStorage.getItem('retroPopupShown')) {
    setTimeout(() => {
        if (retroPopup) retroPopup.classList.add('show');
    }, 500);
}

function closePopup98() {
    if (retroPopup) retroPopup.classList.remove('show');
    sessionStorage.setItem('retroPopupShown', 'true');
}

if (closePopupBtn98) closePopupBtn98.addEventListener('click', closePopup98);
if (gotItBtn) gotItBtn.addEventListener('click', closePopup98);

if (goModernBtn) {
    goModernBtn.addEventListener('click', () => {
        window.location.href = '/';
    });
}

if (retroPopup) {
    retroPopup.addEventListener('click', (e) => {
        if (e.target === retroPopup) closePopup98();
    });
}