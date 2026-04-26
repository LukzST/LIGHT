const backToTop = document.getElementById("backToTopBtn");
const sidebar = document.getElementById('m3Sidebar');
const overlay = document.getElementById('sidebarOverlay');
const menuBtn = document.getElementById('menuButtonSide');

if (backToTop) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 500) {
            backToTop.classList.add("visible");
        } else {
            backToTop.classList.remove("visible");
        }
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
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

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeSidebar();
    }
});

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('revealed');
    });
}, { threshold: 0.1 });
reveals.forEach(r => observer.observe(r));

const repoOwner = "lukzst";
const repoName = "light";
const targetPath = "FINAL";

const localVersions = [
    {
        name: "V1.02",
        date: "2026-03-31",
        body: "Added hidden terminal in SUBLEVEL 7 with Operator 06's final memory.\nAdded 4 lore files on desktop after beating the game.\nAdded 4 new achievements.\nFixed Portuguese translations.\nFixed mainBox is not defined error in memory sequence and adjusted choice box layout.\nAdded Operator 06 dialogue in SUBLEVEL 7 and moral choice before BALANCER.js in the core.\nAchievements now display correctly in main menu and TRUELIGHT unlocks after 24 achievements.",
        url: "https://github.com/LukzST/LIGHT/releases/tag/V1.02",
        download: "https://github.com/LukzST/LIGHT/releases/download/V1.02/LIGHT.zip"
    },
    {
        name: "V1.01",
        date: "2026-03-08",
        body: "Bug fixes patch\nLeave your feedback about the game!",
        url: "https://github.com/LukzST/LIGHT/releases/tag/V1.01",
        download: "https://github.com/LukzST/LIGHT/releases/download/V1.01/LIGHT.zip"
    },
    {
        name: "V1.0",
        date: "2026-02-10",
        body: "Official Launch\nLeave your feedback about the game!",
        url: "https://github.com/LukzST/LIGHT/releases/tag/V1.0",
        download: "https://github.com/LukzST/LIGHT/releases/download/V1.0/LIGHT.7z"
    }
];

function setCurrentDate() {
    const dateElement = document.getElementById("current-date");
    if (dateElement) {
        const today = new Date();
        const options = { day: "2-digit", month: "2-digit", year: "numeric" };
        dateElement.innerText = today.toLocaleDateString("pt-BR", options);
    }
}

function showRateLimitError(container, resetTime) {
    const resetDate = new Date(resetTime * 1000);
    const timeString = resetDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    container.innerHTML = `
    <div style="text-align: center; padding: 48px 24px; background: var(--md-sys-color-surface-container-low); border-radius: 28px; border: 1px solid var(--md-sys-color-outline-variant); max-width: 500px; margin: 0 auto;">
        <div style="width: 64px; height: 64px; background: rgba(255, 138, 122, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto;">
            <span class="material-symbols-rounded" style="font-size: 32px; color: var(--md-expressive-coral);">hourglass_empty</span>
        </div>
        <h3 style="font-family: var(--md-font-display); font-size: 1.5rem; font-weight: 600; margin-bottom: 12px;">Rate Limit Exceeded</h3>
        <p style="color: var(--md-sys-color-on-surface-variant); margin-bottom: 16px;">The GitHub API limit has been reached. Too many requests in a short period.</p>
        <div style="background: rgba(255, 138, 122, 0.08); border-radius: 20px; padding: 16px; margin: 20px 0;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 8px;">
                <span class="material-symbols-rounded" style="color: var(--md-expressive-coral);">schedule</span>
                <span style="font-weight: 600;">Resets at: ${timeString}</span>
            </div>
            <div style="height: 4px; background: var(--md-sys-color-outline-variant); border-radius: 2px; overflow: hidden; margin-top: 12px;">
                <div id="rate-limit-progress" style="width: 0%; height: 100%; background: var(--md-expressive-coral); transition: width 1s linear;"></div>
            </div>
        </div>
        <p style="font-size: 0.75rem; color: var(--md-sys-color-on-surface-variant); margin-bottom: 24px;">The limit resets automatically after 1 hour. Showing cached versions below.</p>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 16px;">
            <button onclick="location.reload()" class="btn-filled" style="display: inline-flex; align-items: center; gap: 8px;">
                <span class="material-symbols-rounded" style="font-size: 18px;">refresh</span>
                Try Again
            </button>
            <a href="https://github.com/${repoOwner}/${repoName}/releases" target="_blank" class="btn-outlined" style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">
                <span class="material-symbols-rounded" style="font-size: 18px;">open_in_new</span>
                View on GitHub
            </a>
        </div>
    </div>
    <!-- <div id="fallback-versions" style="margin-top: 32px;"></div> -->
`;
    
    if (resetTime) {
        const updateProgress = () => {
            const now = Math.floor(Date.now() / 1000);
            const remaining = Math.max(0, resetTime - now);
            const total = 3600;
            const percent = ((total - remaining) / total) * 100;
            const progressBar = document.getElementById('rate-limit-progress');
            if (progressBar) progressBar.style.width = `${Math.min(100, percent)}%`;
        };
        updateProgress();
        const interval = setInterval(updateProgress, 1000);
        setTimeout(() => clearInterval(interval), 3600000);
    }
    
    renderLocalVersions(document.getElementById('fallback-versions'));
}

function renderLocalVersions(container) {
    if (!container) return;
    container.innerHTML = '';
    
    localVersions.forEach(version => {
        const changes = parseDescription(version.body);
        const releaseDate = formatDate(version.date);
        
        const card = document.createElement("div");
        card.className = "version-card reveal";
        card.style.marginBottom = "24px";
        
        card.innerHTML = `
            <div class="version-header">
                <div class="version-name">
                    <span class="material-symbols-rounded">new_releases</span>
                    ${version.name.toUpperCase()}
                </div>
                <div class="version-date">
                    <span class="material-symbols-rounded">calendar_today</span>
                    ${releaseDate}
                </div>
            </div>
            <div class="version-content">
                ${changes.length > 0 ? `
                    <ul class="version-changes">
                        ${changes.map(change => `
                            <li>
                                <span class="change-icon ${change.type}">${getChangeIcon(change.type)}</span>
                                <span class="change-text">${change.text}</span>
                            </li>
                        `).join('')}
                    </ul>
                ` : ''}
            </div>
            <div class="version-footer">
                <a href="${version.url}" target="_blank" class="btn-filled">
                    <span class="material-symbols-rounded">download</span>
                    View Release
                    <span class="material-symbols-rounded">arrow_forward</span>
                </a>
                <a href="${version.download}" target="_blank" class="btn-outlined" style="text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
                    <span class="material-symbols-rounded">file_download</span>
                    Download
                </a>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    const newReveals = document.querySelectorAll('.reveal:not(.revealed)');
    newReveals.forEach(r => observer.observe(r));
}

async function checkRateLimit() {
    try {
        const res = await fetch('https://api.github.com/rate_limit');
        const data = await res.json();
        return {
            remaining: data.resources.core.remaining,
            reset: data.resources.core.reset,
            limit: data.resources.core.limit
        };
    } catch (e) {
        return null;
    }
}

async function fetchVersions() {
    const container = document.getElementById("version-container");
    if (!container) return;

    container.innerHTML = '<div class="loader-wrapper"><div class="loader"></div></div>';

    try {
        const [repoRes, releasesRes] = await Promise.all([
            fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${targetPath}`),
            fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/releases`),
        ]);

        if (repoRes.status === 403 || releasesRes.status === 403) {
            const rateLimit = await checkRateLimit();
            if (rateLimit && rateLimit.remaining === 0) {
                showRateLimitError(container, rateLimit.reset);
                return;
            }
            throw new Error('API request failed');
        }

        if (!repoRes.ok || !releasesRes.ok) {
            throw new Error(`HTTP error: ${repoRes.status} ${releasesRes.status}`);
        }

        const folderData = await repoRes.json();
        const releases = await releasesRes.json();

        if (!Array.isArray(folderData)) {
            throw new Error('Invalid folder data');
        }

        const folders = folderData.filter((item) => {
            return (
                item.type === "dir" &&
                !["BETA", "OLD_V1.0.1"].includes(item.name) &&
                !item.name.includes("BETA") &&
                !item.name.includes("OLD_V1.0.1")
            );
        });

        if (folders.length === 0) {
            renderLocalVersions(container);
            return;
        }

        folders.sort((a, b) =>
            a.name.localeCompare(b.name, undefined, {
                numeric: true,
                sensitivity: "base",
            })
        );
        folders.reverse();

        container.innerHTML = "";

        folders.forEach((folder) => {
            const releaseInfo = releases.find(
                (r) => r.tag_name === folder.name || r.name === folder.name
            );

            const githubDescription = releaseInfo ? releaseInfo.body : "No description provided in GitHub release.";
            const changes = parseDescription(githubDescription);
            const releaseDate = releaseInfo ? formatDate(releaseInfo.published_at) : "Development";

            const card = document.createElement("div");
            card.className = "version-card reveal";

            card.innerHTML = `
                <div class="version-header">
                    <div class="version-name">
                        <span class="material-symbols-rounded">new_releases</span>
                        ${folder.name.toUpperCase()}
                    </div>
                    <div class="version-date">
                        <span class="material-symbols-rounded">calendar_today</span>
                        ${releaseDate}
                    </div>
                </div>
                <div class="version-content">
                    ${changes.length > 0 ? `
                        <ul class="version-changes">
                            ${changes.map(change => `
                                <li>
                                    <span class="change-icon ${change.type}">${getChangeIcon(change.type)}</span>
                                    <span class="change-text">${change.text}</span>
                                </li>
                            `).join('')}
                        </ul>
                    ` : ''}
                </div>
                <div class="version-footer">
                    ${releaseInfo ? `
                        <a href="${releaseInfo.html_url}" target="_blank" rel="noopener noreferrer" class="btn-filled">
                            <span class="material-symbols-rounded">download</span>
                            Download Release
                        </a>
                    ` : `
                        <a href="https://github.com/${repoOwner}/${repoName}/tree/main/${targetPath}/${folder.name}" 
                           target="_blank" rel="noopener noreferrer" class="btn-filled">
                            <span class="material-symbols-rounded">folder_open</span>
                            View in Repository
                        </a>
                    `}
                    <a href="https://github.com/${repoOwner}/${repoName}/releases" target="_blank" rel="noopener noreferrer" style="display:flex; justify-content: center; align-items: center;" class="btn-outlined">
                        <span class="material-symbols-rounded">history</span>
                        <p style=" margin-left: 8px;">All Releases</p>
                    </a>
                </div>
            `;

            container.appendChild(card);
        });

        const newReveals = document.querySelectorAll('.reveal:not(.revealed)');
        newReveals.forEach(r => observer.observe(r));

    } catch (error) {
        console.error("Error fetching versions:", error);
        renderLocalVersions(container);
        
        const warning = document.createElement('div');
        warning.style.cssText = 'text-align: center; margin-bottom: 24px; padding: 12px; background: rgba(255, 138, 122, 0.08); border-radius: 16px;';
        warning.innerHTML = `
            <span class="material-symbols-rounded" style="font-size: 16px; color: var(--md-expressive-coral); vertical-align: middle;">info</span>
            <span style="font-size: 0.75rem; color: var(--md-sys-color-on-surface-variant); margin-left: 8px;">Using cached versions. GitHub API temporarily unavailable.</span>
        `;
        container.insertBefore(warning, container.firstChild);
    }
}

function parseDescription(description) {
    const changes = [];
    if (!description) return changes;

    const lines = description.split('\n');
    const changeTypes = {
        added: ['added', 'add', 'new', '+'],
        fixed: ['fixed', 'fix', 'bugfix', 'patch', 'resolve'],
        improved: ['improved', 'improve', 'update', 'enhance', 'optimize'],
        removed: ['removed', 'remove', 'delete', '-']
    };

    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('#') || trimmedLine.startsWith('*') && trimmedLine.length < 5) return;

        let type = 'improved';
        const lowerLine = trimmedLine.toLowerCase();

        for (const [key, keywords] of Object.entries(changeTypes)) {
            if (keywords.some(kw => lowerLine.includes(kw))) {
                type = key;
                break;
            }
        }

        let cleanText = trimmedLine
            .replace(/^[•\-\*\d\.\s]+/, '')
            .replace(/^added:|fixed:|improved:|removed:/i, '')
            .trim();

        if (cleanText && cleanText.length > 3) {
            changes.push({ type, text: cleanText });
        }
    });

    return changes.slice(0, 8);
}

function getChangeIcon(type) {
    switch (type) {
        case 'added':
            return '<i class="fa-solid fa-check-circle" style="color: #ff8a7a;"></i>';
        case 'fixed':
            return '<i class="fa-solid fa-bug" style="color: #ff8a7a;"></i>';
        case 'improved':
            return '<i class="fa-solid fa-bolt" style="color: #ff8a7a;"></i>';
        case 'removed':
            return '<i class="fa-solid fa-times-circle" style="color: #ff8a7a;"></i>';
        default:
            return '<i class="fa-solid fa-pen" style="color: var(--md-expressive-coral);"></i>';
    }
}

function formatDescription(description) {
    if (!description) return 'No description available.';
    
    const lines = description.split('\n');
    let summary = '';
    
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('-') && !trimmed.startsWith('*') && !trimmed.startsWith('#')) {
            summary = trimmed;
            break;
        }
    }
    
    if (!summary && lines.length > 0) {
        summary = lines[0].trim().replace(/^[•\-\*\d\.\s]+/, '');
    }
    
    return summary || 'Check the release notes on GitHub for more details.';
}

function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function support() {
    window.location.href = "mailto:contatosadberry@gmail.com";
}

document.addEventListener("DOMContentLoaded", () => {
    setCurrentDate();
    fetchVersions();
});

