const blessed = require('blessed');
const fs = require('fs');
const {
    exec,
    spawn
} = require('child_process');
const path = require('path');
const os = require('os');
let COLOR_HEX = '#ff0000';
try {
    COLOR_HEX = fs.readFileSync('../CONFIG/COLORDEFAULT.txt', 'utf8').trim();
} catch (e) {}
const desktopPath = path.join(os.homedir(), 'Desktop', 'PASSWORD_ACCESS_FOLDER');
const rootPassPath = path.join(os.homedir(), 'Documents', 'passwordjob.txt');
const passwordValue = "L1GHT_SYST3M_0000_X_TR4NSM1SS1ON_S3CUR1TY_V3R1F13D_50";

const filesToClean = [
    './TERMINALACCESS/ACESSOSTATUS.LIGHT',
    './TERMINALACCESS/MEMORY_1999.bin',
    './TERMINALACCESS/GAMEOVER.status',
    './TERMINALACCESS/TERMINAL_ACTIVE.status'
];
const checkPath = path.join(__dirname, '..', 'CONFIG', 'CHECKPOINT.json');
if (!fs.existsSync(checkPath)) {
    filesToClean.forEach(file => {
        if (fs.existsSync(file)) {
            try { fs.unlinkSync(file); } catch(e) {}
        }
    });
}


function clearPuzzle() {
    filesToClean.forEach(file => {
        if (fs.existsSync(file)) fs.unlinkSync(file);
    });
    if (fs.existsSync(rootPassPath)) try {
        fs.unlinkSync(rootPassPath);
    } catch (e) {}
    if (fs.existsSync(desktopPath)) {
        try {
            const files = fs.readdirSync(desktopPath);
            files.forEach(f => fs.unlinkSync(path.join(desktopPath, f)));
            fs.rmdirSync(desktopPath);
        } catch (e) {}
    }
}
const screen = blessed.screen({
    smartCSR: true,
    title: 'LIGHT',
    fullUnicode: true
});
const style = {
    fg: COLOR_HEX,
    bg: 'black',
    border: {
        fg: COLOR_HEX
    },
    hover: {
        bg: COLOR_HEX,
        fg: 'black'
    },
    selected: {
        bg: COLOR_HEX,
        fg: 'black'
    }
};
const container = blessed.box({
    parent: screen,
    width: '100%',
    height: '100%',
    style: {
        bg: 'black'
    }
});
const statusBox = blessed.box({
    parent: container,
    bottom: 0,
    width: '100%',
    height: 3,
    content: ' [ARROWS] Navigate | [ENTER] Select ',
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        border: {
            fg: '#333333'
        }
    }
});
const LOGO_TEXT =
    "███        ███  ████████  ███  ███  █████████\n" +
    "███        ███  ███  ███  ███  ███     ███\n" +
    "███        ███  ███       ███  ███     ███\n" +
    "███        ███  ███ ████  ████████     ███\n" +
    "███        ███  ███  ███  ███  ███     ███\n" +
    "███        ███  ███  ███  ███  ███     ███\n" +
    "███        ███  ███  ███  ███  ███     ███\n" +
    "█████████  ███  ████████  ███  ███     ███";

function execGameOver(reason) {
    saveFinalTime();
    clearPuzzle();
    container.children.forEach(c => c.hide());
    const goBox = blessed.box({
        parent: container,
        top: 'center',
        left: 'center',
        width: 'shrink',
        height: 'shrink',
        padding: 2,
        content: `{center}{red-fg}GAME OVER{/red-fg}\n\n${reason}{/center}`,
        tags: true,
        border: {
            type: 'line',
            fg: 'red'
        },
        style: {
            bold: true
        }
    });
    screen.render();
    setTimeout(() => process.exit(0), 5000);
}
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
    'LEAK_SAVED': 'WHISTLEBLOWER',
    'AUDIOPHOBIC': 'AUDIOPHOBIC',
    'COLOR_MASTER': 'SPECTRUM ANALYST'
};

function showLoadToast() {
    const toast = blessed.box({
        parent: screen,
        top: 'center',
        left: 'center',
        width: 35,
        height: 5,
        border: 'line',
        tags: true,
        content: `{center}{green-fg}{bold}CHECKPOINT LOADED{/}{/center}`,
        style: { border: { fg: 'green' }, bg: 'black' }
    });
    toast.setIndex(1000);
    screen.render();
    setTimeout(() => { toast.destroy(); screen.render(); }, 2000);
}

// Variáveis de Tempo
let playtimeSeconds = 0;
let playtimeStatus = 'OFF';

try {
    const timeData = fs.readFileSync('../CONFIG/TIME.txt', 'utf8').split('\n');
    playtimeStatus = (timeData[0] || 'OFF').trim();
    playtimeSeconds = parseInt(timeData[1]) || 0;
} catch (e) {}

const playtimerBox = blessed.box({
    parent: screen,
    top: 1,
    left: 1,
    width: 'shrink',
    height: 3,
    border: 'line',
    tags: true,
    hidden: playtimeStatus === 'OFF',
    style: {
        fg: COLOR_HEX,
        border: { fg: '#333333' }
    }
});

function formatTime(s) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

if (playtimeStatus === 'ON') {
    setInterval(() => {
        playtimeSeconds++;
        playtimerBox.setContent(`{bold}SESSION: ${formatTime(playtimeSeconds)}{/}`);
        screen.render();
    }, 1000);
}

function saveFinalTime() {
    fs.writeFileSync('../CONFIG/TIME.txt', `${playtimeStatus}\n${playtimeSeconds}`, 'utf8');
}

const originalGameOver = execGameOver;
execGameOver = function(reason) {
    saveFinalTime();
    originalGameOver(reason);
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
            border: {
                fg: 'yellow'
            },
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

function showCheckpointToast() {
    const toast = blessed.box({
        parent: screen,
        top: 2,
        right: 2,
        width: 30,
        height: 5,
        border: 'line',
        tags: true,
        content: `{center}{bold}CHECKPOINT REACHED{/}\n{white-fg}PROGRESS SAVED{/center}`,
        style: {
            border: {
                fg: 'yellow'
            },
            bg: 'black'
        }
    });
    toast.setIndex(1000);
    screen.render();
    setTimeout(() => {
        toast.destroy();
        screen.render();
    }, 3000);
}

function saveCheckpoint(stageName) {
    const saveData = {
        last_stage: stageName,
        timestamp: new Date().toISOString(),
        user: os.userInfo().username
    };
    
    const savePath = path.join(__dirname, '..', 'CONFIG', 'CHECKPOINT.json');
    
    try {
        if (!fs.existsSync(path.dirname(savePath))) {
            fs.mkdirSync(path.dirname(savePath), { recursive: true });
        }
        fs.writeFileSync(savePath, JSON.stringify(saveData, null, 2));
        showCheckpointToast();
    } catch (e) {
    }
}

function loadStage(stageName) {
    showLoadToast();
    
    // Limpa a tela antes de carregar
    container.children.forEach(c => {
        if (c !== statusBox) c.hide();
    });

    setTimeout(async () => {
        statusBox.setContent(` [SYSTEM]: Restoring Sector: ${stageName}... `);
        screen.render();

        try {
            switch(stageName) {
                case "START_NARRATIVE": 
                    await startNarrative(); 
                    break;
                case "OFFICE_CHAOS": 
                    await officeChaosPhase(); 
                    break;
                case "POWER_ACTIVE": 
                    // Se a energia já estava ativa, precisamos garantir que o arquivo exista
                    fs.writeFileSync('./TERMINALACCESS/POWER_ACTIVE.status', '1');
                    await officeChaosPhase(); 
                    break;
                case "SUBLEVEL_7": 
                    // Cria uma box temporária para a função de sublevel não quebrar
                    const dummyBox = blessed.box({
                        parent: container,
                        top: 'center', left: 'center',
                        width: '90%', height: '80%',
                        border: 'line', style: style, tags: true
                    });
                    await arrivalAtSublevel(dummyBox); 
                    break;
                case "CORE_FINAL": 
                    const coreBox = blessed.box({
                        parent: container,
                        top: 'center', left: 'center',
                        width: '90%', height: '80%',
                        border: 'line', style: style, tags: true
                    });
                    await coreFinalSequence(coreBox); 
                    break;
                default: 
                    startMainMenu();
            }
        } catch (err) {
            // Se der erro, volta ao menu em vez de fechar o jogo
            console.error(err);
            startMainMenu();
        }
    }, 2000);
}

function watchAchievements() {
    const achDir = path.join(__dirname, '..', 'ACHIEVEMENTS');
    if (!fs.existsSync(achDir)) {
        fs.mkdirSync(achDir, {
            recursive: true
        });
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
async function accessLuxFiles(box) {
    box.setContent("");
    await typeWriter(box, "{green-fg}[SYSTEM]: Balance maintained. Neural link stable.{/green-fg}");
    await new Promise(res => setTimeout(res, 1000));
    await typeWriter(box, "[YOU]: I'm in. The system thinks I'm part of it. I can see the encrypted directories now.");
    await new Promise(res => screen.once('keypress', (ch, key) => {
        if (key.name === 'enter') res();
    }));
    box.setContent("{center}ENTER ENCRYPTION KEY TO ACCESS 'PROJECT_FADE_1999_LOGS'\n\n{yellow-fg}(HINT: Check 'System Info' in the Main Menu){/yellow-fg}{/center}");
    const accessInput = blessed.textbox({
        parent: box,
        top: 'center',
        left: 'center',
        width: 25,
        height: 3,
        border: {
            type: 'line'
        },
        style: {
            fg: 'yellow',
            bg: 'black'
        },
        inputOnFocus: true
    });
    accessInput.focus();
    screen.render();
    accessInput.on('submit', async (value) => {
        if (value === "lux1999files") {
            accessInput.destroy();
            box.setContent("{center}{green-fg}DECRYPTING... ACCESS GRANTED.{/green-fg}{/center}");
            if (!fs.existsSync('../ACHIEVEMENTS/TRUTH_SEEKER.ACH')) {
                showAchievementToast('DECRYPTOR')
                fs.writeFileSync('../ACHIEVEMENTS/TRUTH_SEEKER.ACH', 'COMPLETED')
            }
            screen.render();
            setTimeout(() => {
                const leakProc = spawn('cmd.exe', ['/c', 'start', '/wait', 'node', 'LUX_LEAKS.js'], {
                    shell: false
                });
                leakProc.on('exit', () => {
                    box.setContent("");
                    box.style.border.fg = "yellow";
                    box.setContent(
                        "{center}{yellow-fg}{bold}ATTENTION: DATA BREACH SUCCESSFUL{/bold}{/yellow-fg}\n\n" +
                        "The classified files have been exposed. \n" +
                        "If you saved the leak [S], check your {white-fg}DESKTOP{/white-fg} for 'LUX_CONFIDENTIAL.txt'.\n\n" +
                        "There is a hidden bypass code inside that file.\n" +
                        "{blink}Close the game and use the code at the start to change history.{/blink}{/center}"
                    );
                    screen.render();
                    screen.key(['enter', 'escape'], () => process.exit(0));
                });
            }, 2000);
        } else {
            accessInput.destroy();
            execGameOver("INVALID ENCRYPTION KEY. The mainframe detected your intrusion and fried your neural path.");
        }
    });
}
async function sublevelExploration() {
    container.children.forEach(c => {
        if (c !== statusBox) c.hide();
    });
    const sublevelBox = blessed.box({
        parent: container,
        top: 'center',
        left: 'center',
        width: '90%',
        height: '80%',
        border: {
            type: 'line'
        },
        style: style,
        padding: 1,
        tags: true
    });
    await typeWriter(sublevelBox, "[NARRATOR]: You step into the Heart of the LUX-4 Mainframe. The air is thick with static.");
    await new Promise(res => screen.once('keypress', (ch, key) => {
        if (key.name === 'enter') res();
    }));
    await typeWriter(sublevelBox, "{red-fg}[ALARM]: SECURITY BREACH. DOORS LOCKED. SELF-DESTRUCT IN 5 SECONDS.{/red-fg}");
    await new Promise(res => setTimeout(res, 1000));
    const codeToType = "6789";
    let timeLeft = 5;
    let missionFailed = false;
    const flashInterval = setInterval(() => {
        sublevelBox.style.bg = (sublevelBox.style.bg === 'black' ? 'red' : 'black');
        screen.render();
    }, 200);
    const timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0 && !missionFailed) {
            clearInterval(timerInterval);
            clearInterval(flashInterval);
            missionFailed = true;
            if (!fs.existsSync('../ACHIEVEMENTS/SLOWTYPIST.ACH')) {
                showAchievementToast('SLOW TYPIST')
                fs.writeFileSync('../ACHIEVEMENTS/SLOWTYPIST.ACH', 'COMPLETED')
            }
            execGameOver("TIME EXPIRED. The security system atomized the room.");
        } else {
            sublevelBox.setContent(`{center}{bold}!!! SECURITY LOCKDOWN !!!{/bold}\n\nTYPE OVERRIDE CODE:\n\n{yellow-fg}{bold}${codeToType}{/bold}{/yellow-fg}\n\nTIME: ${timeLeft}s{/center}`);
            screen.render();
        }
    }, 1000);
    const inputField = blessed.textbox({
        parent: sublevelBox,
        bottom: 3,
        left: 'center',
        width: 10,
        height: 3,
        border: {
            type: 'line'
        },
        style: {
            fg: 'white',
            bg: 'black'
        },
        inputOnFocus: true
    });
    inputField.focus();
    screen.render();
    inputField.on('submit', (value) => {
        if (missionFailed) return;
        clearInterval(timerInterval);
        clearInterval(flashInterval);
        if (value === codeToType) {
            sublevelBox.style.bg = 'black';
            sublevelBox.setContent("{center}{green-fg}OVERRIDE SUCCESSFUL. ACCESSING CORE...{/green-fg}{/center}");
            screen.render();
            setTimeout(() => {
                inputField.destroy();
                saveCheckpoint("CORE_FINAL");
                coreFinalSequence(sublevelBox);
            }, 2000);
        } else {
            missionFailed = true;
            execGameOver("INVALID CODE. Internal defenses active.");
        }
    });
}
async function coreFinalSequence(box) {
    box.setContent("");
    const achPath = path.join(__dirname, '..', 'ACHIEVEMENTS', 'PACPRO.ach');
    const isElite = fs.existsSync(achPath);
    if (isElite) {
        await typeWriter(box, "{yellow-fg}[ELITE DATA UNLOCKED]: PROJECT FADE - PRELUDE TO 1999.{/yellow-fg}");
        await new Promise(res => screen.once('keypress', (ch, key) => {
            if (key.name === 'enter') res();
        }));
        await typeWriter(box, "{yellow-fg}[PRELUDE]: 'The city didn't lose power in 1999. It was consumed to fuel the first upload.'{/yellow-fg}");
        await new Promise(res => screen.once('keypress', (ch, key) => {
            if (key.name === 'enter') res();
        }));
        box.setContent("");
    }
    await typeWriter(box, "[SYSTEM]: Administrative rights: DENIED. Manual core maintenance required.");
    await new Promise(res => screen.once('keypress', (ch, key) => {
        if (key.name === 'enter') res();
    }));
    await typeWriter(box, "[NARRATOR]: Mechanical arms emerge from the ceiling, forcing you into the Control Chair.");
    await new Promise(res => screen.once('keypress', (ch, key) => {
        if (key.name === 'enter') res();
    }));
    await typeWriter(box, "[SYSTEM]: Energy fluctuation detected. Initialize BALANCER.js to prevent blackout.");
    await new Promise(res => screen.once('keypress', (ch, key) => {
        if (key.name === 'enter') res();
    }));
    box.setContent("{center}CHAIR LOCKED. USER INTEGRATED.\n\nINITIALIZING BALANCER.js...{/center}");
    screen.render();
    const balancerProc = spawn('cmd.exe', ['/c', 'start', '/wait', 'node', 'BALANCER.js'], {
        shell: false
    });
    balancerProc.on('exit', () => {
        const successFile = './BALANCER_SUCCESS.status';
        const isSecretRoute = fs.existsSync('./TERMINALACCESS/SECRET_ROUTE.status');
        if (!fs.existsSync(successFile)) {
            if (!fs.existsSync('../ACHIEVEMENTS/SHADOW_FALL.ACH')) {
                showAchievementToast('CORE MELTDOWN')
                fs.writeFileSync('../ACHIEVEMENTS/SHADOW_FALL.ACH', 'COMPLETED')
            }
        }
        if (fs.existsSync(successFile)) {
            fs.unlinkSync(successFile);
            if (isSecretRoute) {
                fs.unlinkSync('./TERMINALACCESS/SECRET_ROUTE.status');
                ceoConfrontation();
            } else {
                if (!fs.existsSync('../ACHIEVEMENTS/GHOST_GUARDIAN.ACH')) {
                    showAchievementToast('DIGITAL SHEPHEAD')
                    fs.writeFileSync('../ACHIEVEMENTS/GHOST_GUARDIAN.ACH', 'COMPLETED')
                }
                accessLuxFiles(box);
            }
        } else {
            execGameOver("The core exploded. The Fade consumed reality.");
        }
    });
}
async function coreFinalSequence(box) {
    box.setContent("");
    const achPath = path.join(__dirname, '..', 'ACHIEVEMENTS', 'PACPRO.ach');
    const isElite = fs.existsSync(achPath);
    if (isElite) {
        await typeWriter(box, "{yellow-fg}[ELITE DATA UNLOCKED]: PROJECT FADE - PRELUDE TO 1999.{/yellow-fg}");
        await new Promise(res => screen.once('keypress', (ch, key) => {
            if (key.name === 'enter') res();
        }));
        await typeWriter(box, "{yellow-fg}[PRELUDE]: 'The city didn't lose power in 1999. It was consumed to fuel the first upload.'{/yellow-fg}");
        await new Promise(res => screen.once('keypress', (ch, key) => {
            if (key.name === 'enter') res();
        }));
        await typeWriter(box, "{yellow-fg}[MESSAGE]: You know the truth now, Operator. But the machine still needs a heart.{/yellow-fg}");
        await new Promise(res => screen.once('keypress', (ch, key) => {
            if (key.name === 'enter') res();
        }));
        box.setContent("");
    }
    await typeWriter(box, "[SYSTEM]: Total system override failed. Administrative rights: REDACTED.");
    await new Promise(res => screen.once('keypress', (ch, key) => {
        if (key.name === 'enter') res();
    }));
    await typeWriter(box, "[NARRATOR]: Mechanical arms emerge from the ceiling, forcing you into the Control Chair.");
    await new Promise(res => screen.once('keypress', (ch, key) => {
        if (key.name === 'enter') res();
    }));
    await typeWriter(box, "[YOU]: Wait... no! I'm not a part of this!");
    await new Promise(res => screen.once('keypress', (ch, key) => {
        if (key.name === 'enter') res();
    }));
    await typeWriter(box, "[SYSTEM]: Energy fluctuation detected. Manual balancing required.");
    await new Promise(res => screen.once('keypress', (ch, key) => {
        if (key.name === 'enter') res();
    }));
    box.setContent("{center}CHAIR LOCKED. BIOMETRIC SYNC COMPLETE.\n\nINITIALIZING BALANCER.js SYSTEM...{/center}");
    screen.render();
    const balancerProc = spawn('cmd.exe', ['/c', 'start', '/wait', 'node', 'BALANCER.js'], {
        shell: false
    });
    balancerProc.on('exit', () => {
        const successFile = './BALANCER_SUCCESS.status';
        const isSecretRoute = fs.existsSync('./TERMINALACCESS/SECRET_ROUTE.status');
        if (!fs.existsSync(successFile)) {
            if (!fs.existsSync('../ACHIEVEMENTS/SHADOW_FALL.ACH')) {
                showAchievementToast('CORE MELTDOWN')
                fs.writeFileSync('../ACHIEVEMENTS/SHADOW_FALL.ACH', 'COMPLETED')
            }
        }
        if (fs.existsSync(successFile)) {
            fs.unlinkSync(successFile);
            if (isSecretRoute) {
                fs.unlinkSync('./TERMINALACCESS/SECRET_ROUTE.status');
                ceoConfrontation();
            } else {
                if (!fs.existsSync('../ACHIEVEMENTS/GHOST_GUARDIAN.ACH')) {
                    showAchievementToast('DIGITAL SHEPHEAD')
                    fs.writeFileSync('../ACHIEVEMENTS/GHOST_GUARDIAN.ACH', 'COMPLETED')
                }
                accessLuxFiles(box);
            }
        } else {
            execGameOver("The core exploded. The Fade consumed reality.");
        }
    });
}
async function finalChoicePhase(box) {
    box.setContent("");
    const achPath = path.join(__dirname, '..', 'ACHIEVEMENTS', 'PACPRO.ach');
    const isElite = fs.existsSync(achPath);
    const narrative = [
        "[SYSTEM]: Core connection stable. The violet light of the Fade is pulsating in front of you.",
        "[YOU]: This is it. The digitizing core of LUX-4."
    ];
    if (isElite) {
        narrative.push("{yellow-fg}[ELITE LOG]: Credential PACPRO detected. Secret archive unlocked.{/yellow-fg}");
        narrative.push("{yellow-fg}[REPORT 1999]: 'The Fade wasn't a mistake. We found a way to live inside the electrons.'{/yellow-fg}");
    }
    for (const line of narrative) {
        await typeWriter(box, line);
        await new Promise(res => screen.once('keypress', (ch, key) => {
            if (key.name === 'enter') res();
        }));
    }
    const finalAction = blessed.list({
        parent: container,
        bottom: 5,
        left: 'center',
        width: '70%',
        height: 8,
        label: ' TERMINAL OVERRIDE: PROJECT FADE ',
        items: [
            ' > PURGE THE SYSTEM (Erase LUX-4/End the Fade) ',
            ' > STABILIZE THE FADE (Try to rescue the trapped souls) ',
            ' > MERGE WITH THE FADE (Become the new God of the Grid) '
        ],
        keys: true,
        border: {
            type: 'line'
        },
        style: style,
        align: 'center'
    });
    finalAction.focus();
    screen.render();
    finalAction.on('select', async (it, idx) => {
        finalAction.hide();
        box.setContent("");
        if (idx === 0) {
            await typeWriter(box, "[YOU]: This experiment ends now. For everyone.");
            execGameOver("You purged the core. The city went dark, but the cycle of the Fade was broken.");
            fs.writeFileSync('../ACHIEVEMENTS/CITY_DARK.ACH', 'COMPLETED')
        } else if (idx === 1) {
            await typeWriter(box, "[YOU]: I'll try to pull them back to reality.");
            execGameOver("You tried to stabilize the core. Thousands of digital ghosts returned, but you are now their silent guardian.");
        } else {
            await typeWriter(box, "[YOU]: The static is beautiful. I'm ready to evolve.");
            execGameOver("You merged with the core. You are no longer human. You are the LUX-4 Grid itself.");
            fs.writeFileSync('../ACHIEVEMENTS/NEW_GOD.ACH', 'COMPLETED')
        }
    });
}
async function ceoConfrontation() {
    if (!fs.existsSync('../ACHIEVEMENTS/CEO_CONFRONT.ACH')) {
        showAchievementToast('DIRECTOR’S CUT')
        fs.writeFileSync('../ACHIEVEMENTS/CEO_CONFRONT.ACH', 'COMPLETED')
    }
    const vbsPath = path.join(os.tmpdir(), 'ceo_chat.vbs');
    fs.writeFileSync(vbsPath, `
 Set objShell = CreateObject("WScript.Shell")
 res = MsgBox("LUX-4 CEO: You know everything now, don't you?", 36, "CORE_ACCESS_TERMINAL")
 If res = 7 Then
 ' User chose NO
 MsgBox "LUX-4 CEO: Hahaha... bad idea.", 16, "SYSTEM_ERROR"
 objShell.Run "shutdown /s /t 10 /c ""UNAUTHORIZED ACCESS DENIED. SYSTEM HALT.""", 0, True
 Else
 ' User chose YES
 MsgBox "LUX-4 CEO: How? How did you find out?", 48, "SYSTEM_BREACH"
 MsgBox "LUX-4 CEO: You destroyed everything I built. Know that we hate you...", 16, "LUX-4_REVENGE"
 objShell.Run "shutdown /r /t 15 /c ""PURGING LUX-4 REMNANTS. REBOOTING SYSTEM...""", 0, True
 End If
 `, {
        encoding: 'latin1'
    });
    exec(`cscript //nologo ${vbsPath}`, () => {
        try {
            fs.unlinkSync(vbsPath);
        } catch (e) {}
        filesToClean.forEach(f => {
            if (fs.existsSync(f)) fs.unlinkSync(f);
        });
        clearPuzzle();
        const finalTxtPath = path.join(os.homedir(), 'Desktop', 'FINAL_MESSAGE.txt');
        fs.writeFileSync(finalTxtPath, "You won, Operator. LUX-4 is gone, but the world is now in darkness.\nDo not return.\n- CEO");
        fs.writeFileSync('./TERMINALACCESS/FINAL.status', 'COMPLETED');
        if (!fs.existsSync('../ACHIEVEMENTS/THE_END.ACH')) {
            showAchievementToast('LIGHT BRINGER')
            fs.writeFileSync('../ACHIEVEMENTS/THE_END.ACH', 'COMPLETED')
        }
        process.exit(0);
    });
}
async function officeChaosPhase() {
    saveCheckpoint("OFFICE_CHAOS");
    container.children.forEach(c => {
        if (c !== statusBox) c.hide();
    });
    const officeBox = blessed.box({
        parent: container,
        top: 'center',
        left: 'center',
        width: '85%',
        height: '70%',
        tags: true,
        border: {
            type: 'line'
        },
        style: style,
        padding: 1,
        scrollable: true
    });
    const scenes = [
        "[SYSTEM]: You enter the building. The air is heavy.",
        "[CHAOS]: Coworkers are running in circles, some praying, others smashing monitors.",
        "[DESPAIR]: 'THE LIGHT ISN'T COMING BACK!', the receptionist screams as her eyes bleed shadows.",
        "[MISSION]: You ignore the screams and run to the basement.",
        "[LOCATED]: You spot a brushed metal sign: 'POWER MANAGEMENT ROOM'."
    ];
    for (const scene of scenes) {
        await typeWriter(officeBox, scene);
        await new Promise(res => screen.once('keypress', (ch, key) => {
            if (key.name === 'enter') res();
        }));
    }
    officeBox.setContent("{center}\n\n[ FOCUSING ON SIGN ]\n\nPOWER MANAGEMENT ROOM{/center}");
    officeBox.parseTags = true;
    screen.render();
    await new Promise(res => setTimeout(res, 3000));
    const roomMenu = blessed.list({
        parent: container,
        bottom: 5,
        left: 'center',
        width: '40%',
        height: 6,
        label: ' ROOM ACTIONS ',
        items: [' 1. Sit at the Control Chair ', ' 2. Scream for help ', ' 3. Try to leave the building '],
        keys: true,
        border: {
            type: 'line'
        },
        style: style
    });
    roomMenu.on('select', async (item, index) => {
        if (index === 0) {
            roomMenu.hide();
            await typeWriter(officeBox, "[SYSTEM]: You sit in the chair. The terminal in front of you blinks green...");
            const terminalAction = blessed.list({
                parent: container,
                bottom: 5,
                left: 'center',
                width: '40%',
                height: 6,
                items: [' > POWER ON TERMINAL ', ' > DESTROY TERMINAL '],
                keys: true,
                border: {
                    type: 'line'
                },
                style: style
            });
            terminalAction.on('select', (it, idx) => {
                if (idx === 1) execGameOver("You destroyed the last hope for light. The darkness consumed you.");
                else {
                    const statusPath = './TERMINALACCESS/POWER_ACTIVE.status';
                    fs.writeFileSync(statusPath, '1');
                    saveCheckpoint("POWER_ACTIVE");
                    exec('start cmd /c "node TERMINAL_ENERGIA.js"');
                    officeBox.setContent("{center}SYSTEM STARTED IN SECOND INSTANCE.\nAWAITING ELEVATOR UNLOCK SEQUENCE...{/center}");
                    terminalAction.hide();
                    screen.render();
                    const checkClosure = setInterval(async () => {
                        if (!fs.existsSync(statusPath)) {
                            clearInterval(checkClosure);
                            if (fs.existsSync('./TERMINALACCESS/ELEVATOR_OPEN.status')) {
                                fs.unlinkSync('./TERMINALACCESS/ELEVATOR_OPEN.status');
                                officeBox.hide();
                                const elevatorScene = blessed.box({
                                    parent: container,
                                    top: 'center',
                                    left: 'center',
                                    width: '80%',
                                    height: '70%',
                                    border: {
                                        type: 'line'
                                    },
                                    style: style,
                                    padding: 1,
                                    tags: true
                                });
                                const elevatorNarration = [
                                    "[SYSTEM]: The terminal goes dark. A loud crash echoes at the end of the hallway.",
                                    "[NARRATOR]: The Sector 4 emergency lights blink in neon blue.",
                                    "[YOU]: I did it... the elevator is working.",
                                    "[NARRATOR]: You step inside the mirrored elevator. The air is cold.",
                                    "[SYSTEM]: DESCENT INITIATED. CHOOSE CABIN INTERFACE ACTIVITY."
                                ];
                                for (const f of elevatorNarration) {
                                    await typeWriter(elevatorScene, f);
                                    await new Promise(res => screen.once('keypress', (ch, key) => {
                                        if (key.name === 'enter') res();
                                    }));
                                }
                                const elevatorMenu = blessed.list({
                                    parent: container,
                                    top: 'center',
                                    left: 'center',
                                    width: '50%',
                                    height: 8,
                                    label: ' ELEVATOR INTERFACE ',
                                    items: [' 1. PLAY PACPRO (Subsystem) ', ' 2. LISTEN TO LOCAL RADIO '],
                                    keys: true,
                                    border: {
                                        type: 'line'
                                    },
                                    style: style,
                                    align: 'center'
                                });
                                elevatorMenu.focus();
                                screen.render();
                                elevatorMenu.on('select', async (it, eIdx) => {
                                    elevatorMenu.hide();
                                    if (eIdx === 0) {
                                        elevatorScene.setContent("{center}ELEVATOR IN MOTION...\n\nENTERTAINMENT SYSTEM ACTIVE.\nAWAITING PROCESS TERMINATION (Press F to exit game)...{/center}");
                                        screen.render();
                                        const pacmanProc = spawn('cmd.exe', ['/c', 'start', '/wait', 'node', 'PACPRO.js'], {
                                            shell: false,
                                            detached: false
                                        });
                                        const achPath = path.join(__dirname, '..', 'ACHIEVEMENTS', 'PACPRO.ach');
                                        pacmanProc.on('exit', async () => {
                                            if (fs.existsSync(achPath)) {
                                                elevatorScene.setContent("");
                                                await typeWriter(elevatorScene, "{yellow-fg}[SYSTEM]: ELITE DATA DETECTED. READING 'PACPRO.ach'...{/yellow-fg}");
                                                await new Promise(res => screen.once('keypress', (ch, key) => {
                                                    if (key.name === 'enter') res();
                                                }));
                                                await typeWriter(elevatorScene, "{yellow-fg}[NON-CANNON]: You actually cleared the simulation. Respect, Operator. You are elite.{/yellow-fg}");
                                                await new Promise(res => screen.once('keypress', (ch, key) => {
                                                    if (key.name === 'enter') res();
                                                }));
                                            }
                                            arrivalAtSublevel(elevatorScene);
                                        });
                                    } else {
                                        elevatorScene.setContent("");
                                        if (!fs.existsSync('../ACHIEVEMENTS/RADIO_LISTENER.ACH')) {
                                            showAchievementToast('STATIC VOICES')
                                            fs.writeFileSync('../ACHIEVEMENTS/RADIO_LISTENER.ACH', 'COMPLETED')
                                        }
                                        await typeWriter(elevatorScene, "[RADIO]: '...signal acquired. Tuning to 99.7 FM local news...'");
                                        await new Promise(res => screen.once('keypress', (ch, key) => {
                                            if (key.name === 'enter') res();
                                        }));
                                        await typeWriter(elevatorScene, "[RADIO]: 'LUX-4 Energy Corp has issued a formal statement regarding the 1999 THE FADE incident...'");
                                        await new Promise(res => screen.once('keypress', (ch, key) => {
                                            if (key.name === 'enter') res();
                                        }));
                                        await typeWriter(elevatorScene, "[RADIO]: 'The board officially denies any involvement, claiming the reports of anomalies are baseless conspiracy theories...'");
                                        await new Promise(res => screen.once('keypress', (ch, key) => {
                                            if (key.name === 'enter') res();
                                        }));
                                        const vbsPath = path.join(os.tmpdir(), 'warning.vbs');
                                        fs.writeFileSync(vbsPath, `MsgBox "YOU KNOW TOO MUCH", 16, "SYSTEM CRITICAL ERROR"`);
                                        exec(`cscript //nologo ${vbsPath}`, () => {
                                            try {
                                                fs.unlinkSync(vbsPath);
                                            } catch (e) {}
                                            arrivalAtSublevel(elevatorScene);
                                        });
                                    }
                                });
                            } else {
                                execGameOver("The power terminal was closed without releasing the protocols.");
                            }
                        }
                    }, 1000);
                }
            });
            terminalAction.focus();
            screen.render();
        } else {
            execGameOver("You wasted precious time. The room was flooded by shadows.");
        }
    });
    roomMenu.focus();
    screen.render();
}
async function arrivalAtSublevel(box) {
    saveCheckpoint("SUBLEVEL_7");
    box.setContent("");
    await typeWriter(box, "[SYSTEM]: *DING*");
    await new Promise(res => screen.once('keypress', (ch, key) => {
        if (key.name === 'enter') res();
    }));
    box.setContent(""); // Limpa para a próxima ou use box.content += "\n"
    await typeWriter(box, "[SYSTEM]: ARRIVAL: SUBLEVEL 7 - RESEARCH AND DEVELOPMENT.");
    await new Promise(res => screen.once('keypress', (ch, key) => {
        if (key.name === 'enter') res();
    }));
    box.setContent("");
    await typeWriter(box, "[NARRATOR]: The doors slide open. The basement is submerged in absolute silence.");
    await new Promise(res => screen.once('keypress', (ch, key) => {
        if (key.name === 'enter') res();
    }));
    const achPath = path.join(__dirname, '..', 'ACHIEVEMENTS', 'PACPRO.ach');
    const hasAch = fs.existsSync(achPath);
    sublevelExploration()
}
async function passwordWorkPhase() {
    container.children.forEach(c => {
        if (c !== statusBox) c.hide();
    });
    try {
        if (!fs.existsSync(desktopPath)) fs.mkdirSync(desktopPath);
        fs.writeFileSync(rootPassPath, passwordValue);
    } catch (e) {}
    const loginBox = blessed.box({
        parent: container,
        top: 'center',
        left: 'center',
        width: '75%',
        height: '55%',
        border: {
            type: 'line'
        },
        tags: true,
        style: style,
        padding: 1,
        content: `[CORPORATE ACCESS SYSTEM]\n\nSTATUS: AWAITING CREDENTIALS...\n\nHINT: Check your DOCUMENTS folder.`
    });
    screen.render();
    const monitor = setInterval(() => {
        const files = fs.readdirSync(desktopPath).filter(f => f !== 'READ-ME.txt');
        if (files.length > 0) {
            clearInterval(monitor);
            const content = fs.readFileSync(path.join(desktopPath, files[0]), 'utf8').trim();
            if (content === passwordValue) {
                loginBox.setContent("{green-fg}ACCESS GRANTED. SECTOR 7.{/green-fg}");
                setTimeout(() => {
                    clearPuzzle();
                    officeChaosPhase();
                }, 2000);
            } else if (content === "LUX4LIFE") {
                if (!fs.existsSync('../ACHIEVEMENTS/REBEL_PATH.ACH')) {
                    showAchievementToast('HELLO, REBEL')
                    fs.writeFileSync('../ACHIEVEMENTS/REBEL_PATH.ACH', 'COMPLETED')
                }
                fs.writeFileSync('./TERMINALACCESS/SECRET_ROUTE.status', '1');
                loginBox.setContent("{yellow-fg}ADMINISTRATIVE OVERRIDE DETECTED. HELLO, REBEL.{/yellow-fg}");
                setTimeout(() => {
                    clearPuzzle();
                    officeChaosPhase();
                }, 2000);
            } else {
                execGameOver("FALSE OR CORRUPTED CREDENTIAL FILE. SECURITY TRIGGERED.");
            }
        }
    }, 1000);
}

function finalChoicePhase() {
    container.children.forEach(c => {
        if (c !== statusBox) c.hide();
    });
    const finalMenu = blessed.list({
        parent: container,
        top: 'center',
        left: 'center',
        width: '60%',
        height: 10,
        label: ' ARRIVAL AT WORK ',
        items: [
            ' 1. ENTER AND WORK ',
            ' 2. LEAVE AND ENJOY LIFE ',
            ' 3. RANDOM (DECIDE BY LUCK) '
        ],
        keys: true,
        border: {
            type: 'line'
        },
        style: style,
        align: 'center'
    });
    finalMenu.on('select', (item, index) => {
        if (index === 0) {
            passwordWorkPhase();
        } else if (index === 1) {
            execGameOver("You chose life. As the world went dark, you felt peace for the first time.");
        } else {
            const failChance = Math.random() < 0.15;
            if (failChance) {
                passwordWorkPhase();
            } else {
                execGameOver("The die saved you. You turned your back on the building and went to enjoy the end.");
            }
        }
    });
    finalMenu.focus();
    screen.render();
}
async function thePathPhase() {
    container.children.forEach(c => {
        if (c !== statusBox) c.hide();
    });
    const roadBox = blessed.box({
        parent: container,
        top: 'center',
        left: 'center',
        width: '80%',
        height: '60%',
        border: {
            type: 'line'
        },
        style: style,
        padding: 1
    });
    const logs = [
        "[REPORT]: You drive through the streets... the asphalt seems to absorb the headlights.",
        "[OBSERVATION]: You see a brutal car accident. The victims just stare at the dark sky.",
        "[WORLD]: Entire buildings are losing color, becoming static gray.",
        "[CHAOS]: The sky at 7:00 AM is as black as the bottom of a well.",
        "[NARRATOR]: You finally park in front of the office block.",
        "--- PRESS ENTER TO EXIT THE CAR ---"
    ];
    for (const text of logs) {
        await typeWriter(roadBox, text);
        await new Promise(res => {
            const handler = (ch, key) => {
                if (key.name === 'enter') {
                    screen.removeListener('keypress', handler);
                    res();
                }
            };
            screen.on('keypress', handler);
        });
    }
    roadBox.destroy();
    finalChoicePhase();
}
async function startGameplay(initialTime) {
    container.children.forEach(child => {
        if (child !== statusBox) child.hide();
    });
    let timeRemaining = initialTime;
    let completedTasks = new Set();
    const timerBox = blessed.box({
        parent: container,
        top: 2,
        left: 'center',
        width: 20,
        height: 3,
        content: `TIME: ${timeRemaining}s`,
        align: 'center',
        border: {
            type: 'line'
        },
        style: {
            fg: COLOR_HEX,
            border: {
                fg: COLOR_HEX
            },
            bold: true
        }
    });
    const actionsMenu = blessed.list({
        parent: container,
        top: 'center',
        left: 'center',
        width: '60%',
        height: 10,
        label: ' QUICK PREPARATION ',
        items: [
            ' 1. Take a cold shower ',
            ' 2. Put on work uniform ',
            ' 3. Look for car keys ',
            ' 4. Gulp down breakfast ',
            ' 5. Check window locks ',
            ' 6. LEAVE THE HOUSE '
        ],
        keys: true,
        border: {
            type: 'line'
        },
        style: style,
        align: 'center'
    });
    const timerInterval = setInterval(() => {
        timeRemaining--; // Tempo agora corre sem parar nunca
        timerBox.setContent(`TIME: ${timeRemaining}s`);
        if (timeRemaining <= 3) {
            timerBox.style.fg = 'red';
            timerBox.style.border.fg = 'red';
        }
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            execGameOver("TIME IS UP. YOU ARRIVED LATE FOR WORK.");
        }
        screen.render();
    }, 1000);
    actionsMenu.on('select', (item, index) => {
        if (index === 5) {
            if (completedTasks.size >= 5) {
                clearInterval(timerInterval);
                if (timeRemaining > 7) {
                    const achPath = path.join(__dirname, '..', 'Achievements', 'NEVERMISS.ach');
                    if (!fs.existsSync(achPath)) {
                        showAchievementToast('NEVER BE LATE')
                        fs.writeFileSync(achPath, 'COMPLETED');
                    }
                }
                thePathPhase();
            } else {
                statusBox.setContent(" ERROR: You haven't finished getting ready! ");
                screen.render();
            }
            return;
        }
        if (!completedTasks.has(index)) {
            const originalText = item.getText();
            item.setContent(`${originalText} [OK]`);
            item.style.fg = 'green';
            completedTasks.add(index);
            statusBox.setContent(` Completed: ${originalText.trim()} `);
            screen.render();
        }
    });
    actionsMenu.focus();
    screen.render();
}
async function startNarrative() {
    container.children.forEach(child => {
        if (child !== statusBox) child.hide();
    });
    const narrativeBox = blessed.box({
        parent: container,
        top: 'center',
        left: 'center',
        width: '80%',
        height: '40%',
        border: {
            type: 'line'
        },
        style: style,
        padding: 1
    });
    const texts = [
        "[NARRATOR]: You wake up in your bed...",
        "[NARRATOR]: The world seems to be 'fading out' around you...",
        "[YOU]: How strange, the buildings look darker... maybe it's just my head.",
        "[NARRATOR]: You discover the worst: it's 6:30. You're late.",
        "[YOU]: Damn! I have to leave NOW!",
        "--- PRESS ENTER TO START GETTING READY ---"
    ];
    for (const text of texts) {
        await typeWriter(narrativeBox, text);
        await new Promise(res => {
            const tempHandler = (ch, key) => {
                if (key.name === 'enter') {
                    screen.removeListener('keypress', tempHandler);
                    res();
                }
            };
            screen.on('keypress', tempHandler);
        });
    }
    narrativeBox.destroy();
    startGameplay(10);
}
async function monitorSurvey() {
    const loading = blessed.loading({
        parent: container,
        top: 'center',
        left: 'center',
        width: 'shrink',
        height: 'shrink',
        border: {
            type: 'line'
        },
        style: style
    });
    loading.load(' [SYSTEM AWAITING SURVEY RESPONSES...] ');
    screen.render();
    return new Promise((resolve) => {
        const check = setInterval(() => {
            const successExists = fs.existsSync('./TERMINALACCESS/ACESSOSTATUS.LIGHT');
            const fadeExists = fs.existsSync('./TERMINALACCESS/MEMORY_1999.bin');
            const failureExists = fs.existsSync('./TERMINALACCESS/GAMEOVER.status');
            if (successExists || fadeExists || failureExists) {
                clearInterval(check);
                loading.stop();
                if (failureExists) {
                    execGameOver("SYSTEM LOCKED: INTRUSION ATTEMPT.");
                } else if (fadeExists) {
                    container.children.forEach(c => c.hide());
                    const fadeBox = blessed.box({
                        parent: container,
                        top: 'center',
                        left: 'center',
                        width: '80%',
                        height: '40%',
                        border: {
                            type: 'line',
                            fg: 'yellow'
                        },
                        style: {
                            fg: 'yellow'
                        },
                        padding: 1,
                        content: "{center}{bold}[WARNING] 1999 MEMORY SYNCED.{/bold}\n\nYOU ARE NOW PART OF THE FADE.\nSYSTEM IN CONFLICT.\n\n{blink}Press [ENTER] to clear cache and retry the Survey...{/blink}{/center}",
                        tags: true
                    });
                    screen.render();
                    screen.once('keypress', (ch, key) => {
                        if (key.name === 'enter') {
                            fadeBox.destroy();
                            try {
                                fs.unlinkSync('./TERMINALACCESS/MEMORY_1999.bin');
                            } catch (e) {}
                            exec('start cmd /c "node SURVEY.js"');
                            resolve(monitorSurvey());
                        }
                    });
                } else {
                    const status = fs.readFileSync('./TERMINALACCESS/ACESSOSTATUS.LIGHT', 'utf8').trim();
                    if (status === '1') {
                        resolve(true);
                    } else {
                        execGameOver("AUTHENTICATION FAILED.");
                    }
                }
            }
        }, 500);
    });
}

function startMainMenu() {
    const logoBox = blessed.text({
        parent: container,
        top: 2,
        left: 'center',
        content: LOGO_TEXT,
        style: {
            fg: COLOR_HEX
        },
        align: 'center'
    });

    // --- LÓGICA DE VERIFICAÇÃO DE CHECKPOINT ---
    const checkPath = path.join(__dirname, '..', 'CONFIG', 'CHECKPOINT.json');
    let hasCheckpoint = fs.existsSync(checkPath);
    let checkpointData = null;
    if (hasCheckpoint) {
        try {
            checkpointData = JSON.parse(fs.readFileSync(checkPath, 'utf8'));
        } catch (e) {
            hasCheckpoint = false;
        }
    }

    // Define os itens dinamicamente
    let menuItems = [' > START NEW SURVEY '];
    if (hasCheckpoint) {
        menuItems.push(' > CONTINUE MISSION ');
    }
    menuItems.push(' > EXIT ');

    const menu = blessed.list({
        parent: container,
        top: 15,
        left: 'center',
        width: '40%',
        height: hasCheckpoint ? 8 : 6, // Ajusta altura se tiver mais itens
        items: menuItems,
        keys: true,
        border: {
            type: 'line'
        },
        style: style,
        align: 'center'
    });

    menu.on('select', async (item, index) => {
        const text = item.getText();

        if (text.includes('EXIT')) process.exit(0);

        if (text.includes('CONTINUE')) {
            menu.hide();
            logoBox.hide();
            loadStage(checkpointData.last_stage);
            return;
        }

        if (text.includes('START NEW')) {
            if (fs.existsSync(checkPath)) fs.unlinkSync(checkPath);
            
            menu.hide();
            logoBox.hide();
            exec('start cmd /c "node SURVEY.js"');
            const ok = await monitorSurvey();
            if (ok) {
                saveCheckpoint("START_NARRATIVE");
                startNarrative();
            } else {
                execGameOver("SYSTEM LOCKED: INTRUSION ATTEMPT DETECTED.");
            }
        }
    });

    menu.focus();
    screen.render();
}
screen.key(['escape', 'C-c'], () => {
    clearPuzzle();
    process.exit(0);
});
const isGameFinished = fs.existsSync('./TERMINALACCESS/FINAL.status');
if (isGameFinished) {
    const winBox = blessed.box({
        parent: container,
        top: 'center',
        left: 'center',
        width: 60,
        height: 10,
        border: {
            type: 'line',
            fg: 'yellow'
        },
        label: ' {bold}CONGRATULATIONS{/bold} ',
        content: '{center}\nYou have defeated LUX-4.\nThe LUX-4 system has been dismantled.{/center}',
        tags: true
    });
    const winMenu = blessed.list({
        parent: winBox,
        bottom: 1,
        left: 'center',
        width: '80%',
        height: 5,
        items: [' > DELETE SAVE AND RETRY ', ' > CLOSE TERMINAL '],
        keys: true,
        style: style
    });
    winMenu.on('select', (it, idx) => {
        if (idx === 0) {
            fs.unlinkSync('./TERMINALACCESS/FINAL.status');
            process.exit(0);
        } else {
            process.exit(0);
        }
    });
    winMenu.focus();
    screen.render();
} else {
    watchAchievements();
    startMainMenu();
}

process.on('exit', () => {
    saveFinalTime();
});

// Se o usuário apertar ESC para sair
screen.key(['escape', 'C-c'], () => {
    saveFinalTime();
    clearPuzzle();
    process.exit(0);
});