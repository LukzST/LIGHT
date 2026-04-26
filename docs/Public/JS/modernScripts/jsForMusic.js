const backToTop = document.getElementById('backToTopBtn');
const sidebar = document.getElementById('m3Sidebar');
const overlay = document.getElementById('sidebarOverlay');
const menuBtn = document.getElementById('menuButtonSide');

if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function openSidebar() {
    if (window.innerWidth <= 768) {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (menuBtn) menuBtn.addEventListener('click', openSidebar);
if (overlay) overlay.addEventListener('click', closeSidebar);

const navItems = document.querySelectorAll('.nav-item');
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const href = item.getAttribute('href');
        if (href && href !== '#' && href !== '/') {
            window.location.href = href;
            closeSidebar();
        }
    });
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeSidebar();
    }
});

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); });
}, { threshold: 0.1 });
reveals.forEach(r => observer.observe(r));

function openYouTubePopup(url, trackName) {
    const width = 800;
    const height = 500;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    
    const popup = window.open(
        url,
        trackName.replace(/\s/g, '_'),
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,toolbar=no,location=no`
    );
    
    if (popup) {
        popup.focus();
    } else {
        alert('Please allow popups for this site to open the YouTube player.\n\nYou can also open the link directly:\n' + url);
    }
}

function downloadSoundtrack() {
    alert('The complete LIGHT soundtrack will be available for download soon! Stay tuned.');
}

function itch() {
    window.open('https://UndPixelGames.itch.io/light/purchase?popup=1', 'Popup', 'width=500,height=400,scrollbars=no');
}

function support() {
    window.open('mailto:contatosadberry@gmail.com', 'Popup', 'width=500,height=400,scrollbars=no');
}

console.log(`%cLIGHT Soundtrack%c
Complete Game Soundtrack - 4 tracks of atmospheric horror music
- The Fade
- The Birth of Light  
- The True Light
- The Last Choice`,'filter: invert(1); font-size: 28px; font-weight: bolder; font-family: "Rubik";','color: #f76f53; font-size: 16px; font-family: "Rubik";');