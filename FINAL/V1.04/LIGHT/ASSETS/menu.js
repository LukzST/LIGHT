const CURRENT_VERSION = "V1.04";
const blessed = require('blessed');
const os = require('os');
const { spawn } = require('child_process');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { t, setLanguage, getLanguage } = require('./translate.js');

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
const end2 = '../AUDIO/TRACKS/The_True_Light.mp3';
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
let isconquistaActive = false;

const LUX4_LOGO =
    "      :::        :::    ::: :::    :::\n" +
    "     :+:        :+:    :+: :+:    :+: \n" +
    "    +:+        +:+    +:+  +:+  +:+   \n" +
    "   +#+        +#+    +:+   +#++:+     \n" +
    "  +#+        +#+    +#+  +#+  +#+     \n" +
    " #+#        #+#    #+# #+#    #+#     \n" +
    "##########  ########  ###    ###      \n"

const ALL_ACHIEVEMENTS = [
    { id: 'PACPRO', name: t('ACHIEVEMENT_PACPRO_NAME'), desc: t('ACHIEVEMENT_PACPRO_DESC'), hint: t('ACHIEVEMENT_PACPRO_HINT') },
    { id: 'THE_END', name: t('ACHIEVEMENT_THE_END_NAME'), desc: t('ACHIEVEMENT_THE_END_DESC'), hint: t('ACHIEVEMENT_THE_END_HINT') },
    { id: 'NEVERMISS', name: t('ACHIEVEMENT_NEVERMISS_NAME'), desc: t('ACHIEVEMENT_NEVERMISS_DESC'), hint: t('ACHIEVEMENT_NEVERMISS_HINT') },
    { id: 'OVERRIDE', name: t('ACHIEVEMENT_OVERRIDE_NAME'), desc: t('ACHIEVEMENT_OVERRIDE_DESC'), hint: t('ACHIEVEMENT_OVERRIDE_HINT') },
    { id: 'REBEL_PATH', name: t('ACHIEVEMENT_REBEL_PATH_NAME'), desc: t('ACHIEVEMENT_REBEL_PATH_DESC'), hint: t('ACHIEVEMENT_REBEL_PATH_HINT') },
    { id: 'CEO_CONFRONT', name: t('ACHIEVEMENT_CEO_CONFRONT_NAME'), desc: t('ACHIEVEMENT_CEO_CONFRONT_DESC'), hint: t('ACHIEVEMENT_CEO_CONFRONT_HINT') },
    { id: 'TRUTH_SEEKER', name: t('ACHIEVEMENT_TRUTH_SEEKER_NAME'), desc: t('ACHIEVEMENT_TRUTH_SEEKER_DESC'), hint: t('ACHIEVEMENT_TRUTH_SEEKER_HINT') },
    { id: 'RADIO_LISTENER', name: t('ACHIEVEMENT_RADIO_LISTENER_NAME'), desc: t('ACHIEVEMENT_RADIO_LISTENER_DESC'), hint: t('ACHIEVEMENT_RADIO_LISTENER_HINT') },
    { id: 'GHOST_GUARDIAN', name: t('ACHIEVEMENT_GHOST_GUARDIAN_NAME'), desc: t('ACHIEVEMENT_GHOST_GUARDIAN_DESC'), hint: t('ACHIEVEMENT_GHOST_GUARDIAN_HINT') },
    { id: 'SHADOW_FALL', name: t('ACHIEVEMENT_SHADOW_FALL_NAME'), desc: t('ACHIEVEMENT_SHADOW_FALL_DESC'), hint: t('ACHIEVEMENT_SHADOW_FALL_HINT') },
    { id: 'SLOWTYPIST', name: t('ACHIEVEMENT_SLOWTYPIST_NAME'), desc: t('ACHIEVEMENT_SLOWTYPIST_DESC'), hint: t('ACHIEVEMENT_SLOWTYPIST_HINT') },
    { id: 'LEAK_SAVED', name: t('ACHIEVEMENT_LEAK_SAVED_NAME'), desc: t('ACHIEVEMENT_LEAK_SAVED_DESC'), hint: t('ACHIEVEMENT_LEAK_SAVED_HINT') },
    { id: 'TRUELIGHT', name: t('ACHIEVEMENT_TRUELIGHT_NAME'), desc: t('ACHIEVEMENT_TRUELIGHT_DESC'), hint: t('ACHIEVEMENT_TRUELIGHT_HINT') },
    { id: 'AUDIOPHOBIC', name: t('ACHIEVEMENT_AUDIOPHOBIC_NAME'), desc: t('ACHIEVEMENT_AUDIOPHOBIC_DESC'), hint: t('ACHIEVEMENT_AUDIOPHOBIC_HINT') },
    { id: 'COLOR_MASTER', name: t('ACHIEVEMENT_COLOR_MASTER_NAME'), desc: t('ACHIEVEMENT_COLOR_MASTER_DESC'), hint: t('ACHIEVEMENT_COLOR_MASTER_HINT') },
    { id: 'RARE_BOOT', name: t('ACHIEVEMENT_RARE_BOOT_NAME'), desc: t('ACHIEVEMENT_RARE_BOOT_DESC'), hint: t('ACHIEVEMENT_RARE_BOOT_HINT') },
    { id: 'DATA_MINER', name: t('ACHIEVEMENT_DATA_MINER_NAME'), desc: t('ACHIEVEMENT_DATA_MINER_DESC'), hint: t('ACHIEVEMENT_DATA_MINER_HINT') },
    { id: 'GLITCH_ADDICT', name: t('ACHIEVEMENT_GLITCH_ADDICT_NAME'), desc: t('ACHIEVEMENT_GLITCH_ADDICT_DESC'), hint: t('ACHIEVEMENT_GLITCH_ADDICT_HINT') },
    { id: 'TERMINAL_JUNKIE', name: t('ACHIEVEMENT_TERMINAL_JUNKIE_NAME'), desc: t('ACHIEVEMENT_TERMINAL_JUNKIE_DESC'), hint: t('ACHIEVEMENT_TERMINAL_JUNKIE_HINT') },
    { id: 'HARD_RESET', name: t('ACHIEVEMENT_HARD_RESET_NAME'), desc: t('ACHIEVEMENT_HARD_RESET_DESC'), hint: t('ACHIEVEMENT_HARD_RESET_HINT') },
    { id: 'VOICE_HEARD', name: t('ACHIEVEMENT_VOICE_HEARD_NAME'), desc: t('ACHIEVEMENT_VOICE_HEARD_DESC'), hint: t('ACHIEVEMENT_VOICE_HEARD_HINT') },
    { id: 'REMEMBERED', name: t('ACHIEVEMENT_REMEMBERED_NAME'), desc: t('ACHIEVEMENT_REMEMBERED_DESC'), hint: t('ACHIEVEMENT_REMEMBERED_HINT') },
    { id: 'FORGOTTEN', name: t('ACHIEVEMENT_FORGOTTEN_NAME'), desc: t('ACHIEVEMENT_FORGOTTEN_DESC'), hint: t('ACHIEVEMENT_FORGOTTEN_HINT') },
    { id: 'MEMORY_FRAGMENT', name: t('ACHIEVEMENT_MEMORY_FRAGMENT_NAME'), desc: t('ACHIEVEMENT_MEMORY_FRAGMENT_DESC'), hint: t('ACHIEVEMENT_MEMORY_FRAGMENT_HINT') },
    { id: 'OPERATOR06_SAVED', name: t('ACHIEVEMENT_OPERATOR06_SAVED_NAME'), desc: t('ACHIEVEMENT_OPERATOR06_SAVED_DESC'), hint: t('ACHIEVEMENT_OPERATOR06_SAVED_HINT') },
];

const ACHIEVEMENT_NAMES = {
    'PACPRO': t('ACHIEVEMENT_PACPRO_NAME'),
    'THE_END': t('ACHIEVEMENT_THE_END_NAME'),
    'NEVERMISS': t('ACHIEVEMENT_NEVERMISS_NAME'),
    'OVERRIDE': t('ACHIEVEMENT_OVERRIDE_NAME'),
    'REBEL_PATH': t('ACHIEVEMENT_REBEL_PATH_NAME'),
    'CEO_CONFRONT': t('ACHIEVEMENT_CEO_CONFRONT_NAME'),
    'TRUTH_SEEKER': t('ACHIEVEMENT_TRUTH_SEEKER_NAME'),
    'RADIO_LISTENER': t('ACHIEVEMENT_RADIO_LISTENER_NAME'),
    'GHOST_GUARDIAN': t('ACHIEVEMENT_GHOST_GUARDIAN_NAME'),
    'SHADOW_FALL': t('ACHIEVEMENT_SHADOW_FALL_NAME'),
    'SLOWTYPIST': t('ACHIEVEMENT_SLOWTYPIST_NAME'),
    'LEAK_SAVED': t('ACHIEVEMENT_LEAK_SAVED_NAME'),
    'TRUELIGHT': t('ACHIEVEMENT_TRUELIGHT_NAME'),
    'AUDIOPHOBIC': t('ACHIEVEMENT_AUDIOPHOBIC_NAME'),
    'COLOR_MASTER': t('ACHIEVEMENT_COLOR_MASTER_NAME'),
    'RARE_BOOT': t('ACHIEVEMENT_RARE_BOOT_NAME'),
    'DATA_MINER': t('ACHIEVEMENT_DATA_MINER_NAME'),
    'GLITCH_ADDICT': t('ACHIEVEMENT_GLITCH_ADDICT_NAME'),
    'TERMINAL_JUNKIE': t('ACHIEVEMENT_TERMINAL_JUNKIE_NAME'),
    'HARD_RESET': t('ACHIEVEMENT_HARD_RESET_NAME'),
    'VOICE_HEARD': t('ACHIEVEMENT_VOICE_HEARD_NAME'),
    'REMEMBERED': t('ACHIEVEMENT_REMEMBERED_NAME'),
    'FORGOTTEN': t('ACHIEVEMENT_FORGOTTEN_NAME'),
    'OPERATOR06_SAVED': t('ACHIEVEMENT_OPERATOR06_SAVED_NAME'),
    'MEMORY_FRAGMENT': t('MENU_MEMORY_FRAGMENT')
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

async function downloadAndInstall(version, statusWin, forceIntegrity = false) {
    const authHeader = githubToken ? `-Headers @{'Authorization'='token ${githubToken}'; 'User-Agent'='LIGHT-Updater'}` : "-Headers @{'Authorization'='token ${githubToken}'; 'User-Agent'='LIGHT-Updater'}";
    const treeUrl = `https://api.github.com/repos/lukzst/LIGHT/git/trees/main?recursive=1`;
    const getTreeCmd = `powershell -NoProfile -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (Invoke-RestMethod -Uri '${treeUrl}' ${authHeader}).tree | ConvertTo-Json -Compress"`;

    statusWin.setContent(forceIntegrity ? t('VERIFYING_INTEGRITY') : t('UPDATE_MAPPING'));
    screen.render();

    exec(getTreeCmd, { maxBuffer: 1024 * 1024 * 10 }, async (error, stdout) => {
        if (error) {
            statusWin.setContent(t('UPDATE_ERROR'));
            return screen.render();
        }

        try {
            const tree = JSON.parse(stdout);
            const targetPrefix = `FINAL/${version}/LIGHT/`;
            const remoteFiles = tree.filter(item => 
                item.type === 'blob' && item.path.startsWith(targetPrefix) &&
                !item.path.includes('/CONFIG/') && !item.path.includes('/Achievements/') &&
                !item.path.includes('/AUDIO/') && !item.path.includes('/TERMINALPORTATIL/')
            );

            const newVersionPath = path.join(__dirname, '..', '_update');
            if (fs.existsSync(newVersionPath)) {
                try { fs.rmSync(newVersionPath, { recursive: true, force: true }); } catch(e) {}
            }
            fs.mkdirSync(newVersionPath, { recursive: true });

            for (let i = 0; i < remoteFiles.length; i++) {
                const fileMetadata = remoteFiles[i];
                const relPath = fileMetadata.path.replace(targetPrefix, '');
                const destPath = path.join(newVersionPath, relPath);
                const fileUrl = `https://raw.githubusercontent.com/lukzst/LIGHT/main/${fileMetadata.path}`;

                const percentage = Math.round(((i + 1) / remoteFiles.length) * 100);
                const bar = "█".repeat(Math.floor(percentage / 3.3)) + "░".repeat(30 - Math.floor(percentage / 3.3));

                statusWin.setContent(t('UPDATE_INSTALLING', { version: version.replace('V', ''), bar, percentage }));
                descriptionBox.setContent(t('UPDATE_SECTOR', { current: i + 1, total: remoteFiles.length, file: relPath }));
                screen.render();

                if (!fs.existsSync(path.dirname(destPath))) {
                    fs.mkdirSync(path.dirname(destPath), { recursive: true });
                }
                
                const dlCmd = `powershell -NoProfile -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; iwr -Uri '${fileUrl}' -OutFile '${destPath}'"`;
                await new Promise((res) => { exec(dlCmd, () => res()); });
            }

            statusWin.style.border.fg = 'green';
            statusWin.setContent(t('UPDATE_COMPLETE', { version: version.replace('V', '') }));
            screen.render();
            playsucesso();
            
            const gameRoot = path.join(__dirname, '..');
            const updateScriptPath = path.join(__dirname, '..', 'update_now.bat');

            const backupPath = path.join(__dirname, '..', 'backup_old');
            if (fs.existsSync(backupPath)) {
                try { fs.rmSync(backupPath, { recursive: true, force: true }); } catch(e) {}
            }
            fs.mkdirSync(backupPath, { recursive: true });

            const excludeFromBackup = ['CONFIG', 'Achievements', 'AUDIO', 'TERMINALPORTATIL', '_update', 'backup_old'];
            const filesToBackup = fs.readdirSync(gameRoot);
            
            for (const file of filesToBackup) {
                if (!excludeFromBackup.includes(file)) {
                    const src = path.join(gameRoot, file);
                    const dest = path.join(backupPath, file);
                    try {
                        if (fs.statSync(src).isDirectory()) {
                            fs.cpSync(src, dest, { recursive: true, force: true });
                        } else {
                            fs.copyFileSync(src, dest);
                        }
                    } catch(e) {}
                }
            }

            screen.onceKey(['enter'], () => {
                const child = spawn('cmd.exe', ['/c', 'start', updateScriptPath], {
                    stdio: 'ignore',
                    detached: true,
                    windowsHide: false
                });
                child.unref();
                process.exit(0);
            });

        } catch (err) {
            statusWin.style.border.fg = 'red';
            statusWin.setContent(t('UPDATE_FAILED', { error: err.message }));
            screen.render();
            blockMenuInput = false;
        }
    });
}

async function showUpdateStatus() {
    isupdating = true;
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
        content: t('UPDATE_TITLE'),
        style: { border: { fg: COLORDEFAULT }, label: { fg: COLORDEFAULT, bold: true } }
    });

    screen.render();

    async function handleRepair() {
        screen.unkey('enter', handleRepair);
        global.currentRepairFunc = null;
        await downloadAndInstall(CURRENT_VERSION, statusWin, true);
    }

    async function handleNewUpdate() {
        screen.unkey('enter', handleNewUpdate);
        global.currentUpdateFunc = null;
        await downloadAndInstall(global.latestVersionFound, statusWin, false);
    }

    async function handleIntegrityFix() {
        screen.unkey('enter', handleIntegrityFix);
        global.currentIntegrityFunc = null;
        await downloadAndInstall(CURRENT_VERSION, statusWin, true);
    }

    checkUpdates(async (hasUpdate, version) => {
        if (hasUpdate === null) {
            statusWin.setContent(t('UPDATE_ERROR'));
            screen.render();
        } else if (hasUpdate) {
            global.latestVersionFound = version;
            statusWin.style.border.fg = 'magenta';
            statusWin.setContent(t('UPDATE_DETECTED', { version, time: "CALCULATING..." }));
            screen.render();

            canAcceptInput = true;
            global.currentUpdateFunc = handleNewUpdate;
            screen.onceKey(['enter'], handleNewUpdate);

        } else {
            statusWin.setContent(t('VERIFYING_INTEGRITY'));
            screen.render();

            const treeUrl = `https://api.github.com/repos/lukzst/LIGHT/git/trees/main?recursive=1`;
            const authHeader = githubToken ? `-Headers @{'Authorization'='token ${githubToken}'}` : "";
            const getTreeCmd = `powershell -NoProfile -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (Invoke-RestMethod -Uri '${treeUrl}' ${authHeader}).tree | Where-Object {$_.path -like 'FINAL/${CURRENT_VERSION}/LIGHT/*'} | ConvertTo-Json -Compress"`;

            exec(getTreeCmd, { maxBuffer: 1024 * 1024 * 10 }, async (error, stdout) => {
                if (error) {
                    statusWin.setContent(t('UPDATE_ERROR'));
                    return screen.render();
                }

                const tree = JSON.parse(stdout);
                const targetPrefix = `FINAL/${CURRENT_VERSION}/LIGHT/`;
                let corruptedFiles = [];

                for (const item of tree) {
                    if (item.type !== 'blob' || item.path.includes('/CONFIG/') || item.path.includes('/Achievements/') || item.path.includes('/AUDIO/') || item.path.includes('/TERMINALPORTATIL/')) continue;
                    const relPath = item.path.replace(targetPrefix, '');
                    const destPath = path.join(__dirname, '..', relPath);
                    
                    if (!fs.existsSync(destPath)) {
                        corruptedFiles.push(item);
                    } else {
                        const stats = fs.statSync(destPath);
                        if (stats.size !== item.size) {
                            corruptedFiles.push(item);
                        }
                    }
                }

                if (corruptedFiles.length === 0) {
                    statusWin.style.border.fg = 'green';
                    statusWin.setContent(t('INTEGRITY_OK'));
                    descriptionBox.setContent(t('PRESS_ENTER_TO_CONTINUE'));
                    screen.render();
                    
                    canAcceptInput = true;
                    global.currentIntegrityFunc = () => {
                        bgOverlay.destroy();
                        isUpdateInterfaceActive = false;
                        isupdating = false;
                        blockMenuInput = false;
                        mainList.focus();
                        screen.render();
                    };
                    screen.onceKey(['enter'], global.currentIntegrityFunc);
                } else {
                    statusWin.style.border.fg = 'red';
                    statusWin.setContent(t('INTEGRITY_FAIL', { count: corruptedFiles.length }));
                    descriptionBox.setContent(t('PRESS_ENTER_TO_REPAIR'));
                    screen.render();
                    
                    canAcceptInput = true;
                    global.currentRepairFunc = handleIntegrityFix;
                    screen.onceKey(['enter'], handleIntegrityFix);
                }
                screen.render();
            });
        }
    });

    screen.key(['escape'], function escUpdate() {
        if (blockMenuInput && statusWin.getContent().includes('█')) return;

        if (global.currentRepairFunc) {
            screen.unkey('enter', global.currentRepairFunc);
            global.currentRepairFunc = null;
        }
        if (global.currentUpdateFunc) {
            screen.unkey('enter', global.currentUpdateFunc);
            global.currentUpdateFunc = null;
        }
        if (global.currentIntegrityFunc) {
            screen.unkey('enter', global.currentIntegrityFunc);
            global.currentIntegrityFunc = null;
        }

        playback();
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
        try { fs.unlinkSync(LOCK_FILE); } catch (e) { }
    }
};

if (fs.existsSync(LOCK_FILE)) {
    let oldPid;
    try {
        oldPid = parseInt(fs.readFileSync(LOCK_FILE, 'utf8'));
    } catch (e) { }

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
            content: t('LOCK_ACCESS_DENIED'),
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
        content: t('ACHIEVEMENT_TOAST', { name }),
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
        content: t('BOOT_WARNING'),
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
            label: t('BOOT_CONTROLS_TITLE'),
            tags: true,
            content: t('BOOT_CONTROLS'),
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
                    content: t('BOOT_DEV_BRAND'),
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
    descriptionBox.setContent(t('DESC_DEFAULT'))
    screen.render();
}

function fullscreen_pre_save() {
    if (FULLSCREEN === 'ON' && isModernTerminal) {
        const vbsPath = path.join(__dirname, 'toggle_fs.vbs');
        const BCT = `Set objShell = WScript.CreateObject("WScript.Shell")\nWScript.Sleep 100\nobjShell.SendKeys "{F11}"`;
        try {
            fs.writeFileSync(vbsPath, BCT);
            spawn('wscript.exe', [vbsPath]);
        } catch (err) { }
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
            } catch (e) { githubToken = null; }
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

    let items = [t('MENU_START')];

    if (hasPac) {
            items.push(t('MENU_MINIGAME'));
    }

    items.push(t('MENU_CHECKPOINTS'));
    items.push(t('MENU_ACHIEVEMENTS'));
    items.push(t('MENU_ACCOUNT'));
    items.push(t('MENU_SETTINGS'));
    items.push(t('MENU_UPDATES'));
    items.push(t('MENU_TOP_SECRET'));
    items = items.concat([
        t('MENU_SUPPORT'),
        t('MENU_CREDITS'),
        t('MENU_CLOSE')
    ]);

    try {
        if (typeof mainList !== 'undefined' && mainList !== null) {
            mainList.setItems(items);
            mainList.style.selected.bg = COLORDEFAULT;
            screen.render();
        }
    } catch (e) { }

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
    style: { fg: COLORDEFAULT }
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

const menuDescriptions = {
    'START GAME': t('DESC_START'),
    'CONTINUE MISSION': t('DESC_CONTINUE'),
    'MINIGAME': t('DESC_MINIGAME'),
    'MINIGAME (NEW)': t('DESC_MINIGAME'),
    'ACHIEVEMENTS': t('DESC_ACHIEVEMENTS'),
    'UPDATES': t('DESC_UPDATES'),
    'ACCOUNT': t('DESC_ACCOUNT'),
    'CHECKPOINTS': t('DESC_CHECKPOINTS'),
    'SETTINGS': t('DESC_SETTINGS'),
    'ERASE DATA': t('DESC_ERASE'),
    '[TOP SECRET]': t('DESC_TOP_SECRET'),
    'CREDITS': t('DESC_CREDITS'),
    'SUPPORT': t('DESC_SUPPORT'),
    'RESET TIME': t('DESC_RESET_TIME'),
    'CLOSE': t('DESC_CLOSE'),
    'EXIT': t('DESC_CLOSE'),
    
    'INICIAR JOGO': t('DESC_START'),
    'CONTINUAR MISSÃO': t('DESC_CONTINUE'),
    'MINIGAME': t('DESC_MINIGAME'),
    'MINIGAME (NOVO)': t('DESC_MINIGAME'),
    'CONQUISTAS': t('DESC_ACHIEVEMENTS'),
    'ATUALIZAÇÕES': t('DESC_UPDATES'),
    'CONTA GITHUB': t('DESC_ACCOUNT'),
    'MARCOS': t('DESC_CHECKPOINTS'),
    'CONFIGURAÇÕES': t('DESC_SETTINGS'),
    'APAGAR DADOS': t('DESC_ERASE'),
    '[ACESSO RESTRITO]': t('DESC_TOP_SECRET'),
    'CRÉDITOS': t('DESC_CREDITS'),
    'APOIE O JOGO': t('DESC_SUPPORT'),
    'ZERAR TEMPO': t('DESC_RESET_TIME'),
    'FECHAR': t('DESC_CLOSE'),
    'SAIR': t('DESC_CLOSE')
};

mainList.on('select item', (item) => {
    playBeep();
    const rawText = item.getText().replace(/{.*?}/g, '').trim();
    const desc = menuDescriptions[rawText] || t('DESC_DEFAULT');
    descriptionBox.setContent(`{bold}${desc.toUpperCase()}{/}`);
    screen.render();
});

const loginstatus = blessed.box({
    parent: screen,
    bottom: 1,
    left: 0,
    width: 'shrink',
    tags: true,
    height: 1,
    content: t('ACCOUNT_OFFLINE'),
    style: {
        fg: color,
    }
});

function updateAccountStatus() {
    if (githubToken && githubUser) {
        loginstatus.setContent(t('ACCOUNT_ONLINE', { username: githubUser.login.toUpperCase() }));
    } else {
        loginstatus.setContent(t('ACCOUNT_OFFLINE'));
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
    content: t('DESC_DEFAULT'),
    style: {
        fg: color,
    }
});

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
        label: t('RESET_OPTIONS'),
        keys: true,
        tags: true,
        items: [
            t('RESET_DATA'),
            t('RESET_PLAYTIME'),
            t('RESET_CONFIGS'),
            t('RESET_BACK')
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
        if (txt.includes('DATA') || txt.includes(t('RESET_DATA'))) {
            bgOverlay.destroy();
            screen.unkey('escape')
            eraseData();
        }
        else if (txt.includes('TIME') || txt.includes(t('RESET_PLAYTIME'))) {
            bgOverlay.destroy();
            screen.unkey('escape')
            erasePlaytime();
        }
        else if (txt.includes('CONFIGS') || txt.includes(t('RESET_CONFIGS'))) {
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

            settingsWin.setItem(0, t('SETTINGS_AUDIO', { state: audiostate }));
            settingsWin.setItem(1, t('SETTINGS_EFFECTS', { state: EFFECTS_STATUS }));
            settingsWin.setItem(2, t('SETTINGS_COLOR', { color: COLORNAME }));
            settingsWin.setItem(3, t('SETTINGS_GLITCH', { state: GLITCH }));
            settingsWin.setItem(4, t('SETTINGS_USERNAME', { username: USERNAMEP }));
            settingsWin.setItem(5, t('SETTINGS_FULLSCREEN', { state: FULLSCREEN }));
            settingsWin.setItem(6, t('SETTINGS_SIDEBAR', { state: SIDEBAR }));
            settingsWin.setItem(7, t('SETTINGS_PLAYTIME', { state: TIME_STATUS }));

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
        label: t('ACHIEVEMENT_POPUP_TITLE'),
        tags: true,
        index: 1000,
        content: t('ACHIEVEMENT_POPUP', { name: ach.name, desc: ach.desc }),
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
    player.play(beepfile, (err) => { });
}

function playlux4() {
    if (EFFECTS_STATUS === 'OFF') return;
    player.play(BOOTfile, (err) => { });
}

function playBeep2() {
    if (EFFECTS_STATUS === 'OFF') return;
    player.play(beepfile2, (err) => { });
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
        player.play(freshfile, (err) => { });
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
        player.play(winfile, (err) => { });
    }
}

function playwarning() {
    if (EFFECTS_STATUS === 'OFF') return;
    player.play(warningfile, (err) => { });
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
        player.play(supportfile, (err) => { });
    }
}

function playback() {
    if (EFFECTS_STATUS === 'OFF') return;
    player.play(backfile, (err) => { });
}

function playstart() {
    if (EFFECTS_STATUS === 'OFF') return;
    player.play(startfile, (err) => { });
}

function playsucesso() {
    if (EFFECTS_STATUS === 'OFF') return;
    player.play(sucessofile, (err) => { });
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
        player.play(checkpointfile, (err) => { });
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
        label: t('CONFIRM_EXIT'),
        keys: true,
        tags: true,
        items: [
            t('CONFIRM_YES'),
            t('CONFIRM_NO')
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
        if (txt.includes('YES') || txt.includes(t('CONFIRM_YES'))) {
            process.exit(0);
        }
        if (txt.includes('NO') || txt.includes(t('CONFIRM_NO'))) {
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
        label: t('ACHIEVEMENT_POPUP_TITLE'),
        tags: true,
        content: t('RARE_BOOT_UNLOCKED'),
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
        content: t('CREDITS_SKIP'),
        style: { fg: '#555555' }
    });

    const slides = [
        t('CREDITS_SLIDE1', { logo: logocredits }),
        t('CREDITS_SLIDE2'),
        t('CREDITS_SLIDE3', { name: 'LUCAS EDUARDO' }),
        t('CREDITS_SLIDE4', { name: 'LUCAS EDUARDO' }),
        t('CREDITS_SLIDE5', { name: 'LUCAS EDUARDO' }),
        t('CREDITS_SLIDE6', { name: 'LUCAS EDUARDO' }),
        t('CREDITS_SLIDE7', { name: 'ISABELLA SANCHES' }),
        t('CREDITS_SLIDE8', { name: 'LUCAS EDUARDO' }),
        t('CREDITS_SLIDE9', { names: 'LUCAS EDUARDO\nISABELLA SANCHES' }),
        t('CREDITS_SLIDE10', { name: 'LUIZ OTÁVIO' }),
        t('CREDITS_SLIDE11', { theme: 'THE LAST CHOICE - LIGHT OST' }),
        t('CREDITS_SLIDE12', { studio: 'PALE LUNA DEVELOPER' }),
        t('CREDITS_SLIDE13', { testers: 'HAGRAJAG (ROSE)' }),
        t('CREDITS_SLIDE14', { name: 'LUCAS EDUARDO' }),
        t('CREDITS_THANKS'),
        t('CREDITS_COPYRIGHT', { year: currentYear })
    ];

    let currentSlide = 0;
    const finalMenu = blessed.list({
        parent: bgOverlay,
        top: 'center',
        left: 'center',
        width: 35,
        height: 8,
        border: 'line',
        label: t('CREDITS_FINAL_TITLE'),
        tags: true,
        hidden: true,
        keys: true,
        items: [
            t('CREDITS_INSTAGRAM'),
            t('CREDITS_CLOSE')
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

    setTimeout(() => {
        if (iscreditsOpen) {
            if (fs.existsSync('./TERMINALACCESS/SECRET_ROUTE.status')) {
                playcreditsaudio2()
            } else {
                playcreditsaudio();
            }
        }
    }, 200);
    showNextSlide();

    screen.onceKey(['escape'], closeCredits);

    finalMenu.on('select item', () => { if (buttonsActive) playBeep(); });

    finalMenu.on('select', (item) => {
        if (!buttonsActive) return;
        const txt = item.getText();
        if (txt.includes('INSTAGRAM') || txt.includes(t('CREDITS_INSTAGRAM'))) {
            playBeep2()
            exec('start https://instagram.com/PlayLightGame');
        }
        if (txt.includes('CLOSE') || txt.includes(t('CREDITS_CLOSE'))) {
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
        label: t('ERASE_TITLE'),
        keys: true,
        items: [t('ERASE_YES'), t('ERASE_NO')],
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

        if (txt.includes('NO') || txt.includes(t('ERASE_NO'))) {
            playback();
            bg1Overlay.destroy();
            settingsWin.focus();
            screen.render();
            return;
        }

        if (txt.includes('YES') || txt.includes(t('ERASE_YES'))) {
            playfresh();
            eraseWin.destroy();

            const logBox = blessed.log({
                parent: bg1Overlay,
                top: 'center',
                left: 'center',
                width: '80%',
                height: '80%',
                border: 'line',
                label: t('ERASE_WIPING'),
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
                logBox.log(t('ERASE_DELETING') + ' SECTOR_' + randomHex + ' ... ' + t('ERASE_WIPED'));
                if (logIndex < dummyLogs.length) {
                    logBox.log(`{white-fg}> ${dummyLogs[logIndex]}{/}`);
                    logIndex++;
                }
                screen.render();
            }, 50);

            setTimeout(() => {
                clearInterval(logInterval);
                logBox.setContent(t('ERASE_COMPLETE'));
                screen.render();

                setTimeout(() => {
                    const eraser = spawn('node', ['./erasedata.js'], { stdio: 'inherit' });

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
        label: t('TIME_RESET_TITLE'),
        keys: true,
        tags: true,
        items: [
            t('TIME_CURRENT', { time: formatTime(TOTAL_PLAYTIME) }),
            `{center}───────────────────────────{/center}`,
            t('TIME_YES'),
            t('TIME_NO')
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

        if (txt.includes('──')) return;

        if (txt.includes('NO') || txt.includes(t('TIME_NO'))) {
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

        if (txt.includes('YES') || txt.includes(t('TIME_YES'))) {
            playfresh()
            eraseWin.destroy();

            const logBox = blessed.log({
                parent: bg1Overlay,
                top: 'center',
                left: 'center',
                width: '80%',
                height: '80%',
                border: 'line',
                label: t('TIME_SYNCING'),
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
                logBox.log(t('TIME_REWINDING') + ' TICK_' + randomHex + ' ... ' + t('TIME_DELETED'));

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

                    logBox.setContent(t('TIME_COMPLETE'));
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
                        descriptionBox.setContent(t('TIME_PURGED'));
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
    } catch (e) { }

    const stageOrder = ALL_STAGES.map(s => s.id);
    const currentIndex = stageOrder.indexOf(currentStage);

    const header = blessed.box({
        parent: backdrop,
        top: 1, left: 'center',
        width: '94%', height: 3,
        border: 'line', tags: true,
        content: t('CHECKPOINT_HEADER', { current: currentIndex + 1, total: ALL_STAGES.length }),
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
                ? t('CHECKPOINT_REACHED', { name: stage.name, desc: stage.desc })
                : t('CHECKPOINT_LOCKED')
        });
    });

    const footer = blessed.box({
        parent: backdrop,
        bottom: 2, left: 'center',
        width: '94%', height: 3,
        border: 'line', tags: true,
        content: t('CHECKPOINT_FOOTER'),
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
        height: 14,
        border: 'line',
        label: t('SETTINGS_TITLE'),
        keys: true,
        tags: true,
        items: [
            t('SETTINGS_AUDIO', { state: audiostate }),
            t('SETTINGS_EFFECTS', { state: EFFECTS_STATUS }),
            t('SETTINGS_COLOR', { color: COLORNAME }),
            t('SETTINGS_GLITCH', { state: GLITCH }),
            t('SETTINGS_USERNAME', { username: USERNAMEP }),
            t('SETTINGS_FULLSCREEN', { state: FULLSCREEN }),
            t('SETTINGS_SIDEBAR', { state: SIDEBAR }),
            t('SETTINGS_PLAYTIME', { state: TIME_STATUS }),
            t('SETTINGS_LANGUAGE', { lang: getLanguage() }),
            '{white-fg}─────────────────────────────────────────{/white-fg}',
            t('SETTINGS_RESETS'),
            t('SETTINGS_BACK')
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
        if (index === 9) {
            if (settingsWin._lastIndex < index) {
                settingsWin.select(10);
            } else {
                settingsWin.select(8);
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

        if (txt.includes(t('SETTINGS_BACK'))) {
            issettigsopen = false
            playback()
            refreshMenu()
            bgOverlay.destroy();
            mainList.focus();
            screen.render();
            return;
        }

        if (txt.includes(t('SETTINGS_RESETS'))) {
            playBeep2();
            return showResetOptions();
        }

        if (txt.includes('PLAYTIME HUD') || txt.includes(t('SETTINGS_PLAYTIME').split('[')[0].trim())) {
            TIME_STATUS = (TIME_STATUS === 'ON') ? 'OFF' : 'ON';
            playBeep2()
            fs.writeFileSync('../CONFIG/TIME.txt', `${TIME_STATUS}\n${TOTAL_PLAYTIME}`, 'utf8');
            settingsWin.setItem(7, t('SETTINGS_PLAYTIME', { state: TIME_STATUS }));
            refreshMenu()
            screen.render();
        }

        if (txt.includes('LANGUAGE') || txt.includes('IDIOMA') || txt.includes(t('SETTINGS_LANGUAGE').split('[')[0].trim())) {
    let newLang = (getLanguage() === 'EN') ? 'PT' : 'EN';
    setLanguage(newLang);
    playBeep2();
    settingsWin.setItem(8, t('SETTINGS_LANGUAGE', { lang: getLanguage() }));

    const selectedIndex = settingsWin.selected;
    let countdown = 5;
    let countdownInterval = null;
    
    const overlay = blessed.box({
        parent: screen,
        top: 0, left: 0,
        width: '100%', height: '100%',
        style: { bg: 'black' },
        index: 1000
    });

    const warningBox = blessed.box({
        parent: overlay,
        top: 'center', left: 'center',
        width: 52, height: 9,
        border: 'line',
        label: t('SETTINGS_TITLE'),
        tags: true,
        style: { border: { fg: 'yellow' } }
    });

    blessed.box({
        parent: warningBox,
        top: 1,
        left: 'center',
        width: '90%',
        height: 4,
        tags: true,
        content: t('LANGUAGE_CHANGED'),
        style: { fg: 'white' }
    });

    const counterBox = blessed.box({
        parent: warningBox,
        top: 5,
        left: 'center',
        width: '90%',
        hidden: true,
        height: 1,
        tags: true,
        content: '{center}{yellow-fg}{bold}5{/bold}{/yellow-fg}{/center}',
        style: { fg: 'yellow', bold: true }
    });

    blessed.box({
        parent: warningBox,
        top: 5,
        left: 'center',
        width: '90%',
        height: 2,
        tags: true,
        content: '{center}{bold}{grey-fg}RESTARTING...{/grey-fg}{/bold}{/center}'
    });

    warningBox.focus();
    screen.render();

    function restartGame() {
        if (countdownInterval) clearInterval(countdownInterval);
        overlay.destroy();
        screen.destroy();
        
        const exePath = path.join(__dirname, '..', 'LIGHT.exe');
        
        const child = spawn(exePath, [], {
            stdio: 'ignore',
            detached: true,
            windowsHide: false
        });
        
        child.unref();
        process.exit(0);
    }

    countdownInterval = setInterval(() => {
        countdown--;
        
        if (countdown > 0) {
            counterBox.setContent('{center}{yellow-fg}{bold}' + countdown + '{/bold}{/yellow-fg}{/center}');
            screen.render();
        } else {
            clearInterval(countdownInterval);
            playBeep2();
            restartGame();
        }
    }, 1000);

    screen.once('keypress', function(ch, key) {
        if (key.name === 'escape') {
            clearInterval(countdownInterval);
            playback();
            overlay.destroy();
            settingsWin.focus();
            settingsWin.select(selectedIndex);
            screen.render();
        }
    });

    screen.render();
}

        if (txt.includes('AUDIO') || txt.includes(t('SETTINGS_AUDIO').split('[')[0].trim())) {
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
                fs.writeFileSync('../CONFIG/AUDIOSTATE.txt', audiostate, 'utf8');
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
                    label: t('SETTINGS_TITLE'),
                    tags: true,
                    style: {
                        border: { fg: COLORDEFAULT },
                        label: { fg: COLORDEFAULT, bold: true }
                    }
                });
                const supportContent = [
                    t('SUPPORT_WARNING'),
                    t('SUPPORT_AUDIO_SAVED'),
                    t('SUPPORT_AUDIO_INIT'),
                    t('SUPPORT_ESC_RETURN')
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
            settingsWin.setItem(0, t('SETTINGS_AUDIO', { state: audiostate }));
        }

        if (txt.includes('COLOR') || txt.includes(t('SETTINGS_COLOR').split('[')[0].trim())) {
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
            settingsWin.setItem(2, t('SETTINGS_COLOR', { color: COLORNAME }));
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

        if (txt.includes('USERNAME') || txt.includes(t('SETTINGS_USERNAME').split('[')[0].trim())) {
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
                label: t('USERNAME_PROMPT'),
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
                    settingsWin.setItem(4, t('SETTINGS_USERNAME', { username: USERNAMEP }));
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

        if (txt.includes('FULL SCREEN') || txt.includes(t('SETTINGS_FULLSCREEN').split('[')[0].trim())) {
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
                    content: t('FULLSCREEN_LOCKED'),
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
            settingsWin.setItem(5, t('SETTINGS_FULLSCREEN', { state: FULLSCREEN }));
            screen.render();
        }

        if (txt.includes('GLITCH') || txt.includes(t('SETTINGS_GLITCH').split('[')[0].trim())) {
            GLITCH = (GLITCH === 'ON') ? 'OFF' : 'ON';
            playBeep2()
            if (fs.existsSync('../CONFIG/GLITCH.txt')) {
                fs.unlinkSync('../CONFIG/GLITCH.txt');
            }
            fs.writeFileSync('../CONFIG/GLITCH.txt', GLITCH, 'utf8');
            settingsWin.setItem(3, t('SETTINGS_GLITCH', { state: GLITCH }));
            screen.render();
        }

        if (txt.includes('SIDEBAR') || txt.includes(t('SETTINGS_SIDEBAR').split('[')[0].trim())) {
            SIDEBAR = (SIDEBAR === 'ON') ? 'OFF' : 'ON';
            playBeep2()
            fs.writeFileSync('../CONFIG/SIDEBAR.txt', SIDEBAR, 'utf8');
            settingsWin.setItem(6, t('SETTINGS_SIDEBAR', { state: SIDEBAR }));
            if (SIDEBAR === 'ON') {
                leftSidebar.show();
            } else {
                leftSidebar.hide();
            }
            screen.render();
        }

        if (txt.includes('SOUND EFFECTS') || txt.includes(t('SETTINGS_EFFECTS').split('[')[0].trim())) {
            EFFECTS_STATUS = (EFFECTS_STATUS === 'ON') ? 'OFF' : 'ON';
            fs.writeFileSync('../CONFIG/EFFECTS_STATE.txt', EFFECTS_STATUS, 'utf8');
            settingsWin.setItem(1, t('SETTINGS_EFFECTS', { state: EFFECTS_STATUS }));
            if (EFFECTS_STATUS === 'ON') playBeep2();
            screen.render();
        }

        if (txt.includes('RESET') || txt.includes(t('SETTINGS_RESETS'))) {
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

            settingsWin.setItem(0, t('SETTINGS_AUDIO', { state: audiostate }));
            settingsWin.setItem(1, t('SETTINGS_EFFECTS', { state: EFFECTS_STATUS }));
            settingsWin.setItem(2, t('SETTINGS_COLOR', { color: COLORNAME }));
            settingsWin.setItem(3, t('SETTINGS_GLITCH', { state: GLITCH }));
            settingsWin.setItem(4, t('SETTINGS_USERNAME', { username: USERNAMEP }));
            settingsWin.setItem(5, t('SETTINGS_FULLSCREEN', { state: FULLSCREEN }));
            settingsWin.setItem(6, t('SETTINGS_SIDEBAR', { state: SIDEBAR }));
            settingsWin.setItem(7, t('SETTINGS_PLAYTIME', { state: TIME_STATUS }));

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
        label: t('OVERLAY_TITLE'),
        tags: true,
        content: t('OVERLAY_MESSAGE'),
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
            label: t('OVERLAY_SELECT'),
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
            content: t('OVERLAY_TOGGLE'),
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
                label: t('OVERLAY_EXECUTE'),
                style: { border: { fg: 'red' }, fg: 'red' },
                tags: true
            });

            if (typeof playfresh === 'function') playfresh();

            const messages = [
                t('OVERLAY_ACCESSING'),
                t('OVERLAY_BYPASSING'),
                t('OVERLAY_INJECTING'),
                t('OVERLAY_WRITING', { count: selectedIds.length }),
                t('OVERLAY_SYNCING')
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
                                logBox.log(t('OVERLAY_SECTOR_OK', { id }));
                            } catch (err) {
                                logBox.log(t('OVERLAY_SECTOR_ERR', { id, error: err.message }));
                            }
                        });

                        logBox.log(t('OVERLAY_COMPLETE'));
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

    bgmProcess = player.play(audioFile, function (err) {
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
    vlcProcess = player.play(audioaa, function (err) {
        if (err && !err.killed) console.error("Erro áudio créditos:", err);
    });
}

function playcreditsaudio2() {
    vlcProcess = player.play(end2, function (err) {
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
        label: t('SYSTEM_INFO_TITLE'),
        tags: true,
        style: {
            border: { fg: COLORDEFAULT },
            label: { fg: COLORDEFAULT, bold: true }
        }
    });
    const renderData = () => {
        const text = t('SYSTEM_INFO', {
            status: t('SYSTEM_INFO_OPERATIONAL'),
            os: friendlyName,
            version: winVersion,
            user: userName.toUpperCase(),
            terminal: terminalName,
            achievements: achievements,
            key: key
        });
        infoBox.setContent(text);
        screen.key(['escape'], closeInfo);
        screen.render();
    };
    if (isUnlocked) {
        renderData();
    } else {
        infoBox.setContent(t('SYSTEM_ENCRYPTED'));
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
                descriptionBox.setContent(t('SYSTEM_INVALID'));
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
        label: t('SUPPORT_TITLE'),
        tags: true,
        style: {
            border: { fg: COLORDEFAULT },
            label: { fg: COLORDEFAULT, bold: true }
        }
    });

    blessed.box({
        parent: supportBox,
        top: 1,
        left: 'center',
        width: '90%',
        height: 6,
        tags: true,
        content: `{center}${t('SUPPORT_INFO')}{/center}`
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
            t('SUPPORT_ITCH'),
            t('SUPPORT_TWITTER'),
            t('SUPPORT_CLOSE')
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
        if (text.includes('ITCH.IO') || text.includes(t('SUPPORT_ITCH'))) {
            exec('start https://palelunadev.itch.io/light');
            playBeep2();
        }
        else if (text.includes('TWITTER') || text.includes(t('SUPPORT_TWITTER'))) {
            const tweetText = encodeURIComponent("I'm playing LIGHT! A unique terminal horror experience. Check it out here: https://palelunadev.itch.io/light");
            exec(`start https://twitter.com/intent/tweet?text=${tweetText}`);
            playBeep2();
        }
        else if (text.includes('CLOSE') || text.includes(t('SUPPORT_CLOSE'))) {
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
    if (unlockedCount === 24 && !fs.existsSync(trueLightPath)) {
        fs.writeFileSync(trueLightPath, 'COMPLETED');
        backdrop.destroy();
        Achievements();
        showAchievementToast('TRUELIGHT');
        return;
    }
    if (fs.existsSync(trueLightPath)) unlockedCount++;
    const isFullSync = unlockedCount === ALL_ACHIEVEMENTS.length

    const header = blessed.box({
        parent: backdrop,
        top: 1, left: 'center',
        width: '94%', height: 3,
        border: 'line', tags: true,
        content: t('ACHIEVEMENTS_TITLE', { count: unlockedCount, total: ALL_ACHIEVEMENTS.length }) + (isFullSync ? t('ACHIEVEMENTS_MAX') : ''),
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
                ? t('ACHIEVEMENTS_UNLOCKED', { name: ach.name, desc: ach.desc })
                : t('ACHIEVEMENTS_LOCKED')
        });
    });
    hintDisplay = blessed.box({
        parent: backdrop,
        bottom: 4, left: 'center',
        width: '94%', height: 3,
        border: 'line', tags: true,
        content: t('ACHIEVEMENTS_HINT'),
        style: { border: { fg: COLORDEFAULT }, fg: COLORDEFAULT }
    });
    const hintBtn = blessed.button({
        parent: backdrop,
        bottom: 1, left: 'center',
        width: 25, height: 3,
        content: t('ACHIEVEMENTS_BUTTON'),
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
            border: 'line', label: t('ACHIEVEMENTS_HINT_SELECT'),
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
            hintDisplay.setContent(t('ACHIEVEMENTS_HINT_PREFIX', { id: selectedAch.id, hint: selectedAch.hint }));
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
                if (el.style.border) el.style.border.fg = COLORDEFAULT;
                if (el.style.label) el.style.label.fg = COLORDEFAULT;
                if (el.style.selected) el.style.selected.bg = COLORDEFAULT;
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
    const statusText = t('STATUS_DISPLAY', {
        audio: audiostate === 'ON' ? t('STATUS_ACTIVE') : t('STATUS_MUTED'),
        color: COLORNAME,
        glitch: GLITCH
    });
    statusBox.setContent(statusText);
    screen.render();
}
updateStatus();

mainList.on('select', (item) => {
    if (isBooting) return;
    if (isOverrideActive) return;
    if (blockMenuInput) return;

    const text = item.getText();

    if (text.includes(t('MENU_MINIGAME')) || text.includes(t('MENU_MINIGAME_NEW'))) {
        mainList.detach();
        let progress = 0;
        const loadInterval = setInterval(() => {
            progress += 10;
            const bar = "█".repeat(progress / 10) + "░".repeat(10 - progress / 10);
            menuBox.setContent(`\n\n{center}{bold}${t('MENU_INITIALIZING')}{/bold}\n\n[${bar}] ${progress}%{/center}`);
            screen.render();
            if (progress >= 100) clearInterval(loadInterval);
        }, 100);
        setTimeout(() => {
            menuBox.setContent(`\n\n{center}{yellow-fg}${t('PACPRO_RUNNING')}{/}\n\n${t('PACPRO_WAITING')}{/center}`);
            screen.render();
            const pacmanProc = spawn('cmd.exe /c start /wait node pacpro.js', {
                shell: true
            });
            pacmanProc.on('exit', () => {
                const achPath = path.join(__dirname, '..', 'Achievements', 'PACPRO.ach');
                const hasWon = fs.existsSync(achPath);
                if (hasWon) {
                    menuBox.style.border.fg = 'yellow';
                    menuBox.setContent(t('PACPRO_WIN'));
                } else {
                    menuBox.style.border.fg = 'red';
                    menuBox.setContent(t('PACPRO_LOSE'));
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

    if (text.includes(t('MENU_UPDATES'))) {
        blockMenuInput = true;
        const currentItems = mainList.items;
        showUpdateStatus();
        setTimeout(() => {
            blockMenuInput = false;
        }, 500);
        return;
    }

    if (text.includes(t('MENU_CLOSE'))) { return confirmExit(); }
    if (text.includes(t('MENU_SETTINGS'))) { playBeep2(); return showSettings(); }
    if (text.includes(t('MENU_TOP_SECRET'))) { playwarning(); return showSystemInfo(); }
    if (text.includes(t('MENU_ERASE_DATA'))) { playwarning(); return eraseData(); }
    if (text.includes(t('MENU_CREDITS'))) { return credits(); }
    if (text.includes(t('MENU_SUPPORT'))) { return supportGame(); }
    if (text.includes(t('MENU_ACHIEVEMENTS'))) { return Achievements(); }
    if (text.includes(t('MENU_CHECKPOINTS'))) { playBeep2(); return showCheckpointGallery(); }
    if (text.includes(t('MENU_START'))) {
        mainList.detach();
        let dots = 0;
        const loader = setInterval(() => {
            menuBox.setContent(`\n\n{center}${t('MENU_INITIALIZING')}${".".repeat(dots)}{/center}`);
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
    if (text.includes(t('MENU_RESET_TIME'))) {
        return erasePlaytime();
    }
    if (text.includes(t('MENU_ACCOUNT'))) {
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
                label: t('ACCOUNT_PROFILE', { username: githubUser.login.toUpperCase() }),
                tags: true,
                style: { border: { fg: 'cyan' }, label: { fg: 'cyan', bold: true }, bg: '#050505' }
            });

            blessed.box({
                parent: profileWin,
                top: 0, left: 0, right: 0, height: 3,
                align: 'center', tags: true,
                content: t('ACCOUNT_NETWORK'),
                style: { bg: '#111' }
            });

            const socialData = t('ACCOUNT_SOCIAL', {
                name: githubUser.name || githubUser.login,
                login: githubUser.login,
                bio: githubUser.bio || t('ACCOUNT_NO_BIO'),
                location: githubUser.location || t('ACCOUNT_UNKNOWN'),
                followers: githubUser.followers,
                gists: githubUser.public_gists
            });

            blessed.box({ parent: profileWin, top: 5, left: 3, width: '55%', height: 10, tags: true, content: socialData });

            const currentAchs = fs.readdirSync(path.join(__dirname, '../Achievements')).filter(f => f.endsWith('.ach')).length;
            const systemStats = t('ACCOUNT_STATS', {
                version: CURRENT_VERSION,
                user: userName.toUpperCase(),
                achs: currentAchs,
                total: ALL_ACHIEVEMENTS.length
            });

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
                    t('ACCOUNT_SYNC'),
                    t('ACCOUNT_RESTORE'),
                    t('ACCOUNT_DISCONNECT'),
                    t('ACCOUNT_RETURN')
                ],
                style: { selected: { bg: 'cyan', fg: 'black' }, item: { fg: 'cyan' } }
            });

            profileActions.focus();
            screen.render();

            profileActions.on('select item', (item) => {
                playBeep();
            });

            profileActions.on('select', async (item) => {
                const ptext = item.getText();
                playBeep2();

                if (ptext.includes(t('ACCOUNT_SYNC'))) {
                    profileWin.setLabel(t('ACCOUNT_UPLOADING'));
                    screen.render();

                    const saveData = {
                        achievements: fs.readdirSync(path.join(__dirname, '../Achievements')).filter(f => f.endsWith('.ach')),
                        config: { user: USERNAMEP, color: COLORDEFAULT, glitch: GLITCH }
                    };

                    const base64Data = Buffer.from(JSON.stringify(saveData)).toString('base64');
                    const syncCmd = `powershell -NoProfile -Command "$headers = @{'Authorization'='token ${githubToken}'; 'Accept'='application/json'}; $body = @{description='LIGHT_SAVE'; public=$false; files=@{'light_save.bin'=@{content='${base64Data}'}}} | ConvertTo-Json -Depth 10; $gists = Invoke-RestMethod -Uri 'https://api.github.com/gists' -Headers $headers; $exists = $gists | Where-Object {$_.description -eq 'LIGHT_SAVE'}; if($exists){ Invoke-RestMethod -Method Patch -Uri $exists.url -Headers $headers -Body $body } else { Invoke-RestMethod -Method Post -Uri 'https://api.github.com/gists' -Headers $headers -Body $body }"`;

                    exec(syncCmd, (err) => {
                        if (!err) { profileWin.setLabel(t('ACCOUNT_SYNC_SUCCESS')); playsucesso(); }
                        else { profileWin.setLabel(t('ACCOUNT_SYNC_FAILED')); playwarning(); }
                        screen.render();
                    });
                }

                if (ptext.includes(t('ACCOUNT_RESTORE'))) {
                    profileWin.setLabel(t('ACCOUNT_DOWNLOADING'));
                    screen.render();

                    const loadCmd = `powershell -NoProfile -Command "$headers = @{'Authorization'='token ${githubToken}'; 'Accept'='application/json'}; $gists = Invoke-RestMethod -Uri 'https://api.github.com/gists' -Headers $headers; $target = $gists | Where-Object {$_.description -eq 'LIGHT_SAVE'}; if($target){ $gistDetails = Invoke-RestMethod -Uri $target.url -Headers $headers; $gistDetails.files.'light_save.bin'.content } else { write-host 'NOT_FOUND' }"`;

                    exec(loadCmd, (err, stdout) => {
                        const output = stdout.trim();
                        if (err || output === 'NOT_FOUND' || !output) {
                            profileWin.setLabel(t('ACCOUNT_NO_SAVE'));
                            playwarning();
                        } else {
                            try {
                                const jsonStr = Buffer.from(output, 'base64').toString('utf-8');
                                const cloudData = JSON.parse(jsonStr);
                                cloudData.achievements.forEach(ach => {
                                    const achPath = path.join(__dirname, '../Achievements', ach);
                                    if (!fs.existsSync(achPath)) fs.writeFileSync(achPath, 'RESTORED');
                                });
                                profileWin.setLabel(t('ACCOUNT_RESTORE_SUCCESS'));
                                playsucesso();
                            } catch (e) { profileWin.setLabel(t('ACCOUNT_RESTORE_CORRUPT')); playwarning(); }
                        }
                        screen.render();
                    });
                }

                if (ptext.includes(t('ACCOUNT_DISCONNECT'))) {
                    githubToken = null; githubUser = null;
                    if (fs.existsSync('../CONFIG/GITHUB_TOKEN.txt')) fs.unlinkSync('../CONFIG/GITHUB_TOKEN.txt');
                    updateAccountStatus()
                    account = false;
                    bgOverlay.destroy(); refreshMenu(); mainList.focus(); screen.render();
                }

                if (ptext.includes(t('ACCOUNT_RETURN'))) {
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
            content: t('ACCOUNT_GENERATING'),
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
            try { data = JSON.parse(stdout); } catch (e) { return; }

            const { device_code, user_code, verification_uri, interval } = data;

            loginWin.setContent(t('ACCOUNT_ACCESS', { uri: verification_uri, code: user_code }));

            exec(`start ${verification_uri}`);
            screen.render();

            pollInterval = setInterval(() => {
                const cmdPoll = `powershell -NoProfile -Command "$res = Invoke-RestMethod -Method Post -Uri 'https://github.com/login/oauth/access_token' -Body @{client_id='${GITHUB_CLIENT_ID}';device_code='${device_code}';grant_type='urn:ietf:params:oauth:grant-type:device_code'} -Headers @{'Accept'='application/json'}; $res | ConvertTo-Json"`;

                currentPowerShell = exec(cmdPoll, (pollErr, pollStdout) => {
                    if (pollErr) return;

                    let pollData;
                    try { pollData = JSON.parse(pollStdout); } catch (e) { return; }

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
                            mainList.emit('select', { getText: () => t('MENU_ACCOUNT') });
                        });
                    }
                });
            }, interval * 1050);
        });
    }
});

screen.key(['C-c'], () => {
    releaseLock();
    confirmExit()
});

bootSequence();

process.on('SIGINT', () => {
    releaseLock();
    confirmExit();
});

process.on('SIGHUP', () => {
    releaseLock();
    confirmExit();
});