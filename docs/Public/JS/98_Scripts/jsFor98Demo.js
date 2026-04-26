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
const shutdownBtn = document.getElementById('shutdownBtn');
const shutdownOverlay = document.getElementById('shutdownOverlay');
const shutdownDots = document.getElementById('shutdownDots');
const shutdownMessage = document.querySelector('.shutdown-message p');

let dotCount = 0;
let isShuttingDown = false;

function animateShutdownDots() {
    const interval = setInterval(() => {
        if (!isShuttingDown) {
            clearInterval(interval);
            return;
        }
        dotCount = (dotCount + 1) % 4;
        const dots = '.'.repeat(dotCount);
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