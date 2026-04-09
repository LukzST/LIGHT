const blessed = require('blessed');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { t } = require('./translate.js');

const player_audio = require('play-sound')({
    player: '../AUDIO/PLAYER/cmdmp3.exe'
});
const achDir = path.join(__dirname, '..', 'ACHIEVEMENTS');
const achFile = path.join(achDir, 'PACPRO.ach');
const beepfile = '../AUDIO/EFFECTS/BEEP.wav';      
const beepfile2 = '../AUDIO/EFFECTS/BEEP2.wav';    
const winfile = '../AUDIO/EFFECTS/win.wav';        
const BOOTfile = '../AUDIO/EFFECTS/LUX-4.wav';     
const sucessofile = '../AUDIO/EFFECTS/win2.wav';   
const CEOfile = '../AUDIO/TRACKS/CEO.mp3';         
const GOfile = '../AUDIO/EFFECTS/GAMEOVER.MP3';

if (fs.existsSync(achFile)) {
    try {
        fs.unlinkSync(achFile);
    } catch (e) {}
}


function execGameOver(reason) {
    gameActive = false;
    stopAudio();
    setTimeout(() => {
        playGameOverSound();
        mainBox.hide();
        const goBox = blessed.box({
            parent: screen,
            top: 'center', left: 'center', width: 'shrink', height: 'shrink',
            padding: 2,
            content: t('PACPRO_GO_SCREEN', { reason }),
            tags: true,
            border: { type: 'line', fg: 'red' },
            style: { bold: true, bg: 'black' }
        });
        screen.render();
        setTimeout(() => process.exit(0), 5000);
    }, 200);
}

function stopAudio() { 
    exec('taskkill /F /IM cmdmp3.exe /T > nul 2>&1'); 
}
function playBeep() { player_audio.play(beepfile); }
function playBeep2() { player_audio.play(beepfile2); }
function playWin() { player_audio.play(winfile); }
function playBoot() { player_audio.play(BOOTfile); }
function playSucessoFinal() { player_audio.play(sucessofile); }
function playGameOverSound() { player_audio.play(GOfile); }

const screen = blessed.screen({ smartCSR: true, title: 'PACPRO_ULTRA_SUBSYSTEM' });

const LEVELS = [
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,1],
        [1,2,1,1,1,2,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,1,2,1],
        [1,2,1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,1,2,1],
        [1,2,1,2,1,1,1,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1],
        [1,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,1,2,1,2,2,2,2,2,1,2,2,2,1,2,2,2,2,2,2,2,1],
        [1,2,1,2,1,2,1,1,1,2,1,1,1,1,1,2,1,2,1,2,1,1,1,2,1,2,1,2,1,2,1,1,1,1,1,2,1],
        [1,2,1,2,2,2,1,2,2,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,1,2,2,2,2,2,1],
        [1,2,1,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,1,1,2,1],
        [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1],
        [1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1],
        [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
        [1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1],
        [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
        [1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1],
        [1,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,2,2,2,2,2,2,1,2,2,2,2,2,2,2,1,2,2,2,2,2,1,2,2,2,2,2,2,2,1,2,2,2,2,2,2,1],
        [1,2,1,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,1,2,1],
        [1,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1],
        [1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1],
        [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ]
];

let currentLevelIdx = 0;
let currentMap = [];
let dotsRemaining = 0;
let player = { x: 18, y: 5 };
let ghosts = [];
let score = 0;
let gameActive = false;
let gameInterval;

const mainBox = blessed.box({ parent: screen, width: '100%', height: '100%', style: { bg: 'black' }, tags: true });
const gameWindow = blessed.box({ parent: mainBox, top: 1, left: 'center', width: 76, height: 13, border: { type: 'line', fg: 'yellow' }, label: ' {bold}' + t('PACPRO_TITLE') + '{/bold} ', tags: true, hidden: true });
const sideHUD = blessed.box({ parent: mainBox, bottom: 0, left: 'center', width: 76, height: 3, border: { type: 'line', fg: 'white' }, tags: true, hidden: true });

function initLevel(idx) {
    currentMap = JSON.parse(JSON.stringify(LEVELS[idx]));
    dotsRemaining = 0;
    for (let row of currentMap) {
        for (let cell of row) { if (cell === 2) dotsRemaining++; }
    }
    player = { x: 18, y: 5 };
    ghosts = [{ x: 1, y: 1, color: 'red', type: 'chaser' }, { x: 35, y: 1, color: 'magenta', type: 'ambush' }];
    gameActive = true;
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => { moveGhosts(); render(); }, 350);
    render();
}

function showGameOver() {
    gameActive = false;
    clearInterval(gameInterval);
    const goMenu = blessed.list({
        parent: mainBox, top: 'center', left: 'center', width: 35, height: 8,
        label: t('PACPRO_GAME_OVER'),
        items: [t('PACPRO_TRY_AGAIN'), t('PACPRO_EXIT')],
        keys: true, border: { type: 'line', fg: 'red' }, tags: true, style: { selected: { bg: 'red', fg: 'white' } }
    });
    goMenu.on('select', (it, idx) => {
        goMenu.destroy();
        if (idx === 0) { currentLevelIdx = 0; score = 0; initLevel(0); } 
        else process.exit(0);
    });
    goMenu.focus();
    screen.render();
}

function moveGhosts() {
    if (!gameActive) return;
    ghosts.forEach(g => {
        let tx = player.x, ty = player.y;
        if (g.type === 'ambush') { tx = player.x > g.x ? player.x + 2 : player.x - 2; }
        let dx = tx - g.x, dy = ty - g.y;
        let possibleMoves = [];
        if (dx !== 0) possibleMoves.push({x: g.x + (dx > 0 ? 1 : -1), y: g.y});
        if (dy !== 0) possibleMoves.push({x: g.x, y: g.y + (dy > 0 ? 1 : -1)});
        for (let move of possibleMoves) {
            if (currentMap[move.y] && currentMap[move.y][move.x] !== 1) {
                g.x = move.x; g.y = move.y;
                break;
            }
        }
        if (g.x === player.x && g.y === player.y) execGameOver(t('PACPRO_GHOST_CAUGHT'));
    });
}

function render() {
    if (!gameActive) return;
    let out = "";
    for (let y = 0; y < currentMap.length; y++) {
        for (let x = 0; x < currentMap[y].length; x++) {
            let ghost = ghosts.find(g => g.x === x && g.y === y);
            if (x === player.x && y === player.y) out += "{yellow-fg}C{/yellow-fg} ";
            else if (ghost) out += `{${ghost.color}-fg}G{/${ghost.color}-fg} `;
            else {
                const t = currentMap[y][x];
                if (t === 1) out += "{blue-fg}█{/blue-fg} ";
                else if (t === 2) out += "{white-fg}·{/white-fg} ";
                else out += "  ";
            }
        }
        out += "\n";
    }
    gameWindow.setContent(out);
    sideHUD.setContent(t('PACPRO_HUD', { level: currentLevelIdx + 1, score: score, dots: dotsRemaining }));
    screen.render();
}

const menu = blessed.list({
    parent: mainBox, top: 'center', left: 'center', width: 35, height: 7,
    label: t('PACPRO_MENU_TITLE'), 
    items: [t('PACPRO_INIT'), t('PACPRO_EXIT')],
    keys: true, border: { type: 'line', fg: 'yellow' }, tags: true, style: { selected: { bg: 'yellow', fg: 'black' } }
});

menu.on('select', (it, idx) => {
    if (idx === 1) {
        process.exit(0)
    }
    menu.hide(); gameWindow.show(); sideHUD.show();
    initLevel(0);
});

function checkWin() {
    if (dotsRemaining <= 0) {
        currentLevelIdx++;
        if (currentLevelIdx < LEVELS.length) {
            initLevel(currentLevelIdx);
        } else {
            gameActive = false;
            clearInterval(gameInterval);
            if (!fs.existsSync(achDir)) fs.mkdirSync(achDir, { recursive: true });
            fs.writeFileSync(achFile, `USER: OPERATOR\nSTATUS: PACPRO_ELITE\nDATE: ${new Date().toLocaleString()}`);
            gameWindow.setContent(t('PACPRO_WIN_SCREEN'));
            
            screen.render();
            setTimeout(() => process.exit(0), 4000);
        }
        return true;
    }
    return false;
}

menu.on('keypress', (ch, key) => {
    if (key.name === 'up' || key.name === 'down') {
        playBeep();
    }
});

screen.on('keypress', (ch, key) => {
    if (key.name === 'f') {stopAudio();process.exit(0);}
    if (ch === '4' && gameActive) {
        dotsRemaining = 0;
        checkWin();
        return;
    }

    if (!gameActive) return;
    let nx = player.x, ny = player.y;
    if (key.name === 'up') ny--;
    if (key.name === 'down') ny++;
    if (key.name === 'left') nx--;
    if (key.name === 'right') nx++;

    if (currentMap[ny] && currentMap[ny][nx] !== 1) {
        player.x = nx;
        player.y = ny;
        if (currentMap[ny][nx] === 2) {
            currentMap[ny][nx] = 0;
            dotsRemaining--;
            score += 10;
            checkWin();
        }
        render();
    }
});

menu.focus();
screen.render();
