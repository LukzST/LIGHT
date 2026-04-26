function itch() {
    window.open('https://UndPixelGames.itch.io/light/purchase?popup=1', 'Popup', 'width=500,height=400,scrollbars=no');
}

function support() {
    window.open('mailto:contatosadberry@gmail.com', 'Popup', 'width=500,height=400,scrollbars=no');
}

function screenshot1() { 
    window.open("/Public/IMG/screen1.png", "screenshot1", "width=800,height=600,resizable=yes,scrollbars=yes"); 
}

function screenshot2() { 
    window.open("/Public/IMG/screen2.png", "screenshot2", "width=800,height=600,resizable=yes,scrollbars=yes"); 
}

function screenshot3() { 
    window.open("/Public/IMG/screen3.png", "screenshot3", "width=800,height=600,resizable=yes,scrollbars=yes"); 
}

function screenshot4() { 
    window.open("/Public/IMG/screen4.png", "screenshot4", "width=800,height=600,resizable=yes,scrollbars=yes"); 
}

const sidebar = document.getElementById('m3Sidebar');
const overlay = document.getElementById('sidebarOverlay');
const menuBtn = document.getElementById('menuButtonSide');

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

const sectionsMap = {
    home: document.getElementById('home-section'),
    about: document.getElementById('about-section'),
    media: document.getElementById('media-section'),
    download: document.getElementById('download-section'),
    demo: document.getElementById('demo-section'),
    devlogs: document.getElementById('devlogs-section'),
    brandkit: document.getElementById('brandkit-section')
};

function setActive(selectedId) {
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === selectedId) {
            item.classList.add('active');
        }
    });
}

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const href = item.getAttribute('href');
        const sectionId = item.getAttribute('data-section');
        
        if (href && href !== '#' && href !== '/' && href !== '') {
            closeSidebar();
            return;
        }
        
        e.preventDefault();
        
        if (sectionId && sectionsMap[sectionId]) {
            sectionsMap[sectionId].scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActive(sectionId);
            closeSidebar();
        }
        else if (href === '/' || href === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActive('home');
            closeSidebar();
        }
    });
});

const backBtn = document.getElementById('backToTopBtn');
if (backBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) backBtn.classList.add('visible');
        else backBtn.classList.remove('visible');
    });
    backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

const reveals = document.querySelectorAll('.reveal');
if (reveals.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { 
            if (e.isIntersecting) e.target.classList.add('revealed'); 
        });
    }, { threshold: 0.1 });
    reveals.forEach(r => observer.observe(r));
}

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeSidebar();
    }
});

function updateActiveFromHash() {
    const hash = window.location.hash;
    if (hash) {
        const sectionId = hash.replace('#', '');
        if (sectionsMap[sectionId]) {
            setActive(sectionId);
        } else {
            setActive('home');
        }
    } else {
        setActive('home');
    }
}

function openEmailPopup() {
    window.open('mailto:lucaseduarte6@gmail.com', '_blank', 'width=500,height=400,resizable=yes,scrollbars=yes');
}

updateActiveFromHash();

console.log(`%cLukzxdd%c
Welcome to a darkness world!`,'filter: invert(1); font-size: 28px; font-weight: bolder; font-family: "Rubik"; margin-top: 20px; margin-bottom: 8px;','color: #f76f53; font-size: 16px; font-family: "Rubik"; margin-bottom: 20px;');