const blessed = require('blessed');
const fs = require('fs');
let vlcProcess = null;
const {
    exec,
    spawn
} = require('child_process');
const path = require('path');
const os = require('os');
let stage
const { on } = require('events');
const { escape } = require('querystring');
const { t } = require('./translate.js');
let shouldShutdown = false;

const player = require('play-sound')({
    player: '../AUDIO/PLAYER/cmdmp3.exe'
});
const audioFile = '../AUDIO/TRACKS/4.mp3';
const audioaa = '../AUDIO/TRACKS/5.mp3';
let bgmProcess = null;
let effectProcess = null;
const beepfile = '../AUDIO/EFFECTS/BEEP.wav'
const beepfile2 = '../AUDIO/EFFECTS/BEEP2.wav'
const freshfile = '../AUDIO/EFFECTS/FRESH.wav'
const CEOfile = '../AUDIO/TRACKS/CEO.mp3';
const end2 = '../AUDIO/TRACKS/The_True_Light.mp3';
const BOOTfile = '../AUDIO/EFFECTS/LUX-4.wav'
const winfile = '../AUDIO/EFFECTS/win.wav'
const warningfile = '../AUDIO/EFFECTS/warning.wav'
const supportfile = '../AUDIO/EFFECTS/support.wav'
const backfile = '../AUDIO/EFFECTS/back.wav'
const startfile = '../AUDIO/EFFECTS/start.wav'
const checkpointfile = '../AUDIO/EFFECTS/checkpoint.wav'
const sucessofile = '../AUDIO/EFFECTS/win2.wav'
const MEMORY1999 = '../AUDIO/EFFECTS/1999.WAV'
const alarm = '../AUDIO/EFFECTS/alarm.mp3'
const GOfile = '../AUDIO/EFFECTS/GAMEOVER.MP3'
let iscreditsOpen = false;
const logocredits =
    "███        ███  ████████  ███  ███  █████████\n" +
    "███        ███  ███  ███  ███  ███     ███   \n" +
    "███        ███  ███       ███  ███     ███   \n" +
    "███        ███  ███ ████  ████████     ███   \n" +
    "███        ███  ███  ███  ███  ███     ███   \n" +
    "███        ███  ███  ███  ███  ███     ███   \n" +
    "███        ███  ███  ███  ███  ███     ███   \n" +
    "  █████████  ███  ████████  ███  ███     ███     ";
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

if (fs.existsSync('../CONFIG/AUDIOSTATE.txt')) {
    var audiostate = fs.readFileSync(path.join('../CONFIG/AUDIOSTATE.txt'), 'utf8')
} else {
    var audiostate = 'ON';
    fs.writeFileSync('../CONFIG/AUDIOSTATE.txt', audiostate, 'utf8');
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
    content: t('MAIN_STATUS_NAV'),
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
    stopAudio()
    setTimeout(() => {
        playgameover()
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
            content: t('MAIN_GAME_OVER', { reason }),
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
    },200)
}

function playgameover() {
    if (EFFECTS_STATUS === 'OFF') return;
    player.play(GOfile, (err) => {});
}

function playalarm() {
    if (EFFECTS_STATUS === 'OFF') return;
    player.play(alarm, (err) => {});
}

function playBeep() {
    if (EFFECTS_STATUS === 'OFF') return;
    player.play(beepfile, (err) => {});
}

function playlux4() {
    if (EFFECTS_STATUS === 'OFF') return;
    player.play(BOOTfile, (err) => {});
}

function playceo() {
    if (EFFECTS_STATUS === 'OFF') return;
    player.play(CEOfile, (err) => {});
}

function play1999() {
    if (EFFECTS_STATUS === 'OFF') return;
    player.play(MEMORY1999, (err) => {});
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

function stopAudio() {
    if (bgmProcess) {
        bgmProcess.kill();
        bgmProcess = null;
    }
    exec('taskkill /F /IM cmdmp3.exe /T > nul 2>&1');
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
    'FORGOTTEN': t('ACHIEVEMENT_FORGOTTEN_NAME')
};

function showLoadToast() {
    const toast = blessed.box({
        parent: screen,
        top: 'center',
        left: 'center',
        width: 25,
        height: 6,
        border: 'line',
        tags: true,
        content: t('MAIN_CHECKPOINT_LOADED', { stage }),
        style: { border: { fg: 'green' }, bg: 'black' }
    });
    toast.setIndex(1000);
    screen.render();
    setTimeout(() => { toast.destroy(); screen.render(); }, 2000);
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

function generateLoreFiles() {
    const lorePath = path.join(os.homedir(), 'Desktop', 'LUX-4_LORE');
    if (!fs.existsSync(lorePath)) fs.mkdirSync(lorePath, { recursive: true });
    
    if (!fs.existsSync(path.join(lorePath, 'PROJECT_FADE_DETAILED.txt'))) {
        fs.writeFileSync(path.join(lorePath, 'PROJECT_FADE_DETAILED.txt'), t('LORE_PROJECT_FADE'));
    }
    
    if (!fs.existsSync(path.join(lorePath, 'OPERATOR_06_DIARY.txt'))) {
        fs.writeFileSync(path.join(lorePath, 'OPERATOR_06_DIARY.txt'), t('LORE_OPERATOR_DIARY'));
    }
    
    if (!fs.existsSync(path.join(lorePath, 'STERLING_CONFESSION.txt'))) {
        fs.writeFileSync(path.join(lorePath, 'STERLING_CONFESSION.txt'), t('LORE_STERLING_CONFESSION'));
    }
    
    if (!fs.existsSync(path.join(lorePath, 'OPERATOR_06_FINAL.txt'))) {
        fs.writeFileSync(path.join(lorePath, 'OPERATOR_06_FINAL.txt'), t('LORE_OPERATOR_FINAL'));
    }
}

function credits() {
    screen.unkey('enter');
    screen.unkey('escape');
    if (iscreditsOpen) return;
    if (audiostate === 'ON') stopAudio();
    
    iscreditsOpen = true;
    let slideTimer = null;
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
        width: '80%', height: 12,
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
    
    const exitToMenu = () => {
        stopcreditsaudio();
        screen.destroy();
        
        if (shouldShutdown) {
            exec('shutdown /s /t 5 /c "LUX-4: Mission Complete. System powering down."');
            setTimeout(()=>{
            process.exit(0);
            },300)
            
        } else {
            process.exit(0);
        }
    };

    const fastMenu = blessed.list({
        parent: bgOverlay,
        bottom: 3,
        left: 'center',
        width: '40%',
        height: 6,
        label: t('CREDITS_QUICK_ACTIONS'),
        border: 'line',
        tags: true,
        hidden: true,
        keys: true,
        items: [
            t('CREDITS_INSTAGRAM'),
            t('CREDITS_EXIT'),
            t('CREDITS_CANCEL')
        ],
        style: {
            border: { fg: COLORDEFAULT },
            label: { fg: COLORDEFAULT, bold: true },
            selected: { bg: COLORDEFAULT, fg: 'white', bold: true }
        },
        index: 1000
    });

    const finalMenu = blessed.list({
        parent: bgOverlay,
        top: 'center',
        left: 'center',
        width: 40,
        height: 8,
        label: t('CREDITS_FINAL_TITLE'),
        border: 'line',
        tags: true,
        hidden: true,
        keys: true,
        items: [
            t('CREDITS_REPLAY'),
            t('CREDITS_INSTAGRAM'),
            t('CREDITS_EXIT_TO_MENU')
        ],
        style: {
            border: { fg: COLORDEFAULT },
            label: { fg: COLORDEFAULT, bold: true },
            selected: { bg: COLORDEFAULT, fg: 'white', bold: true }
        },
        index: 1000
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

    function showNextSlide() {
        if (!iscreditsOpen || finalMenu.visible) return;
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
            finalMenu.focus();
            screen.render();
        }
    }

    screen.on('keypress', (ch, key) => {
        if (key && key.name === 'enter') {
            if (iscreditsOpen && !finalMenu.visible && !fastMenu.visible) {
                fastMenu.show();
                fastMenu.focus();
                screen.render();
                return;
            }
        }
    });

    fastMenu.on('select', (item) => {
        const txt = item.getText();
        if (txt.includes(t('CREDITS_INSTAGRAM'))) exec('start https://instagram.com/PlayLightGame');
        if (txt.includes(t('CREDITS_EXIT'))) exitToMenu();
        if (txt.includes(t('CREDITS_CANCEL'))) {
            fastMenu.hide();
            screen.render();
        }
    });

    finalMenu.on('select', (item) => {
        const txt = item.getText();
        if (txt.includes(t('CREDITS_REPLAY'))) {
            currentSlide = 0;
            finalMenu.hide();
            displayBox.show();
            skipMsg.show();
            if (fs.existsSync('./TERMINALACCESS/SECRET_ROUTE.status')) {
                playcreditsaudio2()
            } else {
                playcreditsaudio();
            }
            showNextSlide();
        }
        if (txt.includes(t('CREDITS_INSTAGRAM'))) exec('start https://instagram.com/PlayLightGame');
        if (txt.includes(t('CREDITS_EXIT_TO_MENU'))) exitToMenu();
    });

    [fastMenu, finalMenu].forEach(m => {
        m.on('select item', () => playBeep());
    });

    if (iscreditsOpen)  {
        if (fs.existsSync('./TERMINALACCESS/SECRET_ROUTE.status')) {
            playcreditsaudio2()
        } else {
            playcreditsaudio();
        }
    }
    showNextSlide();
    screen.render();
}

screen.key(['escape', 'C-c'], () => {
    if (iscreditsOpen) {
        return;
    } else {
        saveFinalTime();
        clearPuzzle();
        process.exit(0);
    }
});

const releaseLock = () => {
    if (fs.existsSync(LOCK_FILE)) {
        try { fs.unlinkSync(LOCK_FILE); } catch (e) {}
    }
};

function stopcreditsaudio() {
    exec('taskkill /F /IM cmdmp3.exe /T > nul 2>&1', (err) => {});
}

function playcreditsaudio() {
    player.play(audioaa, function(err){
        if (err && iscreditsOpen) {}
    });
}
function playcreditsaudio2() {
    player.play(end2, function(err){
        if (err && iscreditsOpen) {}
    });
}

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
        fg: '#555555',
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
        playtimerBox.setContent(`{bold}${t('MAIN_TIME_LABEL')}: ${formatTime(playtimeSeconds)}{/}`);
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
    playwin();
    const name = ACHIEVEMENT_NAMES[id] || id;
    const toast = blessed.box({
        parent: screen,
        top: 2,
        right: 2,
        width: 35,
        height: 5,
        border: 'line',
        tags: true,
        content: t('MAIN_ACHIEVEMENT_UNLOCKED', { name }),
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
    playwin();
    const toast = blessed.box({
        parent: screen,
        top: 2,
        right: 2,
        width: 30,
        height: 5,
        border: 'line',
        tags: true,
        content: t('MAIN_CHECKPOINT_REACHED'),
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
    const isSecret = fs.existsSync('./TERMINALACCESS/SECRET_ROUTE.status');

    const saveData = {
        last_stage: stageName,
        secret_route: isSecret,
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
    } catch (e) {}
}

function loadStage(stageName) {
    showLoadToast();
    
    const savePath = path.join(__dirname, '..', 'CONFIG', 'CHECKPOINT.json');
    if (fs.existsSync(savePath)) {
        try {
            const checkpointData = JSON.parse(fs.readFileSync(savePath, 'utf8'));
            if (checkpointData.secret_route) {
                if (!fs.existsSync('./TERMINALACCESS/SECRET_ROUTE.status')) {
                    fs.writeFileSync('./TERMINALACCESS/SECRET_ROUTE.status', '1');
                }
            }
        } catch (e) {}
    }

    container.children.forEach(c => {
        if (c !== statusBox) c.hide();
    });

    setTimeout(async () => {
        statusBox.setContent(t('MAIN_SYSTEM_RESTORING', { stage: stageName }));
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
                    fs.writeFileSync('./TERMINALACCESS/POWER_ACTIVE.status', '1');
                    await officeChaosPhase(); 
                    break;
                case "SUBLEVEL_7": 
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

async function encounterOperator06Traces(box) {
    playBeep2();
    await typeWriter(box, t('ENCOUNTER_01'));
    await new Promise(res => setTimeout(res, 800));
    await typeWriter(box, t('ENCOUNTER_02'));
    await new Promise(res => screen.once('keypress', (ch, key) => { if (key.name === 'enter') res(); }));
    await typeWriter(box, t('ENCOUNTER_03'));
    await new Promise(res => screen.once('keypress', (ch, key) => { if (key.name === 'enter') res(); }));
    await typeWriter(box, t('ENCOUNTER_04'));
    await new Promise(res => screen.once('keypress', (ch, key) => { if (key.name === 'enter') res(); }));
    await typeWriter(box, t('ENCOUNTER_05'));
    await new Promise(res => screen.once('keypress', (ch, key) => { if (key.name === 'enter') res(); }));
    await typeWriter(box, t('ENCOUNTER_06'));
    await new Promise(res => screen.once('keypress', (ch, key) => { if (key.name === 'enter') res(); }));
    await typeWriter(box, t('ENCOUNTER_07'));
    await new Promise(res => screen.once('keypress', (ch, key) => { if (key.name === 'enter') res(); }));
    await typeWriter(box, t('ENCOUNTER_08'));
    await new Promise(res => screen.once('keypress', (ch, key) => { if (key.name === 'enter') res(); }));
    await typeWriter(box, t('ENCOUNTER_09'));
    
    fs.writeFileSync('./TERMINALACCESS/OPERATOR06_MESSAGE.txt', 'Heard the voice of Operator 06');
    
    if (!fs.existsSync('../ACHIEVEMENTS/VOICE_HEARD.ACH')) {
        fs.writeFileSync('../ACHIEVEMENTS/VOICE_HEARD.ACH', 'COMPLETED');
        showAchievementToast('VOICE_HEARD');
    }
    
    await new Promise(res => setTimeout(res, 2000));
}

async function coreWhisperSequence(box) {
    playBeep2();
    await typeWriter(box, t('CORE_WHISPER_01'));
    await new Promise(res => setTimeout(res, 800));
    await typeWriter(box, t('CORE_WHISPER_02'));
    await new Promise(res => setTimeout(res, 800));
    await typeWriter(box, t('CORE_WHISPER_03'));
    await new Promise(res => setTimeout(res, 800));
    await typeWriter(box, t('CORE_WHISPER_04'));
    await new Promise(res => setTimeout(res, 800));
    await typeWriter(box, t('CORE_WHISPER_05'));
    
    const response = blessed.list({
        parent: box,
        bottom: 3,
        left: 'center',
        width: '50%',
        height: 4,
        items: [
            t('CORE_CHOICE_REMEMBER'),
            t('CORE_CHOICE_FORGET')
        ],
        keys: true,
        border: { type: 'line' },
        style: style
    });
    
    response.focus();
    screen.render();
    
    return new Promise((resolve) => {
        response.on('select', (item, idx) => {
            response.destroy();
            if (idx === 0) {
                fs.writeFileSync('./TERMINALACCESS/REMEMBERED.status', '1');
                if (!fs.existsSync('../ACHIEVEMENTS/REMEMBERED.ACH')) {
                    fs.writeFileSync('../ACHIEVEMENTS/REMEMBERED.ACH', 'COMPLETED');
                    showAchievementToast('REMEMBERED');
                }
                playwin();
            } else {
                fs.writeFileSync('./TERMINALACCESS/FORGOTTEN.status', '1');
                if (!fs.existsSync('../ACHIEVEMENTS/FORGOTTEN.ACH')) {
                    fs.writeFileSync('../ACHIEVEMENTS/FORGOTTEN.ACH', 'COMPLETED');
                    showAchievementToast('FORGOTTEN');
                }
                playwarning();
            }
            resolve();
        });
    });
}

async function accessLuxFiles(box) {
    stopAudio()
    box.setContent("");
    playBeep2()
    await typeWriter(box, t('MAIN_BALANCE'));
    await new Promise(res => setTimeout(res, 1000));
    playBeep2()
    await typeWriter(box, t('MAIN_INSIDE'));
    await new Promise(res => screen.once('keypress', (ch, key) => {
        if (key.name === 'enter') res();
    }));
    box.setContent(t('MAIN_ENCRYPTION_PROMPT'));
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
        playBeep2()
        if (value === "lux1999files") {
            accessInput.destroy();
            box.setContent(t('MAIN_DECRYPTING'));
            if (!fs.existsSync('../ACHIEVEMENTS/TRUTH_SEEKER.ACH')) {
                showAchievementToast(t('ACHIEVEMENT_TRUTH_SEEKER_NAME'))
                fs.writeFileSync('../ACHIEVEMENTS/TRUTH_SEEKER.ACH', 'COMPLETED')
            }
            screen.render();
            setTimeout(() => {
                const leakProc = spawn('cmd.exe', ['/c', 'start', '/wait', 'node', 'leaks.js'], {
                    shell: false
                });
                leakProc.on('exit', () => {
                    playalarm()
                    box.setContent("");
                    box.style.border.fg = "yellow";
                    box.setContent(t('MAIN_BREACH'));
                    screen.render();
                    
                    
                    screen.key(['enter', 'escape'], () => setTimeout(() => {
                        stopAudio()
                        setTimeout(() => {
                            generateLoreFiles();
                            credits()
                        },200)
                    },300)
                );
                });
            }, 2000);
        } else {
            accessInput.destroy();
            execGameOver(t('MAIN_ENCRYPTION_FAIL'));
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
    
    playBeep2()
    await typeWriter(sublevelBox, t('MAIN_SUBLEVEL'));
    await new Promise(res => screen.once('keypress', (ch, key) => {
        if (key.name === 'enter') res();
    }));
    
    await encounterOperator06Traces(sublevelBox);
    
    const hasVoiceHeard = fs.existsSync('../ACHIEVEMENTS/VOICE_HEARD.ACH');
    const hasRemembered = fs.existsSync('../ACHIEVEMENTS/REMEMBERED.ACH');
    const hasTruthSeeker = fs.existsSync('../ACHIEVEMENTS/TRUTH_SEEKER.ACH');
    
    if (hasVoiceHeard && hasRemembered && hasTruthSeeker) {
        playBeep2();
        await typeWriter(sublevelBox, t('MEMORY_TERMINAL_FOUND'));
        await new Promise(res => screen.once('keypress', (ch, key) => {
            if (key.name === 'enter') res();
        }));
        
        const memoryChoice = blessed.list({
            parent: container,
            bottom: 5,
            left: 'center',
            width: '50%',
            height: 5,
            label: t('MEMORY_TERMINAL_TITLE'),
            items: [
                t('MEMORY_TERMINAL_ACCESS'),
                t('MEMORY_TERMINAL_SKIP')
            ],
            keys: true,
            border: { type: 'line' },
            style: style,
            align: 'center'
        });
        
        memoryChoice.focus();
        screen.render();
        
        const choiceResult = await new Promise((resolve) => {
            memoryChoice.on('select', (item, idx) => {
                playBeep2();
                memoryChoice.destroy();
                resolve(idx === 0);
            });
        });
        
        if (choiceResult) {
            saveCheckpoint("SUBLEVEL_7");
            
            screen.destroy();
                const memoryProcess = spawn('node', ['memory.js'], {
                    stdio: 'inherit',
                    cwd: __dirname
                });
            memoryProcess.on('exit', () => {
                process.exit(0);
            });
            return;
        }
    }
    
    playBeep2()
    await typeWriter(sublevelBox, t('MAIN_ALARM'));
    await new Promise(res => setTimeout(res, 1000));
    playalarm()
    
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
                showAchievementToast(t('ACHIEVEMENT_SLOWTYPIST_NAME'))
                fs.writeFileSync('../ACHIEVEMENTS/SLOWTYPIST.ACH', 'COMPLETED')
            }
            execGameOver(t('MAIN_TIMEOUT'));
        } else {
            sublevelBox.setContent(t('MAIN_LOCKDOWN', { code: codeToType, time: timeLeft }));
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
            stopAudio()
            setTimeout(() => {
                playwin()
            },200)
            
            sublevelBox.style.bg = 'black';
            sublevelBox.setContent(t('MAIN_OVERRIDE_SUCCESS'));
            screen.render();
            setTimeout(() => {
                inputField.destroy();
                saveCheckpoint("CORE_FINAL");
                coreFinalSequence(sublevelBox);
            }, 2000);
        } else {
            missionFailed = true;
            execGameOver(t('MAIN_INVALID_CODE'));
        }
    });
}

async function coreFinalSequence(box) {
    box.setContent("");
    const achPath = path.join(__dirname, '..', 'ACHIEVEMENTS', 'PACPRO.ach');
    const isElite = fs.existsSync(achPath);
    if (isElite) {
        playBeep2()
        await typeWriter(box, t('MAIN_ELITE_DATA'));
        await new Promise(res => screen.once('keypress', (ch, key) => {
            if (key.name === 'enter') res();
        }));
        playBeep2()
        await typeWriter(box, t('MAIN_PRELUDE'));
        await new Promise(res => screen.once('keypress', (ch, key) => {
            if (key.name === 'enter') res();
        }));
        box.setContent("");
    }
    playBeep2()
    await typeWriter(box, t('MAIN_SYSTEM_DENIED'));
    await new Promise(res => screen.once('keypress', (ch, key) => {
        if (key.name === 'enter') res();
    }));
    playBeep2()
    await typeWriter(box, t('MAIN_NARRATOR_ARMS'));
    await new Promise(res => screen.once('keypress', (ch, key) => {
        if (key.name === 'enter') res();
    }));
    playBeep2()
    await typeWriter(box, t('MAIN_SYSTEM_FLUCTUATION'));
    await new Promise(res => screen.once('keypress', (ch, key) => {
        if (key.name === 'enter') res();
    }));
    
    await coreWhisperSequence(box);
    
    box.setContent(t('MAIN_CHAIR_LOCKED'));
    screen.render();
    const balancerProc = spawn('cmd.exe', ['/c', 'start', '/wait', 'node', 'BALANCER.js'], {
        shell: false
    });
    balancerProc.on('exit', () => {
        const successFile = './BALANCER_SUCCESS.status';
        const isSecretRoute = fs.existsSync('./TERMINALACCESS/SECRET_ROUTE.status');
        if (!fs.existsSync(successFile)) {
            if (!fs.existsSync('../ACHIEVEMENTS/SHADOW_FALL.ACH')) {
                showAchievementToast(t('ACHIEVEMENT_SHADOW_FALL_NAME'))
                fs.writeFileSync('../ACHIEVEMENTS/SHADOW_FALL.ACH', 'COMPLETED')
            }
        }
        if (fs.existsSync(successFile)) {
            fs.unlinkSync(successFile);
            if (isSecretRoute) {
                playsupport()
                ceoConfrontation();
            } else {
                if (!fs.existsSync('../ACHIEVEMENTS/GHOST_GUARDIAN.ACH')) {
                    showAchievementToast(t('ACHIEVEMENT_GHOST_GUARDIAN_NAME'))
                    fs.writeFileSync('../ACHIEVEMENTS/GHOST_GUARDIAN.ACH', 'COMPLETED')
                }
                accessLuxFiles(box);
            }
        } else {
            execGameOver(t('MAIN_CORE_EXPLODED'));
        }
    });
}
async function finalChoicePhase(box) {
    box.setContent("");
    const achPath = path.join(__dirname, '..', 'ACHIEVEMENTS', 'PACPRO.ach');
    const isElite = fs.existsSync(achPath);
    const narrative = [
        t('MAIN_FINAL_CHOICE_1'),
        t('MAIN_FINAL_CHOICE_2')
    ];
    if (isElite) {
        narrative.push(t('MAIN_FINAL_CHOICE_ELITE_1'));
        narrative.push(t('MAIN_FINAL_CHOICE_ELITE_2'));
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
        label: t('MAIN_FINAL_OVERRIDE'),
        items: [
            t('MAIN_FINAL_PURGE'),
            t('MAIN_FINAL_STABILIZE'),
            t('MAIN_FINAL_MERGE')
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
            await typeWriter(box, t('MAIN_FINAL_PURGE_TEXT'));
            execGameOver(t('MAIN_FINAL_PURGE_END'));
            fs.writeFileSync('../ACHIEVEMENTS/CITY_DARK.ACH', 'COMPLETED')
        } else if (idx === 1) {
            await typeWriter(box, t('MAIN_FINAL_STABILIZE_TEXT'));
            execGameOver(t('MAIN_FINAL_STABILIZE_END'));
        } else {
            await typeWriter(box, t('MAIN_FINAL_MERGE_TEXT'));
            execGameOver(t('MAIN_FINAL_MERGE_END'));
            fs.writeFileSync('../ACHIEVEMENTS/NEW_GOD.ACH', 'COMPLETED')
        }
    });
}

async function ceoConfrontation() {
    if (!fs.existsSync('../ACHIEVEMENTS/CEO_CONFRONT.ACH')) {
        showAchievementToast(t('ACHIEVEMENT_CEO_CONFRONT_NAME'));
        fs.writeFileSync('../ACHIEVEMENTS/CEO_CONFRONT.ACH', 'COMPLETED');
    }

    stopAudio();
    playwarning();

    const bg1Overlay = blessed.box({
        parent: screen,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        index: 1000,
        style: { bg: 'black' }
    });

    const logoBox = blessed.text({
        parent: bg1Overlay,
        top: 2,
        left: 'center',
        content: LOGO_TEXT,
        style: {
            fg: COLOR_HEX
        },
        align: 'center'
    });

    const warningText = blessed.box({
        parent: bg1Overlay,
        top: 12,
        left: 'center',
        width: '50%', 
        height: 'shrink',
        padding: 1,  
        align: 'center',
        tags: true,
        border: 'line',
        content: t('MAIN_CEO_WARNING'),
        style: { 
            fg: 'white',
            border: { fg: 'red' } 
        }
    });
    
    const choiceMenu = blessed.list({
        parent: bg1Overlay,
        top: 25,
        left: 'center',
        width: '50%',
        height: 4,
        items: [
            t('MAIN_CEO_OVERRIDE'),
            t('MAIN_CEO_ACCEPT')
        ],
        keys: true,
        border: {
            type: 'line'
        },
        style: style, 
        align: 'center'
    });

    choiceMenu.focus();
    screen.render();

    choiceMenu.on('select', (item, idx) => {
        playBeep2();
        shouldShutdown = (idx === 1); 

        bg1Overlay.destroy();
        choiceMenu.destroy()
        warningText.destroy()
        logoBox.destroy()
        screen.render();

        const vbsPath = path.join(os.tmpdir(), 'ceo_chat.vbs');
        fs.writeFileSync(vbsPath, t('CEO_VBS_SCRIPT'), { encoding: 'latin1' });

        exec(`cscript //nologo ${vbsPath}`, () => {
            try { fs.unlinkSync(vbsPath); } catch (e) {}
            
            clearPuzzle();
            const finalTxtPath = path.join(os.homedir(), 'Desktop', 'FINAL_MESSAGE.txt');
            fs.writeFileSync(finalTxtPath, t('MAIN_FINAL_MESSAGE'));
            fs.writeFileSync('./TERMINALACCESS/FINAL.status', 'COMPLETED');

            if (!fs.existsSync('../ACHIEVEMENTS/THE_END.ACH')) {
                showAchievementToast(t('ACHIEVEMENT_THE_END_NAME'));
                fs.writeFileSync('../ACHIEVEMENTS/THE_END.ACH', 'COMPLETED');
            }

            generateLoreFiles();
            container.children.forEach(c => c.hide());
            credits();
        });
    });

    choiceMenu.on('select item', () => playBeep());
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
        t('MAIN_OFFICE_SCENE1'),
        t('MAIN_OFFICE_SCENE2'),
        t('MAIN_OFFICE_SCENE3'),
        t('MAIN_OFFICE_SCENE4'),
        t('MAIN_OFFICE_SCENE5')
    ];
    for (const scene of scenes) {
        playBeep2()
        await typeWriter(officeBox, scene);
        await new Promise(res => screen.once('keypress', (ch, key) => {
            if (key.name === 'enter') res();
        }));
    }
    officeBox.setContent(t('MAIN_OFFICE_FOCUS'));
    officeBox.parseTags = true;
    screen.render();
    await new Promise(res => setTimeout(res, 3000));
    playceo()
    const roomMenu = blessed.list({
        parent: container,
        bottom: 5,
        left: 'center',
        width: '40%',
        height: 6,
        label: t('MAIN_ROOM_ACTIONS'),
        items: [
            t('MAIN_SIT_CHAIR'),
            t('MAIN_SCREAM'),
            t('MAIN_LEAVE')
        ],
        keys: true,
        border: {
            type: 'line'
        },
        style: style
    });
    roomMenu.on('select', async (item, index) => {
        playBeep()
        if (index === 0) {
            playBeep2()
            roomMenu.hide();
            await typeWriter(officeBox, t('MAIN_SIT_SYSTEM'));
            const terminalAction = blessed.list({
                parent: container,
                bottom: 5,
                left: 'center',
                width: '40%',
                height: 6,
                items: [
                    t('MAIN_POWER_ON'),
                    t('MAIN_DESTROY')
                ],
                keys: true,
                border: {
                    type: 'line'
                },
                style: style
            });
            terminalAction.on('select', (it, idx) => {
                playBeep()
                if (idx === 1) execGameOver(t('MAIN_DESTROY_END'));
                else {
                    playBeep2()
                    const statusPath = './TERMINALACCESS/POWER_ACTIVE.status';
                    fs.writeFileSync(statusPath, '1');
                    saveCheckpoint("POWER_ACTIVE");
                    exec('start cmd /c "node energy.js"');
                    officeBox.setContent(t('MAIN_ELEVATOR_UNLOCK'));
                    terminalAction.hide();
                    screen.render();
                    const checkClosure = setInterval(async () => {
                        if (!fs.existsSync(statusPath)) {
                            clearInterval(checkClosure);
                            if (fs.existsSync('./TERMINALACCESS/ELEVATOR_OPEN.status')) {
                                stopAudio()
                                playwin()
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
                                    t('MAIN_ELEVATOR_SCENE1'),
                                    t('MAIN_ELEVATOR_SCENE2'),
                                    t('MAIN_ELEVATOR_SCENE3'),
                                    t('MAIN_ELEVATOR_SCENE4'),
                                    t('MAIN_ELEVATOR_SCENE5')
                                ];
                                for (const f of elevatorNarration) {
                                    playBeep2()
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
                                    label: t('MAIN_ELEVATOR_INTERFACE'),
                                    items: [
                                        t('MAIN_PLAY_PACPRO'),
                                        t('MAIN_LISTEN_RADIO')
                                    ],
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
                                    playBeep()
                                    elevatorMenu.hide();
                                    if (eIdx === 0) {
                                        playBeep2()
                                        elevatorScene.setContent(t('MAIN_ELEVATOR_MOTION'));
                                        screen.render();
                                        playceo()
                                        const pacmanProc = spawn('cmd.exe', ['/c', 'start', '/wait', 'node', 'pacpro.js'], {
                                            shell: false,
                                            detached: false
                                        });
                                        const achPath = path.join(__dirname, '..', 'ACHIEVEMENTS', 'PACPRO.ach');
                                        pacmanProc.on('exit', async () => {
                                            if (fs.existsSync(achPath)) {
                                                stopAudio()
                                                setTimeout(() => {
                                                    playsupport()
                                                },200)
                                                
                                                elevatorScene.setContent("");
                                                playBeep2()
                                                await typeWriter(elevatorScene, t('MAIN_ELITE_LOG'));
                                                await new Promise(res => screen.once('keypress', (ch, key) => {
                                                    if (key.name === 'enter') res();
                                                }));
                                                playBeep2()
                                                await typeWriter(elevatorScene, t('MAIN_ELITE_CONGRATS'));
                                                await new Promise(res => screen.once('keypress', (ch, key) => {
                                                    if (key.name === 'enter') res();
                                                }));
                                            }
                                            arrivalAtSublevel(elevatorScene);
                                        });
                                    } else {
                                        stopAudio()
                                        elevatorScene.setContent("");
                                        if (!fs.existsSync('../ACHIEVEMENTS/RADIO_LISTENER.ACH')) {
                                            showAchievementToast(t('ACHIEVEMENT_RADIO_LISTENER_NAME'))
                                            fs.writeFileSync('../ACHIEVEMENTS/RADIO_LISTENER.ACH', 'COMPLETED')
                                        }
                                        playBeep2()
                                        await typeWriter(elevatorScene, t('MAIN_RADIO_SIGNAL'));
                                        await new Promise(res => screen.once('keypress', (ch, key) => {
                                            if (key.name === 'enter') res();
                                        }));
                                        playBeep2()
                                        await typeWriter(elevatorScene, t('MAIN_RADIO_STATEMENT'));
                                        await new Promise(res => screen.once('keypress', (ch, key) => {
                                            if (key.name === 'enter') res();
                                        }));
                                        playBeep2()
                                        await typeWriter(elevatorScene, t('MAIN_RADIO_DENIAL'));
                                        await new Promise(res => screen.once('keypress', (ch, key) => {
                                            if (key.name === 'enter') res();
                                        }));
                                        const vbsPath = path.join(os.tmpdir(), 'warning.vbs');
                                        fs.writeFileSync(vbsPath, t('RADIO_WARNING_VBS'));
                                        exec(`cscript //nologo ${vbsPath}`, () => {
                                            try {
                                                fs.unlinkSync(vbsPath);
                                            } catch (e) {}
                                            arrivalAtSublevel(elevatorScene);
                                        });
                                    }
                                });
                            } else {
                                execGameOver(t('MAIN_ELEVATOR_FAIL'));
                            }
                        }
                    }, 1000);
                }
            });
            terminalAction.focus();
            screen.render();
        } else {
            stopAudio()
            execGameOver(t('MAIN_ROOM_FAIL'));
        }
    });
    roomMenu.focus();
    screen.render();
}
async function arrivalAtSublevel(box) {
    saveCheckpoint("SUBLEVEL_7");
    box.setContent("");
    playBeep2()
    await typeWriter(box, t('MAIN_SUBLEVEL_ARRIVAL1'));
    await new Promise(res => screen.once('keypress', (ch, key) => {
        if (key.name === 'enter') res();
    }));
    box.setContent("");
    playBeep2()
    await typeWriter(box, t('MAIN_SUBLEVEL_ARRIVAL2'));
    await new Promise(res => screen.once('keypress', (ch, key) => {
        if (key.name === 'enter') res();
    }));
    box.setContent("");
    playBeep2()
    await typeWriter(box, t('MAIN_SUBLEVEL_ARRIVAL3'));
    await new Promise(res => screen.once('keypress', (ch, key) => {
        if (key.name === 'enter') res();
    }));
    const achPath = path.join(__dirname, '..', 'ACHIEVEMENTS', 'PACPRO.ach');
    const hasAch = fs.existsSync(achPath);
    sublevelExploration()
}
async function passwordWorkPhase() {
    playceo()
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
        content: t('MAIN_CORPORATE_ACCESS')
    });
    screen.render();
    const monitor = setInterval(() => {
        const files = fs.readdirSync(desktopPath).filter(f => f !== 'READ-ME.txt');
        if (files.length > 0) {
            clearInterval(monitor);
            const content = fs.readFileSync(path.join(desktopPath, files[0]), 'utf8').trim();
            if (content === passwordValue) {
                stopAudio()
                setTimeout(() => {
                    playwin()
                },200)
                loginBox.setContent(t('MAIN_ACCESS_GRANTED'));
                setTimeout(() => {
                    clearPuzzle();
                    officeChaosPhase();
                }, 2000);
            } else if (content === "LUX4LIFE") {
                stopAudio()
                setTimeout(() => {
                    playsupport()
                },200)
                if (!fs.existsSync('../ACHIEVEMENTS/REBEL_PATH.ACH')) {
                    showAchievementToast(t('ACHIEVEMENT_REBEL_PATH_NAME'))
                    fs.writeFileSync('../ACHIEVEMENTS/REBEL_PATH.ACH', 'COMPLETED')
                }
                fs.writeFileSync('./TERMINALACCESS/SECRET_ROUTE.status', '1');
                loginBox.setContent(t('MAIN_ADMIN_OVERRIDE'));
                setTimeout(() => {
                    clearPuzzle();
                    officeChaosPhase();
                }, 2000);
            } else {
                stopAudio()
                execGameOver(t('MAIN_CREDENTIAL_FAIL'));
            }
        }
    }, 1000);
}

function finalChoicePhase() {
    playceo()
    container.children.forEach(c => {
        if (c !== statusBox) c.hide();
    });
    const finalMenu = blessed.list({
        parent: container,
        top: 'center',
        left: 'center',
        width: '60%',
        height: 10,
        label: t('MAIN_ARRIVAL_WORK'),
        items: [
            t('MAIN_ENTER_WORK'),
            t('MAIN_LEAVE_WORK'),
            t('MAIN_RANDOM')
        ],
        keys: true,
        border: {
            type: 'line'
        },
        style: style,
        align: 'center'
    });
    finalMenu.on('select', (item, index) => {
        playBeep()
    })

    finalMenu.on('select', (item, index) => {
        playBeep()
        if (index === 0) {
            playBeep2()
            stopAudio()
            setTimeout(() => {
                passwordWorkPhase();
            },200)
            
        } else if (index === 1) {
            stopAudio()
            execGameOver(t('MAIN_LEAVE_END'));
        } else {
            const failChance = Math.random() < 0.15;
            if (failChance) {
                playBeep2()
                stopAudio()
                setTimeout(() => {
                    passwordWorkPhase();
                },200)
            } else {
                stopAudio()
                execGameOver(t('MAIN_RANDOM_END'));
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
        t('MAIN_REPORT_DRIVE'),
        t('MAIN_OBSERVATION'),
        t('MAIN_WORLD'),
        t('MAIN_CHAOS'),
        t('MAIN_NARRATOR_PARK'),
        t('MAIN_EXIT_CAR')
    ];
    for (const text of logs) {
        playBeep2()
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
    playceo()
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
        content: t('MAIN_TIME', { time: timeRemaining }),
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
        label: t('MAIN_QUICK_PREP'),
        items: [
            t('MAIN_TASK_SHOWER'),
            t('MAIN_TASK_UNIFORM'),
            t('MAIN_TASK_KEYS'),
            t('MAIN_TASK_BREAKFAST'),
            t('MAIN_TASK_LOCKS'),
            t('MAIN_TASK_LEAVE')
        ],
        keys: true,
        border: {
            type: 'line'
        },
        style: style,
        align: 'center'
    });
    const timerInterval = setInterval(() => {
        timeRemaining--;
        timerBox.setContent(t('MAIN_TIME', { time: timeRemaining }));
        if (timeRemaining <= 3) {
            timerBox.style.fg = 'red';
            timerBox.style.border.fg = 'red';
        }
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            stopAudio()
            execGameOver(t('MAIN_GAME_OVER_LATE'));
        }
        screen.render();
    }, 1000);
    actionsMenu.on('select', (item, index) => {
        if (index === 5) {
            if (completedTasks.size >= 5) {
                const achPath = path.join(__dirname, '..', 'Achievements', 'NEVERMISS.ach');
                clearInterval(timerInterval);
                if (timeRemaining > 7) {
                    if (!fs.existsSync(achPath)) {
                        showAchievementToast(t('ACHIEVEMENT_NEVER_BE_LATE_NAME'))
                        fs.writeFileSync(achPath, 'COMPLETED');
                    }
                }
                if (timeRemaining <= 7 || fs.existsSync(achPath) === true) {
                    stopAudio()
                    setTimeout(() => {
                        playwin()
                    },200)
                }
                
                thePathPhase();
            } else {
                statusBox.setContent(t('MAIN_ERR_NOT_READY'));
                screen.render();
            }
            return;
        }
        if (!completedTasks.has(index)) {
            playBeep2()
            const originalText = item.getText();
            item.setContent(`${originalText} [OK]`);
            item.style.fg = 'green';
            completedTasks.add(index);
            statusBox.setContent(t('MAIN_COMPLETED', { task: originalText.trim() }));
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
        t('MAIN_NARRATIVE1'),
        t('MAIN_NARRATIVE2'),
        t('MAIN_NARRATIVE3'),
        t('MAIN_NARRATIVE4'),
        t('MAIN_NARRATIVE5'),
        t('MAIN_NARRATIVE_ENTER')
    ];
    for (const text of texts) {
        playBeep2()
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
    loading.load(t('MAIN_SURVEY_WAITING'));
    playcheckpoint()
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
                    execGameOver(t('MAIN_INTRUSION_ATTEMPT'));
                } else if (fadeExists) {
                    play1999()
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
                        content: t('MAIN_FADE_SYNCED'),
                        tags: true
                    });
                    screen.render();
                    screen.once('keypress', (ch, key) => {
                        if (key.name === 'enter') {
                            fadeBox.destroy();
                            try {
                                fs.unlinkSync('./TERMINALACCESS/MEMORY_1999.bin');
                            } catch (e) {}
                            exec('start cmd /c "node survey.js"');
                            resolve(monitorSurvey());
                        }
                    });
                } else {
                    const status = fs.readFileSync('./TERMINALACCESS/ACESSOSTATUS.LIGHT', 'utf8').trim();
                    if (status === '1') {
                        resolve(true);
                    } else {
                        execGameOver(t('MAIN_AUTH_FAILED'));
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

    let menuItems = [t('MAIN_MENU_START')];
    if (hasCheckpoint) {
        menuItems.push(t('MAIN_MENU_CONTINUE'));
    }
    menuItems.push(t('MAIN_MENU_EXIT'));

    const menu = blessed.list({
        parent: container,
        top: 15,
        left: 'center',
        width: '40%',
        height: hasCheckpoint ? 8 : 6,
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

        function closeft() {
            playback();
            setTimeout(() => {
                process.exit();
            },200)
        }
        if (text.includes(t('MAIN_MENU_EXIT'))) closeft();

        if (text.includes(t('MAIN_MENU_CONTINUE'))) {
            playBeep2();
            menu.hide();
            logoBox.hide();
            stage = checkpointData.last_stage
            loadStage(checkpointData.last_stage);
            return;
        }

        if (text.includes(t('MAIN_MENU_START'))) {
            clearPuzzle();
            if (fs.existsSync('./TERMINALACCESS/SECRET_ROUTE.status')) {
                fs.unlinkSync('./TERMINALACCESS/SECRET_ROUTE.status');
            }
            
            playBeep2();
            if (fs.existsSync(checkPath)) fs.unlinkSync(checkPath);
            
            menu.hide();
            logoBox.hide();

            const loading = blessed.loading({
                parent: container,
                top: 'center',
                left: 'center',
                width: 'shrink',
                height: 'shrink',
                border: { type: 'line' },
                style: style
            });
            loading.load(t('MAIN_SURVEY_WAITING'));
            screen.render();

            const surveyCmd = exec('start /wait cmd /c "node survey.js"');

            surveyCmd.on('exit', () => {
                setTimeout(async () => {
                    loading.stop();
                    const success = fs.existsSync('./TERMINALACCESS/ACESSOSTATUS.LIGHT');
                    const memory = fs.existsSync('./TERMINALACCESS/MEMORY_1999.bin');
                    const failure = fs.existsSync('./TERMINALACCESS/GAMEOVER.status');

                    if (memory) {
                        play1999();
                        container.children.forEach(c => c.hide());
                        const fadeBox = blessed.box({
                            parent: container,
                            top: 'center',
                            left: 'center',
                            width: '80%',
                            height: '40%',
                            border: { type: 'line', fg: 'yellow' },
                            style: { fg: 'yellow' },
                            padding: 1,
                            tags: true,
                            content: t('MAIN_FADE_SYNCED')
                        });
                        screen.render();
                        screen.once('keypress', (ch, key) => {
                            if (key.name === 'enter') {
                                fadeBox.destroy();
                                try { fs.unlinkSync('./TERMINALACCESS/MEMORY_1999.bin'); } catch (e) {}
                                startMainMenu();
                            }
                        });
                    } else if (success) {
                        stopAudio();
                        setTimeout(() => {
                            playwin();
                        }, 200);
                        saveCheckpoint("START_NARRATIVE");
                        startNarrative();
                    } else if (failure) {
                        execGameOver(t('MAIN_INTRUSION_ATTEMPT'));
                    } else {
                        execGameOver(t('MAIN_CONNECTION_LOST'));
                    }
                }, 500);
            });
        }
    });

    menu.on('select item', () => {
        playBeep(); 
    });

    menu.focus();
    screen.render();
}

screen.key(['escape', 'C-c'], () => {
    if (iscreditsOpen) {} else {
        clearPuzzle();
        process.exit(0);
    }
});

const isGameFinished = fs.existsSync('./TERMINALACCESS/FINAL.status');
if (isGameFinished) {
    const bgWinOverlay = blessed.box({
        parent: screen,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        index: 1000,
        style: { bg: 'black' }
    });

    const logoWin = blessed.text({
        parent: bgWinOverlay,
        top: 2,
        left: 'center',
        content: LOGO_TEXT,
        style: { fg: COLOR_HEX },
        align: 'center'
    });

    const winBox = blessed.box({
        parent: bgWinOverlay,
        top: 12,
        left: 'center',
        width: 60,
        height: 10,
        border: {
            type: 'line',
            fg: 'yellow'
        },
        label: t('MAIN_CONGRATS_TITLE'),
        content: t('MAIN_CONGRATS'),
        tags: true,
        style: { bg: 'black' }
    });

    const winMenu = blessed.list({
        parent: winBox,
        top: 4, 
        left: 'center',
        width: '80%',
        height: 4,
        items: [
            t('MAIN_DELETE_SAVE'),
            t('MAIN_CLOSE_TERMINAL')
        ],
        keys: true,
        align: 'center',
        style: style 
    });

    winMenu.on('select', (it, idx) => {
        playBeep();
        if (idx === 0) {
            playBeep2();
            if (fs.existsSync('./TERMINALACCESS/FINAL.status')) fs.unlinkSync('./TERMINALACCESS/FINAL.status');
            if (fs.existsSync('./TERMINALACCESS/SECRET_ROUTE.status')) fs.unlinkSync('./TERMINALACCESS/SECRET_ROUTE.status');
            if (fs.existsSync('../CONFIG/CHECKPOINT.json')) fs.unlinkSync('../CONFIG/CHECKPOINT.json');
            process.exit(0);
        } else {
            playBeep2();
            process.exit(0);
        }
    });

    winMenu.focus();
    screen.render();
} else {
    watchAchievements();
    startMainMenu()
}

process.on('exit', () => {
    saveFinalTime();
});

screen.key(['escape', 'q', 'Q', 'C-c'], () => {
    if (iscreditsOpen) {
        releaseLock();
        saveFinalTime();
    } else {
        releaseLock();
        saveFinalTime();
        clearPuzzle();
        process.exit(0);
    }
});

process.on('SIGINT', () => {
    releaseLock();
    saveFinalTime();
});
process.on('SIGHUP', () => {
    releaseLock();
    saveFinalTime();
});