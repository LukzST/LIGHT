const blessed = require('blessed');
const fs = require('fs');
const { exec } = require('child_process');

// --- CONFIGURAÇÃO DE ÁUDIO (APENAS EFEITOS) ---
const beepfile = '../AUDIO/EFFECTS/BEEP.wav';      // Movimento (A/D)
const beepfile2 = '../AUDIO/EFFECTS/BEEP2.wav';    // Digitou no Hack / Acerto
const winfile = '../AUDIO/EFFECTS/win.wav';        // Estabilizou (Bar Sync)
const BOOTfile = '../AUDIO/EFFECTS/LUX-4.wav';     // Início
const sucessofile = '../AUDIO/EFFECTS/win2.wav';   // Vitória Final
const GOfile = '../AUDIO/EFFECTS/GAMEOVER.MP3';    // Erro / Game Over

const player = require('play-sound')({
    player: '../AUDIO/PLAYER/cmdmp3.exe'
});

const screen = blessed.screen({
    smartCSR: true,
    title: 'LUX-4_CORE_STABILIZER_V12_DYNAMIC',
    style: { bg: 'black' }
});

// --- SYSTEM STATE ---
let timeLeft = 30;
let modeTimer = 5;
let gameActive = false; 
let integrity = 100;
let currentPhase = 0; 
let barPos = 50;
let barTarget = 50;
let pulseVal = 0;
let pulseTargetPos = 75;
let hackChar = '';

// --- UI COMPONENTS ---
const mainBox = blessed.box({
    parent: screen,
    top: 'center', left: 'center', width: '95%', height: '90%',
    border: { type: 'line', fg: '#00ff00' },
    label: ' {bold}[ PROJECT FADE: CORE STABILIZATION ]{/bold} ',
    tags: true, style: { fg: '#00ff00' },
    hidden: true 
});

const timerText = blessed.text({
    parent: mainBox, top: 1, right: 2, content: '', tags: true, bold: true
});

const integrityBar = blessed.progressbar({
    parent: mainBox,
    top: 1,
    left: 2,
    width: '40%',
    height: 1,
    content: ' CORE INTEGRITY ', // Texto centralizado ou com espaços
    tags: true,
    barBg: 'green',
    bg: '#222',
    filled: 100,
    style: {
        // Esta é a chave: define o estilo do texto que sobrepõe a barra
        text: {
            fg: 'black',
        }
    }
});

const infoBox = blessed.box({
    parent: mainBox, bottom: 1, left: 'center', width: '90%', height: 3,
    content: '', tags: true, border: { type: 'line', fg: 'green' },
    style: { fg: 'green' }
});

const track = blessed.box({
    parent: mainBox, top: 'center', left: 'center', width: '80%', height: 3,
    style: { bg: '#111' }, border: { type: 'line', fg: '#333' }, hidden: true
});
const targetBar = blessed.box({ parent: track, top: 0, left: '50%', width: '20%', height: '100%', style: { bg: 'yellow' } });
const playerIndicator = blessed.box({ parent: track, top: 0, left: '50%', width: 2, height: '100%', style: { bg: 'green' } });

const pulseTrack = blessed.box({
    parent: mainBox, top: 'center', left: 'center', width: '80%', height: 7,
    border: { type: 'line', fg: 'cyan' }, hidden: true, label: ' SYNC PULSE '
});
const pulseBg = blessed.box({ parent: pulseTrack, top: 2, left: 'center', width: '90%', height: 1, style: { bg: '#222' } });
const pulseTargetZone = blessed.box({ parent: pulseBg, top: 0, left: '75%', width: '15%', height: 1, style: { bg: 'white' }, tags: true, content: '{black-fg} HIT {/black-fg}', align: 'center' });
const pulseCursor = blessed.box({ parent: pulseBg, top: 0, left: 0, width: 2, height: 1, style: { bg: 'cyan' } });

const hackDisplay = blessed.box({
    parent: mainBox, top: 'center', left: 'center', width: '40%', height: 5,
    border: { type: 'line', fg: 'magenta' }, hidden: true, align: 'center', valign: 'middle', tags: true
});

// --- FUNÇÕES DE ÁUDIO ---
function stopAudio() { exec('taskkill /F /IM cmdmp3.exe /T > nul 2>&1'); }
function playBeep() { player.play(beepfile); }
function playBeep2() { player.play(beepfile2); }
function playWin() { player.play(winfile); }
function playBoot() { player.play(BOOTfile); }
function playSucessoFinal() { player.play(sucessofile); }
function playGameOverSound() { player.play(GOfile); }

// --- LOGIC ---
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
            content: `{center}{red-fg}{bold}GAME OVER{/bold}{/red-fg}\n\n${reason}{/center}`,
            tags: true,
            border: { type: 'line', fg: 'red' },
            style: { bold: true, bg: 'black' }
        });
        screen.render();
        setTimeout(() => process.exit(0), 5000);
    }, 200);
}

function showBootSequence() {
    playBoot();
    const bootContainer = blessed.box({
        parent: screen, top: 'center', left: 'center', width: '100%', height: '100%', style: { bg: 'black' }
    });
    const msgBox = blessed.box({
        parent: bootContainer, top: 'center', left: 'center', width: 65, height: 10,
        border: 'line', tags: true,
        content: '{center}\n{yellow-fg}{bold}SYSTEM INTERACTION WARNING{/}\n\n' +
                 'This software is designed to modify local files.\n' +
                 'A success file will be generated upon stabilization.\n\n' +
                 '{blink}PRESS [ENTER] TO ACKNOWLEDGE{/}{/center}',
        style: { border: { fg: 'yellow' } }
    }); 

    screen.render();
    screen.onceKey(['enter'], () => {
        playBeep2();
        bootContainer.destroy();
        startGame();
    });
}

function startGame() {
    mainBox.show();
    gameActive = true;
    switchPhase();
    setInterval(update, 30);
    setInterval(tick, 1000);
}

function switchPhase() {
    currentPhase = (currentPhase + 1) % 3;
    modeTimer = 5;
    track.hide(); pulseTrack.hide(); hackDisplay.hide();
    mainBox.style.border.fg = '#00ff00';
    
    if (currentPhase === 0) { 
        track.show(); 
        infoBox.setContent('{center}MODE: BAR SYNC | [A/D] TO RECHARGE{/center}'); 
    }
    else if (currentPhase === 1) { 
        pulseTrack.show(); 
        pulseVal = 0; 
        randomizePulseTarget();
        infoBox.setContent('{center}MODE: ENTER PULSE | [ENTER] ON THE HIT ZONE{/center}'); 
    }
    else if (currentPhase === 2) { 
        hackDisplay.show(); 
        generateHack(); 
        infoBox.setContent('{center}MODE: KEY HACK | TYPE THE KEY{/center}'); 
    }
}

function randomizePulseTarget() {
    pulseTargetPos = 20 + Math.floor(Math.random() * 60);
    pulseTargetZone.left = `${pulseTargetPos}%`;
}

function generateHack() {
    hackChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    hackDisplay.setContent(`{magenta-fg}{bold}SECURITY KEY: ${hackChar}{/bold}{/magenta-fg}`);
}

function update() {
    if (!gameActive) return;

    if (currentPhase === 0) {
        barTarget = 50 + Math.sin(Date.now() / 600) * 35;
        targetBar.left = `${barTarget - 10}%`;
        playerIndicator.left = `${barPos}%`;
        if (Math.abs(barPos - barTarget) < 12) { 
            integrity = Math.min(100, integrity + 0.4); 
            playerIndicator.style.bg = 'green';
        } else { 
            integrity -= 0.8; 
            playerIndicator.style.bg = 'red'; 
        }
    } 
    else if (currentPhase === 1) {
        pulseVal += 1.8;
        if (pulseVal > 98) { 
            pulseVal = 0; 
            integrity -= 10; 
            playGameOverSound();
            randomizePulseTarget();
        }
        pulseCursor.left = `${pulseVal}%`;
    }
    else if (currentPhase === 2) {
        integrity -= 0.3;
    }

    integrityBar.setProgress(integrity);
    if (integrity <= 0) execGameOver("CORE INTEGRITY DEPLETED");
    screen.render();
}

function tick() {
    if (!gameActive) return;
    timeLeft--; modeTimer--;
    timerText.setContent(`{yellow-fg}STABILIZATION: ${timeLeft}s | SHIFT IN: ${modeTimer}s{/yellow-fg}`);
    if (modeTimer <= 0) switchPhase();
    if (timeLeft <= 0) finish(true);
}

function finish(success) {
    gameActive = false;
    stopAudio();
    if (success) {
        setTimeout(() => playWin(), 200);
        fs.writeFileSync('./BALANCER_SUCCESS.status', '1');
        const endBox = blessed.box({
            parent: screen, top: 'center', left: 'center', width: 60, height: 10,
            border: 'line', tags: true, align: 'center', valign: 'middle',
            content: '{green-fg}{bold}MISSION SUCCESS{/}\nCORE STABILIZED',
            style: { border: { fg: 'green' }, bg: 'black' }
        });
        screen.render();
        setTimeout(() => process.exit(0), 4000);
    }
}

screen.on('keypress', (ch, key) => {
    if (!gameActive) return;
    
    if (currentPhase === 0) {
        if (['a', 'left', 'd', 'right'].includes(key.name)) {
            playBeep();
            if (key.name === 'a' || key.name === 'left') barPos = Math.max(0, barPos - 7);
            if (key.name === 'd' || key.name === 'right') barPos = Math.min(98, barPos + 7);
        }
    } 
    else if (currentPhase === 1 && key.name === 'enter') {
        if (pulseVal >= (pulseTargetPos - 2) && pulseVal <= (pulseTargetPos + 13)) { 
            playBeep2();
            integrity = Math.min(100, integrity + 15); 
            mainBox.style.border.fg = 'white';
        } else { 
            playGameOverSound();
            integrity -= 12; 
            mainBox.style.border.fg = 'red';
        }
        pulseVal = 0;
        randomizePulseTarget();
        setTimeout(() => { if(gameActive) mainBox.style.border.fg = 'cyan'; }, 150);
    } 
    else if (currentPhase === 2 && ch) {
        if (ch.toUpperCase() === hackChar) { 
            playBeep2();
            integrity = Math.min(100, integrity + 8); 
            generateHack(); 
        } else { 
            playGameOverSound();
            integrity -= 10; 
        }
    }
});

screen.key(['escape', 'C-c'], () => { stopAudio(); process.exit(0); });
showBootSequence();