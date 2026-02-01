const blessed = require('blessed');
const fs = require('fs');
const path = require('path');

// --- AUTO-CLEANUP ON STARTUP ---
// Delete remnants of previous matches before starting the screen
const achDir = path.join(__dirname, '..', 'ACHIEVEMENTS');
const achFile = path.join(achDir, 'PACPRO.ach');

if (fs.existsSync(achFile)) {
    try {
        fs.unlinkSync(achFile);
    } catch (e) {
        // Silently fail if file is locked
    }
}

const screen = blessed.screen({ smartCSR: true, title: 'PACPRO_ULTRA_SUBSYSTEM' });

const LEVELS = [
    [ // Level 1
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
    [ // Level 2
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
    [ // Level 3
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
const gameWindow = blessed.box({ parent: mainBox, top: 1, left: 'center', width: 76, height: 13, border: { type: 'line', fg: 'yellow' }, label: ' {bold}PACPRO: TERMINAL_SESSION{/bold} ', tags: true, hidden: true });
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
        label: ' {red-fg}{bold} SYSTEM FAILURE {/bold}{/red-fg} ',
        items: [' > RETRY SESSION ', ' > TERMINATE '],
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
        if (g.x === player.x && g.y === player.y) showGameOver();
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
    sideHUD.setContent(`{center}LVL: ${currentLevelIdx + 1}/3 | SCORE: ${score} | FRAGMENTS: ${dotsRemaining}{/center}`);
    screen.render();
}

const menu = blessed.list({
    parent: mainBox, top: 'center', left: 'center', width: 35, height: 7,
    label: ' {yellow-fg}PACPRO_OS{/yellow-fg} ', items: [' > INITIALIZE_SIMULATION ', ' > EXIT '],
    keys: true, border: { type: 'line', fg: 'yellow' }, tags: true, style: { selected: { bg: 'yellow', fg: 'black' } }
});

menu.on('select', (it, idx) => {
    if (idx === 1) process.exit(0);
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
            gameWindow.setContent("{center}\n\n{yellow-fg}{bold}CONGRATULATIONS!{/bold}{/yellow-fg}\nCORE DATA OVERWRITTEN\nLOG: PACPRO.ach{/center}");
            screen.render();
            setTimeout(() => process.exit(0), 4000);
        }
        return true;
    }
    return false;
}

screen.on('keypress', (ch, key) => {
    if (key.name === 'f') process.exit(0);
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