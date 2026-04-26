const backToTop = document.getElementById('backToTop');
const sidebar = document.getElementById('m3Sidebar');
const overlay = document.getElementById('sidebarOverlay');
const menuBtn = document.getElementById('menuButtonSide');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');
const menuClose = document.getElementById('menuClose');
const menuToggle = document.getElementById('menuToggle');

if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
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

if (menuToggle) {
    function openMenu() {
        if (mobileMenu) mobileMenu.classList.add('open');
        if (menuOverlay) menuOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        if (mobileMenu) mobileMenu.classList.remove('open');
        if (menuOverlay) menuOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', openMenu);
    if (menuClose) menuClose.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);
}

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeSidebar();
    }
});

const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const href = item.getAttribute('href');
        if (href && href !== '#') {
            window.location.href = href;
        }
        closeSidebar();
    });
});

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('revealed');
    });
}, { threshold: 0.1 });
reveals.forEach(r => observer.observe(r));

function itch() {
    window.open('https://UndPixelGames.itch.io/light/purchase?popup=1', 'Popup', 'width=500,height=400,scrollbars=no');
}

function support() {
    window.open('mailto:contatosadberry@gmail.com', 'Popup', 'width=500,height=400,scrollbars=no');
}

function mudarPagina() {
    document.body.style.animation = 'none';
    document.body.offsetHeight;
    document.body.style.animation = 'fadeInPage 0.5s ease-out';
}

function downloadGameLogo(version) {
    if (version === 'light') {
        const link = document.createElement('a');
        link.href = '/Public/IMG/light_logo.png';
        link.download = 'game-logo-light.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else if (version === 'dark') {
        const img = document.getElementById('game-dark-img');
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        
        ctx.filter = 'invert(1)';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'game-logo-dark.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 'image/png');
    }
}

function downloadStudioLogo(version) {
    if (version === 'light') {
        const link = document.createElement('a');
        link.href = '/Public/IMG/studio-logo-without.png';
        link.download = 'studio-logo-light.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else if (version === 'dark') {
        const img = document.getElementById('studio-dark-img');
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        
        ctx.filter = 'invert(1)';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'studio-logo-dark.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 'image/png');
    }
}

function downloadAllAssets() {
    alert('Full package will be available soon!');
}

function checkTypographyOverflow() {
    const containers = document.querySelectorAll('.font-demo, .font-demo-junicode');
    
    containers.forEach(container => {
        const paragraphs = container.querySelectorAll('p');
        
        paragraphs.forEach(p => {
            if (p.scrollWidth > p.clientWidth) {
                p.style.overflow = 'hidden';
                p.style.textOverflow = 'ellipsis';
                p.style.whiteSpace = 'nowrap';
            } else {
                p.style.whiteSpace = 'normal';
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', checkTypographyOverflow);
window.addEventListener('resize', checkTypographyOverflow);

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInPage {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);