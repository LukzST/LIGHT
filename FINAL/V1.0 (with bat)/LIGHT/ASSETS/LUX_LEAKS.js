const blessed = require('blessed');
const fs = require('fs');
const path = require('path');
const os = require('os');

const screen = blessed.screen({ 
    smartCSR: true, 
    title: 'LUX-4_INTERNAL_FILES_REDACTED' 
});

const ACHIEVEMENT_NAMES = {
    'PACPRO': 'ELITE OPERATOR',
    'THE_END': 'LIGHT BRINGER',
    'NEVERMISS': 'NEVER BE LATE',
    'OVERRIDE': 'SYSTEM HACKER',
    'REBEL_PATH': 'HELLO, REBEL',
    'CEO_CONFRONT': 'DIRECTOR’S CUT',
    'TRUTH_SEEKER': 'DECRYPTOR',
    'RADIO_LISTENER': 'STATIC VOICES',
    'GHOST_GUARDIAN': 'DIGITAL SHEPHERD',
    'NEW_GOD': 'ELECTRONIC ASCENSION',
    'SHADOW_FALL': 'CORE MELTDOWN',
    'CITY_DARK': 'TOTAL BLACKOUT',
    'SLOWTYPIST': 'SLOW TYPIST',
    'LEAK_SAVED': 'WHISTLEBLOWER'
};

function showAchievementToast(id) {
    const name = ACHIEVEMENT_NAMES[id] || id;
    
    const toast = blessed.box({
        parent: screen,
        top: 2,
        right: 2,
        width: 35,
        height: 5,
        border: 'line',
        tags: true,
        content: `{center}{yellow-fg}{bold}ACHIEVEMENT UNLOCKED{/}\n{white-fg}${name}{/center}`,
        style: {
            border: { fg: 'yellow' },
            bg: 'black'
        }
    });

    // --- GARANTE O TOPO ABSOLUTO ---
    toast.setIndex(100); 
    
    screen.render();

    setTimeout(() => {
        toast.destroy();
        screen.render();
    }, 5000);
}

// Monitora a pasta por novos arquivos .ach
function watchAchievements() {
    const achDir = path.join(__dirname, '..', 'ACHIEVEMENTS');
    
    // Garante que a pasta existe para não dar erro no watch
    if (!fs.existsSync(achDir)) {
        fs.mkdirSync(achDir, { recursive: true });
    }

    fs.watch(achDir, (eventType, filename) => {
        if (eventType === 'rename' && filename && filename.endsWith('.ach')) {
            const filePath = path.join(achDir, filename);
            
            // Se o arquivo foi criado (e não deletado)
            if (fs.existsSync(filePath)) {
                const achId = filename.replace('.ach', '');
                showAchievementToast(achId);
            }
        }
    });
}

// Inicia o monitoramento


async function typeWriter(box, text, delay = 30) {
    return new Promise((resolve) => {
        let i = 0;
        box.content = '';
        const interval = setInterval(() => {
            box.content += text[i];
            screen.render();
            i++;
            if (i === text.length) {
                clearInterval(interval);
                resolve();
            }
        }, delay);
    });
}

const logBox = blessed.box({
    parent: screen, 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%',
    style: { fg: 'white', bg: 'black' },
    scrollable: true, 
    alwaysScroll: true,
    tags: true, 
    border: { type: 'line', fg: 'red' },
    label: ' CLASSIFIED: PROJECT FADE (1999) '
});

const leakText = `
{red-fg}LUX-4 ENERGY CORP - INTERNAL AUDIT - OCTOBER 1999{/red-fg}
--------------------------------------------------
{bold}SUBJECT:{/bold} Artificial Energy Scarcity via "The Fade" Protocol.

{bold}EXECUTIVE SUMMARY:{/bold}
The "Fade" was not an accident. It was a calculated release of high-frequency
necro-static into the city grid. 

{bold}THE STRATEGY:{/bold}
1. Create a global panic where electricity itself feels "haunted" and unstable.
2. Market the LUX-4 "Anti-Fade Shielding" as the only solution for survival.
3. Subscription-based life. To have light is to pay LUX-4. Forever.

{bold}CASUALTIES:{/bold}
Approx. 450,000 citizens "digitally evaporated" during the first pulse. 
Their neural patterns are currently being used as {yellow-fg}Processing Power{/yellow-fg} 
for our mainframes. 

{bold}CONCLUSION:{/bold}
The experiment was a total success. Profit margins increased by 4,000%.
The souls in the grid are stable batteries.

[END OF FILE]
--------------------------------------------------
{center}PRESS [S] TO EXPORT DATA TO DESKTOP | PRESS [ESC] TO EXIT{/center}
`;

logBox.setContent(leakText);

// --- SAVE ACTION ---
screen.key(['s'], () => {
        if (!fs.existsSync('../ACHIEVEMENTS/LEAK_SAVED.ACH')) {
                showAchievementToast('WHISTLEBLOWER')
                fs.writeFileSync('../ACHIEVEMENTS/LEAK_SAVED.ACH', 'COMPLETED')
            }

    const desktop = path.join(os.homedir(), 'Desktop', 'LUX_CONFIDENTIAL_LEAK.txt');
    
    // Formatting the plain text for the .txt file
    const fileContent = `LUX-4 INTERNAL AUDIT - PROJECT FADE (1999)
--------------------------------------------------
The Fade was a calculated release of necro-static. 
450,000 citizens used as processing power.
Goal: Market digital dependency as the only survival.

[SYSTEM-LOG]: USE THE FOLLOWING KEY FOR ADMINISTRATIVE OVERRIDE.
[SECURITY-CODE-ALTERNATIVE]: LUX4LIFE
--------------------------------------------------`;
    
    try {
        fs.writeFileSync(desktop, fileContent);
        
        // Visual feedback inside the terminal
        logBox.setContent(leakText + "\n\n{yellow-fg}DATA EXPORTED TO DESKTOP. DISCONNECT TO PROCEED.{/yellow-fg}");
        screen.render();
    } catch (e) {
        // Silent fail
    }
});

// --- EXIT ACTION ---
screen.key(['escape', 'q', 'C-c'], () => {
    process.exit(0);
});

screen.render();