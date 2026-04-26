
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

function setCurrentDate() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const today = new Date();
        const day = today.getDate().toString().padStart(2, '0');
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const year = today.getFullYear();
        dateElement.innerText = `${day}/${month}/${year}`;
    }
}

const repoOwner = 'lukzst';
const repoName = 'light';
const targetPath = 'FINAL';

async function fetchVersions() {
    const container = document.getElementById('version-container');
    if (!container) return;
    
    try {
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${targetPath}`);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        
        const folders = data.filter(item => {
            return item.type === 'dir' && 
                item.name !== 'BETA_V1.0' && 
                item.name !== 'OLD_V1.0.1' &&
                item.name !== 'BETA' &&
                !item.name.includes('BETA', 'OLD_V1.0.1');
        });
        
        if (folders.length === 0) {
            container.innerHTML = '<div class="error-message">No versions found yet. Check back soon!</div>';
            return;
        }
        
        container.innerHTML = '';
        
        folders.forEach(folder => {
            const card = document.createElement('div');
            card.className = 'version-card';
            card.onclick = () => {
                window.open(`https://github.com/${repoOwner}/${repoName}/tree/main/${targetPath}/${folder.name}`, '_blank');
            };
            
            card.innerHTML = `
                <h2>${folder.name.toUpperCase()}</h2>
                <p>Final build located in the repository. Click to access the files for this version.</p>
                <div class="explore-link">EXPLORE →</div>
            `;
            
            container.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error fetching versions:', error);
        container.innerHTML = '<div class="error-message">Unable to load versions. Please try again later.</div>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setCurrentDate();
    fetchVersions();
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