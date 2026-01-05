const blessed = require('blessed');
const os = require('os');
const { spawn } = require('child_process');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const achievements = fs.readdirSync('../Achievements').filter(f => f.endsWith('.bin')).length;
let dots = 0;
const key = 'lux1999files'
let hintDisplay = null; // Adicione isso perto das suas outras globais
let hintListWin = null
let colorCycles = 0; // Global
 let muteCount = 0; // Global
 let glitchCount = 0;
let infoAccessCount = 0;
let achScreenCount = 0;
let activeToasts = 0;
let settingsWin = null;
let isGalleryOpen = false;
let issettigsopen = false;
let iscreditsOpen = false;
let issupportOpen = false;
const LUX4_LOGO =
 "      :::        :::    ::: :::    :::\n" +
 "     :+:        :+:    :+: :+:    :+: \n" +
 "    +:+        +:+    +:+  +:+  +:+   \n" +
 "   +#+        +#+    +:+   +#++:+     \n" +
 "  +#+        +#+    +#+  +#+  +#+     \n" +
 " #+#        #+#    #+# #+#    #+#     \n" +
 "##########  ########  ###    ###      \n"
const ALL_ACHIEVEMENTS = [
 { id: 'PACPRO', name: 'ELITE OPERATOR', desc: 'Completed the PACPRO simulation.', hint: 'Survive the PACPRO sub-process in the elevator.' },
 { id: 'THE_END', name: 'LIGHT BRINGER', desc: 'Reached the final conclusion of LIGHT.', hint: 'Reach any of the final game endings.' },
 { id: 'NEVERMISS', name: 'NEVER BE LATE', desc: 'Complete tasks in under 2 seconds.', hint: 'Be extremely fast during the morning tasks.' },
 { id: 'OVERRIDE', name: 'SYSTEM HACKER', desc: 'Accessed restricted developer info.', hint: 'Use the developer code in System Info.' },
 { id: 'REBEL_PATH', name: 'HELLO, REBEL', desc: 'Used the administrative override.', hint: 'Input an alternative code in the office login terminal.' },
 { id: 'CEO_CONFRONT', name: 'DIRECTOR’S CUT', desc: 'Confronted the CEO.', hint: 'Take the secret route to the CEO office.' },
 { id: 'TRUTH_SEEKER', name: 'DECRYPTOR', desc: 'Decrypted Project Fade logs.', hint: 'Find and use the encryption key correctly.' },
 { id: 'RADIO_LISTENER', name: 'STATIC VOICES', desc: 'Listened to the radio report.', hint: 'Choose to listen to the radio in the elevator.' },
 { id: 'GHOST_GUARDIAN', name: 'DIGITAL SHEPHERD', desc: 'Stabilized the Fade.', hint: 'Choose to protect the souls in the final core.' },
 { id: 'SLOWTYPIST', name: 'SLOW TYPIST', desc: 'Failed to cancel the SELF-DESTRUCT', hint: 'Let the timer reach zero during the Sublevel 7 security override.' },
 { id: 'SHADOW_FALL', name: 'CORE MELTDOWN', desc: 'The core was destroyed due to stabilization failure.', hint: 'Fail to maintain the balance during the final core sequence.' },
 { id: 'LEAK_SAVED', name: 'WHISTLEBLOWER', desc: 'Exported confidential files.', hint: 'Press [S] during the data leak phase.' },
 { id: 'TRUELIGHT', name: 'THE TRUE LIGHT', desc: 'Unlock all achievements.', hint: 'Unlock everything and return to the Achievements section.' },
 { id: 'AUDIOPHOBIC', name: 'AUDIOPHOBIC', desc: 'Disable the audio system 5 times during your session.', hint: 'Acoustic input can be overwhelming for some operators.' },
 { id: 'COLOR_MASTER', name: 'SPECTRUM ANALYST', desc: 'Cycle through all system colors 5 times in a single session.', hint: 'The [C] key holds the power of the visible spectrum.' },
 { id: 'DATA_MINER', name: 'DATA MINER', desc: 'Access the System Info panel 10 times in a single session.', hint: 'Obsession with data is a requirement for this position.' },
 { id: 'GLITCH_ADDICT', name: 'GLITCH ADDICT', desc: 'Toggle the Glitch effect 10 times.', hint: 'Do you prefer the broken reality or the fake stability?' },
 { id: 'TERMINAL_JUNKIE', name: 'TERMINAL JUNKIE', desc: 'Enter and exit the Achievements screen 5 times.', hint: 'Checking your progress won’t make it go faster.' },
 { id: 'HARD_RESET', name: 'FRESH START', desc: 'Use the Reset to Defaults option in Settings.', hint: 'Wipe the slate clean. Forget the errors of the past.' },
 ];
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
 'SHADOW_FALL': 'CORE MELTDOWN',
 'SLOWTYPIST': 'SLOW TYPIST',
 'LEAK_SAVED': 'WHISTLEBLOWER',
 'TRUELIGHT': 'THE TRUE LIGHT',
 'AUDIOPHOBIC': 'AUDIOPHOBIC',
 'COLOR_MASTER': 'SPECTRUM ANALYST',
 'DATA_MINER': 'DATA MINER',
 'GLITCH_ADDICT': 'GLITCH ADDICT',
 'TERMINAL_JUNKIE': 'TERMINAL JUNKIE',
 'HARD_RESET': 'FRESH START'
};

const ALL_STAGES = [
    { id: 'START_NARRATIVE', name: 'APARTMENT', desc: 'The fading reality begins.' },
    { id: 'OFFICE_CHAOS', name: 'LUX-4 HQ', desc: 'Chaos in the workspace.' },
    { id: 'POWER_ACTIVE', name: 'POWER ROOM', desc: 'System energy restored.' },
    { id: 'SUBLEVEL_7', name: 'R&D SECTOR', desc: 'Deep within the mainframe.' },
    { id: 'CORE_FINAL', name: 'THE CORE', desc: 'Where the Fade resides.' }
];

const achPath = path.join(__dirname, '..', 'Achievements', 'PACPRO.ach');
    const hasPacAch = fs.existsSync(achPath);
    const pacSeenPath = '../CONFIG/PACPRO_SEEN.txt';
    const isNewPac = hasPacAch && !fs.existsSync(pacSeenPath);

function showAchievementToast(id) {
 const name = ACHIEVEMENT_NAMES[id] || id;
 const offset = 2 + (activeToasts * 6);
 const toast = blessed.box({
 parent: screen,
 top: offset,
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
 toast.setIndex(2000);
 activeToasts++;
 screen.render();
 setTimeout(() => {
 activeToasts--;
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
color = '#555555'
const isModernTerminal = process.argv.includes('--wt');
function startLogoAnimation() {
 setInterval(() => {
 if (GLITCH === 'ON' && Math.random() > 0.85) {
 const glitchContent = logoOriginal.replace(/█/g, (char) => {
 const rand = Math.random();
 if (rand > 0.98) return ' ';
 if (rand > 0.95) return '#';
 return char;
 });
 logoBox.setContent(glitchContent);
 logoBox.style.fg = 'white';
 } else {
 logoBox.setContent(logoOriginal);
 logoBox.style.fg = COLORDEFAULT;
 }
 screen.render();
 }, 150);
}
function initNormalMenu() {
 screen.append(logoBox);
 screen.append(menuBox);
 startLogoAnimation();
 mainList.focus();
 screen.render();
}
function startupSequence() {
 const roll = Math.random();
 if (roll <= 0.20) {
 
 const wasFocused = mainList.focused;
 
 mainList.detach();
 mainList.hide(); 
 menuBox.hide();    
 
 const easterEggBox = blessed.box({
 parent: screen,
 top: 'center',
 left: 'center',
 width: 'shrink',
 height: 'shrink',
 content: LUX4_LOGO,
 style: { fg: '#ffffff' },
 tags: true
 });
 
 descriptionBox.setContent('{bold}LUX-4 PRESENTS{/}');
 screen.render();
 
 setTimeout(() => {
 const glitchInterval = setInterval(() => {
 easterEggBox.setContent(LUX4_LOGO.replace(/[:+]/g, () => (Math.random() > 0.5 ? '?' : '#')));
 easterEggBox.style.fg = Math.random() > 0.5 ? 'red' : 'white';
 screen.render();
 }, 80);
 
 setTimeout(() => {
 clearInterval(glitchInterval);
 easterEggBox.destroy();
 
 menuBox.show();
 
 menuBox.append(mainList);
 mainList.show();
 
 if (wasFocused) {
 mainList.focus();
 }
 
 initNormalMenu();
 }, 1000);
 
 }, 1500);
 
 setTimeout(() => {
 descriptionBox.setContent('{bold}SELECT AN OPTION USING ARROW KEYS AND PRESS ENTER{/}')
 }, 2500);
 
 } else {
 initNormalMenu();
 }
}
const player = require('play-sound')({
 player: './SOUNDTRACK/VLC/cmdmp3.exe'
});
function fullscreen_pre_save() {
 if(FULLSCREEN === 'ON' && isModernTerminal) {
 const vbsPath = path.join(__dirname, 'toggle_fs.vbs');
 const BCT = `Set objShell = WScript.CreateObject("WScript.Shell")\nWScript.Sleep 100\nobjShell.SendKeys "{F11}"`;
 try {
 fs.writeFileSync(vbsPath, BCT);
 spawn('wscript.exe', [vbsPath]);
 } catch (err) {}
 } else {
 if (!isModernTerminal) FULLSCREEN = 'OFF';
 }
}


if (fs.existsSync('../CONFIG/TIME.txt')) {
    var timeRaw = fs.readFileSync('../CONFIG/TIME.txt', 'utf8').split('\n');
    var TIME_STATUS = timeRaw[0].trim();
    var TOTAL_PLAYTIME = parseInt(timeRaw[1]) || 0;
} else {
    var TIME_STATUS = 'ON';
    var TOTAL_PLAYTIME = 0;
    fs.writeFileSync('../CONFIG/TIME.txt', `${TIME_STATUS}\n${TOTAL_PLAYTIME}`, 'utf8');
}
if (fs.existsSync('../CONFIG/SIDEBAR.txt')) {
 var SIDEBAR = fs.readFileSync(path.join('../CONFIG/SIDEBAR.txt'), 'utf8').trim();
} else {
 var SIDEBAR = 'OFF';
 fs.writeFileSync('../CONFIG/SIDEBAR.txt', SIDEBAR, 'utf8');
}
if (fs.existsSync('../CONFIG/GLITCH.txt')) {
 var GLITCH = fs.readFileSync(path.join('../CONFIG/GLITCH.txt'), 'utf8').trim();
} else {
 var GLITCH = 'ON';
 fs.writeFileSync('../CONFIG/GLITCH.txt', GLITCH, 'utf8');
}
if (fs.existsSync('../CONFIG/FULLSCREEN.txt')) {
 var FULLSCREEN = fs.readFileSync(path.join('../CONFIG/FULLSCREEN.txt'), 'utf8').trim();
} else {
 var FULLSCREEN = 'OFF';
 fs.writeFileSync('../CONFIG/FULLSCREEN.txt', FULLSCREEN, 'utf8');
}
if (fs.existsSync('../CONFIG/AUDIOSTATE.txt')) {
 var audiostate = fs.readFileSync(path.join('../CONFIG/AUDIOSTATE.txt'), 'utf8')
} else {
 var audiostate = 'ON';
 fs.writeFileSync('../CONFIG/AUDIOSTATE.txt', audiostate, 'utf8');
}
if (fs.existsSync('../CONFIG/COLORDEFAULT.txt')) {
 var COLORNAME = fs.readFileSync(path.join('../CONFIG/COLORNAME.txt'), 'utf8').trim();
 var COLORDEFAULT = fs.readFileSync(path.join('../CONFIG/COLORDEFAULT.txt'), 'utf8').trim();
} else {
 var COLORNAME = 'RED';
 var COLORDEFAULT = '#ff0000';
 fs.writeFileSync('../CONFIG/COLORNAME.txt', COLORNAME, 'utf8');
 fs.writeFileSync('../CONFIG/COLORDEFAULT.txt', COLORDEFAULT, 'utf8');
}
if (fs.existsSync('../CONFIG/USER.txt')) {
 var USERNAMEP = fs.readFileSync(path.join('../CONFIG/USER.txt'), 'utf8').trim();
} else {
 var USERNAMEP = 'OPERATOR 07';
 fs.writeFileSync('../CONFIG/USER.txt', USERNAMEP, 'utf8');
}
if (fs.existsSync('../CONFIG/DIFFICULTY.txt')) {
 var DIFFICULTY = fs.readFileSync(path.join('../CONFIG/DIFFICULTY.txt'), 'utf8').trim();
} else {
 var DIFFICULTY = 'NORMAL';
 fs.writeFileSync('../CONFIG/DIFFICULTY.txt', DIFFICULTY, 'utf8');
}
let CANwin = 'OFF';
let vlcProcess = null;
const audioFile = './SOUNDTRACK/1.mp3';
const audioaa = './SOUNDTRACK/2.mp3';
let winVersion = os.release()
let userName = os.userInfo().username;
let friendlyName = 'Windows';
if (winVersion.startsWith('10.0.2')) friendlyName = 'Windows 11';
if (winVersion.startsWith('10.0.1')) friendlyName = 'Windows 10';
if (winVersion.startsWith('6.3')) friendlyName = 'Windows 8.1 - NOT SUPPORTED';
if (winVersion.startsWith('6.1')) friendlyName = 'Windows 7 - NOT SUPPORTED';
if (audiostate === 'ON') {
 vlcProcess = spawn('./SOUNDTRACK/VLC/vlc.exe', ['-I', 'dummy', '--loop', audioFile]);
 }
 fullscreen_pre_save();
const screen = blessed.screen({
 smartCSR: true,
 title: 'LIGHT',
 fullUnicode: true
});
function refreshMenu() {
    let items = ['{center}START MISSION{/center}'];

    if (hasPacAch) {
        if (isNewPac) {
            items.push('{center}{yellow-fg}PACPRO SUBSYSTEM (NEW){/yellow-fg}{/center}');
        } else {
            items.push('{center}{yellow-fg}PACPRO SUBSYSTEM{/yellow-fg}{/center}');
        }
    }

    items.push('{center}ACHIEVEMENTS{/center}');
    items.push('{center}CHECKPOINTS{/center}')
    items.push('{center}SETTINGS{/center}');

    if (TIME_STATUS === 'ON') {
        items.push('{center}{cyan-fg}RESET TIME{/cyan-fg}{/center}');
    }

    items = items.concat([
        '{center}ERASE DATA{/center}',
        '{center}SYSTEM INFO{/center}',
        '{center}CREDITS{/center}',
        '{center}SUPPORT{/center}',
        '{center}EXIT{/center}'
    ]);

    try {
        if (typeof mainList !== 'undefined' && mainList !== null) {
            mainList.setItems(items);
            screen.render();
        }
    } catch (e) {
    }
    
    return items; 
}
const logoOriginal =
 "███        ███  ████████  ███  ███  █████████\n" +
 "███        ███  ███  ███  ███  ███     ███\n" +
 "███        ███  ███       ███  ███     ███\n" +
 "███        ███  ███ ████  ████████     ███\n" +
 "███        ███  ███  ███  ███  ███     ███\n" +
 "███        ███  ███  ███  ███  ███     ███\n" +
 "███        ███  ███  ███  ███  ███     ███\n" +
 "█████████  ███  ████████  ███  ███     ███";
const logoGlitch = logoOriginal.replace(/█/g, (match) => (Math.random() > 0.95 ? '@' : match));
const logoText =
 "███        ███  ████████  ███  ███  █████████\n" +
 "███        ███  ███  ███  ███  ███     ███\n" +
 "███        ███  ███       ███  ███     ███\n" +
 "███        ███  ███ ████  ████████     ███\n" +
 "███        ███  ███  ███  ███  ███     ███\n" +
 "███        ███  ███  ███  ███  ███     ███\n" +
 "███        ███  ███  ███  ███  ███     ███\n" +
 "█████████  ███  ████████  ███  ███     ███";

 const logocredits =
 "███        ███  ████████  ███  ███  █████████\n" +
 "███        ███  ███  ███  ███  ███     ███   \n" +
 "███        ███  ███       ███  ███     ███   \n" +
 "███        ███  ███ ████  ████████     ███   \n" +
 "███        ███  ███  ███  ███  ███     ███   \n" +
 "███        ███  ███  ███  ███  ███     ███   \n" +
 "███        ███  ███  ███  ███  ███     ███   \n" +
 "  █████████  ███  ████████  ███  ███     ███     ";
const logoBox = blessed.box({
 top: 2,
 left: 'center',
 width: 'shrink',
 height: 8,
 content: logoText,
 style: { fg: COLORDEFAULT}
});
const menuBox = blessed.form({
 top: 11,
 left: 'center',
 width: 45,
 height: 15,
 tags: true,
 border: { type: 'line' },
 style: {
 border: { fg: '#555555' },
 bg: 'black'
 }
});
const mainList = blessed.list({
 parent: menuBox,
 tags: true,
 top: 1,
 left: 'center',
 width: '90%',
 height: '80%',
 keys: true,
 mouse: true,
 items: refreshMenu(),
 style: {
 selected: { bg: COLORDEFAULT, fg: 'white', bold: true },
 item: { fg: '#bbbbbb' }
 }
});
if (isNewPac) {
 fs.writeFileSync(pacSeenPath, 'SEEN', 'utf8');
}
mainList.on('select item', (item) => {
 const rawText = item.getText().replace(/{.*?}/g, '').trim();
 const desc = menuDescriptions[rawText] || 'SELECT AN OPTION USING ARROW KEYS AND PRESS ENTER';
 descriptionBox.setContent(`{bold}${desc.toUpperCase()}{/}`);
 screen.render();
});
const descriptionBox = blessed.box({
 parent: screen,
 bottom: 0,
 left: '0',
 width: '100%',
 tags: true,
 height: 1, 
 content: '{bold}SELECT AN OPTION USING ARROW KEYS AND PRESS ENTER{/}',
 style: {
 fg: color,
 }
});
const menuDescriptions = {
 'START MISSION': 'START THE PRIMARY OPERATIONAL PROTOCOL.',
 'PACPRO SUBSYSTEM': 'PLAY THE MINIGAME FROM THE ELEVATOR SEQUENCE.',
 'PACPRO SUBSYSTEM (NEW)': 'PLAY THE MINIGAME FROM THE ELEVATOR SEQUENCE.', // Descrição solicitada
 'ACHIEVEMENTS': 'SEE YOUR ACHIEVEMENTS',
 'CHECKPOINTS': 'SEE YOUR CHECKPOINTS',
 'SETTINGS': 'AUDIO, COLOR, USER AND FULL SCREEN CONFIGURATION.',
 'ERASE DATA': 'ERASE ALL LOCAL USER DATA AND SETTINGS.',
 'SYSTEM INFO': 'VIEW SYSTEM AND TERMINAL INFORMATION.',
 'CREDITS': 'INFORMATION ABOUT THE DEVELOPMENT TEAM.',
 'SUPPORT': 'HELP THE DEVELOPMENT OF LIGHT GAME.',
 'RESET TIME': 'PURGE CURRENT SESSION PLAYTIME AND RESET TEMPORAL VECTORS.',
 'EXIT': 'EXIT THE APPLICATION SAFELY. (DO NOT FORCE CLOSE)'
};
const copyrightBOX1 = blessed.box({
 parent: screen,
 bottom: 0,
 right: '0',
 width: 'shrink',
 height: 1,
 content: ' V1.0 ',
 tags: true,
 style: {
 fg: color,
 bold: true,
 },
});
function showAchievementPopup(achId) {
 const ach = ALL_ACHIEVEMENTS.find(a => a.id === achId);
 if (!ach) return;
 const popup = blessed.box({
 parent: screen,
 top: 'center',
 left: 'center',
 width: 45,
 height: 8,
 border: 'line',
 label: ' [ ACHIEVEMENT UNLOCKED ] ',
 tags: true,
 index: 1000, // Garante que fique no topo de tudo
 content: `{center}\n{yellow-fg}{bold}${ach.name}{/}\n\n${ach.desc}\n\nPRESS ENTER TO DISMISS{/}`,
 style: {
 border: { fg: 'yellow' },
 label: { fg: 'yellow', bold: true }
 }
 });
 popup.focus();
 screen.render();
 popup.key(['enter', 'escape', 'space'], () => {
 popup.destroy();
 screen.render();
 });
}
function confirmExit() {
 const bgOverlay = blessed.box({
 parent: screen,
 top: 0,
 left: 0,
 width: '100%',
 height: '100%',
 tags: true,
 style: {
 bg: 'black',
 transparent: false
 }
 });
 bgOverlay.setIndex(200);
 const confirmWin = blessed.list({
 parent: bgOverlay,
 top: 'center',
 left: 'center',
 width: 40,
 height: 10,
 border: 'line',
 label: ' [ EXIT ] ',
 keys: true,
 tags: true,
 items: [
 '{center}YES{/center}',
 '{center}NO{/center}'
 ],
 selected: 0,
 style: {
 border: { fg: COLORDEFAULT },
 selected: { bg: COLORDEFAULT, fg: 'white', bold: true }
 }
 });
 confirmWin.focus();
 confirmWin.select(0);
 screen.render();
 confirmWin.on('select', (item) => {
 const txt = item.getText();
 if (txt.includes('YES')) {
 process.exit(0);
 }
 if (txt.includes('NO')) {
 bgOverlay.destroy();
 mainList.focus();
 screen.render();
 }
 });
 screen.key(['escape'], function handleEsc() {
 bgOverlay.destroy();
 mainList.focus();
 screen.unkey('escape', handleEsc);
 screen.render();
 });
}
function credits() {
    if (audiostate === 'ON') {
        stopAudio()
    }
    
    iscreditsOpen = true;
    const currentYear = new Date().getFullYear();

    const bgOverlay = blessed.box({
        parent: screen,
        top: 0, left: 0,
        width: '100%', height: '100%',
        style: { bg: 'black' },
        index: 100
    });

    const displayBox = blessed.box({
        parent: bgOverlay,
        top: 'center', left: 'center',
        width: '80%', height: 10,
        tags: true,
        content: "",
        style: { fg: 'white' }
    });

    // Blocos de crédito (Cada um durará 10 segundos)
    const slides = [
        `{center}{bold}${logocredits}{/bold}\n\nA TERMINAL HORROR GAME{/center}`,

        `{center}{yellow-fg}AN ORIGINAL STORY BY{/yellow-fg}\n\n{bold}PALE LUNA DEVELOPER{/bold}{/center}`,
        
        `{center}{yellow-fg}DIRECTOR{/yellow-fg}\n\n{bold}LUCAS EDUARDO{/bold}{/center}`,
        
        `{center}{yellow-fg}MAIN PROGRAMMER{/yellow-fg}\n\n{bold}LUCAS EDUARDO{/bold}{/center}`,
        
        `{center}{yellow-fg}EVENT PROGRAMMER{/yellow-fg}\n\n{bold}LUCAS EDUARDO{/bold}{/center}`,

        `{center}{yellow-fg}GRAPHICS{/yellow-fg}\n\n{bold}LUCAS EDUARDO{/bold}{/center}`,

        `{center}{yellow-fg}LEVEL DESIGN{/yellow-fg}\n\n{bold}ISABELLA SANCHES{/bold}{/center}`,

        `{center}{yellow-fg}STORY DESIGNER{/yellow-fg}\n\n{bold}LUCAS EDUARDO{/bold}{/center}`,
        
        `{center}{yellow-fg}SOUND DESIGN{/yellow-fg}\n\n{bold}LUCAS EDUARDO\nISABELLA SANCHES{/bold}{/center}`,
        
        `{center}{yellow-fg}UI/UX ART & QUALITY ASSURANCE{/yellow-fg}\n\n{bold}LUIZ OTAVIO{/bold}{/center}`,
        
        `{center}{yellow-fg}ENDING THEME{/yellow-fg}\n\n{bold}SUBNAUTICA - ALEXUPLAY{/bold}{/center}`,

        `{center}{yellow-fg}PUBLICITY{/yellow-fg}\n\n{bold}PALE LUNA DEVELOPER{/bold}{/center}`,
        
        `{center}{yellow-fg}BETA TESTER{/yellow-fg}\n\n{bold}LUCAS EDUARDO, ISABELLA SANCHES, LUIZ OTÁVIO and some friends{/bold}{/center}`,

        `{center}{yellow-fg}PRODUCT COORDINATOR{/yellow-fg}\n\n{bold}LUCAS EDUARDO{/bold}{/center}`,

        `{center}{yellow-fg}THANKS FOR PLAYING{/yellow-fg}`,

        `{center}CREATED FOR THE FADE\n\n${currentYear} © ALL RIGHTS RESERVED{/center}`
    ];

    let currentSlide = 0;

    // Container de opções (escondido até o fim)
    const optionsContainer = blessed.box({
        parent: bgOverlay,
        bottom: 5, left: 'center',
        width: 60, height: 3,
        hidden: true
    });

    const btnTwitter = blessed.button({
        parent: optionsContainer,
        left: 0, width: 25, height: 3,
        content: '{center}TWITTER (X){/center}',
        border: 'line', tags: true,
        style: { border: { fg: 'cyan' }, focus: { bg: 'cyan', fg: 'black' } }
    });

    const btnClose = blessed.button({
        parent: optionsContainer,
        right: 0, width: 25, height: 3,
        content: '{center}CLOSE{/center}',
        border: 'line', tags: true,
        style: { border: { fg: 'red' }, focus: { bg: 'red', fg: 'white' } }
    });

    function showNextSlide() {
        if (!iscreditsOpen) return;

        if (currentSlide < slides.length) {
            // Efeito simples de "piscar" ao trocar
            displayBox.setContent("");
            screen.render();

            setTimeout(() => {
                displayBox.setContent(slides[currentSlide]);
                currentSlide++;
                screen.render();
                
               
                setTimeout(showNextSlide, 5500); 
            }, 900);
        } else {
            stopcreditsaudio()
            displayBox.setContent("{center}{bold}WHAT YOU GONNA DO?.{/bold}{/center}");
            optionsContainer.show();
            btnTwitter.focus();
            screen.render();
        }
    }

    // Inicia a sequência
    setTimeout(() => {
        if (iscreditsOpen) playcreditsaudio();
    }, 200);
    showNextSlide();

    // Funções de saída
    const closeCredits = () => {
        stopcreditsaudio()
        iscreditsOpen = false;
        bgOverlay.destroy();
        mainList.focus();
        screen.render();
        if (audiostate === 'ON') {
        playAudio()
    }
        
    };
    
    

    btnTwitter.on('press', () => exec('start https://twitter.com/PlayLightGame'));
    btnClose.on('press', closeCredits);
    screen.onceKey(['escape'], closeCredits);

    btnTwitter.key(['right', 'tab'], () => btnClose.focus());
    btnClose.key(['left', 'tab'], () => btnTwitter.focus());

    screen.render();
}
function eraseData() {
 const bg1Overlay = blessed.box({
 parent: screen,
 top: 0,
 left: 0,
 width: '100%',
 height: '100%',
 style: { bg: 'black' }
 });
 const eraseWin = blessed.list({
 parent: bg1Overlay,
 top: 'center',
 left: 'center',
 width: 40,
 height: 10,
 border: 'line',
 label: ' [ ERASE DATA ] ',
 keys: true,
 items: [' YES ', ' NO '],
 selected: 0,
 style: {
 border: { fg: COLORDEFAULT },
 selected: { bg: COLORDEFAULT, fg: 'white', bold: true }
 }
 });
 eraseWin.focus();
 screen.render();
 eraseWin.on('select', (item) => {
 const txt = item.getText();
 if (txt.includes('NO')) {
 bg1Overlay.destroy();
 mainList.focus();
 screen.render();
 return;
 }
 if (txt.includes('YES')) {
 eraseWin.destroy(); // Remove o menu de escolha
 const logBox = blessed.log({
 parent: bg1Overlay,
 top: 'center',
 left: 'center',
 width: '80%',
 height: '80%',
 border: 'line',
 label: ' [ WIPING SECTORS ] ',
 style: { border: { fg: 'red' }, fg: 'red' },
 tags: true
 });
 const dummyLogs = [
 "ACCESSING ROOT FILES...", "MOUNTING PARTITION /DEV/SDA1...",
 "DELETING USER_DATA/ACHIEVEMENTS...", "OVERWRITING SECTOR 0x882A...",
 "WIPING CONFIG/USER.TXT...", "DELETING CACHE...",
 "LOG: Accessing restricted directory...", "RM -RF /SYSTEM/CORE",
 "ERASING LIGHT_DATA.BIN...", "CLEARING REGISTRY KEYS...",
 "DISABLING SUBSYSTEMS...", "FLUSHING MEMORY BUFFER...",
 "ERASING LOGS...", "TERMINATING SESSIONS...",
 "STATUS: 404 NOT FOUND", "STATUS: ACCESS REVOKED"
 ];
 let logIndex = 0;
 const logInterval = setInterval(() => {
 const randomHex = Math.random().toString(16).substring(2, 10).toUpperCase();
 logBox.log(`{red-fg}[DELETING]{/} SECTOR_${randomHex} ... {bold}WIPED{/}`);
 if (logIndex < dummyLogs.length) {
 logBox.log(`{white-fg}> ${dummyLogs[logIndex]}{/}`);
 logIndex++;
 }
 screen.render();
 }, 50); // Velocidade rápida para efeito de terminal
 setTimeout(() => {
 clearInterval(logInterval);
 logBox.setContent(`{center}\n\n\n{bold}DATA PURGE COMPLETE{/}{/center}`);
 screen.render();
 setTimeout(() => {
 const eraser = spawn('node', ['./EraseData.js'], { stdio: 'inherit' });
 eraser.on('close', () => {
 bg1Overlay.destroy();
 const hasPac = fs.existsSync(path.join(__dirname, '..', 'Achievements', 'PACPRO.ach'));
 let items = ['{center}START MISSION{/center}'];
 if (hasPac) items.push('{center}PACPRO{/center}');
 mainList.setItems(items.concat([
 '{center}ACHIEVEMENTS{/center}', '{center}CHECKPOINTS{/center}', '{center}SETTINGS{/center}',
 '{center}ERASE DATA{/center}', '{center}SYSTEM INFO{/center}',
 '{center}CREDITS{/center}', '{center}SUPPORT{/center}', '{center}EXIT{/center}'
 ]));
 mainList.focus();
 screen.render();
 });
 }, 1500);
 }, 2500); // Duração total da animação de log
 }
 });
}

function erasePlaytime() {
    // 1. Lógica para formatar o tempo para exibição
    function formatTime(s) {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }

    const bg1Overlay = blessed.box({
        parent: screen,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        style: { bg: 'black' },
        index: 100
    });

    // Criamos a janela um pouco maior para caber a informação do tempo
    const eraseWin = blessed.list({
        parent: bg1Overlay,
        top: 'center',
        left: 'center',
        width: 45,
        height: 12, // Aumentado para comportar o texto do tempo
        border: 'line',
        label: ' [ TEMPORAL RESET ] ',
        keys: true,
        tags: true,
        // Exibimos o tempo atual no topo da lista como um cabeçalho visual
        items: [
            `{center}{cyan-fg}CURRENT SESSION: ${formatTime(TOTAL_PLAYTIME)}{/}{/center}`,
            `{center}───────────────────────────{/center}`,
            '{center}YES, RESET CLOCK{/center}', 
            '{center}NO, ABORT{/center}'
        ],
        selected: 3,
        style: {
            border: { fg: COLORDEFAULT },
            selected: { bg: COLORDEFAULT, fg: 'white', bold: true }
        }
    });
    eraseWin.select(2); 
    eraseWin._lastIdx = 2;

    eraseWin.on('select item', (item, index) => {
        if (index < 2) {
            if (eraseWin._lastIdx < index) eraseWin.select(2);
            else eraseWin.select(3);
        }
        eraseWin._lastIdx = eraseWin.selected;
        screen.render();
    });

    eraseWin.focus();
    screen.render();

    eraseWin.on('select', (item) => {
        const txt = item.getText();
        
        // Se for o cabeçalho, ignorar
        if (txt.includes('SESSION') || txt.includes('──')) return;

        if (txt.includes('NO')) {
            bg1Overlay.destroy();
            mainList.focus();
            screen.render();
            return;
        }

        if (txt.includes('YES')) {
            eraseWin.destroy();

            const logBox = blessed.log({
                parent: bg1Overlay,
                top: 'center',
                left: 'center',
                width: '80%',
                height: '80%',
                border: 'line',
                label: ' [ SYNCING TEMPORAL VECTORS ] ',
                style: { border: { fg: 'cyan' }, fg: 'cyan' },
                tags: true
            });

            const timeLogs = [
                "ACCESSING CONFIG/TIME.txt...",
                "STOPPING ANALOG CLOCK PROCESS...",
                "REWINDING SESSION DATA...",
                `LOG: Current playtime detected: ${formatTime(TOTAL_PLAYTIME)}`,
                "PURGING TIME_STAMPS...",
                "RESETTING CLOCK TO 00:00:00",
                "STABILIZING TIMELINE...",
                "STATUS: TIME DATA WIPED."
            ];

            let logIndex = 0;
            const logInterval = setInterval(() => {
                const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
                logBox.log(`{cyan-fg}[REWINDING]{/} TICK_${randomHex} ... {bold}DELETED{/}`);
                
                if (logIndex < timeLogs.length) {
                    logBox.log(`{white-fg}> ${timeLogs[logIndex]}{/}`);
                    logIndex++;
                }
                screen.render();
            }, 80);

            setTimeout(() => {
                clearInterval(logInterval);
                
                const timerReset = spawn('node', ['./erasetime.js'], { stdio: 'inherit' });

                timerReset.on('close', () => {
                    TOTAL_PLAYTIME = 0; 
                    
                    logBox.setContent(`{center}\n\n\n{bold}TEMPORAL VECTORS RE-ESTABLISHED{/}\n{green-fg}CLOCK RESET TO ZERO{/}{/center}`);
                    screen.render();

                    setTimeout(() => {
                        bg1Overlay.destroy();
                        refreshMenu();
                        mainList.focus();
                        screen.render();
                        descriptionBox.setContent('{yellow-fg}TIME DATA HAS BEEN PURGED SUCCESSFULLY.{/}');
                    }, 1500);
                });
            }, 2000);
        }
    });
}

function showCheckpointGallery(parentWin) {
  isGalleryOpen = true;
    const backdrop = blessed.box({
        parent: screen,
        top: 0, left: 0,
        width: '100%', height: '100%',
        style: { bg: 'black' },
        index: 200 
    });

    let currentStage = "";
    try {
        const savePath = path.join(__dirname, '..', 'CONFIG', 'CHECKPOINT.json');
        if (fs.existsSync(savePath)) {
            const data = JSON.parse(fs.readFileSync(savePath, 'utf8'));
            currentStage = data.last_stage;
        }
    } catch (e) {}

    const stageOrder = ALL_STAGES.map(s => s.id);
    const currentIndex = stageOrder.indexOf(currentStage);

    const header = blessed.box({
        parent: backdrop,
        top: 1, left: 'center',
        width: '94%', height: 3,
        border: 'line', tags: true,
        content: `{center}{bold}CHECKPOINT STATUS: ${currentIndex + 1}/${ALL_STAGES.length}{/center}`,
        style: { border: { fg: COLORDEFAULT } }
    });

    const listContainer = blessed.box({
        parent: backdrop,
        top: 4, bottom: 8, left: 'center',
        width: '96%',
        scrollable: true,
        alwaysScroll: true,
        keys: true, mouse: true,
        scrollbar: { ch: ' ', inverse: true, style: { fg: 'white' } }
    });

    const cardWidth = 30;
    const cardHeight = 8;
    const cardsPerRow = 3;

    ALL_STAGES.forEach((stage, i) => {
        const row = Math.floor(i / cardsPerRow);
        const col = i % cardsPerRow;
        
        // Regra idêntica às conquistas: Verde se atingido, Branco/Cinza se bloqueado
        const isReached = currentIndex >= i;

        blessed.box({
            parent: listContainer,
            top: row * (cardHeight + 1),
            left: col * (cardWidth + 2),
            width: cardWidth, height: cardHeight,
            border: 'line', tags: true,
            style: { 
                // Segue o estilo do Achievements(): green se tem, white se não tem
                border: { fg: isReached ? 'green' : 'white' } 
            },
            content: isReached 
                ? `{center}{green-fg}{bold}[X] ${stage.name}{/}\n\n{white-fg}${stage.desc}{/center}`
                : `{center}{white-fg}[ ] ???????????{/}\n\n{white-fg}DATA LOCKED{/center}`
        });
    });

    const footer = blessed.box({
        parent: backdrop,
        bottom: 2, left: 'center',
        width: '94%', height: 3,
        border: 'line', tags: true,
        content: '{center}PRESS [ESC] TO RETURN TO SETTINGS{/center}',
        style: { border: { fg: COLORDEFAULT }, fg: COLORDEFAULT }
    });

    const closeGallery = () => {
        backdrop.destroy();
        isGalleryOpen = false;
        mainList.focus(); 
        screen.render();
    };

    screen.onceKey(['escape'], closeGallery);
    listContainer.focus();
    screen.render();
}

function showSettings() {
  issettigsopen = true
 const bgOverlay = blessed.box({
 parent: screen,
 top: 0,
 left: 0,
 width: '100%',
 height: '100%',
 style: {
 bg: 'black',
 transparent: false // Define como false para esconder o que está atrás
 }
 });

 const decor = blessed.box({
 parent: bgOverlay,
 top: 'center',
 left: 'center',
 width: 50,
 height: 15,
 border: { type: 'line' },
 style: { border: { fg: '#222222' } }
 });
settingsWin = blessed.list({
 parent: bgOverlay,
 top: 'center',
 left: 'center',
 width: 43,
 height: 12,
 border: 'line',
 label: ' [ SETTINGS ] ',
 keys: true,
 tags:true,
 items: [
 ' AUDIO: [' + audiostate + ']',
 ' COLOR: [' + COLORNAME + ']',
 ' GLITCH LOGO: [' + GLITCH + ']',
 ' USERNAME: [' + USERNAMEP + ']',
 ' FULL SCREEN: [' + FULLSCREEN + ']',
 ' SIDEBAR: [' + SIDEBAR + ']',
 ' PLAYTIME HUD: [' + TIME_STATUS + ']',
 '{white-fg}─────────────────────────────────────────{/white-fg}',
 ' RESET TO DEFAULTS ',
 ' BACK TO MENU '
 ],
 selected: 0,
 style: {
 border: { fg: COLORDEFAULT },
 selected: { bg: COLORDEFAULT, fg: 'white', bold: true }
 }
 });
 settingsWin._lastIndex = 0;
  settingsWin.on('select item', (item, index) => {
    if (index === 7) {
      if (settingsWin._lastIndex < index) {
        settingsWin.select(8);
      } else {
        settingsWin.select(6);
      }
    }
    settingsWin._lastIndex = settingsWin.selected;
    screen.render();
  });
 settingsWin.focus();
 settingsWin.select(0);
 screen.render();
 settingsWin.on('select', (item) => {
 const txt = item.getText();
 if (txt.includes('───')) return;
 if (txt.includes('BACK')) {
  issettigsopen = false
  refreshMenu()
 bgOverlay.destroy();
 mainList.focus();
 screen.render();
 return;
 }


 if (txt.includes('PLAYTIME HUD')) {
        TIME_STATUS = (TIME_STATUS === 'ON') ? 'OFF' : 'ON';
        
        fs.writeFileSync('../CONFIG/TIME.txt', `${TIME_STATUS}\n${TOTAL_PLAYTIME}`, 'utf8');
        
        settingsWin.setItem(6, ' PLAYTIME HUD: [' + TIME_STATUS + ']');
        refreshMenu()
        screen.render();
    }
 if (txt.includes('AUDIO')) {
 if (audiostate === 'ON') {
 audiostate = 'OFF';
 if (fs.existsSync('../CONFIG/AUDIOSTATE.txt')) {
 fs.unlinkSync('../CONFIG/AUDIOSTATE.txt');
 }
 fs.writeFileSync('../CONFIG/AUDIOSTATE.txt', audiostate, 'utf8');
 stopAudio();
 } else {
 audiostate = 'ON';
 if (fs.existsSync('../CONFIG/AUDIOSTATE.txt')) {
 fs.unlinkSync('../CONFIG/AUDIOSTATE.txt');
 }
 fs.writeFileSync('../CONFIG/AUDIOSTATE.txt',audiostate, 'utf8');
 playAudio();
 const bg1Overlay = blessed.box({
 parent: screen,
 top: 0,
 left: 0,
 width: '100%',
 height: '100%',
 tags: true,
 style: {
 bg: 'black',
 transparent: false
 }
});
const supportBox = blessed.box({
 parent: bg1Overlay,
 top: 'center',
 left: 'center',
 width: 60, // Aumentado levemente para evitar quebra de linha
 height: 12,
 border: 'line',
 label: ' [ SYSTEM ] ',
 tags: true,
 style: {
 border: { fg: COLORDEFAULT },
 label: { fg: COLORDEFAULT, bold: true }
 }
});
 const supportContent = [
 `\n{center}{bold}WARNING{/bold}{/center}`,
 `{center}Audio settings saved.{/center}`,
 `{center}System audio initialized.{/center}`,
 `\n\n{center}[ESC] TO RETURN{/center}`
 ].join('\n');
 supportBox.setContent(supportContent);
 screen.render(); // Renderizar aqui garante a animação fluida
function closeSupport() {
 supportBox.detach();
 bg1Overlay.detach();
 supportBox.destroy();
 bg1Overlay.destroy();
 screen.unkey('escape', closeSupport);
 settingsWin.focus();
 screen.render();
}
screen.key(['escape'], closeSupport);
screen.render();
 }
 settingsWin.setItem(0, ' AUDIO: [' + audiostate + ']');
 }
 if (txt.includes('COLOR')) {
 if (COLORDEFAULT === '#ff0000') {
 COLORDEFAULT = '#00ff00';
 COLORNAME = 'GREEN';
 if (fs.existsSync('../CONFIG/COLORDEFAULT.txt')) {
 fs.unlinkSync('../CONFIG/COLORDEFAULT.txt');
 }
 if (fs.existsSync('../CONFIG/COLORNAME.txt')) {
 fs.unlinkSync('../CONFIG/COLORNAME.txt');
 }
 fs.writeFileSync('../CONFIG/COLORNAME.txt', COLORNAME, 'utf8');
 fs.writeFileSync('../CONFIG/COLORDEFAULT.txt', COLORDEFAULT, 'utf8');
 } else if (COLORDEFAULT === '#00ff00') {
 COLORDEFAULT = '#0000ff';
 COLORNAME = 'BLUE';
 if (fs.existsSync('../CONFIG/COLORDEFAULT.txt')) {
 fs.unlinkSync('../CONFIG/COLORDEFAULT.txt');
 }
 if (fs.existsSync('../CONFIG/COLORNAME.txt')) {
 fs.unlinkSync('../CONFIG/COLORNAME.txt');
 }
 fs.writeFileSync('../CONFIG/COLORNAME.txt', COLORNAME, 'utf8');
 fs.writeFileSync('../CONFIG/COLORDEFAULT.txt', COLORDEFAULT, 'utf8');
 } else {
 COLORDEFAULT = '#ff0000';
 COLORNAME = 'RED';
 if (fs.existsSync('../CONFIG/COLORDEFAULT.txt')) {
 fs.unlinkSync('../CONFIG/COLORDEFAULT.txt');
 }
 if (fs.existsSync('../CONFIG/COLORNAME.txt')) {
 fs.unlinkSync('../CONFIG/COLORNAME.txt');
 }
 fs.writeFileSync('../CONFIG/COLORNAME.txt', COLORNAME, 'utf8');
 fs.writeFileSync('../CONFIG/COLORDEFAULT.txt', COLORDEFAULT, 'utf8');
 }
 settingsWin.setItem(1, ' COLOR: [' + COLORNAME + ']');
 logoBox.style.fg = COLORDEFAULT;
 mainList.style.selected.bg = COLORDEFAULT;
 settingsWin.style.border.fg = COLORDEFAULT;
 settingsWin.style.selected.bg = COLORDEFAULT;
 hotkeysBar.style.border.fg = COLORDEFAULT
 statusBox.style.border.fg = COLORDEFAULT
 hotkeysBar.style.fg = COLORDEFAULT
 statusBox.style.fg = COLORDEFAULT
 hotkeysBar.style.label.fg = COLORDEFAULT
 statusBox.style.label.fg = COLORDEFAULT
 settingsWin.focus();
 }
 if (txt.includes('USERNAME')) {
 const bgOverlay1 = blessed.box({
 parent: screen,
 top: 0,
 left: 0,
 width: '100%',
 height: '100%',
 style: {
 bg: 'black',
 transparent: false // Define como false para esconder o que está atrás
 }
 });
 const input = blessed.textbox({
 parent: bgOverlay1,
 top: 'center',
 left: 'center',
 height: 3,
 width: '40%',
 label: ' [ ENTER USERNAME ] ',
 content: USERNAMEP,
 border: { type: 'line' },
 style: {
 fg: 'white',
 bg: 'black',
 border: { fg: COLORDEFAULT },
 hover: { bg: 'BLACK' },
 focus: { bg: 'BLACK' }
 },
 keys: true,
 mouse: true,
 inputOnFocus: true
 });
 input.focus();
 screen.render();
 input.on('submit', (value) => {
 if (value && value.trim() !== "") {
 USERNAMEP = value.trim().toUpperCase();
 if (fs.existsSync('../CONFIG/USER.txt')) {
 fs.unlinkSync('../CONFIG/USER.txt');
 }
 fs.writeFileSync('../CONFIG/USER.txt', USERNAMEP, 'utf8');
 settingsWin.setItem(3, ' USERNAME: [' + USERNAMEP + ']');
 }
 input.destroy();
 bgOverlay1.destroy();
 screen.render();
 });
 input.on('cancel', () => {
 bgOverlay1.destroy();
 input.destroy();
 screen.render();
 });
}
if (txt.includes('FULL SCREEN')) {
 if (!isModernTerminal) {
 const overlay = blessed.box({
 parent: screen,
 top: 0, left: 0,
 width: '100%', height: '100%',
 style: { bg: 'black' },
 transparent: false
 });
 overlay.setIndex(999);
 const warningBox = blessed.box({
 parent: overlay,
 top: 'center',
 left: 'center',
 width: 60,
 height: 10,
 tags: true,
 border: 'line',
 content: '{center}{red-fg}{bold}FEATURE LOCKED{/bold}{/red-fg}\n\n' +
 'Fullscreen is only available via {bold}Windows Terminal{/bold}.\n' +
 'Legacy CMD does not support this protocol.\n\n' +
 '{yellow-fg}[ESC] TO RETURN{/}',
 style: { border: { fg: COLORDEFAULT } }
 });
 const closeWarning = () => {
 overlay.destroy();
 settingsWin.focus();
 screen.render();
 };
 screen.onceKey(['escape'], closeWarning);
 return screen.render();
 }
 FULLSCREEN = (FULLSCREEN === 'OFF') ? 'ON' : 'OFF';
 const vbsPath = path.join(__dirname, 'toggle_fs.vbs');
 const BCT = `Set objShell = WScript.CreateObject("WScript.Shell")\nWScript.Sleep 100\nobjShell.SendKeys "{F11}"`;
 try {
 fs.writeFileSync(vbsPath, BCT);
 const child = spawn('wscript.exe', [vbsPath]);
 child.on('exit', () => {
 setTimeout(() => { if (fs.existsSync(vbsPath)) fs.unlinkSync(vbsPath); }, 1000);
 });
 } catch (err) {
 console.error("Erro FS:", err);
 }
 if (fs.existsSync('../CONFIG/FULLSCREEN.txt')) fs.unlinkSync('../CONFIG/FULLSCREEN.txt');
 fs.writeFileSync('../CONFIG/FULLSCREEN.txt', FULLSCREEN, 'utf8');
 settingsWin.setItem(4, ' FULL SCREEN: [' + FULLSCREEN + ']');
 screen.render();
}
if (txt.includes('GLITCH')) {
 GLITCH = (GLITCH === 'ON') ? 'OFF' : 'ON';
 if (fs.existsSync('../CONFIG/GLITCH.txt')) {
 fs.unlinkSync('../CONFIG/GLITCH.txt');
 }
 fs.writeFileSync('../CONFIG/GLITCH.txt', GLITCH, 'utf8');
 settingsWin.setItem(2, ' GLITCH LOGO: [' + GLITCH + ']');
 screen.render();
}
if (txt.includes('SIDEBAR')) {
 SIDEBAR = (SIDEBAR === 'ON') ? 'OFF' : 'ON';
 fs.writeFileSync('../CONFIG/SIDEBAR.txt', SIDEBAR, 'utf8');
 settingsWin.setItem(5, ' SIDEBAR: [' + SIDEBAR + ']');
 if (SIDEBAR === 'ON') {
 leftSidebar.show();
 } else {
 leftSidebar.hide();
 }
 screen.render();
}
if (txt.includes('RESET')) {
 const pathAch = path.join(__dirname, '..', 'Achievements', 'HARD_RESET.ach');
 if (!fs.existsSync(pathAch)) {
 fs.writeFileSync(pathAch, 'COMPLETED');
 showAchievementToast('HARD_RESET');
 }
 if (fs.existsSync('../CONFIG/AUDIOSTATE.txt')) {
 fs.unlinkSync('../CONFIG/AUDIOSTATE.txt');
 }
 if (fs.existsSync('../CONFIG/COLORNAME.txt')) {
 fs.unlinkSync('../CONFIG/COLORNAME.txt');
 }
 if (fs.existsSync('../CONFIG/COLORDEFAULT.txt')) {
 fs.unlinkSync('../CONFIG/COLORDEFAULT.txt');
 }
 if (fs.existsSync('../CONFIG/USER.txt')) {
 fs.unlinkSync('../CONFIG/USER.txt');
 }
 if (fs.existsSync('../CONFIG/FULLSCREEN.txt')) {
 fs.unlinkSync('../CONFIG/FULLSCREEN.txt');
 }
 if (fs.existsSync('../CONFIG/DIFFICULTY.txt')) {
 fs.unlinkSync('../CONFIG/DIFFICULTY.txt');
 }
 if (fs.existsSync('../CONFIG/GLITCH.txt')) {
 fs.unlinkSync('../CONFIG/GLITCH.txt');
}
if (fs.existsSync('../CONFIG/TIME.txt')) {
  fs.unlinkSync('../CONFIG/TIME.txt')
}
 audiostate = 'ON';
 COLORNAME = 'RED';
 COLORDEFAULT = '#ff0000';
 USERNAMEP = 'OPERATOR 07';
 FULLSCREEN = 'OFF';
 DIFFICULTY = 'NORMAL';
 GLITCH = 'ON';
 SIDEBAR = 'OFF';
 TIME_STATUS = 'ON'

 fs.writeFileSync('../CONFIG/TIME.txt', `${TIME_STATUS}\n${TOTAL_PLAYTIME}`, 'utf8');
 fs.writeFileSync('../CONFIG/FULLSCREEN.txt', FULLSCREEN, 'utf8');
 fs.writeFileSync('../CONFIG/AUDIOSTATE.txt', audiostate, 'utf8');
 fs.writeFileSync('../CONFIG/COLORNAME.txt', COLORNAME, 'utf8');
 fs.writeFileSync('../CONFIG/COLORDEFAULT.txt', COLORDEFAULT, 'utf8');
 fs.writeFileSync('../CONFIG/USER.txt', USERNAMEP, 'utf8');
 fs.writeFileSync('../CONFIG/GLITCH.txt', GLITCH, 'utf8');
 fs.writeFileSync('../CONFIG/SIDEBAR.txt', SIDEBAR, 'utf8');
 settingsWin.setItem(0, ' AUDIO: [' + audiostate + ']');
 settingsWin.setItem(1, ' COLOR: [' + COLORNAME + ']');
 settingsWin.setItem(2, ' GLITCH LOGO: [' + GLITCH + ']');
 settingsWin.setItem(3, ' USERNAME: [' + USERNAMEP + ']');
 settingsWin.setItem(4, ' FULL SCREEN: [' + FULLSCREEN + ']');
 settingsWin.setItem(5, ' SIDEBAR: [' + SIDEBAR + ']');
 settingsWin.setItem(6, ' PLAYTIME HUD: [' + TIME_STATUS + ']');
 logoBox.style.fg = COLORDEFAULT;
 mainList.style.selected.bg = COLORDEFAULT;
 settingsWin.style.border.fg = COLORDEFAULT;
 settingsWin.style.selected.bg = COLORDEFAULT;
 settingsWin.focus();
 if (audiostate === 'ON') {
 playAudio();
 } else {
 stopAudio();
}
leftSidebar.hide();
updateStatus();
}
 screen.render();
 });
}
function stopAudio() {
    if (vlcProcess) {
        vlcProcess.kill();
        vlcProcess = null;
    }
    // Garante que o cmdmp3 morra mesmo se o kill falhar
    spawn('taskkill', ['/F', '/IM', 'cmdmp3.exe', '/T']);
}

function playAudio() {
    if (audiostate === 'ON') {
        // O play-sound usa o cmdmp3.exe que você configurou no topo
        vlcProcess = player.play(audioFile, function(err){
            if (err && !err.killed) console.error("Erro áudio menu:", err);
        });
    }
}

function stopcreditsaudio() {
    if (vlcProcess) {
        vlcProcess.kill();
        vlcProcess = null;
    }
    spawn('taskkill', ['/F', '/IM', 'cmdmp3.exe', '/T']);
}

function playcreditsaudio() {
    // Toca a música dos créditos (2.mp3)
    vlcProcess = player.play(audioaa, function(err){
        if (err && !err.killed) console.error("Erro áudio créditos:", err);
    });
}
function getTerminalType() {
 const args = process.argv;
 if (args.includes('--wt')) {
 return 'WINDOWS TERMINAL (WT.EXE)';
 }
 if (args.includes('--cmd')) {
 return 'CMD (LEGACY)';
 }
 if (process.env.WT_SESSION) return 'WINDOWS TERMINAL (WT.EXE)';
 return 'CMD (LEGACY)';;
}
let terminalName = getTerminalType();
function showSystemInfo() {
 infoAccessCount++;
 if (infoAccessCount >= 10) {
 const pathAch = path.join(__dirname, '..', 'Achievements', 'DATA_MINER.ach');
 if (!fs.existsSync(pathAch)) {
 fs.writeFileSync(pathAch, 'COMPLETED');
 showAchievementToast('DATA_MINER');
 }
 }
 const keyFilePath = '../CONFIG/KEY.txt';
 const isUnlocked = fs.existsSync(keyFilePath);
 const backdrop = blessed.box({
 parent: screen,
 top: 0, left: 0,
 width: '100%', height: '100%',
 style: { bg: 'black' }
 });
 const infoBox = blessed.box({
 parent: backdrop,
 top: 'center', left: 'center',
 width: 60, height: 13,
 border: 'line',
 label: ' [ SYSTEM DATA ] ',
 tags: true,
 style: {
 border: { fg: COLORDEFAULT },
 label: { fg: COLORDEFAULT, bold: true }
 }
 });
 const renderData = () => {
 const text = [
 ` {bold}STATUS:{/bold}       {green-fg}OPERATIONAL{/green-fg}`,
 ` {bold}OS:{/bold}           ${friendlyName}`,
 ` {bold}VERSION:{/bold}      ${winVersion}`,
 ` {bold}PC-USER:{/bold}      ${userName.toUpperCase()}`,
 ` {bold}TERMINAL:{/bold}     ${terminalName}`,
 ` {bold}ACHIEVEMENTS:{/bold} ${achievements}`,
 ` {bold}ENCRYPTION KEY:{/}   ${key}\n`, // Agora visível permanentemente após unlock
 ` [ESC] TO RETURN`
 ].join('\n');
 infoBox.setContent(text);
 screen.render();
 };
 if (isUnlocked) {
 renderData();
 } else {
 infoBox.setContent('\n{center}{yellow-fg}ENCRYPTED SYSTEM DATA{/}\n\nINPUT DEVELOPER CODE:{/center}\n{center}{green-fg}(HINT): ROOT GAME FILES{/}{/}');
 const input = blessed.textbox({
 parent: infoBox,
 bottom: 2, left: 'center',
 height: 3, width: '50%',
 border: { type: 'line' },
 style: {
 fg: 'white', bg: 'black',
 border: { fg: COLORDEFAULT },
 focus: { border: { fg: 'white' } }
 },
 inputOnFocus: true
 });
 input.focus();
 screen.render();
 input.on('submit', (value) => {
 if (value === "PLDEV") {
 fs.writeFileSync(keyFilePath, 'UNLOCKED', 'utf8');
 const achPath = path.join(__dirname, '..', 'Achievements', 'OVERRIDE.ach');
 if (!fs.existsSync(achPath)) {
 fs.writeFileSync(achPath, 'COMPLETED');
 showAchievementToast('OVERRIDE'); // DISPARA AQUI
 }
 input.destroy();
 renderData();
 } else {
 input.destroy();
 backdrop.destroy();
 mainList.focus();
 descriptionBox.setContent('{red-fg}INVALID AUTHORIZATION CODE. ACCESS DENIED.{/}');
 screen.render();
 }
 });
 input.on('cancel', () => {
 input.destroy();
 backdrop.destroy();
 mainList.focus();
 screen.render();
 });
 }
 function closeInfo() {
 backdrop.destroy();
 mainList.focus();
 screen.unkey('escape', closeInfo);
 screen.render();
 }
 screen.key(['escape'], closeInfo);
 screen.render();
}
function supportGame() {
  issupportOpen = true
 const bg1Overlay = blessed.box({
 parent: screen,
 top: 0,
 left: 0,
 width: '100%',
 height: '100%',
 index: 100, // Garante que fique acima do menu principal
 style: { bg: 'black', transparent: false }
 });
 const supportBox = blessed.box({
 parent: bg1Overlay,
 top: 'center',
 left: 'center',
 width: 60,
 height: 18,
 border: 'line',
 label: ' [ SUPPORT THE GAME ] ',
 tags: true,
 style: {
 border: { fg: COLORDEFAULT },
 label: { fg: COLORDEFAULT, bold: true }
 }
 });
 const infoText = [
 `\n{bold}THANK YOU FOR SUPPORTING LIGHT GAME!{/bold}`,
 `Your support allows for further system development.`,
 `Choose an action below to proceed:`
 ].join('\n');
 const textContainer = blessed.box({
 parent: supportBox,
 top: 1,
 left: 'center',
 width: '90%',
 height: 6,
 tags: true,
 content: `{center}${infoText}{/center}`
 });
 const supportOptions = blessed.list({
 parent: supportBox,
 bottom: 1,
 left: 'center',
 width: '80%',
 height: 7,
 keys: true,
 tags: true,
 mouse: true,
 border: 'line',
 items: [
 '{center}DONATE ON ITCH.IO{/center}',
 '{center}POST ON TWITTER (X){/center}',
 '{center}CLOSE WINDOW{/center}'
 ],
 style: {
 border: { fg: '#333333' },
 selected: { bg: COLORDEFAULT, fg: 'white', bold: true }
 }
 });
 supportOptions.focus();
 supportOptions.on('select', (item) => {
 const text = item.getText();
 if (text.includes('ITCH.IO')) {
 exec('start https://palelunagame.itch.io/light');
 }
 else if (text.includes('TWITTER')) {
 const tweetText = encodeURIComponent("I'm playing LIGHT! A unique terminal horror experience. Check it out here: https://palelunagame.itch.io/light");
 exec(`start https://twitter.com/intent/tweet?text=${tweetText}`);
 }
 else if (text.includes('CLOSE')) {
 closeSupport();
 }
 screen.render();
 });
 function closeSupport() {
  issupportOpen = false
 supportOptions.destroy();
 supportBox.destroy();
 bg1Overlay.destroy();
 mainList.focus();
 screen.render();
 }
 screen.render();
}
function Achievements() {
 achScreenCount++;
 if (achScreenCount >= 5) {
 const pathAch = path.join(__dirname, '..', 'Achievements', 'TERMINAL_JUNKIE.ach');
 if (!fs.existsSync(pathAch)) {
 fs.writeFileSync(pathAch, 'COMPLETED');
 showAchievementToast('TERMINAL_JUNKIE');
 }
 }
 const backdrop = blessed.box({
 parent: screen,
 top: 0, left: 0,
 width: '100%', height: '100%',
 style: { bg: 'black' }
 });

 let unlockedCount = 0;
 ALL_ACHIEVEMENTS.forEach(ach => {
 if (ach.id === 'TRUELIGHT') return;
 const achPath = path.join(__dirname, '..', 'Achievements', `${ach.id}.ach`);
 if (fs.existsSync(achPath)) unlockedCount++;
 });
 const trueLightPath = path.join(__dirname, '..', 'Achievements', 'TRUELIGHT.ach');
 if (unlockedCount === 18 && !fs.existsSync(trueLightPath)) {
 fs.writeFileSync(trueLightPath, 'COMPLETED');
 backdrop.destroy();
 Achievements();
 showAchievementToast('TRUELIGHT');
 return;
 }
 if (fs.existsSync(trueLightPath)) unlockedCount++;
 const isFullSync = unlockedCount === ALL_ACHIEVEMENTS.length;

 const header = blessed.box({
 parent: backdrop,
 top: 1, left: 'center',
 width: '94%', height: 3,
 border: 'line', tags: true,
 content: `{center}{bold}ACHIEVEMENTS: ${unlockedCount}/${ALL_ACHIEVEMENTS.length}{/}${isFullSync ? ' {blink}[MAX]{/}' : ''}{/center}`,
 style: { border: { fg: isFullSync ? 'yellow' : 'white' } }
 });

 const listContainer = blessed.box({
 parent: backdrop,
 top: 4, bottom: 8, left: 'center',
 width: '96%',
 scrollable: true,
 alwaysScroll: true,
 keys: true, mouse: true,
 scrollbar: { ch: ' ', inverse: true, style: { fg: 'white' } }
 });
 const cardWidth = 30;
 const cardHeight = 8;
 const cardsPerRow = 3;
 ALL_ACHIEVEMENTS.forEach((ach, i) => {
 const achPath = path.join(__dirname, '..', 'Achievements', `${ach.id}.ach`);
 const hasAch = fs.existsSync(achPath);
 const row = Math.floor(i / cardsPerRow);
 const col = i % cardsPerRow;
 blessed.box({
 parent: listContainer,
 top: row * (cardHeight + 1),
 left: col * (cardWidth + 2),
 width: cardWidth, height: cardHeight,
 border: 'line', tags: true,
 style: { border: { fg: hasAch ? 'green' : 'white' } },
 content: hasAch
 ? `{center}{green-fg}{bold}[X] ${ach.name}{/}\n\n{white-fg}${ach.desc}{/center}`
 : `{center}{white-fg}[ ] ???????????{/}\n\n{white-fg}DATA LOCKED{/center}`
 });
 });
 hintDisplay = blessed.box({
 parent: backdrop,
 bottom: 4, left: 'center',
 width: '94%', height: 3,
 border: 'line', tags: true,
 content: '{center}PRESS [H] OR CLICK "SHOW HINTS" TO DECRYPT{/center}',
 style: { border: { fg: COLORDEFAULT }, fg: COLORDEFAULT }
 });
 const hintBtn = blessed.button({
 parent: backdrop,
 bottom: 1, left: 'center',
 width: 25, height: 3,
 content: '{center}[H] SHOW HINTS{/center}',
 border: 'line', tags: true,
 style: {
 border: { fg: 'white' },
 focus: { border: { fg: 'yellow' }, bg: '#222' },
 hover: { border: { fg: 'yellow' }, bg: '#222' }
 },
 mouse: true, keys: true
 });
 const openHintMenu = () => {
 const bg1Overlay = blessed.box({
 parent: screen,
 top: 0,
 left: 0,
 width: '100%',
 height: '100%',
 style: {
 bg: 'black',
 transparent: false
 }
 });
 hintListWin = blessed.list({
 parent: bg1Overlay,
 top: 'center', left: 'center',
 width: 40, height: 12,
 border: 'line', label: ' [ SELECT NODE ] ',
 tags: true, keys: true, mouse: true,
 items: ALL_ACHIEVEMENTS.map(a => ` ${a.id} `),
 style: {
 border: { fg: COLORDEFAULT },
 selected: { bg: COLORDEFAULT, fg: 'white', bold: true }
 }
 });
 hintListWin.focus();
 screen.render();
 hintListWin.on('select', (item, index) => {
 const selectedAch = ALL_ACHIEVEMENTS[index];
 hintDisplay.setContent(`{center}{yellow-fg}HINT [${selectedAch.id}]: ${selectedAch.hint}{/center}`);
 hintDisplay.style.border.fg = 'yellow';
 bg1Overlay.destroy()
 hintListWin.destroy();
 listContainer.focus();
 screen.render();
 });
 const closeSub = () => {
 bg1Overlay.destroy()
 hintListWin.destroy();
 mainList.focus();
 screen.render();
 };
 hintListWin.key(['escape', 'h'], closeSub);
 };
 hintBtn.on('press', openHintMenu);
 screen.key(['h', 'H'], openHintMenu);
 listContainer.focus();
 const closeAchievements = () => {
 screen.unkey('h', openHintMenu);
 screen.unkey('H', openHintMenu);
 backdrop.destroy();
 mainList.focus();
 screen.render();
 };
 screen.key(['escape'], closeAchievements);
 screen.render();
}
screen.on('keypress', (ch, key) => {
 const k = key.full.toLowerCase();
 if (k === 'm') {
 if (audiostate === 'ON') {
 audiostate = 'OFF';
 stopAudio();
 } else {
 audiostate = 'ON';
 playAudio();
 }
 if (audiostate === 'OFF') {
 muteCount++;
 if (muteCount >= 5) {
 const achPath = path.join(__dirname, '..', 'Achievements', 'AUDIOPHOBIC.ach');
 if (!fs.existsSync(achPath)) {
 fs.writeFileSync(achPath, 'COMPLETED');
 showAchievementToast('AUDIOPHOBIC'); // O teu Toast aqui
 }
 }
}
 fs.writeFileSync('../CONFIG/AUDIOSTATE.txt', audiostate, 'utf8');
 updateStatus();
 }
 if (k === 'f1' || k === 'i') {
 showSystemInfo();
 updateStatus();
 }
 if (k === 'c') {
  if (isGalleryOpen) return;
  if (issettigsopen) return;
  if (iscreditsOpen) return;
  if (issupportOpen) return;
colorCycles++;
if (colorCycles >= 15) { // 3 cores * 5 ciclos = 15 pressões
 const achPath = path.join(__dirname, '..', 'Achievements', 'COLOR_MASTER.ach');
 if (!fs.existsSync(achPath)) {
 fs.writeFileSync(achPath, 'COMPLETED');
 showAchievementToast('COLOR_MASTER');
 }
}
 if (COLORDEFAULT === '#ff0000') {
 COLORDEFAULT = '#00ff00'; COLORNAME = 'GREEN';
 } else if (COLORDEFAULT === '#00ff00') {
 COLORDEFAULT = '#0000ff'; COLORNAME = 'BLUE';
 } else {
 COLORDEFAULT = '#ff0000'; COLORNAME = 'RED';
 }
 fs.writeFileSync('../CONFIG/COLORNAME.txt', COLORNAME, 'utf8');
 fs.writeFileSync('../CONFIG/COLORDEFAULT.txt', COLORDEFAULT, 'utf8');
 [logoBox, hotkeysBar, statusBox, hintDisplay, hintListWin].forEach(el => {
 if (el) {
 el.style.fg = COLORDEFAULT;
 if(el.style.border) el.style.border.fg = COLORDEFAULT;
 if(el.style.label) el.style.label.fg = COLORDEFAULT;
 if(el.style.selected) el.style.selected.bg = COLORDEFAULT;
 }
});
 mainList.style.selected.bg = COLORDEFAULT;
 updateStatus(); // Atualiza cores e texto interno da box
 }
 if (k === 'g') {
 GLITCH = (GLITCH === 'ON') ? 'OFF' : 'ON';
 glitchCount++;
 if (glitchCount >= 10) {
 const pathAch = path.join(__dirname, '..', 'Achievements', 'GLITCH_ADDICT.ach');
 if (!fs.existsSync(pathAch)) {
 fs.writeFileSync(pathAch, 'COMPLETED');
 showAchievementToast('GLITCH_ADDICT');
 }
 }
 fs.writeFileSync('../CONFIG/GLITCH.txt', GLITCH, 'utf8');
 updateStatus();
 }
});
const leftSidebar = blessed.box({
 parent: screen,
 top: 'center',
 left: 0,
 width: 25,
 height: 18,
 hidden: SIDEBAR === 'OFF',// Altura somada das duas caixas + espaçamento
 style: { bg: 'transparent' }
});
const hotkeysBar = blessed.box({
 parent: leftSidebar,
 top: 0,
 left: 0,
 width: '65%',
 height: 9,
 border: 'line',
 label: ' [ KEYS ] ',
 tags: true,
 content: ' {bold}[M] MUTE\n\n [F1] SYS\n\n [C] COLOR\n\n [G] GLITCH{/} ',
 style: { fg: COLORDEFAULT, border: { fg: COLORDEFAULT }, label: { fg: COLORDEFAULT } }
});
const statusBox = blessed.box({
 parent: leftSidebar,
 top: 9, // Começa exatamente onde a hotkeysBar termina
 left: 0,
 width: '65%',
 height: 7,
 border: 'line',
 label: ' [ STATUS ] ',
 tags: true,
 style: { fg: COLORDEFAULT, border: { fg: COLORDEFAULT }, label: { fg: COLORDEFAULT } }
});
function updateStatus() {
 const statusText = [
 ` {bold}AUDIO:{/bold} ${audiostate === 'ON' ? '{green-fg}ACTIVE{/}' : '{red-fg}MUTED{/}'}\n\n {bold}COLOR:{/bold} ${COLORNAME}\n\n {bold}GLITCH:{/bold} ${GLITCH} `
 ].join('\n\n ');
 statusBox.setContent(`${statusText}`);
 screen.render();
}
updateStatus();
mainList.on('select', (item) => {
 const text = item.getText();
 if (text.includes('PACPRO')) {
 mainList.detach();
 let progress = 0;
 const loadInterval = setInterval(() => {
 progress += 10;
 const bar = "█".repeat(progress / 10) + "░".repeat(10 - progress / 10);
 menuBox.setContent(`\n\n{center}{bold}INITIALIZING EXTERNAL PROTOCOL{/bold}\n\n[${bar}] ${progress}%{/center}`);
 screen.render();
 if (progress >= 100) clearInterval(loadInterval);
 }, 100);
 setTimeout(() => {
 menuBox.setContent(`\n\n{center}{yellow-fg}PACPRO RUNNING IN EXTERNAL TERMINAL...{/}\n\nWaiting for session end...{/center}`);
 screen.render();
const pacmanProc = spawn('cmd.exe /c start /wait node PACPRO.js', {
 shell: true
});
 pacmanProc.on('exit', () => {
 const achPath = path.join(__dirname, '..', 'Achievements', 'PACPRO.ach');
 const hasWon = fs.existsSync(achPath);
 if (hasWon) {
 menuBox.style.border.fg = 'yellow';
 menuBox.setContent(`\n\n{center}{yellow-fg}{bold}CONGRATULATIONS!{/}\n\nPACPRO ELITE LEVEL CLEAR\n\nREBOOTING SYSTEM...{/center}`);
 } else {
 menuBox.style.border.fg = 'red';
 menuBox.setContent(`\n\n{center}{red-fg}{bold}GAME OVER{/}\n\nPROTOCOL FAILURE: DATA LOST\n\nRESTARTING...{/center}`);
 }
 screen.render();
 setTimeout(() => {
 screen.destroy();
 spawn('cmd.exe', ['/c', 'start', 'node', 'menu.js'], {
 shell: true,
 detached: true
 }).unref();
 process.exit(0);
 }, 3000); // 3 segundos para o jogador ler o resultado no menu
 });
 }, 1500);
 return;
}
 if (text.includes('EXIT')) return confirmExit();
 if (text.includes('SETTINGS')) return showSettings();
 if (text.includes('SYSTEM INFO')) return showSystemInfo();
 if (text.includes('ERASE DATA')) return eraseData();
 if (text.includes('CREDITS')) { return credits() ; } // Implementar depois
 if (text.includes('SUPPORT')) { return supportGame() ; } // Implementar depois
 if (text.includes('ACHIEVEMENTS')) { return Achievements(); }
 if (text.includes('CHECKPOINTS')) { return showCheckpointGallery(); }
 if (text.includes('START MISSION')) {
 mainList.detach();
 let dots = 0;
 const loader = setInterval(() => {
 menuBox.setContent(`\n\n{center}INITIALIZING${".".repeat(dots)}{/center}`);
 screen.render();
 dots = (dots + 1) % 4;
 }, 300);
 setTimeout(() => {
 clearInterval(loader);
 menuBox.destroy();
 mainList.destroy();
 screen.destroy();
 const child = spawn('node', ['main.js'], {
 stdio: 'inherit',
 });
 child.on('exit', () => {
 process.exit();
 });
 }, 3000); // Tempo da animação
 }
 if (text.includes('RESET TIME')) {
  return erasePlaytime();
}
});
screen.key(['q', 'C-c'], () => confirmExit());
startupSequence();
startLogoAnimation();
mainList.focus();
screen.render();
process.on('SIGINT', () => {
 confirmExit();
});
process.on('SIGHUP', () => {
 confirmExit();
});