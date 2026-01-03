const blessed = require('blessed');
const fs = require('fs');

const screen = blessed.screen({
    smartCSR: true,
    title: 'LUX-4_CORE_STABILIZER_V3_FINAL_SYNC',
    style: { bg: 'black' }
});

// --- ESTADO DO SISTEMA ---
let energyLevel = 50;   
let targetPos = 50;     
let timeLeft = 30;      
let gameActive = true;
let warningCounter = 0; 
const safeRange = 12;   

// --- WIDGETS ---
const mainBox = blessed.box({
    parent: screen,
    top: 'center', left: 'center', width: '95%', height: '90%',
    border: { type: 'line', fg: '#00ff00' },
    label: ' {bold}[ PROJECT FADE: CORE STABILIZATION ]{/bold} ',
    tags: true, style: { fg: '#00ff00' }
});

const track = blessed.box({
    parent: mainBox, top: 5, left: 'center', width: '90%', height: 3,
    style: { bg: '#111' }, tags: true, border: { type: 'line', fg: '#333' }
});

// Alvo Móvel (Amarelo)
const targetBar = blessed.box({
    parent: track, top: 0, left: '50%', width: `${safeRange * 2}%`, height: '100%',
    style: { bg: 'yellow' }, tags: true
});

// Indicador do Jogador (Verde)
const playerIndicator = blessed.box({
    parent: track, top: 0, left: '50%', width: 3, height: '100%',
    style: { bg: 'green' }, tags: true
});

const statusText = blessed.text({
    parent: mainBox, top: 10, left: 'center',
    content: '{green-fg}SYSTEM READY. MAINTAIN SYNC FOR 30s.{/green-fg}',
    tags: true, align: 'center'
});

const timerText = blessed.text({
    parent: mainBox, top: 2, right: 2,
    content: `{yellow-fg}STABILIZATION: ${timeLeft}s{/yellow-fg}`,
    tags: true, bold: true
});

const infoBox = blessed.box({
    parent: mainBox, bottom: 1, left: 'center', width: '90%', height: 3,
    content: '{center}[A] MOVE LEFT | [D] MOVE RIGHT | BALANCE THE CORE{/center}',
    tags: true, border: { type: 'line', fg: 'green' },
    style: { fg: 'green' }
});

// --- LÓGICA ---

function updateSystem() {
    if (!gameActive) return;

    // 1. Movimentação do Alvo - VELOCIDADE MÉDIA (Divisor 1000)
    targetPos += Math.sin(Date.now() / 1000) * 1.1; 
    if (targetPos < 15) targetPos = 15;
    if (targetPos > 85) targetPos = 85;
    targetBar.left = `${targetPos - safeRange}%`;

    // 2. Oscilação do Jogador (Leve instabilidade)
    energyLevel += (Math.random() - 0.5) * 2.0; 
    if (energyLevel < 2) energyLevel = 2;
    if (energyLevel > 98) energyLevel = 98;
    playerIndicator.left = `${energyLevel}%`;

    // 3. Verificação de Sincronia
    const diff = Math.abs(energyLevel - targetPos);
    if (diff > safeRange) {
        warningCounter += 1.5; 
        playerIndicator.style.bg = 'red';
        statusText.setContent(`{red-fg}{bold}!! SYNC LOST: ${Math.max(0, 100 - Math.floor(warningCounter))}% TO COLLAPSE !!{/bold}{/red-fg}`);
    } else {
        if (warningCounter > 0) warningCounter -= 3.0; 
        playerIndicator.style.bg = 'green';
        statusText.setContent('{green-fg}STABLE - CORE INTEGRITY OPTIMAL{/green-fg}');
    }

    if (warningCounter >= 100) finish(false);
    if (timeLeft <= 0) finish(true);

    screen.render();
}

function finish(success) {
    gameActive = false;
    if (success) {
        fs.writeFileSync('./BALANCER_SUCCESS.status', '1');
        statusText.setContent('{yellow-bg}{black-fg} SUCCESS: CORE STABILIZED. {/black-fg}{/yellow-bg}');
    } else {
        statusText.setContent('{red-bg}{white-fg} FATAL ERROR: CORE EXPLODED {/white-fg}{/red-bg}');
    }
    screen.render();
    setTimeout(() => process.exit(0), 2000);
}

const gameTimer = setInterval(() => {
    if (gameActive) {
        timeLeft--;
        timerText.setContent(`{yellow-fg}STABILIZATION: ${timeLeft}s{/yellow-fg}`);
    } else {
        clearInterval(gameTimer);
    }
}, 1000);

screen.key(['a', 'left'], () => { if (gameActive) energyLevel -= 6; });
screen.key(['d', 'right'], () => { if (gameActive) energyLevel += 6; });
screen.key(['escape', 'C-c'], () => process.exit(0));

setInterval(updateSystem, 20);
screen.render();