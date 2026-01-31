const CURRENT_VERSION = "V1.0";
const blessed = require('blessed');
const os = require('os');
const { spawn } = require('child_process');
const { exec } = require('child_process');
const fs = require('fs');
let isBooting = true;
let isUpdateInterfaceActive = false;
let isupdating = false;
let isBooting2 = true;
let account = false;
let isERASE = false
let blockMenuInput = false;
const GITHUB_CLIENT_ID = "Ov23lidCgfrBVjsGIlmb"; 
let githubToken = null;
let githubUser = null;
let isOverrideActive = false;
const path = require('path');
let cheatBuffer = "";
const achievements = fs.readdirSync('../Achievements').filter(f => f.endsWith('.ach')).length;
let dots = 0;
const player = require('play-sound')({
 player: '../AUDIO/PLAYER/cmdmp3.exe'
});
const achDir = '../Achievements'; 

if (!fs.existsSync(achDir)) {
    fs.mkdirSync(achDir, { recursive: true });
}
const rareBootPath = path.join(__dirname, '..', 'Achievements', 'RARE_BOOT.ach');
const hasRareBoot = fs.existsSync(rareBootPath);
const audioFile = '../AUDIO/TRACKS/4.mp3';
const audioaa = '../AUDIO/TRACKS/5.mp3';
let bgmProcess = null;
let effectProcess = null;
const beepfile = '../AUDIO/EFFECTS/BEEP.wav'
const beepfile2 = '../AUDIO/EFFECTS/BEEP2.wav'
const freshfile = '../AUDIO/EFFECTS/FRESH.wav'
const BOOTfile = '../AUDIO/EFFECTS/LUX-4.wav'
const winfile = '../AUDIO/EFFECTS/win.wav'
const warningfile = '../AUDIO/EFFECTS/warning.wav'
const supportfile = '../AUDIO/EFFECTS/support.wav'
const backfile = '../AUDIO/EFFECTS/back.wav'
const startfile = '../AUDIO/EFFECTS/start.wav'
const checkpointfile = '../AUDIO/EFFECTS/checkpoint.wav'
const sucessofile = '../AUDIO/EFFECTS/win2.wav'
const key = 'lux1999files'
let hintDisplay = null;
let hintListWin = null
let colorCycles = 0;
 let muteCount = 0;
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
 { id: 'RARE_BOOT', name: 'SYSTEM ANOMALY', desc: 'Triggered the rare LUX-4 initialization sequence.', hint: 'The system has a small chance to reveal its true face upon boot.' },
 ];

function checkUpdates(callback) {
    const url = 'https://api.github.com/repos/lukzst/LIGHT/contents/FINAL';
    const cmd = `powershell -NoProfile -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $res = Invoke-WebRequest -Uri '${url}' -Headers @{'User-Agent'='LIGHT-Game'} -UseBasicParsing; $res.Content"`;

    exec(cmd, (error, stdout) => {
        if (error) return callback(null);
        try {
            const json = JSON.parse(stdout);
            const versions = json
                .filter(file => file.type === 'dir' && file.name.startsWith('V'))
                .map(file => file.name)
                .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

            const latestVersion = versions[versions.length - 1];
            if (latestVersion && latestVersion !== CURRENT_VERSION) {
                callback(true, latestVersion);
            } else {
                callback(false, latestVersion);
            }
        } catch (e) { callback(null); }
    });
}

async function downloadAndInstall(version, statusWin) {
    const treeUrl = `https://api.github.com/repos/lukzst/LIGHT/git/trees/main?recursive=1`;
    const getTreeCmd = `powershell -NoProfile -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (Invoke-RestMethod -Uri '${treeUrl}' -Headers @{'User-Agent'='LIGHT-Updater'}).tree | ConvertTo-Json -Compress"`;
    
    statusWin.setContent('{center}\n{yellow-fg}MAPPING REPOSITORY...{/}\nEstablishing secure link via PowerShell.{/center}');
    screen.render();

    exec(getTreeCmd, {maxBuffer: 1024 * 1024 * 10}, async (error, stdout) => {
        if (error) {
            statusWin.setContent('{center}\n{red-fg}MAP ERROR{/red-fg}\n\nConnection refused by host.{/center}');
            return screen.render();
        }

        try {
            const tree = JSON.parse(stdout);
            const targetPrefix = `FINAL/${version}/LIGHT/`;
            const files = tree.filter(item => 
                item.type === 'blob' && 
                item.path.startsWith(targetPrefix) &&
                !item.path.includes('/CONFIG/') && 
                !item.path.includes('/Achievements/')
            );

            if (files.length === 0) throw new Error("Data sectors empty.");

            blockMenuInput = true;
            let downloaded = 0;
            const totalSteps = 30;

            for (let i = 1; i <= totalSteps; i++) {
                const bar = "█".repeat(i) + "░".repeat(totalSteps - i);
                const percentage = Math.round((i / totalSteps) * 100);
                
                const filesPerStep = Math.ceil(files.length / totalSteps);
                for(let j = 0; j < filesPerStep && downloaded < files.length; j++) {
                    const fileMetadata = files[downloaded];
                    const relPath = fileMetadata.path.replace(targetPrefix, '');
                    const destPath = path.join(__dirname, '..', relPath);
                    const fileUrl = `https://raw.githubusercontent.com/lukzst/LIGHT/main/${fileMetadata.path}`;

                    if (!fs.existsSync(path.dirname(destPath))) fs.mkdirSync(path.dirname(destPath), { recursive: true });
                    const dlCmd = `powershell -NoProfile -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; iwr -Uri '${fileUrl}' -OutFile '${destPath}'"`;
                    await new Promise((res) => { exec(dlCmd, () => { downloaded++; res(); }); });
                }

                statusWin.setContent(
    `{center}\n{yellow-fg}INSTALLING NEW UPDATE...{/}\n\n` +
    `Version: ${version.replace('V', '')}\n\n` +
    `[${bar}] ${percentage}%\n\n` +
    `{white-fg}Please wait, do not close the game...{/white-fg}{/center}`
);
                screen.render();
                await new Promise(r => setTimeout(r, 400));
            }

            statusWin.style.border.fg = 'green';
statusWin.setContent(`{center}\n{green-fg}UPDATE INSTALLED SUCCESSFULLY!{/green-fg}\n\nVersion: ${version.replace('V', '')} is now ready.\n\n{blink}PRESS [ENTER] TO RESTART THE GAME{/center}`);
            screen.render();
            playsucesso();
            
            screen.onceKey(['enter'], () => process.exit(0));

        } catch (err) {
            statusWin.style.border.fg = 'red';
statusWin.setContent(`{center}\n{red-fg}FAILED TO INSTALL UPDATE{/red-fg}\n\n${err.message}\n\nPlease try again later.{/center}`);
            screen.render();
            blockMenuInput = false;
        }
    });
}

async function showUpdateStatus() {
    isupdating = true
    if (isUpdateInterfaceActive) return;
    isUpdateInterfaceActive = true;
    
    playwarning();
    let canAcceptInput = false;
    blockMenuInput = true; 

    const bgOverlay = blessed.box({
        parent: screen,
        top: 0, left: 0,
        width: '100%', height: '100%',
        style: { bg: 'black' },
        index: 200
    });

    const statusWin = blessed.box({
        parent: bgOverlay,
        top: 'center', left: 'center',
        width: 60, height: 12,
        border: 'line',
        tags: true,
        content: '{center}\nCONNECTING TO LIGHT REPOSITORY...{/center}',
        style: { border: { fg: COLORDEFAULT }, label: { fg: COLORDEFAULT, bold: true } }
    });

    screen.render();

    const onEnterUpdate = async () => {
        if (!canAcceptInput) return;
        screen.unkey('enter', onEnterUpdate);
        canAcceptInput = false;
        playBeep2();
        await downloadAndInstall(global.latestVersionFound, statusWin);
    };

    checkUpdates(async (hasUpdate, version) => {
    if (hasUpdate === null) {
        statusWin.setContent('{center}\n{red-fg}NETWORK ERROR{/red-fg}\n\nCheck connection.{/center}');
    } else if (hasUpdate) {
        global.latestVersionFound = version;
        
        const treeUrl = `https://api.github.com/repos/lukzst/LIGHT/git/trees/main?recursive=1`;
        const getTreeCmd = `powershell -NoProfile -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (Invoke-RestMethod -Uri '${treeUrl}' -Headers @{'User-Agent'='LIGHT-Updater'}).tree | ConvertTo-Json -Compress"`;

        exec(getTreeCmd, {maxBuffer: 1024 * 1024 * 10}, (error, stdout) => {
            let estimatedTime = "CALCULATING...";
            
            if (!error) {
                const tree = JSON.parse(stdout);
                const targetPrefix = `FINAL/${version}/LIGHT/`;
                const fileCount = tree.filter(item => 
                    item.type === 'blob' && item.path.startsWith(targetPrefix)
                ).length;

                const totalSeconds = Math.round(fileCount * 1.5);
                const mins = Math.floor(totalSeconds / 60);
                const secs = totalSeconds % 60;
                estimatedTime = mins > 0 ? `${mins} MIN ${secs} SEC` : `${secs} SECONDS`;
            }

            statusWin.style.border.fg = 'magenta';
            statusWin.setContent(
                `{center}\n{magenta-fg}UPDATE DETECTED: ${version}{/magenta-fg}\n\n` +
                `NOTE: this update may take a few minutes to complete.\n` +
                `ESTIMATED UPDATE TIME: {yellow-fg}${estimatedTime}{/yellow-fg}.\n\n` +
                `{white-fg}[ENTER] START UPDATE | [ESC] ABORT{/center}`
            );
            screen.render();
        });
        
        setTimeout(() => { 
            canAcceptInput = true; 
            screen.key(['enter'], onEnterUpdate);
        }, 500);

    } else {
        statusWin.setContent(`{center}\n{green-fg}LIGHT IS UP TO DATE{/green-fg}\n\nVersion ${CURRENT_VERSION.replace('V', '')} is current.{/center}\n\n\n\n\n{center}{bold}{grey-fg}PRESS [ESC] TO CLOSE{/grey-fg}{/bold}{/center}`);
    }
    screen.render();
});

    screen.key(['escape'], function escUpdate() {
        if (blockMenuInput && statusWin.getContent().includes('█')) return;
        
        playback();
        screen.unkey('escape', escUpdate);
        screen.unkey('enter', onEnterUpdate);
        
        bgOverlay.destroy();
        isUpdateInterfaceActive = false;
        isupdating = false;
        blockMenuInput = false;
        mainList.focus();
        screen.render();
    });
}


const LOCK_FILE = path.join(os.tmpdir(), 'lux4_game.lock');

const releaseLock = () => {
    if (fs.existsSync(LOCK_FILE)) {
        try { fs.unlinkSync(LOCK_FILE); } catch (e) {}
    }
};

if (fs.existsSync(LOCK_FILE)) {
    let oldPid;
    try {
        oldPid = parseInt(fs.readFileSync(LOCK_FILE, 'utf8'));
    } catch (e) {}

    let isRunning = false;
    if (oldPid) {
        try {
            process.kill(oldPid, 0);
            isRunning = true;
        } catch (e) {
            isRunning = false;
        }
    }

    if (isRunning) {
        const screenLock = blessed.screen({ smartCSR: true });
        const lockBox = blessed.box({
            parent: screenLock,
            top: 'center', left: 'center',
            width: 60, height: 9,
            border: 'line',
            label: ' [ SYSTEM ALERT ] ',
            tags: true,
            content: 
                '\n' +
                '{center}{red-fg}{bold}ACCESS DENIED{/bold}{/red-fg}{/center}\n' +
                '{center}──────────────────────────────────────────────────{/center}\n' +
                '{center}It was detected that the game is already open.{/center}\n' +
                '{center}Close the other instance before trying again.{/center}\n\n' +
                '{center}{red-fg}{bold}HAHA NOPE{/bold}{/red-fg}{/center}',
            style: { border: { fg: 'red' }, label: { fg: 'red', bold: true }, bg: 'black' }
        });

        screenLock.render();
        setTimeout(() => process.exit(0), 3500);
        return;
    } else {

        releaseLock();
    }
}


fs.writeFileSync(LOCK_FILE, process.pid.toString());


process.on('exit', releaseLock);
process.on('SIGINT', releaseLock);
process.on('SIGTERM', releaseLock);
process.on('SIGHUP', releaseLock); 
process.on('uncaughtException', (err) => {
    releaseLock();
    process.exit(1);
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
 'SHADOW_FALL': 'CORE MELTDOWN',
 'SLOWTYPIST': 'SLOW TYPIST',
 'LEAK_SAVED': 'WHISTLEBLOWER',
 'TRUELIGHT': 'THE TRUE LIGHT',
 'AUDIOPHOBIC': 'AUDIOPHOBIC',
 'COLOR_MASTER': 'SPECTRUM ANALYST',
 'RARE_BOOT': 'SYSTEM ANOMALY',
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
 bottom: offset,
 right: 2,
 width: 35,
 height: 5,
 index: 5000,
 border: 'line',
 tags: true,
 content: `{center}{yellow-fg}{bold}ACHIEVEMENT UNLOCKED{/}\n{white-fg}${name}{/center}`,
 style: {
 border: { fg: 'yellow' },
 bg: 'black'
 }
 });
 activeToasts++;
 screen.render();
 playwin()
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
 isBooting2 = false
 mainList.focus();
 screen.render();
}

function bootSequence() {
    isBooting = true;

    const bootContainer = blessed.box({
        parent: screen,
        top: 0, left: 0,
        width: '100%', height: '100%',
        style: { bg: 'black' },
        index: 1000
    });

    const msgBox = blessed.box({
        parent: bootContainer,
        top: 'center', left: 'center',
        width: 65, height: 10,
        border: 'line',
        tags: true,
        content: '{center}\n{yellow-fg}{bold}SYSTEM INTERACTION WARNING{/}\n\n' +
                 'This software is designed to interact with and modify\n' +
                 'local files within the operational directory.\n\n' +
                 '{blink}PRESS [ENTER] TO ACKNOWLEDGE{/}{/center}',
        style: { border: { fg: 'yellow' } }
    });

    screen.render();

    screen.onceKey(['enter'], () => {
        if (EFFECTS_STATUS === 'ON') playBeep2();
        msgBox.destroy();

        const controlsBox = blessed.box({
            parent: bootContainer,
            top: 'center', left: 'center',
            width: 50, height: 14,
            border: 'line',
            label: ' [ SYSTEM CONTROLS ] ',
            tags: true,
            content: '{center}\n' +
                     '{bold}ARROWS{/bold} ........ NAVIGATE MENU  \n' +
                     '{bold}ENTER{/bold} ......... EXECUTE COMMAND \n' +
                     '{bold}ESC{/bold} ........... RETURN / CANCEL \n' +
                     '{bold}[M]{/bold} ............ TOGGLE AUDIO   \n' +
                     '{bold}[C]{/bold} ............ CYCLE COLORS   \n' +
                     '{bold}[G]{/bold} ............ TOGGLE GLITCH  \n' +
                     '{bold}[F1 / I]{/bold} ....... SYSTEM INFO   \n\n\n' +
                     '{cyan-fg}PRESS [ENTER] TO CONTINUE{/}\n{/center}',
            style: { border: { fg: 'cyan' }, label: { fg: 'cyan', bold: true } }
        });

        screen.render();

        setTimeout(() => {
            screen.onceKey(['enter'], () => {
                if (EFFECTS_STATUS === 'ON') playBeep2();
                controlsBox.destroy();

                const devBrandBox = blessed.box({
                    parent: bootContainer,
                    top: 'center', left: 'center',
                    width: '80%', height: 10,
                    tags: true,
                    content: '{center}\n\n{white-fg}A{/}\n\n{yellow-fg}{bold}PALE LUNA DEVELOPER{/bold}{/}\n\n{white-fg}GAME{/}\n\n\n{grey-fg}INITIALIZING...{/}{/center}',
                });
                

                screen.render();

                setTimeout(() => {
                    if (EFFECTS_STATUS === 'ON') playstart();
                    bootContainer.destroy();
                    startLogoAnimation();
                    startupSequence();
                    
                    
                    setTimeout(() => {
                        isBooting = false;
                        mainList.focus();
                        screen.render();
                    }, 500);
                }, 2500); 
            });
        }, 500);
    });
}

function startupSequence() {
    isconquistaActive = false;
    let currentBootIsRare = hasRareBoot || (Math.random() <= 0.10);

    if (currentBootIsRare) {
        let isFirstTimeWinning = !hasRareBoot;

        if (isFirstTimeWinning) {
            isconquistaActive = true;
            showAchievementToast('RARE_BOOT');
            fs.writeFileSync(rareBootPath, 'COMPLETED');
            setTimeout(() => {
                showRareBootUnlockedOverlay();
            }, 2500);
        }

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

        descriptionBox.setContent('{bold}LUX-4 PROTOCOL ACTIVE{/}');
        screen.render();

        const glitchInterval = setInterval(() => {
            easterEggBox.setContent(LUX4_LOGO.replace(/[:+]/g, () => (Math.random() > 0.5 ? '?' : '#')));
            easterEggBox.style.fg = Math.random() > 0.5 ? 'red' : 'white';
            screen.render();
        }, 80);

        if (isFirstTimeWinning) {
            global.bootGlitchInt = glitchInterval;
            global.bootEggBox = easterEggBox;
            global.wasFocusedBoot = wasFocused;
        } else {
            setTimeout(() => {
                clearInterval(glitchInterval);
                easterEggBox.destroy();
                finalizeBoot(wasFocused);
                isconquistaActive = false;
            }, 1500);
        }

    } else {
        initNormalMenu();
    }
}

function finalizeBoot(wasFocused) {
    isconquistaActive = false
    menuBox.show();
    menuBox.append(mainList);
    mainList.show();
    if (wasFocused) mainList.focus();
    initNormalMenu();
    descriptionBox.setContent('{bold}SELECT AN OPTION USING ARROW KEYS AND PRESS ENTER{/}')
    screen.render();
}

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



if (fs.existsSync('../CONFIG/GITHUB_TOKEN.txt')) {
    githubToken = fs.readFileSync('../CONFIG/GITHUB_TOKEN.txt', 'utf8').trim();
    
    const cmdUser = `powershell -NoProfile -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $res = Invoke-RestMethod -Uri 'https://api.github.com/user' -Headers @{'Authorization'='token ${githubToken}'; 'User-Agent'='LIGHT-Game'}; $res | ConvertTo-Json"`;
    
    exec(cmdUser, (err, stdout) => {
        if (!err) {
            try { 
                githubUser = JSON.parse(stdout);
                updateAccountStatus()
            } catch(e) { githubToken = null; }
        } else {
            githubToken = null;
        }
    });
}
if (fs.existsSync('../CONFIG/EFFECTS_STATE.txt')) {
    var EFFECTS_STATUS = fs.readFileSync(path.join('../CONFIG/EFFECTS_STATE.txt'), 'utf8').trim();
} else {
    var EFFECTS_STATUS = 'ON';
    fs.writeFileSync('../CONFIG/EFFECTS_STATE.txt', EFFECTS_STATUS, 'utf8');
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
 var audiostate = 'OFF';
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

let winVersion = os.release()
let userName = os.userInfo().username;
let friendlyName = 'Windows';
if (winVersion.startsWith('10.0.2')) friendlyName = 'Windows 11';
if (winVersion.startsWith('10.0.1')) friendlyName = 'Windows 10';
if (winVersion.startsWith('6.3')) friendlyName = 'Windows 8.1 - NOT SUPPORTED';
if (winVersion.startsWith('6.1')) friendlyName = 'Windows 7 - NOT SUPPORTED';
if (audiostate === 'ON') {
 playAudio()
 }
 fullscreen_pre_save();
const screen = blessed.screen({
 smartCSR: true,
 title: 'LIGHT',
 fullUnicode: true
});
function refreshMenu() {
    const checkPacPath = path.join(__dirname, '..', 'Achievements', 'PACPRO.ach');
    const hasPac = fs.existsSync(checkPacPath);
    const checkNewPac = hasPac && !fs.existsSync('../CONFIG/PACPRO_SEEN.txt');

    let items = ['{center}START GAME{/center}'];

    if (hasPac) {
        if (checkNewPac) {
            items.push('{center}{yellow-fg}MINIGAME (NEW){/yellow-fg}{/center}');
        } else {
            items.push('{center}MINIGAME{/center}');
        }
    }

    items.push('{center}CHECKPOINTS{/center}');
    items.push('{center}ACHIEVEMENTS{/center}');
    items.push('{center}ACCOUNT{/center}');

    items.push('{center}SETTINGS{/center}');
    items.push('{center}UPDATES{/center}');
    items.push('{center}[TOP_SECRET]{/center}');
    items = items.concat([
        '{center}SUPPORT{/center}',
        '{center}CREDITS{/center}',
        '{center}CLOSE{/center}'
    ]);

    try {
        if (typeof mainList !== 'undefined' && mainList !== null) {
            mainList.setItems(items);
            mainList.style.selected.bg = COLORDEFAULT;
            screen.render();
        }
    } catch (e) {}
    
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
 height: 12,
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
 top: 0,
 left: 'center',
 width: '90%',
 height: '95%',
 keys: true,
 mouse: true,
 items: refreshMenu(),
 style: {
 selected: { bg: COLORDEFAULT, fg: 'black' },
 item: { fg: '#bbbbbb' }
 }
});
if (isNewPac) {
 fs.writeFileSync(pacSeenPath, 'SEEN', 'utf8');
}
mainList.on('select item', (item) => {
    playBeep();
 const rawText = item.getText().replace(/{.*?}/g, '').trim();
 const desc = menuDescriptions[rawText] || 'SELECT AN OPTION USING ARROW KEYS AND PRESS ENTER';
 descriptionBox.setContent(`{bold}${desc.toUpperCase()}{/}`);
 screen.render();
});
const loginstatus = blessed.box({
    parent: screen,
    top: 0,
    left: 0,
    width: 'shrink',
    tags: true,
    height: 1, 
    content: '{bold}ACCOUNT STATUS: {red-fg}OFFLINE{/red-fg}{/bold}',
    style: {
        fg: color,
    }
});

function updateAccountStatus() {
    if (githubToken && githubUser) {
        loginstatus.setContent(`{bold}ACCOUNT STATUS: {green-fg}ONLINE (@${githubUser.login.toUpperCase()}){/green-fg}{/bold}`);
    } else {
        loginstatus.setContent('{bold}ACCOUNT STATUS: {red-fg}OFFLINE{/red-fg}{/bold}');
    }
    screen.render();
}

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
 'START GAME': 'START THE PRIMARY OPERATIONAL PROTOCOL.',
 'MINIGAME': 'PLAY THE MINIGAME FROM THE ELEVATOR SEQUENCE.',
 'MINIGAME (NEW)': 'PLAY THE MINIGAME FROM THE ELEVATOR SEQUENCE.',
 'ACHIEVEMENTS': 'SEE YOUR ACHIEVEMENTS',
 'UPDATES': 'CHECK FOR UPDATES.',
 'ACCOUNT': 'LINK YOUR ACCOUNT TO SEE YOUR PROFILE INFORMATION.',
 'CHECKPOINTS': 'SEE YOUR CHECKPOINTS',
 'SETTINGS': 'AUDIO, COLOR, USER AND FULL SCREEN CONFIGURATION.',
 'ERASE DATA': 'ERASE ALL LOCAL USER DATA AND SETTINGS.',
 '[TOP_SECRET]': 'INFORMATION REQUIRES A PASSWORD FOR ACCESS.',
 'CREDITS': 'INFORMATION ABOUT THE DEVELOPMENT TEAM.',
 'SUPPORT': 'HELP THE DEVELOPMENT OF LIGHT GAME.',
 'RESET TIME': 'ERASE ALL PLAYTIME SETTINGS.',
 'CLOSE': 'EXIT THE APPLICATION SAFELY. (DO NOT FORCE CLOSE)'
};


screen.render();
const copyrightBOX1 = blessed.box({
 parent: screen,
 bottom: 0,
 right: '0',
 width: 'shrink',
 height: 1,
 content: CURRENT_VERSION,
 tags: true,
 style: {
 fg: color,
 bold: true,
 },
});


function showResetOptions() {
    const bgOverlay = blessed.box({
        parent: screen,
        top: 0, left: 0,
        width: '100%', height: '100%',
        style: { bg: 'black' },
        index: 200
    });

    const resetWin = blessed.list({
        parent: bgOverlay,
        top: 'center', left: 'center',
        width: 40, height: 10,
        border: 'line',
        label: ' [ SYSTEM RESET ] ',
        keys: true,
        tags: true,
        items: [
            ' RESET DATA (HARD)',
            ' RESET PLAYTIME',
            ' RESET CONFIGS',
            ' BACK'
        ],
        style: {
            border: { fg: 'red' },
            selected: { bg: 'red', fg: 'black' },
        }
    });

    resetWin.focus();
    screen.render();

    resetWin.on('select item', () => {
        playBeep(); 
    });

    resetWin.on('select', (item) => {
        const txt = item.getText();
        if (txt.includes('DATA')) {
            bgOverlay.destroy();
            screen.unkey('escape')
            eraseData();
        } 
        else if (txt.includes('TIME')) {
            bgOverlay.destroy();
            screen.unkey('escape')
            erasePlaytime();
        }
        else if (txt.includes('CONFIGS')) {
            bgOverlay.destroy();
            const pathAch = path.join(__dirname, '..', 'Achievements', 'HARD_RESET.ach');
    if (!fs.existsSync(pathAch)) {
        fs.writeFileSync(pathAch, 'COMPLETED');
        showAchievementToast('HARD_RESET');
    }

    const configs = [
        'AUDIOSTATE.txt', 'EFFECTS_STATE.txt', 'COLORNAME.txt', 
        'COLORDEFAULT.txt', 'USER.txt', 'FULLSCREEN.txt', 
        'DIFFICULTY.txt', 'GLITCH.txt', 'TIME.txt', 'SIDEBAR.txt'
    ];
    configs.forEach(cfg => {
        const p = path.join('../CONFIG/', cfg);
        if (fs.existsSync(p)) fs.unlinkSync(p);
    });

    audiostate = 'OFF';
    EFFECTS_STATUS = 'ON';
    COLORNAME = 'RED';
    COLORDEFAULT = '#ff0000';
    USERNAMEP = 'OPERATOR 07';
    FULLSCREEN = 'OFF';
    DIFFICULTY = 'NORMAL';
    GLITCH = 'ON';
    SIDEBAR = 'OFF';
    TIME_STATUS = 'ON';

    fs.writeFileSync('../CONFIG/TIME.txt', `${TIME_STATUS}\n${TOTAL_PLAYTIME}`, 'utf8');
    fs.writeFileSync('../CONFIG/FULLSCREEN.txt', FULLSCREEN, 'utf8');
    fs.writeFileSync('../CONFIG/AUDIOSTATE.txt', audiostate, 'utf8');
    fs.writeFileSync('../CONFIG/EFFECTS_STATE.txt', EFFECTS_STATUS, 'utf8');
    fs.writeFileSync('../CONFIG/COLORNAME.txt', COLORNAME, 'utf8');
    fs.writeFileSync('../CONFIG/COLORDEFAULT.txt', COLORDEFAULT, 'utf8');
    fs.writeFileSync('../CONFIG/USER.txt', USERNAMEP, 'utf8');
    fs.writeFileSync('../CONFIG/GLITCH.txt', GLITCH, 'utf8');
    fs.writeFileSync('../CONFIG/SIDEBAR.txt', SIDEBAR, 'utf8');

    settingsWin.setItem(0, ' MENU AUDIO: [' + audiostate + ']');
    settingsWin.setItem(1, ' SOUND EFFECTS: [' + EFFECTS_STATUS + ']');
    settingsWin.setItem(2, ' COLOR: [' + COLORNAME + ']');
    settingsWin.setItem(3, ' GLITCH LOGO: [' + GLITCH + ']');
    settingsWin.setItem(4, ' USERNAME: [' + USERNAMEP + ']');
    settingsWin.setItem(5, ' FULL SCREEN: [' + FULLSCREEN + ']');
    settingsWin.setItem(6, ' SIDEBAR: [' + SIDEBAR + ']');
    settingsWin.setItem(7, ' PLAYTIME HUD: [' + TIME_STATUS + ']');

    logoBox.style.fg = COLORDEFAULT;
    mainList.style.selected.bg = COLORDEFAULT;
    settingsWin.style.border.fg = COLORDEFAULT;
    settingsWin.style.selected.bg = COLORDEFAULT;
    hotkeysBar.style.border.fg = COLORDEFAULT;
    statusBox.style.border.fg = COLORDEFAULT;

    if (audiostate === 'ON') {
        playAudio();
    } else {
        stopAudio();
    }

    leftSidebar.hide(); 
    updateStatus();
    settingsWin.focus();
    screen.render();
    
    if (EFFECTS_STATUS === 'ON') playfresh();
            settingsWin.focus();
        }
        else {
            playback()
            bgOverlay.destroy();
            settingsWin.focus();
        }
        screen.render();
    });

    screen.key(['escape'], () => {
        playback()
        bgOverlay.destroy();
        settingsWin.focus();
        screen.unkey('escape', 'enter')
        screen.render();
    });
}


function resetToDefaultsAction() {
    const configs = ['AUDIOSTATE.txt', 'EFFECTS_STATE.txt', 'COLORNAME.txt', 'COLORDEFAULT.txt', 'USER.txt', 'FULLSCREEN.txt', 'DIFFICULTY.txt', 'GLITCH.txt', 'TIME.txt', 'SIDEBAR.txt'];
    configs.forEach(cfg => {
        const p = path.join('../CONFIG/', cfg);
        if (fs.existsSync(p)) fs.unlinkSync(p);
    });
    if (EFFECTS_STATUS === 'ON') playfresh();
}

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
 index: 1000,
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

function playBeep() {
    if (EFFECTS_STATUS === 'OFF') return;
    player.play(beepfile, (err) => {});
}

function playlux4() {
    if (EFFECTS_STATUS === 'OFF') return;
    player.play(BOOTfile, (err) => {});
}

function playBeep2() {
    if (EFFECTS_STATUS === 'OFF') return;
    player.play(beepfile2, (err) => {});
}

function playfresh() {
    if (EFFECTS_STATUS === 'OFF') return;
    if (audiostate === 'ON') {
        stopAudio();
        setTimeout(() => {
            player.play(freshfile, (err) => {
                if (audiostate === 'ON') playAudio();
            });
        }, 500);
    } else {
        player.play(freshfile, (err) => {});
    }
}

function playwin() {
    if (EFFECTS_STATUS === 'OFF') return;
    if (audiostate === 'ON') {
        stopAudio();
        setTimeout(() => {
            player.play(winfile, (err) => {
                if (audiostate === 'ON') playAudio();
            });
        }, 500);
    } else {
        player.play(winfile, (err) => {});
    }
}

function playwarning() {
    if (EFFECTS_STATUS === 'OFF') return;
        player.play(warningfile, (err) => {});
}

function playsupport() {
    if (EFFECTS_STATUS === 'OFF') return;
    if (audiostate === 'ON') {
        stopAudio();
        setTimeout(() => {
            player.play(supportfile, (err) => {
                if (audiostate === 'ON') playAudio();
            });
        }, 500);
    } else {
        player.play(supportfile, (err) => {});
    }
}

function playback() {
    if (EFFECTS_STATUS === 'OFF') return;
    player.play(backfile, (err) => {});
}

function playstart() {
    if (EFFECTS_STATUS === 'OFF') return;
    
        player.play(startfile, (err) => {});
}

function playsucesso() {
    if (EFFECTS_STATUS === 'OFF') return;
    player.play(sucessofile, (err) => {});
}

function playcheckpoint() {
    if (EFFECTS_STATUS === 'OFF') return;
    if (audiostate === 'ON') {
        stopAudio();
        setTimeout(() => {
            player.play(checkpointfile, (err) => {
                if (audiostate === 'ON') playAudio();
            });
        }, 500);
    } else {
        player.play(checkpointfile, (err) => {});
    }
}

function confirmExit() {
    playwarning()
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
 selected: { bg: COLORDEFAULT, fg: 'black' }
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
    playback()
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

function showRareBootUnlockedOverlay() {
    playwin();
    isconquistaActive = true; 

    const overlay = blessed.box({
        parent: screen,
        top: 0, left: 0,
        width: '100%', height: '100%',
        style: { bg: 'black' },
        index: 10000
    });

    const achBox = blessed.box({
        parent: overlay,
        top: 'center', left: 'center',
        width: 50, height: 12,
        border: 'line',
        label: ' [ ACHIEVEMENT UNLOCKED ] ',
        tags: true,
        content: '{center}\n{yellow-fg}{bold}SYSTEM ANOMALY{/bold}{/}\n\n' +
                 'The rare LUX-4 initialization sequence\n' +
                 'has been permanently synchronized.\n\n' +
                 '{white-fg}This boot protocol is now your default.{/}\n\n' +
                 '{cyan-fg}[ENTER] TO CONTINUE{/center}',
        style: { border: { fg: 'yellow' }, label: { fg: 'yellow', bold: true } }
    });

    screen.render();

    setTimeout(() => {
        screen.onceKey(['enter'], () => {
            blockMenuInput = true;

            if (global.bootGlitchInt) clearInterval(global.bootGlitchInt);
            if (global.bootEggBox) global.bootEggBox.destroy();
            
            overlay.destroy();
            finalizeBoot(global.wasFocusedBoot);
            
            isconquistaActive = false; 

            setTimeout(() => {
                blockMenuInput = false;
            }, 500);

            screen.render();
        });
    }, 500);
}

function credits() {
    if (iscreditsOpen) return;
    if (audiostate === 'ON') {
        stopAudio();
    }
    
    iscreditsOpen = true;
    let slideTimer = null;
    let buttonsActive = false; 
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

    const skipMsg = blessed.box({
        parent: bgOverlay,
        bottom: 2, left: 'center',
        width: 'shrink', height: 1,
        tags: true,
        content: '{grey-fg}{bold}PRESS [ESC] TO CLOSE{/grey-fg}{/}',
        style: { fg: '#555555' }
    });

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
        `{center}{yellow-fg}QUALITY ASSURANCE{/yellow-fg}\n\n{bold}LUIZ OTÁVIO{/bold}{/center}`,
        `{center}{yellow-fg}ENDING THEME{/yellow-fg}\n\n{bold}THE LAST CHOICE - LIGHT OST{/bold}{/center}`,
        `{center}{yellow-fg}PUBLICITY{/yellow-fg}\n\n{bold}PALE LUNA DEVELOPER{/bold}{/center}`,
        `{center}{yellow-fg}BETA TESTERS{/yellow-fg}\n\n{bold}LUCAS EDUARDO, ISABELLA SANCHES, LUIZ OTÁVIO and some friends{/bold}{/center}`,
        `{center}{yellow-fg}PRODUCT COORDINATOR{/yellow-fg}\n\n{bold}LUCAS EDUARDO{/bold}{/center}`,
        `{center}{yellow-fg}THANKS FOR PLAYING{/yellow-fg}`,
        `{center}CREATED BY PALE LUNA DEVELOPER\n\n${currentYear} © ALL RIGHTS RESERVED{/center}`
    ]; 

    let currentSlide = 0;
    const finalMenu = blessed.list({
        parent: bgOverlay,
        top: 'center',
        left: 'center',
        width: 35,
        height: 8,
        border: 'line',
        label: ' [ SESSION END ] ',
        tags: true,
        hidden: true,
        keys: true,
        items: [
            '{center}INSTAGRAM{/center}',
            '{center}CLOSE{/center}'
        ],
        style: {
            border: { fg: COLORDEFAULT },
            label: { fg: COLORDEFAULT, bold: true },
            selected: { bg: COLORDEFAULT, fg: 'black' }
        }
    });

    const closeCredits = () => {
        iscreditsOpen = false;
        buttonsActive = false;
        if (slideTimer) clearTimeout(slideTimer);
        stopcreditsaudio();
        bgOverlay.destroy();
        mainList.focus();
        if (audiostate === 'ON') playAudio();
        screen.render();
    };

    function blockEnter(ch, key) {
        if (key.name === 'enter' && !buttonsActive) {
            return false;
        }
    }
    screen.on('keypress', blockEnter);

    function showNextSlide() {
        if (!iscreditsOpen) return;
        if (currentSlide < slides.length) {
            displayBox.setContent("");
            screen.render();
            slideTimer = setTimeout(() => {
                if (!iscreditsOpen) return;
                displayBox.setContent(slides[currentSlide]);
                currentSlide++;
                screen.render();
                slideTimer = setTimeout(showNextSlide, 5500); 
            }, 1600);
        } else {
            stopcreditsaudio();
            displayBox.hide();
            skipMsg.hide();
            finalMenu.show();
            setTimeout(() => {
                buttonsActive = true;
                finalMenu.focus();
                screen.render();
            }, 500);
        }
    }

    setTimeout(() => { if (iscreditsOpen) playcreditsaudio(); }, 200);
    showNextSlide();

    screen.onceKey(['escape'], closeCredits);

    finalMenu.on('select item', () => { if(buttonsActive) playBeep(); });
    
    finalMenu.on('select', (item) => {
        if (!buttonsActive) return;
        const txt = item.getText();
        if (txt.includes('INSTAGRAM')) {
            playBeep2()
            exec('start https://instagram.com/PlayLightGame');
        }
        if (txt.includes('CLOSE')) {
            playBeep2()
            closeCredits();
        }
    });

    screen.render();
}
function eraseData() {
    isERASE = true
    playwarning();
    const bg1Overlay = blessed.box({
        parent: screen,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        style: { bg: 'black' },
        index: 100
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
        selected: 1, 
        style: {
            border: { fg: COLORDEFAULT },
            selected: { bg: COLORDEFAULT, fg: 'black' }
        }
    });

    eraseWin.focus();
    screen.render();

    eraseWin.on('select item', () => {
        playBeep();
    });

    eraseWin.on('select', (item) => {
        const txt = item.getText();

        if (txt.includes('NO')) {
            playback();
            bg1Overlay.destroy();
            settingsWin.focus();
            screen.render();
            return;
        }

        if (txt.includes('YES')) {
            playfresh();
            eraseWin.destroy();

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
            }, 50);

            setTimeout(() => {
                clearInterval(logInterval);
                logBox.setContent(`{center}\n\n\n{bold}DATA PURGE COMPLETE{/}{/center}`);
                screen.render();
                
                setTimeout(() => {
                    const eraser = spawn('node', ['./EraseData.js'], { stdio: 'inherit' });
                    
                    eraser.on('close', () => {
                        TIME_STATUS = 'ON';
                        COLORNAME = 'RED';
                        COLORDEFAULT = '#ff0000';
                        
                        bg1Overlay.destroy();
                        
                        refreshMenu();
                        isERASE = false
                            settingsWin.focus();
                        screen.render();
                    });
                }, 1500); 
            }, 2500);
        }
    });
}

function erasePlaytime() {
    playwarning()
    isERASE = true
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

    const eraseWin = blessed.list({
        parent: bg1Overlay,
        top: 'center',
        left: 'center',
        width: 45,
        height: 12,
        border: 'line',
        label: ' [ TEMPORAL RESET ] ',
        keys: true,
        tags: true,
        items: [
            `{center}{cyan-fg}CURRENT TIME: ${formatTime(TOTAL_PLAYTIME)}{/}{/center}`,
            `{center}───────────────────────────{/center}`,
            '{center}YES, RESET CLOCK{/center}', 
            '{center}NO, ABORT{/center}'
        ],
        selected: 3,
        style: {
            border: { fg: COLORDEFAULT },
            selected: { bg: COLORDEFAULT, fg: 'black' }
        }
    });
    eraseWin.select(2); 
    eraseWin._lastIdx = 2;
    
    eraseWin.on('select item', () => {
        playBeep();
    });

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
        
        if (txt.includes('SESSION') || txt.includes('──')) return;

        if (txt.includes('NO')) {
            playback()
            bg1Overlay.destroy();
            if (issettigsopen && settingsWin) {
            settingsWin.focus();
        } else {
        mainList.focus();
    }
            screen.render();
            return;
        }

        if (txt.includes('YES')) {
            playfresh()
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
                "STABILIZING TIME...",
                "STABILIZING FADE...",
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
                        isERASE = false
                        if (issettigsopen && settingsWin) {
                                settingsWin.focus();
                            } else {
                                mainList.focus();
                            }
                        screen.render();
                        descriptionBox.setContent('{yellow-fg}TIME DATA HAS BEEN PURGED SUCCESSFULLY.{/}');
                    }, 1500);
                });
            }, 2300);
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
        
        const isReached = currentIndex >= i;

        blessed.box({
            parent: listContainer,
            top: row * (cardHeight + 1),
            left: col * (cardWidth + 2),
            width: cardWidth, height: cardHeight,
            border: 'line', tags: true,
            style: { 
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
        playback()
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
 transparent: false
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
 width: 44,
 height: 13,
 border: 'line',
 label: ' [ SETTINGS ] ',
 keys: true,
 tags:true,
 items: [
 ' MENU AUDIO: [' + audiostate + ']',
 ' SOUND EFFECTS: [' + EFFECTS_STATUS + ']',
 ' COLOR: [' + COLORNAME + ']',
 ' GLITCH LOGO: [' + GLITCH + ']',
 ' USERNAME: [' + USERNAMEP + ']',
 ' FULL SCREEN: [' + FULLSCREEN + ']',
 ' SIDEBAR: [' + SIDEBAR + ']',
 ' PLAYTIME HUD: [' + TIME_STATUS + ']',
 '{white-fg}─────────────────────────────────────────{/white-fg}',
 ' SYSTEM RESETS ',
 ' BACK TO MENU '
 ],
 selected: 0,
 style: {
 border: { fg: COLORDEFAULT },
 selected: { bg: COLORDEFAULT, fg: 'black' }
 }
 });
 settingsWin._lastIndex = 0;
  settingsWin.on('select item', (item, index) => {
    playBeep()
    if (index === 8) {
      if (settingsWin._lastIndex < index) {
        settingsWin.select(9);
      } else {
        settingsWin.select(7);
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
 playBeep()
 if (txt.includes('───')) return;
 if (txt.includes('BACK')) {
  issettigsopen = false
  playback()
  refreshMenu()
 bgOverlay.destroy();
 mainList.focus();
 screen.render();
 return;
 }

 if (txt.includes('SYSTEM RESETS')) {
    playBeep2();
    return showResetOptions();
}


 if (txt.includes('PLAYTIME HUD')) {
        TIME_STATUS = (TIME_STATUS === 'ON') ? 'OFF' : 'ON';
        playBeep2()
        fs.writeFileSync('../CONFIG/TIME.txt', `${TIME_STATUS}\n${TOTAL_PLAYTIME}`, 'utf8');
        
        settingsWin.setItem(7, ' PLAYTIME HUD: [' + TIME_STATUS + ']');
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
    playwarning()
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
 width: 60,
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
 screen.render(); 
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
 settingsWin.setItem(0, ' MENU AUDIO: [' + audiostate + ']');
 }
 
 
 if (txt.includes('COLOR')) {
 if (COLORDEFAULT === '#ff0000') {
    playBeep2()
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
    playBeep2()
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
    playBeep2()
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
 settingsWin.setItem(2, ' COLOR: [' + COLORNAME + ']');
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
    playBeep2()
 const bgOverlay1 = blessed.box({
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
    playsucesso()
 USERNAMEP = value.trim().toUpperCase();
 if (fs.existsSync('../CONFIG/USER.txt')) {
 fs.unlinkSync('../CONFIG/USER.txt');
 }
 fs.writeFileSync('../CONFIG/USER.txt', USERNAMEP, 'utf8');
 settingsWin.setItem(4, ' USERNAME: [' + USERNAMEP + ']');
 }
 input.destroy();
 bgOverlay1.destroy();
 screen.render();
 });
 input.on('cancel', () => {
    playback()
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
 playBeep2()
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
 settingsWin.setItem(5, ' FULL SCREEN: [' + FULLSCREEN + ']');
 screen.render();
}
if (txt.includes('GLITCH')) {
 GLITCH = (GLITCH === 'ON') ? 'OFF' : 'ON';
 playBeep2()
 if (fs.existsSync('../CONFIG/GLITCH.txt')) {
 fs.unlinkSync('../CONFIG/GLITCH.txt');
 }
 fs.writeFileSync('../CONFIG/GLITCH.txt', GLITCH, 'utf8');
 settingsWin.setItem(3, ' GLITCH LOGO: [' + GLITCH + ']');
 screen.render();
}
if (txt.includes('SIDEBAR')) {
 SIDEBAR = (SIDEBAR === 'ON') ? 'OFF' : 'ON';
 playBeep2()
 fs.writeFileSync('../CONFIG/SIDEBAR.txt', SIDEBAR, 'utf8');
 settingsWin.setItem(6, ' SIDEBAR: [' + SIDEBAR + ']');
 if (SIDEBAR === 'ON') {
 leftSidebar.show();
 } else {
 leftSidebar.hide();
 }
 screen.render();
}


if (txt.includes('SOUND EFFECTS')) {
    EFFECTS_STATUS = (EFFECTS_STATUS === 'ON') ? 'OFF' : 'ON';
    

    fs.writeFileSync('../CONFIG/EFFECTS_STATE.txt', EFFECTS_STATUS, 'utf8');

    settingsWin.setItem(1, ' SOUND EFFECTS: [' + EFFECTS_STATUS + ']');
    

    if (EFFECTS_STATUS === 'ON') playBeep2();
    
    screen.render();
}

if (txt.includes('RESET')) {
    const pathAch = path.join(__dirname, '..', 'Achievements', 'HARD_RESET.ach');
    if (!fs.existsSync(pathAch)) {
        fs.writeFileSync(pathAch, 'COMPLETED');
        showAchievementToast('HARD_RESET');
    }

    const configs = [
        'AUDIOSTATE.txt', 'EFFECTS_STATE.txt', 'COLORNAME.txt', 
        'COLORDEFAULT.txt', 'USER.txt', 'FULLSCREEN.txt', 
        'DIFFICULTY.txt', 'GLITCH.txt', 'TIME.txt', 'SIDEBAR.txt'
    ];
    configs.forEach(cfg => {
        const p = path.join('../CONFIG/', cfg);
        if (fs.existsSync(p)) fs.unlinkSync(p);
    });

    audiostate = 'OFF';
    EFFECTS_STATUS = 'ON';
    COLORNAME = 'RED';
    COLORDEFAULT = '#ff0000';
    USERNAMEP = 'OPERATOR 07';
    FULLSCREEN = 'OFF';
    DIFFICULTY = 'NORMAL';
    GLITCH = 'ON';
    SIDEBAR = 'OFF';
    TIME_STATUS = 'ON';

    fs.writeFileSync('../CONFIG/TIME.txt', `${TIME_STATUS}\n${TOTAL_PLAYTIME}`, 'utf8');
    fs.writeFileSync('../CONFIG/FULLSCREEN.txt', FULLSCREEN, 'utf8');
    fs.writeFileSync('../CONFIG/AUDIOSTATE.txt', audiostate, 'utf8');
    fs.writeFileSync('../CONFIG/EFFECTS_STATE.txt', EFFECTS_STATUS, 'utf8');
    fs.writeFileSync('../CONFIG/COLORNAME.txt', COLORNAME, 'utf8');
    fs.writeFileSync('../CONFIG/COLORDEFAULT.txt', COLORDEFAULT, 'utf8');
    fs.writeFileSync('../CONFIG/USER.txt', USERNAMEP, 'utf8');
    fs.writeFileSync('../CONFIG/GLITCH.txt', GLITCH, 'utf8');
    fs.writeFileSync('../CONFIG/SIDEBAR.txt', SIDEBAR, 'utf8');

    settingsWin.setItem(0, ' MENU AUDIO: [' + audiostate + ']');
    settingsWin.setItem(1, ' SOUND EFFECTS: [' + EFFECTS_STATUS + ']');
    settingsWin.setItem(2, ' COLOR: [' + COLORNAME + ']');
    settingsWin.setItem(3, ' GLITCH LOGO: [' + GLITCH + ']');
    settingsWin.setItem(4, ' USERNAME: [' + USERNAMEP + ']');
    settingsWin.setItem(5, ' FULL SCREEN: [' + FULLSCREEN + ']');
    settingsWin.setItem(6, ' SIDEBAR: [' + SIDEBAR + ']');
    settingsWin.setItem(7, ' PLAYTIME HUD: [' + TIME_STATUS + ']');

    logoBox.style.fg = COLORDEFAULT;
    mainList.style.selected.bg = COLORDEFAULT;
    settingsWin.style.border.fg = COLORDEFAULT;
    settingsWin.style.selected.bg = COLORDEFAULT;
    hotkeysBar.style.border.fg = COLORDEFAULT;
    statusBox.style.border.fg = COLORDEFAULT;

    if (audiostate === 'ON') {
        playAudio();
    } else {
        stopAudio();
    }

    leftSidebar.hide(); 
    updateStatus();
    settingsWin.focus();
    screen.render();
    
    if (EFFECTS_STATUS === 'ON') playfresh();
}
 screen.render();
 });
}
function stopAudio() {
    if (bgmProcess) {
        bgmProcess.kill();
        bgmProcess = null;
    }
    exec('taskkill /F /IM cmdmp3.exe /T > nul 2>&1');
}

screen.key(['-'], () => {
    if (isOverrideActive || issettigsopen || isGalleryOpen || iscreditsOpen || issupportOpen || isBooting || isBooting2 || isERASE || isupdating || account) {
        return;
    }

    isOverrideActive = true;
    if (typeof playsupport === 'function') playsupport();

    const overlay = blessed.box({
        parent: screen,
        top: 0, left: 0,
        width: '100%', height: '100%',
        style: { bg: 'black' },
        index: 9999
    });

    const confirmBox = blessed.box({
        parent: overlay,
        top: 'center', left: 'center',
        width: 50, height: 10,
        border: 'line',
        label: ' [ SYSTEM OVERRIDE ] ',
        tags: true,
        content: '{center}\n{bold}ADMINISTRATIVE UNLOCK DETECTED{/bold}\n\n' +
                 'This will bypass all encryption and unlock\n' +
                 'selected localized data sectors.\n\n' +
                 '{yellow-fg}[ENTER]{/} PROCEED | {white-fg}[ESC]{/} ABORT{/center}',
        style: { border: { fg: 'yellow' }, label: { fg: 'yellow', bold: true } }
    });

    let borderTick = false;
    const blinkInterval = setInterval(() => {
        if (confirmBox && confirmBox.screen) {
            borderTick = !borderTick;
            confirmBox.style.border.fg = borderTick ? 'white' : 'yellow';
            screen.render();
        }
    }, 500);

    function cleanup() {
        clearInterval(blinkInterval);
        screen.unkey('enter', handleEnter);
        screen.unkey('escape', handleEscape);
        if (overlay) overlay.destroy();
        isOverrideActive = false;
        if (typeof mainList !== 'undefined') mainList.focus();
        screen.render();
    }

    function handleEscape() {
        if (typeof playback === 'function') playback();
        cleanup();
    }

    function handleEnter() {
        screen.unkey('enter', handleEnter);
        screen.unkey('escape', handleEscape);
        clearInterval(blinkInterval);
        confirmBox.destroy();
        const achievementsList = (typeof ALL_ACHIEVEMENTS !== 'undefined') ? ALL_ACHIEVEMENTS : [];
        let selectedStatus = achievementsList.map(() => false);

        const listContainer = blessed.box({
            parent: overlay,
            top: 'center', left: 'center',
            width: 70, height: 18,
            border: 'line',
            tags: true,
            label: ' [ SELECT DATA SECTORS ] ',
            style: { border: { fg: 'yellow' }, label: { fg: 'yellow', bold: true } }
        });

        const achList = blessed.list({
            parent: listContainer,
            top: 1, left: 1, right: 1, bottom: 3,
            keys: true,
            mouse: true,
            tags: true,
            scrollbar: { ch: ' ', track: { bg: 'cyan' }, style: { inverse: true } },
            style: {
                item: { fg: 'white' },
                selected: { fg: 'black', bg: 'yellow' }
            },
            items: achievementsList.map(a => `[ ] ${a.id}`)
        });

        blessed.text({
            parent: listContainer,
            bottom: 1, left: 'center', width: '90%',
            content: '{yellow-fg}[SPACE]{/} Toggle | {yellow-fg}[ENTER]{/} Execute Protocol | {yellow-fg}[P]{/} Select All',
            tags: true
        });

        const updateList = () => {
            const currentPos = achList.selected;
            achList.setItems(achievementsList.map((a, i) => {
                return selectedStatus[i] ? `{green-fg}[X] ${a.id}{/}` : `[ ] ${a.id}`;
            }));
            achList.select(currentPos);
            screen.render();
        };

        achList.on('keypress', (ch, key) => {

            if (key.name === 'p') {
                const areAllSelected = selectedStatus.every(status => status === true);
                selectedStatus = selectedStatus.map(() => !areAllSelected);
                
                if (typeof play_sound === 'function') play_sound('SELECT.wav');
                updateList();
            }

            if (key.name === 'space') {
                selectedStatus[achList.selected] = !selectedStatus[achList.selected];
                if (typeof play_sound === 'function') play_sound('SELECT.wav');
                updateList();
            }
        });

        achList.focus();
        screen.render();

        achList.on('select', () => {
            const selectedIds = achievementsList
                .filter((_, i) => selectedStatus[i])
                .map(a => a.id);

            if (selectedIds.length === 0) {
                cleanup();
                return;
            }

            listContainer.destroy();

            const logBox = blessed.log({
                parent: overlay,
                top: 'center', left: 'center',
                width: '85%', height: '85%',
                border: 'line',
                label: ' [ EXECUTING PROTOCOL ] ',
                style: { border: { fg: 'red' }, fg: 'red' },
                tags: true
            });

            if (typeof playfresh === 'function') playfresh();

            const messages = [
                "ACCESSING RESTRICTED FILESYSTEM...",
                "BYPASSING KERNEL ENCRYPTION...",
                "INJECTING ADMIN CREDENTIALS...",
                `WRITING ${selectedIds.length} LOCAL SECTORS...`,
                "SYNCHRONIZING DATABASE..."
            ];

            let msgIdx = 0;
            const logInt = setInterval(() => {
                try {
                    if (msgIdx < messages.length) {
                        logBox.log(`{white-fg}> ${messages[msgIdx]}{/}`);
                        msgIdx++;
                        screen.render();
                    } else {
                        clearInterval(logInt);
                        
                        selectedIds.forEach(id => {
                            try {
                                const fileAch = path.join(achDir, `${id}.ach`);
                                fs.writeFileSync(fileAch, 'COMPLETED', 'utf8');
                                logBox.log(`{green-fg}[OK] SECTOR ${id} SYNCHRONIZED{/}`);
                            } catch (err) {
                                logBox.log(`{red-fg}[ERR] ${id}: ${err.message}{/}`);
                            }
                        });

                        logBox.log("\n{green-fg}SYSTEM OVERRIDE COMPLETE. REBOOTING...{/}");
                        screen.render();
                        
                        setTimeout(() => {
                            try {
                                overlay.destroy();
                                isOverrideActive = false;
                                if (typeof refreshMenu === 'function') refreshMenu(); 
                                if (typeof mainList !== 'undefined') mainList.focus();
                                screen.render();
                            } catch (e) { process.exit(0); }
                        }, 2500);
                    }
                } catch (fatal) {
                    clearInterval(logInt);
                    process.exit(1);
                }
            }, 400);
        });
    }

    screen.onceKey('escape', handleEscape);
    screen.onceKey('enter', handleEnter);
    screen.render();
});

function playAudio() {
    if (audiostate !== 'ON') {
        stopAudio();
        return;
    }
    if (bgmProcess) return;

    bgmProcess = player.play(audioFile, function(err) {
        bgmProcess = null;

        if (!err || (err && !err.killed)) {
            playAudio();
        }
    });
}

function stopcreditsaudio() {
    if (vlcProcess) {
        vlcProcess.kill();
        vlcProcess = null;
    }
    spawn('taskkill', ['/F', '/IM', 'cmdmp3.exe', '/T']);
}

function playcreditsaudio() {
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
 ` {bold}ENCRYPTION KEY:{/}   ${key}\n`,
 ` [ESC] TO RETURN`
 ].join('\n');
 infoBox.setContent(text);
 screen.key(['escape'], closeInfo);
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
 showAchievementToast('OVERRIDE'); 
 }
 input.destroy();
 renderData();
 } else {
    playwarning()
 input.destroy();
 backdrop.destroy();
 mainList.focus();
 closeInfo();
 descriptionBox.setContent('{red-fg}INVALID AUTHORIZATION CODE. ACCESS DENIED.{/}');
 screen.render();
 }
 });
 input.on('cancel', closeInfo);
 }
 function closeInfo() {
    playback()
 backdrop.destroy();
 mainList.focus();
 screen.unkey('escape', closeInfo);
 screen.render();
 }
 screen.key(['escape'], closeInfo);
 screen.render();
}
function supportGame() {
    issupportOpen = true;
    playsupport();
    
    const bg1Overlay = blessed.box({
        parent: screen,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        index: 100,
        style: { bg: 'black' }
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

    blessed.box({
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
            selected: { bg: COLORDEFAULT, fg: 'black' }
        }
    });

    const closeSupport = () => {
        issupportOpen = false;
        playback();
        screen.unkey('escape', closeSupport);
        bg1Overlay.destroy();
        mainList.focus();
        screen.render();
    };

    screen.onceKey(['escape'], closeSupport);

    supportOptions.focus();

    supportOptions.on('select item', () => {
        playBeep();
    });

    supportOptions.on('select', (item) => {
        const text = item.getText();
        if (text.includes('ITCH.IO')) {
            exec('start https://palelunadev.itch.io/light');
            playBeep2();
        }
        else if (text.includes('TWITTER')) {
            const tweetText = encodeURIComponent("I'm playing LIGHT! A unique terminal horror experience. Check it out here: https://palelunadev.itch.io/light");
            exec(`start https://twitter.com/intent/tweet?text=${tweetText}`);
            playBeep2();
        }
        else if (text.includes('CLOSE')) {
            closeSupport();
        }
        screen.render();
    });

    screen.render();
}
function Achievements() {
 achScreenCount++;
 playBeep2()
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
 if (unlockedCount === 19 && !fs.existsSync(trueLightPath)) {
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
    playBeep2()
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

 hintListWin.on('select item', () => {
  playBeep(); 
});
 hintListWin.focus();
 screen.render();

 hintListWin.on('select', (item, index) => {
 const selectedAch = ALL_ACHIEVEMENTS[index];
 hintDisplay.setContent(`{center}{yellow-fg}HINT [${selectedAch.id}]: ${selectedAch.hint}{/center}`);
 playBeep2()
 hintDisplay.style.border.fg = 'yellow';
 bg1Overlay.destroy()
 hintListWin.destroy();
 listContainer.focus();
 screen.render();
 });
 const closeSub = () => {
    playback()
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
    playback()
screen.unkey('h', openHintMenu);  
screen.unkey('H', openHintMenu);     
screen.unkey('escape', closeAchievements); 
 backdrop.destroy();
 mainList.focus();
 screen.render();
 };
 screen.key(['escape'], closeAchievements);
 screen.render();
}
screen.on('keypress', (ch, key) => {
const k = (ch || key.full || "").toLowerCase();
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
 showAchievementToast('AUDIOPHOBIC');
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

 if (k === 'q') {
        return confirmExit(); 
    }
 if (k === 'c') {
  if (isGalleryOpen) return;
  if (issettigsopen) return;
  if (iscreditsOpen) return;
  if (issupportOpen) return;
colorCycles++;
if (colorCycles >= 15) {
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
 updateStatus();
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
 hidden: SIDEBAR === 'OFF',
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
 top: 9,
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
    if (isBooting) return;
    if (isOverrideActive) return;
    if (blockMenuInput) return;



 const text = item.getText();
 if (text.includes('MINIGAME')) {
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
        menuBox.style.border.fg = '#555555'; 
        menuBox.setContent(''); 
        menuBox.append(mainList);
        updateStatus(); 
        refreshMenu(); 
        mainList.focus();
        screen.render();
    }, 3000);
 });
 }, 1500);
 return;
}
if (text.includes('UPDATES')) {
    blockMenuInput = true; 
    const currentItems = mainList.items;
    
    showUpdateStatus();

    setTimeout(() => {
        blockMenuInput = false;
    }, 500);
    
    return;
}
 if (text.includes('CLOSE')) {return confirmExit();}
 if (text.includes('SETTINGS')) {playBeep2(); return showSettings();}
 if (text.includes('[TOP_SECRET]')) {playwarning(); return showSystemInfo();}
 if (text.includes('ERASE DATA')) {playwarning(); return eraseData();}
 if (text.includes('CREDITS')) { return credits() ; } 
 if (text.includes('SUPPORT')) { return supportGame() ; }
 if (text.includes('ACHIEVEMENTS')) { return Achievements(); }
 if (text.includes('CHECKPOINTS')) {  playBeep2();return showCheckpointGallery(); }
 if (text.includes('START GAME')) {
 mainList.detach();
 let dots = 0;
 const loader = setInterval(() => {
    
 menuBox.setContent(`\n\n{center}INITIALIZING${".".repeat(dots)}{/center}`);
 screen.render();
 dots = (dots + 1) % 4;
 }, 300);
 stopAudio()
 setTimeout(() => {
 clearInterval(loader);
 menuBox.destroy();
 mainList.destroy();
 screen.destroy();
 playBeep()
 const child = spawn('node', ['main.js'], {
 stdio: 'inherit',
 });
 child.on('exit', () => {
 process.exit();
 });
 }, 3000); 
 }
 if (text.includes('RESET TIME')) {
  return erasePlaytime();
}
if (text.includes('ACCOUNT')) {
    account = true;
    screen.unkey('escape');
    
    if (githubToken && githubUser) {
        playBeep2();
        const bgOverlay = blessed.box({
            parent: screen,
            top: 0, left: 0,
            width: '100%', height: '100%',
            style: { bg: 'black' },
            index: 300
        });

        const profileWin = blessed.box({
            parent: bgOverlay,
            top: 'center', left: 'center',
            width: 85, height: 22,
            border: 'line',
            label: ` [ @${githubUser.login.toUpperCase()} ] `,
            tags: true,
            style: { border: { fg: 'cyan' }, label: { fg: 'cyan', bold: true }, bg: '#050505' }
        });

        blessed.box({
            parent: profileWin,
            top: 0, left: 0, right: 0, height: 3,
            align: 'center', tags: true,
            content: `\n{bold}{cyan-fg}GITHUB{/} NETWORK {/bold}`,
            style: { bg: '#111' }
        });

        const socialData = [
            `{cyan-fg}{bold}${githubUser.name || githubUser.login}{/}`,
            `{bold}{grey-fg}@${githubUser.login}{/}{/bold}\n`,
            `{white-fg}${githubUser.bio || "No sector description available."}{/}\n`,
            `{bold}LOCATION:{/bold}  ${githubUser.location || "UNKNOWN"}`,
            `{bold}FOLLOWERS:{/bold} ${githubUser.followers}`,
            `{bold}GISTS:{/bold}     ${githubUser.public_gists}`
        ].join('\n');

        blessed.box({ parent: profileWin, top: 5, left: 3, width: '55%', height: 10, tags: true, content: socialData });


        const currentAchs = fs.readdirSync(path.join(__dirname, '../Achievements')).filter(f => f.endsWith('.ach')).length;
        const systemStats = [
            `{center}{yellow-fg}OPERATIONAL STATS{/}`,
            `{center}────────────────{/}`,
            `{bold}VERSION:{/bold} ${CURRENT_VERSION}`,
            `{bold}PC-USER:{/bold} ${userName.toUpperCase()}`,
            `{bold}ACHS:{/bold}    ${currentAchs}/${ALL_ACHIEVEMENTS.length}`,
            ``,
            ` {bold}STORAGE:{/bold} CLOUD GIST`
        ].join('\n');

        blessed.box({
            parent: profileWin,
            top: 5, right: 3, width: '35%', height: 10,
            border: 'line', tags: true, content: systemStats,
            style: { border: { fg: 'rgb(102, 102, 102)' } }
        });

        const profileActions = blessed.list({
            parent: profileWin,
            bottom: 1, left: 2,
            width: '40%', height: 4,
            keys: true, mouse: true, tags: true,
            items: [
                ' SYNC DATA TO CLOUD ',
                ' RESTORE DATA FROM CLOUD ',
                ' DISCONNECT GITHUB ACCOUNT ',
                ' RETURN TO MENU '
            ],
            style: { selected: { bg: 'cyan', fg: 'black'}, item: { fg: 'cyan' } }
        });

        profileActions.focus();
        screen.render();

        profileActions.on('select item', (item) => {
    playBeep();
        });

        profileActions.on('select', async (item) => {
            const ptext = item.getText();
            playBeep2();

            if (ptext.includes('SYNC')) {
                profileWin.setLabel(' [ UPLOADING DATA... ] ');
                screen.render();

                const saveData = {
                    achievements: fs.readdirSync(path.join(__dirname, '../Achievements')).filter(f => f.endsWith('.ach')),
                    config: { user: USERNAMEP, color: COLORDEFAULT, glitch: GLITCH }
                };
                
                const base64Data = Buffer.from(JSON.stringify(saveData)).toString('base64');
                const syncCmd = `powershell -NoProfile -Command "$headers = @{'Authorization'='token ${githubToken}'; 'Accept'='application/json'}; $body = @{description='LIGHT_SAVE'; public=$false; files=@{'light_save.bin'=@{content='${base64Data}'}}} | ConvertTo-Json -Depth 10; $gists = Invoke-RestMethod -Uri 'https://api.github.com/gists' -Headers $headers; $exists = $gists | Where-Object {$_.description -eq 'LIGHT_SAVE'}; if($exists){ Invoke-RestMethod -Method Patch -Uri $exists.url -Headers $headers -Body $body } else { Invoke-RestMethod -Method Post -Uri 'https://api.github.com/gists' -Headers $headers -Body $body }"`;

                exec(syncCmd, (err) => {
                    if (!err) { profileWin.setLabel(' [ SYNC SUCCESSFUL ] '); playsucesso(); }
                    else { profileWin.setLabel(' [ SYNC FAILED ] '); playwarning(); }
                    screen.render();
                });
            }

            if (ptext.includes('RESTORE')) {
                profileWin.setLabel(' [ DOWNLOADING DATA... ] ');
                screen.render();

                const loadCmd = `powershell -NoProfile -Command "$headers = @{'Authorization'='token ${githubToken}'; 'Accept'='application/json'}; $gists = Invoke-RestMethod -Uri 'https://api.github.com/gists' -Headers $headers; $target = $gists | Where-Object {$_.description -eq 'LIGHT_SAVE'}; if($target){ $gistDetails = Invoke-RestMethod -Uri $target.url -Headers $headers; $gistDetails.files.'light_save.bin'.content } else { write-host 'NOT_FOUND' }"`;

                exec(loadCmd, (err, stdout) => {
                    const output = stdout.trim();
                    if (err || output === 'NOT_FOUND' || !output) {
                        profileWin.setLabel(' [ NO SAVE FOUND ] ');
                        playwarning();
                    } else {
                        try {
                            const jsonStr = Buffer.from(output, 'base64').toString('utf-8');
                            const cloudData = JSON.parse(jsonStr);
                            cloudData.achievements.forEach(ach => {
                                const achPath = path.join(__dirname, '../Achievements', ach);
                                if (!fs.existsSync(achPath)) fs.writeFileSync(achPath, 'RESTORED');
                            });
                            profileWin.setLabel(' [ DATA RECOVERED ] ');
                            playsucesso();
                        } catch(e) { profileWin.setLabel(' [ DATA CORRUPT ] '); playwarning(); }
                    }
                    screen.render();
                });
            }

            if (ptext.includes('DISCONNECT')) {
                githubToken = null; githubUser = null;
                if (fs.existsSync('../CONFIG/GITHUB_TOKEN.txt')) fs.unlinkSync('../CONFIG/GITHUB_TOKEN.txt');
                updateAccountStatus()
                account = false;
                bgOverlay.destroy(); refreshMenu(); mainList.focus(); screen.render();
            }

            if (ptext.includes('RETURN')) {
                account = false;
                playback(); screen.unkey('escape'); bgOverlay.destroy(); mainList.focus(); screen.render();
            }
        });

        screen.key(['escape'], function escProfile() {
            account = false;
            playback(); screen.unkey('escape', escProfile); bgOverlay.destroy(); mainList.focus(); screen.render();
        });
        return;
    }

    playwarning();
    
    let pollInterval = null;
    let currentPowerShell = null;

    const bgOverlay = blessed.box({ 
        parent: screen, 
        top: 0, left: 0, 
        width: '100%', height: '100%', 
        style: { bg: 'black' }, 
        index: 300 
    });

    const loginWin = blessed.box({ 
        parent: bgOverlay, 
        top: 'center', left: 'center', 
        width: 60, height: 13, 
        border: 'line', 
        tags: true, 
        content: '{center}\nGENERATING LOGIN CODE...\n\n{grey-fg}[ESC] TO CANCEL{/center}', 
        style: { border: { fg: 'cyan' } } 
    });
    screen.render();


    const abortLogin = () => {
        if (pollInterval) clearInterval(pollInterval);
        if (currentPowerShell) {
            exec(`taskkill /F /T /PID ${currentPowerShell.pid} > nul 2>&1`);
        }
        playback();
        bgOverlay.destroy();
        account = false;
        screen.unkey('escape', abortLogin);
        mainList.focus();
        screen.render();
    };

    screen.key(['escape'], abortLogin);

    const cmdCode = `powershell -NoProfile -Command "$res = Invoke-RestMethod -Method Post -Uri 'https://github.com/login/device/code' -Body @{client_id='${GITHUB_CLIENT_ID}';scope='gist,read:user'} -Headers @{'Accept'='application/json'}; $res | ConvertTo-Json"`;

    currentPowerShell = exec(cmdCode, (error, stdout) => {
        if (error) return;
        
        let data;
        try { data = JSON.parse(stdout); } catch(e) { return; }
        
        const { device_code, user_code, verification_uri, interval } = data;

        loginWin.setContent(
            `{center}\n{white-fg}ACCESS:{/}\n{yellow-fg}${verification_uri}{/}\n\n` +
            `{white-fg}INPUT CODE:{/}\n{bold}${user_code}{/bold}\n\n` +
            `{cyan-fg}WAITING FOR AUTHORIZATION...{/}\n\n` +
            `{bold}{grey-fg}[ESC] TO CANCEL{/bold}{/center}`
        );
        exec(`start ${verification_uri}`);
        screen.render();

        pollInterval = setInterval(() => {
            const cmdPoll = `powershell -NoProfile -Command "$res = Invoke-RestMethod -Method Post -Uri 'https://github.com/login/oauth/access_token' -Body @{client_id='${GITHUB_CLIENT_ID}';device_code='${device_code}';grant_type='urn:ietf:params:oauth:grant-type:device_code'} -Headers @{'Accept'='application/json'}; $res | ConvertTo-Json"`;
            
            currentPowerShell = exec(cmdPoll, (pollErr, pollStdout) => {
                if (pollErr) return;
                
                let pollData;
                try { pollData = JSON.parse(pollStdout); } catch(e) { return; }

                if (pollData.access_token) {
                    clearInterval(pollInterval);
                    account = false;
                    screen.unkey('escape', abortLogin);
                    
                    githubToken = pollData.access_token;
                    const cmdUser = `powershell -NoProfile -Command "Invoke-RestMethod -Uri 'https://api.github.com/user' -Headers @{'Authorization'='token ${githubToken}'} | ConvertTo-Json"`;
                    
                    exec(cmdUser, (uErr, uStdout) => {
                        githubUser = JSON.parse(uStdout);
                        playsucesso();
                        fs.writeFileSync('../CONFIG/GITHUB_TOKEN.txt', githubToken, 'utf8');
                        updateAccountStatus();
                        bgOverlay.destroy();
                        mainList.emit('select', { getText: () => 'ACCOUNT' });
                    });
                }
            });
        }, interval * 1050);
    });
}
});
screen.key(['C-c'], () => {
    releaseLock();
    confirmExit()});
    
bootSequence();
process.on('SIGINT', () => {
    releaseLock();
 confirmExit();
});
process.on('SIGHUP', () => {
    releaseLock();
 confirmExit();
});