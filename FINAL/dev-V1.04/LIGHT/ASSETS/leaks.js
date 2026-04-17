const blessed = require('blessed');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { t } = require('./translate.js');

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
        content: t('LUX_L_ACHIEVEMENT_TOAST', { name }),
        style: {
            border: { fg: 'yellow' },
            bg: 'black'
        }
    });

    toast.setIndex(100); 
    
    screen.render();

    setTimeout(() => {
        toast.destroy();
        screen.render();
    }, 5000);
}

function watchAchievements() {
    const achDir = path.join(__dirname, '..', 'ACHIEVEMENTS');
    
    if (!fs.existsSync(achDir)) {
        fs.mkdirSync(achDir, { recursive: true });
    }

    fs.watch(achDir, (eventType, filename) => {
        if (eventType === 'rename' && filename && filename.endsWith('.ach')) {
            const filePath = path.join(achDir, filename);
            
            if (fs.existsSync(filePath)) {
                const achId = filename.replace('.ach', '');
                showAchievementToast(achId);
            }
        }
    });
}

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
    label: t('LUX_L_TITLE')
});

logBox.setContent(t('LUX_L_CONTENT'));

screen.key(['s'], () => {
    if (!fs.existsSync('../ACHIEVEMENTS/LEAK_SAVED.ACH')) {
        showAchievementToast('WHISTLEBLOWER');
        fs.writeFileSync('../ACHIEVEMENTS/LEAK_SAVED.ACH', 'COMPLETED');
    }

    const desktop = path.join(os.homedir(), 'Desktop', 'LUX_CONFIDENTIAL_LEAK.txt');
    
    const fileContent = t('LUX_L_EXPORT_FILE');
    
    try {
        fs.writeFileSync(desktop, fileContent);
        logBox.setContent(t('LUX_L_CONTENT') + t('LUX_L_EXPORTED'));
        screen.render();
    } catch (e) {}
});

screen.key(['escape', 'q', 'C-c'], () => {
    process.exit(0);
});

screen.render();